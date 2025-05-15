import supabase from '@/config/supabse';

interface ProfileUpdateData {
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}

/**
 * Updates a user's profile in Supabase
 * @param userId - The user's ID
 * @param profileData - Object containing profile data to update (first_name, last_name, avatar_url)
 * @returns Promise with success/error information
 */
export const updateProfile = async (userId: string, profileData: ProfileUpdateData) => {
  try {
    // Handle avatar upload if it's a file object or a data URL (from URL.createObjectURL)
    let avatarUrl = profileData.avatar_url;
    
    // Check if the avatar URL is a blob URL (created by URL.createObjectURL)
    if (avatarUrl && avatarUrl.startsWith('blob:')) {
      try {
        // Convert blob URL to file
        const response = await fetch(avatarUrl);
        const blob = await response.blob();
        const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
        
        // Generate a unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `avatars/${fileName}`;
        
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('profiles')
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;
        
        // Get the public URL
        const { data: publicUrlData } = supabase.storage
          .from('profiles')
          .getPublicUrl(filePath);
          
        // Update the avatar URL to the storage URL
        avatarUrl = publicUrlData.publicUrl;
      } catch (error) {
        console.error('Failed to upload avatar:', error);
        throw new Error('Failed to upload avatar image');
      }
    }
    
    // Update the profile in the database
    const updateData: ProfileUpdateData = {};
    if (profileData.first_name !== undefined) updateData.first_name = profileData.first_name;
    if (profileData.last_name !== undefined) updateData.last_name = profileData.last_name;
    if (avatarUrl) updateData.avatar_url = avatarUrl;
    
    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);
    
    if (error) throw error;
    
    return {
      success: true,
      message: 'Profile updated successfully',
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Failed to update profile',
    };
  }
};