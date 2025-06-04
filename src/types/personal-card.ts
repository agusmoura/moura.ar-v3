export interface PersonalCard {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  icon?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  tags?: string[];
  specialTag?: string;
  cta?: {
    text: string;
    action: string;
    icon?: string;
  };
  colors?: {
    background: string;
    border: string;
    glow?: string;
  };
  backContent?: {
    title?: string;
    points: string[] | string;
    link?: {
      text: string;
      url: string;
    };
  };
}
