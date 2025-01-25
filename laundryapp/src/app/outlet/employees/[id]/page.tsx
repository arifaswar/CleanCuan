import { getById } from "@/actions";

export type employeeProps = {
    params: {
      id: string;
    };
  };


    export default async function Detail({ params }: employeeProps) {
        const employee = await getById(params.id);
      
        return (
          <div className="flex justify-center items-center min-h-screen py-8 px-4 mt-12">
            <div className="w-full max-w-4xl">
              <div className="text-center mb-4">
                <h1 className="text-3xl font-semibold text-gray-800">{employee.name}</h1>
              </div>
      
              <div className="space-y-4 text-center">
                <p className="text-lg text-gray-600">Salary: Rp {employee.sallary?.toLocaleString("id-ID") || "0"}</p>
                <p className="text-lg text-gray-600">Address: {employee.address}</p>
                <p className="text-lg text-gray-600">Phone: {employee.phoneNumber}</p>
              </div>
      
              {employee.outletDetail && (
                <div className="mt-8 space-y-4">
                  <h2 className="text-2xl font-semibold text-gray-800">Outlet Details</h2>
                  <div className="text-lg text-gray-600">
                    <p><strong>Outlet Name:</strong> {employee.outletDetail.name}</p>
                    <p><strong>Contact Person:</strong> {employee.outletDetail.picName}</p>
                    <p><strong>Phone:</strong> {employee.outletDetail.phone}</p>
                    <p><strong>Email:</strong> {employee.outletDetail.email}</p>
                    <p><strong>Address:</strong> {employee.outletDetail.address}</p>
                    <p><strong>Location:</strong> Latitude: {employee.outletDetail.latitude}, Longitude: {employee.outletDetail.longitude}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      }