import React, { useRef, useState } from 'react';
import { FiUploadCloud, FiX } from 'react-icons/fi';
import { FormikTouched } from 'formik';
import Image from 'next/image';

interface ImageUploadProps {
    name: string;
    label?: string;
    required?: boolean;
    min?: number;
    max?: number;
    accept?: string;
    multiple?: boolean;
    value?: File[];
    previews?: string[];
    onChange: (files: File[], previews: string[]) => void;
    onBlur?: (e: React.FocusEvent) => void;
    disabled?: boolean;
    isComment?: boolean;
    className?: string;
    dropzoneText?: string;
    dropzoneSubText?: string;
    error?: string | undefined | any;
    touched?: boolean | FormikTouched<File>[] | undefined;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    name,
    label = 'Upload Images',
    required = false,
    min = 1,
    max = 5,
    accept = 'image/*',
    multiple = true,
    value = [],
    previews = [],
    isComment,
    onChange,
    onBlur,
    disabled = false,
    className = '',
    dropzoneText = 'Click or drag images here to upload',
    dropzoneSubText = 'PNG, JPG, GIF up to 5MB',
    error,
    touched = false,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const newFiles = Array.from(files);
        const validFiles = newFiles.filter(file => file.type.match(accept));

        if (value.length + validFiles.length > max) {
            return;
        }

        const newPreviews: string[] = [];

        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    newPreviews.push(reader.result);
                    if (newPreviews.length === validFiles.length) {
                        onChange([...value, ...validFiles], [...previews, ...newPreviews]);
                    }
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFileChange(e.target.files);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileChange(e.dataTransfer.files);
    };

    const removeImage = (index: number) => {
        const newFiles = value.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);
        onChange(newFiles, newPreviews);
    };

    const triggerFileInput = () => {
        if (fileInputRef.current && !disabled) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className={`mb-6 ${className}`}>
            {label && (
                <label className="block text-white mb-2 text-lg font-medium">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                    {min && max && (
                        <span className="text-gray-400 text-sm ml-2">
                            ({min}-{max} {max === 1 ? 'image' : 'images'})
                        </span>
                    )}
                </label>
            )}

            {previews.length < max && (
                <div
                    onClick={triggerFileInput}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-300 ${isDragging
                        ? 'border-teal-500 bg-gray-800'
                        : error && touched && previews.length === 0
                            ? 'border-red-500'
                            : 'border-gray-700 hover:border-teal-500'
                        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleInputChange}
                        multiple={multiple}
                        accept={accept}
                        className="hidden"
                        disabled={disabled}
                        name={name}
                        onBlur={onBlur}
                    />
                    <FiUploadCloud
                        className={`mx-auto h-12 w-12 ${isDragging ? 'text-teal-500' : 'text-gray-400'
                            }`}
                    />
                    <p
                        className={`mt-2 text-sm ${isDragging ? 'text-teal-500' : 'text-gray-400'
                            }`}
                    >
                        {dropzoneText}
                    </p>
                    <p
                        className={`text-xs ${isDragging ? 'text-teal-400' : 'text-gray-500'
                            }`}
                    >
                        {dropzoneSubText}
                    </p>
                </div>
            )}

            {/* Error Display */}
            {touched && error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
            )}

            {previews?.length > 0 && (
                <div className="w-full flex items-center flex-wrap gap-4 mt-4">
                    {previews.map((preview, index) => (
                        <div key={index} className={`group h-[90px] aspect-square rounded-lg overflow-hidden bg-gray-800  relative`}>
                            <Image
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                fill
                                className="!relative object-cover"
                            />
                            {!disabled && (
                                <div className="absolute inset-0 bg-black/70 bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="p-1 bg-red-600 rounded-full cursor-pointer hover:bg-red-700 transition-colors duration-300"
                                        disabled={disabled}
                                    >
                                        <FiX className="h-5 w-5 text-white" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {max && (
                <p className="text-gray-400 text-sm mt-2">
                    {previews.length} of {max} images uploaded
                    {min > previews.length &&
                        required &&
                        ` (${min - previews.length} more required)`}
                </p>
            )}

            {/* Error Display */}
            {touched && error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
        </div>
    );
};

export default ImageUpload;