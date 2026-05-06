import { HeroGeometric } from "@/components/HomeUI";
import { Button } from "@/components/ui/button";
import ModeToggle from "@/components/ui/ToggleMode";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
          <Show when="signed-out">
            <SignInButton />
              <SignUpButton>
                   <Button variant={"outline"} >
                      Sign Up
                   </Button>
              </SignUpButton>
      </Show>
      <ModeToggle />
      <HeroGeometric/>
          </div>
  );
}
