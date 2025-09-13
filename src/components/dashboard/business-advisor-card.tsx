"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { getBusinessInsights, BusinessInsightsOutput } from "@/ai/flows/ai-business-advisor-dashboard";
import { Loader2, Lightbulb, TrendingUp, ShieldAlert, BadgeInfo } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useToast } from "@/hooks/use-toast";

const posterData = [
  { month: "Jan", views: 186 },
  { month: "Feb", views: 305 },
  { month: "Mar", views: 237 },
  { month: "Apr", views: 403 },
  { month: "May", views: 290 },
  { month: "Jun", views: 550 },
];

const demandData = [
  { month: "Jan", searches: 120 },
  { month: "Feb", searches: 210 },
  { month: "Mar", searches: 180 },
  { month: "Apr", searches: 350 },
  { month: "May", searches: 310 },
  { month: "Jun", searches: 480 },
];

export function BusinessAdvisorCard() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<BusinessInsightsOutput | null>(null);

  const handleGetInsights = async () => {
    setIsLoading(true);
    setInsights(null);
    try {
      // Using mock data as per requirements
      const mockInput = {
        posterPerformanceData: JSON.stringify(posterData),
        demandSignalsData: JSON.stringify(demandData),
        whatsAppEngagementData: "150 messages sent, 80 replies, 15 conversions in June.",
      };
      const result = await getBusinessInsights(mockInput);
      setInsights(result);
    } catch (error) {
      console.error("Error getting insights:", error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Failed to generate business insights.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex h-full flex-col lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-primary" />
          {t('businessAdvisorTitle')}
        </CardTitle>
        <CardDescription>{t('businessAdvisorDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-2 flex items-center gap-2 font-headline text-lg font-medium">
              <TrendingUp className="h-5 w-5 text-primary" />
              {t('posterPerformance')}
            </h3>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={posterData}>
                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Bar dataKey="views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h3 className="mb-2 flex items-center gap-2 font-headline text-lg font-medium">
              <TrendingUp className="h-5 w-5 text-accent" />
              {t('demandSignals')}
            </h3>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={demandData}>
                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Bar dataKey="searches" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : insights ? (
          <div className="space-y-4">
            <div className="rounded-lg border bg-background/50 p-4">
              <h4 className="mb-2 flex items-center gap-2 font-headline text-lg font-medium"><BadgeInfo className="h-5 w-5 text-primary"/>{t('summaryInsights')}</h4>
              <p className="text-sm text-muted-foreground">{insights.summaryInsights}</p>
            </div>
            <div className="rounded-lg border bg-background/50 p-4">
              <h4 className="mb-2 flex items-center gap-2 font-headline text-lg font-medium"><Lightbulb className="h-5 w-5 text-primary"/>{t('recommendations')}</h4>
              <p className="text-sm text-muted-foreground">{insights.recommendations}</p>
            </div>
            <div className="rounded-lg border bg-background/50 p-4">
              <h4 className="mb-2 flex items-center gap-2 font-headline text-lg font-medium"><ShieldAlert className="h-5 w-5 text-primary"/>{t('potentialRisks')}</h4>
              <p className="text-sm text-muted-foreground">{insights.potentialRisks}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center pt-8">
            <Button onClick={handleGetInsights} disabled={isLoading}>
              <Lightbulb className="mr-2 h-5 w-5" />
              {t('getInsights')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
