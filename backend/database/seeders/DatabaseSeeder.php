<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Inventario;
use App\Models\ProductCatalog;
use App\Models\ProductoCatalogo;
use App\Models\Stock;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        Stock::truncate();
        ProductCatalog::truncate();

        ProductCatalog::create([
            'sku' => 'TSHIRT-LARAVEL-01',
            'nombre' => 'Camiseta Laravel Oficial',
            'descripcion' => 'Camiseta de algodón 100% con logo bordado.',
            'precio_base' => 29.99,
            'stock_sincronizado' => 150,
            'estado' => 'activo',
            'variantes' => [
                ['talla' => 'M', 'color' => 'Negro', 'sku_variante' => 'TSHIRT-LARAVEL-01-M-BLK'],
                ['talla' => 'L', 'color' => 'Negro', 'sku_variante' => 'TSHIRT-LARAVEL-01-L-BLK']
            ],
            'resenas' => [
                ['usuario_id' => 1, 'calificacion' => 5, 'comentario' => 'Excelente calidad.', 'fecha' => now()]
            ]
        ]);

        Stock::create([
            'sku' => 'TSHIRT-LARAVEL-01',
            'quantity_available' => 150
        ]);

        $this->command->info('¡Datos de prueba sembrados en PostgreSQL y MongoDB con éxito!');
    }
}