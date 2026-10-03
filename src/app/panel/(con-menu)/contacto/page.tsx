import { requerirMiNegocio } from "@/lib/panel";
import { FormContacto } from "./form-contacto";

export default async function ContactoPanelPage() {
  const { negocio } = await requerirMiNegocio();
  return <FormContacto slug={negocio.slug} contacto={negocio.contacto} />;
}
