import { Button } from "@/components/ui/button";
import ModeToggle from "@/components/ui/ToggleMode";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";

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
          </div>
  );
}
