"use client";

import { useState, useEffect } from "react";
import { 
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Settings2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { 
    getCategories, createCategory, deleteCategory,
    getPaperTypes, createPaperType, deletePaperType 
} from "@/app/actions/admin/mock-metadata";

interface Props {
    type: "CATEGORY" | "PAPER_TYPE";
    courseId: string;
    onUpdate: () => void;
}

export default function MetadataManager({ type, courseId, onUpdate }: Props) {
    const [items, setItems] = useState<any[]>([]);
    const [newItemName, setNewItemName] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (courseId) loadItems();
    }, [courseId, type]);

    const loadItems = async () => {
        setLoading(true);
        try {
            if (type === "CATEGORY") {
                const res = await getCategories(courseId);
                if (res.success) setItems(res.categories);
            } else {
                const res = await getPaperTypes(courseId);
                if (res.success) setItems(res.paperTypes);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!newItemName.trim()) return;
        setIsSaving(true);
        try {
            const res = type === "CATEGORY"
                ? await createCategory(newItemName, courseId)
                : await createPaperType(newItemName, courseId);
            
            if (res.success) {
                toast.success("Added successfully");
                setNewItemName("");
                loadItems();
                onUpdate();
            } else {
                toast.error(res.error || "Failed to add");
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this?")) return;
        try {
            const res = type === "CATEGORY"
                ? await deleteCategory(id)
                : await deletePaperType(id);
            
            if (res.success) {
                toast.success("Deleted successfully");
                loadItems();
                onUpdate();
            }
        } catch (error) {
            toast.error("Failed to delete");
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10 shrink-0" disabled={!courseId}>
                    <Settings2 className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Manage {type === "CATEGORY" ? "Categories (Topics)" : "Paper Types"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 pt-4">
                    {/* Add Form */}
                    <div className="flex gap-2">
                        <Input 
                            placeholder={`New ${type === "CATEGORY" ? "Category" : "Paper Type"} name...`}
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                        />
                        <Button onClick={handleAdd} disabled={isSaving || !newItemName.trim()}>
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        </Button>
                    </div>

                    {/* List */}
                    <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {loading ? (
                            <div className="py-8 text-center text-slate-400 text-sm">Loading items...</div>
                        ) : items.length === 0 ? (
                            <div className="py-8 text-center text-slate-400 text-sm italic">No items found for this course.</div>
                        ) : (
                            items.map((item) => (
                                <div key={item._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl group hover:bg-slate-100 transition-colors">
                                    <span className="font-bold text-slate-700">{item.name}</span>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleDelete(item._id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
