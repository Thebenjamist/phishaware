import { Slot } from "expo-router";
import { SessionProvider } from "@/services/ctx";

export default function Root() {
  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}
