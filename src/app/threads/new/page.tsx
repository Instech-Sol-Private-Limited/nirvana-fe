"use client";
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { categories, currentUser } from '../../../utils/data';
import { createThread } from '../../../utils/index';
import Image from 'next/image';

const NewThreadPage: NextPage = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
    category?: string;
  }>({});

  // Clear upload success notification after 3 seconds
  useEffect(() => {
    if (uploadSuccess) {
      const timer = setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [uploadSuccess]);

  const validateForm = () => {
    const newErrors: {
      title?: string;
      content?: string;
      category?: string;
    } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    }
    
    if (!content.trim()) {
      newErrors.content = 'Content is required';
    } else if (content.length < 30) {
      newErrors.content = 'Content must be at least 30 characters';
    }
    
    if (!selectedCategory) {
      newErrors.category = 'Please select a category';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    const category = categories.find(cat => cat.id === selectedCategory);
    
    if (!category) {
      setErrors({ ...errors, category: 'Invalid category' });
      setIsSubmitting(false);
      return;
    }
    
    // In a real implementation, we would upload the images here
    // and include their URLs in the thread data
    
    const newThread = createThread({
      title,
      content,
      author: currentUser,
      category,
      tags: tags.length > 0 ? tags : ['General'],
      // images: would add image URLs here
    });
    
    // Change the redirect to /threads page instead of the specific thread
    router.push(`/threads?created=true`);
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files);
      const newPreviews: string[] = [];
      
      newImages.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setPreviews(prev => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
      
      setImages(prev => [...prev, ...newImages]);
      setUploadSuccess(true);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <Head>
        <title>Create New Thread | Forum</title>
        <meta name="description" content="Start a new discussion thread" />
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8 border-l-4 border-teal-500 pl-4">
          Create New Thread
        </h1>
        
        <form onSubmit={handleSubmit} className="bg-gray-900 rounded-xl p-8 shadow-2xl border border-gray-800">
          <div className="mb-6 group">
            <label htmlFor="title" className="block text-white mb-2 text-lg font-medium">Thread Title</label>
            <input
              type="text"
              id="title"
              className={`w-full p-4 bg-gray-800 text-white rounded-lg border border-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent hover:border-teal-700 ${errors.title ? 'border-red-500 ring-1 ring-red-500' : ''}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a descriptive title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-2">{errors.title}</p>}
          </div>
          
          <div className="mb-6 group">
            <label htmlFor="category" className="block text-white mb-2 text-lg font-medium">Category</label>
            <div className="relative">
              <select
                id="category"
                className={`w-full p-4 bg-gray-800 text-white rounded-lg border border-gray-700 appearance-none transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent hover:border-teal-700 ${errors.category ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-5 w-5 text-teal-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            {errors.category && <p className="text-red-500 text-sm mt-2">{errors.category}</p>}
          </div>
          
          <div className="mb-6 group">
            <label htmlFor="content" className="block text-white mb-2 text-lg font-medium">Thread Content</label>
            <textarea
              id="content"
              className={`w-full p-4 bg-gray-800 text-white rounded-lg border border-gray-700 resize-none transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent hover:border-teal-700 ${errors.content ? 'border-red-500 ring-1 ring-red-500' : ''}`}
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What would you like to discuss? Be as detailed as possible."
            />
            {errors.content && <p className="text-red-500 text-sm mt-2">{errors.content}</p>}
          </div>

          {/* Image Upload Section */}
          <div className="mb-6">
            <label className="block text-white mb-2 text-lg font-medium">Add Images</label>
            <div className="mt-2 flex flex-col space-y-4">
              <div 
                onClick={triggerFileInput}
                className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-teal-500 transition-colors duration-300"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  multiple
                  accept="image/*"
                  className="hidden"
                />
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="mt-2 text-sm text-gray-400">
                  Click or drag images here to upload
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>

              {/* Upload Success Notification */}
              {uploadSuccess && (
                <div className="bg-gray-800 border-l-4 border-teal-500 p-4 rounded animate-fade-in">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-teal-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-white">
                        Images uploaded successfully!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Image Previews */}
              {previews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="rounded-lg overflow-hidden bg-gray-800 aspect-square relative">
                        <img 
                          src={preview} 
                          alt={`Preview ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="p-1 bg-red-600 rounded-full hover:bg-red-700 transition-colors duration-300"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="mb-8">
            <label htmlFor="tags" className="block text-white mb-2 text-lg font-medium">Tags (max 5)</label>
            <div className="flex">
              <input
                type="text"
                id="tags"
                className="flex-1 p-4 bg-gray-800 text-white rounded-l-lg border border-r-0 border-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent hover:border-teal-700"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Add tags to help categorize your thread"
                disabled={tags.length >= 5}
              />
              <button
                type="button"
                className="px-6 py-4 bg-teal-600 text-white rounded-r-lg hover:bg-teal-700 transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                onClick={handleAddTag}
                disabled={!tagInput.trim() || tags.length >= 5}
              >
                Add
              </button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="px-4 py-2 bg-gray-800 text-teal-400 rounded-full flex items-center border border-gray-700 hover:border-teal-500 transition-colors duration-300"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-gray-400 hover:text-red-500 transition-colors duration-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
            <p className="text-gray-400 text-sm mt-2">
              {5 - tags.length} tag{5 - tags.length !== 1 ? 's' : ''} remaining
            </p>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 border border-gray-700 hover:border-gray-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={() => router.back()}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-300 shadow-lg hover:shadow-teal-700/30 disabled:bg-gray-700 disabled:cursor-not-allowed disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating...</span>
                </div>
              ) : 'Create Thread'}
            </button>
          </div>
        </form>
      </div>

      {/* Add some custom styles for animations */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default NewThreadPage;