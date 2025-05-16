'use client';

import { useState, useEffect, useRef } from 'react';
import { FiImage } from 'react-icons/fi';
import { AiOutlineLoading } from 'react-icons/ai';
import ImageUpload from '../addons/ImageUpload';

type CommentFormProps = {
  initialContent?: string;
  initialImages?: string[];
  placeholder: string;
  reply_to?: string;
  type: "reply" | "comment";
  onSubmit: (data: { content: string; images: File[]; previews: string[] }) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
};

export default function CommentEditForm({
  initialContent = '',
  initialImages = [],
  placeholder,
  reply_to,
  type = "comment",
  onSubmit,
  onCancel,
  isSubmitting = false,
}: CommentFormProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedPreviews, setUploadedPreviews] = useState<string[]>(initialImages);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mention, setMention] = useState('');
  const [isEmpty, setIsEmpty] = useState(true);

  const handleInput = () => {
    const div = editorRef.current;
    if (!div) return;

    const textContent = div.textContent?.trim() || '';
    const isOnlyMention = textContent === mention;
    setIsEmpty(textContent.length === 0 || isOnlyMention);

    const hasMention = div.innerHTML.includes(`<strong class="text-teal-400">${mention}</strong>`);
    if (!hasMention) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Grab current content from contentEditable div on submit
      const currentContent = editorRef.current?.innerHTML.trim() || '';

      const data = {
        content: currentContent,
        images: uploadedFiles,
        previews: uploadedPreviews
      };
      await onSubmit(data);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleImageUpload = () => {
    setShowImageUpload(!showImageUpload);
  };

  const handleImageUploadChange = (files: File[], previews: string[]) => {
    setUploadedFiles(files);
    setUploadedPreviews(previews);
  };

  const canSubmit = !isEmpty || uploadedPreviews.length > 0;
  const showLoading = isLoading || isSubmitting;

  const parseHtmlContent = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const strong = doc.querySelector('strong.text-teal-400');
    const parsedMention = strong ? `<strong class="text-teal-400">${strong.textContent}</strong>` : '';

    if (strong) strong.remove(); 

    const remainingText = doc.body.textContent?.trim() || '';
    return { parsedMention, remainingText };
  };

  useEffect(() => {
    if (!editorRef.current) return;

    const { parsedMention, remainingText } = parseHtmlContent(initialContent);

    const fullContent = `${parsedMention}${parsedMention ? '&nbsp;' : ''}${remainingText}`;
    editorRef.current.innerHTML = fullContent;

    setMention(parsedMention);
    setIsEmpty(remainingText.trim().length === 0 && !parsedMention);
  }, [initialContent]);


  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex-1">
        <div className="relative mb-4">
          {isEmpty && (
            <span className="pointer-events-none absolute top-3 left-3 text-sm text-gray-400">
              {placeholder}
            </span>
          )}

          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            spellCheck={true}
            className="w-full min-h-[72px] p-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
          />
        </div>

        {type === "comment" && showImageUpload && (
          <div className="mt-4">
            <ImageUpload
              name="commentImages"
              label=""
              required={false}
              min={0}
              max={5}
              isComment={true}
              accept="image/*"
              multiple={true}
              value={uploadedFiles}
              previews={uploadedPreviews}
              onChange={handleImageUploadChange}
              dropzoneText="Click or drag images here to upload"
              dropzoneSubText="PNG, JPG, GIF up to 5MB (max 5 images)"
              disabled={showLoading}
            />
          </div>
        )}

        <div className="flex items-center justify-between mt-2">
          {type === "comment" ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleImageUpload}
                className={`p-2 rounded-lg transition-colors ${showImageUpload ? 'bg-teal-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                disabled={showLoading}
              >
                <FiImage className="h-5 w-5" />
              </button>

              {uploadedPreviews.length > 0 && (
                <span className="text-sm text-gray-400">
                  {uploadedPreviews.length} {uploadedPreviews.length === 1 ? 'image' : 'images'} attached
                </span>
              )}
            </div>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
                disabled={showLoading}
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={!canSubmit || showLoading}
              className="px-4 py-2 text-sm font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[80px] justify-center"
            >
              {showLoading ? (
                <>
                  <AiOutlineLoading className="animate-spin h-4 w-4 text-white" />
                  <span>Saving...</span>
                </>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
