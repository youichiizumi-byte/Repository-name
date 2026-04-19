export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { message } = req.body;
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [{ role: 'user', content: message }]
      })
    });
    const text = await response.text();
    console.log('API response:', text);
    const data = JSON.parse(text);
    if (!data.content || !data.content[0]) {
      return res.status(500).json({ error: 'API応答が不正です', raw: text });
    }
    res.status(200).json({ reply: data.content[0].text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
