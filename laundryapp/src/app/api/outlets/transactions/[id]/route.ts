import TransactionModel from "@/db/models/transactionModel";
import { AppError } from "@/types";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { services, status } = await request.json();
  try {
    console.log("PUT", id, services);
    await TransactionModel.updateTransaction(id, services);
    return new Response(
      JSON.stringify({ message: "Transaction updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    // return errorHandler(error as AppError);
    console.log("error", error as AppError);
    
  }
  return Response.json({ id });
}

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
  await TransactionModel.updateStatus(id, status);

  return Response.json({ message: "success" });
}
