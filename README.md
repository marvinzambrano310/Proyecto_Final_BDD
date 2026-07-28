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

## ⚙️ Requisitos Previos

Asegúrate de tener instalados los siguientes componentes en tu entorno local antes de iniciar:

* **Node.js** (v18 o superior)
* **PHP** (v8.2 o superior)
* **Composer**
* Servidor **PostgreSQL** corriendo localmente o en la nube.
* Servidor **MongoDB** corriendo localmente o en la nube.

---

## 🛠️ Instrucciones de Instalación y Despliegue

### 1. Configuración de Bases de Datos
Dentro de la carpeta `database_scripts/` encontrarás los archivos necesarios para inicializar los datos:
* Ejecuta el script `Script-PostgreSQL.sql` en tu gestor de PostgreSQL para crear las tablas relacionales.
* Importa el archivo `Script_MongoDB.js` en tu colección `catalogo_productos` usando MongoDB Compass.

### 2. Despliegue del Backend (Laravel)
Abre una terminal, navega a la carpeta del backend y sigue estos pasos:

**2.1. Entrar a la carpeta:**
```bash
cd backend

```

**2.2. Instalar dependencias de PHP:**

```bash
composer install

```

**2.3. Crear archivo de variables de entorno:**

```bash
cp .env.example .env

```

**2.4. Generar la llave de la aplicación:**

```bash
php artisan key:generate

```

**2.5. Configurar la base de datos:**
Abre el archivo `.env` recién creado en el backend y configura las conexiones a ambas bases de datos:

```env
# Configuración PostgreSQL
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=tu_base_de_datos
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña

# Configuración MongoDB
MONGODB_CONNECTION=mongodb
MONGODB_URI="mongodb://localhost:27017"
MONGODB_DATABASE="catalogo_nosql"

```

**2.6. Iniciar el Backend:**

```bash
php artisan serve

```

> La API quedará corriendo en: `http://localhost:8000`

### 3. Despliegue del Frontend (React)

Abre una **nueva terminal**, navega a la carpeta del frontend y ejecuta los siguientes comandos:

**3.1. Entrar a la carpeta:**

```bash
cd frontend

```

**3.2. Instalar dependencias de Node.js:**

```bash
npm install

```

**3.3. Levantar el servidor de desarrollo:**

```bash
npm run dev

```
> La interfaz gráfica correrá en: `http://localhost:5173`
