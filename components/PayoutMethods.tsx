import { Landmark, Smartphone, ShieldCheck } from "lucide-react";

const payoutMethods = [
  {
    icon: Smartphone,
    name: "JazzCash / EasyPaisa",
    lines: ["Account Title: SwiftToolHub", "Account Number: 0300-0000000"],
  },
  {
    icon: Landmark,
    name: "Bank Transfer",
    lines: ["Bank: Meezan Bank", "Account Title: SwiftToolHub", "Account Number: 0000-0000000-0000"],
  },
];

export default function PayoutMethods() {
  return (
    <div className="rounded-3xl border border-heading/10 bg-white p-6">
      <p className="text-sm font-semibold text-heading">How to pay</p>
      <div className="mt-4 space-y-4">
        {payoutMethods.map((method) => (
          <div
            key={method.name}
            className="rounded-2xl border border-heading/10 p-4 transition-colors hover:border-brand/30"
          >
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-soft text-brand">
                <method.icon size={15} />
              </span>
              <span className="text-[13px] font-semibold text-heading">{method.name}</span>
            </div>
            <div className="mt-2.5 space-y-1 pl-10">
              {method.lines.map((line) => (
                <p key={line} className="text-[12.5px] text-heading/60">
                  {line}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 flex items-start gap-1.5 text-[11.5px] text-heading/40">
        <ShieldCheck size={13} className="mt-0.5 shrink-0" />
        Payments are verified manually — access updates only after an admin approves your screenshot.
      </p>
    </div>
  );
}
