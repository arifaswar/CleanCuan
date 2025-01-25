import { getBySlug } from "@/actions";

export type Props = {
  params: {
    slug: string;
  };
};

export default async function Detail({ params }: Props) {
  const service = await getBySlug(params.slug);

  return (
    <div className="flex justify-center items-center min-h-screen py-8 px-4 mt-12">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Display Image */}
        <div className="w-full h-64">
          <img
            src={service.picServices}
            alt={service.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6">
          {/* Service Details */}
          <div className="text-center mb-4">
            <h1 className="text-3xl font-semibold text-gray-800">{service.name}</h1>
          </div>

          <div className="space-y-4 text-center">
            <p className="text-lg text-gray-600">Duration: {service.duration} minutes</p>
            <p className="text-2xl font-bold text-red-500">
              Rp {service.price?.toLocaleString("id-ID") || "0"}
            </p>
          </div>

          {service.outletDetails && (
            <div className="mt-8 space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">Outlet Details</h2>
              <div className="text-lg text-gray-600">
                <p><strong>Name:</strong> {service.outletDetails.name}</p>
                <p><strong>Contact Person:</strong> {service.outletDetails.picName}</p>
                <p><strong>Phone:</strong> {service.outletDetails.phone}</p>
                <p><strong>Email:</strong> {service.outletDetails.email}</p>
                <p><strong>Address:</strong> {service.outletDetails.address}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}