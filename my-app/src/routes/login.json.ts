// src/routes/login.json.ts
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { driver } from '$lib/db';
import { signToken } from '$lib/jwt';
import bcrypt from 'bcrypt';

export const POST: RequestHandler = async ({ request }) => {
  const session = driver.session();

  try {
    const { email, password } = await request.json();

    // Find user
    const userResult = await session.run(
      'MATCH (u:User {email: $email}) RETURN u',
      { email }
    );

    if (userResult.records.length === 0) {
      return json({ message: 'Invalid email or password' }, { status: 400 });
    }

    const userNode = userResult.records[0].get('u').properties;

    // Compare passwords
    const match = await bcrypt.compare(password, userNode.password);

    if (!match) {
      return json({ message: 'Invalid email or password' }, { status: 400 });
    }

    // Generate JWT token
    const token = signToken({ email: userNode.email });

    return json({ message: 'Login successful', token }, { status: 200 });
  } catch (err) {
    console.error(err);
    return json({ message: 'An error occurred during login' }, { status: 500 });
  } finally {
    await session.close();
  }
};
