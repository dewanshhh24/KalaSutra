"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { generateMarketingContent, GenerateMarketingContentOutput } from "@/ai/flows/ai-marketing-engine";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Copy, Check, BotMessageSquare, Newspaper, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MarketingEngineCardProps {
  productName: string;
  productDescription: string;
  productPhotoDataUri: string;
  artisanName: string;
  artisanCraft: string;
  artisanRegion: string;
}

export function MarketingEngineCard({
  productName,
  productDescription,
  productPhotoDataUri,
  artisanName,
  artisanCraft,
  artisanRegion,
}: MarketingEngineCardProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<GenerateMarketingContentOutput | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setContent(null);
    try {
      const result = await generateMarketingContent({
        productName,
        productDescription,
        productPhotoDataUri,
        artisanName,
        artisanCraft,
        artisanRegion,
      });
      setContent(result);
    } catch (error) {
      console.error("Error generating marketing content:", error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Failed to generate marketing content.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="p-0">
        <CardDescription>{t('promotionsDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : content ? (
          <div className="space-y-4">
            <CopyableTextarea
              id="social"
              label={t('socialMediaPost')}
              icon={<BotMessageSquare className="h-5 w-5 text-primary" />}
              text={content.socialMediaPost}
              onCopy={handleCopy}
              isCopied={copied === "social"}
            />
            <CopyableTextarea
              id="whatsapp"
              label={t('whatsappMessage')}
              icon={<MessageSquare className="h-5 w-5 text-primary" />}
              text={content.whatsAppMessage}
              onCopy={handleCopy}
              isCopied={copied === "whatsapp"}
            />
            <CopyableTextarea
              id="blog"
              label={t('blogPostDraft')}
              icon={<Newspaper className="h-5 w-5 text-primary" />}
              text={content.blogPostDraft}
              onCopy={handleCopy}
              isCopied={copied === "blog"}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center pt-8">
            <Button onClick={handleGenerate} disabled={isLoading}>
              {t('generateMarketingContent')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CopyableTextarea({ id, label, icon, text, onCopy, isCopied }: {
    id: string;
    label: string;
    icon: React.ReactNode;
    text: string;
    onCopy: (text: string, id: string) => void;
    isCopied: boolean;
}) {
    const { t } = useLanguage();
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <h4 className="flex items-center gap-2 font-headline text-lg font-medium">{icon}{label}</h4>
                <Button variant="ghost" size="sm" onClick={() => onCopy(text, id)}>
                    {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    <span className="ml-2">{isCopied ? t('copied') : t('copy')}</span>
                </Button>
            </div>
            <Textarea readOnly value={text} rows={5} className="bg-muted/50" />
        </div>
    );
}
