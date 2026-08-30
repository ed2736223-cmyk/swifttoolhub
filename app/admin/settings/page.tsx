import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/siteSettings";
import SiteSettingsForm from "@/components/admin/SiteSettingsForm";

export const metadata: Metadata = {
  title: "Admin — Settings",
  description: "Site-wide pricing, usage limits, and ad configuration.",
};

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="text-2xl font-bold text-heading">Settings &amp; Ads</h1>
      <p className="mt-1 max-w-xl text-sm text-heading/50">
        Everything here takes effect immediately, site-wide — no redeploy needed.
      </p>

      <div className="mt-6">
        <SiteSettingsForm
          initial={{
            bundle10Price: settings.bundle10Price,
            bundle10Size: settings.bundle10Size,
            allAccessPrice: settings.allAccessPrice,
            defaultFreeUseLimit: settings.defaultFreeUseLimit,
            adsEnabled: settings.adsEnabled,
            adsterraBannerKey: settings.adsterraBannerKey || "",
            adsterraBannerSrc: settings.adsterraBannerSrc || "",
            adsterraSitewideSrc: settings.adsterraSitewideSrc || "",
          }}
        />
      </div>
    </div>
  );
}
