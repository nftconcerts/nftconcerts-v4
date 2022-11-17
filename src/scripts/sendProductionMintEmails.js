import React from "react";
import emailjs from "@emailjs/browser";

const sendProductionMintEmails = (template_params) => {
  sendAdminEmail(template_params);
  sendUserEmail(template_params);
};

export default sendProductionMintEmails;

const sendUserEmail = (template_params) => {
  emailjs
    .send(
      process.env.REACT_APP_EMAIL_SERVICE_ID,
      "template_mint_prod",
      template_params,
      process.env.REACT_APP_EMAIL_USER_ID
    )
    .then(
      (result) => {
        console.log(result.text);
      },
      (error) => {
        console.log(error.text);
      }
    );
};

const sendAdminEmail = (template_params) => {
  emailjs
    .send(
      process.env.REACT_APP_EMAIL_SERVICE_ID,
      "template_admin_mint",
      template_params,
      process.env.REACT_APP_EMAIL_USER_ID
    )
    .then(
      (result) => {
        console.log(result.text);
      },
      (error) => {
        console.log(error.text);
      }
    );
};
