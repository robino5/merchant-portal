import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import SettledTran from "./SettledTran";
import { DateTime } from "luxon";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CSVLink } from "react-csv";
import CIcon from "@coreui/icons-react";
import { cilDescription, cilPrint } from "@coreui/icons";
import {
  CCard,
  CCardBody,
  CFormSelect,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CButton,
  CModal,
  CModalBody,
  CModalTitle,
  CModalHeader,
} from "@coreui/react";
import { render } from "@testing-library/react";
import logo from "../../assets/images/Logo";

const SettlementReport = () => {
  const navigate = useNavigate();
  const [merchantList, setMerchantList] = useState();
  const [visible, setVisible] = useState(false);
  const [mercantID, setMerchantID] = useState();
  const [merchnatName, setMerchantName] = useState("");
  const [periodFrom, setPeriodFrom] = useState("");
  const [periodTo, setPeriodTo] = useState("");
  const [staus, setStatus] = useState("");
  const [currency, setCurrency] = useState("");
  const [amontFrom, setAmountFrom] = useState("");
  const [amontTo, setAmountTo] = useState("");
  const [orderby, setOrderBy] = useState("");
  const [Settlements, setSettlements] = useState();
  const [statementdetails, setStatementDetails] = useState();
  const [userList, setUserList] = useState();
  const [mercantDetails, setMarchentDetailsList] = useState();
  const [bankbranchList, setBankBranchList] = useState();
  const [statement, setStatement] = useState();

  const handleMerchantID = (e) => {
    console.log(e);
    setMerchantID(e.value);
  };
  const handleMerchnatName = (e) => {
    setMerchantName(e.target.value);
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

  //   console.log(orderAmount);
  //   console.log(periodTo);

  const searchStatemet = (e) => {
    e.preventDefault();

    const data = {
      period_from: periodFrom,
      period_to: periodTo,
    };
    if (!periodFrom) {
      delete data.period_from;
    }
    if (!periodTo) {
      delete data.period_to;
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
        }merchant-settlements/?${encodeDataToURL(data)}`,
        { headers }
      )
      .then((response) => {
        console.log(response);
        setSettlements(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
        if (error.response.status == 401) {
          navigate("/#");
        }
      });

    // console.log(data);
  };

  const openDetails = async (e) => {
    setStatement(e.settlement_details);
    setVisible(!visible);
  };

  const getMerchantDetail = (merhcnt) => {
    let data;
    merhcnt?.map((e) => {
      if (e.id == mercantID) {
        data = e;
      }
    });
    return data;
  };

  const getotalOrderAmount = (e) => {
    let sumOrderAmount = 0;
    e.map((element) => {
      sumOrderAmount += element.gttl_order_amount;
    });
    return parseFloat(sumOrderAmount).toFixed(2);
  };

  const getotalBankFee = (e) => {
    let sumBankFee = 0;
    e.map((element) => {
      sumBankFee += element.gttl_bank_fee;
    });
    return parseFloat(sumBankFee).toFixed(2);
  };

  const getotalPgwFee = (e) => {
    let sumBankFee = 0;
    e.map((element) => {
      sumBankFee += element.gttl_pgw_fee;
    });
    return parseFloat(sumBankFee).toFixed(2);
  };
  const getotal = (e) => {
    let sumBankFee = 0;
    e.map((element) => {
      sumBankFee += element.gttl_total_amount;
    });
    return parseFloat(sumBankFee).toFixed(2);
  };

  const getDateTime = (e) => {
    let date = DateTime.fromISO(e, {
      zone: "Asia/Dhaka",
    }).toLocaleString(DateTime.DATETIME_MED);

    return date;
  };

  const setDateForEcecl = (e) => {
    let data = [];
    e?.map((element) => {
      data.push({
        Settlement_From: DateTime.fromISO(element.settlement_from, {
          zone: "Asia/Dhaka",
        }).toLocaleString(DateTime.DATETIME_MED),
        Settlement_to: DateTime.fromISO(element.settlement_to, {
          zone: "Asia/Dhaka",
        }).toLocaleString(DateTime.DATETIME_MED),
        Collection_Amount: element.gttl_order_amount,
        Bank_Fee: element.gttl_bank_fee,
        PGW_Fee: element.gttl_pgw_fee,
        Settlement_Amount: element.gttl_total_amount,
        Settlement_Date: DateTime.fromISO(element.settlement_date, {
          zone: "Asia/Dhaka",
        }).toLocaleString(DateTime.DATETIME_MED),
      });
    });
    return data;
  };

  const getMerchantSettlementDetail = (merhcntdetail) => {
    let data;
    merhcntdetail?.map((e) => {
      if (e.merchant_no == mercantID) {
        data = e;
      }
    });
    return data;
  };

  const getBankBranchName = (bankBranck) => {
    let name;
    bankbranchList?.map((element) => {
      if (element.id == bankBranck) {
        name = element.branch_name;
      }
    });
    return name;
  };

  const column = [
    {
      name: "Settlement From",
      selector: (row) =>
        DateTime.fromISO(row.settlement_from, {
          zone: "Asia/Dhaka",
        }).toLocaleString(DateTime.DATETIME_MED),
    },
    {
      name: "Settlement to",
      selector: (row) =>
        DateTime.fromISO(row.settlement_to, {
          zone: "Asia/Dhaka",
        }).toLocaleString(DateTime.DATETIME_MED),
    },
    {
      name: "Collection Amount",
      selector: (row) => row.gttl_order_amount,
    },
    {
      name: "Bank Fee",
      selector: (row) => row.gttl_bank_fee,
    },
    {
      name: "PGW Fee",
      selector: (row) => row.gttl_pgw_fee,
    },
    {
      name: "Settlement Amount",
      selector: (row) => row.gttl_total_amount,
    },
    {
      name: "Settlement Date",
      grow: 2,
      selector: (row) =>
        DateTime.fromISO(row.settlement_date, {
          zone: "Asia/Dhaka",
        }).toLocaleString(DateTime.DATETIME_MED),
    },
    {
      name: "Action",
      selector: (row) => (
        <div className="d-flex justify-content-center">
          <CButton
            className="btn btn-sm d-inline mx-1"
            CColor="info"
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

  const dawonloadReport = () => {
    console.log(getDateTime(periodFrom));
    const doc = new jsPDF();
    doc.setFontSize(8);
    var pageCount = doc.internal.getNumberOfPages();
    var pageCurrent = doc.internal.getCurrentPageInfo().pageNumber;
    console.log(doc.internal.getNumberOfPages());
    doc.addImage(logo, "JPEG", 80, 3);
    doc.text(
      `Period:${getDateTime(periodFrom)} - ${getDateTime(periodTo)}`,
      68,
      27
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
        { header: "Settlement From", dataKey: "settlement_from" },
        { header: "Settlement to", dataKey: "settlement_to" },
        {
          header: "Collection Amount",
          dataKey: "gttl_order_amount",
        },
        { header: "Bank Fee", dataKey: "gttl_bank_fee" },
        { header: "PGW Fee", dataKey: "gttl_pgw_fee" },
        { header: "Settlement Amount", dataKey: "gttl_total_amount" },
        { header: "Settlement Date", dataKey: "settlement_date" },
      ],
      body: [
        ...Settlements.map((element) => [
          DateTime.fromISO(element.settlement_from, {
            zone: "Asia/Dhaka",
          }).toLocaleString(DateTime.DATETIME_MED),
          DateTime.fromISO(element.settlement_to, {
            zone: "Asia/Dhaka",
          }).toLocaleString(DateTime.DATETIME_MED),
          element.gttl_order_amount,
          element.gttl_bank_fee,
          element.gttl_pgw_fee,
          element.gttl_total_amount,
          DateTime.fromISO(element.settlement_date, {
            zone: "Asia/Dhaka",
          }).toLocaleString(DateTime.DATETIME_MED),
        ]),
        [
          {
            content: `Total-Amount =`,
            colSpan: 2,
            styles: {
              fillColor: [239, 154, 154],
            },
          },
          {
            content: getotalOrderAmount(Settlements),
            colSpan: 1,
            styles: {
              fillColor: [239, 154, 154],
            },
          },
          {
            content: getotalBankFee(Settlements),
            colSpan: 1,
            styles: {
              fillColor: [239, 154, 154],
            },
          },
          {
            content: getotalPgwFee(Settlements),
            colSpan: 1,
            styles: {
              fillColor: [239, 154, 154],
            },
          },
          {
            content: getotal(Settlements),
            colSpan: 3,
            styles: {
              fillColor: [239, 154, 154],
            },
          },
        ],
      ],
      // didDrawPage: function (data) {
      //   let rows = data.table.body;
      //   rows.push({
      //     content: "Total = " + 67890,
      //     colSpan: 2,
      //   });
      // },
      showHead: "everyPage",
      styles: { fontSize: 6 },
      margin: { top: 30 },
    });
    for (var i = 0; i < pageCount; i++) {
      doc.setPage(i);
      doc.addImage(logo, "JPEG", 80, 3);
      doc.text(
        `Period:${getDateTime(periodFrom)} - ${getDateTime(periodTo)}`,
        68,
        27
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
    doc.save(`settlement${Date()}.pdf`);
  };

  useEffect(() => {}, []);

  return (
    <div className="">
      <CRow>
        <CCol md={3}>
          <CCard>
            <CCardBody>
              <CForm>
                {/* <CFormLabel>Order Number</CFormLabel>
                <CFormInput
                  size="sm"
                  type="text"
                  onChange={handleOrderNumber}
                /> */}
                {/* <CFormLabel>Merchant Name</CFormLabel>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    isSearchable={true}
                    options={getmerchantoptions(merchantList)}
                    onChange={handleMerchantID}
                  /> */}
                {/* <CFormInput
                  size="sm"
                  type="text"
                  onChange={handleMerchnatName}
                /> */}
                <br></br>
                <span>Settelement Date</span>
                <br></br>
                <CFormLabel className="mt-2">Period from</CFormLabel>
                <CFormInput size="sm" type="date" onChange={handlePeriodFrom} />
                <CFormLabel className="mt-2">Period To</CFormLabel>
                <CFormInput size="sm" type="date" onChange={handlePeriodTo} />
                {/* <CFormLabel className="mt-2">Status</CFormLabel>
                <CFormSelect size="sm" onChange={handleStatus}>
                  <option>APPROVED</option>
                  <option>PENDING</option>
                  <option>REJECTED</option>
                  <option>CANCELED</option>
                </CFormSelect> */}
                {/* <CFormLabel className="mt-2">Currency</CFormLabel>
                <CFormSelect size="sm" onChange={handleCurrency}>
                  <option>ALL</option>
                  <option>BDT</option>
                </CFormSelect> */}
                {/* <CFormLabel className="mt-2">Amount from</CFormLabel>
                <CFormInput size="sm" type="text" onChange={handleAmountFrom} />
                <CFormLabel className="mt-2">Amount To</CFormLabel>
                <CFormInput size="sm" type="text" onChange={handleAmountTo} />
                <CFormLabel className="mt-2">Order by</CFormLabel>
                <CFormSelect size="sm" onChange={handleOrderBy}>
                  <option>ASC</option>
                  <option>DESC</option>
                </CFormSelect> */}
                <CButton
                  className="mt-2 mx-2"
                  color="primary"
                  disabled={!periodFrom || !periodTo ? true : false}
                  onClick={searchStatemet}
                >
                  Search
                </CButton>
                <CButton
                  className="mt-2"
                  color="warning"
                  onClick={() => {
                    window.location.reload();
                  }}
                >
                  Reset
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={9}>
          <DataTable
            title="Settlement Report"
            columns={column}
            data={Settlements}
            paginatio={50}
            actions={
              <div>
                <CButton
                  className="btn btn-secondary mx-1"
                  color="primary"
                  disabled={!periodFrom || !periodTo ? true : false}
                  onClick={dawonloadReport}
                >
                  <CIcon icon={cilPrint} />
                </CButton>
                <CSVLink
                  data={setDateForEcecl(Settlements)}
                  className="btn btn-secondary"
                  filename={`settlementRepoer${Date()}`}
                >
                  <CIcon icon={cilDescription} />
                </CSVLink>
              </div>
            }
          />
        </CCol>
      </CRow>
      <div>
        <CModal visible={visible} onClose={() => setVisible(false)} size="xl">
          <CModalHeader onClose={() => setVisible(false)}>
            <CModalTitle>Settled Transaction Details</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <SettledTran data={statement} />
          </CModalBody>
        </CModal>
      </div>
    </div>
  );
};

export default SettlementReport;
