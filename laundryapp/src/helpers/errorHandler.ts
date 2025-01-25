import { AppError } from '@/types';
import { z } from 'zod';

export default function errorHandler(error: AppError) {
  let message = error.message || "Internal server error";
  let status = 500;

  if("status" in error) {
    status = error.status;
  }

  if (error instanceof z.ZodError) {
    message = error.issues[0].message;
    status = 400;
  }

  return Response.json(
    {
      message: message,
    },
    {
      status: status,
    }
  );
}
