import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { FaBold, FaItalic, FaStrikethrough, FaUnderline, FaLink, FaAlignLeft, FaAlignCenter, FaAlignRight, FaCode, FaListUl, FaListOl, FaQuoteRight, FaImage } from 'react-icons/fa';

interface TextEditorProps {
  value: string;
  onChange: (content: string) => void;
  error?: string | boolean;
}

const TextEditor: React.FC<TextEditorProps> = ({ value, onChange, error }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const addLink = () => {
    if (!editor) return;

    const url = window.prompt('Enter the URL');
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run();
    }
  };

  const addImage = () => {
    if (!editor) return;

    const url = window.prompt('Enter the image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className={`rounded-lg border ${error ? 'border-red-500' : 'border-gray-700'} bg-gray-800`}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-2 border-b border-gray-700 bg-gray-900 rounded-t-lg">
        {/* Text Formatting Buttons */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded transition-colors duration-200 ${
            editor.isActive('bold') 
              ? 'bg-teal-600 text-white' 
              : 'text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <FaBold />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded transition-colors duration-200 ${
            editor.isActive('italic') 
              ? 'bg-teal-600 text-white' 
              : 'text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <FaItalic />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded transition-colors duration-200 ${
            editor.isActive('underline') 
              ? 'bg-teal-600 text-white' 
              : 'text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <FaUnderline />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded transition-colors duration-200 ${
            editor.isActive('strike') 
              ? 'bg-teal-600 text-white' 
              : 'text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <FaStrikethrough />
        </button>

        {/* Link */}
        <button
          type="button"
          onClick={addLink}
          className="p-2 rounded text-gray-400 hover:bg-gray-700 hover:text-white transition-colors duration-200"
        >
          <FaLink />
        </button>

        {/* Text Alignment */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded transition-colors duration-200 ${
            editor.isActive({ textAlign: 'left' }) 
              ? 'bg-teal-600 text-white' 
              : 'text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <FaAlignLeft />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded transition-colors duration-200 ${
            editor.isActive({ textAlign: 'center' }) 
              ? 'bg-teal-600 text-white' 
              : 'text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <FaAlignCenter />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded transition-colors duration-200 ${
            editor.isActive({ textAlign: 'right' }) 
              ? 'bg-teal-600 text-white' 
              : 'text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <FaAlignRight />
        </button>

        {/* Lists and Code */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded transition-colors duration-200 ${
            editor.isActive('bulletList') 
              ? 'bg-teal-600 text-white' 
              : 'text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <FaListUl />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded transition-colors duration-200 ${
            editor.isActive('orderedList') 
              ? 'bg-teal-600 text-white' 
              : 'text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <FaListOl />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded transition-colors duration-200 ${
            editor.isActive('codeBlock') 
              ? 'bg-teal-600 text-white' 
              : 'text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <FaCode />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded transition-colors duration-200 ${
            editor.isActive('blockquote') 
              ? 'bg-teal-600 text-white' 
              : 'text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <FaQuoteRight />
        </button>

        {/* Image */}
        <button
          type="button"
          onClick={addImage}
          className="p-2 rounded text-gray-400 hover:bg-gray-700 hover:text-white transition-colors duration-200"
        >
          <FaImage />
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent 
        editor={editor} 
        className="p-4 prose prose-invert max-w-none prose-pre:bg-gray-900 prose-pre:text-white prose-code:bg-gray-900 prose-code:text-white prose-code:px-2 prose-code:py-1 prose-code:rounded prose-a:text-teal-400 prose-blockquote:border-l-teal-600 min-h-[200px]" 
      />
      {/* Placeholder */}
      <style jsx>{`
        .ProseMirror:focus {
          outline: none;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: 'Write your thread content here...';
          float: left;
          color: #6b7280;
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </div>
  );
};

export default TextEditor;