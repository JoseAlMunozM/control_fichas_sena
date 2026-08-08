import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireAuth } from "@/lib/auth/authorization";
import { FichaDetail } from "@/modules/fichas/components/ficha-detail";
import { fichaService } from "@/modules/fichas/services";
import { instructorService } from "@/modules/instructores/services";

export const metadata: Metadata = {
  title: "Detalle de ficha",
};

export default async function FichaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();
  const { id } = await params;
  const [ficha, instructores] = await Promise.all([
    fichaService.findById(id),
    instructorService.findAll({ estado: true, pageSize: 100 }),
  ]);

  if (!ficha) notFound();

  return (
    <FichaDetail ficha={ficha.data} instructores={instructores.data} />
  );
}
