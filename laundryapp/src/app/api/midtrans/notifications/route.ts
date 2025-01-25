import TransactionModel from "@/db/models/transactionModel";

export async function POST(request: Request) {
  const body = await request.json();
  const status = "paid";
  console.log("POST", body);

  await TransactionModel.updateStatus(body.order_id, status);

  return Response.json({ message: "Notification received" });
}
