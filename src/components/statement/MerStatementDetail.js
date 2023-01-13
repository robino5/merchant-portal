import React from "react";
import { Container, Card, CTable } from "@coreui/react";
import { DateTime } from "luxon";

const MerStatementDetail = (props) => {
  console.log("props", props);
  return (
    <div className="d-flex flex-row align-items-center">
      <CTable className="table-borderless">
        <tbody>
          <tr>
            <td>Order number</td>
            <td>:</td>
            <td>{props.data.gw_order_id}</td>
          </tr>
          <tr>
            <td>Merchant</td>
            <td>:</td>
            <td>{props.data.merchant_id}</td>
          </tr>
          <tr>
            <td>TXN No</td>
            <td>:</td>
            <td>{props.data.txn_id}</td>
          </tr>
          <tr>
            <td>Session ID</td>
            <td>:</td>
            <td>{props.data.gw_session_id}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td>:</td>
            <td>{props.data.gw_order_status}</td>
          </tr>
          <tr>
            <td>Creation date</td>
            <td>:</td>
            <td>
              {DateTime.fromISO(props.data.created_at, {
                zone: "Asia/Dhaka",
              }).toLocaleString(DateTime.DATETIME_MED)}
            </td>
          </tr>
          <tr>
            <td>Last update date</td>
            <td>:</td>
            <td>
              {DateTime.fromISO(props.data.updated_at, {
                zone: "Asia/Dhaka",
              }).toLocaleString(DateTime.DATETIME_MED)}
            </td>
          </tr>
          <tr>
            <td>Amount</td>
            <td>:</td>
            <td>{props.data.merchant_order_amount}</td>
          </tr>
          {/* <tr>
            <td>Charge</td>
            <td>:</td>
            <td>{props.data.merchant_charge_amount}</td>
          </tr> */}
          <tr>
            <td>Refund Amount</td>
            <td>:</td>
            <td>{props.data.refund_amount}</td>
          </tr>
          <tr>
            <td>Total Amount</td>
            <td>:</td>
            <td>
              {props.data.merchant_order_amount + props.data.refund_amount}
            </td>
          </tr>
          <tr>
            <td>Pay Date</td>
            <td>:</td>
            <td>{props.data.gw_txn_timestamp}</td>
          </tr>
          <tr>
            <td>Description</td>
            <td>:</td>
            <td>{props.data.merchant_description}</td>
          </tr>
        </tbody>
      </CTable>
    </div>
  );
};

export default MerStatementDetail;
