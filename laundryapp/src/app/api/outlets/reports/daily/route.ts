import OperationalModel from "@/db/models/operationalModel";
import TransactionModel from "@/db/models/transactionModel";
import errorHandler from "@/helpers/errorHandler";
import { AppError, serviceType } from "@/types";

type Expense = {
  _id: string;
  total: number;
};

export async function GET(request: Request) {
  const outletId = request.headers.get("x-user-id") as string;

  const date = new Date();

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  try {
    const transaction = await TransactionModel.reportDaily(outletId, startOfDay);

    const totalPrice = transaction.reduce((sum, t) => {
      const serviceTotal = t.serviceDetail.reduce(
        (serviceSum: number, service: serviceType) =>
          serviceSum + (service.price || 0),
        0
      );
      return sum + serviceTotal;
    }, 0);

    const expenseData = await OperationalModel.reportDaily(outletId, date);
    const expenses: Expense[] = expenseData.map((e) => ({
      _id: e._id,
      total: e.total,
    }));
    const totalExpense = expenses.reduce((sum, e) => sum + e.total, 0);

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
