import nodemailer from "nodemailer"
import Handlebars from "handlebars"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://github.com/rohitsingh93300/MERN-AUTH/blob/main/backend/controllers/userController.js
// https://www.brevo.com/pricing/
export const verifyEmail = async (token, email) => {
    const emailTemplateSource = fs.readFileSync(path.join(__dirname, "template.hbs"), "utf-8")
    const template = Handlebars.compile(emailTemplateSource)
    const htmlToSend = template({ token: encodeURIComponent(token) })
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    })

    const mailConfigurations = {
        from: process.env.MAIL_USER,
        to: email,
        subject: "Email verification",
        html: htmlToSend
    }

    transporter.sendMail(mailConfigurations, (error, info) => {
        if (error) throw new Error(error)
        console.log("Email sent successfully");
        console.log(info);
    })
}   