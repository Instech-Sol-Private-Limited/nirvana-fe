'use client';

import { useState } from 'react';

interface CommentEditFormProps {
  initialContent: string;
  onSubmit: (text: string) => void;
  onCancel: () => void;
}

const CommentEditForm = ({ 
  initialContent,
  onSubmit, 
  onCancel 
}: CommentEditFormProps) => {
  const [text, setText] = useState(initialContent);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (text.trim()) {
      onSubmit(text);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
        rows={3}
      ></textarea>

      <div className="mt-2 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-xs text-gray-300 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!text.trim()}
          className="px-4 py-1.5 text-xs font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default CommentEditForm;