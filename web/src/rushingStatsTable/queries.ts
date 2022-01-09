import { gql } from "@apollo/client";

export const RUSHING_STATS = gql`
  query RushingStats($pgNum: Int!, $numPerPg: Int!, $filter: String!) {
    totalCount(filter: $filter)
    rushingStats(pgNum: $pgNum, numPerPg: $numPerPg, filter: $filter) {
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
