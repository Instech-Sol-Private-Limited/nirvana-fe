import React, { useEffect, useRef, useState } from 'react';
import ModalWrapper from '@/components/addons/WrapperModal';
import { useRouter } from 'next/navigation';
import { categories } from '@/constants';
import TextEditor from '../addons/TextEditor';
import PrimaryButton from '../addons/PrimaryButton';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ImageUpload from '@/components/addons/ImageUpload';
import {
    FaChevronDown,
    FaTimes,
    FaTag,
    FaPlus
} from 'react-icons/fa';
import { getAllCategories } from '@/utils/categories';
import { Category } from '@/types';
import { uploadToSupabase } from '@/utils/supabsebucket';

interface AddThreadProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const AddThreadModal: React.FC<AddThreadProps> = ({ isOpen, setIsOpen }) => {
    const [categoriesOption, setCategoriesOption] = useState([])
    const router = useRouter();

    const validationSchema = Yup.object({
        title: Yup.string()
            .required('Title is required')
            .min(10, 'Title must be at least 10 characters'),
        content: Yup.string()
            .required('Content is required')
            .min(30, 'Content must be at least 30 characters'),
        category: Yup.string().required('Please select a category'),
        tags: Yup.array().max(5, 'Maximum 5 tags allowed'),
        images: Yup.array()
            .min(1, 'At least one image is required')
            .max(5, 'Maximum 5 images allowed')
    });

    const formik = useFormik({
        initialValues: {
            title: '',
            content: '',
            category: '',
            tags: [] as string[],
            tagInput: '',
            images: [] as File[],
            previews: [] as string[]
        },
        validationSchema,
        onSubmit: async (values) => {
            console.log(values)
            const getFileUrl = await uploadToSupabase(values.images[0])
            console.log(getFileUrl)
            // router.push(`/threads?created=true`);
        }
    });

    const handleAddTag = () => {
        const trimmedTag = formik.values.tagInput.trim();
        if (trimmedTag && !formik.values.tags.includes(trimmedTag) && formik.values.tags.length < 5) {
            formik.setFieldValue('tags', [...formik.values.tags, trimmedTag]);
            formik.setFieldValue('tagInput', '');
        }
    };

    const handleTagKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    const removeTag = (tagToRemove: string) => {
        formik.setFieldValue(
            'tags',
            formik.values.tags.filter(tag => tag !== tagToRemove)
        );
    };

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await getAllCategories();
            if (response.success) {
                const updatedData = response.data.map((item: Category) => {
                    return {
                        value: item.id,
                        label: item.category_name
                    }
                })
                setCategoriesOption(updatedData);
            }
        }

        fetchCategories()
    }, [])

    return (
        <ModalWrapper
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            width="max-w-[1080px] w-11/12 flex flex-col"
            height="h-[90vh]"
        >
            <div className='w-full p-12'>
                <h1 className="text-2xl font-bold text-white mb-3 border-l-4 border-teal-500 pl-4">
                    Create New Thread
                </h1>

                <form onSubmit={formik.handleSubmit} className="py-8">
                    {/* Title Field */}
                    <div className="mb-6 group">
                        <label htmlFor="title" className="block text-white mb-2 md:text-sm text-xs font-medium">
                            Thread Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            className={`w-full p-3 bg-gray-800 md:text-base text-sm text-white rounded-lg border border-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent hover:border-teal-700 ${formik.touched.title && formik.errors.title ? 'border-red-500 ring-1 ring-red-500' : ''
                                }`}
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter a descriptive title"
                        />
                        {formik.touched.title && formik.errors.title && (
                            <p className="text-red-500 text-sm mt-2">{formik.errors.title}</p>
                        )}
                    </div>

                    {/* Category Field */}
                    <div className="mb-6 group">
                        <label htmlFor="category" className="block text-white mb-2 md:text-sm text-xs font-medium">
                            Category
                        </label>
                        <div className="relative">
                            <select
                                id="category"
                                name="category"
                                className={`w-full p-3 bg-gray-800 text-white rounded-lg md:text-base text-sm border border-gray-700 appearance-none transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent hover:border-teal-700 ${formik.touched.category && formik.errors.category ? 'border-red-500 ring-1 ring-red-500' : ''
                                    }`}
                                value={formik.values.category}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="">Select a category</option>
                                {categoriesOption.map((item: any) => (
                                    <option key={item.value} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <FaChevronDown className="h-5 w-5 text-teal-500" />
                            </div>
                        </div>
                        {formik.touched.category && formik.errors.category && (
                            <p className="text-red-500 text-sm mt-2">{formik.errors.category}</p>
                        )}
                    </div>

                    {/* Content Field */}
                    <div className="mb-6 group">
                        <label htmlFor="content" className="block text-white mb-2 md:text-sm text-xs font-medium">
                            Thread Content
                        </label>
                        <TextEditor
                            value={formik.values.content}
                            onChange={(value) => formik.setFieldValue('content', value)}
                            error={formik.touched.content && formik.errors.content}
                        />
                        {formik.touched.content && formik.errors.content && (
                            <p className="text-red-500 text-sm mt-2">{formik.errors.content}</p>
                        )}
                    </div>

                    {/* Image Upload Section */}
                    <div className="mb-6">
                        <ImageUpload
                            name="images"
                            label="Product Images"
                            required={true}
                            min={1}
                            max={5}
                            value={formik.values.images}
                            previews={formik.values.previews}
                            onChange={(files, previews) => {
                                formik.setFieldValue('images', files);
                                formik.setFieldValue('previews', previews);
                            }}
                            onBlur={formik.handleBlur}
                            error={formik.errors.images}
                            touched={formik.touched.images}
                        />
                    </div>

                    {/* Tags Section */}
                    <div className="mb-8">
                        <label htmlFor="tags" className="block text-white mb-2 md:text-sm text-xs font-medium">
                            Tags (max 5)
                        </label>
                        <div className="flex border border-transparent rounded-lg overflow-hidden hover:border-teal-700">
                            <input
                                type="text"
                                id="tagInput"
                                name="tagInput"
                                className="flex-1 p-3 bg-gray-800 md:text-base text-sm text-white border-none border-gray-700 transition-all duration-300 focus:outline-none"
                                value={formik.values.tagInput}
                                onChange={formik.handleChange}
                                onKeyDown={handleTagKeyDown}
                                placeholder="Add tags to help categorize your thread"
                                disabled={formik.values.tags.length >= 5}
                            />
                            <button
                                type="button"
                                className="px-6 py-4 bg-teal-600 text-white rounded-r-lg hover:bg-teal-700 transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                                onClick={handleAddTag}
                                disabled={!formik.values.tagInput.trim() || formik.values.tags.length >= 5}
                            >
                                <FaPlus />
                            </button>
                        </div>

                        {formik.values.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {formik.values.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-4 py-2 bg-gray-800 text-teal-400 rounded-full flex items-center border border-gray-700 hover:border-teal-500 transition-colors duration-300"
                                    >
                                        <FaTag className="mr-2" />
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="ml-2 text-gray-400 hover:text-red-500 transition-colors duration-300"
                                        >
                                            <FaTimes className="h-3 w-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                        <p className="text-gray-400 md:text-sm text-xs mt-2">
                            {5 - formik.values.tags.length} tag{5 - formik.values.tags.length !== 1 ? 's' : ''} remaining
                        </p>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 border border-gray-700 hover:border-gray-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </button>
                        <PrimaryButton
                            type="submit"
                            text={'Create Thread'}
                            disabled={formik.isSubmitting || !formik.isValid}
                            center={false}
                        />
                    </div>
                </form>
            </div>
        </ModalWrapper>
    );
};

export default AddThreadModal;