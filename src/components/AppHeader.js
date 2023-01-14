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
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilBell, cilEnvelopeOpen, cilList, cilMenu } from "@coreui/icons";

import { AppBreadcrumb } from "./index";
import { AppHeaderDropdown } from "./header/index";
import swal from "sweetalert";
import axios from "axios";
import { logo } from "src/assets/brand/logo";

const AppHeader = () => {
  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow);
  const [visible, setVisible] = useState();
  const [prevPass, setPreviousPass] = useState();
  const [newPass, setNewPass] = useState();
  const [conPass, setConPass] = useState();

  const openModal = () => {
    setVisible(true);
  };

  const changePass = () => {
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
        current_pwd: prevPass,
        new_pwd: newPass,
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
          <CModal visible={visible} onClose={() => setVisible(false)}>
            <CModalHeader onClose={() => setVisible(false)}>
              <CModalTitle>Change Password</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CContainer>
                <CCard>
                  <CCardBody>
                    <CFormLabel className="mt-2">Previous Password</CFormLabel>
                    <CFormInput
                      size="sm"
                      type="text"
                      onChange={(e) => {
                        setPreviousPass(e.target.value);
                      }}
                    />
                    <CFormLabel className="mt-2">New Password</CFormLabel>
                    <CFormInput
                      size="sm"
                      type="text"
                      onChange={(e) => {
                        setNewPass(e.target.value);
                      }}
                    />
                    <CFormLabel className="mt-2">Confirm Password</CFormLabel>
                    <CFormInput
                      size="sm"
                      type="text"
                      onChange={(e) => {
                        setConPass(e.target.value);
                      }}
                    />
                    <div className="text-center mt-2">
                      <CButton onClick={changePass} color="primary">
                        Change Password
                      </CButton>
                    </div>
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
