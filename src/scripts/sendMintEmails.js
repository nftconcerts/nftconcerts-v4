import emailjs from "@emailjs/browser";

const sendMintEmails = (template_params) => {
  sendAdminEmail(template_params);
  sendArtistEmail(template_params);
  sendUserEmail(template_params);
};

export default sendMintEmails;

const sendArtistEmail = (template_params) => {
  emailjs
    .send(
      process.env.REACT_APP_EMAIL_SERVICE_ID,
      "template_artist_mint",
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

const sendUserEmail = (template_params) => {
  emailjs
    .send(
      process.env.REACT_APP_EMAIL_SERVICE_ID,
      "template_user_mint",
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
