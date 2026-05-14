import { PrismaClient, Prisma } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const userData: Prisma.UserCreateInput[] = [
  {
    username: "john_doe",
    email: "john@example.com",
    clerkId: "clerk_123",
    name: "John Doe",
    bio: "Full-stack developer.",
    image: "https://avatar.vercel.sh/john_doe",
    location: "New York, NY",
    website: "https://johndoe.dev",
  },
  {
    username: "jane_smith",
    email: "jane@example.com",
    clerkId: "clerk_456",
    name: "Jane Smith",
    bio: "UI/UX Designer.",
    image: "https://avatar.vercel.sh/jane_smith",
    location: "Austin, TX",
    website: "https://janesmith.design",
  },
];

export async function main() {
  for (const u of userData) {
    await prisma.user.create({ data: u });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
