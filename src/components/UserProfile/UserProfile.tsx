// 'use client';

// import { useState, useEffect } from 'react';
// import Image from 'next/image';
// import { formatRelativeDate } from '@/utils';
// import { useAuth } from '@/context/AuthProvider';
// import { FaEdit, FaRegCalendarAlt, FaRegUser, FaCamera } from 'react-icons/fa';
// import { toast } from 'react-toastify';
// import { uploadToSupabase } from '@/utils/supabsethreadbucket';
// import { updateUserProfile } from '@/utils/profiles';
// import UserNameWithBadges from '../common/UsernameWithBadge';

// export default function UserProfile() {
//   const { userData, loading } = useAuth();
//   const [isEditing, setIsEditing] = useState(false);
//   const [isCurrentUser, setIsCurrentUser] = useState(false);
//   const [profileData, setProfileData] = useState<any>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [formData, setFormData] = useState({
//     first_name: '',
//     last_name: '',
//     email: '',
//     avatar_url: '',
//   });
//   const [avatarFile, setAvatarFile] = useState<File | null>(null);
//   const [avatarPreview, setAvatarPreview] = useState<string>('');
//   const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

//   const handleEditProfile = () => {
//     setIsEditing(true);

//     if (profileData.avatar_url) {
//       setAvatarPreview(profileData.avatar_url);
//     } else {
//       setAvatarPreview('');
//     }
//   };

//   const handleCancelEdit = (e: React.MouseEvent) => {
//     e.preventDefault();
//     setIsEditing(false);

//     if (profileData) {
//       setFormData({
//         first_name: profileData.first_name || '',
//         last_name: profileData.last_name || '',
//         email: profileData.email || '',
//         avatar_url: profileData.avatar_url || '',
//       });

//       if (profileData.avatar_url) {
//         setAvatarPreview(profileData.avatar_url);
//       } else {
//         setAvatarPreview('');
//       }
//     }


//     setAvatarFile(null);
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleAvatarClick = () => {
//     if (isCurrentUser && isEditing) {

//       const input = document.createElement('input');
//       input.type = 'file';
//       input.accept = 'image/*';
//       input.onchange = (e: Event) => {
//         const target = e.target as HTMLInputElement;
//         if (target.files && target.files[0]) {
//           const file = target.files[0];
//           setAvatarFile(file);


//           const reader = new FileReader();
//           reader.onload = (e) => {
//             if (e.target?.result) {
//               setAvatarPreview(e.target.result as string);
//             }
//           };
//           reader.readAsDataURL(file);
//         }
//       };
//       input.click();
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       let finalAvatarUrl = formData.avatar_url;


//       if (avatarFile) {
//         setIsUploadingAvatar(true);
//         try {
//           const uploadedUrl = await uploadToSupabase(avatarFile);
//           if (uploadedUrl) {
//             finalAvatarUrl = uploadedUrl;
//           } else {
//             toast.error('Failed to upload profile image');
//             setIsSubmitting(false);
//             setIsUploadingAvatar(false);
//             return;
//           }
//         } catch (error) {
//           console.error('Error uploading avatar:', error);
//           toast.error('Failed to upload profile image');
//           setIsSubmitting(false);
//           setIsUploadingAvatar(false);
//           return;
//         } finally {
//           setIsUploadingAvatar(false);
//         }
//       }


//       const updateData = {
//         first_name: formData.first_name,
//         last_name: formData.last_name,
//         avatar_url: finalAvatarUrl,
//       };

//       const response = await updateUserProfile(updateData);

//       if (response.success) {
//         setProfileData({
//           ...profileData,
//           ...updateData,
//         });
//         toast.success('Profile updated successfully');
//         setIsEditing(false);
//       } else {
//         toast.error(response.message || 'Failed to update profile');
//       }
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       toast.error('Something went wrong while updating your profile');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   useEffect(() => {
//     if (userData) {
//       setIsCurrentUser(true);
//       setProfileData(userData);
//       setFormData({
//         first_name: userData.first_name || '',
//         last_name: userData.last_name || '',
//         email: userData.email || '',
//         avatar_url: userData.avatar_url || '',
//       });

//       if (userData.avatar_url) {
//         setAvatarPreview(userData.avatar_url);
//       }
//     }
//   }, [userData]);

//   if (loading || !profileData) {
//     return (
//       <div className="w-4/5 mx-auto bg-gray-800 rounded-xl border border-gray-700 mb-6 md:p-10 p-6 animate-pulse flex gap-24 md:flex-row flex-col">
//         <div className='space-y-3'>
//           <div className="h-[192] w-[192] bg-gray-700 rounded-full" />
//           <div className="h-4 bg-gray-700 rounded mt-5" />
//           <div className="h-4 bg-gray-700 rounded" />
//           <div className="h-8 bg-gray-700 rounded mt-4" />
//         </div>

//         <div className='space-y-4 py-7'>
//           <div className="h-4 bg-gray-700 rounded w-[320px]" />
//           <div className="h-8 bg-gray-700 rounded w-[500px]" />
//           <div className="h-6 bg-gray-700 rounded w-[440px]" />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-4/5 mx-auto px-4 sm:px-0">
//       <div className="bg-gray-800 rounded-xl border border-gray-700 mb-6 p-6">
//         <div className="flex flex-col md:flex-row  gap-8">
//           <div className="md:w-1/4">
//             <div className="w-full flex flex-col items-center">
//               <div
//                 className={`w-48 h-48 rounded-full overflow-hidden bg-gray-700 mb-4 relative ${isCurrentUser && isEditing ? 'cursor-pointer group' : ''}`}
//                 onClick={isCurrentUser && isEditing ? handleAvatarClick : undefined}
//               >
//                 {isUploadingAvatar ? (
//                   <div className="w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
//                     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
//                   </div>
//                 ) : avatarPreview ? (
//                   <>
//                     <Image
//                       src={avatarPreview}
//                       alt={profileData.first_name || "User"}
//                       width={192}
//                       height={192}
//                       className="object-cover w-full h-full"
//                     />
//                     {isCurrentUser && isEditing && (
//                       <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
//                         <FaCamera className="text-white h-12 w-12" />
//                       </div>
//                     )}
//                   </>
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center text-gray-500 relative">
//                     <FaRegUser className="w-24 h-24" />
//                     {isCurrentUser && isEditing && (
//                       <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
//                         <FaCamera className="text-white h-12 w-12" />
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>

//               {isCurrentUser && isEditing && (
//                 <p className="text-sm text-gray-400 text-center mb-4">
//                   Click on the avatar to change your profile picture
//                 </p>
//               )}

//               <p className="text-gray-400 text-sm mb-4 text-center">
//                 @{profileData.username || profileData.first_name?.toLowerCase()}
//               </p>

//               <div className="text-gray-400 text-sm flex items-center gap-1 mb-4">
//                 <FaRegCalendarAlt className="h-4 w-4" />
//                 <span title={profileData.created_at}>
//                   Joined {formatRelativeDate(profileData.created_at)}
//                 </span>
//               </div>

//               {isCurrentUser && !isEditing && (
//                 <button
//                   onClick={handleEditProfile}
//                   className="flex items-center justify-center w-full gap-2 py-2 px-4 border border-gray-600 rounded-lg text-gray-300 hover:text-white hover:border-gray-500 transition-colors"
//                 >
//                   <FaEdit className="h-4 w-4" />
//                   Edit Profile
//                 </button>
//               )}
//             </div>
//           </div>

//           <div className="md:w-3/4 py-7">
//             {isEditing ? (
//               <div>
//                 <h2 className="text-xl font-bold text-white mb-6">Edit Profile</h2>
//                 <form onSubmit={handleSubmit}>
//                   {/* First Name */}
//                   <div className="mb-4">
//                     <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="first_name">
//                       First Name
//                     </label>
//                     <input
//                       type="text"
//                       id="first_name"
//                       name="first_name"
//                       value={formData.first_name}
//                       onChange={handleChange}
//                       className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                       required
//                       disabled={isSubmitting || isUploadingAvatar}
//                     />
//                   </div>


//                   <div className="mb-4">
//                     <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="last_name">
//                       Last Name
//                     </label>
//                     <input
//                       type="text"
//                       id="last_name"
//                       name="last_name"
//                       value={formData.last_name}
//                       onChange={handleChange}
//                       className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                       disabled={isSubmitting || isUploadingAvatar}
//                     />
//                   </div>

//                   {/* Email - Read-only */}
//                   <div className="mb-4">
//                     <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="email">
//                       Email
//                     </label>
//                     <input
//                       type="email"
//                       id="email"
//                       name="email"
//                       value={formData.email}
//                       className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-400 text-sm cursor-not-allowed"
//                       disabled
//                     />
//                   </div>

//                   {/* Form Actions */}
//                   <div className="flex justify-end space-x-3 mt-6">
//                     <button
//                       type="button"
//                       onClick={handleCancelEdit}
//                       className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:text-white hover:border-gray-500 transition-colors"
//                       disabled={isSubmitting || isUploadingAvatar}
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors disabled:bg-teal-800 disabled:cursor-not-allowed"
//                       disabled={isSubmitting || isUploadingAvatar}
//                     >
//                       {isSubmitting || isUploadingAvatar ?
//                         (isUploadingAvatar ? "Uploading..." : "Saving...") :
//                         "Save Changes"}
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             ) : (
//               <div>
//                 <h2 className="lg:text-xl md:text-lg text-base text-white/60 mb-6">Profile Information</h2>

//                 <div className="mb-6">
//                   <h1 className="lg:text-4xl md:text-3xl text-2xl font-semibold text-white mb-2 flex items-center gap-3">
//                     <UserNameWithBadges
//                       userId={profileData.id}
//                       username={`${profileData.first_name} ${profileData.last_name}`}
//                       className="text-blue-500 font-semibold"
//                     />
//                   </h1>
//                   <p className="text-gray-300">{profileData.email}</p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { formatRelativeDate } from '@/utils';
import { useAuth } from '@/context/AuthProvider';
import { FaEdit, FaRegCalendarAlt, FaRegUser, FaCamera, FaFire, FaTrophy, FaHistory, FaChevronRight } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { uploadToSupabase } from '@/utils/supabsethreadbucket';
import { updateUserProfile } from '@/utils/profiles';
import { getUserBadges, UserBadge } from '@/utils/badge';
import { getUserSoulpoints, getSoulpointsHistory, SoulpointsData, SoulpointsHistory } from '@/utils/soulpoints';
import Badge from '../common/Badge';

const SOUL_TITLE_NAMES = [
  'Wanderer', 'Light Seeker', 'Insight Whisperer', 'Pathfinder', 
  'Soul Contributor', 'Harmonic Voice', 'Wisdom Weaver', 
  'Echo Guide', 'Anamfriend', 'Elder Soul'
];

export default function UserProfile() {
  const { userData, loading } = useAuth();
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
  
  // New state for badges and soulpoints
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [soulpoints, setSoulpoints] = useState<SoulpointsData | null>(null);
  const [history, setHistory] = useState<SoulpointsHistory[]>([]);
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [showAllBadges, setShowAllBadges] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);

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

  // Load user badges and soulpoints data
  async function loadUserStats() {
    if (!profileData?.id) return;

    try {
      setLoadingStats(true);
      
      const [badgesResponse, soulpointsResponse, historyResponse] = await Promise.all([
        getUserBadges(profileData.id),
        getUserSoulpoints(profileData.id),
        getSoulpointsHistory(profileData.id, 10)
      ]);

      if (badgesResponse.success) {
        setBadges(badgesResponse.data.badges);
      }

      if (soulpointsResponse.success && soulpointsResponse.data) {
        setSoulpoints(soulpointsResponse.data);
      }

      if (historyResponse.success) {
        setHistory(historyResponse.data);
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    } finally {
      setLoadingStats(false);
    }
  }

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
    }
  }, [userData]);

  useEffect(() => {
    if (profileData?.id) {
      loadUserStats();
    }
  }, [profileData?.id]);

  const soulTitleBadges = badges.filter(badge => SOUL_TITLE_NAMES.includes(badge.name));
  const otherBadges = badges.filter(badge => !SOUL_TITLE_NAMES.includes(badge.name));
  const displayBadges = showAllBadges ? otherBadges : otherBadges.slice(0, 6);

  const getProgressToNextLevel = () => {
    if (!soulpoints) return 0;
    
    const currentLevelMin = Math.floor((soulpoints.level - 1) / 10) * 500 + ((soulpoints.level - 1) % 10) * 50;
    const nextLevelMin = currentLevelMin + 50;
    const progress = ((soulpoints.points - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100;
    
    return Math.min(progress, 100);
  };

  if (loading || !profileData) {
    return (
      <div className="w-4/5 mx-auto bg-gray-800 rounded-xl border border-gray-700 mb-6 md:p-10 p-6 animate-pulse flex gap-24 md:flex-row flex-col">
        <div className='space-y-3'>
          <div className="h-[192] w-[192] bg-gray-700 rounded-full" />
          <div className="h-4 bg-gray-700 rounded mt-5" />
          <div className="h-4 bg-gray-700 rounded" />
          <div className="h-8 bg-gray-700 rounded mt-4" />
        </div>

        <div className='space-y-4 py-7'>
          <div className="h-4 bg-gray-700 rounded w-[320px]" />
          <div className="h-8 bg-gray-700 rounded w-[500px]" />
          <div className="h-6 bg-gray-700 rounded w-[440px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-4/5 mx-auto px-4 sm:px-0">
      <div className="bg-gray-800 rounded-xl border border-gray-700 mb-6 p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Avatar and Basic Info */}
          <div className="lg:w-1/3">
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

              {/* Soulpoints Display */}
              {soulpoints && !loadingStats && (
                <div className="flex flex-col gap-2 w-full mb-4">
                  <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full border border-purple-500/30">
                    <FaFire className="text-orange-400 text-sm" />
                    <span className="text-sm font-semibold text-purple-200">
                      {soulpoints.points.toLocaleString()} SP
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-full border border-yellow-500/30">
                    <FaTrophy className="text-yellow-400 text-sm" />
                    <span className="text-sm font-semibold text-yellow-200">
                      Level {soulpoints.level}
                    </span>
                  </div>
                </div>
              )}

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

          {/* Right Column - Profile Info and Stats */}
          <div className="lg:w-2/3">
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
              <div className="space-y-6">
                <div>
                  <h2 className="lg:text-xl md:text-lg text-base text-white/60 mb-4">Profile Information</h2>
                  <h1 className="lg:text-4xl md:text-3xl text-2xl font-semibold text-white mb-2">
                    {profileData.first_name} {profileData.last_name}
                  </h1>
                  <p className="text-gray-300 mb-4">{profileData.email}</p>
                </div>

                {/* Progress Bar */}
                {soulpoints && soulpoints.level < 100 && !loadingStats && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Progress to Level {soulpoints.level + 1}</span>
                      <span>{Math.round(getProgressToNextLevel())}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${getProgressToNextLevel()}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Soul Title Badge */}
                {soulTitleBadges.length > 0 && !loadingStats && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">Soul Title</h3>
                    <div className="flex flex-wrap gap-2">
                      {soulTitleBadges.map((badge) => (
                        <Badge
                          key={badge.id}
                          name={badge.name}
                          description={badge.description}
                          icon={badge.icon}
                          color={badge.color}
                          background={badge.background}
                          size="md"
                          soulTitle={true}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Achievement Badges */}
                {displayBadges.length > 0 && !loadingStats && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">Achievement Badges</h3>
                      {otherBadges.length > 6 && (
                        <button
                          onClick={() => setShowAllBadges(!showAllBadges)}
                          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          {showAllBadges ? 'Show Less' : `Show All (${otherBadges.length})`}
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {displayBadges.map((badge) => (
                        <Badge
                          key={badge.id}
                          name={badge.name}
                          description={badge.description}
                          icon={badge.icon}
                          color={badge.color}
                          background={badge.background}
                          size="sm"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Activity */}
                {history.length > 0 && !loadingStats && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FaHistory className="text-gray-400 text-sm" />
                      <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                    </div>
                    <div className="space-y-2">
                      {(showFullHistory ? history : history.slice(0, 5)).map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-sm bg-gray-700/50 rounded-lg px-4 py-3">
                          <span className="text-gray-300">{item.description}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-green-400 font-semibold">+{item.points_earned}</span>
                            <span className="text-gray-500">
                              {new Date(item.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                      {!showFullHistory && history.length > 5 && (
                        <button 
                          onClick={() => setShowFullHistory(true)}
                          className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <span>Show more activity</span>
                          <FaChevronRight className="text-xs" />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Loading state for stats */}
                {loadingStats && (
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-700 rounded w-32 animate-pulse" />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-16 bg-gray-700 rounded animate-pulse" />
                      <div className="h-16 bg-gray-700 rounded animate-pulse" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}