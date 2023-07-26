import { seedProducts } from "./seeds/seedProducts";
import { seedUsers } from "./seeds/seedUsers";

export async function seedDB() {
  await seedProducts();
  await seedUsers();
}
