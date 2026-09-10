import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Landmark,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { bankBalance } from "@/lib/selectors";
import { formatBDT } from "@/lib/format";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const BankAccounts = () => {
  const { data, addBankAccount, updateBankAccount, deleteBankAccount } =
    useStore();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [openingBalance, setOpeningBalance] = useState("");

  const openNew = () => {
    setEditId(null);
    setName("");
    setBankName("");
    setAccountNumber("");
    setOpeningBalance("");
    setOpen(true);
  };

  const openEdit = (id: string) => {
    const acc = data.bankAccounts.find((b) => b.id === id);
    if (!acc) return;
    setEditId(id);
    setName(acc.name);
    setBankName(acc.bankName);
    setAccountNumber(acc.accountNumber);
    setOpeningBalance(String(acc.openingBalance));
    setOpen(true);
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    const payload = {
      name,
      bankName,
      accountNumber,
      openingBalance: Number(openingBalance) || 0,
    };
    if (editId) {
      updateBankAccount(editId, payload);
      toast.success("Account updated");
    } else {
      addBankAccount(payload);
      toast.success("Account added");
    }
    setOpen(false);
  };

  const totalBalance = data.bankAccounts.reduce(
    (s, b) => s + bankBalance(data, b.id).balance,
    0,
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            Bank Accounts / ব্যাংক হিসাব
          </h1>
          <p className="text-sm text-muted-foreground">
            অ্যাকাউন্টভিত্তিক balance ও লেনদেন
          </p>
        </div>
        <Button
          onClick={openNew}
          className="gradient-primary text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> Add Account
        </Button>
      </div>

      <StatCard
        label="Total Bank Balance / মোট ব্যাংক ব্যালেন্স"
        value={formatBDT(totalBalance)}
        tone="primary"
      />

      {data.bankAccounts.length === 0 ? (
        <div className="card-surface flex flex-col items-center gap-2 p-12 text-center">
          <Landmark className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            কোনো ব্যাংক অ্যাকাউন্ট নেই।
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.bankAccounts.map((b) => {
            const bal = bankBalance(data, b.id);
            return (
              <div key={b.id} className="card-surface card-surface-hover p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-secondary p-2.5 text-primary">
                      <Landmark className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{b.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {b.bankName}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(b.id)}
                      className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("অ্যাকাউন্ট মুছবেন?")) {
                          deleteBankAccount(b.id);
                          toast.success("Deleted");
                        }
                      }}
                      className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  A/C: {b.accountNumber || "—"}
                </p>
                <p className="mt-2 text-2xl font-bold text-primary">
                  {formatBDT(bal.balance)}
                </p>
                <div className="mt-3 flex gap-4 border-t border-border pt-3 text-xs">
                  <span className="flex items-center gap-1 text-success">
                    <ArrowDownLeft className="h-3 w-3" />{" "}
                    {formatBDT(bal.deposits)}
                  </span>
                  <span className="flex items-center gap-1 text-destructive">
                    <ArrowUpRight className="h-3 w-3" />{" "}
                    {formatBDT(bal.withdrawals)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editId ? "Edit Account" : "New Bank Account"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Account Name / নাম *</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Business Current"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Bank Name / ব্যাংক</Label>
              <Input
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Account Number</Label>
              <Input
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Opening Balance (৳)</Label>
              <Input
                type="number"
                value={openingBalance}
                onChange={(e) => setOpeningBalance(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="gradient-primary text-primary-foreground"
            >
              {editId ? "Save" : "Add Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BankAccounts;
