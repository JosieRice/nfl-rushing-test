import { stripTypenames } from "../utils/utils";
import { cleanHeaderNames } from "./data";

interface Props {
  numPerPg: 10 | 25 | 50;
  pgNum: number;
  setNumPerPg: (arg0: 10 | 25 | 50) => void;
  setPgNum: (arg0: number) => void;
  tableData: Record<string, number | string>[];
  totalCount: number;
}

const Table = ({
  numPerPg,
  pgNum,
  setNumPerPg,
  setPgNum,
  tableData,
  totalCount,
}: Props) => {
  /** wait to render until data exists */
  const missingData = !tableData || !totalCount || tableData.length === 0;
  if (missingData) return <></>;

  /** remove unwanted graphql noise */
  const sanitizedData = stripTypenames(tableData);

  /** pagination stuff */
  const pages = Math.ceil(totalCount / numPerPg);
  const pagesArr = Array.from({ length: pages });

  return (
    <>
      <table>
        <thead>
          <tr>
            {Object.keys(sanitizedData[0]).map((value) => {
              return <th key={value}>{cleanHeaderNames[value] ?? value}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {sanitizedData.map((row: string | number, i: number) => {
            return (
              <tr key={i}>
                {Object.values(row).map((value, i) => {
                  return <td key={i}>{value}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* pagination (pages) */}
      <div>
        page
        {pagesArr.map((p, i) => {
          const page = i + 1;
          return (
            <button
              disabled={pgNum === page}
              key={i}
              onClick={() => setPgNum(page)}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* pagination (num per page) */}
      <button disabled={numPerPg === 10} onClick={() => setNumPerPg(10)}>
        10
      </button>
      <button disabled={numPerPg === 25} onClick={() => setNumPerPg(25)}>
        25
      </button>
      <button disabled={numPerPg === 50} onClick={() => setNumPerPg(50)}>
        50
      </button>

      {/* table metadata */}
      <div>Total Results: {totalCount}</div>
    </>
  );
};

export default Table;
