import type { CollectionEntry } from 'astro:content';

export interface ProjectThemeColors {
  primary: string;
  secondary: string;
  surface: string;
  foreground: string;
  background: string;
  border: string;
}

// Helper para obtener colores del tema del proyecto
export function getProjectThemeColors(
  project: CollectionEntry<'projects'>['data']
): ProjectThemeColors {
  const defaultColors: ProjectThemeColors = {
    primary: '#efbb47',
    secondary: '#3c3c3c',
    surface: '#2d2d2d',
    foreground: '#e1dbcd',
    background: '#10100E',
    border: '#e1dbcd',
  };

  if (project.theme?.colors) {
    return {
      primary: project.theme.colors.primary || defaultColors.primary,
      secondary: project.theme.colors.secondary || defaultColors.secondary,
      surface: project.theme.colors.surface || defaultColors.surface,
      foreground: project.theme.colors.foreground || defaultColors.foreground,
      background: project.theme.colors.background || defaultColors.background,
      border: project.theme.colors.border || defaultColors.border,
    };
  }

  return defaultColors;
}

// Helper para obtener ícono de categoría
export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'E-commerce': 'heroicons:shopping-cart',
    'Web Design': 'heroicons:paint-brush',
    'Web App': 'heroicons:device-phone-mobile',
    Branding: 'heroicons:sparkles',
    'Augmented Reality Game': 'heroicons:cube-transparent',
  };
  return icons[category] || 'heroicons:squares-2x2';
}

// Helper para obtener ícono de tecnología
export function getTechIcon(tech: string): string {
  const techIcons: Record<string, string> = {
    TypeScript: 'simple-icons:typescript',
    JavaScript: 'simple-icons:javascript',
    React: 'simple-icons:react',
    'Vue.js': 'simple-icons:vuedotjs',
    Vue: 'simple-icons:vuedotjs',
    Astro: 'simple-icons:astro',
    WordPress: 'simple-icons:wordpress',
    'Node.js': 'simple-icons:nodedotjs',
    PHP: 'simple-icons:php',
    Laravel: 'simple-icons:laravel',
    Python: 'simple-icons:python',
    Docker: 'simple-icons:docker',
    MongoDB: 'simple-icons:mongodb',
    PostgreSQL: 'simple-icons:postgresql',
    MySQL: 'simple-icons:mysql',
    Git: 'simple-icons:git',
    GitHub: 'simple-icons:github',
    GitLab: 'simple-icons:gitlab',
    'Tailwind CSS': 'simple-icons:tailwindcss',
    Tailwind: 'simple-icons:tailwindcss',
    Figma: 'simple-icons:figma',
    Adobe: 'simple-icons:adobe',
    Photoshop: 'simple-icons:adobephotoshop',
    Illustrator: 'simple-icons:adobeillustrator',
    Unity: 'simple-icons:unity',
    Flutter: 'simple-icons:flutter',
    Swift: 'simple-icons:swift',
    Kotlin: 'simple-icons:kotlin',
    AWS: 'simple-icons:amazonwebservices',
    Vercel: 'simple-icons:vercel',
    Netlify: 'simple-icons:netlify',
    WooCommerce: 'simple-icons:woocommerce',
    jQuery: 'simple-icons:jquery',
  };
  return techIcons[tech] || 'heroicons:code-bracket';
}

// Helper para obtener color de tecnología
export function getTechColor(tech: string): string {
  const techColors: Record<string, string> = {
    TypeScript: '#3178C6',
    JavaScript: '#F7DF1E',
    React: '#61DAFB',
    'Vue.js': '#4FC08D',
    Vue: '#4FC08D',
    Astro: '#FF5D01',
    WordPress: '#21759B',
    'Node.js': '#539E43',
    PHP: '#777BB4',
    Laravel: '#FF2D20',
    Python: '#3776AB',
    Docker: '#2496ED',
    MongoDB: '#47A248',
    PostgreSQL: '#336791',
    MySQL: '#4479A1',
    Git: '#F05032',
    GitHub: '#181717',
    GitLab: '#FCA326',
    'Tailwind CSS': '#38BDF8',
    Tailwind: '#38BDF8',
    Figma: '#F24E1E',
    Adobe: '#FF0000',
    Photoshop: '#31A8FF',
    Illustrator: '#FF9A00',
    Unity: '#000000',
    Flutter: '#02569B',
    Swift: '#FA7343',
    Kotlin: '#7F52FF',
    AWS: '#FF9900',
    Vercel: '#000000',
    Netlify: '#00C7B7',
    WooCommerce: '#964F00',
    jQuery: '#0769AD',
  };
  return techColors[tech] || '#EFBB47';
}
