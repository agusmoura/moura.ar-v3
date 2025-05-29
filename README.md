# 🚀 Moura.ar v3

Sitio web personal desarrollado con **Astro v5** y **Tailwind CSS v4**, utilizando **Bun** como runtime para máximo rendimiento.

## ✨ Características

- ⚡ **Astro v5** - Framework web moderno y performante
- 🎨 **Tailwind CSS v4** - Último sistema de diseño utility-first
- 🏃‍♂️ **Bun** - Runtime JavaScript ultra-rápido
- 📱 **Responsive** - Optimizado para todos los dispositivos
- 🔍 **SEO optimizado** - Configuración completa para motores de búsqueda
- 🛠 **TypeScript** - Tipado estricto para mejor DX
- ✅ **ESLint + Prettier** - Código limpio y consistente
- 📦 **Bundle Analysis** - Herramientas de análisis de rendimiento
- 🪝 **Git Hooks** - Automatización con Husky y Commitlint

## 🛠 Tecnologías

- **Framework:** Astro v5.8.1
- **Estilos:** Tailwind CSS v4.1.8
- **Runtime:** Bun
- **Lenguaje:** TypeScript
- **Linting:** ESLint + Prettier
- **Optimización:** LightningCSS, Sharp
- **Git Hooks:** Husky + Commitlint

## 🚀 Inicio rápido

### Prerrequisitos

- [Bun](https://bun.sh/) instalado en tu sistema

### Instalación

```bash
# Clonar el repositorio
git clone <url-del-repo>
cd moura.ar-v3

# Instalar dependencias
bun install

# Iniciar servidor de desarrollo
bun run dev
```

El sitio estará disponible en `http://localhost:4321`

## 📋 Scripts disponibles

### 🚀 **Scripts principales de desarrollo:**

#### `bun run dev`

```bash
bunx --bun astro dev
```

- Inicia el servidor de desarrollo de Astro usando Bun como runtime
- Habilita hot reload automático cuando cambias archivos
- Disponible en `http://localhost:4321` por defecto

#### `bun run build`

```bash
bunx --bun astro build
```

- Construye la versión de producción del sitio
- Optimiza y minifica CSS, JS e imágenes
- Genera archivos estáticos en la carpeta `dist/`

#### `bun run preview`

```bash
bunx --bun astro preview
```

- Sirve la versión construida localmente para testing
- Simula cómo se verá en producción
- Debes ejecutar `build` primero

#### `bun run astro`

```bash
bunx --bun astro
```

- Acceso directo a los comandos CLI de Astro
- Útil para comandos como `astro add`, `astro check`, etc.
- **Ejemplo:** `bun run astro add react`

### 🔧 **Scripts de calidad de código:**

#### `bun run lint`

```bash
eslint . --ext .js,.ts,.astro
```

- Analiza todo el código en busca de errores y problemas de estilo
- Revisa archivos `.js`, `.ts` y `.astro`
- Usa las reglas definidas en `.eslintrc.json`

#### `bun run format`

```bash
prettier --write .
```

- Formatea automáticamente todo el código del proyecto
- Aplica estilo consistente según `.prettierrc.json`
- Modifica los archivos directamente (`--write`)

#### `bun run check`

```bash
astro check && tsc --noEmit
```

- **Doble verificación:**
  1. `astro check` - Verifica errores específicos de Astro
  2. `tsc --noEmit` - Verifica tipos de TypeScript sin generar archivos
- Perfecto para CI/CD y pre-commit hooks

### 📊 **Scripts de análisis:**

#### `bun run analyze`

```bash
bunx --bun vite-bundle-visualizer
```

- Genera un reporte visual del tamaño de tu bundle
- Te muestra qué librerías ocupan más espacio
- Abre automáticamente el reporte en el navegador
- **Nota:** Ejecutar después de `build`

## 🪝 Git Hooks y Commits Convencionales

Este proyecto utiliza **Husky** para automatizar tareas de calidad de código y **Commitlint** para asegurar mensajes de commit consistentes.

### Git Hooks configurados:

#### **Pre-commit**

Antes de cada commit se ejecuta automáticamente:

1. **Prettier** - Formatea todos los archivos modificados
2. **ESLint** - Verifica errores de linting

#### **Commit-msg**

Valida que el mensaje de commit siga el formato de [Commits Convencionales](https://www.conventionalcommits.org/).

#### **Pre-push**

Antes de hacer push al repositorio remoto:

1. **Type checking** - Verifica tipos de TypeScript y Astro
2. **Build** - Construye el proyecto para asegurar que no hay errores

### 📝 Formato de Commits Convencionales

Los mensajes de commit deben seguir este formato:

```
<tipo>(<alcance opcional>): <descripción>

[cuerpo opcional]

[pie opcional]
```

#### Tipos permitidos:

- **feat**: Nueva funcionalidad
- **fix**: Corrección de bugs
- **docs**: Cambios en documentación
- **style**: Cambios de formato (espacios, comas, etc)
- **refactor**: Refactorización de código
- **perf**: Mejoras de rendimiento
- **test**: Añadir o corregir tests
- **build**: Cambios en build o dependencias
- **ci**: Cambios en configuración CI
- **chore**: Otras tareas de mantenimiento
- **revert**: Revertir commits anteriores

#### Ejemplos de commits válidos:

```bash
# ✅ Buenos ejemplos
git commit -m "feat: añadir página de contacto"
git commit -m "fix: corregir error de responsive en móviles"
git commit -m "docs: actualizar instrucciones de instalación"
git commit -m "style: aplicar formato prettier a todos los archivos"
git commit -m "perf: optimizar carga de imágenes con lazy loading"

# ❌ Ejemplos que serán rechazados
git commit -m "Actualizar archivo"          # Sin tipo
git commit -m "feat: Añadir Nueva Feature"  # Mayúsculas no permitidas
git commit -m "feat: añadir nueva feature." # Punto al final
```

### 🔄 Si un commit es rechazado:

1. El hook mostrará el error específico
2. Edita el mensaje con: `git commit --amend`
3. O cancela y vuelve a hacer commit con el formato correcto

## 🔄 Flujo de trabajo recomendado

```bash
# 1. Desarrollo diario
bun run dev

# 2. Antes de commit
bun run format
bun run lint
bun run check

# 3. Hacer commit (los hooks se ejecutarán automáticamente)
git add .
git commit -m "feat: añadir nueva funcionalidad"

# 4. Testing de producción
bun run build
bun run preview

# 5. Push (se verificará el build automáticamente)
git push origin main

# 6. Análisis de performance
bun run analyze
```

## 📁 Estructura del proyecto

```
/
├── public/          # Assets estáticos
├── src/
│   ├── assets/      # Imágenes y recursos
│   ├── components/  # Componentes reutilizables
│   ├── layouts/     # Layouts de página
│   ├── pages/       # Páginas del sitio
│   └── styles/      # Estilos globales (Tailwind)
├── astro.config.mjs # Configuración de Astro
├── tailwind.config.js # Configuración de Tailwind (no necesario en v4)
├── tsconfig.json    # Configuración de TypeScript
├── .eslintrc.json   # Configuración de ESLint
└── .prettierrc.json # Configuración de Prettier
```

## ⚙️ Configuración

### Path Aliases configurados

```typescript
// Usar en imports
import Component from '@/components/Component.astro';
import Layout from '@layouts/Layout.astro';
import styles from '@styles/global.css';
```

### Tailwind CSS v4

El proyecto usa la última versión de Tailwind CSS con:

- Configuración basada en CSS (no JavaScript)
- Plugin de Vite para máximo rendimiento
- Importación simplificada: `@import "tailwindcss"`

### Optimizaciones incluidas

- **Compresión HTML** automática
- **Minificación CSS** con LightningCSS
- **Optimización de imágenes** con Sharp
- **Code splitting** automático
- **Bundle analysis** incluido

## 🔍 Características avanzadas

### TypeScript estricto

- Configuración `strict` de Astro
- Verificación de tipos en tiempo real
- Path aliases configurados

### Linting y formateo

- ESLint con reglas para Astro y TypeScript
- Prettier con plugin específico para Astro
- Configuración optimizada para el ecosistema

### Performance

- Runtime Bun para máxima velocidad
- LightningCSS para minificación ultra-rápida
- Imágenes responsivas experimentales

## 🚀 Despliegue

```bash
# Construir para producción
bun run build

# Los archivos estáticos estarán en dist/
# Subir dist/ a tu hosting preferido
```

## 💡 Tips de desarrollo

1. **`bunx --bun`** fuerza el uso de Bun como runtime (más rápido que Node)
2. Los scripts de linting y formateo pueden ejecutarse automáticamente en tu editor
3. `check` es perfecto para GitHub Actions o pre-commit hooks
4. `analyze` te ayuda a optimizar el tamaño final del sitio
5. Usa los path aliases para imports más limpios

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-feature`)
3. Commit tus cambios (`git commit -m 'Añadir nueva feature'`)
4. Push a la rama (`git push origin feature/nueva-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

---

**Desarrollado con ❤️ usando Astro, Tailwind CSS v4 y Bun**

```sh
bun create astro@latest -- --template basics
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/basics)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/basics)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/basics/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

![just-the-basics](https://github.com/withastro/astro/assets/2244813/a0a5533c-a856-4198-8470-2d67b1d7c554)

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command               | Action                                           |
| :-------------------- | :----------------------------------------------- |
| `bun install`         | Installs dependencies                            |
| `bun dev`             | Starts local dev server at `localhost:4321`      |
| `bun build`           | Build your production site to `./dist/`          |
| `bun preview`         | Preview your build locally, before deploying     |
| `bun astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `bun astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
