/**
 * Type definition for resource preloading
 * Used to generate <link> tags for preloading CSS, JS, fonts, and other resources
 */
export interface Preload {
  /** The URL of the resource to preload */
  href: string

  /** The type of content being preloaded (e.g., 'style', 'script', 'font', 'image') */
  as?: string

  /** The MIME type of the resource */
  type?: string

  /** The relationship attribute (defaults to 'preload') */
  rel?: 'preload' | 'prefetch' | 'dns-prefetch' | 'preconnect'

  /** CORS settings for cross-origin requests */
  crossorigin?: boolean | 'anonymous' | 'use-credentials'

  /** Media query for conditional loading */
  media?: string

  /** Importance hint for the browser */
  importance?: 'high' | 'low' | 'auto'
}
