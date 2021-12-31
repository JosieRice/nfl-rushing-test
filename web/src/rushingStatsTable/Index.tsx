import { useQuery } from "@apollo/client";
import { RUSHING_STATS } from "./queries";

const Index = () => {
  const { loading, error, data } = useQuery(RUSHING_STATS);

  console.log({ loading });
  console.log({ error });
  console.log({ data });
  return <div>Im going to be a table</div>;
};

export default Index;
