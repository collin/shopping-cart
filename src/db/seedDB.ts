import { seedProducts } from "./seeds/seedProducts";

export async function seedDB() {
  await seedProducts();
}
