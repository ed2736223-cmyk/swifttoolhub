import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a free SwiftToolHub account to remove tool usage limits.",
};

export default function SignupPage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 pb-24 pt-32">
        <SignupForm />
      </main>
      <Footer />
    </>
  );
}
