import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { DateTime } from "luxon";

const SettledTran = (props) => {
  console.log(props.data);

  const column = [
    {
      name: "Order ID",
      selector: (row) => row.merchant_tran_id,
      sortable: true,
      minWidth: "135px;",
    },
    {
      name: "Transaction ID",
      selector: (row) => row.txn_id,
      sortable: true,
      minWidth: "200px;",
    },
    {
      name: "Transaction Date",
      selector: (row) =>
        DateTime.fromISO(row.gw_txn_timestamp, {
          zone: "Asia/Dhaka",
        }).toLocaleString(DateTime.DATETIME_MED),
      sortable: true,
      minWidth: "70px;",
    },
    {
      name: "Order Amount",
      selector: (row) => parseFloat(row.merchant_order_amount).toFixed(2),
      sortable: true,
    },
    {
      name: "Bank Fee",
      selector: (row) => parseFloat(row.bank_fee).toFixed(2),
      sortable: true,
    },
    {
      name: "PGW Fee",
      selector: (row) => parseFloat(row.pgw_fee).toFixed(2),
      sortable: true,
    },
    {
      name: "Refund Amount",
      selector: (row) =>
        parseFloat(row.refund_amount ? row.refund_amount : 0).toFixed(2),
      sortable: true,
    },
    {
      name: "Payable Amount",
      selector: (row) =>
        parseFloat(
          row.merchant_order_amount  - row.refund_amount
        ).toFixed(2),
      sortable: true,
    },
  ];
  return (
    <DataTable
      title="Settled Transaction List"
      data={props.data}
      columns={column}
    />
  );
};
export default SettledTran;
