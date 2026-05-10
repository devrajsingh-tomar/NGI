
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Type, Image as ImageIcon, QrCode, Layers, Settings, GripVertical, Lock, Eye, EyeOff, Trash2 } from "lucide-react";
import { EditorElement, PageConfig } from "./useEditorState";

interface EditorSidebarProps {
    elements: EditorElement[];
    onAddElement: (type: 'text' | 'image' | 'qrcode', initialContent?: string) => void;
    onSelect: (id: string) => void;
    selectedIds: string[];
    onUpdatePage: (updates: Partial<PageConfig>) => void;
    pageConfig: PageConfig;
    onMoveLayer: (id: string, dir: 'up' | 'down') => void;
    onDelete: () => void;
    onUpdateElement: (id: string, updates: Partial<EditorElement>) => void;
}

export default function EditorSidebar({
    elements, onAddElement, onSelect, selectedIds,
    onUpdatePage, pageConfig, onMoveLayer, onDelete, onUpdateElement
}: EditorSidebarProps) {

    // Reverse elements for layer list (top layer first)
    const reversedElements = [...elements].reverse();

    const handleFormatChange = (format: string) => {
        let width = 842;
        let height = 595;

        switch (format) {
            case 'A4': width = 842; height = 595; break;
            case 'A3': width = 1191; height = 842; break;
            case 'Letter': width = 792; height = 612; break;
        }

        if (pageConfig.orientation === 'portrait') {
            const temp = width; width = height; height = temp;
        }

        onUpdatePage({ format, width, height });
    };

    const handleOrientationChange = (orient: 'portrait' | 'landscape') => {
        // Swap dimensions if orientation changed
        if (orient !== pageConfig.orientation) {
            onUpdatePage({
                orientation: orient,
                width: pageConfig.height,
                height: pageConfig.width
            });
        }
    };

    return (
        <aside className="w-72 bg-white border-r flex flex-col shrink-0 h-full overflow-hidden">
            <Tabs defaultValue="add" className="flex flex-col flex-1 h-full">
                <div className="px-4 pt-4 shrink-0">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="add">Add</TabsTrigger>
                        <TabsTrigger value="layers">Layers</TabsTrigger>
                        <TabsTrigger value="page">Page</TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {/* ADD TAB */}
                    <TabsContent value="add" className="space-y-6 mt-0">
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-slate-500 uppercase">Elements</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <Button variant="outline" className="h-20 flex flex-col gap-2 hover:border-primary hover:bg-slate-50" onClick={() => onAddElement("text")}>
                                    <Type className="w-6 h-6 text-slate-700" />
                                    <span className="text-xs">Text</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex flex-col gap-2 hover:border-primary hover:bg-slate-50" onClick={() => onAddElement("image")}>
                                    <ImageIcon className="w-6 h-6 text-slate-700" />
                                    <span className="text-xs">Image</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex flex-col gap-2 hover:border-primary hover:bg-slate-50" onClick={() => onAddElement("qrcode")}>
                                    <QrCode className="w-6 h-6 text-slate-700" />
                                    <span className="text-xs">QR Code</span>
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-slate-500 uppercase">Dynamic Fields</h3>
                            <div className="space-y-2">
                                {[
                                    { label: "Student Name", val: "{{student_name}}" },
                                    { label: "Course Name", val: "{{course_name}}" },
                                    { label: "Grade", val: "{{grade}}" },
                                    { label: "Date of Issue", val: "{{issue_date}}" },
                                    { label: "Certificate ID", val: "{{certificate_number}}" },
                                    { label: "QR Code", val: "{{qr_code}}", type: 'qrcode' }
                                ].map((field) => (
                                    <div
                                        key={field.val}
                                        className="p-3 bg-slate-50 border rounded-lg text-sm font-medium cursor-pointer hover:bg-slate-100 flex items-center justify-between group"
                                        onClick={() => onAddElement(field.type === 'qrcode' ? 'qrcode' : 'text', field.val)}
                                    >
                                        {field.label}
                                        <span className="text-xs text-slate-400 opacity-0 group-hover:opacity-100">+ Add</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-slate-400">Click to add field to canvas</p>
                        </div>
                    </TabsContent>

                    {/* LAYERS TAB */}
                    <TabsContent value="layers" className="space-y-4 mt-0">
                        <div className="space-y-2">
                            {reversedElements.map((el, i) => (
                                <div
                                    key={el.id}
                                    className={`flex items-center gap-2 p-2 border rounded-lg text-sm bg-white ${selectedIds.includes(el.id) ? 'border-primary ring-1 ring-primary/20' : 'hover:bg-slate-50'}`}
                                    onClick={() => onSelect(el.id)}
                                >
                                    <GripVertical className="w-4 h-4 text-slate-400 cursor-grab" />
                                    <span className="flex-1 truncate">{el.content || el.type}</span>

                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); onUpdateElement(el.id, { locked: !el.locked }); }}>
                                            <Lock className={`w-3 h-3 ${el.locked ? "text-red-500" : "text-slate-400"}`} />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); onUpdateElement(el.id, { hidden: !el.hidden }); }}>
                                            {el.hidden ? <EyeOff className="w-3 h-3 text-slate-400" /> : <Eye className="w-3 h-3 text-slate-400" />}
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:bg-red-50" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {elements.length === 0 && <p className="text-center text-slate-400 text-sm py-4">No layers</p>}
                        </div>
                    </TabsContent>

                    {/* PAGE TAB */}
                    <TabsContent value="page" className="space-y-6 mt-0">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Page Format</Label>
                                <Select value={pageConfig.format} onValueChange={handleFormatChange}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="A4">A4 (210 x 297 mm)</SelectItem>
                                        <SelectItem value="A3">A3 (297 x 420 mm)</SelectItem>
                                        <SelectItem value="Letter">Letter (8.5 x 11 in)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Orientation</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        variant={pageConfig.orientation === 'portrait' ? "default" : "outline"}
                                        onClick={() => handleOrientationChange('portrait')}
                                        className="h-10"
                                    >
                                        Portrait
                                    </Button>
                                    <Button
                                        variant={pageConfig.orientation === 'landscape' ? "default" : "outline"}
                                        onClick={() => handleOrientationChange('landscape')}
                                        className="h-10"
                                    >
                                        Landscape
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </aside>
    );
}
