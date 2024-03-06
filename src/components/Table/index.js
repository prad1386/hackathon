import React, { useMemo } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import Pagination from "./Pagination";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import "./index.scss";

const ReactTable = ({ COLUMNS, MOCK_DATA }) => {
  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => MOCK_DATA, []);

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: {},
    },
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    pageOptions,
    gotoPage,
    setPageSize,
    state,
    prepareRow,
  } = tableInstance;

  const { pageSize } = state;

  const handlePageChange = (value) => {
    gotoPage(value - 1);
  };

  return (
    <div className="table-container">
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  <span>
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <KeyboardArrowDownIcon />
                      ) : (
                        <KeyboardArrowUpIcon />
                      )
                    ) : (
                      ""
                    )}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="pagination-container">
        <Select
          className="pageSize-select"
          value={pageSize}
          label="pageSize"
          displayEmpty
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          {[10, 50, 75, 100].map((pageSize) => (
            <MenuItem key={pageSize} value={pageSize}>
              {pageSize} / Page
            </MenuItem>
          ))}
        </Select>

        <Pagination
          totalCount={pageOptions.length}
          paginationHandler={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ReactTable;
