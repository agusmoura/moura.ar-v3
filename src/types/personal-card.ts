export interface PersonalCard {
  id: number;
  primary_title: string;
  tagline?: string;
  preview_text?: string;
  image?: string;
  category?: string;
  specialTag?: string;
  tags?: string[];
  colors?: {
    background: string;
    border: string;
    glow?: string;
  };
  story: {
    title?: string;
    key_points: string[] | string;
    note?: string;
    cta?: {
      text: string;
      url: string;
      target?: string;
      type?: string;
    };
    link?: {
      text: string;
      url: string;
      target?: string;
    };
  };
}
