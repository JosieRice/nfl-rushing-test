import { Dispatch, SetStateAction } from "react";
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
  orderBy: "asc" | "desc" | null;
  pgNum: number;
  setNumPerPg: Dispatch<SetStateAction<10 | 25 | 50>>;
  setOrderBy: Dispatch<SetStateAction<"asc" | "desc" | null>>;
  setPgNum: Dispatch<SetStateAction<number>>;
  setSortBy: Dispatch<SetStateAction<string | null>>;
  sortableColumns?: string[];
  sortBy: string | null;
  tableData: Record<string, number | string>[];
  totalCount: number;
}

const Table = ({
  numPerPg,
  orderBy,
  pgNum,
  setNumPerPg,
  setOrderBy,
  setPgNum,
  setSortBy,
  sortableColumns,
  sortBy,
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

  const handleSort = (value: string) => {
    if (value !== sortBy) {
      setSortBy(value);
      setOrderBy("asc");
    } else if (value === sortBy && (orderBy === null || orderBy === "desc")) {
      setOrderBy("asc");
    } else if (value === sortBy && orderBy === "asc") {
      setOrderBy("desc");
    }
  };

  const handleCSVDownload = () => {
    const csvData = [
      Object.keys(sanitizedData[0]).map((key) => {
        return cleanHeaderNames[key];
      }),
      ...sanitizedData.map((item: Record<string, number | string>) => [
        item.player,
        item.team,
        item.pos,
        item.att,
        item.attPerGame,
        item.yds,
        item.avg,
        item.ydsPerGame,
        item.touchDown,
        item.longest,
        item.first,
        item.firstPercent,
        item.twentyPlus,
        item.fourtyPlus,
        item.fumble,
      ]),
    ];

    let csvContent =
      "data:text/csv;charset=utf-8," +
      csvData.map((e) => e.join(",")).join("\n");

    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri, "Download");
  };

  return (
    <>
      <StyledTable>
        <caption>Football players' rushing statistics</caption>
        <thead>
          <tr>
            {Object.keys(sanitizedData[0]).map((value) => {
              const sortable = sortableColumns?.includes(value);

              const sortAsc = value === sortBy && orderBy === "asc";
              const sortDesc = value === sortBy && orderBy === "desc";
              const sortNone = value !== sortBy;
              return (
                <TableHead scope="row" key={value}>
                  {cleanHeaderNames[value] ?? value}
                  {sortable && (
                    <button onClick={() => handleSort(value)}>
                      {(sortNone && `up/down`) ||
                        (sortAsc && `down`) ||
                        (sortDesc && `up`)}
                    </button>
                  )}
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
      <div>
        <button disabled={numPerPg === 10} onClick={() => setNumPerPg(10)}>
          10
        </button>
        <button disabled={numPerPg === 25} onClick={() => setNumPerPg(25)}>
          25
        </button>
        <button disabled={numPerPg === 50} onClick={() => setNumPerPg(50)}>
          50
        </button>
      </div>
      <button onClick={handleCSVDownload}>download as csv</button>
    </>
  );
};

export default Table;
