import { z } from "zod";
import { client, database } from "../config/config";
import { AppError, transactionType, updateTransactionType } from "../../types";
import { ObjectId } from "mongodb";
import ServiceModel from "./serviceModel";
import errorHandler from "@/helpers/errorHandler";

export const transactionDetailSchema = z.object({
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().positive(),
  transactionId: z.instanceof(ObjectId).nullable(),
});

export const transactionSchema = z.object({
  customerName: z.string(),
  customerAddress: z.string(),
  totalAmount: z.number().positive(),
  date: z.string(),
  status: z.string(),
  statusUpdate: z.string(),
  details: z.array(z.instanceof(ObjectId)),
  userId: z.string(),
});

class TransactionModel {
  static collection() {
    return database.collection("transactions");
  }

  static detailCollection() {
    return database.collection("transactionDetails");
  }

  static formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Bulan dimulai dari 0
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  static async create({
    userId,
    body,
  }: {
    userId: string;
    body: transactionType;
  }) {
    const { transactionDate, services, outletId } = body;
    if (!services || services.length === 0) {
      throw new Error("Services cannot be empty.");
    }
    await client.connect();
    const session = client.startSession();
    try {
      session.startTransaction();

      const transaction = {
        outletId: new ObjectId(outletId),
        customerId: new ObjectId(userId),
        transactionDate: this.formatDate(new Date(transactionDate)),
        totalAmount: 0,
        status: "pending",
      };
      const newTransaction = await this.collection().insertOne(transaction, {
        session,
      });

      for (const service of services) {
        await this.detailCollection().insertOne(
          {
            transactionId: newTransaction.insertedId,
            serviceId: new ObjectId(service.serviceId),
          },
          { session }
        );
      }
      session.commitTransaction();
      return newTransaction;
    } catch (error) {
      session.abortTransaction();
      await client.close();
      return errorHandler(error as AppError);
    }
  }

  static async getById(id: string) {
    const agg = [
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "transactionDetails",
          localField: "_id",
          foreignField: "transactionId",
          as: "services",
        },
      },
      {
        $lookup: {
          from: "services",
          localField: "services.serviceId",
          foreignField: "_id",
          as: "serviceDetail",
        },
      },
      {
        $lookup: {
          from: "customer",
          localField: "customerId",
          foreignField: "_id",
          as: "customerDetail",
        },
      },
      // {
      //   $unwind: {
      //     path: "$serviceDetail",
      //     preserveNullAndEmptyArrays: true,
      //   },
      // },
      // {
      //   $project: {
      //     services: 0,
      //   },
      // },
    ];

    return this.collection().aggregate(agg).toArray();
  }

  static async getByCustomerId(customerId: string) {
    const agg = [
      {
        $match: {
          customerId: new ObjectId(customerId),
        },
      },
      {
        $lookup: {
          from: "transactionDetails",
          localField: "_id",
          foreignField: "transactionId",
          as: "services",
        },
      },
      {
        $lookup: {
          from: "services",
          localField: "services.serviceId",
          foreignField: "_id",
          as: "serviceDetail",
        },
      },
      {
        $lookup: {
          from: "outlets",
          localField: "outletId",
          foreignField: "_id",
          as: "outletDetail",
        },
      },
      // {
      // $project: {
      //   services: 0,
      // },
      // },
    ];

    return this.collection().aggregate(agg).toArray();
  }

  static async getByOutletId(outletId: string) {
    const agg = [
      {
        $match: {
          outletId: new ObjectId(outletId),
        },
      },
      {
        $lookup: {
          from: "transactionDetails",
          localField: "_id",
          foreignField: "transactionId",
          as: "services",
        },
      },
      {
        $lookup: {
          from: "services",
          localField: "services.serviceId",
          foreignField: "_id",
          as: "serviceDetail",
        },
      },
      {
        $lookup: {
          from: "customer",
          localField: "customerId",
          foreignField: "_id",
          as: "customerDetail",
        },
      },
      {
        $project: {
          services: 0,
        },
      },
    ];

    return this.collection().aggregate(agg).toArray();
  }

  static async savePaymentLink(id: string, paymentLink: string) {
    await this.collection().updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          paymentLink: paymentLink,
        },
      }
    );
  }

  static async updateTransaction(
    id: string,
    services: updateTransactionType[],
  ) {
    // console.log(services, "services");
    await client.connect();
    const session = client.startSession();

    try {
      session.startTransaction();
      let totalAmount = 0;
      // const totalAmount = 0;
      const transaction = await this.collection().findOne({
        _id: new ObjectId(id),
      });
      // console.log(transaction, "transaction");

      for (const service of services) {
        const serviceDetail = await ServiceModel.findById(service.serviceId);

        console.log(serviceDetail, "service detail");

        if (serviceDetail) {
          totalAmount += serviceDetail.price * service.qty;
        }

        await this.detailCollection().updateOne(
          {
            transactionId: new ObjectId(id),
            serviceId: new ObjectId(service.serviceId),
          },
          {
            $set: {
              quantity: service.qty,
              total: serviceDetail ? serviceDetail.price * service.qty : 0,
            },
          },
          { session }
        );
        // console.log(detailTrans, "detail transaction");
      }

      const updatedTransaction = await this.collection().updateOne(
        { _id: new ObjectId(transaction?._id) },
        {
          $set: {
            totalAmount: totalAmount,
          },
        },
        { session }
      );

      session.commitTransaction();
      return updatedTransaction;
    } catch (error) {
      session.abortTransaction();
      throw error;
      // await client.close();
    }
  }

  static async updateStatus(id: string, status: string) {
    return this.collection().updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: status,
        },
      }
    );
  }

  static async deleteTransaction(id: string) {
    return this.collection().deleteOne({ _id: new ObjectId(id) });
  }

  static async reportDaily(outletId: string, date: Date) {
    console.log(date, "<<<<< date");
    console.log(outletId, "<<<<< outletId");
    console.log(this.formatDate(date), "<<<<< formatDate");
    const agg = [
      {
        $match: {
          outletId: new ObjectId(outletId),

          transactionDate: this.formatDate(date),
        },
      },
      {
        $lookup: {
          from: "transactionDetails",
          localField: "_id",
          foreignField: "transactionId",
          as: "services",
        },
      },
      {
        $lookup: {
          from: "services",
          localField: "services.serviceId",
          foreignField: "_id",
          as: "serviceDetail",
        },
      },
      {
        $project: {
          services: 0,
        },
      },
    ];

    return this.collection().aggregate(agg).toArray();
  }

  static async reportWeekly(outletId: string, startDate: Date, endDate: Date) {
    const agg = [
      {
        $match: {
          outletId: new ObjectId(outletId),
          transactionDate: {
            $gte: this.formatDate(startDate),
            $lte: this.formatDate(endDate),
          },
        },
      },
      {
        $lookup: {
          from: "transactionDetails",
          localField: "_id",
          foreignField: "transactionId",
          as: "services",
        },
      },
      {
        $lookup: {
          from: "services",
          localField: "services.serviceId",
          foreignField: "_id",
          as: "serviceDetail",
        },
      },
      {
        $project: {
          services: 0,
        },
      },
    ];

    return this.collection().aggregate(agg).toArray();
  }

  static async reportMonthly(outletId: string, startDate: Date, endDate: Date) {
    const agg = [
      {
        $match: {
          outletId: new ObjectId(outletId),
          transactionDate: {
            $gte: this.formatDate(startDate),
            $lte: this.formatDate(endDate),
          },
        },
      },
      {
        $lookup: {
          from: "transactionDetails",
          localField: "_id",
          foreignField: "transactionId",
          as: "services",
        },
      },
      {
        $lookup: {
          from: "services",
          localField: "services.serviceId",
          foreignField: "_id",
          as: "serviceDetail",
        },
      },
      {
        $project: {
          services: 0,
        },
      },
    ];

    return this.collection().aggregate(agg).toArray();
  }

  static async reportYearly(outletId: string, date: Date, endDate: Date) {
    const agg = [
      {
        $match: {
          outletId: new ObjectId(outletId),
          transactionDate: {
            $gte: new Date(date),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $lookup: {
          from: "transactionDetails",
          localField: "_id",
          foreignField: "transactionId",
          as: "services",
        },
      },
      {
        $lookup: {
          from: "services",
          localField: "services.serviceId",
          foreignField: "_id",
          as: "serviceDetail",
        },
      },
      {
        $project: {
          services: 0,
        },
      },
    ];

    return this.collection().aggregate(agg).toArray();
  }

  static async reportCustom(outletId: string, startDate: Date, endDate: Date) {
    const agg = [
      {
        $match: {
          outletId: new ObjectId(outletId),
          transactionDate: {
            $gte: this.formatDate(startDate),
            $lte: this.formatDate(endDate),
          },
        },
      },
      {
        $lookup: {
          from: "transactionDetails",
          localField: "_id",
          foreignField: "transactionId",
          as: "services",
        },
      },
      {
        $lookup: {
          from: "services",
          localField: "services.serviceId",
          foreignField: "_id",
          as: "serviceDetail",
        },
      },
      {
        $project: {
          services: 0,
        },
      },
    ];

    return this.collection().aggregate(agg).toArray();
  }
}

export default TransactionModel;
