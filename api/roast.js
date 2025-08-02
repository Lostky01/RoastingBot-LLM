export default async function handler(req, res) {
    if(req.method !== 'POST') {
        return res.status(405).json({message: 'Method not allowed'});
    }

    const inputText = req.body.input || '';
    if(!inputText.trim()) {
        return res.status(400).json({message: 'Input text is required'});

    }

    const HF_TOKEN = process.env.HF_TOKEN;
    const HF_API_URL = process.env.HF_API_URL;

    const headers = {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json'
    };

    const payload = {
        model: "meta-llama/Llama-3.1-8B-Instruct:novita",
        messages: [
          {
            role: "user",
            content: `Roast me: ${inputText}`,
          },
        ],
      };
      try {
        const hfRes = await fetch(HF_API_URL, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
    
        if (!hfRes.ok) {
          const err = await hfRes.text();
          return res.status(500).json({ error: err });
        }
    
        const result = await hfRes.json();
        const roastText = result.choices?.[0]?.message?.content || "Roast not found.";
    
        return res.status(200).json({ roast: roastText });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
}