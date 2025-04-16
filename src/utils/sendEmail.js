const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress, body) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<h1>${body}</h1>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: "description",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Subject",
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [],
  });
};

const run = async (toUser, fromUser) => {
  const body = `Hi ${toUser.firstName}, ${fromUser.firstName} has sent you friend request in devTinder`;
  const sendEmailCommand = createSendEmailCommand(
    toUser.email,
    "dhiraj78725@gmail.com",
    body
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (error) {
    // if (caught instanceof Error && caught.name === "MessageRejected") {
    //   const messageRejectedError = caught;
    //   return messageRejectedError;
    // }
    console.log(error);
    throw new Error(error);
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports = { run };
