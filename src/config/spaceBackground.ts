/**
 * Configuración global del SpaceBackground para asegurar consistencia
 * y persistencia entre todas las páginas del sitio
 */

export interface SpaceBackgroundConfig {
  starDensity: number;
  allStarsTwinkle?: boolean;
  twinkleProbability?: number;
  minTwinkleSpeed: number;
  maxTwinkleSpeed: number;
  starsColor?: string;
  shootingStarsEnabled?: boolean;
  minSpeed: number;
  maxSpeed: number;
  minDelay: number;
  maxDelay: number;
  starColor: string;
  trailColor: string;
  starWidth: number;
  starHeight: number;
  backgroundColor: string;
  gravityEnabled: boolean;
  gravityStrength: number;
  gravityX: number | null;
  gravityY: number | null;
  mouseGravityEnabled: boolean;
  mouseGravityStrength: number;
  mouseGravityRadius: number;
}

/**
 * Configuración base optimizada para mejor rendimiento y persistencia
 */
export const baseSpaceBackgroundConfig: Omit<SpaceBackgroundConfig, 'backgroundColor'> = {
  starDensity: 0.0012, // Densidad optimizada para rendimiento
  allStarsTwinkle: true,
  twinkleProbability: 0.8,
  minTwinkleSpeed: 1.0, // Parpadeo más estable
  maxTwinkleSpeed: 2.5,
  starsColor: '#dcdbdbe3', // Color para estrellas regulares
  shootingStarsEnabled: true,
  minSpeed: 15,
  maxSpeed: 30,
  minDelay: 2000,
  maxDelay: 6000,
  starColor: '#ecad22', // Color para estrellas fugaces
  trailColor: '#e0c587',
  starWidth: 10,
  starHeight: 2,
  gravityEnabled: true,
  gravityStrength: 95000, // Fuerza gravitacional balanceada
  gravityX: null,
  gravityY: null,
  mouseGravityEnabled: true,
  mouseGravityStrength: 2.0, // Efecto de mouse moderado
  mouseGravityRadius: 0.16, // Radio balanceado
};

/**
 * Configuración para páginas principales (home, proyectos, etc.)
 */
export const getMainSpaceConfig = (backgroundColor = '#10100E'): SpaceBackgroundConfig => ({
  ...baseSpaceBackgroundConfig,
  backgroundColor,
});

/**
 * Configuración simplificada para páginas de contenido (proyectos individuales)
 * Reduce efectos para no distraer del contenido
 */
export const getContentSpaceConfig = (backgroundColor = '#10100E'): SpaceBackgroundConfig => ({
  ...baseSpaceBackgroundConfig,
  backgroundColor,
  starDensity: 0.001, // Menos denso para contenido
  gravityEnabled: false, // Sin gravitación para contenido centrado
  gravityStrength: 0,
  mouseGravityEnabled: false,
  mouseGravityStrength: 0,
  mouseGravityRadius: 0,
  minTwinkleSpeed: 0.6,
  maxTwinkleSpeed: 1.2,
  minDelay: 3000,
  maxDelay: 8000,
  starWidth: 12,
  starHeight: 2,
});

/**
 * Obtiene la configuración adecuada según el tipo de página
 */
export const getSpaceConfigForPage = (
  pageType: 'main' | 'content' = 'main',
  backgroundColor = '#10100E'
): SpaceBackgroundConfig => {
  switch (pageType) {
    case 'content':
      return getContentSpaceConfig(backgroundColor);
    case 'main':
    default:
      return getMainSpaceConfig(backgroundColor);
  }
};