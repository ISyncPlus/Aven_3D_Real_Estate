import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { lagosToday, validateEnquiry } from '@/lib/enquiries';
import { getResidence } from '@/lib/residences';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  try {
    if (Number(request.headers.get('content-length') || 0) > 4096) return Response.json({ error: 'Please shorten your request.' }, { status: 413 });
    const origin = request.headers.get('origin');
    const requestUrl = new URL(request.url);
    // Next can normalize the internal URL to localhost; retain exact scheme, host and port validation.
    const expectedOrigin = requestUrl.protocol + '//' + (request.headers.get('host') || requestUrl.host);
    if (origin && origin !== expectedOrigin) return Response.json({ error: 'Please send your request through the Aven website.' }, { status: 403 });
    const text = await request.text();
    if (Buffer.byteLength(text) > 4096) return Response.json({ error: 'Please shorten your request.' }, { status: 413 });
    let input: unknown;
    try { input = JSON.parse(text); } catch { return Response.json({ error: 'Please check your viewing details.' }, { status: 400 }); }
    const enquiry = validateEnquiry(input, lagosToday());
    if (typeof enquiry === 'string') return Response.json({ error: enquiry }, { status: 400 });
    if (enquiry.residence && !getResidence(enquiry.residence)?.available) return Response.json({ error: 'This residence has been reserved. Please choose another home.' }, { status: 409 });
    const reference = `AVN-${randomUUID().slice(0, 8).toUpperCase()}`;
    const directory = join(process.cwd(), 'data', 'enquiries');
    await mkdir(directory, { recursive: true, mode: 0o700 });
    // shortcut: local private enquiry storage, use a managed database and email provider for multi-server hosting.
    await writeFile(join(directory, reference + '.json'), JSON.stringify({ reference, receivedAt: new Date().toISOString(), ...enquiry }, null, 2), { mode: 0o600, flag: 'wx' });
    return Response.json({ reference }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ error: 'We couldn’t receive your request. Please try again in a moment.' }, { status: 503 });
  }
}
