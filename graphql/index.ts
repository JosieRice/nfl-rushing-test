const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const rushingStats = require("./rushing.json");

const schema = buildSchema(`
  type RushingStats {
    Player: String!
    Team: String!
    Pos: String!
    Att: Int!
    Att_G: Float!
    Yds: Float!
    Avg: Float!
    Yds_G: Float!
    TD: Int!
    Lng: String!
    First: Int!
    First_Percent: Float!
    Twenty_Plus: Int!
    Fourty_Plus: Int!
    FUM: Int!
  }

  type Query {
    rushingStats: [RushingStats]
  }
`);

const rootValue = {
  rushingStats: () => {
    const sanitizedRushingStats = rushingStats.map((stat) => {
      let sanitizedStat = { ...stat };

      /** graphql schema doesn't support some of the characters in the keys provided, so this is linking them back up for the graphql response */
      sanitizedStat.Att_G = stat["Att/G"];
      sanitizedStat.Yds_G = stat["Yds/G"];
      sanitizedStat.First = stat["1st"];
      sanitizedStat.First_Percent = stat["1st%"];
      sanitizedStat.Twenty_Plus = stat["20+"];
      sanitizedStat.Fourty_Plus = stat["40+"];

      /**
       * changing all Yds into floating point integers and removing the commas as needed
       * this stat data should be coming from a database with stricter rules that don't allow this mix of data types
       * however I'm applying as a frontend dev, and setting that up seems like misplaced effort for the task assignment
       * in an ideal world, this data would come from a database instead of the json file and some of the logic in the resolver would be handled by the db
       */
      if (typeof stat.Yds === "string") {
        const yrdsToNumber = parseFloat(stat.Yds.replace(/,/g, ""));
        sanitizedStat.Yds = yrdsToNumber;
      }

      return sanitizedStat;
    });

    return sanitizedRushingStats;
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
