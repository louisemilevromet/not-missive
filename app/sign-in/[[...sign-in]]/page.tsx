import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center py-8 px-4">
      <SignIn />
    </section>
  );
}
