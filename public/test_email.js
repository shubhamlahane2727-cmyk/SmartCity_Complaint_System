const nodemailer = require("nodemailer");
const fs = require("fs");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "civisyncss@gmail.com",   // 🔁 change
        pass: "oetjpoafgwsefoau"         // 🔁 change
    }
});

transporter.sendMail({
    from: "CivicSync <civisyncss@gmail.com>",
    to: "civisyncss@gmail.com",
    subject: "Test",
    text: "Test"
}).then(info => {
    fs.writeFileSync("test_result.json", JSON.stringify({ success: true, info }));
    process.exit(0);
}).catch(err => {
    fs.writeFileSync("test_result.json", JSON.stringify({ success: false, err: err.message, stack: err.stack }));
    process.exit(0);
});
