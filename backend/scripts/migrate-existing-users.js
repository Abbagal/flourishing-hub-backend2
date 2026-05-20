import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function migrateExistingUsers() {
  try {
    console.log("Starting migration: Setting existing users as verified...");

    // Update all existing users to isVerified = true
    const result = await prisma.user.updateMany({
      where: {
        isVerified: false
      },
      data: {
        isVerified: true
      }
    });

    console.log(`✅ Successfully updated ${result.count} existing users to verified status`);
    console.log("Migration completed!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

migrateExistingUsers();
