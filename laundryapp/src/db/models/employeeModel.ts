// import { z } from "zod";
import { database } from "../config/config";
import { employeeType } from "@/types";
import { ObjectId } from "mongodb";

// const employeeSchema = z.object({
//   name: z.string().min(3).max(50),
//   salary: z.number().min(0),
//   address: z.string().min(3).max(100),
//   phoneNumber: z.string().min(10).max(15),
// });

class EmployeeModel {
  static collection() {
    return database.collection("employees");
  }

  static async create({
    outletId,
    body,
  }: {
    outletId: string;
    body: employeeType;
  }) {
    const newEmployee = {
      name: body.name,
      salary: body.salary,
      address: body.address,
      phoneNumber: body.phoneNumber,
      outletId: new ObjectId(outletId),
    };

    return await this.collection().insertOne(newEmployee);
  }

  static async getAll(outletId: string) {
    const employees = await this.collection()
      .aggregate([
        {
          $match: {
            outletId: new ObjectId(outletId),
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
        {
          $unwind: {
            path: "$outletDetail",
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
      .toArray();

    return employees;
  }

  static async findById(id: string) {
    return await this.collection().findOne(new ObjectId(id));
  }

  static async updateById(id: string, employee: employeeType) {
    return await this.collection().updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...employee,
          outletId: new ObjectId(String(employee.outletId)),
        },
      }
    );
  }

  static async deleteById(id: string) {
    return await this.collection().deleteOne({ _id: new ObjectId(id) });
  }
}

export default EmployeeModel;
