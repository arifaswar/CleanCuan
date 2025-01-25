import ServiceModel from "@/db/models/serviceModel";
import { serviceType } from "@/types";
import OutletModel from "@/db/models/outletModel";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  const outletId = request.headers.get("x-user-id") as string;

  const body = await request.json();
  const outlet = await OutletModel.collection().findOne({
    _id: new ObjectId(outletId),
  });

  if (!outlet) {
    return new Response(JSON.stringify({ message: "Invalid outlet ID" }), {
      status: 400,
    });
  }

  const newService = {
    ...body,
    outletId: new ObjectId(outletId),
    // outletId,
  };

  await ServiceModel.create(newService);

  return Response.json({
    message: "Service created successfully",
    status: 201,
  });
}

export async function GET(request: Request) {
  const outletId = request.headers.get("x-user-id") as string;
  const services: serviceType[] = await ServiceModel.findByOutletId(outletId);

  return Response.json(services);
}