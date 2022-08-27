import fs from 'fs';
import Snoowrap from "snoowrap";
import env from "./env";
import { Game } from './types';

const URL_REGEX = /\[[^\]]+\]\((https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))\)/g;

const LINKS_TO_IGNORE = [
  'discord.gg/',
  'discord.com/',
  'gamewiki.',
  'reddit.com/',
  'preview.redd.it/',
  'prnt.sc',
];

const GAME_LINKS = [
  'play.google.com',
  'store.steampowered.com',
  'raw.githack.com',
  'apps.apple.com',
  'kongregate.com/games/',
  'itch.io',
  'github.com',
];

(async function () {
  const r = new Snoowrap({
    userAgent: 'nodejs:incremental-game-aggregator:v0.1.0 (by /u/salbris)',
    ...env,
  });

  const newGames: Game[] = [];
  let uncategorizedLinks: string[] = [];

  const parsePosts = r.getSubreddit('incremental_games')
    .getNew({limit: 50})
    .then((posts) => {
      console.log('Analyzing ' + posts.length + ' posts...');
      posts.forEach(post => {
        const links = getLinks(post.selftext)
          .filter(link => !linkMatches(link, LINKS_TO_IGNORE))
        if (links.length == 0) return;

        uncategorizedLinks = uncategorizedLinks.concat(
          links.filter(link => !linkMatches(link, GAME_LINKS))
        );

        const gameLinks = links.filter(link => linkMatches(link, GAME_LINKS))
        if (gameLinks.length > 0) {
          newGames.push({
            name: post.title,
            links: gameLinks,
          });
        }
      });
      
      return true;
    });

  await Promise.all([parsePosts]);

  console.log('Saving report');
  fs.writeFileSync('games.json', JSON.stringify(newGames, null, 2));

  if (uncategorizedLinks.length > 0) {
    console.log('Found ' + uncategorizedLinks.length + ' uncategorized links. Look in uncategorizedLinks.json.');
  }
  fs.writeFileSync('uncategorizedLinks.json', JSON.stringify(uncategorizedLinks, null, 2));
})();

function getLinks(body: string) {
  return [...body.matchAll(URL_REGEX)]
    .map(match => match[1]);
}

function linkMatches(link: string, matches: string[]) {
  return matches.some(match => link.includes(match));
}