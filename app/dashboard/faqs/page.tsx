import type { Metadata } from "next";
import FAQ from "@/components/FAQ";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Frequently asked questions about SwiftToolHub.",
};

export default function DashboardFaqsPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-xl font-bold text-heading">FAQs</h1>
      <p className="mt-1 text-sm text-heading/50">Answers to the most common questions.</p>
      <div className="-mx-4 mt-6 overflow-hidden rounded-3xl sm:-mx-6">
        <FAQ />
      </div>
    </div>
  );
}
