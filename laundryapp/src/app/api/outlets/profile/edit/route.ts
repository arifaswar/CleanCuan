import { NextResponse } from "next/server";
import { database } from "@/db/config/config";

export async function PUT(request: Request) {

  const profileData = await request.json();
  const { email, name, picName, address, phone, password, latitude, longitude } = profileData;

  const outlet = await database.collection("outlets").findOne({ email });

  if (!outlet) {
    return NextResponse.json(
      { message: "Outlet with the given email not found." },
      { status: 404 }
    );
  }

  const updateResult = await database.collection("outlets").updateOne(
    { email },
    {
      $set: {
        name,
        picName,
        address,
        phone,
        password,
        latitude,
        longitude,
      },
    }
  );

  if (updateResult.modifiedCount === 0) {
    return NextResponse.json(
      { message: "Failed to update outlet profile." },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { message: "Outlet profile updated successfully." },
    { status: 200 }
  );
}
