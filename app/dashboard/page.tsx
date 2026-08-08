import type { Metadata } from "next";

import { requireAuth } from "@/lib/auth/authorization";
import { DashboardGeneralContent } from "@/modules/dashboard/components";
import { dashboardService } from "@/modules/dashboard/services";

export const metadata: Metadata = {
  title: "Control general",
};

export default async function DashboardPage() {
  await requireAuth();
  const data = await dashboardService.getGeneralControl();

  return <DashboardGeneralContent data={data} />;
}
