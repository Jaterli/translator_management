# Translator Management Application

Esta aplicación está diseñada para gestionar perfiles de traductores profesionales y permitir a los administradores realizar consultas personalizadas sobre la base de datos de traductores. El proyecto está dividido en dos partes principales:

1. **Backend con Django**: Gestiona los perfiles de los traductores y proporciona una API para consultas personalizadas.
2. **Frontend con React**: Permite a los administradores realizar consultas personalizadas y gestionar colaboraciones.

---

## Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

```
/translator_management         # Carpeta raíz del proyecto
  /django-backend              # Backend desarrollado con Django
    /config                    # Configuración principal del proyecto Django
      /settings.py             # Archivo de configuración
      /urls.py                 # URLs principales
      /...
    /translators               # Aplicación de gestión de traductores
      /templates               # Plantillas HTML para la interfaz de traductores
      /static                  # Archivos estáticos (CSS, JS, imágenes)
      /views                   # Vistas de Django para traductores
      /models                  # Modelos de traductores
      /...
    /queries                   # Aplicación de consultas personalizadas
      /views                   # Vistas de la API para consultas
      /models                  # Modelos relacionados con las consultas
      /...
    /manage.py                 # Script de gestión de Django
  /react-frontend              # Frontend desarrollado con React para administradores
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

### Backend (Django)
- **Gestión de Traductores**:
  - Registro y autenticación de traductores.
  - Creación y actualización de perfiles profesionales.
  - Subida de currículum y notas de voz.
  - Gestión de combinaciones de idiomas.
- **API para Consultas**:
  - Consultas personalizadas para filtrar traductores según criterios específicos.
  - Exportación de resultados a Excel.
  - Autenticación JWT para usuarios administradores.

### Frontend (React)
- **Interfaz para Administradores**:
  - Creación, guardado y ejecución de consultas personalizadas.
  - Visualización detallada de perfiles de traductores.
  - Exportación de resultados a Excel.
  - Autenticación mediante JWT.

---

## Instalación y Configuración

### Requisitos
- Python 3.8+
- Node.js 14+
- Django 4.0+
- React 17+
- TypeScript 4.0+

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
- Accede a la interfaz de traductores en `http://localhost:8000`.
- Regístrate o inicia sesión para gestionar tu perfil.

### Para Administradores
- Accede a la interfaz de administradores en `http://localhost:3000`.
- Inicia sesión con tus credenciales de administrador.
- Realiza consultas personalizadas y gestiona colaboraciones.

---

## Escalabilidad y Personalización
La aplicación está diseñada para ser escalable y adaptable:
- **Cambio de Base de Datos**: Puede modificarse fácilmente para gestionar otros tipos de profesionales o clientes.
- **Personalización de la Interfaz**: Los colores y el logotipo pueden ajustarse a los colores corporativos de la empresa.

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
Si tienes alguna pregunta o sugerencia, no dudes en contactarme a través de mi perfil de GitHub o por correo electrónico.

---

¡Gracias por revisar mi proyecto! Espero que esta aplicación sea útil para la gestión de traductores y consultas personalizadas. 😊