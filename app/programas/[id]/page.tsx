import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireAuth } from "@/lib/auth/authorization";
import { ProgramaPlanesPageContent } from "@/modules/programas/components/programa-planes-page-content";
import { programaService } from "@/modules/programas/services";

export const metadata: Metadata = {
  title: "Plan de formación",
};

export default async function ProgramaPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();
  const { id } = await params;
  const programa = await programaService.findById(id);

  if (!programa) notFound();

  return <ProgramaPlanesPageContent initialData={programa.data} />;
}
