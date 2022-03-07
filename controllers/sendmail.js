const nodemailer = require("nodemailer")
const mailcollection = require('../models/mail');

let mailTransporter = nodemailer.createTransport({
    service: "gmail.com",
    auth: {
        user: "placementscycle@gmail.com",
        pass: "Placement@1",
    },
    secureConnection: true,
    tls: {
        secureProtocol: "TLSv1_method",
    },
})

function sendmail(mailDetails, collectmail) {
    mailTransporter.sendMail(mailDetails, function (err7, data) {
        if (err7) {
            return true
        }
        else {
            mailDetails.to.forEach(m => {
                collectmail.to = m
                mailcollection.create(collectmail, (er, d) => {
                    er ? console.log(er) : console.log('mail stored:', d)
                })
            })
            return false
        }
    })
}

module.exports = sendmail
