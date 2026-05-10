
import React, { useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { EditorElement, PageConfig } from "./useEditorState";

interface EditorCanvasProps {
    elements: EditorElement[];
    pageConfig: PageConfig;
    zoom: number;
    selectedIds: string[];
    onSelect: (id: string, multi: boolean) => void;
    onUpdate: (id: string, updates: Partial<EditorElement>) => void;
    onCommit: () => void; // Called on drag/resize stop
    backgroundImage: string;
    showGrid: boolean;
    showMargins: boolean;
    onSelectMultiple?: (ids: string[]) => void; // Added for lasso
}

export default function EditorCanvas({
    elements,
    pageConfig,
    zoom,
    selectedIds,
    onSelect,
    onUpdate,
    onCommit,
    backgroundImage,
    showGrid,
    showMargins,
    onSelectMultiple
}: EditorCanvasProps) {
    const canvasRef = useRef<HTMLDivElement>(null);
    
    // UI states
    const [isDraggingObj, setIsDraggingObj] = useState(false);
    
    // Marquee states
    const [selectionStart, setSelectionStart] = useState<{ x: number, y: number } | null>(null);
    const [currentMouse, setCurrentMouse] = useState<{ x: number, y: number } | null>(null);

    // Click outside to deselect
    const handleCanvasMouseDown = (e: React.MouseEvent) => {
        if (e.target === canvasRef.current || (e.target as HTMLElement).id === "canvas-wrapper") {
            if (e.button === 0) {
                // Left click empty canvas = deselect all
                onSelect("", false);
            } else if (e.button === 2) {
                // Right click empty canvas = start lasso
                e.preventDefault();
                const rect = canvasRef.current?.getBoundingClientRect();
                if (!rect) return;
                const x = (e.clientX - rect.left) / zoom;
                const y = (e.clientY - rect.top) / zoom;
                setSelectionStart({ x, y });
                setCurrentMouse({ x, y });
            }
        }
    };

    const handleCanvasMouseMove = (e: React.MouseEvent) => {
        if (selectionStart) {
            const rect = canvasRef.current?.getBoundingClientRect();
            if (!rect) return;
            const x = (e.clientX - rect.left) / zoom;
            const y = (e.clientY - rect.top) / zoom;
            setCurrentMouse({ x, y });
        }
    };

    const handleCanvasMouseUp = (e: React.MouseEvent) => {
        if (selectionStart && currentMouse) {
            // End Lasso
            const minX = Math.min(selectionStart.x, currentMouse.x);
            const maxX = Math.max(selectionStart.x, currentMouse.x);
            const minY = Math.min(selectionStart.y, currentMouse.y);
            const maxY = Math.max(selectionStart.y, currentMouse.y);

            // Find all elements within marquee box
            const selected = elements.filter(el => {
                const elW = el.width || 100;
                const elH = el.height || 40;
                const elCenterX = el.x + (elW / 2);
                const elCenterY = el.y + (elH / 2);
                return (elCenterX >= minX && elCenterX <= maxX && elCenterY >= minY && elCenterY <= maxY);
            }).map(el => el.id);

            if (onSelectMultiple && selected.length > 0) {
                onSelectMultiple(selected);
            }
        }
        setSelectionStart(null);
        setCurrentMouse(null);
    };

    return (
        <div
            id="canvas-wrapper"
            className="flex-1 bg-slate-200 overflow-auto flex items-center justify-center p-10 relative select-none"
            onContextMenu={(e) => e.preventDefault()}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={() => { setSelectionStart(null); setCurrentMouse(null); }}
        >
            <div
                ref={canvasRef}
                className="bg-white shadow-2xl relative transition-transform origin-center"
                style={{
                    width: pageConfig.width,
                    height: pageConfig.height,
                    transform: `scale(${zoom})`,
                    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Grid Overlay */}
                {showGrid && (
                    <div
                        className="absolute inset-0 pointer-events-none opacity-10"
                        style={{
                            backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                            backgroundSize: '40px 40px'
                        }}
                    />
                )}

                {/* Print Margins (Safety Area) - e.g. 5mm approx 14px */}
                {showMargins && (
                    <div className="absolute inset-4 border border-dashed border-red-300 pointer-events-none opacity-50 z-50">
                        <span className="absolute top-0 left-0 text-[8px] text-red-400 px-1 bg-white">Safe Area</span>
                    </div>
                )}

                {/* Center Alignment Lines (Visible when dragging or selecting) */}
                {(isDraggingObj || selectedIds.length > 0) && (
                    <div className="absolute inset-0 pointer-events-none z-40 opacity-40 mix-blend-multiply">
                        <div className="absolute left-[50%] top-0 bottom-0 w-px border-l-2 border-dashed border-red-400 opacity-70 shadow-sm shadow-red-500/50" />
                        <div className="absolute top-[50%] left-0 right-0 h-px border-t-2 border-dashed border-red-400 opacity-70 shadow-sm shadow-red-500/50" />
                    </div>
                )}

                {/* Marquee Selection Box */}
                {selectionStart && currentMouse && (
                    <div 
                        className="absolute border-2 border-primary/60 bg-primary/20 z-50 pointer-events-none"
                        style={{
                            left: Math.min(selectionStart.x, currentMouse.x),
                            top: Math.min(selectionStart.y, currentMouse.y),
                            width: Math.abs(currentMouse.x - selectionStart.x),
                            height: Math.abs(currentMouse.y - selectionStart.y)
                        }}
                    />
                )}

                {elements.map((el, index) => {
                    if (el.hidden) return null;
                    const isSelected = selectedIds.includes(el.id);

                    return (
                        <Rnd
                            key={el.id}
                            size={{ width: el.width || 'auto', height: el.height || 'auto' }}
                            position={{ x: el.x, y: el.y }}
                            onDragStart={() => setIsDraggingObj(true)}
                            onDrag={(e, d) => {
                                // Real-time update for smoothness
                                onUpdate(el.id, { x: d.x, y: d.y });
                            }}
                            onDragStop={(e, d) => {
                                setIsDraggingObj(false);
                                onUpdate(el.id, { x: d.x, y: d.y });
                                onCommit();
                            }}
                            onResizeStop={(e, dir, ref, delta, pos) => {
                                onUpdate(el.id, {
                                    width: parseInt(ref.style.width),
                                    height: parseInt(ref.style.height),
                                    ...pos
                                });
                                onCommit();
                            }}
                            disableDragging={el.locked}
                            enableResizing={!el.locked}
                            bounds="parent"
                            className={`
                                group
                                ${isSelected ? 'outline outline-2 outline-primary z-50' : 'hover:outline hover:outline-1 hover:outline-slate-300'}
                            `}
                            style={{ 
                                zIndex: isSelected ? 50 : index + 1
                            }}
                            onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                onSelect(el.id, e.shiftKey);
                            }}
                        >
                            <div
                                className="w-full h-full flex overflow-hidden items-center"
                                style={{
                                    transform: `rotate(${el.rotation || 0}deg)`,
                                    opacity: el.opacity,
                                    // Style props
                                    fontFamily: el.style?.fontFamily,
                                    fontSize: el.style?.fontSize ? `${el.style.fontSize}px` : undefined,
                                    fontWeight: el.style?.fontWeight as any,
                                    color: el.style?.color,
                                    textAlign: el.style?.textAlign as any,
                                    letterSpacing: el.style?.letterSpacing ? `${el.style.letterSpacing}px` : undefined,
                                    lineHeight: el.style?.lineHeight,
                                    justifyContent: el.style?.textAlign === 'center' ? 'center' : (el.style?.textAlign === 'right' ? 'flex-end' : 'flex-start'),
                                    borderRadius: el.style?.borderRadius ? `${el.style.borderRadius}px` : undefined,
                                    boxShadow: el.style?.boxShadow,
                                }}
                            >
                                {el.type === 'text' && (
                                    <div className="w-full h-full whitespace-pre-wrap select-none">{el.content}</div>
                                )}
                                {el.type === 'image' && (
                                    <img
                                        src={el.content?.startsWith('{{') ? 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.com%2Fen%2Ffree-png-zppre&psig=AOvVaw0_9_f0_9_f0_9_f0_9&ust=1711036800000000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCJjJ_vj_9YQDFQAAAAAdAAAAABAE' : el.content}
                                        alt="element"
                                        className="w-full h-full pointer-events-none"
                                        style={{ objectFit: el.style?.objectFit || 'contain' }}
                                    />
                                )}
                                {el.type === 'qrcode' && (
                                    <div className="w-full h-full bg-black/5 flex items-center justify-center border-2 border-dashed border-slate-300">
                                        <span className="text-[10px] text-slate-400">QR Code</span>
                                    </div>
                                )}
                            </div>

                            {/* Rotate Handle (Custom) */}
                            {isSelected && !el.locked && (
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border border-slate-300 rounded-full cursor-grab flex items-center justify-center shadow-sm">
                                    <div className="w-1 h-1 bg-slate-400 rounded-full" />
                                </div>
                            )}
                        </Rnd>
                    );
                })}
            </div>
        </div>
    );
}
