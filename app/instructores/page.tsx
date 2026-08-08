import type { Metadata } from "next";

import { requireAuth } from "@/lib/auth/authorization";
import { InstructoresPageContent } from "@/modules/instructores/components";
import { instructorService } from "@/modules/instructores/services";

export const metadata: Metadata = {
  title: "Instructores",
};

export default async function InstructoresPage() {
  await requireAuth();
  const initialData = await instructorService.findAll();

  return <InstructoresPageContent initialData={initialData} />;
}
