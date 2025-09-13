import { Header } from "@/components/header";
import { VoiceProfileCard } from "@/components/dashboard/voice-profile-card";
import { PhotoCatalogCard } from "@/components/dashboard/photo-catalog-card";
import { PromotionsCard } from "@/components/dashboard/promotions-card";
import { QRCodeCard } from "@/components/dashboard/qr-code-card";
import { BusinessAdvisorCard } from "@/components/dashboard/business-advisor-card";

export default function DashboardPage() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <VoiceProfileCard />
          </div>
          <div className="lg:col-span-1">
            <PhotoCatalogCard />
          </div>
          <div className="lg:col-span-1">
            <QRCodeCard />
          </div>

          <div className="lg:col-span-2">
            <BusinessAdvisorCard />
          </div>
          <div className="lg:col-span-1">
            <PromotionsCard />
          </div>
        </div>
      </main>
    </div>
  );
}
