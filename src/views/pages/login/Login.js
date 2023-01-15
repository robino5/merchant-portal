import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import axios from "axios";
import {
  CButton,
  CFormLabel,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CFormInput,
  CRow,
  CImage,
} from "@coreui/react";
import logo from "src/assets/images/logo.jpeg";

const Login = () => {
  const navigate = useNavigate();
  const [username, setuername] = useState("");
  const [password, setpassword] = useState("");

  const handleUser = (e) => {
    const username = e.target.value;
    setuername(username);
  };
  const handlePassword = (e) => {
    const password = e.target.value;
    setpassword(password);
  };

  const submitUser = (e) => {
    e.preventDefault();
    var data = new FormData();
    data.append("username", username);
    data.append("password", password);
    axios
      .post(`${process.env.REACT_APP_API_URL}mruser-auth/token`, data)
      .then((response) => {
        console.log(response);
        localStorage.setItem("token", response.data.access_token);
        swal({
          position: "top-end",
          text: "Login Successfull",
          icon: "success",
          button: false,
          timer: 1500,
        });
        return navigate("/statement");
      })
      .catch((error) => {
        console.error("There was an error!", error);
        swal({
          position: "top-end",
          text: error.response.data.detail,
          icon: "error",
          button: false,
          timer: 1500,
        });
      });
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={3}></CCol>
          <CCol md={6} className="mb-5">
            <CCard>
              <CCardBody>
                <div className="justify-content-center px-3">
                  <div className="text-center">
                    <CImage className="login-image-wrapper" src={logo} />
                  </div>
                  <div className="text-center">
                    <h4 className="mt-1  pb-1">Merchant Login</h4>
                  </div>
                  {/* <CFormLabel>Merchant Id</CFormLabel>
                  <FormControl
                    className="mb-2"
                    placeholder="Merchant Id"
                    type="text"
                  /> */}
                  <CFormLabel>User Name</CFormLabel>
                  <CFormInput
                    className="mb-2"
                    placeholder="User Name"
                    type="text"
                    name="username"
                    onChange={handleUser}
                  />
                  <CFormLabel>Password</CFormLabel>
                  <CFormInput
                    className="mb-2"
                    placeholder="Password"
                    type="password"
                    name="password"
                    onChange={handlePassword}
                  />
                  <div className="text-center pt-1 mb-2 pb-1">
                    <CButton
                      className="mb-4 w-100 gradient-custom-2"
                      onClick={submitUser}
                    >
                      Sign in
                    </CButton>
                    {/* <a className="text-muted" href="#!">
                      Forgot password?
                    </a> */}
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={3}></CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
