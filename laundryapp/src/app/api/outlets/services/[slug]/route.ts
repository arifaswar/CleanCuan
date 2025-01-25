import ServiceModel from "@/db/models/serviceModel";
import errorHandler from "@/helpers/errorHandler";
import { AppError } from "@/types";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  const service = await ServiceModel.findBySlug(slug);
  if (!service) {
    return new Response(JSON.stringify({ message: "Service not found" }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(service), { status: 200 });
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  const result = await ServiceModel.deleteBySlug(slug);
  if (result.deletedCount === 0) {
    return new Response(JSON.stringify({ message: "Service not found" }), {
      status: 404,
    });
  }

  return new Response(
    JSON.stringify({ message: "Service deleted successfully" }),
    { status: 200 }
  );
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const newService = await request.json();

  try {
    const result = await ServiceModel.updateBySlug(slug, newService);
    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ message: "Service not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "Service updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return errorHandler(error as AppError);
  }
}
