import { db } from '../../../lib/db';

export async function POST(req) {
  try {
    const body = await req.json();

    // Insert data into the database
    const query = `
      INSERT INTO loginStats (loginMethod, durationMs, browser, status)
      VALUES (?, ?, ?, ?)
    `;

    const values = [
        body.loginMethod,
        body.durationMs,
        body.browser,
        body.status,
    ];

    await db.execute(query, values);

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ error: 'Failed to save stats' }), { status: 500 });
  }
}


export async function GET() {
    try {
      const [rows] = await db.execute('SELECT * FROM loginStats'); // Gebruik de juiste tabelnaam
      return Response.json(rows);
    } catch (error) {
      console.error('Database error:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch stats' }), { status: 500 });
    }
  }