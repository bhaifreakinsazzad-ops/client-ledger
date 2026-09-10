import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Wallet } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatBDT, formatDate } from "@/lib/format";
import { StatCard } from "@/components/StatCard";
import { TransactionFormDialog } from "@/components/TransactionFormDialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const PersonalFinance = () => {
  const { data, deleteTransaction } = useStore();
  const [txnForm, setTxnForm] = useState(false);
  const [editTxnId, setEditTxnId] = useState<string | null>(null);

  const personalTxns = useMemo(
    () =>
      data.transactions
        .filter((t) => t.clientId === null)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [data.transactions],
  );

  const income = personalTxns
    .filter((t) => t.type === "Received")
    .reduce((s, t) => s + t.amount, 0);
  const expense = personalTxns
    .filter((t) => t.type === "Expense")
    .reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            Personal Finance / ব্যক্তিগত হিসাব
          </h1>
          <p className="text-sm text-muted-foreground">দৈনিক আয়-খরচের হিসাব</p>
        </div>
        <Button
          onClick={() => {
            setEditTxnId(null);
            setTxnForm(true);
          }}
          className="gradient-primary text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> Add Entry
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatCard
          label="Income / আয়"
          value={formatBDT(income)}
          tone="success"
        />
        <StatCard
          label="Expense / খরচ"
          value={formatBDT(expense)}
          tone="destructive"
        />
        <StatCard
          label="Net / নিট"
          value={formatBDT(income - expense)}
          tone={income - expense >= 0 ? "success" : "destructive"}
        />
      </div>

      {personalTxns.length === 0 ? (
        <div className="card-surface flex flex-col items-center gap-2 p-12 text-center">
          <Wallet className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">কোনো এন্ট্রি নেই।</p>
        </div>
      ) : (
        <div className="card-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/50 text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium">Method</th>
                  <th className="px-4 py-3 text-right font-medium">Amount</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {personalTxns.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/30">
                    <td className="whitespace-nowrap px-4 py-3 text-xs">
                      {formatDate(t.date)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          t.type === "Received"
                            ? "text-xs font-medium text-success"
                            : "text-xs font-medium text-destructive"
                        }
                      >
                        {t.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm">{t.description}</p>
                      {t.remarks && (
                        <p className="text-xs text-muted-foreground">
                          {t.remarks}
                        </p>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">
                      {t.paymentMethod}
                    </td>
                    <td
                      className={`whitespace-nowrap px-4 py-3 text-right font-semibold ${t.type === "Received" ? "text-success" : "text-destructive"}`}
                    >
                      {formatBDT(t.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => {
                            setEditTxnId(t.id);
                            setTxnForm(true);
                          }}
                          className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("এন্ট্রি মুছবেন?")) {
                              deleteTransaction(t.id);
                              toast.success("Deleted");
                            }
                          }}
                          className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <TransactionFormDialog
        open={txnForm}
        onOpenChange={setTxnForm}
        clientId={null}
        editId={editTxnId}
      />
    </div>
  );
};

export default PersonalFinance;
