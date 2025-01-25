import OperationalModel from "@/db/models/operationalModel";

export async function POST(request: Request) {
  const outletId = request.headers.get("x-user-id") as string;
  console.log("Received outletId:", outletId);
  const newOperational = await request.json();
  await OperationalModel.create(outletId, newOperational);
  return Response.json({
    message: "Operational created successfully",
  });
}

export async function GET(request: Request) {
  const outletId = request.headers.get("x-user-id") as string;
  const operational = await OperationalModel.get(outletId);
  return Response.json(operational);
}
