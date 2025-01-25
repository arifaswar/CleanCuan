import BalanceModel from "@/db/models/balanceModel";
import TransactionModel from "@/db/models/transactionModel";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const transaction = await TransactionModel.getById(id);

  return Response.json(transaction);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { status } = await request.json();

  if (status === "done") {
    await TransactionModel.updateStatus(id, status);

    const transaction = await TransactionModel.getById(id);
    const totalAmount = transaction[0].totalAmount || 0;
    const outletId = transaction[0]?.outletId;

    await BalanceModel.updateBalance(outletId, totalAmount);
  }

  return Response.json({ message: "success" });
}
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  await TransactionModel.deleteTransaction(id);
  return Response.json({ message: "Success deleting" });
}
