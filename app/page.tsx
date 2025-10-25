import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex justify-center items-center h-full">
      <ThemeToggle />
    </main>
  );
}
