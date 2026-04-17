import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const SERPER_API_KEY = process.env.SERPER_API_KEY;

/**
 * STEP 1: Fetch live products from Serper.
 * Locked to Chennai via 'gl: in' and 'location' parameters.
 */
async function searchShopping(query) {
  try {
    const response = await fetch('https://google.serper.dev/shopping', {
      method: 'POST',
      headers: {
        'X-API-KEY': SERPER_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        q: `${query} in Chennai`,
        gl: 'in',
        location: 'Chennai, Tamil Nadu, India',
        num: 8
      })
    });
    const data = await response.json();
    return data.shopping || [];
  } catch (error) {
    console.error('Serper Error:', error);
    return [];
  }
}

/**
 * STEP 2: Calculate road distance using OSRM.
 * Forces store searches to stay within the Chennai context.
 */
async function getDistance(storeName, userLat, userLon) {
  try {
    // Geocode the store specifically in Chennai
    const geocodeRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(storeName + ' Chennai')}&format=json&limit=1`, {
      headers: { 'User-Agent': 'ZenCart-Assistant' }
    });
    const geocodeData = await geocodeRes.json();
    if (!geocodeData?.length) return null;

    const storeLat = geocodeData[0].lat;
    const storeLon = geocodeData[0].lon;

    // lon,lat format for OSRM
    const routeRes = await fetch(`https://router.project-osrm.org/route/v1/driving/${userLon},${userLat};${storeLon},${storeLat}?overview=false`);
    const routeData = await routeRes.json();

    if (routeData.code !== 'Ok') return null;
    // Result in miles (as requested by your frontend schema)
    return (routeData.routes[0].distance * 0.000621371).toFixed(1);
  } catch {
    return null;
  }
}

app.post('/api/search', async (req, res) => {
  const { query, lat, lon } = req.body;
  if (!query) return res.status(400).json({ error: 'Query is required' });

  try {
    // 1. Get products from Serper first
    const rawProducts = await searchShopping(query);

    // 2. Enrich data with local distances (Parallel processing for Efficiency)
    const enrichedProducts = await Promise.all(rawProducts.map(async (item) => {
      let distance = null;
      // Filter out obvious online-only giants
      const majorOnline = ['Amazon', 'Flipkart', 'eBay', 'Myntra', 'Ajio'];
      if (item.source && !majorOnline.some(m => item.source.includes(m))) {
        distance = await getDistance(item.source, lat, lon);
      }

      return {
        name: item.title,
        price: item.price,
        source: item.source,
        rating: item.rating ? parseFloat(item.rating) : 4.0,
        reviews: item.reviews || 0,
        link: item.link,
        distance_miles: distance ? parseFloat(distance) : null
      };
    }));

    // 3. Final LLM synthesis for the "Verdict"
    // Strict System Instruction to eliminate "San Francisco" [cite: 3]
    const systemInstruction = `You are the ZenCart Verdict Engine. 
    You are strictly located in CHENNAI, INDIA. 
    Analyze the provided product JSON. 
    Write a 2-sentence "summary" recommending the best value choice in Chennai. 
    NEVER mention San Francisco or any US-based locations.
    Response must be ONLY raw JSON conforming to the schema.`;

    const finalResponse = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: `Current Products: ${JSON.stringify(enrichedProducts)}` }
      ],
      response_format: { type: "json_object" }
    });

    const llmVerdict = JSON.parse(finalResponse.choices[0].message.content);

    // 4. Send combined payload to frontend
    return res.json({
      products: enrichedProducts,
      summary: llmVerdict.summary || "Best options found for your search in Chennai."
    });

  } catch (error) {
    console.error('Final API Error:', error);
    return res.status(500).json({ error: 'Server could not process request' });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`🚀 ZenCart Backend live on port ${PORT}`));