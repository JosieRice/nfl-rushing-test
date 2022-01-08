import { gql } from "@apollo/client";

export const RUSHING_STATS = gql`
  query RushingStats ($pgNum: Int!, $numPerPage: Int!) {
    totalCount
    rushingStats(pgNum: $pgNum, numPerPage: $numPerPage) {
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
