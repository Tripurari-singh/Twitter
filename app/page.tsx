import DemoOneFooter from "@/components/ui/Footer";
import { HomeSections } from "@/components/ui/HomeSection";
import { HeroGeometric } from "@/components/ui/HomeUI";
import { Navbar1 } from "@/components/ui/navbar-1";

export default async function Home() {
  return (
    <div>
      <Navbar1/>
      <HeroGeometric/>
      <HomeSections/>
      <DemoOneFooter/>
    </div>
  );
}
