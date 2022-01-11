import { gql } from "@apollo/client";

// TODO: figure out how to use the sortBy and orderBy enum types properly
export const RUSHING_STATS = gql`
  query RushingStats(
    $pgNum: Int!
    $numPerPg: Int!
    $filter: String!
    $sortBy: String
    $orderBy: String
  ) {
    totalCount(filter: $filter)
    rushingStats(
      pgNum: $pgNum
      numPerPg: $numPerPg
      filter: $filter
      sortBy: $sortBy
      orderBy: $orderBy
    ) {
      player
      team
      pos
      att
      attPerGame
      yds
      avg
      ydsPerGame
      touchDown
      longest
      first
      firstPercent
      twentyPlus
      fourtyPlus
      fumble
    }
  }
`;
