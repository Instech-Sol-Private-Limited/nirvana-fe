'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { formatRelativeDate } from '@/utils';
import { useAuth } from '@/context/AuthProvider';
import { FaEdit, FaRegCalendarAlt, FaRegUser, FaCamera } from 'react-icons/fa';
import ProfileThreadItem from './ProfileThread';
import { Thread } from '@/types';
import { getThreadsByUserId } from '@/utils/threads';
import { toast } from 'react-toastify';
import { uploadToSupabase } from '@/utils/supabsebucket';

export default function UserProfile() {
  const params = useParams();
  const { userData, loading } = useAuth();
  const [userThreads, setUserThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    avatar_url: '',
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const fileInputRef = useState<HTMLInputElement | null>(null);
  
  useEffect(() => {
    const userId = params?.id as string;
    
    if (userData?.id && (!userId || userId === userData.id)) {
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
    } else if (userId) {
      const fetchUserProfile = async () => {
        try {
          const response = await fetch(`/api/users/${userId}`);
          const data = await response.json();
          
          if (data.success) {
            setProfileData(data.user);
            
            if (data.user.avatar_url) {
              setAvatarPreview(data.user.avatar_url);
            }
          } else {
            console.error("Error fetching user profile:", data.message);
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchUserProfile();
    }
  }, [params, userData]);

  const refreshThreads = async () => {
    if (!profileData) return;
    
    setIsLoading(true);
    try {
      const userId = params?.id as string || userData?.id;
      if (userId) {
        const response = await getThreadsByUserId(userId, 20, 0);
        
        if (response.success && response.data) {
          setUserThreads(response.data.threads);
        } else {
          console.error("Error fetching threads:", response.message);
          setUserThreads([]);
        }
      }
    } catch (error) {
      console.error("Error fetching user threads:", error);
      setUserThreads([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (profileData) {
      refreshThreads();
    }
  }, [profileData]);

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
      
      // Reset avatar preview
      if (profileData.avatar_url) {
        setAvatarPreview(profileData.avatar_url);
      } else {
        setAvatarPreview('');
      }
    }
    
    // Reset avatar file
    setAvatarFile(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => {
    if (isCurrentUser && isEditing) {
      // Create a hidden file input and trigger it
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files[0]) {
          const file = target.files[0];
          setAvatarFile(file);
          
          // Create a preview
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

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    
    setIsUploadingAvatar(true);
    try {
      // Upload avatar to Supabase and get URL
      const avatarUrl = await uploadToSupabase(avatarFile);
      
      if (avatarUrl) {
        // Update form data and preview
        setFormData(prev => ({ ...prev, avatar_url: avatarUrl }));
        setAvatarPreview(avatarUrl);
        
        // Update profile data with new avatar URL
        const updateData = {
          avatar_url: avatarUrl
        };
      
        const response = await fetch('/api/profiles', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        });
        
        const data = await response.json();
        
        if (data.success) {
          setProfileData({
            ...profileData,
            ...updateData
          });
          
          toast.success('Profile picture updated successfully');
        } else {
          toast.error(data.message || 'Failed to update profile picture');
        }
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error('Something went wrong while uploading your profile picture');
    } finally {
      setIsUploadingAvatar(false);
      setAvatarFile(null);
    }
  };

  useEffect(() => {
    // Automatically upload avatar when file is selected
    if (avatarFile) {
      handleAvatarUpload();
    }
  }, [avatarFile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Prepare data for the API
      const updateData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        avatar_url: formData.avatar_url
      };
      
      const response = await fetch('/api/profiles', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setProfileData({
          ...profileData,
          ...updateData
        });
        
        toast.success('Profile updated successfully');
        setIsEditing(false);
      } else {
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error("Error updating profile:", error);
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
                {/* Avatar with overlay for editing */}
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
                
                <h1 className="text-2xl font-bold text-white text-center mb-2">
                  {profileData.first_name} {profileData.last_name}
                </h1>
                
                <p className="text-gray-400 text-sm mb-4 text-center">
                  @{profileData.username || profileData.first_name?.toLowerCase()}
                </p>
                
                <div className="text-gray-400 text-sm flex items-center gap-1 mb-4">
                  <FaRegCalendarAlt className="h-4 w-4" />
                  <span>Joined {formatRelativeDate(profileData.created_at)}</span>
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
                        disabled={isSubmitting}
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
                        disabled={isSubmitting}
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
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors disabled:bg-teal-800 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Profile Information</h2>
                  
                  <div className="flex gap-8 mb-6 border-b border-gray-700 pb-6">
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-white">{userThreads.length}</span>
                      <span className="text-gray-400 text-sm">Threads</span>
                    </div>
                  </div>
                  
                  {isCurrentUser && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-white mb-2">Email</h3>
                      <p className="text-gray-300">{profileData.email}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {!isEditing && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Threads</h2>
          <div className="space-y-4">
            {isLoading ? (
              <>
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className="bg-gray-800 rounded-xl p-6 animate-pulse">
                    <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                  </div>
                ))}
              </>
            ) : userThreads.length === 0 ? (
              <div className="bg-gray-800 rounded-xl p-6 text-center border border-gray-700">
                <p className="text-gray-400">No threads found.</p>
              </div>
            ) : (
              userThreads.map((thread) => (
                <ProfileThreadItem 
                  key={thread.id} 
                  thread={thread} 
                  isCurrentUser={isCurrentUser} 
                  onThreadUpdated={refreshThreads}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}