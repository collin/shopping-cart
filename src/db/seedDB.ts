import { seedProducts } from "./seeds/seedProducts";
import { seedUser, seedUsers } from "./seeds/seedUsers";

export async function seedDB() {
  // These seeds are randomized
  await seedProducts();
  await seedUsers();

  // These seeds are not-randomized
  await seedUser("Test User", "test-user@example.org", "123456");
}
