// TODO: loading state
// TODO: errory state
// TODO: icons for sorts
// TODO: pagination buttons style
// TODO: results per pag buttons style
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { RUSHING_STATS } from "./queries";
import Table from "./Table";

const Index = () => {
  const [numPerPg, setNumPerPg] = useState<10 | 25 | 50>(10);
  const [pgNum, setPgNum] = useState(1);
  const [playerFilter, setPlayerFilter] = useState("");
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [orderBy, setOrderBy] = useState<"asc" | "desc" | null>(null);

  const { loading, error, data } = useQuery(RUSHING_STATS, {
    variables: { pgNum, numPerPg, filter: playerFilter, sortBy, orderBy },
  });

  /**
   * some times we want to jump back to pg 1 automatically:
   * if numPerPage changes
   * if filter is applied
   */
  useEffect(() => {
    setPgNum(1);
  }, [numPerPg, playerFilter]);

  const sortableColumns = ["yds", "longest", "touchDown"];

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
        orderBy={orderBy}
        pgNum={pgNum}
        setNumPerPg={setNumPerPg}
        setOrderBy={setOrderBy}
        setPgNum={setPgNum}
        setSortBy={setSortBy}
        sortableColumns={sortableColumns}
        sortBy={sortBy}
        tableData={data?.rushingStats}
        totalCount={data?.totalCount}
      />
    </>
  );
};

export default Index;
