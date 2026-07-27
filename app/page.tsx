import { Card } from "@/components/ui";

export default function Home() {
  return (
    <Card
      description="La navegación y los componentes estructurales están preparados para integrar los módulos de forma independiente."
      title="Arquitectura base"
    >
      <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
        El layout general está listo. No se ha agregado lógica de negocio.
      </p>
    </Card>
  );
}
