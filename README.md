# ZenCart
A minimalist, highly functional E-commerce assistant using React, Node.js, and the Gemini Pro API.

## Features
- **Command Bar UI**: A Raycast/Linear style centered input for hyper-minimalist interactions.
- **Visual Decision Matrix**: An auto-generated table comparing price, rating, local distance availability. 
- **100% Free Live APIs**: Uses Google Gemini (AI Studio), Serper.dev (Google Shopping), and OpenStreetMap (Routing).
- **Budget Toggle**: Instant, client-side re-ranking to prioritize lower prices.
- **Summary Mode**: A 2-sentence AI-generated verdict on the best value item.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Rename `.env.example` to `.env` and fill in your keys:
   - `GEMINI_API_KEY`: Get it from [Google AI Studio](https://aistudio.google.com/) (Free).
   - `SERPER_API_KEY`: Get it from [Serper.dev](https://serper.dev/) (2500 free queries, no card required).

3. **Start the applications**
   You'll need two terminal windows:
   
   **Terminal 1 (Backend - Port 3001)**
   ```bash
   npm run server
   ```

   **Terminal 2 (Frontend - Port 5173)**
   ```bash
   npm run dev
   ```

## Logical Flow
1. **User Intent**: The user types a query (e.g. "Gaming monitor under 300 nearby") into the CommandBar.
2. **Backend Gateway**: The frontend sends the query and user's estimated coordinates to the `/api/search` Node.js endpoint.
3. **Gemini Tool Invocation**: Gemini parses the sentence. It determines that it needs live shopping data, and decides to call the `searchShopping` tool (which uses Serper.dev). It may also call `getDistance` for physical retail stores (using Nominatim + OSRM) to calculate driving miles from the user.
4. **Synthesis**: After the tools resolve, Gemini is prompted one final time to synthesize all the unstructured data into a strict JSON Schema, containing the `products` array and the `summary` verdict.
5. **Frontend Rendering**: The matrix table renders, and the user can toggle "Budget Mode" to immediately resort the list client-side without another API call.