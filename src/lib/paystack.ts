import axios from "axios";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const BASE_URL = "https://api.paystack.co";

export async function initiatePaystackTransaction(
  email: string,
  amount: number,
  reference: string,
  callback_url: string
) {
  const res = await axios.post(
    `${BASE_URL}/transaction/initialize`,
    {
      email,
      amount: amount * 100, // Paystack expects amount in kobo
      reference,
      callback_url,
    },
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
}

export function verifyPaystackSignature(req: any) {
  const signature = req.headers["x-paystack-signature"];
  const crypto = require("crypto");
  const hash = crypto
    .createHmac("sha512", PAYSTACK_SECRET)
    .update(JSON.stringify(req.body))
    .digest("hex");
  return signature === hash;
}
