'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { FiImage } from 'react-icons/fi';
import {AiOutlineLoading } from 'react-icons/ai';
import ImageUpload from '../addons/ImageUpload';

export default function CommentInput({ threadId, parentId = null, replyToUsername = null }: { 
  threadId: string; 
  parentId?: string | null;
  replyToUsername?: string | null;
}) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedPreviews, setUploadedPreviews] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() && uploadedPreviews.length === 0) return;

    setIsSubmitting(true);

    try {
      console.log({
        threadId,
        parentId,
        replyToUsername,
        content,
        images: uploadedFiles
      });

      await new Promise(resolve => setTimeout(resolve, 800));

      setContent('');
      setUploadedFiles([]);
      setUploadedPreviews([]);
      setIsExpanded(false);
      setShowImageUpload(false);

    } catch (error) {
      console.error('Failed to submit reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUploadChange = (files: File[], previews: string[]) => {
    setUploadedFiles(files);
    setUploadedPreviews(previews);
  };

  const handleFocus = () => {
    setIsExpanded(true);
  };

  const toggleImageUpload = () => {
    setShowImageUpload(!showImageUpload);
  };

  const canSubmit = content.trim().length > 0 || uploadedPreviews.length > 0;

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <Image
              src="https://avatar.iran.liara.run/public/22"
              alt="Your Avatar"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
        </div>

        <div className="flex-1">
          <div className={`transition-all ${isExpanded ? 'mb-4' : ''}`}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={handleFocus}
              placeholder={replyToUsername ? `Reply to ${replyToUsername}...` : "Write a comment..."}
              rows={isExpanded ? 4 : 2}
              className="w-full p-4 bg-gray-700 border border-gray-600 rounded-xl text-white resize-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            ></textarea>
          </div>

          {showImageUpload && (
            <div className="mt-4">
              <ImageUpload
                name="commentImages"
                label=""
                required={false}
                min={0}
                max={5}
                accept="image/*"
                multiple={true}
                value={uploadedFiles}
                previews={uploadedPreviews}
                onChange={handleImageUploadChange}
                dropzoneText="Click or drag images here to upload"
                dropzoneSubText="PNG, JPG, GIF up to 5MB (max 5 images)"
                disabled={isSubmitting}
              />
            </div>
          )}

          {isExpanded && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleImageUpload}
                  className={`p-2 rounded-lg transition-colors ${showImageUpload ? 'bg-teal-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
                  disabled={isSubmitting}
                >
                  <FiImage className="h-5 w-5" />
                </button>
                {uploadedPreviews.length > 0 && (
                  <span className="text-sm text-gray-400">
                    {uploadedPreviews.length} {uploadedPreviews.length === 1 ? 'image' : 'images'} attached
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsExpanded(false);
                    setContent('');
                    setUploadedFiles([]);
                    setUploadedPreviews([]);
                    setShowImageUpload(false);
                  }}
                  className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="px-4 py-2 text-sm font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <AiOutlineLoading className="animate-spin h-4 w-4 text-white" />
                      <span>Posting...</span>
                    </>
                  ) : (
                    <>{parentId ? 'Reply' : 'Comment'}</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}