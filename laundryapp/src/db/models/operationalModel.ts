import { operationalType } from "@/types";
import { database } from "../config/config";

class OperationalModel {
  static collection() {
    return database.collection("operational");
  }
  static formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Bulan dimulai dari 0
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  static async create(outletId: string, newOperational: operationalType) {
    const today = new Date();

    const operational = {
      date: this.formatDate(today),
      outletId: outletId,
      name: newOperational.name,
      description: newOperational.description,
      amount: newOperational.amount,
    };
    return this.collection().insertOne(operational);
  }

  static async get(outletId: string) {
    return this.collection().find({ outletId: outletId }).toArray();
  }

  static async reportDaily(outletId: string, date: Date) {
    const agg = [
      {
        $match: {
          outletId: outletId,
          date: this.formatDate(date),
        },
      },
      {
        $group: {
          _id: "$outletId",
          total: { $sum: "$amount" },
        },
      },
    ];

    return this.collection().aggregate(agg).toArray();
  }

  static async reportWeekly(outletId: string, startDate: Date, endDate: Date) {
    const agg = [
      {
        $match: {
          outletId: outletId,
          date: {
            $gte: this.formatDate(startDate),
            $lte: this.formatDate(endDate),
          },
        },
      },
      {
        $group: {
          _id: "$outletId",
          total: { $sum: "$amount" },
        },
      },
    ];
  
    return this.collection().aggregate(agg).toArray();
  }



  static async reportMonthly(outletId: string, startDate: Date, endDate: Date) {
    const agg = [
      {
        $match: {
          outletId: outletId,
          date: {   
            $gte: this.formatDate(startDate),
            $lte: this.formatDate(endDate), 
          },
        },
      },
      {
        $group: {
          _id: "$outletId",
          total: { $sum: "$amount" }, 
        },
      },
    ];
  
    return this.collection().aggregate(agg).toArray(); 
  }
  
  
  static async reportYearly(outletId: string, date: Date, endDate: Date) {
 
    const agg = [
      {
        $match: {
          outletId: outletId,
          date: { 
            $gte: this.formatDate(date),
            $lte: this.formatDate(endDate),
          },
        },
      },
      {
        $group: {
          _id: "$outletId",
          total: { $sum: "$amount" },
        },
      },
    ];
  

    return this.collection().aggregate(agg).toArray(); 
  }
  
  
}

export default OperationalModel;
