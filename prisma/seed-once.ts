// Runs at build time (see the "vercel-build" script).
// - Empty database: loads the full sample-content seed once.
// - Existing database: never re-seeds content (so admin edits are kept), but if
//   SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are set, makes sure that admin
//   account exists with exactly that password. To change the admin login, update
//   those two environment variables and redeploy.
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

async function run() {
  const prisma = new PrismaClient();
  try {
    const users = await prisma.user.count();
    if (users === 0) {
      await prisma.$disconnect();
      await import("./seed");
      return;
    }

    const email = process.env.SEED_ADMIN_EMAIL?.trim();
    const password = process.env.SEED_ADMIN_PASSWORD;
    if (!email || !password) {
      console.log("Database already has data. SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD not both set, so the admin login was left unchanged.");
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.upsert({
      where: { email },
      update: { passwordHash, role: "ADMIN" },
      create: { email, passwordHash, name: "Studio Admin", role: "ADMIN" },
    });
    console.log(`Admin login synced for ${email}.`);
  } finally {
    await prisma.$disconnect();
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
