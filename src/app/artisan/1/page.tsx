import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { MessageCircle, ShoppingCart } from "lucide-react";
import Image from "next/image";

export default function ArtisanPage() {
  const artisanImage = PlaceHolderImages.find(img => img.id === 'artisan-profile-1');

  const artisan = {
    name: "Meera Bai",
    craft: "Phulkari Embroidery",
    region: "Punjab, India",
    story: "From the vibrant fields of Punjab, I bring you the timeless art of Phulkari. Each thread tells a story, a tradition passed down through generations. My hands dance with the needle, weaving tales of celebration, nature, and life itself into every fabric. This is not just a craft; it is the soul of my land, a piece of my heart, offered to you.",
    voiceNoteUrl: "/placeholder-audio.mp3" // A placeholder audio file
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto max-w-2xl px-4 py-8 sm:py-12">
        <Card className="overflow-hidden shadow-2xl shadow-primary/10">
          <div className="relative h-48 w-full bg-gradient-to-r from-primary to-accent">
             {artisanImage && (
              <Image
                src={artisanImage.imageUrl}
                alt={artisan.name}
                layout="fill"
                objectFit="cover"
                className="opacity-20"
                data-ai-hint={artisanImage.imageHint}
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
                <Avatar className="h-32 w-32 border-4 border-background">
                {artisanImage && (
                    <AvatarImage src={artisanImage.imageUrl} alt={artisan.name} />
                )}
                    <AvatarFallback>{artisan.name.charAt(0)}</AvatarFallback>
                </Avatar>
            </div>
          </div>
          <CardHeader className="items-center text-center">
            <CardTitle className="font-headline text-4xl">{artisan.name}</CardTitle>
            <p className="text-lg text-primary">{artisan.craft}</p>
            <p className="text-sm text-muted-foreground">{artisan.region}</p>
          </CardHeader>
          <CardContent className="space-y-6 px-6 pb-6 text-center">
            <Separator />
            <div>
              <h3 className="mb-2 font-headline text-2xl text-primary">My Story</h3>
              <p className="text-lg leading-relaxed text-foreground/90">
                &ldquo;{artisan.story}&rdquo;
              </p>
            </div>
            <Separator />
            <div className="flex flex-col items-center gap-4">
               <h3 className="font-headline text-2xl text-primary">Hear My Voice</h3>
               <audio controls className="w-full max-w-sm rounded-full bg-card shadow-inner">
                 <source src={artisan.voiceNoteUrl} type="audio/mpeg" />
                 Your browser does not support the audio element.
               </audio>
            </div>
            <Separator />
            <Button
              asChild
              size="lg"
              className="w-full bg-green-500 text-white hover:bg-green-600"
            >
              <a href="https://wa.me/910000000000" target="_blank" rel="noopener noreferrer">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Buy on WhatsApp
              </a>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
