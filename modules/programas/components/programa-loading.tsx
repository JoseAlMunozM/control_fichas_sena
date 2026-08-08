import { Loading } from "@/components/ui";

export interface ProgramaLoadingProps {
  label?: string;
}

export function ProgramaLoading({
  label = "Cargando programas",
}: ProgramaLoadingProps) {
  return <Loading className="min-h-48" label={label} size="lg" />;
}
