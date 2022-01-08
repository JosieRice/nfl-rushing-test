import { useState } from "react";
import { stripTypenames } from "../utils/utils";

interface Props {
  tableData: Record<string, number | string>[];
}

const Table = ({ tableData }: Props) => {
  const [page, setPage] = useState(1);
  const [numPerPage, setNumPerPage] = useState(10);

  if (!tableData) return <></>;
  const sanitizedData = stripTypenames(tableData);

  return (
    <>
      <table>
        <thead>
          <tr>
            {Object.keys(sanitizedData[0]).map((value) => {
              return <th key={value}>{value}</th>;
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
      <div>page {page}</div>
      <div>number per page {numPerPage}</div>
    </>
  );
};

export default Table;
