import { sendSMS } from "./africastalking";
import prisma from "./prisma";

export async function notifyApproval(userId: string, docType: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.phone) {
    await sendSMS(
      user.phone,
      `Your ${docType} request has been approved. You will be notified when it is ready.`
    );
  }
}

export async function notifyRejection(
  userId: string,
  docType: string,
  reason: string
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.phone) {
    await sendSMS(
      user.phone,
      `Your ${docType} request was rejected. Reason: ${reason}`
    );
  }
}

export async function notifyDelivery(userId: string, docType: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.phone) {
    await sendSMS(
      user.phone,
      `Your ${docType} is ready for pickup or has been delivered.`
    );
  }
}

export async function notifyPayment(userId: string, docType: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.phone) {
    await sendSMS(
      user.phone,
      `Payment received for your ${docType} request. Processing will begin soon.`
    );
  }
}
