import React, { useState, useRef } from 'react';
import { FaBold, FaItalic, FaUnderline, FaHeading, FaListUl, FaListOl, FaLink, FaImage } from 'react-icons/fa';

interface TextEditorProps {
    value: string;
    onChange: (value: string) => void;
    error: string | undefined | false;
}

const TextEditor: React.FC<TextEditorProps> = ({ value, onChange, error }) => {
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [linkText, setLinkText] = useState('');
    const [showImageInput, setShowImageInput] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [imageAlt, setImageAlt] = useState('');
    const textAreaRef = useRef<HTMLDivElement>(null);

    const saveCursorPosition = () => {
        const selection = window.getSelection();
        if (!selection || !textAreaRef.current) return null;
        const range = selection.getRangeAt(0);
        const preSelectionRange = range.cloneRange();
        preSelectionRange.selectNodeContents(textAreaRef.current);
        preSelectionRange.setEnd(range.startContainer, range.startOffset);
        const start = preSelectionRange.toString().length;
        return start;
    };

    const restoreCursorPosition = (start: number) => {
        if (!textAreaRef.current) return;
        const selection = window.getSelection();
        const range = document.createRange();
        let charCount = 0;
        let node: Node | null = textAreaRef.current;

        const traverseNodes = (currentNode: Node): boolean => {
            if (currentNode.nodeType === 3) {
                const textLength = currentNode.textContent?.length || 0;
                if (charCount + textLength >= start) {
                    range.setStart(currentNode, start - charCount);
                    range.collapse(true);
                    return true;
                }
                charCount += textLength;
            } else {
                for (let i = 0; i < currentNode.childNodes.length; i++) {
                    if (traverseNodes(currentNode.childNodes[i])) {
                        return true;
                    }
                }
            }
            return false;
        };

        traverseNodes(node);
        selection?.removeAllRanges();
        selection?.addRange(range);
    };

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        const cursorPosition = saveCursorPosition();
        onChange((e.target as HTMLDivElement).innerHTML);
        setTimeout(() => {
            if (cursorPosition !== null) {
                restoreCursorPosition(cursorPosition);
            }
        }, 0);
    };

    const insertFormatting = (startTag: string, endTag: string = '') => {
        if (!textAreaRef.current) return;

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const selectedText = range.toString();

        const newText = startTag + selectedText + endTag;

        range.deleteContents();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = newText;
        const frag = document.createDocumentFragment();
        while (tempDiv.firstChild) {
            frag.appendChild(tempDiv.firstChild);
        }
        range.insertNode(frag);

        onChange(textAreaRef.current.innerHTML);

        // Set cursor position after operation
        setTimeout(() => {
            textAreaRef.current?.focus();
        }, 0);
    };

    const insertLink = () => {
        if (!linkUrl) return;

        const linkHTML = `<a href="${linkUrl}" target="_blank">${linkText || linkUrl}</a>`;

        if (!textAreaRef.current) return;

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        range.deleteContents();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = linkHTML;
        const frag = document.createDocumentFragment();
        while (tempDiv.firstChild) {
            frag.appendChild(tempDiv.firstChild);
        }
        range.insertNode(frag);

        onChange(textAreaRef.current.innerHTML);

        // Reset states
        setLinkUrl('');
        setLinkText('');
        setShowLinkInput(false);

        // Focus back on textarea
        setTimeout(() => {
            textAreaRef.current?.focus();
        }, 0);
    };

    const insertImage = () => {
        if (!imageUrl) return;

        const imageHTML = `<img src="${imageUrl}" alt="${imageAlt || 'image'}" />`;

        if (!textAreaRef.current) return;

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        range.deleteContents();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = imageHTML;
        const frag = document.createDocumentFragment();
        while (tempDiv.firstChild) {
            frag.appendChild(tempDiv.firstChild);
        }
        range.insertNode(frag);

        onChange(textAreaRef.current.innerHTML);

        // Reset states
        setImageUrl('');
        setImageAlt('');
        setShowImageInput(false);

        // Focus back on textarea
        setTimeout(() => {
            textAreaRef.current?.focus();
        }, 0);
    };

    return (
        <div className={`w-full p-2 bg-gray-800 rich-text-editor overflow-hidden text-white rounded-lg border border-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent hover:border-teal-700 ${error ? 'border-red-500 ring-1 ring-red-500' : ''}`}>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-800 border-b border-gray-600">
                <button
                    type="button"
                    onClick={() => insertFormatting('<strong>', '</strong>')}
                    className="p-2 rounded hover:bg-gray-700"
                    title="Bold"
                >
                    <FaBold />
                </button>

                <button
                    type="button"
                    onClick={() => insertFormatting('<em>', '</em>')}
                    className="p-2 rounded hover:bg-gray-700"
                    title="Italic"
                >
                    <FaItalic />
                </button>

                <button
                    type="button"
                    onClick={() => insertFormatting('<u>', '</u>')}
                    className="p-2 rounded hover:bg-gray-700"
                    title="Underline"
                >
                    <FaUnderline />
                </button>

                <div className="w-px h-6 bg-gray-600 mx-1"></div>

                <button
                    type="button"
                    onClick={() => insertFormatting('<h2>', '</h2>')}
                    className="p-2 rounded hover:bg-gray-700"
                    title="Heading"
                >
                    <FaHeading />
                </button>

                <button
                    type="button"
                    onClick={() => insertFormatting('<ul><li>', '</li></ul>')}
                    className="p-2 rounded hover:bg-gray-700"
                    title="Bullet List"
                >
                    <FaListUl />
                </button>

                <button
                    type="button"
                    onClick={() => insertFormatting('<ol><li>', '</li></ol>')}
                    className="p-2 rounded hover:bg-gray-700"
                    title="Numbered List"
                >
                    <FaListOl />
                </button>

                <div className="w-px h-6 bg-gray-600 mx-1"></div>

                <button
                    type="button"
                    onClick={() => setShowLinkInput(!showLinkInput)}
                    className={`p-2 rounded hover:bg-gray-700 ${showLinkInput ? 'bg-gray-700' : ''}`}
                    title="Insert Link"
                >
                    <FaLink />
                </button>

                <button
                    type="button"
                    onClick={() => setShowImageInput(!showImageInput)}
                    className={`p-2 rounded hover:bg-gray-700 ${showImageInput ? 'bg-gray-700' : ''}`}
                    title="Insert Image"
                >
                    <FaImage />
                </button>
            </div>

            {/* Link Input */}
            {showLinkInput && (
                <div className="p-2 bg-gray-700 border-b border-gray-600 flex flex-wrap gap-2">
                    <input
                        type="text"
                        placeholder="Link URL"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        className="flex-1 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm min-w-[150px]"
                    />
                    <input
                        type="text"
                        placeholder="Link Text (optional)"
                        value={linkText}
                        onChange={(e) => setLinkText(e.target.value)}
                        className="flex-1 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm min-w-[150px]"
                    />
                    <button
                        type="button"
                        onClick={insertLink}
                        className="px-3 py-1 bg-[#ADFF00] text-black rounded text-sm font-medium"
                    >
                        Insert
                    </button>
                </div>
            )}

            {/* Image Input */}
            {showImageInput && (
                <div className="p-2 bg-gray-700 border-b border-gray-600 flex flex-wrap gap-2">
                    <input
                        type="text"
                        placeholder="Image URL"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="flex-1 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm min-w-[150px]"
                    />
                    <input
                        type="text"
                        placeholder="Alt Text (optional)"
                        value={imageAlt}
                        onChange={(e) => setImageAlt(e.target.value)}
                        className="flex-1 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm min-w-[150px]"
                    />
                    <button
                        type="button"
                        onClick={insertImage}
                        className="px-3 py-1 bg-[#ADFF00] text-black rounded text-sm font-medium"
                    >
                        Insert
                    </button>
                </div>
            )}

            {/* Text Area */}
            <div
                ref={textAreaRef}
                contentEditable
                onInput={handleInput}
                dangerouslySetInnerHTML={{ __html: value }}
                className="w-full px-3 py-2 md:text-base text-sm bg-gray-800 min-h-[200px] rounded-xl focus:outline-none resize-y"
                placeholder="Write your blog content here..."
            ></div>
        </div>
    );
};

export default TextEditor;