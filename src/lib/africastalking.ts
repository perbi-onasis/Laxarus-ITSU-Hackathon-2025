import africastalking from "africastalking";

const africasTalking = africastalking({
  apiKey: process.env.AFRICASTALKING_API_KEY!,
  username: process.env.AFRICASTALKING_USERNAME!,
});

const sms = africasTalking.SMS;

export async function sendSMS(to: string, message: string) {
  return sms.send({
    to: [to],
    message,
    from: process.env.AFRICASTALKING_SENDER_ID,
  });
}
