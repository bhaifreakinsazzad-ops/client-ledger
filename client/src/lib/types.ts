export type WorkStatus =
  "Pending" | "In Progress" | "Completed" | "Payment Pending";

export type TxnType = "Received" | "Expense" | "Receivable" | "Payable";

export type PaymentMethod =
  "Cash" | "Bank Transfer" | "Mobile Banking" | "Cheque" | "Card" | "Other";

export interface Contact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
}

export interface Work {
  id: string;
  clientId: string;
  category: string;
  title: string;
  description: string;
  status: WorkStatus;
  fee: number; // agreed fee
  dueDate: string; // ISO
  startDate: string;
  notes: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  clientId: string | null; // null = personal finance
  workId: string | null;
  type: TxnType;
  date: string;
  amount: number;
  description: string;
  paymentMethod: PaymentMethod;
  remarks: string;
  bankAccountId: string | null;
  createdAt: string;
}

export interface BankAccount {
  id: string;
  name: string;
  bankName: string;
  accountNumber: string;
  openingBalance: number;
}

export interface Client {
  id: string;
  name: string;
  businessName: string;
  category: string;
  contacts: Contact[];
  notes: string;
  createdAt: string;
}

export interface AppData {
  clients: Client[];
  works: Work[];
  transactions: Transaction[];
  bankAccounts: BankAccount[];
  categories: string[];
}
