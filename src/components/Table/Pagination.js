import { useState } from "react";
import Pagination from "@mui/material/Pagination";

const PaginationComponent = ({ totalCount, paginationHandler }) => {
  const [page, setPage] = useState(1);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    paginationHandler(newPage);
  };

  return (
    <Pagination
      count={totalCount}
      page={page}
      variant="outlined"
      shape="rounded"
      onChange={handleChangePage}
    />
  );
};

export default PaginationComponent;
