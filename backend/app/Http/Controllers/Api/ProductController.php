<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductCatalog;
use Illuminate\Http\Request;
use App\Models\ProductoCatalogo;
use App\Models\Stock;
use App\Services\SyncService;

class ProductController extends Controller
{
    protected $syncService;

    public function __construct(SyncService $syncService)
    {
        $this->syncService = $syncService;
    }

    /**
     * Obtiene el catálogo de MongoDB y el inventario de PostgreSQL
     * para el Dashboard comparativo.
     */
    public function index()
    {
        $catalogoMongo = ProductCatalog::all();
        $inventarioSql = Stock::all()->keyBy('sku');

        $datosCombinados = $catalogoMongo->map(function ($producto) use ($inventarioSql) {
            $sqlItem = $inventarioSql->get($producto->sku);
            
            return [
                'sku' => $producto->sku,
                'nombre' => $producto->nombre,
                'stock_mongo' => $producto->stock_sincronizado,
                'stock_postgres' => $sqlItem ? $sqlItem->quantity_available : 'No existe',
                'estado_sincronizacion' => ($sqlItem && $sqlItem->quantity_available === $producto->stock_sincronizado) ? 'Sincronizado 🟢' : 'Desfasado 🔴'
            ];
        });

        return response()->json($datosCombinados);
    }

    public function store(Request $request)
    {
        $request->validate([
            'sku' => 'required|string|unique:mongodb.catalogo_productos,sku',
            'nombre' => 'required|string',
            'precio_base' => 'required|numeric',
            'stock_inicial' => 'required|integer|min:0'
        ]);

        $producto = ProductCatalog::create([
            'sku' => $request->sku,
            'nombre' => $request->nombre,
            'precio_base' => $request->precio_base,
            'stock_sincronizado' => $request->stock_inicial,
            'estado' => 'activo',
            'variantes' => [],
            'resenas' => []
        ]);

        $sincronizado = $this->syncService->syncMongoToSql($request->sku);

        return response()->json([
            'mensaje' => 'Producto creado en el catálogo NoSQL',
            'datos_nosql' => $producto,
            'sincronizado_postgresql' => $sincronizado
        ], 201);
    }

    public function destroy($sku)
    {
        ProductCatalog::where('sku', $sku)->delete();

        Stock::where('sku', $sku)->delete();

        return response()->json([
            'mensaje' => 'Producto eliminado correctamente de ambos motores'
        ], 200);
    }
}