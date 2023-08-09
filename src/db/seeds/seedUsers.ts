import { faker } from "@faker-js/faker";
import { execQuery } from "../execQuery";
import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";

const scryptPromise = promisify(scrypt);

const SEED_USER_COUNT = parseInt(process.env.SEED_USER_COUNT || "10");

export async function seedUsers() {
  // create initial fake user data
  for (let i = 0; i < SEED_USER_COUNT; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    await seedUser(
      faker.person.fullName({ firstName, lastName }),
      faker.internet.exampleEmail({ firstName, lastName }),
      "123456",
    );
  }
}

export async function seedUser(
  displayName: string,
  emailAddress: string,
  password: string,
) {
  const salt = randomBytes(16);
  const hashedPassword = await scryptPromise(password, salt, 64);

  await execQuery(
    /* SQL */ `
      INSERT INTO users.users (display_name, email_address, hashed_password, salt)
      VALUES ($1, $2, $3, $4)
    `,
    [displayName, emailAddress, hashedPassword, salt],
  );
}
