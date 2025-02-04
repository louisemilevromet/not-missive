import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center py-8 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Welcome to{" "}
            <span className="inline-flex items-center">
              not
              <Image
                src="/missive.png"
                alt="logo"
                width={80}
                height={80}
                className="mx-4 inline md:w-20 md:h-20 w-10 h-10"
              />
              missive
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience a fake way of communication with our innovative platform.
          </p>
        </div>
        <Button asChild size="lg" className="text-lg px-8 py-6">
          <Link href="/chat">Start Chatting</Link>
        </Button>
      </div>
    </section>
  );
}
