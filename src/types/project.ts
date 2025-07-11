export interface Project {
  title: string;
  description: string;
  slug: string;
  order: number;
  showInHome: boolean;
  featured: boolean;
  category: string;
  date: number;
  client: string;
  client_logo?: string;
  partner?: string;
  partner_logo?: string;
  role: string;
  duration: string;
  technologies: string[];
  highContrast?: boolean;
  theme?: {
    title_gradient: string;
    colors?: {
      primary?: string;
      secondary?: string;
      background?: string;
      foreground?: string;
      surface?: string;
      border?: string;
    };
  };
  grid: {
    cols: {
      base?: number;
      sm?: number;
      md?: number;
      lg?: number;
      xl?: number;
    };
    rows: {
      base?: number;
      sm?: number;
      md?: number;
      lg?: number;
      xl?: number;
    };
  };
  links?: {
    live?: string;
    github?: string;
    case?: string;
    appstore?: string;
    playstore?: string;
  };
  images?: {
    cover?: { src: string; alt: string };
    comp?: { src: string; alt: string };
    gallery?: Array<{ src: string; alt: string }>;
  };
  tags?: string[];
  content?: string;
}
