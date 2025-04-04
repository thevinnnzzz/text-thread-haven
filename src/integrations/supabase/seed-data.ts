
import { supabase } from './client';
import { v4 as uuidv4 } from 'uuid';

/**
 * Helper function to seed a test user profile into the database
 */
export const seedTestUserProfile = async (userId: string) => {
  try {
    // Check if profile already exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking for existing profile:', fetchError);
      throw fetchError;
    }
    
    if (existingProfile) {
      console.log('Profile already exists:', existingProfile);
      return existingProfile;
    }
    
    // Create profile if it doesn't exist
    // Using RPC to bypass RLS for development purposes
    const { error } = await supabase.rpc('create_profile_for_user', {
      user_id: userId,
      user_name: 'current_user',
      display_name: 'Current User',
      user_bio: 'This is a test user for development purposes.'
    } as any); // Using type assertion to bypass the TypeScript error
      
    if (error) {
      console.error('Error seeding test user profile:', error);
      throw error;
    }
    
    // Fetch the newly created profile
    const { data: newProfile, error: newProfileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (newProfileError) {
      console.error('Error fetching new profile:', newProfileError);
      throw newProfileError;
    }
    
    console.log('Created new profile:', newProfile);
    return newProfile;
  } catch (error) {
    console.error('Error in seedTestUserProfile:', error);
    throw error;
  }
};

export default { seedTestUserProfile };
