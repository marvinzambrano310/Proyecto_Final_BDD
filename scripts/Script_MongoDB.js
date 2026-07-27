/*
 Navicat Premium Data Transfer

 Source Server         : MONGO
 Source Server Type    : MongoDB
 Source Server Version : 80301 (8.3.1)
 Source Host           : localhost:27017
 Source Schema         : tienda_catalogo

 Target Server Type    : MongoDB
 Target Server Version : 80301 (8.3.1)
 File Encoding         : 65001

 Date: 26/07/2026 22:26:32
*/


// ----------------------------
// Collection structure for product_catalogs
// ----------------------------
db.getCollection("product_catalogs").drop();
db.createCollection("product_catalogs");

// ----------------------------
// Documents of product_catalogs
// ----------------------------
db.getCollection("product_catalogs").insert([ {
    _id: ObjectId("6a664ac080a961152c0d9a22"),
    sku: "TSHIRT-LARAVEL-01",
    nombre: "Camiseta Laravel Oficial",
    descripcion: "Camiseta de algodón 100% con logo bordado.",
    precio_base: 29.99,
    stock_sincronizado: NumberInt("147"),
    estado: "activo",
    variantes: [
        {
            talla: "M",
            color: "Negro",
            sku_variante: "TSHIRT-LARAVEL-01-M-BLK"
        },
        {
            talla: "L",
            color: "Negro",
            sku_variante: "TSHIRT-LARAVEL-01-L-BLK"
        }
    ],
    resenas: [
        {
            usuario_id: NumberInt("1"),
            calificacion: NumberInt("5"),
            comentario: "Excelente calidad.",
            fecha: ISODate("2026-07-26T17:58:24.249Z")
        }
    ],
    updated_at: ISODate("2026-07-27T02:33:05.799Z"),
    created_at: ISODate("2026-07-26T17:58:24.249Z")
} ]);
db.getCollection("product_catalogs").insert([ {
    _id: ObjectId("6a664dd2fd86775bdd0d30a2"),
    sku: "MUG-LARAVEL-02",
    nombre: "Taza de Cerámica Laravel",
    precio_base: 12.5,
    stock_sincronizado: NumberInt("28"),
    estado: "activo",
    variantes: [ ],
    resenas: [ ],
    updated_at: ISODate("2026-07-27T02:33:02.367Z"),
    created_at: ISODate("2026-07-26T18:11:30.7Z")
} ]);
db.getCollection("product_catalogs").insert([ {
    _id: ObjectId("6a667561fd86775bdd0d30a3"),
    sku: "CAP1",
    nombre: "Manta",
    precio_base: "2",
    stock_sincronizado: NumberInt("9"),
    estado: "activo",
    variantes: [ ],
    resenas: [ ],
    updated_at: ISODate("2026-07-27T02:30:42.167Z"),
    created_at: ISODate("2026-07-26T21:00:17.605Z")
} ]);
db.getCollection("product_catalogs").insert([ {
    _id: ObjectId("6a66c222fd86775bdd0d30a4"),
    sku: "CAP2",
    nombre: "Individual",
    precio_base: "3",
    stock_sincronizado: NumberInt("25"),
    estado: "activo",
    variantes: [ ],
    resenas: [ ],
    updated_at: ISODate("2026-07-27T02:33:23.94Z"),
    created_at: ISODate("2026-07-27T02:27:46.62Z")
} ]);
db.getCollection("product_catalogs").insert([ {
    _id: ObjectId("6a66c276fd86775bdd0d30a5"),
    sku: "CAP3",
    nombre: "Cerveza",
    precio_base: "3",
    stock_sincronizado: NumberInt("18"),
    estado: "activo",
    variantes: [ ],
    resenas: [ ],
    updated_at: ISODate("2026-07-27T02:33:13.318Z"),
    created_at: ISODate("2026-07-27T02:29:10.362Z")
} ]);
