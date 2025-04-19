import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { LoanModal } from "./LoanModal";
import { Id } from "../../convex/_generated/dataModel";

export function LoanList() {
  const loans = useQuery(api.loans.list);
  const [selectedLoanId, setSelectedLoanId] = useState<Id<"loans"> | undefined>();

  if (!loans) {
    return (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (loans.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No loans found. Create your first loan to get started.
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Borrower
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Interest Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Term (Months)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loans.map((loan) => (
              <tr key={loan._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{loan.borrowerName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${loan.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {loan.interestRate}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{loan.term}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded text-sm capitalize ${
                      loan.status === "active"
                        ? "bg-green-100 text-green-800"
                        : loan.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : loan.status === "paid"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {loan.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => setSelectedLoanId(loan._id)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    View/Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <LoanModal
        loanId={selectedLoanId}
        isOpen={!!selectedLoanId}
        onClose={() => setSelectedLoanId(undefined)}
      />
    </>
  );
}
