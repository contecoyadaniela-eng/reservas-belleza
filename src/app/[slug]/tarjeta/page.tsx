import { cargarPaginaNegocio } from "@/lib/pagina/cargar";
import { Seccion, TituloSeccion } from "@/components/pagina/base";

// Example card: the real stamps arrive in Stage 7 via each client's personal link.
const SELLOS_DE_EJEMPLO = 3;

export default async function TarjetaPage({ params }: PageProps<"/[slug]/tarjeta">) {
  const { slug } = await params;
  const negocio = (await cargarPaginaNegocio(slug))!;
  const { tarjeta } = negocio;
  const premioEn = new Map(tarjeta.premios.map((p) => [p.sello, p]));

  return (
    <Seccion>
      <div className="mx-auto flex max-w-md flex-col items-center gap-6 text-center">
        <TituloSeccion>Tu tarjeta de fidelidad</TituloSeccion>
        <p className="text-sm opacity-70">
          Suma un sello en cada visita y gana premios. Así se ve tu tarjeta:
        </p>

        <div
          className="w-full rounded-3xl p-6 text-left text-white shadow-xl"
          style={{ backgroundColor: tarjeta.colorTarjeta }}
        >
          <div className="flex items-center justify-between">
            <p className="p-logo text-2xl">{negocio.nombre}</p>
            <p className="text-[11px] uppercase tracking-[0.18em] opacity-70">
              {SELLOS_DE_EJEMPLO}/{tarjeta.sellosTotal}
            </p>
          </div>
          <div className="mt-6 grid grid-cols-4 gap-3">
            {Array.from({ length: tarjeta.sellosTotal }, (_, i) => {
              const numero = i + 1;
              const lleno = numero <= SELLOS_DE_EJEMPLO;
              const premio = premioEn.get(numero);
              return (
                <div
                  key={numero}
                  className={`flex aspect-square items-center justify-center border-2 text-2xl ${
                    tarjeta.forma === "circulo" ? "rounded-full" : "rounded-xl"
                  }`}
                  style={{
                    borderColor: tarjeta.colorSellos,
                    backgroundColor: lleno ? tarjeta.colorSellos : "transparent",
                  }}
                >
                  {lleno ? tarjeta.emoji : premio ? premio.emoji : <span className="text-xs opacity-50">{numero}</span>}
                </div>
              );
            })}
          </div>
        </div>

        <ul className="w-full space-y-2 text-left text-sm">
          {tarjeta.premios.map((p) => (
            <li key={p.sello} className="flex items-center gap-3 border-b border-black/10 py-2">
              <span className="text-xl">{p.emoji}</span>
              <span>
                Sello {p.sello}: <strong className="font-medium">{p.texto}</strong>
              </span>
            </li>
          ))}
        </ul>
        <p className="text-xs opacity-60">
          Recibirás tu enlace personal para ver tus sellos al reservar tu primera cita.
        </p>
      </div>
    </Seccion>
  );
}
