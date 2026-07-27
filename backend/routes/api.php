<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\ProductController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::put('/inventario/{sku}', [InventoryController::class, 'update']);
Route::post('/productos', [ProductController::class, 'store']);
Route::get('/catalog', [ProductController::class, 'index']);
Route::delete('/productos/{sku}', [ProductController::class, 'destroy']);