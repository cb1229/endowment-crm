'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { profiles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// Validation schema
const updateProfileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100, 'Name is too long'),
  avatarUrl: z.string().url().optional().nullable(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export async function updateProfile(input: UpdateProfileInput) {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: 'Unauthorized - You must be logged in',
      };
    }

    // Validate input
    const validated = updateProfileSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0].message,
      };
    }

    // Update profile in database
    const [updatedProfile] = await db
      .update(profiles)
      .set({
        fullName: validated.data.fullName,
        avatarUrl: validated.data.avatarUrl,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, user.id))
      .returning();

    if (!updatedProfile) {
      return {
        success: false,
        error: 'Profile not found',
      };
    }

    // Revalidate paths to update UI
    revalidatePath('/settings/profile');
    revalidatePath('/');

    return {
      success: true,
      data: updatedProfile,
    };
  } catch (error) {
    console.error('Error updating profile:', error);
    return {
      success: false,
      error: 'Failed to update profile',
    };
  }
}

export async function uploadAvatar(formData: FormData) {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: 'Unauthorized - You must be logged in',
      };
    }

    const file = formData.get('avatar') as File;
    if (!file || file.size === 0) {
      return {
        success: false,
        error: 'No file provided',
      };
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'File must be an image',
      };
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        error: 'File size must be less than 5MB',
      };
    }

    // Generate unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return {
        success: false,
        error: 'Failed to upload avatar',
      };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    // Update profile with new avatar URL
    const [updatedProfile] = await db
      .update(profiles)
      .set({
        avatarUrl: publicUrl,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, user.id))
      .returning();

    if (!updatedProfile) {
      return {
        success: false,
        error: 'Failed to update profile',
      };
    }

    // Revalidate paths
    revalidatePath('/settings/profile');
    revalidatePath('/');

    return {
      success: true,
      data: {
        avatarUrl: publicUrl,
      },
    };
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return {
      success: false,
      error: 'Failed to upload avatar',
    };
  }
}

export async function getProfile() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: 'Unauthorized',
      };
    }

    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, user.id))
      .limit(1);

    if (!profile) {
      return {
        success: false,
        error: 'Profile not found',
      };
    }

    return {
      success: true,
      data: profile,
    };
  } catch (error) {
    console.error('Error fetching profile:', error);
    return {
      success: false,
      error: 'Failed to fetch profile',
    };
  }
}
