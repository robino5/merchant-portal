import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import {
  CButton,
  CRow,
  CCol,
  CForm,
  CCard,
  CCardBody,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CFormLabel,
  CFormInput,
  CFormSelect,
} from "@coreui/react";
import { DateTime } from "luxon";
import MerStatementDetail from "./MerStatementDetail";
import { CSVLink } from "react-csv";
import CIcon from "@coreui/icons-react";
import { cilDescription, cilPrint } from "@coreui/icons";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../assets/images/Logo";

const MerStatement = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [orderAmount, setOrderAmount] = useState("");
  const [txn, setTxnId] = useState("");
  const [periodFrom, setPeriodFrom] = useState("");
  const [periodTo, setPeriodTo] = useState("");
  const [staus, setStatus] = useState("");
  const [currency, setCurrency] = useState("");
  const [amontFrom, setAmountFrom] = useState("");
  const [amontTo, setAmountTo] = useState("");
  const [orderby, setOrderBy] = useState("");
  const [statement, setStatement] = useState();
  const [statementdetails, setStatementDetails] = useState();
  console.log(statement);

  const getStatementList = async () => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    await axios
      .get(`${process.env.REACT_APP_API_URL}txn-statements/merchant`, {
        headers,
      })
      .then((responce) => {
        console.log(responce.data);
        setStatement(responce.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  const getUser = () => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    axios
      .get(`${process.env.REACT_APP_API_URL}mruser-auth/login`, { headers })
      .then((responce) => {
        console.log(responce.data.user_id);
        localStorage.setItem("username", responce.data.user_id);
      })
      .catch((error) => {
        console.error("There was an error!", error);
        if (error.response.status == 401) {
          navigate("/#");
        }
      });
  };

  const openDetails = (e) => {
    setStatementDetails(e);
    setVisible(!visible);
  };

  //   const handleClose = () => setShow(false)
  //   const handleShow = () => setShow(true)

  const handleOrderNumber = (e) => {
    setOrderAmount(e.target.value);
  };
  const handleTxnId = (e) => {
    setTxnId(e.target.value);
  };
  const handlePeriodFrom = (e) => {
    setPeriodFrom(e.target.value);
  };
  const handlePeriodTo = (e) => {
    setPeriodTo(e.target.value);
  };
  const handleStatus = (e) => {
    setStatus(e.target.value);
  };
  const handleCurrency = (e) => {
    setCurrency(e.target.value);
  };
  const handleAmountFrom = (e) => {
    setAmountFrom(e.target.value);
  };
  const handleAmountTo = (e) => {
    setAmountTo(e.target.value);
  };
  const handleOrderBy = (e) => {
    setOrderBy(e.target.value);
  };

  const onCancel = () => {
    navigate("/#");
  };

  //   console.log(orderAmount);
  //   console.log(periodTo);

  const searchStatemet = (e) => {
    e.preventDefault();

    const data = {
      order_id: orderAmount,
      txn_id: txn,
      period_from: `${periodFrom}T00:00:00`,
      period_to: `${periodTo}T23:59:59`,
      status: staus,
      currency: currency,
      amount_from: amontFrom,
      amount_to: amontTo,
      order_by: orderby,
    };
    if (!orderAmount) {
      delete data.order_id;
    }
    if (!txn) {
      delete data.txn_id;
    }
    if (!periodFrom) {
      delete data.period_from;
    }
    if (!periodTo) {
      delete data.period_to;
    }
    if (!staus) {
      delete data.status;
    }
    if (!currency || currency == "ALL") {
      delete data.currency;
    }
    if (!amontFrom) {
      delete data.amount_from;
    }
    if (!amontTo) {
      delete data.amount_to;
    }
    if (!orderby) {
      delete data.order_by;
    }

    const encodeDataToURL = (data) => {
      return Object.keys(data)
        .map((value) => `${value}=${encodeURIComponent(data[value])}`)
        .join("&");
    };
    console.log(encodeDataToURL(data));
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    axios
      .get(
        `${
          process.env.REACT_APP_API_URL
        }txn-statements/merchant?${encodeDataToURL(data)}`,
        {
          headers,
        }
      )
      .then((response) => {
        console.log(response);
        setStatement(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });

    // console.log(data);
  };

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

  const column = [
    {
      name: "SL",
      selector: (row, index) => index + 1,
      width: "55px",
    },
    {
      name: "Order ID",
      selector: (row) => row.merchant_tran_id,
      minWidth: "135px;",
    },
    {
      name: "Transection ID",
      selector: (row) => row.txn_id,
      minWidth: "200px;",
    },
    {
      name: "Merchant Short Name",
      sortable: true,
      selector: (row) => row.short_name,
      minWidth: "70px;",
    },

    {
      name: "Creation date",
      selector: (row) =>
        DateTime.fromISO(row.gw_txn_timestamp, {
          zone: "Asia/Dhaka",
        }).toLocaleString(DateTime.DATETIME_MED),
      minWidth: "70px;",
    },
    {
      name: "Order Amount",
      selector: (row) => row.merchant_order_amount,
    },
    {
      name: "Refund Amount",
      selector: (row) => (row.refund_amount ? row.refund_amount : 0),
    },
    {
      name: "Payable Amount",
      selector: (row) =>
        row.refund_amount
          ? row.merchant_order_amount - row.refund_amount
          : row.merchant_order_amount,
    },
    {
      name: "Order Status",
      selector: (row) => (
        <strong
          className={
            row.dispute_status == "P"
              ? "text-warning"
              : setTextColor(row.gw_order_status)
          }
        >
          {row.dispute_status == "P" ? "DISPUTED" : row.gw_order_status}
        </strong>
      ),
    },
    {
      name: "Description",
      selector: (row) => row.merchant_description,
    },
    {
      name: "Action",
      selector: (row) => (
        <div className="d-flex justify-content-center">
          <CButton
            className="btn btn-sm d-inline mx-1"
            CCColor="info"
            onClick={() => {
              openDetails(row);
            }}
          >
            Detail
          </CButton>
        </div>
      ),
    },
  ];

  const getotalOrderAmount = (e) => {
    let sumOrderAmount = 0;
    e.map((element) => {
      sumOrderAmount += element.merchant_order_amount;
    });
    return parseFloat(sumOrderAmount).toFixed(2);
  };

  const getotalBankFee = (e) => {
    let sumBankFee = 0;
    e.map((element) => {
      sumBankFee += element.bank_charge;
    });
    return parseFloat(sumBankFee).toFixed(2);
  };

  const getotalPgwFee = (e) => {
    let sumBankFee = 0;
    e.map((element) => {
      sumBankFee += element.pgw_charge;
    });
    return parseFloat(sumBankFee).toFixed(2);
  };
  const getotalrefundAMount = (e) => {
    let sumBankFee = 0;
    e.map((element) => {
      sumBankFee += element.refund_amount;
    });
    return parseFloat(sumBankFee).toFixed(2);
  };
  const getotal = (e) => {
    let sumBankFee = 0;
    e.map((element) => {
      sumBankFee += element.merchant_order_amount - element.refund_amount;
    });
    return parseFloat(sumBankFee).toFixed(2);
  };

  const getDateTime = (e) => {
    let date = DateTime.fromISO(e, {
      zone: "Asia/Dhaka",
    }).toLocaleString(DateTime.DATETIME_MED);

    return date;
  };

  const getTrnCount = (e, status) => {
    let count = 0;
    e?.map((element) => {
      if (element.gw_order_status == status) {
        count += 1;
      }
    });
    return count;
  };

  const setDateForEcecl = (e) => {
    let data = [];
    e?.map((element) => {
      data.push({
        Order_ID: element.merchant_tran_id,
        Transaction_ID: element.txn_id,
        Merchant_id: element.merchant_id,
        Merchant_Name: element.merchant_name,
        Merchant_short_name: element.short_name,
        Transaction_date: DateTime.fromISO(element.created_at, {
          zone: "Asia/Dhaka",
        }).toLocaleString(DateTime.DATETIME_MED),
        Order_Amount: parseFloat(element.merchant_order_amount).toFixed(2),
        Bank_fee: element.bank_charge,
        Pgw_fee: element.pgw_charge,
        Refund_Amount: element.refund_amount ? element.refund_amount : 0,
        Payable_Amount: parseFloat(
          element.merchant_order_amount - element.refund_amount
        ).toFixed(2),
        Transaction_Status: element.gw_order_status,
      });
    });
    return data;
  };

  const gettrnAmount = (e, status) => {
    let sum = 0;
    e?.map((element) => {
      if (element.gw_order_status == status) {
        sum +=
          element.merchant_order_amount +
          element.pgw_charge -
          element.refund_amount;
      }
    });
    return parseFloat(sum).toFixed(2);
  };

  const getDisputeCount = (e) => {
    let count = 0;
    e?.map((element) => {
      if (element.dispute_status == "P") {
        count += 1;
      }
    });
    return count;
  };

  const getDisputeAmount = (e) => {
    let sum = 0;
    e?.map((element) => {
      if (element.dispute_status == "P") {
        sum +=
          element.merchant_order_amount +
          element.pgw_charge -
          element.refund_amount;
      }
    });
    return parseFloat(sum).toFixed(2);
  };

  const dawonloadReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(8);
    var pageCount = doc.internal.getNumberOfPages();
    var pageCurrent = doc.internal.getCurrentPageInfo().pageNumber;
    console.log(doc.internal.getNumberOfPages());
    doc.addImage(logo, "JPEG", 80, 3);
    doc.text(`Merchant Id:${statement[0].merchant_id}`, 15, 25);
    doc.text(`Merchant Name:${statement[0].merchant_name}`, 65, 25);
    doc.text(`Merchant Short Name:${statement[0].short_name}`, 140, 25);
    doc.text(
      `Period:${periodFrom ? getDateTime(periodFrom) : ""} - ${
        periodTo ? getDateTime(periodTo) : ""
      }`,
      68,
      32
    );
    var pageSize = doc.internal.pageSize;
    var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();

    doc.text(
      `Print Date & Time:${DateTime.fromISO(DateTime.now(), {
        zone: "Asia/Dhaka",
      }).toLocaleString(DateTime.DATETIME_MED)}`,
      15,
      pageHeight - 10
    );
    doc.text(
      `Print by:${localStorage.getItem("username")}`,
      100,
      pageHeight - 10
    );
    doc.text(`Powered By Moneybag`, 165, pageHeight - 10);
    doc.text("page: " + pageCurrent + " of " + pageCount, 175, pageHeight - 5);
    doc.autoTable({
      columns: [
        { header: "Order ID", dataKey: "merchant_tran_id" },
        { header: "Transaction ID", dataKey: "txn_id" },
        {
          header: "Transaction Date",
          dataKey: "created_at",
        },
        { header: "Order Amount", dataKey: "merchant_order_amount" },
        { header: "Bank Fee", dataKey: "bank_charge" },
        { header: "PGW Fee", dataKey: "pgw_charge" },
        { header: "Refund Amount", dataKey: "refund_amount" },
        { header: "Payable Amount", dataKey: "merchant_charge_amount" },
        { header: "Transaction Status", dataKey: "gw_order_status" },
      ],

      body: [
        ...statement.map((element) => [
          element.merchant_tran_id,
          element.txn_id,
          DateTime.fromISO(element.gw_txn_timestamp, {
            zone: "Asia/Dhaka",
          }).toLocaleString(DateTime.DATETIME_MED),
          parseFloat(element.merchant_order_amount).toFixed(2),
          parseFloat(element.bank_charge).toFixed(2),
          parseFloat(element.pgw_charge).toFixed(2),
          parseFloat(element.refund_amount).toFixed(2),
          parseFloat(
            element.refund_amount
              ? element.merchant_order_amount - element.refund_amount
              : element.merchant_order_amount
          ).toFixed(2),
          element.gw_order_status,
        ]),
        [
          {
            content: `Total-Amount =`,
            colSpan: 3,
            styles: {
              fillColor: [245, 203, 176],
            },
          },
          {
            content: getotalOrderAmount(statement),
            colSpan: 1,
            styles: {
              fillColor: [245, 203, 176],
            },
          },
          {
            content: getotalBankFee(statement),
            colSpan: 1,
            styles: {
              fillColor: [245, 203, 176],
            },
          },
          {
            content: getotalPgwFee(statement),
            colSpan: 1,
            styles: {
              fillColor: [245, 203, 176],
            },
          },
          {
            content: getotalrefundAMount(statement),
            colSpan: 1,
            styles: {
              fillColor: [245, 203, 176],
            },
          },
          {
            content: getotal(statement),
            colSpan: 2,
            styles: {
              fillColor: [245, 203, 176],
            },
          },
        ],
        [
          {
            content: `Approved Transaction = ${getTrnCount(
              statement,
              "APPROVED"
            )}`,
            colSpan: 2,
            styles: {
              fillColor: [187, 237, 192],
            },
          },
          {
            content: `Approved Amount = ${gettrnAmount(statement, "APPROVED")}`,
            colSpan: 2,
            styles: {
              fillColor: [187, 237, 192],
            },
          },
          {
            content: `Disputed Transaction = ${getDisputeCount(statement)}`,
            colSpan: 3,
            styles: {
              fillColor: [246, 252, 192],
            },
          },
          {
            content: `Disputed Amount = ${getDisputeAmount(statement)}`,
            colSpan: 3,
            styles: {
              fillColor: [246, 252, 192],
            },
          },
        ],
        [
          {
            content: `Cancelled Transaction = ${getTrnCount(
              statement,
              "CANCELLED"
            )}`,
            colSpan: 2,
            styles: {
              fillColor: [250, 195, 195],
            },
          },
          {
            content: `Cancelled Amount = ${gettrnAmount(
              statement,
              "CANCELLED"
            )}`,
            colSpan: 2,
            styles: {
              fillColor: [250, 195, 195],
            },
          },
          {
            content: `Declined Transaction = ${getTrnCount(
              statement,
              "DECLINED"
            )}`,
            colSpan: 3,
            styles: {
              fillColor: [250, 195, 195],
            },
          },
          {
            content: `Declined Amount = ${gettrnAmount(statement, "DECLINED")}`,
            colSpan: 3,
            styles: {
              fillColor: [250, 195, 195],
            },
          },
        ],
        [
          {
            content: `Reversed Transaction = ${getTrnCount(
              statement,
              "REVERSED"
            )}`,
            colSpan: 2,
            styles: {
              fillColor: [199, 220, 242],
            },
          },
          {
            content: `Reversed Amount = ${gettrnAmount(statement, "REVERSED")}`,
            colSpan: 2,
            styles: {
              fillColor: [199, 220, 242],
            },
          },
          {
            content: `Refunded Transaction = ${getTrnCount(
              statement,
              "REFUNDED"
            )}`,
            colSpan: 3,
            styles: {
              fillColor: [210, 247, 246],
            },
          },
          {
            content: `Refunded Amount = ${gettrnAmount(statement, "REFUNDED")}`,
            colSpan: 3,
            styles: {
              fillColor: [210, 247, 246],
            },
          },
        ],
        [
          {
            content: `Incomplete Transaction = ${getTrnCount(
              statement,
              "INCOMPLETE"
            )}`,
            colSpan: 2,
            styles: {
              fillColor: [243, 220, 245],
            },
          },
          {
            content: `Incomplete Amount = ${gettrnAmount(
              statement,
              "INCOMPLETE"
            )}`,
            colSpan: 2,
            styles: {
              fillColor: [243, 220, 245],
            },
          },
        ],
      ],
      showHead: "everyPage",
      styles: { fontSize: 6 },
      margin: { top: 35 },
    });
    for (var i = 0; i < pageCount; i++) {
      doc.setPage(i);
      doc.addImage(logo, "JPEG", 80, 3);
      doc.text(`Merchant Id:${statement[0].merchant_id}`, 15, 25);
      doc.text(`Merchant Name:${statement[0].merchant_name}`, 65, 25);
      doc.text(`Merchant Short Name:${statement[0].short_name}`, 140, 25);
      doc.text(
        `Period:${periodFrom ? getDateTime(periodFrom) : ""} - ${
          periodTo ? getDateTime(periodTo) : ""
        }`,
        68,
        32
      );
      var pageSize = doc.internal.pageSize;
      var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();

      doc.text(
        `Print Date & Time:${DateTime.fromISO(DateTime.now(), {
          zone: "Asia/Dhaka",
        }).toLocaleString(DateTime.DATETIME_MED)}`,
        15,
        pageHeight - 10
      );
      doc.text(
        `Print by:${localStorage.getItem("username")}`,
        100,
        pageHeight - 10
      );
      doc.text(`Powered By Moneybag`, 165, pageHeight - 10);
      doc.text(
        "page: " + pageCurrent + " of " + pageCount,
        175,
        pageHeight - 5
      );
    }
    console.log(pageCount);

    doc.save(`transation${Date()}.pdf`);
  };

  useEffect(() => {
    getStatementList();
    getUser();
  }, []);

  return (
    <div className="">
      <CRow>
        <CCol md={3}>
          <CCard>
            <CCardBody>
              <CForm>
                <CFormLabel>Order ID</CFormLabel>
                <CFormInput
                  size="sm"
                  type="text"
                  onChange={handleOrderNumber}
                />
                <CFormLabel>Transaction ID</CFormLabel>
                <CFormInput size="sm" type="text" onChange={handleTxnId} />
                <CFormLabel className="mt-2">Period from</CFormLabel>
                <CFormInput size="sm" type="date" onChange={handlePeriodFrom} />
                <CFormLabel className="mt-2">Period To</CFormLabel>
                <CFormInput size="sm" type="date" onChange={handlePeriodTo} />
                <CFormLabel className="mt-2">Status</CFormLabel>
                <CFormSelect size="sm" onChange={handleStatus}>
                  <option value={""}>Select One</option>
                  <option>APPROVED</option>
                  <option>DISPUTED</option>
                  <option>REVERSED</option>
                  <option>REFUNDED</option>
                  <option>DECLINED</option>
                  <option>CANCELLED</option>
                  <option>INCOMPLETE</option>
                </CFormSelect>
                <CFormLabel className="mt-2">Currency</CFormLabel>
                <CFormSelect size="sm" onChange={handleCurrency}>
                  <option value={""}>Select One</option>
                  <option>ALL</option>
                  <option>BDT</option>
                </CFormSelect>
                <CFormLabel className="mt-2">Amount from</CFormLabel>
                <CFormInput size="sm" type="text" onChange={handleAmountFrom} />
                <CFormLabel className="mt-2">Amount To</CFormLabel>
                <CFormInput size="sm" type="text" onChange={handleAmountTo} />
                <CFormLabel className="mt-2">Order by</CFormLabel>
                <CFormSelect size="sm" onChange={handleOrderBy}>
                  <option value={""}>Select One</option>
                  <option value={"ASC"}>Ascending</option>
                  <option value={"DESC"}>Descending</option>
                </CFormSelect>
                <CButton
                  className="mt-2"
                  color="primary"
                  onClick={searchStatemet}
                >
                  Search
                </CButton>
                <CButton
                  className="mt-2 mx-2"
                  color="danger"
                  onClick={onCancel}
                >
                  Cancel
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={9}>
          <DataTable
            title="Statement List"
            columns={column}
            data={statement}
            pagination={50}
            actions={
              <div>
                <CButton
                  className="btn btn-secondary mx-1"
                  color="primary"
                  onClick={dawonloadReport}
                >
                  <CIcon icon={cilPrint} />
                </CButton>

                <CSVLink
                  data={setDateForEcecl(statement)}
                  className="btn btn-secondary"
                  filename={`transation-list${Date()}`}
                >
                  <CIcon icon={cilDescription} />
                </CSVLink>
              </div>
            }
          />
        </CCol>
      </CRow>
      <div>
        <CModal visible={visible} onClose={() => setVisible(false)} size="lg">
          <CModalHeader onClose={() => setVisible(false)}>
            <CModalTitle>Transection Details</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <MerStatementDetail data={statementdetails} />
          </CModalBody>
        </CModal>
      </div>
    </div>
  );
};

export default MerStatement;
