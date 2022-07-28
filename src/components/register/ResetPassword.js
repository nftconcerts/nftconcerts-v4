import React from "react";
import FormBox from "../form/FormBox";
import { auth, fetchCurrentUser, sendPasswordReset } from "./../../firebase";

const ResetPassword = () => {
  return (
    <FormBox>
      <div className="reset__password">Reset Password</div>
    </FormBox>
  );
};

export default ResetPassword;
