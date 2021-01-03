const nodemailer = require('nodemailer')
const xoauth2 = require('xoauth2')

const sendMail =  function(mailDetails) {
    var transport = nodemailer.createTransport({
        service: "Gmail",
        auth:{
          user : "",
          pass : ""
        },
        debug: true,
        logger: true
    });

      var message = {
        text : "Hello world ✔",
        from : mailDetails.from,
        subject : mailDetails.subject,
        html: mailDetails.html
      };

    message.to = mailDetails.to;
    transport.sendMail(message, function(err) {
        if(err) {
            console.log("not send",err);
            return;
        }
        console.log('Send to ' + to);
    });
}
module.exports = {
  sendMail
}