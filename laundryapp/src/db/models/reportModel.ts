import { z } from "zod";
import { database } from "../config/config";
import { AppError, reportType } from "@/types";
import errorHandler from "@/helpers/errorHandler";

const reportSchema = z.object({
  date: z.string(),
  totalAmount: z.number(),
  transactionCount: z.number(),
  outlets: z.array(
    z.object({
      outlet: z.string(),
      amount: z.number(),
    })
  ),
});

export class ReportModel {
  static collection() {
    return database.collection("reports");
  }

  static create(report: reportType) {
    const validatedReport = reportSchema.parse(report);
    return this.collection().insertOne(validatedReport);
  }

  static async getReportsByYear(year: string) {
    try {
      const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
      const endOfYear = new Date(`${parseInt(year) + 1}-01-01T00:00:00.000Z`);
      const reports = await this.collection()
        .find({
          date: {
            $gte: startOfYear.toISOString(),
            $lt: endOfYear.toISOString(),
          },
        })
        .toArray();

      return reports.map((report) => reportSchema.parse(report));
    } catch (error) {
      return errorHandler(error as AppError);
    }
  }
}
