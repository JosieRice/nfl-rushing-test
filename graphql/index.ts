const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
/** NOTE: should be migrated to a db, but I'm Frontend, so I'm just leaving as is */
const rushingStats = require("./rushing.json");
const cors = require("cors");

/** TODO: figure out how to use these enum type definition in the query params on the client side */
const schema = buildSchema(`
  enum SortBy {
    yds
    touchDown
    longest
  }

  enum OrderBy {
    asc
    desc
  }

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
    totalCount(filter: String!): Int!
    rushingStats(
      numPerPg: Int!
      pgNum: Int!
      filter: String
      sortBy: String
      orderBy: String
    ): [RushingStats]
  }
`);

const rootValue = {
  totalCount: (args) => {
    let filteredStats = rushingStats;
    if (args.filter) {
      filteredStats = rushingStats.map((stat) => {
        const player = stat?.Player?.toLowerCase();
        if (player.includes(args?.filter?.toLowerCase())) {
          return stat;
        } else {
          return null;
        }
      });
    }
    const filteredStatsClean = filteredStats.filter(Boolean);
    return filteredStatsClean.length;
  },

  rushingStats: (args) => {
    /**
     * filter logic
     * NOTE: this should be part of a db query - but I'm Frontend, so I'm just cheating it
     */
    let filteredStats = rushingStats;
    if (args.filter) {
      filteredStats = rushingStats.map((stat) => {
        const player = stat?.Player?.toLowerCase();
        if (player.includes(args?.filter?.toLowerCase())) {
          return stat;
        } else {
          return null;
        }
      });
    }
    const filteredStatsClean = filteredStats.filter(Boolean);

    /**
     * graphql schema doesn't support some of the characters in the keys provided, so this is linking them back up for the graphql response
     * javascript code is usually in camelcase, so I'm using this resolver to rename some keys since React will be consuming this API
     */
    const renamedStats = filteredStatsClean.map((stat) => {
      let sanitizedStat = { ...stat };

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

    /**
     * sort logic
     * NOTE: yet again, this should be part of the db query to return the correct info, but I'm Frontend so I'm going to forego doing it
     */
    let sortedStats = renamedStats;
    if (args.sortBy && args.orderBy) {
      const longestAsc = args.sortBy === "longest" && args.orderBy === "asc";
      const longestDesc = args.sortBy === "longest" && args.orderBy === "desc";
      const touchDownAsc =
        args.sortBy === "touchDown" && args.orderBy === "asc";
      const touchDownDesc =
        args.sortBy === "touchDown" && args.orderBy === "desc";
      const ydsAsc = args.sortBy === "yds" && args.orderBy === "asc";
      const ydsDesc = args.sortBy === "yds" && args.orderBy === "desc";

      if (longestAsc) {
        sortedStats.sort((a, b) => a.longest - b.longest);
      } else if (longestDesc) {
        sortedStats.sort((a, b) => b.longest - a.longest);
      } else if (touchDownAsc) {
        sortedStats.sort((a, b) => a.touchDown - b.touchDown);
      } else if (touchDownDesc) {
        sortedStats.sort((a, b) => b.touchDown - a.touchDown);
      } else if (ydsAsc) {
        sortedStats.sort((a, b) => a.yds - b.yds);
      } else if (ydsDesc) {
        sortedStats.sort((a, b) => b.yds - a.yds);
      }
    }

    /**
     * pagination logic
     * NOTE: should be a db query with a limit to allow for scaling up data - but I'm Frontend, so I'm just cheating it
     */
    const startingIndex = (args.pgNum - 1) * args.numPerPg;
    const endingIndex = startingIndex + args.numPerPg;
    let paginatedStats = sortedStats.slice(startingIndex, endingIndex);

    return paginatedStats;
  },
};

const app = express();

/** NOTE: enabling all CORS requests because everything is just local development right now */
app.use(cors());

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
