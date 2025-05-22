// utils/badges.ts
import  supabase from "@/config/supabse";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  background: string;
}

export interface UserBadge extends Badge {
  earned_at: string;
}

/**
 * Fetch all badges for a user
 * @param userId The user ID to fetch badges for
 * @returns An array of badges with their metadata
 */
export async function getUserBadges(userId: string): Promise<{ 
  success: boolean;
  data: { badges: UserBadge[] };
  message?: string;
}> {
  try {
    if (!userId) {
      return {
        success: false,
        data: { badges: [] },
        message: 'User ID is required'
      };
    }
console.log('Fetching badges for user:', userId);
    const { data, error } = await supabase
      .from('user_badges')
      .select(`
        earned_at,
        badges (
          id,
          name,
          description,
          icon,
          color,
          background
        )
      `)
      .eq('user_id', userId);
    if (error) {
      throw error;
    }
    console.log('Raw badges data:', JSON.stringify(data, null, 2));

console.log('Badges data:', data);
    
    const badges: UserBadge[] = (data ?? [])
  .filter(item => !!item.badges) // keep items that have a badges object
  .map(item => ({
    id: item.badges.id,
    name: item.badges.name,
    description: item.badges.description,
    icon: item.badges.icon,
    color: item.badges.color,
    background: item.badges.background,
    earned_at: item.earned_at
  }));

    return {
      success: true,
      data: { badges }
    };
  } catch (error: any) {
    console.error('Error fetching user badges:', error);
    return {
      success: false,
      data: { badges: [] },
      message: error.message || 'Failed to fetch badges'
    };
  }
}

/**
 * Check if a user qualifies for the New Member badge
 * This function would typically be called during profile loading
 * @param userId The user ID to check
 * @returns Boolean indicating if the user qualifies
 */
export async function checkNewMemberBadge(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('created_at')
      .eq('id', userId)
      .single();

    if (error) throw error;

    // Check if user was created in the last 3 days
    const createdAt = new Date(data.created_at);
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    return createdAt > threeDaysAgo;
  } catch (error) {
    console.error('Error checking for new member badge:', error);
    return false;
  }
}


export async function assignBadgeToUser(userId: string, badgeName: string): Promise<{
  success: boolean;
  message?: string;
}> {
  try {
   
    const { data: badgeData, error: badgeError } = await supabase
      .from('badges')
      .select('id')
      .eq('name', badgeName)
      .single();

    if (badgeError) throw badgeError;

    
    const { data: existingBadge, error: existingBadgeError } = await supabase
      .from('user_badges')
      .select('id')
      .eq('user_id', userId)
      .eq('badge_id', badgeData.id)
      .single();

    if (existingBadgeError && existingBadgeError.code !== 'PGRST116') throw existingBadgeError;

    if (existingBadge) {
      return {
        success: true,
        message: `${badgeName} badge already assigned to user`
      };
    }

    const { error } = await supabase
      .from('user_badges')
      .insert({
        user_id: userId,
        badge_id: badgeData.id
      });

    if (error) throw error;

    return {
      success: true,
      message: `${badgeName} badge assigned successfully`
    };
  } catch (error: any) {
    console.error('Error assigning badge:', error);
    return {
      success: false,
      message: error.message || 'Failed to assign badge'
    };
  }
}