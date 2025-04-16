const { VerifyEmailIdentityCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

// const EMAIL_ADDRESS = "name@example.com";

const createVerifyEmailIdentityCommand = (emailAddress) => {
  return new VerifyEmailIdentityCommand({ EmailAddress: emailAddress });
};

const run = async (emailAddress) => {
  const verifyEmailIdentityCommand =
    createVerifyEmailIdentityCommand(emailAddress);
  try {
    return await sesClient.send(verifyEmailIdentityCommand);
  } catch (err) {
    console.log("Failed to verify email identity.", err);
    return err;
  }
};
// snippet-end:[ses.JavaScript.identities.verifyEmailIdentityV3]
module.exports = { run };
