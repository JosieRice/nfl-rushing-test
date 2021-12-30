const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const rushingStats = require("./rushing.json");

const schema = buildSchema(`
  type RushingStats {
    Player: String!
    Team: String!
    Pos: String!
    Att: Int
    Att_G: Float
    Yds: Int
    Avg: Float
    Yds_G: Float
    TD: Int
    Lng: String
    First: Int
    First_Percent: Float
    Twenty_Plus: Int
    Fourty_Plus: Int
    FUM: Int
  }

  type Query {
    rushingStats: [RushingStats]
  }
`);

const rootValue = {
  rushingStats: () => {
    return rushingStats;
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
