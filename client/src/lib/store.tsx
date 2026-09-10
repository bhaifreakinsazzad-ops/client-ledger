import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { AppData, BankAccount, Client, Transaction, Work } from "./types";
import { seedData } from "./seed";
import { uid } from "./format";

const STORAGE_KEY = "financeflow_data_v1";

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppData;
      if (parsed && parsed.clients && parsed.transactions) return parsed;
    }
  } catch {
    /* ignore */
  }
  return seedData;
}

interface StoreContextValue {
  data: AppData;
  // clients
  addClient: (c: Omit<Client, "id" | "createdAt">) => Client;
  updateClient: (id: string, patch: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  // works
  addWork: (w: Omit<Work, "id" | "createdAt">) => Work;
  updateWork: (id: string, patch: Partial<Work>) => void;
  deleteWork: (id: string) => void;
  // transactions
  addTransaction: (t: Omit<Transaction, "id" | "createdAt">) => Transaction;
  updateTransaction: (id: string, patch: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  // bank accounts
  addBankAccount: (b: Omit<BankAccount, "id">) => BankAccount;
  updateBankAccount: (id: string, patch: Partial<BankAccount>) => void;
  deleteBankAccount: (id: string) => void;
  // categories
  addCategory: (name: string) => void;
  renameCategory: (oldName: string, newName: string) => void;
  deleteCategory: (name: string) => void;
  resetData: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadData());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* ignore */
    }
  }, [data]);

  const addClient = useCallback((c: Omit<Client, "id" | "createdAt">) => {
    const client: Client = {
      ...c,
      id: uid("cl"),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setData((d) => ({ ...d, clients: [client, ...d.clients] }));
    return client;
  }, []);

  const updateClient = useCallback((id: string, patch: Partial<Client>) => {
    setData((d) => ({
      ...d,
      clients: d.clients.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
  }, []);

  const deleteClient = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      clients: d.clients.filter((c) => c.id !== id),
      works: d.works.filter((w) => w.clientId !== id),
      transactions: d.transactions.filter((t) => t.clientId !== id),
    }));
  }, []);

  const addWork = useCallback((w: Omit<Work, "id" | "createdAt">) => {
    const work: Work = {
      ...w,
      id: uid("wk"),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setData((d) => ({ ...d, works: [work, ...d.works] }));
    return work;
  }, []);

  const updateWork = useCallback((id: string, patch: Partial<Work>) => {
    setData((d) => ({
      ...d,
      works: d.works.map((w) => (w.id === id ? { ...w, ...patch } : w)),
    }));
  }, []);

  const deleteWork = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      works: d.works.filter((w) => w.id !== id),
      transactions: d.transactions.filter((t) => t.workId !== id),
    }));
  }, []);

  const addTransaction = useCallback(
    (t: Omit<Transaction, "id" | "createdAt">) => {
      const txn: Transaction = {
        ...t,
        id: uid("tx"),
        createdAt: new Date().toISOString(),
      };
      setData((d) => ({ ...d, transactions: [txn, ...d.transactions] }));
      return txn;
    },
    [],
  );

  const updateTransaction = useCallback(
    (id: string, patch: Partial<Transaction>) => {
      setData((d) => ({
        ...d,
        transactions: d.transactions.map((t) =>
          t.id === id ? { ...t, ...patch } : t,
        ),
      }));
    },
    [],
  );

  const deleteTransaction = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      transactions: d.transactions.filter((t) => t.id !== id),
    }));
  }, []);

  const addBankAccount = useCallback((b: Omit<BankAccount, "id">) => {
    const acc: BankAccount = { ...b, id: uid("bk") };
    setData((d) => ({ ...d, bankAccounts: [...d.bankAccounts, acc] }));
    return acc;
  }, []);

  const updateBankAccount = useCallback(
    (id: string, patch: Partial<BankAccount>) => {
      setData((d) => ({
        ...d,
        bankAccounts: d.bankAccounts.map((b) =>
          b.id === id ? { ...b, ...patch } : b,
        ),
      }));
    },
    [],
  );

  const deleteBankAccount = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      bankAccounts: d.bankAccounts.filter((b) => b.id !== id),
    }));
  }, []);

  const addCategory = useCallback((name: string) => {
    const n = name.trim();
    if (!n) return;
    setData((d) =>
      d.categories.includes(n) ? d : { ...d, categories: [...d.categories, n] },
    );
  }, []);

  const renameCategory = useCallback((oldName: string, newName: string) => {
    const n = newName.trim();
    if (!n || oldName === n) return;
    setData((d) => ({
      ...d,
      categories: d.categories.map((c) => (c === oldName ? n : c)),
      clients: d.clients.map((c) =>
        c.category === oldName ? { ...c, category: n } : c,
      ),
      works: d.works.map((w) =>
        w.category === oldName ? { ...w, category: n } : w,
      ),
    }));
  }, []);

  const deleteCategory = useCallback((name: string) => {
    setData((d) => ({
      ...d,
      categories: d.categories.filter((c) => c !== name),
    }));
  }, []);

  const resetData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setData(seedData);
  }, []);

  const value = useMemo<StoreContextValue>(
    () => ({
      data,
      addClient,
      updateClient,
      deleteClient,
      addWork,
      updateWork,
      deleteWork,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addBankAccount,
      updateBankAccount,
      deleteBankAccount,
      addCategory,
      renameCategory,
      deleteCategory,
      resetData,
    }),
    [
      data,
      addClient,
      updateClient,
      deleteClient,
      addWork,
      updateWork,
      deleteWork,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addBankAccount,
      updateBankAccount,
      deleteBankAccount,
      addCategory,
      renameCategory,
      deleteCategory,
      resetData,
    ],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
