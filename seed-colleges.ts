import { prisma } from "./apps/web/lib/prisma";

async function seedColleges() {
  console.log("🌱 Seeding colleges...");
  
  const colleges = [
    {
      id: "1",
      name: "Indian Institute of Technology (IIT) Delhi",
      city: "New Delhi",
      state: "Delhi",
      type: "Government",
      affiliation: "Institute of National Importance"
    },
    {
      id: "2", 
      name: "Indian Institute of Technology (IIT) Bombay",
      city: "Mumbai",
      state: "Maharashtra",
      type: "Government",
      affiliation: "Institute of National Importance"
    },
    {
      id: "3",
      name: "Indian Institute of Technology (IIT) Kanpur",
      city: "Kanpur",
      state: "Uttar Pradesh",
      type: "Government",
      affiliation: "Institute of National Importance"
    },
    {
      id: "6",
      name: "JSS Academy of Technical Education (JSSATE)",
      city: "Noida",
      state: "Uttar Pradesh",
      type: "Private",
      affiliation: "AKTU affiliated, NIRF Rank 201-300 (2024)"
    },
    {
      id: "7",
      name: "Amity University",
      city: "Noida",
      state: "Uttar Pradesh",
      type: "Private",
      affiliation: "UGC approved, NIRF Rank 30 (2024)"
    }
  ];

  for (const college of colleges) {
    try {
      const created = await prisma.college.upsert({
        where: { id: college.id },
        update: college,
        create: college,
      });
      console.log(`✅ College upserted: ${created.name} (ID: ${created.id})`);
    } catch (error) {
      console.error(`❌ Error upserting college ${college.name}:`, error);
    }
  }

  console.log("✅ College seeding completed!");
}

seedColleges()
  .catch((error) => {
    console.error("💥 Error seeding colleges:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
