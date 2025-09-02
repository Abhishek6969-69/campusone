import { PrismaClient } from "@prisma/client";
import colleges from "./colleges.json" assert { type: "json" };
 // <-- import the array we built

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  for (const c of colleges) {
    const college = await prisma.college.upsert({
      where: { name: c.name },   // ✅ use unique field
      update: {},                // no update for now
      create: {
        name: c.name,
        city: c.city,
        state: c.state,
        type: c.type,
        affiliation: c.affiliation,
        domain: c.name
          .toLowerCase()
          .replace(/\s+/g, "") + ".edu", // generate dummy domain
      },
    });

    console.log(`🏫 College: ${college.name}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("✅ Seeding finished!");
  })
  .catch(async (e) => {
    console.error("❌ Seeding error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
