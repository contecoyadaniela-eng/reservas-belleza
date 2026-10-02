// Aplica en Supabase las recetas nuevas de supabase/migrations.
// Uso: npm run db:aplicar
import { spawnSync } from "node:child_process";

if (!process.env.DATABASE_URL) {
  console.error("Falta DATABASE_URL en .env.local");
  process.exit(1);
}

const { status } = spawnSync(
  "npx",
  ["supabase", "db", "push", "--db-url", process.env.DATABASE_URL, "--yes"],
  { stdio: "inherit", shell: true },
);
process.exit(status ?? 1);
