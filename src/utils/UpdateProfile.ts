import supabase from '@/config/supabse';

interface ProfileUpdateData {
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}

export const updateProfile = async (userId: string, profileData: ProfileUpdateData) => {
  try {
    let avatarUrl = profileData.avatar_url;

    if (avatarUrl && avatarUrl.startsWith('blob:')) {
      try {
        const response = await fetch(avatarUrl);
        const blob = await response.blob();
        const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('profiles')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('profiles')
          .getPublicUrl(filePath);
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