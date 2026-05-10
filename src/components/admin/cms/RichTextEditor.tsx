"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { 
    Bold, Italic, List, ListOrdered, 
    Quote, Undo, Redo, Link as LinkIcon,
    Type, Strikethrough, Underline as UnderlineIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

const MenuButton = ({ onClick, isActive, disabled, children, title }: any) => (
    <button
        onClick={(e) => {
            e.preventDefault();
            onClick();
        }}
        disabled={disabled}
        title={title}
        className={cn(
            "p-2 rounded-lg transition-all",
            isActive 
                ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                : "text-slate-400 hover:bg-slate-100 hover:text-slate-900"
        )}
    >
        {children}
    </button>
);

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-amber-600 underline font-bold cursor-pointer',
                },
            }),
        ],
        content: content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[150px] p-4 text-slate-800 font-medium leading-relaxed',
            },
        },
    });

    if (!editor) return null;

    return (
        <div className="border border-slate-200 rounded-[1.5rem] bg-white overflow-hidden focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-orange-50 transition-all">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50/50 border-b border-slate-100">
                <MenuButton 
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    title="Bold (Ctrl+B)"
                >
                    <Bold className="w-4 h-4" />
                </MenuButton>
                <MenuButton 
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    title="Italic (Ctrl+I)"
                >
                    <Italic className="w-4 h-4" />
                </MenuButton>
                <MenuButton 
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive('underline')}
                    title="Underline (Ctrl+U)"
                >
                    <UnderlineIcon className="w-4 h-4" />
                </MenuButton>
                <MenuButton 
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive('strike')}
                    title="Strikethrough"
                >
                    <Strikethrough className="w-4 h-4" />
                </MenuButton>
                
                <div className="w-px h-6 bg-slate-200 mx-1" />

                <MenuButton 
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    title="Bullet List"
                >
                    <List className="w-4 h-4" />
                </MenuButton>
                <MenuButton 
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    title="Numbered List"
                >
                    <ListOrdered className="w-4 h-4" />
                </MenuButton>
                <MenuButton 
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive('blockquote')}
                    title="Quote"
                >
                    <Quote className="w-4 h-4" />
                </MenuButton>

                <div className="w-px h-6 bg-slate-200 mx-1" />

                <MenuButton 
                    onClick={() => {
                        const url = window.prompt('URL');
                        if (url) editor.chain().focus().setLink({ href: url }).run();
                    }}
                    isActive={editor.isActive('link')}
                    title="Add Link"
                >
                    <LinkIcon className="w-4 h-4" />
                </MenuButton>

                <div className="flex-1" />

                <MenuButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
                    <Undo className="w-4 h-4" />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
                    <Redo className="w-4 h-4" />
                </MenuButton>
            </div>

            {/* Content Area */}
            <EditorContent editor={editor} />
        </div>
    );
}
