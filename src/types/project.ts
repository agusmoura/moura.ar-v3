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
  partner?: string;
  role: string;
  duration: string;
  technologies: string[];
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
