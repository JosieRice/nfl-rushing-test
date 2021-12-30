import { gql, useQuery } from "@apollo/client";

const RUSHING_STATS = gql`
  query RushingStats {
    totalCount
  }
`;

const App = () => {
  const { loading, error, data } = useQuery(RUSHING_STATS);

  console.log({ loading });
  console.log({ error });
  console.log({ data });

  return (
    <div>
      <header>
        <p>Basic React component rendering</p>
      </header>
    </div>
  );
};

export default App;
