import { serviceType } from "@/types";
import { database } from "../config/config";
import { z } from "zod";
import { ObjectId } from "mongodb";

const serviceSchema = z.object({
  name: z.string(),
  price: z.number(),
  duration: z.number(),
});

class ServiceModel {
  static collection() {
    return database.collection<serviceType>("services");
  }

  static async create(newService: serviceType) {
    serviceSchema.parse(newService);
    newService.slug = newService.name.toLowerCase().replace(/\s+/g, "-");

    return await this.collection().insertOne(newService);
  }

  static async findAll() {
    return await this.collection().find().toArray();
  }

  static async findBySlug(slug: string) {
    const service = await this.collection().findOne({
      slug: slug,
    });
    return service;
  }

  static async deleteBySlug(slug: string) {
    return await this.collection().deleteOne({ slug: slug });
  }

  static async updateBySlug(slug: string, newService: serviceType) {
    newService.slug = newService.name.toLowerCase().replace(/\s+/g, "-");
    return await this.collection().updateOne(
      { slug: slug },
      {
        $set: {
          ...newService,
          outletId: new ObjectId(newService.outletId),
        },
      }
    );
  }

  static async findById(id: string) {
    return await this.collection().findOne({ _id: new ObjectId(id) });
  }

  static async findAllWithOutletDetails(): Promise<serviceType[]> {
    const aggPipeline = [
      {
        $addFields: {
          outletObjectId: { $toObjectId: "$outletId" },
        },
      },
      {
        $lookup: {
          from: "outlets",
          localField: "outletObjectId",
          foreignField: "_id",
          as: "outletDetails",
        },
      },
      {
        $unwind: {
          path: "$outletDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          name: 1,
          price: 1,
          duration: 1,
          slug: 1,
          "outletDetails.name": 1,
          "outletDetails.address": 1,
          "outletDetails.phone": 1,
          "outletDetails.email": 1,
        },
      },
    ];

    return (await this.collection()
      .aggregate(aggPipeline)
      .toArray()) as serviceType[];
  }

  static async findByOutletId(outletId: string) {
    const objectId = new ObjectId(outletId);
    console.log("objectId", objectId);
    return await this.collection().find({ outletId: objectId }).toArray();
  }
}

export default ServiceModel;
