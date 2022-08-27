import Snoowrap, { Submission } from "snoowrap";
import env from "./env";

const URL_REGEX = /\[[^\]]+\]\((https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))\)/g;

(async function () {
  const r = new Snoowrap({
    userAgent: 'nodejs:incremental-game-aggregator:v0.1.0 (by /u/salbris)',
    ...env,
  });

  const newGames = {};
  function getLinks(body: string) {
    return [...body.matchAll(URL_REGEX)]
      .map(match => match[1]);
  }

  console.log(r.tokenExpiration);
  console.log('Rate Remaining: ' + r.ratelimitRemaining);

  /* */
  r.getSubreddit('incremental_games')
    .getNew({limit: 20})
    .then((posts) => {
      console.log('Found ' + posts.length + ' posts');
      posts.forEach(post => {
        const links = getLinks(post.selftext);
        if (links.length == 0) return;

        console.log(post.title);
        
        console.log(links);
      });
    });
  /* */
})();