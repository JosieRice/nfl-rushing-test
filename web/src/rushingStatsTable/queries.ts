import { gql } from "@apollo/client";

export const RUSHING_STATS = gql`
  query RushingStats {
    totalCount
    rushingStats(numPerPage: 10, pgNum: 1) {
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
