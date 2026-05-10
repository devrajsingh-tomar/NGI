
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EditorElement } from "./useEditorState";
import { AlignLeft, AlignCenter, AlignRight, AlignJustify, Bold, Italic, Lock, Unlock, Trash2 } from "lucide-react";

interface PropertiesPanelProps {
    element: EditorElement | null;
    onUpdate: (id: string, updates: Partial<EditorElement>) => void;
    deleteElement: () => void;
    backgroundImage: string;
    setBackgroundImage: (url: string) => void;
}

export default function PropertiesPanel({ element, onUpdate, deleteElement, backgroundImage, setBackgroundImage }: PropertiesPanelProps) {

    if (!element) {
        return (
            <aside className="w-72 bg-white border-l p-4 overflow-y-auto">
                <h3 className="font-bold text-xs uppercase text-slate-500 mb-4">Background</h3>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Image URL</Label>
                        <Input
                            value={backgroundImage}
                            onChange={(e) => setBackgroundImage(e.target.value)}
                            placeholder="https://..."
                        />
                        <p className="text-xs text-slate-400">Enter a public URL for the certificate background.</p>
                    </div>
                </div>
            </aside>
        );
    }

    const { style } = element;

    return (
        <aside className="w-72 bg-white border-l flex flex-col h-full overflow-hidden">

            <div className="p-4 border-b flex items-center justify-between shrink-0">
                <h3 className="font-bold text-sm truncate w-32">{element.type.toUpperCase()}</h3>
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onUpdate(element.id, { locked: !element.locked })}>
                        {element.locked ? <Lock className="w-4 h-4 text-red-500" /> : <Unlock className="w-4 h-4 text-slate-400" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={deleteElement}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">

                {/* Content */}
                <div className="space-y-2">
                    <Label>{element.type === 'text' ? 'Text Content' : 'Image URL'}</Label>
                    {element.type === 'text' ? (
                        <textarea
                            className="w-full min-h-[80px] p-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            value={element.content}
                            onChange={(e) => onUpdate(element.id, { content: e.target.value })}
                        />
                    ) : (
                        <Input
                            value={element.content}
                            onChange={(e) => onUpdate(element.id, { content: e.target.value })}
                        />
                    )}
                </div>

                {/* Text Styles */}
                {element.type === 'text' && style && (
                    <div className="space-y-4 border-t pt-4">
                        <Label className="text-xs font-bold text-slate-500 uppercase">Typography</Label>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <Label className="text-xs">Font Family</Label>
                                <Select value={style.fontFamily || 'Helvetica'} onValueChange={(v) => onUpdate(element.id, { style: { ...style, fontFamily: v } })}>
                                    <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                                    <SelectContent className="max-h-64">
                                        {/* Standard Fallbacks */}
                                        <SelectItem value="Helvetica">Helvetica (Standard)</SelectItem>
                                        <SelectItem value="Times-Roman">Times New Roman</SelectItem>
                                        <SelectItem value="Courier">Courier Space</SelectItem>
                                        {/* Popular Sans-Serif */}
                                        <SelectItem value="Inter">Inter</SelectItem>
                                        <SelectItem value="Roboto">Roboto</SelectItem>
                                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                                        <SelectItem value="Lato">Lato</SelectItem>
                                        <SelectItem value="Montserrat">Montserrat</SelectItem>
                                        <SelectItem value="Poppins">Poppins</SelectItem>
                                        <SelectItem value="Nunito">Nunito</SelectItem>
                                        <SelectItem value="Raleway">Raleway</SelectItem>
                                        <SelectItem value="Oswald">Oswald</SelectItem>
                                        {/* Elegant Serif & Display */}
                                        <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                                        <SelectItem value="Merriweather">Merriweather</SelectItem>
                                        <SelectItem value="Lora">Lora</SelectItem>
                                        <SelectItem value="PT Serif">PT Serif</SelectItem>
                                        <SelectItem value="Libre Baskerville">Libre Baskerville</SelectItem>
                                        {/* Handwritten & Special */}
                                        <SelectItem value="Dancing Script">Dancing Script</SelectItem>
                                        <SelectItem value="Pacifico">Pacifico</SelectItem>
                                        <SelectItem value="Caveat">Caveat</SelectItem>
                                        <SelectItem value="Satisfy">Satisfy</SelectItem>
                                        <SelectItem value="Cinzel">Cinzel</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Font Size</Label>
                                <Input
                                    type="number" className="h-8"
                                    value={style.fontSize}
                                    onChange={(e) => onUpdate(element.id, { style: { ...style, fontSize: Number(e.target.value) } })}
                                />
                            </div>
                        </div>

                        <div className="flex bg-slate-100 p-1 rounded-md">
                            <Button
                                variant={style.textAlign === 'left' ? "default" : "ghost"}
                                size="sm" className={`flex-1 h-7 ${style.textAlign === 'left' ? 'bg-white text-black shadow-sm' : ''}`}
                                onClick={() => onUpdate(element.id, { style: { ...style, textAlign: 'left' } })}
                            >
                                <AlignLeft className="w-3 h-3" />
                            </Button>
                            <Button
                                variant={style.textAlign === 'center' ? "default" : "ghost"}
                                size="sm" className={`flex-1 h-7 ${style.textAlign === 'center' ? 'bg-white text-black shadow-sm' : ''}`}
                                onClick={() => onUpdate(element.id, { style: { ...style, textAlign: 'center' } })}
                            >
                                <AlignCenter className="w-3 h-3" />
                            </Button>
                            <Button
                                variant={style.textAlign === 'right' ? "default" : "ghost"}
                                size="sm" className={`flex-1 h-7 ${style.textAlign === 'right' ? 'bg-white text-black shadow-sm' : ''}`}
                                onClick={() => onUpdate(element.id, { style: { ...style, textAlign: 'right' } })}
                            >
                                <AlignRight className="w-3 h-3" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <Label className="text-xs">Color</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="color" className="w-8 h-8 p-0 border-none rounded-full overflow-hidden shrink-0 cursor-pointer"
                                        value={style.color}
                                        onChange={(e) => onUpdate(element.id, { style: { ...style, color: e.target.value } })}
                                    />
                                    <Input
                                        className="h-8 text-xs font-mono"
                                        value={style.color}
                                        onChange={(e) => onUpdate(element.id, { style: { ...style, color: e.target.value } })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Weight</Label>
                                <Select value={style.fontWeight} onValueChange={(v) => onUpdate(element.id, { style: { ...style, fontWeight: v } })}>
                                    <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="normal">Normal</SelectItem>
                                        <SelectItem value="bold">Bold</SelectItem>
                                        <SelectItem value="300">Light</SelectItem>
                                        <SelectItem value="600">SemiBold</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Common Layout */}
                <div className="space-y-4 border-t pt-4">
                    <Label className="text-xs font-bold text-slate-500 uppercase">Layout & Appearance</Label>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <Label className="text-xs">X Position</Label>
                            <Input
                                type="number" className="h-8"
                                value={Math.round(element.x)}
                                onChange={(e) => onUpdate(element.id, { x: Number(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Y Position</Label>
                            <Input
                                type="number" className="h-8"
                                value={Math.round(element.y)}
                                onChange={(e) => onUpdate(element.id, { y: Number(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Width</Label>
                            <Input
                                type="number" className="h-8"
                                value={Math.round(element.width || 0)}
                                onChange={(e) => onUpdate(element.id, { width: Number(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Height</Label>
                            <Input
                                type="number" className="h-8"
                                value={Math.round(element.height || 0)}
                                onChange={(e) => onUpdate(element.id, { height: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label className="text-xs">Opacity</Label>
                            <span className="text-xs text-slate-400">{Math.round((element.opacity || 1) * 100)}%</span>
                        </div>
                        <Slider
                            value={[element.opacity || 1]}
                            min={0} max={1} step={0.1}
                            onValueChange={([val]) => onUpdate(element.id, { opacity: val })}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label className="text-xs">Rotation</Label>
                            <span className="text-xs text-slate-400">{element.rotation || 0}°</span>
                        </div>
                        <Slider
                            value={[element.rotation || 0]}
                            min={0} max={360} step={1}
                            onValueChange={([val]) => onUpdate(element.id, { rotation: val })}
                        />
                    </div>
                </div>

            </div>
        </aside>
    );
}
