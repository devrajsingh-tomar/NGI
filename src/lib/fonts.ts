import { NextResponse } from "next/server";

/**
 * Fetches a Google Font and returns it as a compatible Data URL string for React-PDF.
 * This ensures the engine perceives it as a string, preventing the "dataUrl.split is not a function" crash
 * that occurs when passing raw Node.js Buffers during Server-Side Rendering.
 */
export async function getGoogleFontDataUrl(family: string): Promise<string> {
    // Sanitize family name to prevent SSRF or injection
    const sanitizedFamily = family.replace(/[^a-zA-Z0-9 ]/g, '');
    const url = `https://fonts.googleapis.com/css?family=${sanitizedFamily.replace(/ /g, '+')}:400&subset=latin`;
    
    const cssResponse = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299'
        }
    });

    if (!cssResponse.ok) {
        throw new Error(`Google Fonts CSS fetch failed for ${family}`);
    }

    const css = await cssResponse.text();
    const ttfMatch = css.match(/url\((https:\/\/[^)]+?\.ttf(?!\.woff2)[^)]*?)\)/i);

    if (ttfMatch && ttfMatch[1]) {
        const gstaticUrl = ttfMatch[1].replace(/['"]/g, '');
        console.log(`DEBUG: Extracted Font URL for ${family}: ${gstaticUrl}`);
        
        const fontResponse = await fetch(gstaticUrl);
        if (!fontResponse.ok) {
            throw new Error(`Failed to fetch font bits from ${gstaticUrl}`);
        }

        const arrayBuffer = await fontResponse.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        
        return `data:font/ttf;base64,${base64}`;
    }

    // Fallback: search for any URL and try it
    const anyMatch = css.match(/url\(([^)]+)\)/i);
    if (anyMatch && anyMatch[1]) {
         const fallbackUrl = anyMatch[1].replace(/['"]/g, '');
         const res = await fetch(fallbackUrl);
         const base64 = Buffer.from(await res.arrayBuffer()).toString('base64');
         return `data:font/ttf;base64,${base64}`;
    }

    throw new Error(`TTF source not found for font family: ${family}`);
}

