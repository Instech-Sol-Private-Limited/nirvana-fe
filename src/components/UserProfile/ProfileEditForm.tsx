import { useState } from 'react';
import Image from 'next/image';
import { FaRegUser, FaCamera, FaTimesCircle } from 'react-icons/fa';
import PrimaryButton from '../addons/PrimaryButton';
import { updateProfile } from '@/utils/UpdateProfile';

interface ProfileEditFormProps {
  profileData: any;
  onUpdate: (data: any) => void;
  onCancel: () => void;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ 
  profileData, 
  onUpdate, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    first_name: profileData.first_name || '',
    last_name: profileData.last_name || '',
    avatar_url: profileData.avatar_url || '',
    cover_url: profileData.cover_url || '',
  });
  
  const [avatarPreview, setAvatarPreview] = useState(profileData.avatar_url || '');
  const [coverPreview, setCoverPreview] = useState(profileData.cover_url || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a blob URL for preview
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
      setFormData(prev => ({ ...prev, avatar_url: url }));
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a blob URL for preview
      const url = URL.createObjectURL(file);
      setCoverPreview(url);
      setFormData(prev => ({ ...prev, cover_url: url }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Send update to Supabase
      const result = await updateProfile(profileData.id, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        avatar_url: formData.avatar_url !== profileData.avatar_url ? formData.avatar_url : undefined,
      });
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      // If successful, update local state and call parent callback
      onUpdate(formData);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setError(error.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 mb-8 p-6">
      <h2 className="text-xl font-bold text-white mb-6">Edit Profile</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-200">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">Cover Photo</label>
          <div className="relative w-full h-32 bg-gray-700 rounded-xl overflow-hidden">
            {coverPreview && (
              <Image 
                src={coverPreview} 
                alt="Cover" 
                fill 
                className="object-cover" 
              />
            )}
            <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer hover:bg-opacity-60 transition-opacity">
              <div className="flex flex-col items-center">
                <FaCamera className="w-6 h-6 text-white mb-2" />
                <span className="text-white text-sm">Change Cover Photo</span>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleCoverChange} 
                className="hidden" 
              />
            </label>
          </div>
        </div>
        
        {/* Avatar */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">Profile Picture</label>
          <div className="relative w-24 h-24 bg-gray-700 rounded-full overflow-hidden mx-auto">
            {avatarPreview ? (
              <Image 
                src={avatarPreview} 
                alt="Avatar" 
                fill 
                className="object-cover" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <FaRegUser className="w-12 h-12" />
              </div>
            )}
            <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer hover:bg-opacity-60 transition-opacity">
              <FaCamera className="w-6 h-6 text-white" />
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleAvatarChange} 
                className="hidden" 
              />
            </label>
          </div>
        </div>
        
        {/* First Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="first_name">
            First Name
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            required
          />
        </div>
        
        {/* Last Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="last_name">
            Last Name
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:text-white hover:border-gray-500 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <PrimaryButton
            text={isSubmitting ? "Saving..." : "Save Changes"}
            type="submit"
            className="px-4 py-2"
            disabled={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
};

export default ProfileEditForm;