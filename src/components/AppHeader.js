import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CCard,
  CCardBody,
  CFormLabel,
  CFormInput,
  CButton,
  CForm,
  CFormCheck,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilBell, cilEnvelopeOpen, cilList, cilMenu } from "@coreui/icons";

import { AppBreadcrumb } from "./index";
import { AppHeaderDropdown } from "./header/index";
import swal from "sweetalert";
import axios from "axios";
import { useForm } from "react-hook-form";
import { logo } from "src/assets/brand/logo";

const AppHeader = () => {
  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow);
  const [visible, setVisible] = useState();
  const [prevPass, setPreviousPass] = useState();
  const [newPass, setNewPass] = useState();
  const [conPass, setConPass] = useState();

  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
    setValue,
    reset,
  } = useForm({ mode: "all" });

  const openModal = () => {
    setVisible(true);
  };

  const changePass = (e) => {
    if (newPass != conPass) {
      swal({
        position: "top-end",
        text: "Don't New-password with Confirm-password",
        icon: "warning",
        button: false,
        timer: 1500,
      });
    } else {
      let data = {
        current_pwd: e.Prev_password,
        new_pwd: e.new_password,
      };
      console.log(data);
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };
      axios
        .put(`${process.env.REACT_APP_API_URL}mruser-auth/update-pwd`, data, {
          headers,
        })
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
    }
  };

  const showPassword = () => {
    var x = document.getElementById("password1");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
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

  return (
    <div>
      <CHeader position="sticky" className="mb-4">
        <CContainer fluid>
          <CHeaderToggler
            className="ps-1"
            onClick={() => dispatch({ type: "set", sidebarShow: !sidebarShow })}
          >
            <CIcon icon={cilMenu} size="lg" />
          </CHeaderToggler>
          <CHeaderBrand className="mx-auto d-md-none" to="/">
            <CIcon icon={logo} height={48} alt="Logo" />
          </CHeaderBrand>
          <CHeaderNav className="d-none d-md-flex me-auto">
            {/* <CNavItem>
            <CNavLink to="/dashboard" component={NavLink}>
              Dashboard
            </CNavLink>
          </CNavItem> */}
            <CNavItem>
              <CNavLink href="#">LogOut</CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink className="chang-password" onClick={openModal}>
                Change Password
              </CNavLink>
            </CNavItem>
            {/* <CNavItem>
            <CNavLink href="#">Settings</CNavLink>
          </CNavItem> */}
          </CHeaderNav>
          {/* <CHeaderNav>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilBell} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilList} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilEnvelopeOpen} size="lg" />
            </CNavLink>
          </CNavItem>
        </CHeaderNav> */}
          {/* <CHeaderNav className="ms-3">
          <AppHeaderDropdown />
        </CHeaderNav> */}
        </CContainer>
        {/* <CHeaderDivider /> */}
        {/* <CContainer fluid>
        <AppBreadcrumb />
      </CContainer> */}
        <div>
          <CModal
            visible={visible}
            onClose={() => {
              setVisible(false), reset();
            }}
          >
            <CModalHeader onClose={() => setVisible(false)}>
              <CModalTitle>Change Password</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CContainer>
                <CCard onSubmit={handleSubmit(changePass)}>
                  <CCardBody>
                    <CForm>
                      <CFormLabel className="mt-2">
                        Previous Password
                      </CFormLabel>
                      <CFormInput
                        size="sm"
                        type="password"
                        id="password1"
                        {...register("Prev_password", {})}
                      />
                      <span className="text-danger">
                        {errors.Prev_password?.message}
                      </span>
                      <CFormCheck
                        name="status"
                        onClick={showPassword}
                        label="Show Password"
                      />
                      <CFormLabel className="mt-2">New Password</CFormLabel>
                      <CFormInput
                        size="sm"
                        type="password"
                        id="password2"
                        {...register("new_password", {
                          minLength: {
                            value: 6,
                            message: "Password will be Minimum 6 Characters",
                          },
                          validate: (value) => {
                            return (
                              [/[A-Z]/, /[a-z]/, /[0-9]/, /[#?!@$%^&*-]/].every(
                                (pattern) => pattern.test(value)
                              ) || "Password is weak!"
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
      </CHeader>
    </div>
  );
};

export default AppHeader;
