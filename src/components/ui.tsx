import type { ReactNode } from "react";

// Shared look for the platform pages (sign up, sign in, panel): sober black and white.
export function Card({ children }: { children: ReactNode }) {
  return (
    <main className="flex flex-1 items-center justify-center bg-neutral-100 px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 sm:p-10">{children}</div>
    </main>
  );
}

// White box used inside the panel pages.
export function Caja({ titulo, children, className = "" }: { titulo?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`bg-white p-6 sm:p-8 ${className}`}>
      {titulo && <h2 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">{titulo}</h2>}
      {children}
    </section>
  );
}

export function Field({
  label,
  hint,
  ...props
}: { label: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-600">{label}</span>
      <input
        {...props}
        className="mt-2 w-full border-b border-neutral-300 bg-transparent px-0 py-2 text-neutral-900 outline-none focus:border-neutral-900"
      />
      {hint && <span className="mt-1 block text-xs text-neutral-500">{hint}</span>}
    </label>
  );
}

export function SubmitButton({ children, pending }: { children: ReactNode; pending?: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-neutral-900 px-4 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-white hover:bg-neutral-700 disabled:opacity-60"
    >
      {pending ? "Un momento…" : children}
    </button>
  );
}

export function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="bg-red-50 px-3 py-2 text-sm text-red-800">{message}</p>;
}
