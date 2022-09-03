import fs from 'fs';

import Snoowrap from "snoowrap";
import {partition, uniq, uniqBy} from "lodash";

import env from "../env";
import { Link, NewGame, Platform } from '../types';

const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
const LINK_REGEX = `\\[([^\\]]+)\\]\\((${URL_REGEX.source})\\)`;


const LINKS_TO_IGNORE = [
  'discord.gg/',
  'discord.com/',
  'discordapp.net/',
  'gamewiki.',
  'reddit.com/',
  'preview.redd.it/',
  'prnt.sc',
  'fandom.com/wiki/'
];

const GAME_LINKS = [{
  platform: Platform.Steam,
  linkMatchers: ['store.steampowered.com'],
}, {
  platform: Platform.Android,
  linkMatchers: ['play.google.com'],
}, {
  platform: Platform.Web,
  linkMatchers: [
    'raw.githack.com',
    'kongregate.com/games/',
    'itch.io',
    'github.com',
    'github.io',
  ],
}, {
  platform: Platform.IOS,
  linkMatchers: ['apps.apple.com']
}];

(async function () {
  const r = new Snoowrap({
    userAgent: 'nodejs:incremental-game-aggregator:v0.1.0 (by /u/salbris)',
    ...env,
  });

  const newGames: NewGame[] = [];
  let allUncategorizedLinks: Link[] = [];

  const parsePosts = r.getSubreddit('incremental_games')
    .getNew({limit: 50})
    .then((posts) => {
      console.log('Analyzing ' + posts.length + ' posts...');
      posts.forEach(post => {
        const links: Link[] = uniq(
          getLinks(post.selftext).filter(link => !linkMatches(link, LINKS_TO_IGNORE))
        );
        if (links.length == 0) return;

        const processedLinks = links.map(link => {
          const gameLink = GAME_LINKS.find(gameLink => 
            gameLink.linkMatchers.some(match => link.url.includes(match))
          );
          return {gameLink, link};
        });

        allUncategorizedLinks = allUncategorizedLinks.concat(
          processedLinks
            .filter(pl => !pl.gameLink)
            .map(pl => pl.link)
        );


        if (processedLinks.length > 0) {
          const potentialNames = uniq([
            post.title,
            ...processedLinks.map(pl => pl.link.text),
          ]);

          newGames.push({
            name: potentialNames[0],
            source: 'http://reddit.com' + post.permalink,
            otherNames: potentialNames.slice(1),
            links: processedLinks.map(cl => ({
              link: cl.link.url,
              platform: cl.gameLink?.platform ?? Platform.Web,
            })),
          });
        }
      });
      
      return true;
    });

  await Promise.all([parsePosts]);

  console.log('Saving report');
  if (newGames.length > 0) {
    console.log('Found ' + newGames.length + ' new games. Look in new-games.json.');
  }
  fs.writeFileSync('output/new-games.json', JSON.stringify(newGames, null, 2));

  if (allUncategorizedLinks.length > 0) {
    console.log('Found ' + allUncategorizedLinks.length + ' uncategorized links. Look in uncategorizedLinks.json.');
  }
  fs.writeFileSync('output/uncategorizedLinks.json', JSON.stringify(allUncategorizedLinks, null, 2));
})();

function getLinks(body: string) {
  return [...body.matchAll(new RegExp(LINK_REGEX, 'g'))]
    .map(match => ({
      text: match[1],
      url: match[2],
    }));
}

function linkMatches(link: Link, matches: string[]) {
  return matches.some(match => link.url.includes(match));
}