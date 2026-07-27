<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    protected $table = "stock";
    protected $fillable = [
        "sku",
        "quantity_available",
    ];

    protected $primaryKey = 'sku';
    public $incrementing = false;
    protected $keyType = 'string';
}
