
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
    ZoomIn, ZoomOut, Maximize, Grid, Ruler,
    Printer, Undo, Redo, Save, Smartphone, Monitor
} from "lucide-react";
import { PageConfig } from "./useEditorState";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EditorToolbarProps {
    zoom: number;
    setZoom: (z: number) => void;
    showGrid: boolean;
    setShowGrid: (v: boolean) => void;
    showRulers: boolean;
    setShowRulers: (v: boolean) => void;
    showMargins: boolean;
    setShowMargins: (v: boolean) => void;
    history: { undo: () => void; redo: () => void; canUndo: boolean; canRedo: boolean };
    onSave: () => void;
    pageConfig: PageConfig;
    isSaving?: boolean;
}

export default function EditorToolbar({
    zoom, setZoom,
    showGrid, setShowGrid,
    showRulers, setShowRulers,
    showMargins, setShowMargins,
    history,
    onSave,
    isSaving
}: EditorToolbarProps) {
    return (
        <div className="h-14 bg-white border-b flex items-center justify-between px-4 shrink-0 shadow-sm z-20">
            {/* Left: History & View Controls */}
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost" size="icon"
                    onClick={history.undo} disabled={!history.canUndo}
                    title="Undo (Ctrl+Z)"
                >
                    <Undo className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost" size="icon"
                    onClick={history.redo} disabled={!history.canRedo}
                    title="Redo (Ctrl+Y)"
                >
                    <Redo className="w-4 h-4" />
                </Button>

                <div className="w-px h-6 bg-slate-200 mx-2" />

                <Button
                    variant={showGrid ? "secondary" : "ghost"} size="icon"
                    onClick={() => setShowGrid(!showGrid)}
                    title="Toggle Grid"
                >
                    <Grid className="w-4 h-4" />
                </Button>
                <Button
                    variant={showRulers ? "secondary" : "ghost"} size="icon"
                    onClick={() => setShowRulers(!showRulers)}
                    title="Toggle Rulers"
                >
                    <Ruler className="w-4 h-4" />
                </Button>
                <Button
                    variant={showMargins ? "secondary" : "ghost"} size="icon"
                    onClick={() => setShowMargins(!showMargins)}
                    title="Show Print Margins"
                >
                    <Printer className="w-4 h-4" />
                </Button>
            </div>

            {/* Center: Zoom Controls */}
            <div className="flex items-center gap-4 bg-slate-100 rounded-lg px-2 py-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}>
                    <ZoomOut className="w-3 h-3" />
                </Button>
                <span className="text-xs font-semibold w-12 text-center">{Math.round(zoom * 100)}%</span>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.min(3, zoom + 0.1))}>
                    <ZoomIn className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500" onClick={() => setZoom(1)}>
                    <Maximize className="w-3 h-3" />
                </Button>
            </div>

            {/* Right: Save Actions */}
            <div className="flex items-center gap-2">
                <Button onClick={onSave} disabled={isSaving} className="gap-2 bg-primary">
                    <Save className="w-4 h-4" />
                    {isSaving ? "Saving..." : "Save Template"}
                </Button>
            </div>
        </div>
    );
}
