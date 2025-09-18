"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CameraIcon, PromoteIcon } from "@/components/icons";
import { useLanguage } from "@/contexts/language-context";
import { photoToCatalog, PhotoToCatalogOutput } from "@/ai/flows/photo-to-catalog";
import Image from 'next/image';
import { Badge } from "@/components/ui/badge";
import { Loader2, Tag, CircleDollarSign, Captions, Edit, Save, XCircle, X, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MarketingEngineCard } from "./marketing-engine-card";


export function PhotoCatalogCard() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [catalog, setCatalog] = useState<PhotoToCatalogOutput | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isClient, setIsClient] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editedCatalog, setEditedCatalog] = useState<PhotoToCatalogOutput | null>(null);
  const [newAttribute, setNewAttribute] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      setCatalog(null);
      setIsEditing(false);

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64Photo = reader.result as string;
        setPreview(base64Photo);
        try {
          const result = await photoToCatalog({ photoDataUri: base64Photo });
          setCatalog(result);
          setEditedCatalog(result);
        } catch (error) {
          console.error("Error generating catalog:", error);
          toast({
            variant: "destructive",
            title: "AI Error",
            description: "Failed to generate catalog from photo.",
          });
        } finally {
          setIsLoading(false);
        }
      };
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedCatalog(catalog);
  };

  const handleSave = () => {
    setCatalog(editedCatalog);
    setIsEditing(false);
    toast({
        title: "Catalog Updated",
        description: "Your product details have been saved.",
    });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedCatalog) {
      setEditedCatalog({ ...editedCatalog, priceRange: e.target.value });
    }
  };

  const handleRemoveAttribute = (attrToRemove: string) => {
    if (editedCatalog) {
      setEditedCatalog({
        ...editedCatalog,
        attributes: editedCatalog.attributes.filter(attr => attr !== attrToRemove),
      });
    }
  };

  const handleAddAttribute = () => {
    if (newAttribute.trim() && editedCatalog) {
      setEditedCatalog({
        ...editedCatalog,
        attributes: [...editedCatalog.attributes, newAttribute.trim()],
      });
      setNewAttribute("");
    }
  };


  return (
    <Dialog>
      <Card className="flex h-full flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CameraIcon className="h-6 w-6 text-primary" />
            {t('photoToCatalogTitle')}
          </CardTitle>
          <CardDescription>{t('photoToCatalogDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-grow flex-col items-center justify-center space-y-4">
          <div className="relative flex h-48 w-full items-center justify-center rounded-lg border-2 border-dashed bg-muted/50">
            {isLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-lg bg-background/80">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">{t('generating')}</p>
              </div>
            )}
            {preview ? (
              <Image src={preview} alt="Product preview" layout="fill" objectFit="contain" className="rounded-lg" />
            ) : (
              <p className="text-sm text-muted-foreground">Your photo will appear here</p>
            )}
          </div>
          {isClient && (
            <>
              <Input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} disabled={isLoading} />
              <Button onClick={() => fileInputRef.current?.click()} className="w-full" disabled={isLoading}>
                <CameraIcon className="mr-2 h-5 w-5" />
                {preview ? 'Change Photo' : t('uploadPhoto')}
              </Button>
            </>
          )}
          {catalog && !isLoading && (
            <div className="w-full space-y-4 text-sm">
                {!isEditing && (
                    <div className="flex justify-end">
                        <Button variant="ghost" size="sm" onClick={handleEdit}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                        </Button>
                    </div>
                )}
              <div>
                <h4 className="mb-2 flex items-center gap-2 font-headline text-base font-medium">
                  <Tag className="h-4 w-4 text-primary" />
                  {t('attributes')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(isEditing ? editedCatalog?.attributes : catalog.attributes)?.map((attr, i) => (
                    <Badge key={i} variant="secondary" className="flex items-center gap-1">
                        {attr}
                        {isEditing && (
                            <button onClick={() => handleRemoveAttribute(attr)} className="rounded-full hover:bg-destructive/20">
                                <X className="h-3 w-3" />
                            </button>
                        )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <div className="mt-2 flex items-center gap-2">
                    <Input
                      value={newAttribute}
                      onChange={(e) => setNewAttribute(e.target.value)}
                      placeholder="Add an attribute"
                      className="h-8"
                    />
                    <Button onClick={handleAddAttribute} size="sm" variant="outline">
                      <PlusCircle className="mr-2 h-4 w-4" /> Add
                    </Button>
                  </div>
                )}
              </div>
              <div>
                <h4 className="mb-2 flex items-center gap-2 font-headline text-base font-medium">
                  <CircleDollarSign className="h-4 w-4 text-primary" />
                  {t('priceRange')}
                </h4>
                {isEditing && editedCatalog ? (
                    <Input value={editedCatalog.priceRange} onChange={handlePriceChange} />
                ) : (
                    <p className="font-semibold text-foreground">{catalog.priceRange}</p>
                )}
              </div>
              <div>
                <h4 className="mb-2 flex items-center gap-2 font-headline text-base font-medium">
                  <Captions className="h-4 w-4 text-primary" />
                  {t('captions')}
                </h4>
                <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                  {catalog.captions.map((cap, i) => <li key={i}>{cap}</li>)}
                </ul>
              </div>
              {isEditing && (
                <div className="flex justify-end gap-2">
                    <Button onClick={handleSave} size="sm"><Save className="mr-2 h-4 w-4" /> Save</Button>
                    <Button onClick={handleCancelEdit} variant="ghost" size="sm"><XCircle className="mr-2 h-4 w-4" /> Cancel</Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
        {catalog && !isLoading && !isEditing && (
          <CardFooter>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent/10 hover:text-accent">
                <PromoteIcon className="mr-2 h-5 w-5" />
                {t('promote')}
              </Button>
            </DialogTrigger>
          </CardFooter>
        )}
      </Card>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <MarketingEngineCard
          productName={catalog?.attributes.slice(0, 3).join(', ') || 'Handmade Product'}
          productDescription={catalog?.captions[0] || 'A beautiful handmade product.'}
          productPhotoDataUri={preview || ''}
          artisanName="Meera Bai"
          artisanCraft="Phulkari Embroidery"
          artisanRegion="Punjab"
        />
      </DialogContent>
    </Dialog>
  );
}
