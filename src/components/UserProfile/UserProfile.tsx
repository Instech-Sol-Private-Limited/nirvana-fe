'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { formatRelativeDate } from '@/utils';
import { useAuth } from '@/context/AuthProvider';
import { FaEdit, FaRegCalendarAlt, FaRegUser, FaCamera } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { uploadToSupabase } from '@/utils/supabsethreadbucket';
import { updateUserProfile } from '@/utils/profiles';

import UserNameWithBadges from '../common/UsernameWithBadge';
export default function UserProfile() {
  const params = useParams();
  const { userData, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    avatar_url: '',
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  useEffect(() => {
    if (userData) {
      setIsCurrentUser(true);
      setProfileData(userData);
      setFormData({
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        email: userData.email || '',
        avatar_url: userData.avatar_url || '',
      });

      if (userData.avatar_url) {
        setAvatarPreview(userData.avatar_url);
      }

      setIsLoading(false);
    }
  }, [userData]);

  const handleEditProfile = () => {
    setIsEditing(true);

    if (profileData.avatar_url) {
      setAvatarPreview(profileData.avatar_url);
    } else {
      setAvatarPreview('');
    }
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsEditing(false);

    if (profileData) {
      setFormData({
        first_name: profileData.first_name || '',
        last_name: profileData.last_name || '',
        email: profileData.email || '',
        avatar_url: profileData.avatar_url || '',
      });

      if (profileData.avatar_url) {
        setAvatarPreview(profileData.avatar_url);
      } else {
        setAvatarPreview('');
      }
    }


    setAvatarFile(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => {
    if (isCurrentUser && isEditing) {

      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files[0]) {
          const file = target.files[0];
          setAvatarFile(file);


          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              setAvatarPreview(e.target.result as string);
            }
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let finalAvatarUrl = formData.avatar_url;


      if (avatarFile) {
        setIsUploadingAvatar(true);
        try {
          const uploadedUrl = await uploadToSupabase(avatarFile);
          if (uploadedUrl) {
            finalAvatarUrl = uploadedUrl;
          } else {
            toast.error('Failed to upload profile image');
            setIsSubmitting(false);
            setIsUploadingAvatar(false);
            return;
          }
        } catch (error) {
          console.error('Error uploading avatar:', error);
          toast.error('Failed to upload profile image');
          setIsSubmitting(false);
          setIsUploadingAvatar(false);
          return;
        } finally {
          setIsUploadingAvatar(false);
        }
      }


      const updateData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        avatar_url: finalAvatarUrl,
      };

      const response = await updateUserProfile(updateData);

      if (response.success) {
        setProfileData({
          ...profileData,
          ...updateData,
        });
        toast.success('Profile updated successfully');
        setIsEditing(false);
      } else {
        toast.error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Something went wrong while updating your profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !profileData) {
    return (
      <div className="w-full h-full flex items-center justify-center py-20">
        <div className="animate-pulse space-y-4">
          <div className="h-40 w-40 bg-gray-700 rounded-full mx-auto"></div>
          <div className="h-8 bg-gray-700 rounded w-48 mx-auto"></div>
          <div className="h-4 bg-gray-700 rounded w-64 mx-auto"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-4/5 mx-auto px-4 sm:px-0 py-6">
      <div className="bg-gray-800 rounded-xl border border-gray-700 mb-8">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8">

            <div className="md:w-1/4">
              <div className="w-full flex flex-col items-center">

                <div
                  className={`w-48 h-48 rounded-full overflow-hidden bg-gray-700 mb-4 relative ${isCurrentUser && isEditing ? 'cursor-pointer group' : ''}`}
                  onClick={isCurrentUser && isEditing ? handleAvatarClick : undefined}
                >
                  {isUploadingAvatar ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                    </div>
                  ) : avatarPreview ? (
                    <>
                      <Image
                        src={avatarPreview}
                        alt={profileData.first_name || "User"}
                        width={192}
                        height={192}
                        className="object-cover w-full h-full"
                      />
                      {isCurrentUser && isEditing && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                          <FaCamera className="text-white h-12 w-12" />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 relative">
                      <FaRegUser className="w-24 h-24" />
                      {isCurrentUser && isEditing && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                          <FaCamera className="text-white h-12 w-12" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {isCurrentUser && isEditing && (
                  <p className="text-sm text-gray-400 text-center mb-4">
                    Click on the avatar to change your profile picture
                  </p>
                )}

                <p className="text-gray-400 text-sm mb-4 text-center">
                  @{profileData.username || profileData.first_name?.toLowerCase()}
                </p>

                <div className="text-gray-400 text-sm flex items-center gap-1 mb-4">
                  <FaRegCalendarAlt className="h-4 w-4" />
                  <span title={profileData.created_at}>
                    Joined {formatRelativeDate(profileData.created_at)}
                  </span>
                </div>

                {isCurrentUser && !isEditing && (
                  <button
                    onClick={handleEditProfile}
                    className="flex items-center justify-center w-full gap-2 py-2 px-4 border border-gray-600 rounded-lg text-gray-300 hover:text-white hover:border-gray-500 transition-colors"
                  >
                    <FaEdit className="h-4 w-4" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            <div className="md:w-3/4">
              {isEditing ? (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Edit Profile</h2>
                  <form onSubmit={handleSubmit}>
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
                        disabled={isSubmitting || isUploadingAvatar}
                      />
                    </div>


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
                        disabled={isSubmitting || isUploadingAvatar}
                      />
                    </div>

                    {/* Email - Read-only */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="email">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-400 text-sm cursor-not-allowed"
                        disabled
                      />
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:text-white hover:border-gray-500 transition-colors"
                        disabled={isSubmitting || isUploadingAvatar}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors disabled:bg-teal-800 disabled:cursor-not-allowed"
                        disabled={isSubmitting || isUploadingAvatar}
                      >
                        {isSubmitting || isUploadingAvatar ?
                          (isUploadingAvatar ? "Uploading..." : "Saving...") :
                          "Save Changes"}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Profile Information</h2>

                  <div className="mb-6">
                    <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                      <span className="">
                        <UserNameWithBadges
                          userId={profileData.id}
                          username={`${profileData.first_name} ${profileData.last_name}`}
                          className="text-blue-500 font-medium"
                        />
                      </span>
                    </h1>
                    <h3 className="text-lg font-medium text-white mb-2">Email</h3>
                    <p className="text-gray-300">{profileData.email}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}