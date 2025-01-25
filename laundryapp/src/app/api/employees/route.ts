import EmployeeModel from "@/db/models/employeeModel";

export async function POST(request: Request) {
  const outletId = request.headers.get("x-user-id") as string;
  const body = await request.json();
  await EmployeeModel.create({ outletId, body });
  return Response.json({
    message: "Employee created successfully",
  });
}

export async function GET(request: Request) {
  const outletId = request.headers.get("x-user-id") as string;

  const employees = await EmployeeModel.getAll(outletId);

  return Response.json(employees);
}
