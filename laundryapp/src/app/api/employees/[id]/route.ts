import EmployeeModel from "@/db/models/employeeModel";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const employee = await EmployeeModel.findById(id);

  return Response.json(employee);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const employee = await request.json();

  await EmployeeModel.updateById(id, employee);

  return Response.json({
    message: "Employee updated successfully",
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  await EmployeeModel.deleteById(id);
  return Response.json({
    message: "Employee deleted successfully",
  });
}
