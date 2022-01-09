import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { RUSHING_STATS } from "./queries";
import Table from "./Table";

const Index = () => {
  const [numPerPg, setNumPerPg] = useState<10 | 25 | 50>(10);
  const [pgNum, setPgNum] = useState(1);
  const [playerFilter, setPlayerFilter] = useState("");

  const { loading, error, data } = useQuery(RUSHING_STATS, {
    variables: { pgNum, numPerPg, filter: playerFilter },
  });

  /**
   * if numPerPage changes, we want to go back to pg 1
   */
  useEffect(() => {
    setPgNum(1);
  }, [numPerPg]);

  return (
    <>
      <input
        onChange={(e) => setPlayerFilter(e.currentTarget.value)}
        placeholder="Enter player name"
        type="text"
        value={playerFilter}
      />
      <Table
        numPerPg={numPerPg}
        pgNum={pgNum}
        setNumPerPg={setNumPerPg}
        setPgNum={setPgNum}
        tableData={data?.rushingStats}
        totalCount={data?.totalCount}
      />
    </>
  );
};

export default Index;
