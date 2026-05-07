import { Footer } from "@/components/blocks/footer-section";
import DemoOne from "@/components/Footer";
import { HomeSections } from "@/components/HomeSection";
import { HeroGeometric } from "@/components/HomeUI";
import { Navbar1 } from "@/components/ui/navbar-1";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <Navbar1/>
      <HeroGeometric/>
      <HomeSections/>
      <DemoOne/>
    </div>
  );
}
