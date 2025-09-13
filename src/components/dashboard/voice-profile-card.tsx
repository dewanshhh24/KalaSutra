"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { voiceToProfile, VoiceToProfileOutput } from "@/ai/flows/voice-to-profile";
import { Loader2, UserCircle, Mic, StopCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function VoiceProfileCard() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<VoiceToProfileOutput | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = handleProcessRecording;
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setProfile(null);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        variant: "destructive",
        title: "Microphone Error",
        description: "Could not access microphone. Please check permissions.",
      });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };
  
  const handleProcessRecording = async () => {
    setIsRecording(false);
    setIsLoading(true);

    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    audioChunksRef.current = [];

    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
      const base64Audio = reader.result as string;
      try {
        const result = await voiceToProfile({ audioDataUri: base64Audio });
        setProfile(result);
      } catch (error) {
        console.error("Error generating profile:", error);
        toast({
          variant: "destructive",
          title: "AI Error",
          description: "Failed to generate profile from voice.",
        });
      } finally {
        setIsLoading(false);
      }
    };
  };

  const toggleRecording = () => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-6 w-6 text-primary" />
          {t('voiceToProfileTitle')}
        </CardTitle>
        <CardDescription>{t('voiceToProfileDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col items-center justify-center space-y-6">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">{t('generating')}</p>
          </div>
        ) : profile ? (
          <div className="w-full space-y-4 text-center">
            <div className="space-y-4 rounded-lg border bg-background/50 p-4">
              <h3 className="flex items-center justify-center gap-2 font-headline text-lg font-semibold">
                <UserCircle className="h-5 w-5 text-primary" />
                {t('profile')}
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-left sm:grid-cols-[max-content_1fr]">
                <strong className="text-muted-foreground">{t('name')}:</strong>
                <span>{profile.name}</span>
                <strong className="text-muted-foreground">{t('craft')}:</strong>
                <span>{profile.craft}</span>
                <strong className="text-muted-foreground">{t('region')}:</strong>
                <span>{profile.region}</span>
                <strong className="text-muted-foreground">{t('experience')}:</strong>
                <span>{profile.experience}</span>
              </div>
            </div>
            <Button onClick={() => setProfile(null)} variant="outline">{t('recordAgain')}</Button>
          </div>
        ) : (
          isClient && (
            <div className="flex flex-col items-center gap-4 text-center">
                <Button 
                    onClick={toggleRecording} 
                    size="icon"
                    className={cn(
                        "h-24 w-24 rounded-full shadow-lg transition-all duration-300 focus-visible:ring-4",
                        isRecording 
                            ? "bg-destructive text-destructive-foreground animate-pulse"
                            : "bg-primary text-primary-foreground"
                    )}
                    disabled={isLoading}
                >
                    {isRecording ? <StopCircle className="h-10 w-10" /> : <Mic className="h-10 w-10" />}
                    <span className="sr-only">{isRecording ? t('stop') : t('record')}</span>
                </Button>
                <p className="text-muted-foreground">{isRecording ? t('recording') : t('clickToStart')}</p>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}
