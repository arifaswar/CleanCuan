import TransactionModel from "@/db/models/transactionModel";
import errorHandler from "@/helpers/errorHandler";
import { AppError } from "@/types";
import { MidtransClient } from "midtrans-node-client";

const snap = new MidtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export async function POST(request: Request) {
  try {
    const { totalAmount, transactionId } = await request.json();
    console.log(totalAmount, transactionId, "midTrans");

    const transaction = await TransactionModel.getById(transactionId);

    if (!transaction[0].paymentLink) {
      const parameter = {
        transaction_details: {
          order_id: transactionId,
          gross_amount: totalAmount,
        },
      };

      const transactionToken = await snap.createTransaction(parameter);
      await TransactionModel.savePaymentLink(
        transactionId,
        transactionToken.redirect_url
      );
      return Response.json({ transactionToken });
    } else {
      return Response.json({ message: "Transaction already paid" });
    }
  } catch (error) {
    return errorHandler(error as AppError);
  }
}
