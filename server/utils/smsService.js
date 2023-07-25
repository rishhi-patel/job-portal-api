const twilio = require("twilio")
require("dotenv").config()

const smsService = {
  sendOtpToMobile: async (mobileNo, otp) => {
    try {
      const client = twilio(process.env.ACCOUNTSID, process.env.AUTHTOKEN)
      var args = {
        from: "+14067408483",
        to: `+91 ${mobileNo}`,
        body: `Your OTP for login to Job Portal App is ${otp} Please do not share this OTP.Thank you.`,
      }

      const res = await client.messages.create(args)
      return res
    } catch (error) {
      throw new Error(error)
    }
  },

  generateOTP: () => Math.floor(100000 + Math.random() * 900000) || 987654,
}

module.exports = smsService
