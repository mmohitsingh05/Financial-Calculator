export interface Designer {
  id: string;
  name: string;
  title: string;
  avatar: string;
  skills: string[];
  rate: string;
  rating: number;
  location: string;
  bio: string;
}

export interface PortfolioShot {
  id: string;
  title: string;
  category: string;
  image: string;
  designerId: string;
  designerName: string;
  designerAvatar: string;
  likes: number;
  views: string;
}

export interface CreativeBrief {
  briefTitle: string;
  targetAudience: string;
  brandPersonality: string;
  colorPalette: string[];
  designChallenge: string;
  suggestedDeliverables: string[];
  creativeTips: string[];
}

export interface WealthStrategy {
  overview: string;
  deepDive: string;
  actionableStrategies: string[];
  actionSteps: string[];
  pitfallsToAvoid: string[];
  advisoryQuote: string;
}

