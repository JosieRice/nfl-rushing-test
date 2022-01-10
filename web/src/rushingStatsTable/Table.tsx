import { stripTypenames } from "../utils/utils";
import { cleanHeaderNames } from "./data";
import {
  Table as StyledTable,
  TableData,
  TableHead,
  TableRow,
} from "./Table.style";

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

  return (
    <>
      <StyledTable>
        <caption>Football players' rushing statistics</caption>
        <thead>
          <tr>
            {Object.keys(sanitizedData[0]).map((value) => {
              return (
                <TableHead scope="row" key={value}>
                  {cleanHeaderNames[value] ?? value}
                </TableHead>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sanitizedData.map((row: string | number, i: number) => {
            return (
              <TableRow key={i}>
                {Object.values(row).map((value, i) => {
                  return <TableData key={i}>{value}</TableData>;
                })}
              </TableRow>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" colSpan={2}>
              Total Results
            </th>
            <td colSpan={2}>{totalCount}</td>
          </tr>
        </tfoot>
      </StyledTable>

      {/* pagination (pages) */}
      <div>
        <button
          disabled={pgNum === 1}
          onClick={() => setPgNum(1)}
        >{`<<`}</button>
        <button
          disabled={pgNum === 1}
          onClick={() => setPgNum(pgNum - 1)}
        >{`<`}</button>
        {[...Array(pages)].map((p, i) => {
          const page = i + 1;
          const twoAbove = page >= pgNum && page <= pgNum + 2;
          const twoBelow = page <= pgNum && page >= pgNum - 2;
          if (twoAbove || twoBelow) {
            return (
              <button
                disabled={pgNum === page}
                key={i}
                onClick={() => setPgNum(page)}
              >
                {page}
              </button>
            );
          }
        })}
        <button
          disabled={pgNum === pages}
          onClick={() => setPgNum(pgNum + 1)}
        >{`>`}</button>
        <button
          disabled={pgNum === pages}
          onClick={() => setPgNum(pages)}
        >{`>>`}</button>
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
    </>
  );
};

export default Table;
