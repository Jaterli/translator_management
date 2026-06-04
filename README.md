# Translator Management Application

Esta aplicación está diseñada para gestionar perfiles de traductores profesionales y permitir a los administradores (usuarios con `is_staff=True`) realizar consultas personalizadas y homologar combinaciones de idiomas sobre la base de datos de traductores.

El proyecto se divide en dos áreas principales con funcionalidades claramente diferenciadas:

1.  **Área de Traductores (Django completo):**
    - Los traductores se registran, inician sesión y mantienen actualizado su perfil profesional.
    - Gestión de datos personales, perfil profesional, combinaciones de idiomas (con precios por palabra, palabra jurada y por hora), y subida de archivos (CV y nota de voz).
    - Interfaz basada en templates de Django.

2.  **Área de Administradores (Django + React):**
    - Exclusiva para usuarios con `is_staff=True` (personal del sistema).
    - Django proporciona una API REST y gestiona el almacenamiento de consultas.
    - React ofrece una interfaz moderna para que los administradores creen, guarden, ejecuten consultas personalizadas y homologuen combinaciones de idiomas.
    - El sistema de consultas es fácilmente adaptable para funcionar sobre cualquier otro modelo de datos.

---

## Estructura del Proyecto

```
/translator_management         # Carpeta raíz del proyecto
  /backend                     # Backend desarrollado con Django
    /config                    # Configuración principal del proyecto Django
      /settings.py             # Archivo de configuración
      /urls.py                 # URLs principales
      /...
    /translators               # Aplicación de gestión de traductores (templates de Django)
      /templates               # Plantillas HTML de la interfaz de traductores
      /static                  # Archivos estáticos (CSS, JS, imágenes)
      /views                   # Vistas Django (registro, login, CRUD de perfiles)
      /models                  # Modelos: Translator, ProfessionalProfile, LanguageCombination, Files, etc.
      /...
    /queries                   # Aplicación para consultas personalizadas (API)
      /views                   # Vistas API: execute, save, list, delete queries, homologaciones, etc.
      /models                  # Modelo SavedQuery para almacenar consultas
      /...
    /manage.py                 # Script de gestión de Django
  /frontend                    # Frontend React para el panel de administración
    /src
      /components              # Componentes de React reutilizables
      /pages                   # Páginas principales: Dashboard, QueryBuilder, etc.
      /services                # Lógica de llamadas a la API (autenticación, consultas, homologaciones)
      /...
    /public
      /index.html              # Plantilla HTML principal
      /...
    /package.json              # Dependencias de React
    /...
```

---

## Características Principales

### Área de Traductores (Django)

**Funcionalidades disponibles para los traductores:**

- **Registro y autenticación**: Creación de cuenta con email y contraseña, inicio de sesión y cierre de sesión.
- **Gestión de datos personales**: Edición de nombre, apellidos, dirección, provincia, país, teléfono, fecha de nacimiento, etc.
- **Perfil profesional**:
  - Lenguas nativas.
  - Nivel de educación y titulación.
  - Situación laboral y años de experiencia.
  - Softwares que domina.
- **Combinaciones de idiomas** (punto clave para traductores):
  - Creación, edición y eliminación de pares de idiomas (origen → destino).
  - Configuración de servicios ofrecidos.
  - Tipos de texto que maneja.
  - Precios: por palabra, por palabra jurada y por hora.
  - Validación para evitar duplicados (mismo traductor, mismo par de idiomas).
- **Gestión de archivos**:
  - Subida de currículum (formatos: PDF, DOC, DOCX).
  - Subida de nota de voz (formatos: MP3, WAV, MPEG) útil para intérpretes o dobladores.
  - Validación de tipo y tamaño máximo (5 MB por archivo).
  - Posibilidad de eliminar los archivos subidos.
- **Cambio de contraseña**.
- **Eliminación de cuenta** (baja definitiva).
- **Frontend**: Interfaz sencilla y directa basada en templates de Django con Bootstrap.

### Área de Administradores (Django + React)

**Requisito de acceso**: Solo usuarios con `is_staff=True` (personal del sistema) pueden acceder a esta área.

**Funcionalidades disponibles para administradores:**

- **Autenticación JWT**: Los administradores se autentican mediante tokens JWT para consumir la API.
- **Dashboard de estadísticas**:
  - Total de traductores registrados.
  - Traductores activos.
  - Total de combinaciones de idiomas en el sistema.
  - Ranking de los pares de idiomas más populares (los que más traductores tienen).
- **Constructor de consultas visual**:
  - Selección del modelo sobre el que consultar (Translator, ProfessionalProfile, LanguageCombination).
  - Selección de campo, operador (=, !=, LIKE, NOT LIKE, >, <, >=, <=, IN, NOT IN, IS NULL, IS NOT NULL) y valor.
  - Combinación de múltiples condiciones con operadores lógicos AND/OR.
  - Vista previa de la consulta construida.
- **Gestión de consultas guardadas**:
  - Guardado de consultas con un nombre único (no se permiten nombres duplicados).
  - Listado de todas las consultas guardadas con fecha de creación.
  - Ejecución de consultas guardadas para obtener resultados en tiempo real.
  - Eliminación de consultas guardadas.
- **Homologación de combinaciones de idiomas**:
  - Los administradores pueden homologar (aprobar) combinaciones de idiomas de los traductores.
  - Registro de quién homologó, cuándo y notas adicionales.
  - Posibilidad de deshomologar combinaciones previamente aprobadas.
  - Listado de combinaciones homologadas con filtros por traductor o por par de idiomas.
  - Obtención de idiomas disponibles (origen/destino) a partir de las combinaciones homologadas.
- **Visualización de resultados**:
  - Los resultados de las consultas se muestran de forma estructurada, incluyendo datos del traductor, su perfil profesional y sus combinaciones de idiomas.
  - Preparado para futura exportación a Excel.

**Escalabilidad del sistema de consultas:**
- El sistema obtiene dinámicamente los campos disponibles de cada modelo mediante `GetModelFieldsView`.
- Para adaptar las consultas a otros modelos diferentes (ej. Proveedores, Clientes, Alumnos), solo es necesario modificar la lista de modelos en esta vista.
- La arquitectura basada en metadatos permite añadir nuevos modelos sin cambios en el frontend.

---

## Modelos de Datos Principales

### Translators App

- **`Translator`** (usuario personalizado):
  - Hereda de `AbstractBaseUser` y `PermissionsMixin`.
  - Identificador único: `email`.
  - Campos: `first_name`, `last_name`, `address`, `postal_code`, `province`, `country`, `gender`, `mobile_phone`, `birth_date`, `registration_date`, `last_access`, `is_active`, `is_staff`.
  - Gestor personalizado `TranslatorManager`.

- **`ProfessionalProfile`** (relación uno a uno con Translator):
  - `native_languages`, `education`, `degree`, `employment_status`, `experience`, `softwares`.
  - Se crea automáticamente mediante una señal `post_save` al registrar un traductor.

- **`LanguageCombination`** (relación muchos a uno con Translator):
  - `source_language`, `target_language` (basados en la constante `LANGUAGES`).
  - `services`, `text_types`.
  - `price_per_word`, `sworn_price_per_word`, `price_per_hour`.
  - Restricción de unicidad: un traductor no puede tener dos veces el mismo par de idiomas.

- **`Files`** (relación uno a uno con Translator):
  - `cv_file` (obligatorio), `voice_note` (opcional).
  - Validaciones personalizadas de tipo MIME y tamaño máximo (5 MB).
  - Rutas de almacenamiento dinámicas por ID de traductor.

### Queries App

- **`SavedQuery`**:
  - `name`: Nombre descriptivo de la consulta (único).
  - `query`: JSON que almacena los filtros/criterios de la consulta.
  - `created_at`, `updated_at`: Fechas automáticas.

- **`LanguageCombinationApproval`** (homologaciones):
  - `superuser`: Usuario administrador que homologa (solo `is_superuser=True`).
  - `translator`: Traductor al que se homologa la combinación.
  - `language_combination`: Combinación de idiomas homologada.
  - `approved_at`, `is_approved`, `notes`.
  - Restricción `unique_together`: un mismo administrador no puede homologar dos veces la misma combinación para el mismo traductor.

---

## Instalación y Configuración

### Requisitos

- Python 3.8+
- Node.js 14+
- Django 4.0+
- React 17+
- TypeScript 4.0+

### Pasos para la Instalación

1.  Clona el repositorio:

    ```bash
    git clone https://github.com/tu-usuario/translator_management.git
    cd translator_management
    ```

2.  Configura el entorno virtual para Django:

    ```bash
    python -m venv venv
    source venv/bin/activate  # En Windows: venv\Scripts\activate
    ```

3.  Instala las dependencias de Django:

    ```bash
    cd backend
    pip install -r requirements.txt
    ```

4.  Configura la base de datos y las variables de entorno en `backend/config/settings.py`.

5.  Aplica las migraciones:

    ```bash
    python manage.py migrate
    ```

6.  Crea un superusuario (administrador con `is_staff=True` e `is_superuser=True`):

    ```bash
    python manage.py createsuperuser
    ```

7.  Inicia el servidor de Django:

    ```bash
    python manage.py runserver
    ```

8.  Configura el frontend de React:

    ```bash
    cd ../frontend
    npm install
    ```

9.  Inicia el servidor de desarrollo de React:

    ```bash
    npm run dev
    ```

---

## Uso de la Aplicación

### Para Traductores

- Accede a la interfaz de traductores en `http://localhost:8000`.
- Regístrate con tu email y datos básicos.
- Una vez registrado, inicia sesión para acceder a tu panel.
- Desde el panel podrás:
  - Editar tus datos personales.
  - Completar tu perfil profesional (educación, experiencia, softwares, etc.).
  - Añadir, editar o eliminar tus combinaciones de idiomas y tarifas.
  - Subir tu CV y nota de voz.
  - Cambiar tu contraseña.
  - Dar de baja tu cuenta.

### Para Administradores (usuarios con `is_staff=True`)

- Accede a la interfaz de administración en `http://localhost:3000`.
- Inicia sesión con las credenciales de un usuario que tenga `is_staff=True`.
- Una vez autenticado, podrás:
  - Ver el dashboard con estadísticas globales (total de traductores, combinaciones, pares más populares).
  - Crear nuevas consultas seleccionando modelos, campos y operadores.
  - Guardar, editar, ejecutar y eliminar consultas personalizadas.
  - Homologar o deshomologar combinaciones de idiomas de los traductores.
  - Consultar el listado de combinaciones ya homologadas, con filtros por traductor o par de idiomas.

---

## Personalización y Escalabilidad

La aplicación está diseñada para ser fácilmente adaptable a otras necesidades empresariales:

- **Gestión de otros colectivos**: El sistema de consultas y el modelo de datos pueden adaptarse para gestionar proveedores, clientes, alumnos, personal interno, etc. Solo es necesario modificar los modelos y ajustar el `GetModelFieldsView`.
- **Nuevos tipos de homologación**: El patrón utilizado en `LanguageCombinationApproval` puede replicarse para cualquier otra entidad que requiera ser validada por un administrador.
- **Ampliación de estadísticas**: El `DashboardStatsView` es modular y pueden añadirse nuevas métricas fácilmente.
- **Personalización visual**: Tanto los templates de Django como el frontend React pueden adaptarse a la imagen corporativa de la empresa.

---

## Tecnologías Utilizadas

- **Backend**: Django, Django REST Framework, Simple JWT, SQLite/PostgreSQL.
- **Frontend (Administradores)**: React, TypeScript, React Bootstrap, Axios, FontAwesome.
- **Frontend (Traductores)**: Django Templates, Bootstrap, JavaScript vanilla.

---

## Contribución

Si deseas contribuir a este proyecto, sigue estos pasos:

1.  Haz un fork del repositorio.
2.  Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3.  Realiza tus cambios y haz commit (`git commit -am 'Añade nueva funcionalidad'`).
4.  Haz push a la rama (`git push origin feature/nueva-funcionalidad`).
5.  Abre un Pull Request.

---

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.

---

## Contacto

Si tienes alguna pregunta o sugerencia, no dudes en contactarme a través de mi perfil de GitHub o por correo electrónico (admin@jaterli.com).