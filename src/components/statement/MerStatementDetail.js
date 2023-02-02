import React, { useEffect, useState } from "react";
import axios from "axios";
import { CTable, CCard, CCardHeader, CCardBody } from "@coreui/react";
import { DateTime } from "luxon";

const MerStatementDetail = (props) => {
  const [active, setActivation] = useState(1);
  const [fintechStatus, setFintechStatus] = useState();
  const [object, setObject] = useState([]);

  const printProperties = (obj, level) => {
    for (let property in obj) {
      if (typeof obj[property] === "object") {
        console.log(`${" ".repeat(level * 4)}${property}:`);
        object.push({ key: property, value: obj[property] });
        printProperties(obj[property], level + 1);
      } else {
        object.push({ key: property, value: obj[property] });
        console.log(`${" ".repeat(level * 4)}${property}: ${obj[property]}`);
      }
    }
  };

  useEffect(() => {
    let status;
    printProperties(props.data.gw_json_log, 0);
    // if (props.data.gw_json_log) {
    //   if (props.data.gw_json_log.Message) {
    //     delete props.data.gw_json_log.Message.ThreeDSVars;
    //     status = props.data.gw_json_log.Message;
    //     Object.keys(status).forEach((e) =>
    //       object.push({ key: e, value: status[e] })
    //     );
    //   } else if (props.data.gw_json_log.XMLOut.Message) {
    //     delete props.data.gw_json_log.XMLOut.Message.ThreeDSVars;
    //     status = props.data.gw_json_log.XMLOut.Message;
    //     Object.keys(status).forEach((e) =>
    //       object.push({ key: e, value: status[e] })
    //     );
    //   } else if (props.data.gw_json_log) {
    //     status = props.data.gw_json_log;
    //     Object.keys(status).forEach((e) =>
    //       object.push({ key: e, value: status[e] })
    //     );
    //   }
    // }
  }, []);

  const setTextColor = (e) => {
    if (e == "INCOMPLETE") {
      return "text-dark";
    } else if (e == "DECLINED") {
      return "text-danger";
    } else if (e == "APPROVED") {
      return "text-success";
    } else if (e == "REVERSED") {
      return "text-primary";
    } else if (e == "REFUNDED") {
      return "text-info";
    } else if (e == "CANCELLED") {
      return "text-muted";
    } else {
      return "text-warning";
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
                  <td>
                    {" "}
                    <strong
                      className={
                        props.data.dispute_status == "P"
                          ? "text-warning"
                          : setTextColor(props.data.gw_order_status)
                      }
                    >
                      {props.data.dispute_status == "P"
                        ? "DISPUTED"
                        : props.data.gw_order_status}
                    </strong>
                  </td>
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
                  <td>Payable Amount</td>
                  <td>:</td>
                  <td>
                    {props.data.refund_amount
                      ? props.data.merchant_order_amount -
                        props.data.refund_amount
                      : props.data.merchant_order_amount}
                  </td>
                </tr>
                <tr>
                  <td>Settelement Status</td>
                  <td>:</td>
                  <td>
                    {props.data.settlement_flag == 1 ? "Settled" : "Unsettled"}
                  </td>
                </tr>
                <tr hidden={props.data.settlement_flag != 1 ? true : false}>
                  <td>Pay Date</td>
                  <td>:</td>
                  <td>
                    {" "}
                    {DateTime.fromISO(props.data.settlement_date, {
                      zone: "Asia/Dhaka",
                    }).toLocaleString(DateTime.DATETIME_MED)}
                  </td>
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
                  if (typeof e.value !== "object") {
                    return (
                      <tr>
                        <td>{e.key}</td>
                        <td>:</td>
                        <td>{e.value.slice(0, 50)}</td>
                      </tr>
                    );
                  }
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
