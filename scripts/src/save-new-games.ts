import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { Game, GamePlatform, NewGame, Platform } from "../types";

const allGamesFile = path.join('..', 'data', 'all-games.json');

(async function () {
  const allGames: Game[] = JSON.parse(readFileSync(allGamesFile, 'utf-8'));

  const newGames: NewGame[] = JSON.parse(readFileSync(path.join('output', 'new-games.json'), 'utf-8'))

  console.log('Adding ' + newGames.length + ' games');
  console.log('');
  let numNewGames = 0;
  let numNewPlatforms = 0;
  let numDuplicates = 0;
  newGames.forEach(newGame => {
    const gameByName = allGames.find(ag => newGame.name === ag.name);
    if (gameByName) {
      let anyNewPlatforms = false;
      newGame.links.forEach(link => {
        if (gameByName.platforms[link.platform]) {
          if (gameByName.platforms[link.platform]?.link !== link.link) {
            console.log('Game by name "' + newGame.name + '" has two different links for the same platform:');
            console.log('  Saved: ' + gameByName.platforms[link.platform]?.link);
            console.log('  New: ' + link.link);
            console.log('');
            return;
          }
        } else {
          gameByName.platforms[link.platform] = {link: link.link};
          numNewPlatforms++;
          anyNewPlatforms = true;
        }
      });

      if (!anyNewPlatforms) {
        numDuplicates++;
      }
    } else {
      const gameByPlatform = allGames
        .find(ag => Object.entries(ag.platforms).some(([platform, info]) => {
          return newGame.links.some(gameLink => gameLink.platform == platform && gameLink.link == info.link);
        }));
      if (gameByPlatform) {
        console.log('A game was found with different names:');
        console.log('  Saved: ' + gameByPlatform.name);
        console.log('  New: ' + newGame.name);
        console.log('');
        return;
      } 

      // Brand new game for sure!
      const newPlatforms: Partial<Record<Platform, GamePlatform>> = {};
      newGame.links.forEach(link => {
        newPlatforms[link.platform] = {
          link: link.link,
        }
      });
      allGames.push({
        id: allGames.length,
        name: newGame.name,
        source: newGame.source,
        platforms: newPlatforms,
      });
      numNewGames++;
    }
  });

  writeFileSync(allGamesFile, JSON.stringify(allGames, null, 2));
  console.log('New games saved to all-games.json');
  console.log('  Added ' + numNewGames + ' new games');
  console.log('  Ignored ' + numDuplicates + ' duplicates');
  console.log('  Added ' + numNewPlatforms + ' new platforms');
})();