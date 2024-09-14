// src/routes/login.json.ts
import type { RequestHandler } from '@sveltejs/kit';
import { driver } from '$lib/db';
import { signToken } from '$lib/jwt';
import bcrypt from 'bcrypt';

export const post: RequestHandler = async ({ request }) => {
  const { email, password } = await request.json();
  const session = driver.session();

  try {
    // Find user
    const userResult = await session.run(
      'MATCH (u:User {email: $email}) RETURN u',
      { email }
    );

    if (userResult.records.length === 0) {
      return {
        status: 400,
        body: { message: 'Invalid email or password' },
      };
    }

    const userNode = userResult.records[0].get('u').properties;

    // Compare passwords
    const match = await bcrypt.compare(password, userNode.password);

    if (!match) {
      return {
        status: 400,
        body: { message: 'Invalid email or password' },
      };
    }

    // Create JWT token
    const token = signToken({ email: userNode.email });

    return {
      status: 200,
      body: { message: 'Login successful', token },
    };
  } catch (err) {
    console.error(err);
    return {
      status: 500,
      body: { message: 'An error occurred during login' },
    };
  } finally {
    await session.close();
  }
};
