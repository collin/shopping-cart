import { setupDB } from "./setupDB";
import { seedDB } from "./seedDB";

async function resetDB() {
  await setupDB();
  await seedDB();
}

resetDB();
