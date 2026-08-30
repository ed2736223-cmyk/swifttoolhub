import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import PasswordGenerator from "@/components/tools/PasswordGenerator";
import { getTool } from "@/lib/tools";
const tool = getTool("password-generator")!;
export const metadata: Metadata = {
  title: tool.name,
  description: tool.shortDesc,
};
export default function Page() {
  return (
    <ToolShell
      tool={tool}
      howTo={[
        "Select how long you want your password to be.",
        "Choose whether to include uppercase letters, lowercase letters, numbers, and symbols.",
        "Click Generate Password to create a random password.",
        "Copy the generated password and use it for your account or application.",
      ]}
      faqs={[
        {
          q: "What makes a password strong?",
          a: "A strong password is long, unique, and uses a mix of uppercase and lowercase letters, numbers, and symbols.",
        },
        {
          q: "Can I customize the generated password?",
          a: "Yes, you can choose the password length and the types of characters you want to include.",
        },
        {
          q: "Is the Password Generator free to use?",
          a: "Yes, you can generate strong passwords online for free without downloading additional software.",
        },
      ]}
    >
      <PasswordGenerator />
    </ToolShell>
  );
}
