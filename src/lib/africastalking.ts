import axios from "axios";

export async function sendSMS(to: string, message: string) {
  const apiKey = process.env.ARKASEL_API_KEY!;

  await axios.post(
    "https://sms.arkasel.com/api/v1/send",
    {
      to,
      message,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    }
  );
}
