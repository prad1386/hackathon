import React, {
  useMemo,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { useTable, usePagination } from "react-table";
import TableFilter from "react-table-filter";
import Pagination from "./Pagination";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Loader } from "@utils/tools";
import { constants } from "@constants";
import "./index.scss";
import "react-table-filter/lib/styles.css";

const ReactTable = forwardRef(
  (
    { COLUMNS, DATA, isLoading, disableColumns, filteredData: testdata },
    ref
  ) => {
    const columns = useMemo(() => COLUMNS, [COLUMNS]);
    const tableData = useMemo(() => DATA, [DATA]);

    const filterRef = useRef(null);
    const [filteredData, setFilteredData] = useState([]);
    const tableInstance = useTable(
      {
        columns,
        data: filteredData,
        initialState: {
          hiddenColumns: disableColumns ? disableColumns : [],
        },
      },
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

    // Reset Selected Filter
    useEffect(() => {
      filterRef.current.reset(tableData, true);
      setFilteredData(tableData);
    }, [tableData]);

    const updateFilterHandler = (newData) => {
      setFilteredData(newData);
      testdata(newData);
    };

    useImperativeHandle(ref, () => ({
      clearAllFilter() {
        filterRef.current.reset(tableData, true);
        setFilteredData(tableData);
      },
    }));

    return (
      <div className="table-container">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <TableFilter
                {...headerGroup.getHeaderGroupProps()}
                rows={tableData}
                onFilterUpdate={updateFilterHandler}
                ref={filterRef}
              >
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps([
                      { className: column.className },
                    ])}
                    showsearch={"true"}
                    filterkey={column.id}
                    key={column.id}
                    casesensitive={"true"}
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </TableFilter>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {isLoading ? (
              <tr>
                <td colSpan="4">
                  <Loader />
                </td>
              </tr>
            ) : (
              page.map((row) => {
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
              })
            )}
          </tbody>
        </table>
        {!isLoading && (tableData.length <= 0 || tableData === null) && (
          <span style={{ fontSize: "14px" }}>{constants.TEXT_NO_RECORDS}</span>
        )}
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
  }
);

export default ReactTable;
