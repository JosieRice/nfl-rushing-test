import { useQuery } from "@apollo/client";
import { RUSHING_STATS } from "./queries";
import Table from "./Table";

const Index = () => {
  const { loading, error, data } = useQuery(RUSHING_STATS, {
    variables: { pgNum: 1, numPerPage: 10 },
  });

  return <Table tableData={data?.rushingStats} />;
};

export default Index;
