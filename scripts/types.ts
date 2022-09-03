import { Features } from "snoowrap/dist/objects/RedditUser";

export interface NewGame {
  name: string;
  source: string;
  otherNames: string[];
  links: GameLink[];
}

export interface GameLink {
  link: string;
  platform: Platform;
}

export interface Link {
  text: string;
  url: string;
}

export interface Game {
  id: number;
  name: string;
  source: string;
  platforms: Partial<Record<Platform, GamePlatform>>;
}

export interface GamePlatform {
  id?: string;
  link: string;
}

export enum Platform {
  Steam = 'Steam',
  IOS = 'IOS',
  Android = 'Android',
  Web = 'Web',
  Windows = 'Windows',
}

export enum GameStyle {
  Generic = "Generic",
  GroundHogDay = "GroundHogDay",
}

export enum GameFeature {
  Prestige = "Prestige",
  Unfolding = "Unfolding",
}