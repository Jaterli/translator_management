# Translator Management Application

Esta aplicación está diseñada para gestionar perfiles de traductores profesionales y permitir a los administradores realizar consultas personalizadas sobre la base de datos de traductores.

El proyecto se divide en dos áreas principales:

1. **Gestión de traductores (Django completo)**

   * Backend + frontend construidos con Django y sus templates.
   * Los traductores pueden registrarse, iniciar sesión y mantener actualizado su perfil profesional.

2. **Administración de consultas (Django + React)**

   * Django proporciona la API y gestiona el almacenamiento de consultas.
   * React ofrece una interfaz moderna para que los administradores creen, editen, eliminen y ejecuten consultas personalizadas sobre los traductores registrados.
   * Aunque está orientado a la base de datos de traductores, es fácilmente adaptable para realizar consultas sobre cualquier otra base de datos.

---

## Estructura del Proyecto

```
/translator_management         # Carpeta raíz del proyecto
  /django-backend              # Backend desarrollado con Django
    /config                    # Configuración principal del proyecto Django
      /settings.py             # Archivo de configuración
      /urls.py                 # URLs principales
      /...
    /translators               # Aplicación de gestión de traductores (templates de Django)
      /templates               # Plantillas HTML de la interfaz de traductores
      /static                  # Archivos estáticos (CSS, JS, imágenes)
      /views                   # Vistas Django
      /models                  # Modelos de traductores
      /...
    /queries                   # Aplicación para consultas personalizadas
      /views                   # Vistas / API de consultas
      /models                  # Modelos de almacenamiento de consultas
      /...
    /manage.py                 # Script de gestión de Django
  /react-frontend              # Frontend React para administración de consultas
    /src                       # Código fuente de React
      /components              # Componentes de React
      /pages                   # Páginas de React
      /services                # Lógica de llamadas a la API
      /...
    /public                    # Archivos públicos de React
      /index.html              # Plantilla HTML principal
      /...
    /package.json              # Dependencias de React
    /...
```

---

## Características Principales

### Área de Traductores (Django)

* **Gestión de perfiles**:

  * Registro, inicio de sesión y autenticación de traductores.
  * Creación y actualización de perfiles profesionales.
  * Subida de currículum y notas de voz.
  * Gestión de combinaciones de idiomas y tarifas.
* **Frontend basado en templates de Django**:

  * Interfaz sencilla y directa, integrada con el backend.

### Área de Administración (Django + React)

* **Consultas personalizadas**:

  * Creación, guardado, edición y eliminación de consultas SQL personalizadas.
  * Ejecución de consultas sobre los traductores registrados.
  * Exportación de resultados a Excel.
  * Validación de operadores y tipos de datos según el modelo.
* **Escalabilidad**:

  * Aunque las consultas se ejecutan sobre la base de datos de traductores, la arquitectura permite adaptarse a cualquier base de datos.
* **Autenticación**:

  * Seguridad mediante JWT para usuarios administradores.

---

## Instalación y Configuración

### Requisitos

* Python 3.8+
* Node.js 14+
* Django 4.0+
* React 17+
* TypeScript 4.0+

### Pasos para la Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/translator_management.git
   cd translator_management
   ```

2. Configura el entorno virtual para Django:

   ```bash
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   ```

3. Instala las dependencias de Django:

   ```bash
   cd django-backend
   pip install -r requirements.txt
   ```

4. Configura la base de datos y las variables de entorno en `django-backend/config/settings.py`.

5. Aplica las migraciones:

   ```bash
   python manage.py migrate
   ```

6. Inicia el servidor de Django:

   ```bash
   python manage.py runserver
   ```

7. Configura el frontend de React:

   ```bash
   cd ../react-frontend
   npm install
   ```

8. Inicia el servidor de desarrollo de React:

   ```bash
   npm run dev
   ```

---

## Uso de la Aplicación

### Para Traductores

* Accede a la interfaz de traductores en `http://localhost:8000`.
* Regístrate o inicia sesión para gestionar tu perfil.

### Para Administradores

* Accede a la interfaz de administración en `http://localhost:3000`.
* Inicia sesión con tus credenciales de administrador.
* Crea, guarda, edita y ejecuta consultas personalizadas sobre la base de datos de traductores.
* Descarga resultados en Excel si lo necesitas.

---

## Escalabilidad y Personalización

La aplicación está diseñada para ser escalable y adaptable:

* **Cambio de base de datos**: La capa de consultas puede adaptarse fácilmente para trabajar con otras bases de datos y no solo con traductores.
* **Personalización de la interfaz**: La parte de Django (templates) y el frontend React pueden adaptarse a la imagen corporativa de la empresa.

---

## Contribución

Si deseas contribuir a este proyecto, sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -am 'Añade nueva funcionalidad'`).
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

---

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.

---

## Contacto

Si tienes alguna pregunta o sugerencia, no dudes en contactarme a través de mi perfil de GitHub o por correo electrónico (admin@jaterli.com).

