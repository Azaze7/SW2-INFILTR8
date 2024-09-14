// src/routes/register.json.ts
import type { RequestHandler } from '@sveltejs/kit';
import { driver } from '$lib/db';
import bcrypt from 'bcrypt';

export const post: RequestHandler = async ({ request }) => {
  const { email, password } = await request.json();
  const session = driver.session();

  try {
    // Check if user already exists
    const userResult = await session.run(
      'MATCH (u:User {email: $email}) RETURN u',
      { email }
    );

    if (userResult.records.length > 0) {
      return {
        status: 400,
        body: { message: 'User already exists' },
      };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    await session.run(
      'CREATE (u:User {email: $email, password: $password})',
      { email, password: hashedPassword }
    );

    return {
      status: 201,
      body: { message: 'Registration successful' },
    };
  } catch (err) {
    console.error(err);
    return {
      status: 500,
      body: { message: 'An error occurred during registration' },
    };
  } finally {
    await session.close();
  }
};
