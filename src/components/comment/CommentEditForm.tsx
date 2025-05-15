'use client';

import { useState, useEffect } from 'react';
import { FiImage } from 'react-icons/fi';
import { AiOutlineLoading } from 'react-icons/ai';
import ImageUpload from '../addons/ImageUpload';
import { div } from 'framer-motion/client';

type CommentFormProps = {
  initialContent?: string;
  initialImages?: string[];
  placeholder: string;
  type: "reply" | "comment";
  onSubmit: (data: { content: string; images: File[]; previews: string[] }) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
};

export default function CommentEditForm({
  initialContent = '',
  initialImages = [],
  placeholder,
  type = "comment",
  onSubmit,
  onCancel,
  isSubmitting = false,
}: CommentFormProps) {
  const [content, setContent] = useState(initialContent);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedPreviews, setUploadedPreviews] = useState<string[]>(initialImages);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUploadChange = (files: File[], previews: string[]) => {
    setUploadedFiles(files);
    setUploadedPreviews(previews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = {
        content: content.trim(),
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

  useEffect(() => {
    const fetchAndConvertImages = async () => {
      if (initialImages && initialImages.length > 0) {
        const files = await Promise.all(
          initialImages.map(async (url: string) => {
            const response = await fetch(url);
            const blob = await response.blob();
            const filename = url.split('/').pop() || 'image.jpg';
            return new File([blob], filename, { type: blob.type });
          })
        );

        setUploadedFiles(files);
      }
    };

    fetchAndConvertImages();
  }, [initialContent, initialImages]);

  const canSubmit = content.trim().length > 0 || uploadedPreviews.length > 0;
  const showLoading = isLoading || isSubmitting;

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex-1">
        <div className="mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            className="w-full p-4 bg-gray-700 rounded-xl text-white resize-none border border-transparent focus:border-teal-500 focus:outline-none"
            disabled={showLoading}
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
          ):(
            <div className='' />
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