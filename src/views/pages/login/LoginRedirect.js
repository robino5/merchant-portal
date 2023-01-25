import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";

const LoginRedirect = () => {
  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
    setValue,
  } = useForm({ mode: "all" });
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location.state);

  useEffect(() => {
    navigate("/#");
  }, []);

  return (
    <div className=" d-flex flex-row">
      <h1>asdfadsf</h1>
    </div>
  );
};

export default LoginRedirect;
