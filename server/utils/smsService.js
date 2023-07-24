require("dotenv").config()
const client = require("twilio")(process.env.ACCOUNTSID, process.env.AUTHTOKEN)

const smsService = {
  sendOtpToMobile: async (mobileNo, otp) => {
    const args = {
      body: `Your OTP for login to Jenny Point is ${otp} Please do not share this OTP.Thank you.`,
      from: "+14067408483",
      to: `+91${mobileNo}`,
    }
    const res = await client.messages.create(args)
    return res
  },

  generateOTP: () => Math.floor(100000 + Math.random() * 900000) || 987654,
}

module.exports = smsService
