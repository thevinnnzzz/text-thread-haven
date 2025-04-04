
import { supabase } from './client';
import { v4 as uuidv4 } from 'uuid';

/**
 * Helper function to seed a test user profile into the database
 */
export const seedTestUserProfile = async (userId: string) => {
  try {
    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (existingProfile) {
      return existingProfile;
    }
    
    // Create profile if it doesn't exist
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        username: 'current_user',
        display_name: 'Current User',
        bio: 'This is a test user for development purposes.'
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error seeding test user profile:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in seedTestUserProfile:', error);
    throw error;
  }
};

export default { seedTestUserProfile };
