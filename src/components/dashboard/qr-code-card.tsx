"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import QRCode from "qrcode.react";

export function QRCodeCard() {
  const { t } = useLanguage();
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    // This ensures window object is available and avoids hydration mismatch
    setQrUrl(`${window.location.origin}/artisan/1`);
  }, []);


  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-6 w-6 text-primary" />
          {t('qrCodeTitle')}
        </CardTitle>
        <CardDescription>{t('qrCodeDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col items-center justify-center space-y-4">
        <div className="rounded-lg bg-white p-4 shadow-md">
          {qrUrl ? (
            <QRCode value={qrUrl} size={160} level="H" />
          ) : (
            <div className="h-[160px] w-[160px] animate-pulse rounded-md bg-muted" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
