import { NextResponse } from 'next/server';
import { getGoogleFontDataUrl } from '@/lib/fonts';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const family = searchParams.get('family');

    if (!family) {
        return NextResponse.json({ error: 'Family required' }, { status: 400 });
    }

    try {
        const dataUrl = await getGoogleFontDataUrl(family);
        
        return new Response(dataUrl, {
            headers: {
                'Content-Type': 'text/plain',
                'Cache-Control': 'public, max-age=31536000, immutable',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (e: any) {
        console.error(`Font Proxy Error (${family}):`, e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
