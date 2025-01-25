import { database } from "../config/config";
import { z } from "zod";
import { hashPass } from "@/helpers/bcrypt";
import { ObjectId } from "mongodb";
import { customerType } from "@/types";

const costumerSchema = z.object({
  name: z.string().min(3, { message: "Name is required." }).max(50),
  email: z.string().email({ message: "Email must be a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
  imgUrl: z.string(),
  role: z
    .string()
    .refine((role) => role === "customer", { message: "Invalid role" }),
  address: z.string().min(1, { message: "Address is required." }),
  phone: z.string().regex(/^\+?\d{10,15}$/, {
    message: "Phone must be a valid phone number.",
  }),
  latitude: z.number(),
  longitude: z.number(),
});

class CustomerModel {
  static collection() {
    return database.collection<customerType>("customer");
  }

  static async create(newCostumer: customerType) {
    costumerSchema.parse(newCostumer);

    const existCustomer = await this.collection().findOne({
      email: newCostumer.email,
    });
    if (existCustomer) {
      throw new Error(" Email already exists");
    }

    newCostumer.password = await hashPass(newCostumer.password);

    return this.collection().insertOne(newCostumer);
  }

  static async findByEmail(email: string) {
    return this.collection().findOne({ email });
  }

  static async findById(customerId: string) {
    const agg = [
      {
        $match: {
          _id: new ObjectId(customerId),
        },
      },
      {
        $lookup: {
          from: "transactions",
          localField: "_id",
          foreignField: "customerId",
          as: "transaction",
        },
      },
      {
        $unwind: {
          path: "$transaction",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "transactionDetails",
          localField: "transaction._id",
          foreignField: "transactionId",
          as: "transactionDetail",
        },
      },
      {
        $unwind: {
          path: "$transactionDetail",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "services",
          localField: "transactionDetail.serviceId",
          foreignField: "_id",
          as: "serviceDetail",
        },
      },
      {
        $unwind: {
          path: "$serviceDetail",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    return this.collection().aggregate(agg).toArray();
  }
  static async updateProfile(customerId: string, updatedData: customerType) {
    const updateSchema = z.object({
      name: z.string().min(3).max(50).optional(),
      email: z.string().email().optional(),
      address: z.string().min(1).optional(),
      phone: z
        .string()
        .regex(/^\+?\d{10,15}$/)
        .optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    });

    const validData = updateSchema.parse(updatedData);

    const customer = await this.collection().findOne({
      _id: new ObjectId(customerId),
    });
    if (!customer) {
      throw new Error("Customer not found");
    }
    const updateResult = await this.collection().updateOne(
      { _id: new ObjectId(customerId) },
      { $set: validData }
    );

    if (updateResult.modifiedCount === 0) {
      throw new Error("Failed to update profile");
    }
    return this.collection().findOne({ _id: new ObjectId(customerId) });
  }
}

export default CustomerModel;
