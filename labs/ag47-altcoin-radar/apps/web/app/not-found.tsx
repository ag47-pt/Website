import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-radar-canvas px-6 text-center">
      <div>
        <p className="eyebrow">404 • Fora do alcance</p>
        <h1 className="mt-3 text-2xl font-extrabold">Esta leitura não existe</h1>
        <Link
          className="mt-5 inline-block rounded-lg border border-radar-border bg-radar-surface px-4 py-2 text-xs font-bold text-radar-positive"
          href="/dashboard"
        >
          Voltar ao dashboard
        </Link>
      </div>
    </main>
  );
}
