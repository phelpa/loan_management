import { FormEvent, useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

type LoanModalProps = {
  loanId?: Id<"loans">;
  isOpen: boolean;
  onClose: () => void;
};

export function LoanModal({ loanId, isOpen, onClose }: LoanModalProps) {
  const loan = useQuery(api.loans.get, loanId ? { loanId } : "skip");
  const updateLoan = useMutation(api.loans.update);
  const updateStatus = useMutation(api.loans.updateStatus);
  const deleteLoan = useMutation(api.loans.remove);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    borrowerName: "",
    amount: "",
    interestRate: "",
    term: "",
    description: "",
  });

  useEffect(() => {
    if (loan) {
      setFormData({
        borrowerName: loan.borrowerName,
        amount: loan.amount.toString(),
        interestRate: loan.interestRate.toString(),
        term: loan.term.toString(),
        description: loan.description,
      });
    }
  }, [loan]);

  if (!isOpen) return null;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!loanId) return;
    
    setIsSubmitting(true);
    try {
      await updateLoan({
        loanId,
        borrowerName: formData.borrowerName,
        amount: Number(formData.amount),
        interestRate: Number(formData.interestRate),
        term: Number(formData.term),
        description: formData.description,
      });
      toast.success("Loan updated successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to update loan");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleStatusUpdate(status: "pending" | "active" | "paid" | "defaulted") {
    if (!loanId) return;
    
    try {
      await updateStatus({ loanId, status });
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  }

  async function handleDelete() {
    if (!loanId || !confirm("Are you sure you want to delete this loan?")) return;
    
    try {
      await deleteLoan({ loanId });
      toast.success("Loan deleted successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to delete loan");
      console.error(error);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">
              {loan ? "Edit Loan" : "Loading..."}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {loan && (
            <>
              <div className="mb-6">
                <h3 className="font-medium mb-2">Loan Status</h3>
                <div className="flex gap-2">
                  {["pending", "active", "paid", "defaulted"].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(status as any)}
                      className={`px-3 py-1 rounded capitalize ${
                        loan.status === status
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Borrower Name
                    </label>
                    <input
                      type="text"
                      value={formData.borrowerName}
                      onChange={(e) =>
                        setFormData({ ...formData, borrowerName: e.target.value })
                      }
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Loan Amount ($)
                    </label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                      min="0"
                      step="0.01"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Interest Rate (%)
                    </label>
                    <input
                      type="number"
                      value={formData.interestRate}
                      onChange={(e) =>
                        setFormData({ ...formData, interestRate: e.target.value })
                      }
                      min="0"
                      step="0.01"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Term (Months)
                    </label>
                    <input
                      type="number"
                      value={formData.term}
                      onChange={(e) =>
                        setFormData({ ...formData, term: e.target.value })
                      }
                      min="1"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      rows={3}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Delete Loan
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
