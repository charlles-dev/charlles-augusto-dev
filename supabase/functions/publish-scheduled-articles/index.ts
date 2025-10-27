import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Checking for articles to publish...')

    // Find articles scheduled to be published
    const now = new Date().toISOString()
    const { data: scheduledArticles, error: fetchError } = await supabase
      .from('articles')
      .select('id, title, scheduled_at')
      .eq('is_published', false)
      .not('scheduled_at', 'is', null)
      .lte('scheduled_at', now)

    if (fetchError) {
      console.error('Error fetching scheduled articles:', fetchError)
      throw fetchError
    }

    console.log(`Found ${scheduledArticles?.length || 0} articles to publish`)

    if (scheduledArticles && scheduledArticles.length > 0) {
      // Publish the articles
      const articleIds = scheduledArticles.map(a => a.id)
      const { error: updateError } = await supabase
        .from('articles')
        .update({
          is_published: true,
          published_at: now,
        })
        .in('id', articleIds)

      if (updateError) {
        console.error('Error publishing articles:', updateError)
        throw updateError
      }

      console.log(`Successfully published ${scheduledArticles.length} articles`)

      // Create notification for admin
      const notifications = scheduledArticles.map(article => ({
        type: 'article_published',
        title: 'Artigo publicado',
        message: `O artigo "${article.title}" foi publicado automaticamente`,
        related_entity_type: 'article',
        related_entity_id: article.id,
      }))

      await supabase
        .from('admin_notifications')
        .insert(notifications)

      return new Response(
        JSON.stringify({
          success: true,
          publishedCount: scheduledArticles.length,
          articles: scheduledArticles,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        publishedCount: 0,
        message: 'No articles to publish',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in publish-scheduled-articles:', error)
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
