<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class ProductCatalog extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'product_catalog';
    protected $fillable = [
        'sku', 
        'nombre', 
        'precio_base', 
        'stock_sincronizado', 
        'estado', 
        'variantes', 
        'resenas'
    ];
}
