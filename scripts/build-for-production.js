const fs = require('fs');
const path = require('path');

// Crear el archivo environment.prod.ts para producción
const prodEnvironmentContent = `export const environment = {
  production: true,
  tmdbApiKey: '${process.env.TMDB_API_KEY || 'TU_API_KEY_AQUI'}',
  tmdbBaseUrl: '${process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3'}',
  tmdbImageBaseUrl: '${process.env.TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p'}',
  tmdbDefaultLanguage: '${process.env.TMDB_DEFAULT_LANGUAGE || 'es-ES'}'
};`;

// Crear el archivo environment.ts para desarrollo
const devEnvironmentContent = `export const environment = {
  production: false,
  tmdbApiKey: '${process.env.TMDB_API_KEY || 'TU_API_KEY_AQUI'}',
  tmdbBaseUrl: '${process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3'}',
  tmdbImageBaseUrl: '${process.env.TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p'}',
  tmdbDefaultLanguage: '${process.env.TMDB_DEFAULT_LANGUAGE || 'es-ES'}'
};`;

// Crear directorio si no existe
const envDir = path.join(__dirname, '../src/environments');
if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

// Escribir archivos
fs.writeFileSync(path.join(envDir, 'environment.ts'), devEnvironmentContent);
fs.writeFileSync(path.join(envDir, 'environment.prod.ts'), prodEnvironmentContent);

console.log('✅ Environment files created for production');
