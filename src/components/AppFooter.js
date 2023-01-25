import React from "react";
import { CFooter } from "@coreui/react";

const AppFooter = () => {
  return (
    <CFooter>
      <div>
        {/* <a href="https://coreui.io" target="_blank" rel="noopener noreferrer">
          CoreUI
        </a> */}
        <span className="ms-1">
          &copy; Fingerprint Information Technology Limited
        </span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a target="_blank" rel="noopener noreferrer">
          Moneybag
        </a>
      </div>
    </CFooter>
  );
};

export default React.memo(AppFooter);
