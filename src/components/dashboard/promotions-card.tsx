"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/language-context";
import { generatePromotionalPoster } from "@/ai/flows/generate-promotional-poster";
import Image from 'next/image';
import { Loader2, Palette } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PromoteIcon, CameraIcon } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";

export function PromotionsCard() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [poster, setPoster] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [style, setStyle] = useState<"traditional" | "modern">("modern");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPoster(null);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
    }
  };

  const handleGeneratePoster = async () => {
    if (!preview) {
      toast({
        variant: "destructive",
        title: "No Photo",
        description: "Please upload a product photo first.",
      });
      return;
    }
    setIsLoading(true);
    setPoster(null);
    try {
      const result = await generatePromotionalPoster({ photoDataUri: preview, style });
      setPoster(result.posterDataUri);
    } catch (error) {
      console.error("Error generating poster:", error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Failed to generate promotional poster.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PromoteIcon className="h-6 w-6 text-primary" />
          {t('promotionsTitle')}
        </CardTitle>
        <CardDescription>{t('promotionsDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col items-center space-y-4">
        <div className="relative flex h-64 w-full items-center justify-center rounded-lg border-2 border-dashed bg-muted/50">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-lg bg-background/80">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">{t('generating')}</p>
            </div>
          )}
          {poster ? (
             <Image src={poster} alt="Generated Poster" layout="fill" objectFit="contain" className="rounded-lg" />
          ) : preview ? (
            <Image src={preview} alt="Product preview" layout="fill" objectFit="contain" className="rounded-lg" />
          ) : (
            <p className="text-sm text-muted-foreground">Your poster will appear here</p>
          )}
        </div>
        
        <div className="grid w-full grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{t('posterStyle')}</Label>
            <RadioGroup defaultValue="modern" value={style} onValueChange={(v) => setStyle(v as "traditional" | "modern")} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="modern" id="modern" />
                <Label htmlFor="modern">{t('modern')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="traditional" id="traditional" />
                <Label htmlFor="traditional">{t('traditional')}</Label>
              </div>
            </RadioGroup>
          </div>
          {isClient && (
            <div>
              <Label>Product Photo</Label>
              <Input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} disabled={isLoading} />
              <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full" disabled={isLoading}>
                <CameraIcon className="mr-2 h-4 w-4" />
                {preview ? 'Change Photo' : t('uploadPhoto')}
              </Button>
            </div>
          )}
        </div>
        
        <Button onClick={handleGeneratePoster} className="w-full" disabled={isLoading || !preview}>
          <Palette className="mr-2 h-5 w-5" />
          {t('generatePoster')}
        </Button>
      </CardContent>
    </Card>
  );
}
