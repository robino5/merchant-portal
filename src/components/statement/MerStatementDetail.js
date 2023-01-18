import React, { useEffect, useState } from "react";
import axios from "axios";
import { CTable, CCard, CCardHeader, CCardBody } from "@coreui/react";
import { DateTime } from "luxon";

const MerStatementDetail = (props) => {
  const [active, setActivation] = useState(1);
  const [fintechStatus, setFintechStatus] = useState();
  const [object, setObject] = useState([]);
  console.log(fintechStatus);

  useEffect(() => {
    let status;
    if (props.data.gw_order_status != null) {
      if (props.data.gw_json_log.Message) {
        delete props.data.gw_json_log.Message.ThreeDSVars;
        status = props.data.gw_json_log.Message;
        Object.keys(status).forEach((e) =>
          object.push({ key: e, value: status[e] })
        );
      } else if (props.data.gw_json_log) {
        status = props.data.gw_json_log;
        Object.keys(status).forEach((e) =>
          object.push({ key: e, value: status[e] })
        );
      }
    }
  }, []);

  const getTransactionStatus = (value) => {
    if (value.dispute_status == "N") {
      return value.gw_order_status;
    } else if (value.dispute_status == "P") {
      return "DISPUTED";
    } else if (value.dispute_status == "C") {
      return "CHARGEBACK";
    } else if (value.dispute_status == "D") {
      return "DECLINE";
    } else if (value.dispute_status == "R") {
      return "REVERSAL";
    }
  };

  return (
    <div className="">
      <CCard className="bg-white">
        <CCardHeader>
          <ul
            className="nav nav-tabs justify-content-start"
            id="pills-tab"
            role="tablist"
          >
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${active == 1 ? "active" : ""}`}
                onClick={() => setActivation(1)}
              >
                Description
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${active == 2 ? "active" : ""}`}
                onClick={() => setActivation(2)}
              >
                Additional parameters
              </button>
            </li>
          </ul>
        </CCardHeader>
        <CCardBody>
          <div hidden={active != 1 ? true : false}>
            <CTable className="table-borderless">
              <tbody>
                <tr>
                  <td>Order number</td>
                  <td>:</td>
                  <td>{props.data.gw_order_id}</td>
                </tr>
                <tr>
                  <td>Merchant Name</td>
                  <td>:</td>
                  <td>{props.data.merchant_name}</td>
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
                  <td>{getTransactionStatus(props.data)}</td>
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
                <tr>
                  <td>Refund Amount</td>
                  <td>:</td>
                  <td>
                    {props.data.refund_amount
                      ? props.data.refund_amount - props.data.pgw_charge
                      : 0}
                  </td>
                </tr>
                <tr>
                  <td>Total Amount</td>
                  <td>:</td>
                  <td>
                    {props.data.refund_amount
                      ? props.data.merchant_order_amount -
                        props.data.refund_amount
                      : props.data.merchant_order_amount}
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
          <div hidden={active != 2 ? true : false}>
            <CTable className="table-borderless">
              <tbody>
                {object?.map((e) => {
                  return (
                    <tr>
                      <td>{e.key}</td>
                      <td>:</td>
                      <td>{e.value.slice(0, 55)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default MerStatementDetail;
