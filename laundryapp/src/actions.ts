"use server";
import { cookies } from "next/headers";
import { employeeDetail, operationalType, serviceType, transactionType } from "./types";

export async function getOperationals() {
  const cookieStore = cookies();
  const cookieHeader = cookieStore.toString();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/operationals`,
    {
      headers: {
        Cookie: cookieHeader,
      },
      next: {
        tags: ["operationals"],
      },
    }
  );
  console.log("Response status:", response.status);

  if (!response.ok) {
    throw new Error(`Response status ${response.status}`);
  }
  const product: operationalType[] = await response.json();
  return product;
}

export async function addOperational(operational: operationalType) {
  const response = await fetch("/api/operational", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(operational),
  });

  if (!response.ok) {
    throw new Error("Failed to add operational");
  }

  return response.json();
}

export async function getBySlug(slug: string) {
  const cookieStore = cookies();
  const cookieHeader = cookieStore.toString();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/outlets/services/${slug}`,
    {
      headers: {
        Cookie: cookieHeader,
      },
      next: {
        tags: ["services"],
      },
    }
  );

  console.log("Response status:", response.status);

  if (!response.ok) {
    throw new Error(`Response status ${response.status}`);
  }

  const service: serviceType = await response.json();
  return service;
}

export async function getById(id: string) {
  const cookieStore = cookies();
  const cookieHeader = cookieStore.toString();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/employees/${id}`,
    {
      headers: {
        Cookie: cookieHeader,
      },
      next: {
        tags: ["employees"],
      },
    }
  );

  console.log("Response status:", response.status);

  if (!response.ok) {
    throw new Error(`Response status ${response.status}`);
  }

  const service: employeeDetail = await response.json();
  return service;
}


export const handleLogout = async () => {
  cookies().delete("authorization");
};



export async function createService() {
  const cookieStore = cookies();
  const cookieHeader = cookieStore.toString();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/outlets/services`,
    {
      headers: {
        Cookie: cookieHeader,
      },
      next: {
        tags: ["services"],
      },
    }
  );
  console.log("Response status:", response.status);

  
  if (!response.ok) {
    throw new Error(`Response status ${response.status}`);
  }
  const product: serviceType[] = await response.json();
  return product;
}

export async function getTransactionById(id: string): Promise<transactionType[]> {
  const cookieStore = cookies();
  const cookieHeader = cookieStore.toString();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/outlets/transactions/${id}`,
    {
      headers: {
        Cookie: cookieHeader,
      },
      next: {
        tags: ["transactions"],
      },
    }
  );

  console.log("Response status:", response.status);

  if (!response.ok) {
    throw new Error(`Response status ${response.status}`);
  }

  const transaction: transactionType[] = await response.json();
  console.log("Transaction details:", transaction);
  return transaction;
}
