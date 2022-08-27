import fs from 'fs';

import Snoowrap from "snoowrap";
import {partition, uniq} from "lodash";

import env from "./env";
import { Game, Platform } from './types';
import axios from 'axios';

const URL_REGEX = /\[[^\]]+\]\((https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))\)/g;

const LINKS_TO_IGNORE = [
  'discord.gg/',
  'discord.com/',
  'discordapp.net/',
  'gamewiki.',
  'reddit.com/',
  'preview.redd.it/',
  'prnt.sc',
];

const GAME_LINKS = [{
  platform: Platform.Steam,
  linkMatcher: /store.steampowered.com\/app\/(\d+)\/[^\/]+\//,
  nameLookup: async (id: string) => {
    const response = await axios.get('http://store.steampowered.com/api/appdetails/?appids=' + id);
    return response.data[id].data.name;
  }
}];
/* *
  'play.google.com',
  'store.steampowered.com',
  'raw.githack.com',
  'apps.apple.com',
  'kongregate.com/games/',
  'itch.io',
  'github.com',
];
/* */

(async function () {
  const r = new Snoowrap({
    userAgent: 'nodejs:incremental-game-aggregator:v0.1.0 (by /u/salbris)',
    ...env,
  });

  const newGames: Game[] = [];
  let allUncategorizedLinks: string[] = [];

  const parsePosts = r.getSubreddit('incremental_games')
    .getNew({limit: 1})
    .then((posts) => {
      console.log('Analyzing ' + posts.length + ' posts...');
      posts.forEach(post => {
        const links = getLinks(post.selftext)
          .filter(link => !linkMatches(link, LINKS_TO_IGNORE))
        if (links.length == 0) return;

        const processedLinks = links.map(link => {
          const gameLink = GAME_LINKS.map(gameLink => ({
            ...gameLink,
            linkMatches: link.match(gameLink.linkMatcher)
          })).find(gameLink => gameLink.linkMatches)
          return {gameLink, link};
        });

        const [categorizedLinks, uncategorizedLinks] = partition(processedLinks, pl => pl.gameLink);

        allUncategorizedLinks = allUncategorizedLinks.concat(
          uncategorizedLinks.map(cl => cl.link)
        );

        if (categorizedLinks.length > 0) {
          /* *
          const potentialNames = uniq(
            await Promise.all(categorizedLinks.map(cl => cl.gameLink!.nameLookup(cl.gameLink!.linkMatches![1])))
          );

          newGames.push({
            name: potentialNames[0],
            links: gameLinks,
          });
          /* */
        }
      });
      
      return true;
    });

  await Promise.all([parsePosts]);

  console.log('Saving report');
  fs.writeFileSync('games.json', JSON.stringify(newGames, null, 2));

  if (allUncategorizedLinks.length > 0) {
    console.log('Found ' + allUncategorizedLinks.length + ' uncategorized links. Look in uncategorizedLinks.json.');
  }
  fs.writeFileSync('uncategorizedLinks.json', JSON.stringify(allUncategorizedLinks, null, 2));
})();

function getLinks(body: string) {
  return [...body.matchAll(URL_REGEX)]
    .map(match => match[1]);
}

function linkMatches(link: string, matches: string[]) {
  return matches.some(match => link.includes(match));
}