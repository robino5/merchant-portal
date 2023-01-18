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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CForm,
  CFormCheck,
} from "@coreui/react";
import logo from "src/assets/images/logo.png";
import { useForm } from "react-hook-form";

const Login = () => {
  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
    setValue,
    reset,
  } = useForm({ mode: "all" });

  const navigate = useNavigate();
  const [username, setuername] = useState("");
  const [password, setpassword] = useState("");
  const [visible, setVisible] = useState();
  const [newPass, setNewPass] = useState();
  const [conPass, setConPass] = useState();

  const openModal = () => {
    setVisible(true);
  };

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

  const showPassword2 = () => {
    var x = document.getElementById("password2");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  };
  const showPassword3 = () => {
    var x = document.getElementById("password3");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  };

  const getPasswordMatchingMess = () => {
    if (conPass && conPass != newPass) {
      return "Password Mismatch";
    }
  };

  const forgetPassword = (e) => {
    let data = {
      user_id: e.user_id,
      new_pwd: e.new_password,
    };
    console.log(data);

    axios
      .put(`${process.env.REACT_APP_API_URL}mruser-auth/forgot-pwd`, data)
      .then((responce) => {
        console.log(responce.data);
        swal({
          position: "top-end",
          text: responce.data.msg,
          icon: "success",
          button: false,
          timer: 1500,
        });
        setVisible(false);
        reset();
      })
      .catch((error) => {
        console.error("There was an error!", error);
        swal({
          position: "top-end",
          text: "Password Change Failed",
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
                    <h4 className="mt-1  pb-1">Merchant Sign in</h4>
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
                  <CButton color="link" onClick={openModal} className="px-0">
                    Forgot password?
                  </CButton>
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
      <div>
        <CModal
          visible={visible}
          onClose={() => {
            setVisible(false), reset();
          }}
        >
          <CModalHeader onClose={() => setVisible(false)}>
            <CModalTitle>Forget Password</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CContainer>
              <CCard onSubmit={handleSubmit(forgetPassword)}>
                <CCardBody>
                  <CForm>
                    <CFormLabel className="mt-2">User Id</CFormLabel>
                    <CFormInput
                      size="sm"
                      type="text"
                      {...register("user_id", {
                        required: "Please Prvide User Id",
                      })}
                    />
                    <span className="text-danger">
                      {errors.Prev_password?.message}
                    </span>
                    <CFormLabel className="mt-2">New Password</CFormLabel>
                    <CFormInput
                      size="sm"
                      type="password"
                      id="password2"
                      {...register("new_password", {
                        required: "Please Provide New Password",
                        minLength: {
                          value: 6,
                          message: "Password will be Minimum 6 Characters",
                        },
                        validate: (value) => {
                          return (
                            [/[A-Z]/, /[a-z]/, /[0-9]/, /[#?!@$%^&*-]/].every(
                              (pattern) => pattern.test(value)
                            ) ||
                            "Password is weak! Please Follow [A-Z],[a-z],[0-9],[#?!@$%^&*-]"
                          );
                        },
                      })}
                      onChange={(e) => {
                        setNewPass(e.target.value);
                      }}
                    />
                    <span className="text-danger">
                      {errors.new_password?.message}
                    </span>
                    <CFormCheck
                      name="status"
                      onClick={showPassword2}
                      label="Show Password"
                    />
                    <CFormLabel className="mt-2">Confirm Password</CFormLabel>
                    <CFormInput
                      size="sm"
                      type="password"
                      id="password3"
                      onChange={(e) => {
                        setConPass(e.target.value);
                      }}
                    />
                    <span className="text-danger">
                      {getPasswordMatchingMess()}
                    </span>
                    <CFormCheck
                      name="status"
                      onClick={showPassword3}
                      label="Show Password"
                    />
                    <div className="text-center mt-2">
                      <CButton color="primary" type="submit">
                        Change Password
                      </CButton>
                    </div>
                  </CForm>
                </CCardBody>
              </CCard>
            </CContainer>
          </CModalBody>
        </CModal>
      </div>
    </div>
  );
};

export default Login;
