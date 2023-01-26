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
import { useForm } from "react-hook-form";

const ForgetPassword = () => {
  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
    setValue,
    reset,
  } = useForm({ mode: "all" });
  const navigate = useNavigate();
  const [username, setuername] = useState();
  const [otp, setOtp] = useState();
  const [newPass, setNewPass] = useState();
  const [conPass, setConPass] = useState();
  const [merchantUser, setMerchantUserDetail] = useState();
  const [userHide, setUserHide] = useState(false);
  const [otpHide, setOtpHide] = useState(true);
  const [passworHide, setPasswordHide] = useState(true);

  const showPassword = () => {
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  };
  const showConPassword = () => {
    var x = document.getElementById("showPassword");
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

  const submitMerchantUerName = () => {
    let data = {
      merchant_id: username,
    };
    axios
      .put(`${process.env.REACT_APP_API_URL}mruser-auth/forgot-pwd`, data)
      .then((response) => {
        console.log(response);
        setMerchantUserDetail(response.data);
        swal({
          text: `Send OTP to ${response.data.email.slice(
            0,
            3
          )}........${response.data.email.slice(
            response.data.email.indexOf("@") - 3,
            response.data.email.length
          )}`,
          icon: "success",
          position: "top-end",
          button: true,
        });
        setUserHide(true);
        setOtpHide(false);
      })
      .catch((error) => {
        console.error("There was an error!", error);
        swal({
          text: error.response.data.detail,
          icon: "error",
          position: "top-end",
          button: false,
          timer: 1500,
        });
      });
  };

  const submitOtp = () => {
    let data = {
      merchant_id: username,
      session_id: merchantUser?.session_id[0],
      otp_code: otp,
    };
    console.log(data);
    axios
      .post(
        `${process.env.REACT_APP_API_URL}mruser-auth/verify-forgot-pwd-otp`,
        data
      )
      .then((response) => {
        console.log(response);
        setOtpHide(true);
        setPasswordHide(false);
      })
      .catch((error) => {
        console.error("There was an error!", error);
        swal({
          text: error.response.data.detail,
          icon: "error",
          position: "top-end",
          button: false,
          timer: 1500,
        });
      });
  };

  const changePassword = (e) => {
    let data = {
      session_id: merchantUser?.session_id[0],
      merchant_no: merchantUser?.user_no,
      new_pwd: e.new_password,
    };

    axios
      .post(`${process.env.REACT_APP_API_URL}mruser-auth/reset-pwd-otp`, data)
      .then((response) => {
        console.log(response);
        navigate("/login-redirect");
      })
      .catch((error) => {
        console.error("There was an error!", error);
        swal({
          text: error.response.data.detail,
          icon: "error",
          position: "top-end",
          button: false,
          timer: 1500,
        });
      });
  };
  return (
    <CContainer>
      <div hidden={userHide}>
        <CFormLabel>User Name</CFormLabel>
        <CFormInput
          className="mb-2"
          placeholder="User Name"
          type="text"
          onChange={(e) => {
            setuername(e.target.value);
          }}
        />
        <CButton onClick={submitMerchantUerName} color="primary">
          Submit
        </CButton>
      </div>
      <div hidden={otpHide}>
        <CFormLabel>OTP</CFormLabel>
        <CFormInput
          className="mb-2"
          placeholder="OTP"
          type="text"
          onChange={(e) => {
            setOtp(e.target.value);
          }}
        />
        <CButton onClick={submitOtp} color="primary">
          Submit OTP
        </CButton>
      </div>
      <div hidden={passworHide}>
        <CForm onSubmit={handleSubmit(changePassword)}>
          <CFormLabel>New Password</CFormLabel>
          <CFormInput
            className="mb-2"
            placeholder="New Password"
            type="password"
            id="password"
            {...register("new_password", {
              required: "Please Provide New Password",
              minLength: {
                value: 6,
                message: "Password will be Minimum 6 Characters",
              },
              validate: (value) => {
                return (
                  [/[A-Z]/, /[a-z]/, /[0-9]/, /[#?!@$%^&*-]/].every((pattern) =>
                    pattern.test(value)
                  ) ||
                  "Password is weak! Please Follow [A-Z],[a-z],[0-9],[#?!@$%^&*-]"
                );
              },
            })}
            onChange={(e) => {
              setNewPass(e.target.value);
            }}
          />
          <span className="text-danger">{errors.new_password?.message}</span>
          <CFormCheck
            name="status"
            onClick={showPassword}
            label="Show Password"
          />
          <CFormLabel>Confirm Password</CFormLabel>
          <CFormInput
            className="mb-2"
            placeholder="Confirm Password"
            type="password"
            id="showPassword"
            onChange={(e) => {
              setConPass(e.target.value);
            }}
          />
          <span className="text-danger">{getPasswordMatchingMess()}</span>
          <CFormCheck
            name="status"
            onClick={showConPassword}
            label="Show Password"
          />
          <CButton type="submit" color="primary">
            Submit Password
          </CButton>
        </CForm>
      </div>
    </CContainer>
  );
};

export default ForgetPassword;
