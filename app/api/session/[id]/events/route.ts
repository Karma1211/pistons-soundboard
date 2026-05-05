import { addListener, removeListener } from '@/lib/sessionStore';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sessionId = id.toUpperCase().slice(0, 8);
  const encoder = new TextEncoder();

  let ctrl: ReadableStreamDefaultController<Uint8Array>;
  let keepAlive: ReturnType<typeof setInterval>;

  const stream = new ReadableStream<Uint8Array>({
    start(c) {
      ctrl = c;
      addListener(sessionId, ctrl);
      ctrl.enqueue(encoder.encode(': connected\n\n'));

      keepAlive = setInterval(() => {
        try { ctrl.enqueue(encoder.encode(': ping\n\n')); }
        catch { clearInterval(keepAlive); }
      }, 25000);
    },
    cancel() {
      clearInterval(keepAlive);
      removeListener(sessionId, ctrl);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
