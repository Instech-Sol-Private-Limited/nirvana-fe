import supabase from "@/config/supabse";

export const uploadToSupabase = async (file: File) => {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `blog_images/${fileName}`;

        const { data, error } = await supabase.storage
            .from('blog-images')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;

        const { data: publicUrlData } = supabase.storage
            .from('blog-images')
            .getPublicUrl(filePath);

        if (!publicUrlData?.publicUrl) {
            throw new Error('Failed to get public URL for uploaded image');
        }

        return publicUrlData.publicUrl;
    } catch (error: any) {
        console.error('Error uploading image:', error);
    }
};

