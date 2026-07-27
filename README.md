# 🛒 E-Commerce Distribuido: Persistencia entre (SQL + NoSQL)

Este proyecto implementa una arquitectura de Bases de Datos Distribuidas para una plataforma de comercio electrónico. Resuelve el problema de la impedancia estructural y la redundancia de datos mediante la **sincronización bidireccional en tiempo real** entre un motor relacional (PostgreSQL) y un motor no relacional (MongoDB).

---

## 🚀 Tecnologías Utilizadas

**Backend (API RESTful):**
* PHP 8.2+
* Laravel 12
* Eloquent ORM & MongoDB PHP Driver (`mongodb/laravel-mongodb`)

**Frontend (Client-Side):**
* React 18 (construido con Vite)
* Tailwind CSS v4 (Estilización)
* Axios (Peticiones HTTP)
* SweetAlert2 (Gestión de alertas de UI)

**Motores de Bases de Datos:**
* **PostgreSQL:** Gestión transaccional y control de stock estricto (ACID).
* **MongoDB:** Gestión de catálogo dinámico, atributos flexibles y subdocumentos embebidos.

---

# ⚙️ Requisitos Previos
Asegúrate de tener instalados los siguientes componentes en tu entorno local antes de iniciar:
 * Node.js (v18 o superior)
 * PHP (v8.2 o superior)
 * Composer
 * Servidor PostgreSQL corriendo localmente o en la nube.
 * Servidor MongoDB corriendo localmente o en la nube.
 
# 🛠️ Instrucciones de Instalación y Despliegue
1. Configuración de Bases de Datos
 * Dentro de la carpeta database_scripts/ encontrarás los archivos necesarios para inicializar los datos:
 * Ejecuta el script Script-PostgreSQL.sql en tu gestor de PostgreSQL para crear las tablas relacionales.
 * Importa el archivo Script_MongoDB.js en tu colección catalogo_productos usando MongoDB Compass.

2. Despliegue del Backend (Laravel)
Abre una terminal, navega a la carpeta del backend y sigue estos pasos:
    2.1. Entrar a la carpeta
   - cd backend
 2.2. Instalar dependencias de PHP
   - composer install
 2.3. Crear archivo de variables de entorno
   - cp .env.example .env
 2.4. Generar la llave de la aplicación
   - php artisan key:generate
 2.5. Configuración del .env:
   Abre el archivo .env recién creado en el backend y configura las conexiones a ambas bases de datos:
   * Configuración PostgreSQL
     DB_CONNECTION=pgsql <br>
     DB_HOST=127.0.0.1 <br>
     DB_PORT=5432 <br>
     DB_DATABASE=tu_base_de_datos <br>
     DB_USERNAME=tu_usuario <br>
     DB_PASSWORD=tu_contraseña <br>

   * Configuración MongoDB
     MONGODB_CONNECTION=mongodb <br>
     MONGODB_URI="mongodb://localhost:27017" <br>
     MONGODB_DATABASE="catalogo_nosql" <br>
 2.6. Inicar el Backend
   - php artisan serve
   - La aplicación correrá en http://localhost:8000

4. Despliegue del Frontend (React)
Abre una nueva terminal, navega a la carpeta del frontend y ejecuta:
 3.1. Entrar a la carpeta
   - cd frontend
 3.2. Instalar dependencias de Node.js
   - npm install
 3.3. Levantar el servidor de desarrollo
   - npm run dev
   - La aplicación correrá en http://localhost:5173

