# Publicacion y despliegue en Netlify

## Repositorios

- Repositorio principal de trabajo: `https://github.com/Jonathan1992s/gesco`
- Repositorio que Netlify esta usando actualmente para publicar: `https://github.com/Panucho2/gesco-web`
- Rama de produccion: `main`

## Sitio publicado

- Dominio principal: `https://gescovirtual.com`
- Pagina revisada del test vocacional: `https://gescovirtual.com/test-vocacional/`
- Netlify muestra el sitio como: `gesco-campus`

## Flujo actual de publicacion

1. Hacer commit de los cambios en `main`.
2. Subir el commit al repositorio principal:

   ```bash
   git push origin main
   ```

3. Mientras Netlify siga conectado a `Panucho2/gesco-web`, subir tambien el mismo commit al remoto que usa Netlify:

   ```bash
   git push panucho main
   ```

4. En Netlify, si el deploy no se dispara solo, usar:

   ```txt
   Trigger deploy -> Clear cache and deploy site
   ```

5. Verificar que el deploy de produccion indique el commit esperado, por ejemplo:

   ```txt
   Production: main@<hash-del-commit>
   ```

## Nota importante

Netlify no estaba publicando desde `Jonathan1992s/gesco`; el log de deploy mostro que clonaba `Panucho2/gesco-web`.
Por eso, hasta corregir la configuracion de Netlify, los cambios deben subirse a ambos repositorios.

La solucion recomendada a futuro es reconectar Netlify directamente a `Jonathan1992s/gesco` para evitar mantener dos repositorios sincronizados.

## Configuracion local relevante

- El proyecto requiere Node `>=22.12.0`.
- `netlify.toml` define `NODE_VERSION = "22"`.
- En esta maquina se detecto Node `16.14.2`, por lo que algunas validaciones locales pueden fallar hasta actualizar Node.

## Ultimo despliegue confirmado durante esta revision

- Commit publicado en ambos repositorios: `3f1960c feat: improve vocational test landing flow`
- Motivo: mejoras de UI/UX del Test Vocacional CHASIDE y publicacion correcta en el repo usado por Netlify.
