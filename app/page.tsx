import { Footer } from "@/components/blocks/footer-section";
import DemoOneFooter from "@/components/Footer";
import { HomeSections } from "@/components/HomeSection";
import { HeroGeometric } from "@/components/HomeUI";
import { Navbar1 } from "@/components/ui/navbar-1";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();
  console.log("user is here " , user);
  return (
    <div>
      <Navbar1/>
      <HeroGeometric/>
      <HomeSections/>
      <DemoOneFooter/>
    </div>
  );
}
