// app/api/outlets/[outletId]/services/route.ts
import ServiceModel from "@/db/models/serviceModel";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { outletId: string } }) {
  const { outletId } = params;
  console.log("outletId", outletId);
  
  try {
    const services = await ServiceModel.findByOutletId( outletId );
    console.log(services);
    
    if (services.length === 0) {
      return new NextResponse(
        JSON.stringify({ message: "No services found for this outlet" }),
        { status: 404 }
      );
    }
    return new NextResponse(JSON.stringify(services), { status: 200 });
  } catch (error) {
    console.error("Error fetching services for outlet:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch services for this outlet" }),
      { status: 500 }
    );
  }
}
