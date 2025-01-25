export const dynamic = "force-dynamic"
import OutletModel from "@/db/models/outletModel";

export async function GET() {
    const outlet = await OutletModel.findAll();
    return Response.json(outlet);
}

