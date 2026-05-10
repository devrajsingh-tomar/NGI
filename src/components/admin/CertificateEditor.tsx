
"use client";

import React, { useState, useEffect } from "react";
import { getTemplate, updateTemplate } from "@/app/actions/certificateTemplate";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import dynamic from "next/dynamic";
import { useEditorState } from "./certificate-editor/useEditorState";
import EditorToolbar from "./certificate-editor/EditorToolbar";
import EditorSidebar from "./certificate-editor/EditorSidebar";
const EditorCanvas = dynamic(() => import("./certificate-editor/EditorCanvas"), { ssr: false });
import PropertiesPanel from "./certificate-editor/PropertiesPanel";

export default function CertificateEditor({ templateId }: { templateId: string }) {
    const [isLoading, setIsLoading] = useState(true);
    const [initialData, setInitialData] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [templateName, setTemplateName] = useState("");

    const editor = useEditorState(initialData || { name: "", elements: [] });

    // Re-initialize hook when data loads
    // Note: This pattern is slightly tricky with hooks. 
    // Ideally useEditorState should handle null initial data or we delay rendering.

    useEffect(() => {
        const load = async () => {
            const res = await getTemplate(templateId);
            if (res.success) {
                setInitialData(res.template);
                setTemplateName(res.template.name);

                // Manually set state because hook initialized with empty
                editor.setElements(res.template.elements || []);
                editor.setPageConfig({
                    format: res.template.config?.format || 'A4',
                    orientation: res.template.config?.orientation || 'landscape',
                    dpi: res.template.config?.dpi || 72,
                    width: res.template.width || 842,
                    height: res.template.height || 595
                });
                editor.setBackgroundImage(res.template.backgroundImage || "");
            } else {
                toast.error("Failed to load template");
            }
            setIsLoading(false);
        };
        load();
    }, [templateId]); // Empty mapping to avoid loop, strictly load once.

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const activeTag = document.activeElement?.tagName.toLowerCase();
            if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') return;

            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (editor.selectedIds.length > 0) editor.deleteSelected();
            } else if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
                editor.handleCopy();
            } else if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
                editor.handlePaste();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                editor.nudgeSelected(0, e.shiftKey ? -10 : -1);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                editor.nudgeSelected(0, e.shiftKey ? 10 : 1);
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                editor.nudgeSelected(e.shiftKey ? -10 : -1, 0);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                editor.nudgeSelected(e.shiftKey ? 10 : 1, 0);
            } else if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                editor.history.undo();
            } else if ((e.ctrlKey || e.metaKey) && e.key === 'y' || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z')) {
                e.preventDefault();
                editor.history.redo();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [editor]);

    const handleSave = async () => {
        setIsSaving(true);
        const res = await updateTemplate(templateId, {
            name: templateName,
            elements: editor.elements,
            backgroundImage: editor.backgroundImage,
            width: editor.pageConfig.width,
            height: editor.pageConfig.height,
            config: {
                format: editor.pageConfig.format,
                orientation: editor.pageConfig.orientation,
                dpi: editor.pageConfig.dpi,
                printMargin: 0
            }
        });

        setIsSaving(false);
        if (res.success) toast.success("Template saved!");
        else toast.error("Save failed");
    };

    if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin mr-2" /> Loading Editor...</div>;

    const selectedElement = editor.elements.find(el => editor.selectedIds.includes(el.id)) || null;

    return (
        <div className="flex flex-col h-screen bg-slate-100 overflow-hidden">
            <style dangerouslySetInnerHTML={{__html: `@import url('https://fonts.googleapis.com/css2?family=Caveat&family=Cinzel&family=Dancing+Script&family=Inter:wght@400;700&family=Lato:wght@400;700&family=Libre+Baskerville:wght@400;700&family=Lora:ital,wght@0,400;0,700&family=Merriweather:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@400;700&family=Nunito:wght@400;700&family=Open+Sans:wght@400;700&family=Oswald:wght@400;700&family=PT+Serif:ital,wght@0,400;0,700&family=Pacifico&family=Playfair+Display:ital,wght@0,400;0,700&family=Poppins:wght@400;700&family=Raleway:wght@400;700&family=Roboto:ital,wght@0,400;0,700;1,400&family=Satisfy&display=swap');`}} />
            <EditorToolbar
                zoom={editor.zoom} setZoom={editor.setZoom}
                showGrid={editor.showGrid} setShowGrid={editor.setShowGrid}
                showRulers={editor.showRulers} setShowRulers={editor.setShowRulers}
                showMargins={editor.showMargins} setShowMargins={editor.setShowMargins}
                history={editor.history}
                onSave={handleSave}
                isSaving={isSaving}
                pageConfig={editor.pageConfig}
            />

            <div className="flex flex-1 overflow-hidden">
                <EditorSidebar
                    elements={editor.elements}
                    onAddElement={editor.addElement}
                    onSelect={(id) => editor.setSelectedIds([id])}
                    selectedIds={editor.selectedIds}
                    onUpdatePage={editor.updatePageConfig}
                    pageConfig={editor.pageConfig}
                    onMoveLayer={editor.moveLayer}
                    onDelete={editor.deleteSelected}
                    onUpdateElement={editor.updateElement}
                />

                <EditorCanvas
                    elements={editor.elements}
                    pageConfig={editor.pageConfig}
                    zoom={editor.zoom}
                    selectedIds={editor.selectedIds}
                    onSelect={(id, multi) => editor.setSelectedIds(multi ? [...editor.selectedIds, id] : (id ? [id] : []))}
                    onSelectMultiple={(ids) => editor.setSelectedIds(ids)}
                    onUpdate={editor.updateElement}
                    onCommit={editor.commitChange}
                    backgroundImage={editor.backgroundImage}
                    showGrid={editor.showGrid}
                    showMargins={editor.showMargins}
                />

                <PropertiesPanel
                    element={selectedElement}
                    onUpdate={editor.updateElement}
                    deleteElement={editor.deleteSelected}
                    backgroundImage={editor.backgroundImage}
                    setBackgroundImage={editor.setBackgroundImage}
                />
            </div>
        </div>
    );
}
