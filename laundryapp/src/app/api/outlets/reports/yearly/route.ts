
import OperationalModel from "@/db/models/operationalModel";
import TransactionModel from "@/db/models/transactionModel";
import errorHandler from "@/helpers/errorHandler";
import { AppError, serviceType } from "@/types";

export async function GET(request: Request) {
  const outletId = request.headers.get("x-user-id") as string;

  const today = new Date();

  const startDate = new Date(today.getFullYear(), 0, 1);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(today.getFullYear(), 11, 31);
  endDate.setHours(23, 59, 59, 999);

  console.log("Start Date:", startDate);
  console.log("End Date:", endDate);

  try {
    const transaction = await TransactionModel.reportMonthly(
      outletId,
      startDate,
      endDate
    );

    const expense = await OperationalModel.reportMonthly(
      outletId,
      startDate,
      endDate
    );

    const totalExpense = expense.reduce(
      (sum, exp) => sum + (exp.total || 0),
      0
    );

    const totalPrice = transaction.reduce((sum, t) => {
      const serviceTotal = t.serviceDetail.reduce(
        (serviceSum: number, service: serviceType) =>
          serviceSum + (service.price || 0),
        0
      );
      return sum + serviceTotal;
    }, 0);

    return Response.json({
      transaction,
      totalTransaction: transaction.length,
      totalExpense,
      totalPrice,
    });
  } catch (error) {
    return errorHandler(error as AppError);
  }
}
