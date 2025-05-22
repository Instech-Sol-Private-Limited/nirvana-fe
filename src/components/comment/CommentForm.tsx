import { useRef, useState, useEffect } from 'react';

interface CommentFormProps {
  placeholder?: string;
  reply_to?: string;
  onSubmit: (htmlText: string) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const CommentForm = ({
  placeholder = 'Add a comment...',
  reply_to,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: CommentFormProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [mention, setMention] = useState(reply_to ? `@${reply_to}` : '');
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    if (editorRef.current && mention) {
      editorRef.current.innerHTML = `<strong class="text-teal-400">${mention}</strong>&nbsp;`;
      setIsEmpty(false);
    }
  }, [mention]);

  const handleInput = () => {
    const div = editorRef.current;
    if (!div) return;

    const textContent = div.textContent?.trim() || '';
    setIsEmpty(textContent.length === 0 || textContent === mention);

    if (!div.innerHTML.includes(mention)) {
      setMention('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!mention) return;

    const selection = window.getSelection();
    const div = editorRef.current;
    if (!selection || !div) return;
    const mentionElements = div.querySelectorAll('strong.text-teal-400');
    if (mentionElements.length === 0) return;

    const mentionEl = mentionElements[0];
    mentionEl.textContent || '';
    if (
      (e.key === 'Backspace' || e.key === 'Delete') &&
      selection.rangeCount > 0
    ) {
      const range = selection.getRangeAt(0);
      if (mentionEl.contains(range.startContainer)) {
        e.preventDefault();
        mentionEl.remove();
        setMention('');
        setIsEmpty(div.textContent?.trim().length === 0);
        const newRange = document.createRange();
        newRange.setStart(div, 0);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const div = editorRef.current;
    if (!div) return;

    const content = div.innerHTML.trim();
    if (content) {
      onSubmit(content);
      div.innerHTML = '';
      setMention(reply_to ? `@${reply_to}` : '');
      setIsEmpty(true);
    }
  };

  const reset = () => {
    if (editorRef.current) editorRef.current.innerHTML = '';
    setMention(reply_to ? `@${reply_to}` : '');
    setIsEmpty(true);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative">
        {/* Placeholder Layer */}
        {isEmpty && mention === '' && (
          <span className="pointer-events-none absolute top-3 left-3 text-sm text-gray-400">
            {placeholder}
          </span>
        )}

        {/* Editable Div */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          className="w-full min-h-[72px] p-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
        />
      </div>

      <div className="mt-2 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={reset}
          className="px-3 py-1.5 text-xs text-gray-300 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-1.5 text-xs font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
