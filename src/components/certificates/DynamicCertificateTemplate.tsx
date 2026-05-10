
/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

interface Element {
    id: string;
    type: string;
    content: string;
    x: number;
    y: number;
    width?: number;
    height?: number;
    rotation?: number;
    opacity?: number;
    style?: {
        fontSize?: number;
        color?: string;
        fontWeight?: string;
        textAlign?: any;
        fontFamily?: string;
        letterSpacing?: number;
        lineHeight?: number;
        borderRadius?: number;
        objectFit?: any;
    };
    // Backward compatibility
    fontSize?: number;
    color?: string;
    fontWeight?: string;
    textAlign?: any;
    fontFamily?: string;
}

interface DynamicCertificateProps {
    backgroundImage?: string;
    elements: Element[];
    placeholders: { [key: string]: string };
    config?: {
        format: string;
        orientation: "portrait" | "landscape";
        dpi: number;
    };
    origin?: string;
}

const styles = StyleSheet.create({
    page: {
        position: 'relative',
        backgroundColor: '#FFFFFF',
        padding: 0,
        margin: 0,
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'fill',
    },
});

export const DynamicCertificateTemplate = ({ elements, placeholders, backgroundImage, config, origin }: DynamicCertificateProps) => {
    
    // DISABLED GOOGLE FONTS PER USER REQUEST TO ENSURE STABILITY
    /*
    if (typeof window !== "undefined") {
        const standardFonts = ['Courier', 'Helvetica', 'Times-Roman'];
        const uniqueFonts = [...new Set(elements.map(el => el.style?.fontFamily || el.fontFamily || 'Helvetica'))];
        
        uniqueFonts.forEach(font => {
            const rawFont = font as string;
            if (!standardFonts.includes(rawFont) && !rawFont.toLowerCase().includes('times') && !rawFont.toLowerCase().includes('courier')) {
                // Determine backend vs frontend origin safely
                const originBase = origin || window.location.origin;
                    
                try {
                    Font.register({
                        family: rawFont,
                        src: `${originBase}/api/fonts?family=${encodeURIComponent(rawFont)}`
                    });
                } catch (e) {
                    // Silently fail if already registered
                }
            }
        });
    }
    */

    // Replace placeholders in text
    const processContent = (content: string) => {
        let text = content;
        // Replace known placeholders
        Object.keys(placeholders).forEach((key) => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            text = text.replace(regex, placeholders[key] || '');
        });
        
        // Remove any remaining unresolved placeholders (e.g. {{student_photo}} if not provided)
        // This prevents the PDF/Browser from trying to fetch "{{key}}" as a URL
        text = text.replace(/{{[^{}]*}}/g, '');
        
        return text;
    };

    // Default to A4 Landscape if config missing
    const pageSize = (config?.format || 'A4') as any;
    const pageOrientation = (config?.orientation || 'landscape') as any;

    return (
        <Document>
            <Page size={pageSize} orientation={pageOrientation} style={styles.page}>
                {(() => {
                    if (typeof backgroundImage !== 'string' || backgroundImage.trim() === '' || backgroundImage === 'undefined' || backgroundImage === 'null') return null;
                    
                    // Resolve absolute URL for background if it is relative
                    let bgSrc = backgroundImage;
                    if (bgSrc.startsWith('/') && origin) {
                        bgSrc = `${origin}${bgSrc}`;
                    }

                    return (
                        <Image 
                            src={bgSrc} 
                            style={styles.background} 
                            fixed={true}
                        />
                    );
                })()}

                {elements.map((el) => {
                    const style = el.style || {};
                    const rotation = el.rotation ? `rotate(${el.rotation}deg)` : undefined;

                    // Robust parsing string 'undefined' or actual undefined
                    const safeNum = (val: any, fallback?: number) => {
                        if (val === 'undefined' || val === null || val === undefined || val === '') return fallback;
                        const num = Number(val);
                        return isNaN(num) ? fallback : num;
                    };

                    const fontSize = safeNum(style.fontSize || el.fontSize, 12);
                    
                    // FORCE STANDARD FONT FALLBACK
                    const rawFont = style.fontFamily || el.fontFamily || 'Helvetica';
                    const standardFonts = ['Courier', 'Helvetica', 'Times-Roman'];
                    const fontFamily = standardFonts.some(f => rawFont.toLowerCase().includes(f.toLowerCase())) ? rawFont : 'Helvetica';
                    const textAlign = (style.textAlign || el.textAlign || 'left') as any;
                    const fontWeight = (style.fontWeight || el.fontWeight || 'normal') as any;
                    const color = (style.color && style.color !== 'undefined') ? style.color : '#000000';

                    // Strictly construct the base object natively
                    const commonStyles: any = {
                        position: 'absolute',
                        left: safeNum(el.x, 0),
                        top: safeNum(el.y, 0),
                    };

                    const w = safeNum(el.width);
                    if (w !== undefined) commonStyles.width = w;

                    const h = safeNum(el.height);
                    if (h !== undefined) commonStyles.height = h;

                    const o = safeNum(el.opacity);
                    if (o !== undefined) commonStyles.opacity = o;

                    if (rotation) commonStyles.transform = rotation;

                    if (el.type === 'text') {
                        const textStyle: any = { ...commonStyles, fontSize, color, fontWeight, fontFamily, textAlign };
                        
                        const ls = safeNum(style.letterSpacing);
                        if (ls !== undefined) textStyle.letterSpacing = ls;

                        const lh = safeNum(style.lineHeight);
                        if (lh !== undefined) textStyle.lineHeight = lh;

                        return (
                            <Text key={el.id} style={textStyle}>
                                {processContent(el.content || '')}
                            </Text>
                        );
                    } else if (el.type === 'image' || el.type === 'qrcode') {
                        const contentSrc = (el.content || '').trim();
                        let src = el.type === 'qrcode' ? placeholders['qr_code'] : (contentSrc.startsWith('{{') ? processContent(contentSrc) : contentSrc);

                        // If anything was passed that isn't a string or valid DataURL, we have to skip it
                        // to prevent "DataURL.split is not a function" crashes in React-PDF.
                        if (!src || typeof src !== 'string' || src === 'undefined' || src === 'null' || src.trim() === '') {
                            if (src && typeof src !== 'string') {
                                console.warn(`SKIP: Non-string image source for element ${el.id}:`, typeof src);
                            }
                            return null;
                        }

                        const imageStyle: any = { ...commonStyles };
                        if (style.objectFit && style.objectFit !== 'undefined') imageStyle.objectFit = style.objectFit;
                        
                        // CRITICAL FIX: React-PDF has a severe bug in `@react-pdf/stylesheet` where `borderRadius: 0`
                        // explicitly breaks the parser because `0 ? ... : undefined` evaluates to undefined.
                        // We must completely omit the property if it is 0.
                        let br = safeNum(style.borderRadius);
                        if (br !== undefined && br > 0) imageStyle.borderRadius = br;

                        return (
                            <Image
                                key={el.id}
                                src={src}
                                style={imageStyle}
                            />
                        );
                    }
                    return null;
                })}
            </Page>
        </Document>
    );
};
