import type { Metadata } from "next";

import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "@/constants";
import { requireAuth } from "@/lib/auth/authorization";
import { isDevelopmentAuthBypassEnabled } from "@/lib/auth/development";
import { ProgramasPageContent } from "@/modules/programas/components/programas-page-content";
import { programaService } from "@/modules/programas/services";
import type { ProgramasResponse } from "@/modules/programas/types";

export const metadata: Metadata = {
  title: "Programas",
};

async function getInitialData(): Promise<ProgramasResponse> {
  try {
    return await programaService.findAll();
  } catch (error) {
    if (!isDevelopmentAuthBypassEnabled()) {
      throw error;
    }

    return {
      data: [],
      pagination: {
        page: DEFAULT_PAGE,
        pageSize: DEFAULT_PAGE_SIZE,
        totalItems: 0,
        totalPages: 0,
      },
    };
  }
}

export default async function ProgramasPage() {
  await requireAuth();
  const initialData = await getInitialData();

  return <ProgramasPageContent initialData={initialData} />;
}
