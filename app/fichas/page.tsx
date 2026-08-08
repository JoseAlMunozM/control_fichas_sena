import type { Metadata } from "next";

import { requireAuth } from "@/lib/auth/authorization";
import { FichasPageContent } from "@/modules/fichas/components/fichas-page-content";
import { fichaService } from "@/modules/fichas/services";
import { programaService } from "@/modules/programas/services";

export const metadata: Metadata = {
  title: "Fichas",
};

export default async function FichasPage() {
  await requireAuth();
  const [initialData, programasResponse] = await Promise.all([
    fichaService.findAll(),
    programaService.findAll({ estado: true, pageSize: 50 }),
  ]);

  return (
    <FichasPageContent
      initialData={initialData}
      programas={programasResponse.data}
    />
  );
}
