import { cargarPaginaNegocio } from "@/lib/pagina/cargar";
import { Seccion, TituloSeccion } from "@/components/pagina/base";

export default async function ContactoPage({ params }: PageProps<"/[slug]/contacto">) {
  const { slug } = await params;
  const negocio = (await cargarPaginaNegocio(slug))!;
  const { contacto } = negocio;
  const whatsappLink = `https://wa.me/${contacto.whatsapp.replace(/\D/g, "")}`;

  const filas = [
    { etiqueta: "Dirección", valor: contacto.direccion },
    { etiqueta: "Horario", valor: contacto.horarioTexto },
    { etiqueta: "WhatsApp", valor: contacto.whatsapp, href: whatsappLink },
    { etiqueta: "Correo", valor: contacto.correo, href: `mailto:${contacto.correo}` },
    { etiqueta: "Instagram", valor: contacto.instagram, href: `https://instagram.com/${contacto.instagram.replace("@", "")}` },
  ];

  return (
    <Seccion>
      <div className="mx-auto max-w-xl">
        <TituloSeccion className="text-center">Contacto</TituloSeccion>
        <dl className="mt-10 divide-y divide-black/10 border-y border-black/10">
          {filas.map((f) => (
            <div key={f.etiqueta} className="grid gap-1 py-5 sm:grid-cols-3">
              <dt className="text-[11px] uppercase tracking-[0.18em] opacity-60">{f.etiqueta}</dt>
              <dd className="text-sm sm:col-span-2">
                {f.href ? (
                  <a href={f.href} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">
                    {f.valor}
                  </a>
                ) : (
                  f.valor
                )}
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-10 text-center">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-(--c-boton) px-8 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-(--c-boton-texto) hover:opacity-85"
          >
            Escríbenos por WhatsApp
          </a>
        </div>
      </div>
    </Seccion>
  );
}
