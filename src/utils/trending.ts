
import supabase from '../config/supabse';

export interface TagCount {
  name: string;
  count: number;
}

export async function getTrendingTopics(): Promise<{
  success: boolean;
  data: TagCount[];
  error?: string;
}> {
  try {
    const { data: threads, error } = await supabase
      .from('threads')
      .select('keywords')
      .not('keywords', 'is', null);

    if (error) {
      throw new Error(error.message);
    }

    
    const keywordCounts: Record<string, number> = {};
    
    threads.forEach(thread => {
     
      if (Array.isArray(thread.keywords)) {
        thread.keywords.forEach((keyword: string) => {
        
          const normalizedKeyword = keyword.toLowerCase().trim();
          if (normalizedKeyword) {
            keywordCounts[normalizedKeyword] = (keywordCounts[normalizedKeyword] || 0) + 1;
          }
        });
      }
    });

    
    const trendingTags: TagCount[] = Object.entries(keywordCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); 

    return {
      success: true,
      data: trendingTags
    };
  } catch (error) {
    console.error('Error fetching trending topics:', error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}