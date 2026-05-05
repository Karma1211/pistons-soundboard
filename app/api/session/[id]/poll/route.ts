import { getEventsSince } from '@/lib/sessionStore';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sessionId = id.toUpperCase().slice(0, 8);
  const since = parseInt(new URL(req.url).searchParams.get('since') ?? '0', 10);
  const events = getEventsSince(sessionId, since);
  return Response.json(events);
}
