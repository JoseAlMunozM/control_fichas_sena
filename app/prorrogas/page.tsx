import type { Metadata } from "next";

import { requireAuth } from "@/lib/auth/authorization";
import { fichaService } from "@/modules/fichas/services";
import { ProrrogasPageContent } from "@/modules/prorrogas/components";
import { prorrogaService } from "@/modules/prorrogas/services";

export const metadata: Metadata = {
  title: "Prórrogas",
};

export default async function ProrrogasPage() {
  await requireAuth();
  const [initialData, fichasResponse] = await Promise.all([
    prorrogaService.findAll(),
    fichaService.findAll({ pageSize: 50 }),
  ]);

  return (
    <ProrrogasPageContent
      initialData={initialData}
      initialFichas={fichasResponse.data}
    />
  );
}
