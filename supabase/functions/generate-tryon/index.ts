import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userImage, clothingImage, clothingName, bodyMeasurements } = await req.json();
    
    if (!userImage || !clothingImage) {
      return new Response(
        JSON.stringify({ error: 'User image and clothing image are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!userImage.startsWith('data:image/')) {
      return new Response(
        JSON.stringify({ error: 'User image must be a base64 data URI' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    if (!clothingImage.startsWith('data:image/')) {
      return new Response(
        JSON.stringify({ error: 'Clothing image must be a base64 data URI' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Images validated. User:', userImage.length, 'Clothing:', clothingImage.length);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Generating virtual try-on for:', clothingName);

    const fitDetails = bodyMeasurements
      ? `\nBody: ${bodyMeasurements.bodyType}, chest ${bodyMeasurements.measurements?.chest}", waist ${bodyMeasurements.measurements?.waist}", hips ${bodyMeasurements.measurements?.hips}", size ${bodyMeasurements.recommendedSize}.`
      : '';

    const promptText = `Generate a single photorealistic image of the person from Image 1 wearing the garment from Image 2 (${clothingName}).

Rules:
- Map garment onto the person's actual body contours (shoulders, chest, waist, hips)
- Keep exact pose, face, skin tone, hair, background from Image 1
- Realistic fabric drape, folds, shadows matching the lighting
- Proper layering: arms in front of torso, hair over shoulders
- Must look like a real photo, not a collage${fitDetails}`;

    // Use the faster, higher quality image model
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3.1-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: promptText },
              { type: 'image_url', image_url: { url: userImage } },
              { type: 'image_url', image_url: { url: clothingImage } }
            ]
          }
        ],
        modalities: ['image', 'text']
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please wait a moment and try again.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits depleted. Please add credits in Settings → Workspace → Usage.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      return new Response(
        JSON.stringify({ error: `AI service error (${response.status}). Please try again.` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Safely parse response - handle empty or invalid JSON
    let data;
    const responseText = await response.text();
    if (!responseText || responseText.trim().length === 0) {
      console.error('Empty response from AI gateway');
      return new Response(
        JSON.stringify({ error: 'AI returned empty response. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    try {
      data = JSON.parse(responseText);
    } catch (parseErr) {
      console.error('Failed to parse AI response:', responseText.substring(0, 300));
      return new Response(
        JSON.stringify({ error: 'AI returned invalid response. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('AI response keys:', JSON.stringify(Object.keys(data)));

    // Check for error in response
    if (data.error) {
      console.error('AI returned error:', JSON.stringify(data.error));
      return new Response(
        JSON.stringify({ error: 'AI could not generate image. Please try a different photo or garment.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const choice = data.choices?.[0];
    const generatedImage = 
      choice?.message?.images?.[0]?.image_url?.url ||
      choice?.message?.images?.[0]?.url ||
      (typeof choice?.message?.images?.[0] === 'string' ? choice.message.images[0] : null) ||
      (typeof choice?.message?.content === 'string' && choice.message.content.startsWith('data:') ? choice.message.content : null);
    
    if (!generatedImage) {
      console.error('No image in response. Choice:', JSON.stringify(choice).substring(0, 500));
      return new Response(
        JSON.stringify({ error: 'AI did not generate an image. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Virtual try-on generated successfully, length:', generatedImage.length);

    return new Response(
      JSON.stringify({ tryonImage: generatedImage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-tryon function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
