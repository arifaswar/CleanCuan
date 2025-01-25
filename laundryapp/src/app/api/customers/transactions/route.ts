import TransactionModel from "@/db/models/transactionModel";

export async function POST(request: Request) {
  const userId = request.headers.get("x-user-id") as string;
  const body = await request.json();

  await TransactionModel.create({ userId, body });

  return Response.json({
    message: "Transaction created successfully",
  });
}

export async function GET(request: Request) {
  const customerId = request.headers.get("x-user-id") as string;

  const transactions = await TransactionModel.getByCustomerId(customerId);

  return Response.json(transactions);
}
