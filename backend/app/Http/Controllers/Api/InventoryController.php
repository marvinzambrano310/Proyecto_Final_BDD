<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Inventario;
use App\Models\Stock;
use App\Services\SyncService;

class InventoryController extends Controller
{
    protected $syncService;

    public function __construct(SyncService $syncService)
    {
        $this->syncService = $syncService;
    }

    public function update(Request $request, $sku)
    {
        $request->validate([
            'cantidad' => 'required|integer|min:0'
        ]);

        $inventario = Stock::firstOrCreate(
            ['sku' => $sku],
            ['quantity_available' => 0]
        );
        
        $inventario->quantity_available = $request->cantidad;
        $inventario->save();

        $sincronizado = $this->syncService->syncStockToMongo($sku);

        return response()->json([
            'mensaje' => 'Inventario actualizado correctamente',
            'datos_sql' => $inventario,
            'sincronizado_mongodb' => $sincronizado
        ], 200);
    }
}