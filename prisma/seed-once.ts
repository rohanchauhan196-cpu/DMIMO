// Runs the sample-content seed only on an empty database, so redeploys never
// duplicate or overwrite content edited in the admin panel.
import { PrismaClient } from "@prisma/client";

async function run() {
  const prisma = new PrismaClient();
  const users = await prisma.user.count();
  await prisma.$disconnect();
  if (users > 0) {
    console.log("Database already has data — skipping seed.");
    return;
  }
  await import("./seed");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
