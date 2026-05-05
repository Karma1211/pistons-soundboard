import { storeEvent } from '@/lib/sessionStore';

export const dynamic = 'force-dynamic';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sessionId = id.toUpperCase().slice(0, 8);
  const body = await req.json();
  storeEvent(sessionId, JSON.stringify(body));
  return Response.json({ ok: true });
}
