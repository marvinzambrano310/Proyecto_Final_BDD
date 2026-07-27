<?php

namespace App\Services;

use App\Models\Stock;
use App\Models\ProductCatalog;
use Illuminate\Support\Facades\Log;

class SyncService
{
    /**
     * Sincroniza el stock desde PostgreSQL hacia MongoDB.
     * Cumple con la regla de transformación SQL -> JSON.
     */
    public function syncStockToMongo($sku)
    {
        try {
            $itemSQL = Stock::where('sku', $sku)->first();

            if ($itemSQL) {
                ProductCatalog::where('sku', $sku)->update([
                    'stock_sincronizado' => $itemSQL->quantity_available
                ]);

                Log::info("Sincronización exitosa [PostgreSQL -> MongoDB] | SKU: {$sku} | Nuevo Stock: {$itemSQL->quantity_available}");
                
                return true;
            }
            return false;
        } catch (\Exception $e) {
            Log::error("Error en sincronización SKU {$sku}: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Sincroniza un nuevo producto desde MongoDB hacia PostgreSQL.
     * Cumple con la regla de transformación JSON -> SQL.
     */
    public function syncMongoToSql($sku)
    {
        try {
            $productoMongo = ProductCatalog::where('sku', $sku)->first();

            if ($productoMongo) {
                $inventario = Stock::updateOrCreate(
                    ['sku' => $productoMongo->sku],
                    ['quantity_available' => $productoMongo->stock_sincronizado ?? 0]
                );

                Log::info("Sincronización exitosa [MongoDB -> PostgreSQL] | SKU: {$sku}");
                
                return true;
            }
            return false;
        } catch (\Exception $e) {
            Log::error("Error en sincronización inversa SKU {$sku}: " . $e->getMessage());
            return false;
        }
    }
}