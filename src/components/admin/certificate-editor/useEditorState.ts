
import { useState, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ICertificateElement, ICertificateTemplate } from '@/models/CertificateTemplate';

export type EditorElement = ICertificateElement;

export interface PageConfig {
    format: string;
    orientation: 'portrait' | 'landscape';
    dpi: number;
    width: number;
    height: number;
}

interface HistoryState {
    elements: EditorElement[];
    config: PageConfig;
    backgroundImage: string;
}

export function useEditorState(initialTemplate: ICertificateTemplate) {
    // Initialize state from template or defaults
    const [elements, setElements] = useState<EditorElement[]>(initialTemplate.elements || []);
    const [pageConfig, setPageConfig] = useState<PageConfig>({
        format: initialTemplate.config?.format || 'A4',
        orientation: (initialTemplate.config?.orientation as 'portrait' | 'landscape') || 'landscape',
        dpi: initialTemplate.config?.dpi || 72,
        width: initialTemplate.width || 842,
        height: initialTemplate.height || 595
    });
    const [backgroundImage, setBackgroundImage] = useState<string>(initialTemplate.backgroundImage || '');

    // UI State
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [zoom, setZoom] = useState(1);
    const [showGrid, setShowGrid] = useState(true);
    const [showRulers, setShowRulers] = useState(true);
    const [showMargins, setShowMargins] = useState(true);

    // History Stack
    const [history, setHistory] = useState<HistoryState[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const isHistoryAction = useRef(false);

    // --- History Management ---
    const addToHistory = useCallback(() => {
        if (isHistoryAction.current) return;

        const currentState: HistoryState = {
            elements: JSON.parse(JSON.stringify(elements)),
            config: { ...pageConfig },
            backgroundImage
        };

        setHistory(prev => {
            const newHistory = prev.slice(0, historyIndex + 1);
            return [...newHistory, currentState];
        });
        setHistoryIndex(prev => prev + 1);
    }, [elements, pageConfig, backgroundImage, historyIndex]);

    const undo = useCallback(() => {
        if (historyIndex > 0) {
            isHistoryAction.current = true;
            const prevState = history[historyIndex - 1];
            setElements(prevState.elements);
            setPageConfig(prevState.config);
            setBackgroundImage(prevState.backgroundImage);
            setHistoryIndex(prev => prev - 1);
            setTimeout(() => { isHistoryAction.current = false; }, 50);
        }
    }, [history, historyIndex]);

    const redo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            isHistoryAction.current = true;
            const nextState = history[historyIndex + 1];
            setElements(nextState.elements);
            setPageConfig(nextState.config);
            setBackgroundImage(nextState.backgroundImage);
            setHistoryIndex(prev => prev + 1);
            setTimeout(() => { isHistoryAction.current = false; }, 50);
        }
    }, [history, historyIndex]);

    // --- Actions ---

    const addElement = (type: 'text' | 'image' | 'qrcode', initialContent?: string) => {
        addToHistory();
        const newEl: EditorElement = {
            id: uuidv4(),
            type,
            content: initialContent || (type === 'text' ? 'New Text' : (type === 'qrcode' ? 'QR Code' : 'https://via.placeholder.com/150')),
            x: 100,
            y: 100,
            width: type === 'text' ? 200 : 100,
            height: type === 'text' ? 40 : 100,
            rotation: 0,
            opacity: 1,
            locked: false,
            hidden: false,
            style: {
                fontFamily: 'Inter',
                fontSize: 16,
                fontWeight: 'normal',
                textAlign: 'center',
                color: '#000000',
                letterSpacing: 0,
                lineHeight: 1.2
            }
        };
        setElements(prev => [...prev, newEl]);
        setSelectedIds([newEl.id]);
    };

    const updateElement = (id: string, updates: Partial<EditorElement>) => {
        setElements(prev => prev.map(el => {
            if (el.id === id) {
                // If style is being updated, we need to merge it carefully
                if (updates.style) {
                    return { ...el, ...updates, style: { ...el.style, ...updates.style } };
                }
                return { ...el, ...updates };
            }
            return el;
        }));
    };

    // Commits changes to history (call onDragStop, onResizeStop)
    const commitChange = () => {
        addToHistory();
    };

    const deleteSelected = () => {
        if (selectedIds.length === 0) return;
        addToHistory();
        setElements(prev => prev.filter(el => !selectedIds.includes(el.id)));
        setSelectedIds([]);
    };

    // Advanced Editing Features
    const copySelected = useRef<EditorElement[]>([]);
    
    const handleCopy = useCallback(() => {
        copySelected.current = elements.filter(el => selectedIds.includes(el.id));
    }, [elements, selectedIds]);

    const handlePaste = useCallback(() => {
        if (copySelected.current.length === 0) return;
        addToHistory();
        
        const pastedIds: string[] = [];
        const pastedElements = copySelected.current.map(el => {
            const newId = uuidv4();
            pastedIds.push(newId);
            return {
                ...el,
                id: newId,
                x: el.x + 20, // Offset so user can see it
                y: el.y + 20
            };
        });
        
        setElements(prev => [...prev, ...pastedElements]);
        setSelectedIds(pastedIds);
    }, [addToHistory]);

    const nudgeSelected = useCallback((dx: number, dy: number) => {
        if (selectedIds.length === 0) return;
        // Not adding to history on EVERY nudge to avoid history spam, handled by commitChange or batching
        setElements(prev => prev.map(el => {
            if (selectedIds.includes(el.id) && !el.locked) {
                return { ...el, x: el.x + dx, y: el.y + dy };
            }
            return el;
        }));
    }, [selectedIds]);

    const updatePageConfig = (updates: Partial<PageConfig>) => {
        addToHistory();
        setPageConfig(prev => ({ ...prev, ...updates }));
    };

    // --- Layer Actions ---
    const moveLayer = (id: string, direction: 'up' | 'down' | 'top' | 'bottom') => {
        addToHistory();
        setElements(prev => {
            const index = prev.findIndex(el => el.id === id);
            if (index === -1) return prev;

            const newElements = [...prev];
            const [item] = newElements.splice(index, 1);

            if (direction === 'up' && index < newElements.length) newElements.splice(index + 1, 0, item);
            else if (direction === 'down' && index > 0) newElements.splice(index - 1, 0, item);
            else if (direction === 'top') newElements.push(item);
            else if (direction === 'bottom') newElements.unshift(item);
            else newElements.splice(index, 0, item); // No change

            return newElements;
        });
    };

    return {
        elements,
        pageConfig,
        backgroundImage,
        selectedIds,
        zoom,
        showGrid,
        showRulers,
        showMargins,

        setElements,
        setPageConfig,
        setBackgroundImage,
        setSelectedIds,
        setZoom,
        setShowGrid,
        setShowRulers,
        setShowMargins,

        addElement,
        updateElement,
        deleteSelected,
        moveLayer,
        updatePageConfig,
        commitChange,

        history: {
            undo,
            redo,
            canUndo: historyIndex > 0,
            canRedo: historyIndex < history.length - 1
        },
        
        handleCopy,
        handlePaste,
        nudgeSelected
    };
}
