// src/routes/register.json.ts
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { driver } from '$lib/db';
import bcrypt from 'bcrypt';

export const POST: RequestHandler = async ({ request }) => {
  const session = driver.session();

  try {
    const { email, password } = await request.json();

    // Check if user already exists
    const userResult = await session.run(
      'MATCH (u:User {email: $email}) RETURN u',
      { email }
    );

    if (userResult.records.length > 0) {
      return json({ message: 'User already exists' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    await session.run(
      'CREATE (u:User {email: $email, password: $password})',
      { email, password: hashedPassword }
    );

    return json({ message: 'Registration successful' }, { status: 201 });
  } catch (err) {
    console.error(err);
    return json(
      { message: 'An error occurred during registration' },
      { status: 500 }
    );
  } finally {
    await session.close();
  }
};
