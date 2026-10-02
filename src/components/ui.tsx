import type { ReactNode } from "react";

// Shared look for the simple card pages (sign up, sign in, panel).
export function Card({ children }: { children: ReactNode }) {
  return (
    <main className="flex flex-1 items-center justify-center bg-rose-50 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">{children}</div>
    </main>
  );
}

export function Field({
  label,
  hint,
  ...props
}: { label: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-stone-700">{label}</span>
      <input
        {...props}
        className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-stone-800 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
      />
      {hint && <span className="mt-1 block text-xs text-stone-500">{hint}</span>}
    </label>
  );
}

export function SubmitButton({ children, pending }: { children: ReactNode; pending?: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-rose-500 px-4 py-2.5 font-medium text-white hover:bg-rose-600 disabled:opacity-60"
    >
      {pending ? "Un momento…" : children}
    </button>
  );
}

export function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800">{message}</p>;
}
