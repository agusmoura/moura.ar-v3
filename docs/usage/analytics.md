# Sistema de Analytics Avanzado con Umami

## Resumen

Se implementó un sistema completo de analytics usando Umami que trackea interacciones detalladas del usuario, métricas de formularios, y comportamiento de navegación para obtener insights profundos sobre el rendimiento del sitio web.

## Características Principales

### 🔍 **Tracking de Formulario de Contacto**

- **Inicio de interacción**: Cuando el usuario empieza a interactuar con el formulario
- **Interacciones por campo**: Focus, blur, y errores de validación
- **Selección de tipos de proyecto**: Qué tipos son más populares
- **Errores de validación**: Tracking detallado de errores por campo
- **Tiempo de completado**: Métricas de cuánto tardan en llenar el formulario
- **Abandono de formulario**: Identificación de puntos de abandono
- **Envío exitoso/fallido**: Tasas de conversión y tipos de errores

### 📊 **Tracking de Navegación y Engagement**

- **Scroll tracking**: Profundidad de scroll por página (25%, 50%, 75%, 90%, 100%)
- **Tiempo en secciones**: Qué secciones captan más atención
- **Clicks en proyectos**: Qué proyectos generan más interés
- **Descarga de CV**: Tracking de conversiones importantes
- **Enlaces externos**: Clicks a LinkedIn, GitHub, etc.
- **Engagement temporal**: Tiempo activo en página

### ⚡ **Tracking de Performance UX**

- **Tiempo de carga**: Métricas de rendimiento percibido
- **First Paint**: Tiempo hasta primer renderizado
- **Errores de JavaScript**: Tracking de errores técnicos
- **Métricas de dispositivo**: Viewport, resolución, user agent

## Arquitectura del Sistema

### 📁 **Archivos Principales**

```
src/utils/
├── umami-analytics.ts          # Clase principal de analytics
├── page-analytics.ts           # Tracking de navegación
└── contact-form-client.ts      # Integración con formulario
```

### 🔧 **Componentes Clave**

#### `UmamiAnalytics` (umami-analytics.ts)

Clase principal que maneja todos los eventos de analytics:

```typescript
export class UmamiAnalytics {
  // Tracking de formularios
  trackFormStart(formId: string);
  trackFormFieldInteraction(fieldName: string, action: 'focus' | 'blur' | 'error');
  trackFormValidationError(fieldName: string, errorMessage: string);
  trackProjectTypeSelection(selectedTypes: string[]);
  trackFormSubmissionAttempt();
  trackFormSubmissionSuccess();
  trackFormSubmissionError(errorMessage: string);
  trackFormAbandon();

  // Tracking de navegación
  trackProjectClick(projectId: string, projectTitle: string);
  trackCVDownload();
  trackExternalLink(url: string, linkText: string);

  // Tracking de performance
  trackScrollDepth(depth: number);
  trackUserEngagement(engagementTime: number);
}
```

#### `PageAnalytics` (page-analytics.ts)

Maneja el tracking automático de elementos de página:

```typescript
export class PageAnalytics {
  setupProjectTracking(); // Clicks en proyectos
  setupCVDownloadTracking(); // Descargas de CV
  setupExternalLinkTracking(); // Enlaces externos
  setupGenericElementTracking(); // Elementos con data-umami-event
}
```

## Eventos Trackeados

### 📝 **Eventos de Formulario**

| Evento                  | Descripción                   | Datos Incluidos                     |
| ----------------------- | ----------------------------- | ----------------------------------- |
| `form_start`            | Usuario inicia interacción    | `form_id`, `referrer`, `utm_*`      |
| `form_field_focus`      | Campo recibe focus            | `field_name`, `time_since_start`    |
| `form_field_blur`       | Campo pierde focus            | `field_name`, `fields_interacted`   |
| `form_field_error`      | Error en campo                | `field_name`, `total_errors`        |
| `form_validation_error` | Error de validación           | `field_name`, `error_message`       |
| `form_project_selected` | Tipo de proyecto seleccionado | `selected_types`, `selection_count` |
| `form_submit_attempt`   | Intento de envío              | `completion_time`, `project_types`  |
| `form_submit_success`   | Envío exitoso                 | `completion_time`, `error_count`    |
| `form_submit_error`     | Error en envío                | `error_message`                     |
| `form_abandon`          | Abandono de formulario        | `time_spent`, `abandon_point`       |

### 🧭 **Eventos de Navegación**

| Evento                 | Descripción                 | Datos Incluidos                   |
| ---------------------- | --------------------------- | --------------------------------- |
| `scroll_depth`         | Profundidad de scroll       | `depth_percent`, `time_to_depth`  |
| `project_click`        | Click en proyecto           | `project_id`, `project_title`     |
| `cv_download`          | Descarga de CV              | `download_source`, `time_on_page` |
| `external_link`        | Click en enlace externo     | `target_url`, `link_text`         |
| `contact_method_click` | Click en método de contacto | `platform`, `url`                 |
| `user_engagement`      | Engagement temporal         | `engagement_time`, `page_section` |

### 🔧 **Eventos de Performance**

| Evento                 | Descripción          | Datos Incluidos                   |
| ---------------------- | -------------------- | --------------------------------- |
| `page_load_time`       | Tiempo de carga      | `load_time`, `dom_content_loaded` |
| `form_completion_time` | Tiempo de completado | `completion_time`, `success`      |
| `error_occurred`       | Error de JavaScript  | `error_message`, `stack_trace`    |

## Uso e Implementación

### 🏷️ **Tracking Declarativo (HTML)**

Para elementos estáticos, usa data attributes:

```html
<a href="/cv.pdf" data-umami-event="cv_download" data-umami-event-source="header"> Descargar CV </a>

<button data-umami-event="contact_method_click" data-umami-event-platform="email">Contactar</button>
```

### 🔄 **Tracking Programático (JavaScript)**

Para interacciones dinámicas:

```javascript
import { analytics } from '@/utils/umami-analytics';

// Tracking manual
analytics.track('custom_event', {
  custom_data: 'value',
  timestamp: Date.now(),
});

// Tracking de formulario
analytics.trackFormStart('contact-form');
analytics.trackFormFieldInteraction('name', 'focus');
```

## Métricas y Análisis

### 📈 **KPIs Principales**

- **Tasa de conversión del formulario**: `form_submit_success / form_start`
- **Tiempo promedio de completado**: Análisis de `form_completion_time`
- **Puntos de abandono**: Análisis de `form_abandon` por `abandon_point`
- **Engagement por sección**: Tiempo en cada sección del sitio
- **Popularidad de proyectos**: Clicks por proyecto
- **Fuentes de tráfico**: Análisis de UTM parameters

### 📊 **Análisis de Comportamiento**

- **Scroll patterns**: Qué porcentaje de usuarios llega a cada sección
- **Error patterns**: Errores más comunes en formularios
- **Device insights**: Comportamiento por tipo de dispositivo
- **Performance impact**: Correlación entre tiempo de carga y conversiones

## Configuración y Mantenimiento

### 🔧 **Variables de Entorno**

```bash
# Umami está configurado en UmamiTracker.astro
UMAMI_WEBSITE_ID=388f61d9-d676-4279-a193-9e87a38e3c4b
UMAMI_SCRIPT_URL=https://analytics.moura.ar/script.js
```

### 📝 **Logging y Debug**

En desarrollo, los eventos se loggean en consola:

```javascript
// Habilitar debug mode
localStorage.setItem('umami.debug', 'true');
```

### 🔄 **Actualización de Eventos**

Para agregar nuevos eventos:

1. Definir en `ANALYTICS_EVENTS` constante
2. Implementar método de tracking en `UmamiAnalytics`
3. Agregar llamada en el componente relevante
4. Actualizar documentación

## Privacidad y Cumplimiento

- ✅ **GDPR Compliant**: No trackea información personal identificable
- ✅ **Cookie-free**: No usa cookies
- ✅ **Anonymized**: Todos los datos son anónimos
- ✅ **Self-hosted**: Datos almacenados en servidor propio
- ✅ **Transparent**: Código fuente disponible

## Resultados Esperados

Este sistema permite:

- **Optimizar conversiones** identificando puntos de fricción
- **Mejorar UX** basándose en patrones de comportamiento real
- **Priorizar contenido** según engagement metrics
- **Identificar problemas técnicos** través de error tracking
- **Medir ROI** de cambios y optimizaciones

---

**Implementado**: ✅ Completamente funcional  
**Mantenimiento**: Revisión mensual de métricas  
**Próximos pasos**: Análisis de datos y optimizaciones basadas en insights
