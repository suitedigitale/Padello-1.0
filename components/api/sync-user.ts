export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const PADELLO_API_KEY = process.env.PADELLO_API_KEY;

  if (!PADELLO_API_KEY) {
    return res.status(500).json({ error: 'API key non configurata' });
  }

  try {
    const response = await fetch(
      'https://padello.framework360.site/m/api/customers/registration',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Fw360-Key': PADELLO_API_KEY,
        },
        body: JSON.stringify(req.body),
      }
    );

    const data = await response.json().catch(() => null);

    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({
      error: 'Errore server proxy',
      details: error,
    });
  }
}