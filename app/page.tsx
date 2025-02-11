"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Volume2, Upload, Languages, Sun, Moon, Globe, Download } from "lucide-react";
import { useTheme } from "next-themes";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/lib/i18n/language-context";
import { synthesizeSpeech, playPollyAudio, hasSingleVoice, downloadAudio } from "@/lib/polly-service";

const languages = [
  { code: "en-US", name: "English (US)" },
  { code: "en-GB", name: "English (UK)" },
  { code: "en-AU", name: "English (Australia)" },
  { code: "zh-CN", name: "中文 (Chinese)" },
  { code: "fr-FR", name: "Français (French)" },
  { code: "es-ES", name: "Español (Spanish)" },
  { code: "es-MX", name: "Español MX (Spanish Mexico)" },
  { code: "de-DE", name: "Deutsch (German)" },
  { code: "it-IT", name: "Italiano (Italian)" },
  { code: "ja-JP", name: "日本語 (Japanese)" },
  { code: "ko-KR", name: "한국어 (Korean)" },
  { code: "pt-BR", name: "Português BR (Portuguese Brazil)" },
  { code: "pt-PT", name: "Português (Portuguese)" },
  { code: "pl-PL", name: "Polski (Polish)" },
  { code: "ru-RU", name: "Русский (Russian)" },
  { code: "tr-TR", name: "Türkçe (Turkish)" },
  { code: "hi-IN", name: "हिन्दी (Hindi)" }
];

export default function Home() {
  const { t, language, setLanguage } = useLanguage();
  const [text, setText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  const [speed, setSpeed] = useState(1);
  const [isFemaleVoice, setIsFemaleVoice] = useState(true);
  const [isWordByWord, setIsWordByWord] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();
  const [lastGeneratedAudio, setLastGeneratedAudio] = useState<ArrayBuffer | null>(null);

  useEffect(() => {
    setMounted(true);
    
    // Initialize voices
    const initVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    initVoices();
    window.speechSynthesis.onvoiceschanged = initVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    if (hasSingleVoice(selectedLanguage)) {
      setIsFemaleVoice(true);
    }
  }, [selectedLanguage]);

  const speak = async () => {
    try {
      if (!text) {
        toast({
          title: t("noTextError"),
          description: t("pleaseEnterText"),
          variant: "destructive",
        });
        return;
      }

      let audioData: ArrayBuffer | undefined;

      if (isWordByWord) {
        const words = text.split(/\s+/);
        for (const word of words) {
          audioData = await synthesizeSpeech({
            text: word,
            language: selectedLanguage,
            isFemale: isFemaleVoice,
            speed,
          });
          await playPollyAudio(audioData, speed);
        }
      } else {
        audioData = await synthesizeSpeech({
          text,
          language: selectedLanguage,
          isFemale: isFemaleVoice,
          speed,
        });
        await playPollyAudio(audioData, speed);
      }

      if (audioData) {
        setLastGeneratedAudio(audioData);
      }
    } catch (error) {
      console.error("Speech synthesis error:", error);
      toast({
        title: t("error"),
        description: t("speechError"),
        variant: "destructive",
      });
    }
  };

  const handleDownload = async () => {
    try {
      if (!text) {
        toast({
          title: t("noTextError"),
          description: t("pleaseEnterText"),
          variant: "destructive",
        });
        return;
      }

      const audioData = await synthesizeSpeech({
        text,
        language: selectedLanguage,
        isFemale: isFemaleVoice,
        speed,
      });

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `audio_${selectedLanguage}_${timestamp}.mp3`;
      await downloadAudio(audioData, filename);
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: t("error"),
        description: t("downloadError"),
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        // 处理纯文本文件
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setText(content);
        };
        reader.readAsText(file);
      } else if (file.type === 'application/pdf') {
        // 处理 PDF 文件
        toast({
          title: t("error"),
          description: t("pdfNotSupported"),
          variant: "destructive",
        });
      } else if (file.type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx') || file.name.endsWith('.rtf')) {
        // 处理 Word 文件
        toast({
          title: t("error"),
          description: t("wordNotSupported"),
          variant: "destructive",
        });
      } else {
        toast({
          title: t("error"),
          description: t("unsupportedFormat"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("File upload error:", error);
      toast({
        title: t("error"),
        description: t("uploadError"),
        variant: "destructive",
      });
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-foreground flex items-center gap-2">
            <Languages className="h-8 w-8" />
            {t('title')}
          </h1>
          <div className="flex gap-2">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[120px]">
                <Globe className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="it">Italiano</SelectItem>
                <SelectItem value="ja">日本語</SelectItem>
                <SelectItem value="ko">한국어</SelectItem>
                <SelectItem value="pt">Português</SelectItem>
                <SelectItem value="pl">Polski</SelectItem>
                <SelectItem value="ru">Русский</SelectItem>
                <SelectItem value="tr">Türkçe</SelectItem>
                <SelectItem value="hi">हिन्दी</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('readText')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder={t('inputPlaceholder')}
              className="min-h-[200px]"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex gap-4">
              <Button onClick={speak} className="flex-1">
                <Volume2 className="mr-2 h-4 w-4" />
                {t('readText')}
              </Button>
              <Button variant="outline" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                {t('downloadAudio')}
              </Button>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".txt,.md,.doc,.docx,.rtf,.pdf"
                  className="hidden"
                  id="file-upload"
                />
                <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                  <Upload className="mr-2 h-4 w-4" />
                  {t('uploadFile')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('selectLanguage')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>{t('selectLanguage')}</Label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('speed')}: {speed}x</Label>
                <Slider
                  value={[speed]}
                  onValueChange={([value]) => setSpeed(value)}
                  min={0.5}
                  max={2}
                  step={0.1}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>{t('voice')}</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {isFemaleVoice ? t('female') : t('male')}
                  </span>
                  <Switch
                    checked={isFemaleVoice}
                    onCheckedChange={setIsFemaleVoice}
                    disabled={hasSingleVoice(selectedLanguage)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label>{t('wordByWord')}</Label>
                <Switch
                  checked={isWordByWord}
                  onCheckedChange={setIsWordByWord}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}