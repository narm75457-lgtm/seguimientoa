
# 🎓 SIAE - Universidad Fray Diego

Sistema Inteligente de Administración Escolar listo para producción.

## 🚀 Despliegue Rápido (Recomendado: Vercel)

1. **Subir a GitHub**: Crea un repositorio y sube todos estos archivos.
2. **Conectar a Vercel**: 
   - Ve a [Vercel](https://vercel.com).
   - Haz clic en "Add New" > "Project".
   - Importa tu repositorio de GitHub.
3. **Configurar Variable de Entorno**:
   - En el paso "Environment Variables", añade una nueva:
     - **Key**: `API_KEY`
     - **Value**: (Tu API Key de Google Gemini)
4. **Desplegar**: Haz clic en "Deploy". ¡Listo! Tu universidad ya está en la web.

## 🛠️ Desarrollo Local

Si quieres trabajar en tu computadora:

```bash
# Instalar dependencias
npm install

# Correr en modo desarrollo
npm run dev
```

## 📊 Arquitectura de Datos
La plataforma utiliza un estado global centralizado en `App.tsx` que se sincroniza con `localStorage`. Para una base de datos masiva (más de 1000 alumnos), se recomienda integrar un Backend con **Firebase** o **Supabase** reemplazando las funciones de guardado en `App.tsx`.
