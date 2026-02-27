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

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Generating virtual try-on for:', clothingName);

    const fitDetails = bodyMeasurements ?
      `\n\nBody analysis data (inches): body type: ${bodyMeasurements?.bodyType}, chest: ${bodyMeasurements?.measurements?.chest}, waist: ${bodyMeasurements?.measurements?.waist}, hips: ${bodyMeasurements?.measurements?.hips}, shoulders: ${bodyMeasurements?.measurements?.shoulders}, height: ${bodyMeasurements?.measurements?.height}. Recommended size: ${bodyMeasurements?.recommendedSize}.` : '';

    const promptText = `You are a photorealistic virtual try-on engine. Generate ONE image showing the person from Image 1 wearing the garment from Image 2 (${clothingName}).

LAYERING & FIT RULES:
- Map the garment onto the person's actual body contours — shoulders, chest, waist, hips.
- Scale the garment proportionally to the person's frame; do NOT stretch or squash the body.
- Align neckline, shoulder seams, sleeve length, and hemline to anatomically correct positions.
- Simulate realistic fabric physics: natural drape, gravity folds, tension creases at bends.
- For tops: tuck or layer naturally over bottoms. For bottoms: sit at the correct waist/hip line.
- For dresses/kurtas: follow the full silhouette from shoulders to hem.

REALISM RULES:
- Keep the person's exact pose, skin tone, face, hair, and background from Image 1.
- Respect occlusions: arms in front of torso, hair over shoulders, hands over fabric.
- Match lighting direction, colour temperature, and shadow angles from Image 1.
- Add contact shadows where garment meets skin (collar, cuffs, waistband).
- The final image must look like a real photograph, NOT a collage or overlay.${fitDetails}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image',
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
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits depleted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to generate try-on image' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('AI response structure:', JSON.stringify(Object.keys(data)));
    
    // Try multiple possible response formats
    const choice = data.choices?.[0];
    const generatedImage = 
      choice?.message?.images?.[0]?.image_url?.url ||
      choice?.message?.images?.[0]?.url ||
      choice?.message?.images?.[0] ||
      (typeof choice?.message?.content === 'string' && choice.message.content.startsWith('data:') ? choice.message.content : null);
    
    if (!generatedImage) {
      console.error('Full AI response:', JSON.stringify(data).substring(0, 500));
      throw new Error('No image generated in response');
    }

    console.log('Virtual try-on generated successfully');

    return new Response(
      JSON.stringify({ tryonImage: generatedImage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-tryon function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
