import { ObjectId } from "mongodb";
import { ZodError } from "zod";

export type outletType = {
  name: string;
  picName: string;
  picPhone: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  latitude: number;
  longitude: number;
};

export type customerType = {
  name: string;
  email: string;
  password: string;
  role: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
};

export type serviceType = {
  _id?: ObjectId;
  name: string;
  slug: string;
  price: number;
  duration: number;
  outletId?: ObjectId;
  picServices: string;
  outletDetails?: {
    name: string;
    picName: string;
    phone: string;
    email: string;
    address: string;
  };
};

export type employeeType = {
  name: string;
  salary: number;
  address: string;
  phoneNumber: string;
  outletId?: string;
};

export type employeeDetail = {
  _id: string;
  name: string;
  sallary: number;
  address: string;
  phoneNumber: string;
  outletId: string;
  outletDetail: {
    _id: string;
    name: string;
    picName: string;
    phone: string;
    email: string;
    password: string;
    address: string;
    latitude: number;
    longitude: number;
  };
};

export type services = {
  serviceId: string;
};

export type transactionType = {
  _id?: string;
  outletId: string;
  customerId: string;
  transactionDate: string;
  totalAmount: number;
  status: string;
  customerDetail?: customerType[];
  serviceDetail?: serviceType[];
  services?: { serviceId: string; quantity: number }[];
};

export type reportType = {
  date: string;
  totalAmount: number;
  transactionCount: number;
  outlets?: {
    outlet: string;
    amount: number;
  }[];
};

export type operationalType = {
  name: string;
  description: string;
  amount: number;
  date: string;
};

export type updateTransactionType = {
  serviceId: string;
  qty: number;
};

export type balanceType = {
  outletId: ObjectId;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Transaction = {
  id: string;
  customerName: string;
  customerAddress: string;
  dateTransaction: string;
  status: string;
  updateStatus: string;
};

type CustomError = {
  message: string;
  status: number;
};
export type AppError = CustomError | Error | ZodError;
