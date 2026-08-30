import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Help Desk",
  description: "Get in touch with the SwiftToolHub team.",
};

export default function HelpDeskPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-xl font-bold text-heading">Help Desk</h1>
      <p className="mt-1 text-sm text-heading/50">Stuck on something? Send us a message.</p>
      <div className="mt-6">
        <ContactForm />
      </div>
    </div>
  );
}
