
/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, useState } from "react";

const LS_KEY = 'game-statuses';
export const AUTO_SAVE_TIME = 5000;

const savedStatuses = getStatusFromStorage();

export type GameStatusContext = {
  playedGames: number[],
  ignoredGames: number[],

  markGameAsPlayed: (id: number) => void,
  markGameAsIgnored: (id: number) => void,
  save: () => void,
};

const defaultContext: GameStatusContext = {
  playedGames: savedStatuses.playedGames,
  ignoredGames: savedStatuses.ignoredGames,

  markGameAsPlayed: (id) => {},
  markGameAsIgnored: (id) => {},
  save: () => {},
};

export const GameStatusContext = createContext(defaultContext);

export function GameStatusProvider(props: Record<string, any>) {
  let saveTimeout: ReturnType<typeof setTimeout> | null;
  const [playedGames, setPlayedGames] = useState<number[]>(defaultContext.playedGames);
  const [ignoredGames, setIgnoredGames] = useState<number[]>(defaultContext.ignoredGames);

  function markGameAsPlayed(id: number) {
    const newPlayedGames = [...playedGames];
    newPlayedGames.push(id);
    setPlayedGames(newPlayedGames);

    saveOnTimeout();
  }

  function markGameAsIgnored(id: number) {
    const newIgnoredGames = [...ignoredGames];
    newIgnoredGames.push(id);
    setIgnoredGames(newIgnoredGames);
  }

  function saveOnTimeout() {
    if (!saveTimeout) {
      saveTimeout = setTimeout(() => {
        save();
        saveTimeout = null;
      }, AUTO_SAVE_TIME);
    }
  }

  function save() {
    localStorage.setItem(LS_KEY, JSON.stringify({
      playedGames,
      ignoredGames,
    }));
  }

  return (
    <GameStatusContext.Provider
      value={{
        playedGames, ignoredGames,
        markGameAsPlayed, markGameAsIgnored, save,
      }}
      {...props}
    />
  );
}

function getStatusFromStorage() {
  const rawData: string | null = localStorage.getItem(LS_KEY);
  if (!rawData) return {};

  try {
    return JSON.parse(rawData);
  } catch (err) {
    return {};
  }
}