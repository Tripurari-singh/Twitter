import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Show when="signed-out">
            <SignInButton />
              <SignUpButton>
                <button className="bg-red-400 rounded-2xl m-4 ">
                  Sign Up
                </button>
              </SignUpButton>
            </Show>
      <Show when="signed-in">
              <UserButton />
      </Show>
    </div>
  );
}
