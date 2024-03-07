import { CSVLink } from "react-csv";
import React from "react";
import { useEffect, useRef } from "react";

const CSVExport = ({ data, filename, columnheader }) => {
  const name = filename + ".csv";
  const headersCSV = columnheader;

  const csvLink = useRef();
  useEffect(() => {
    if (data) {
      csvLink.current.link.click();
    }
  }, [data, filename]);
  return (
    <div>
      <CSVLink
        headers={headersCSV}
        data={data}
        filename={name}
        data-interception="off"
        ref={csvLink}
      />
    </div>
  );
};

export default CSVExport;
