import styled from "styled-components";

export const Table = styled.table`
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  border: 0;
  margin: 10px;
`;

export const TableHead = styled.th`
  /** default width */
  width: 90px;

  padding: 10px;
  text-align: center;

  th:nth-child(1) {
    width: 100px;
  }

  th:nth-child(2) {
    width: 50px;
  }
`;

export const TableRow = styled.tr`
  :nth-child(even) {
    background-color: #1e1f21;
  }
`;

export const TableData = styled.td`
  :nth-child(1),
  :nth-child(2),
  :nth-child(3) {
    text-align: left;
  }
  padding: 10px;
  text-align: center;
`;
