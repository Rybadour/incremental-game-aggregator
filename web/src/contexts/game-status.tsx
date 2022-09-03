
/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, useState } from "react";

const LS_KEY = 'game-statuses';
export const AUTO_SAVE_TIME = 5000;

export type GameStatusContext = {
  playedGames: number[],
  ignoredGames: number[],
  autoSaveTime: number,

  markGameAsPlayed: (id: number) => void,
  markGameAsIgnored: (id: number) => void,
  save: () => void,
  load: () => void,
};

const defaultContext: GameStatusContext = {
  playedGames: [],
  ignoredGames: [],
  autoSaveTime: AUTO_SAVE_TIME,

  markGameAsPlayed: (id) => {},
  markGameAsIgnored: (id) => {},
  save: () => {},
  load: () => {},
};

export const GameStatusContext = createContext(defaultContext);

export function GameStatusProvider(props: Record<string, any>) {
  const [playedGames, setPlayedGames] = useState<number[]>([]);
  const [ignoredGames, setIgnoredGames] = useState<number[]>([]);
  const [autoSaveTime, setAutoSaveTime] = useState(defaultContext.autoSaveTime);

  function markGameAsPlayed(id: number) {
    const newPlayedGames = [...playedGames];
    newPlayedGames.push(id);
    setPlayedGames(newPlayedGames);
  }

  function markGameAsIgnored(id: number) {
    const newIgnoredGames = [...ignoredGames];
    newIgnoredGames.push(id);
    setIgnoredGames(newIgnoredGames);
  }

  function save() {
    localStorage.setItem(LS_KEY, '');
  }

  function load() {
    const rawData: string | null = localStorage.getItem(LS_KEY);
    if (!rawData) return;

  }

  return (
    <GameStatusContext.Provider
      value={{
        playedGames, ignoredGames, autoSaveTime,
        markGameAsPlayed, markGameAsIgnored, save, load,
      }}
      {...props}
    />
  );
}