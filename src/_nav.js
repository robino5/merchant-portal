import React from "react";
import CIcon from "@coreui/icons-react";
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from "@coreui/icons";
import { CNavGroup, CNavItem, CNavTitle } from "@coreui/react";

const _nav = [
  // {
  //   component: CNavItem,
  //   name: 'Dashboard',
  //   to: '/dashboard',
  //   icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  //   badge: {
  //     color: 'info',
  //     text: 'NEW',
  //   },
  // },
  {
    component: CNavGroup,
    name: "Statement",
    to: "",
    items: [
      {
        component: CNavItem,
        name: "Transaction Statement",
        to: "/statement",
      },
      // {
      //   component: CNavItem,
      //   name: 'Bank List',
      //   to: '/bank',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Branch List',
      //   to: '/branch',
      // },

      // {
      //   component: CNavItem,
      //   name: "Financial Organization",
      //   to: "/orgnization",
      // },
      // {
      //   component: CNavItem,
      //   name: "Partner",
      //   to: "/partner",
      // },
      // {
      //   component: CNavItem,
      //   name: "Partner-Branch",
      //   to: "/partner-branch",
      // },
    ],
  },
];

export default _nav;
