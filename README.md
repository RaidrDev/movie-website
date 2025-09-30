# Películas - Web de Películas

Una web sencilla hecha con Angular para ver películas usando la API de The Movie Database.

## ¿Qué hace?

- Muestra películas populares
- Puedes buscar películas
- Ves detalles de cada película
- Funciona en móvil y ordenador

## Cómo empezar

### 1. Conseguir la API Key

Necesitas una clave de la API de TMDB:

1. Ve a [themoviedb.org](https://www.themoviedb.org/)
2. Regístrate gratis
3. Ve a **Settings** > **API**
4. Pide una API key
5. Copia tu clave

### 2. Configurar la clave

Edita el archivo `src/environments/environment.ts` y cambia `TU_API_KEY_AQUI` por tu clave real:

```typescript
export const environment = {
  production: false,
  tmdbApiKey: 'tu_clave_aqui',
  tmdbBaseUrl: 'https://api.themoviedb.org/3',
  tmdbImageBaseUrl: 'https://image.tmdb.org/t/p',
  tmdbDefaultLanguage: 'es-ES'
};
```

### 3. Instalar y ejecutar

```bash
npm install
npm start
```

Ya está. Abre `http://localhost:4200` en el navegador.

## Cómo está hecho

### Estructura básica

```
src/app/
├── components/
│   ├── movie-list/          # Lista de películas
│   ├── movie-detail/        # Detalle de película
│   └── autocomplete-suggestions/  # Sugerencias de búsqueda
├── services/
│   ├── movie-api.service.ts # Llama a la API
│   ├── movie-state.service.ts # Guarda el estado
│   └── movie.service.ts     # Orquesta todo
└── models/
    └── movie.interface.ts   # Tipos de datos
```

### Servicios

- **MovieApiService**: Se encarga de llamar a la API de TMDB
- **MovieStateService**: Guarda el estado de la aplicación (películas, carga, errores)
- **MovieService**: Facilita el uso de los otros servicios
- **AutocompleteService**: Maneja las sugerencias de búsqueda

### Componentes

- **MovieListComponent**: Muestra la lista de películas y el buscador
- **MovieDetailComponent**: Muestra los detalles de una película
- **AutocompleteSuggestionsComponent**: Muestra sugerencias al buscar

## Funcionalidades

### Lista de películas
- Carga películas populares automáticamente
- Buscador con sugerencias
- Paginación
- Estados de carga y error
- Diseño responsive

### Detalle de película
- Información completa
- Imagen de fondo
- Calificación con colores
- Datos técnicos (duración, presupuesto, etc.)
- Productoras

## Tecnologías

- Angular 20
- TypeScript
- RxJS para programación reactiva
- CSS con variables
- API de The Movie Database

## Scripts

- `npm start` - Ejecuta en desarrollo
- `npm run build` - Construye para producción
- `npm run build:prod` - Construye optimizado para producción
- `npm test` - Ejecuta tests

## Notas

- Los archivos de configuración (`environment.ts`) están en `.gitignore` para no subir claves al repositorio
- Usa lazy loading para cargar componentes solo cuando se necesitan
- Manejo de errores y estados de carga
- Diseño responsive con CSS Grid y Flexbox