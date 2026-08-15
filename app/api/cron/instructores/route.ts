import { instructorService } from "@/modules/instructores/services";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  if (!cronSecret || authorization !== `Bearer ${cronSecret}`) {
    return Response.json({ success: false }, { status: 401 });
  }

  const updatedInstructors =
    await instructorService.synchronizeContractStatuses();

  return Response.json({
    success: true,
    updatedInstructors,
  });
}
