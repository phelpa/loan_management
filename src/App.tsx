import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { useState } from "react";
import { LoanList } from "./components/LoanList";
import { LoanForm } from "./components/LoanForm";
import { Toaster } from "sonner";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-semibold accent-text">Loan Management</h2>
        <SignOutButton />
      </header>
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <Content />
        </div>
      </main>
      <Toaster />
    </div>
  );
}

function Content() {
  const [showForm, setShowForm] = useState(false);
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold accent-text mb-4">Loan Management System</h1>
        <Authenticated>
          <p className="text-xl text-slate-600 mb-8">Welcome, {loggedInUser?.email}!</p>
          <div className="flex flex-col gap-8">
            <div className="flex justify-end">
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                {showForm ? "Close Form" : "Create New Loan"}
              </button>
            </div>
            {showForm && <LoanForm onSuccess={() => setShowForm(false)} />}
            <LoanList />
          </div>
        </Authenticated>
        <Unauthenticated>
          <p className="text-xl text-slate-600">Sign in to manage loans</p>
          <SignInForm />
        </Unauthenticated>
      </div>
    </div>
  );
}
