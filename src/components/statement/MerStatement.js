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

const MerStatement = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [orderAmount, setOrderAmount] = useState("");
  const [periodFrom, setPeriodFrom] = useState("");
  const [periodTo, setPeriodTo] = useState("");
  const [staus, setStatus] = useState("");
  const [currency, setCurrency] = useState("");
  const [amontFrom, setAmountFrom] = useState("");
  const [amontTo, setAmountTo] = useState("");
  const [orderby, setOrderBy] = useState("");
  const [statement, setStatement] = useState();
  const [statementdetails, setStatementDetails] = useState();

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

  const openDetails = (e) => {
    setStatementDetails(e);
    setVisible(!visible);
  };

  //   const handleClose = () => setShow(false)
  //   const handleShow = () => setShow(true)

  const handleOrderNumber = (e) => {
    setOrderAmount(e.target.value);
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
    navigate("/");
  };

  //   console.log(orderAmount);
  //   console.log(periodTo);

  const searchStatemet = (e) => {
    e.preventDefault();

    const data = {
      order_id: orderAmount,
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

  const column = [
    {
      name: "SL",
      selector: (row, index) => index + 1,
      maxWidth: "15px",
    },
    {
      name: "Order ID",
      selector: (row) => row.merchant_tran_id,
    },
    {
      name: "Transection ID",
      selector: (row) => row.txn_id,
    },
    {
      name: "Merchant Name",
      sortable: true,
      grow: 2,
      selector: (row) => row.merchant_name,
    },

    {
      name: "Creation date",
      grow: 2,
      selector: (row) =>
        DateTime.fromISO(row.created_at, { zone: "Asia/Dhaka" }).toLocaleString(
          DateTime.DATETIME_MED
        ),
    },
    {
      name: "Amount",
      selector: (row) => row.merchant_order_amount,
    },
    {
      name: "Refund Amount",
      selector: (row) => 0,
    },
    {
      name: "Final Amountt",
      selector: (row) => row.merchant_order_amount + row.merchant_charge_amount,
    },
    {
      name: "Order Status",
      selector: (row) => row.gw_order_status,
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

  useEffect(() => {
    getStatementList();
  }, []);

  return (
    <div className="">
      <CRow>
        <CCol md={3}>
          <CCard>
            <CCardBody>
              <CForm>
                <CFormLabel>Order Number</CFormLabel>
                <CFormInput
                  size="sm"
                  type="text"
                  onChange={handleOrderNumber}
                />
                <CFormLabel className="mt-2">Period from</CFormLabel>
                <CFormInput size="sm" type="date" onChange={handlePeriodFrom} />
                <CFormLabel className="mt-2">Period To</CFormLabel>
                <CFormInput size="sm" type="date" onChange={handlePeriodTo} />
                <CFormLabel className="mt-2">Status</CFormLabel>
                <CFormSelect size="sm" onChange={handleStatus}>
                  <option value={""}>Select One</option>
                  <option>APPROVED</option>
                  <option>PENDING</option>
                  <option>REJECTED</option>
                  <option>CANCELED</option>
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
                  <option>ASC</option>
                  <option>DESC</option>
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
            pagination
            expandableCCol
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
