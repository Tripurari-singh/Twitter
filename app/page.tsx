import DemoOneFooter from "@/components/ui/Footer";
import { HomeSections } from "@/components/ui/HomeSection";
import { HeroGeometric } from "@/components/ui/HomeUI";
import { Navbar1 } from "@/components/ui/navbar-1";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();
  if (userId) {
    redirect('/dashboard')
  }
  
  return (
    <div>
      <Navbar1/>
      <HeroGeometric/>
      <HomeSections/>
      <DemoOneFooter/>
    </div>
  );
}