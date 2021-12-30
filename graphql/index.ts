const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const rushingStats = require("./rushing.json");

const schema = buildSchema(`
  type RushingStats  {
    player: String!
    team: String!
    pos: String!
    att: Int!
    attPerGame: Float!
    yds: Float!
    avg: Float!
    ydsPerGame: Float!
    touchDown: Int!
    longest: String!
    first: Int!
    firstPercent: Float!
    twentyPlus: Int!
    fourtyPlus: Int!
    fumble: Int!
  }

  type Query {
    totalCount: Int!
    rushingStats(numPerPage: Int pgNum:Int): [RushingStats]
  }
`);

const rootValue = {
  totalCount: () => {
    return rushingStats.length;
  },

  /**
   * this is a naive implementation because I always have all of the rushingStats to sort and paginate
   * the args provided would be enough to get a limit on a sql query and query specific data, which would be the scalable solution
   * I'm choosing to not go through setting up a sql db in a container and migrate the data though, because I'm applying for a frontend job and it feels like putting effort in the wrong direction
   */
  rushingStats: (args) => {
    const sanitizedRushingStats = rushingStats.map((stat) => {
      let sanitizedStat = { ...stat };

      /**
       * graphql schema doesn't support some of the characters in the keys provided, so this is linking them back up for the graphql response
       * javascript code is usually in camelcase, so I'm using this resolver to rename some keys since React will be consuming this API
       */
      sanitizedStat.player = stat.Player;
      sanitizedStat.team = stat.Team;
      sanitizedStat.pos = stat.Pos;
      sanitizedStat.att = stat.Att;
      sanitizedStat.attPerGame = stat["Att/G"];
      sanitizedStat.avg = stat.Avg;
      sanitizedStat.ydsPerGame = stat["Yds/G"];
      sanitizedStat.touchDown = stat.TD;
      sanitizedStat.longest = stat.Lng;
      sanitizedStat.first = stat["1st"];
      sanitizedStat.firstPercent = stat["1st%"];
      sanitizedStat.twentyPlus = stat["20+"];
      sanitizedStat.fourtyPlus = stat["40+"];
      sanitizedStat.fumble = stat.FUM;

      /**
       * changing all Yds into floating point integers and removing the commas as needed
       * this stat data should be coming from a database with stricter rules that don't allow this mix of data types
       * however I'm applying as a frontend dev, and setting that up seems like misplaced effort for the task assignment
       * in an ideal world, this data would come from a database instead of the json file and some of the logic in the resolver would be handled by the db
       */
      if (typeof stat.Yds === "string") {
        const yrdsToNumber = parseFloat(stat.Yds.replace(/,/g, ""));
        sanitizedStat.yds = yrdsToNumber;
      } else {
        sanitizedStat.yds = stat.Yds;
      }

      return sanitizedStat;
    });

    const startingIndex = (args.pgNum - 1) * args.numPerPage;
    const endingIndex = startingIndex + args.numPerPage;

    return sanitizedRushingStats.slice(startingIndex, endingIndex);
  },
};

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue,
    graphiql: true,
  })
);

app.listen(8080, "0.0.0.0");

console.log("Running Express GraphQL server at http://localhost:8080/graphql");
