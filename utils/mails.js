/* eslint-disable no-unreachable */
const sendMail = require("./nodemail")

const forgetPasswordEmail = function(mailDetails){
    let EmailObject = {
        from: 'sonuverman@gmail.com',
        subject: 'Forget password email',
    }
    console.log(mailDetails.otp)
    Object.assign(EmailObject, {
        to : mailDetails.email,
        html: `
        <html>
          Hello, your otp is ${mailDetails.otp}
        </html>`
    })
    return sendMail.sendMail(EmailObject)
}
module.exports  = {
    forgetPasswordEmail
}