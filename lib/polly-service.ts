import { SynthesizeSpeechCommand, SynthesizeSpeechCommandInput, LanguageCode, VoiceId } from "@aws-sdk/client-polly";
import { pollyClient } from "./aws-config";

// 语音配置映射
const voiceIdMap = {
  "en-US": {
    female: "Salli" as VoiceId,
    male: "Justin" as VoiceId
  },
  "en-GB": {
    female: "Emma" as VoiceId,
    male: "Brian" as VoiceId
  },
  "en-AU": {
    female: "Nicole" as VoiceId,
    male: "Russell" as VoiceId
  },
  "zh-CN": {
    female: "Zhiyu" as VoiceId,
    male: "Zhiyu" as VoiceId
  },
  "fr-FR": {
    female: "Celine" as VoiceId,
    male: "Mathieu" as VoiceId
  },
  "es-ES": {
    female: "Conchita" as VoiceId,
    male: "Enrique" as VoiceId
  },
  "es-MX": {
    female: "Mia" as VoiceId,
    male: "Andres" as VoiceId
  },
  "de-DE": {
    female: "Marlene" as VoiceId,
    male: "Hans" as VoiceId
  },
  "it-IT": {
    female: "Carla" as VoiceId,
    male: "Giorgio" as VoiceId
  },
  "ja-JP": {
    female: "Mizuki" as VoiceId,
    male: "Takumi" as VoiceId
  },
  "ko-KR": {
    female: "Seoyeon" as VoiceId,
    male: "Seoyeon" as VoiceId
  },
  "pt-BR": {
    female: "Vitoria" as VoiceId,
    male: "Ricardo" as VoiceId
  },
  "pt-PT": {
    female: "Ines" as VoiceId,
    male: "Cristiano" as VoiceId
  },
  "pl-PL": {
    female: "Ewa" as VoiceId,
    male: "Jacek" as VoiceId
  },
  "ru-RU": {
    female: "Tatyana" as VoiceId,
    male: "Maxim" as VoiceId
  },
  "tr-TR": {
    female: "Filiz" as VoiceId,
    male: "Filiz" as VoiceId
  },
  "hi-IN": {
    female: "Aditi" as VoiceId,
    male: "Aditi" as VoiceId
  }
};

const languageCodeMap = {
  "en-US": "en-US" as LanguageCode,
  "en-GB": "en-GB" as LanguageCode,
  "en-AU": "en-AU" as LanguageCode,
  "zh-CN": "cmn-CN" as LanguageCode,
  "fr-FR": "fr-FR" as LanguageCode,
  "es-ES": "es-ES" as LanguageCode,
  "es-MX": "es-MX" as LanguageCode,
  "de-DE": "de-DE" as LanguageCode,
  "it-IT": "it-IT" as LanguageCode,
  "ja-JP": "ja-JP" as LanguageCode,
  "ko-KR": "ko-KR" as LanguageCode,
  "pt-BR": "pt-BR" as LanguageCode,
  "pt-PT": "pt-PT" as LanguageCode,
  "pl-PL": "pl-PL" as LanguageCode,
  "ru-RU": "ru-RU" as LanguageCode,
  "tr-TR": "tr-TR" as LanguageCode,
  "hi-IN": "hi-IN" as LanguageCode
};

export interface SpeechOptions {
  text: string;
  language: string;
  isFemale: boolean;
  speed: number;
}

export async function synthesizeSpeech({
  text,
  language,
  isFemale,
  speed
}: SpeechOptions): Promise<ArrayBuffer> {
  try {
    const voices = voiceIdMap[language as keyof typeof voiceIdMap] || voiceIdMap["en-US"];
    const voiceId = isFemale ? voices.female : voices.male;
    const languageCode = languageCodeMap[language as keyof typeof languageCodeMap] || languageCodeMap["en-US"];

    const input: SynthesizeSpeechCommandInput = {
      Engine: "standard",
      LanguageCode: languageCode,
      OutputFormat: "mp3",
      SampleRate: "24000",
      Text: text,
      TextType: "text",
      VoiceId: voiceId,
    };

    const command = new SynthesizeSpeechCommand(input);
    const response = await pollyClient.send(command);

    if (!response.AudioStream) {
      throw new Error("No audio stream returned");
    }

    const audioArrayBuffer = await response.AudioStream.transformToByteArray();
    return new Uint8Array(audioArrayBuffer).buffer as ArrayBuffer;
  } catch (error) {
    console.error("Error synthesizing speech:", error);
    throw error;
  }
}

export async function playPollyAudio(audioData: ArrayBuffer, speed: number = 1) {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const audioBuffer = await audioContext.decodeAudioData(audioData);
  
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.playbackRate.value = speed;
  source.connect(audioContext.destination);
  source.start(0);
  
  return new Promise((resolve) => {
    source.onended = () => {
      resolve(undefined);
    };
  });
}

export async function downloadAudio(audioData: ArrayBuffer, filename: string) {
  const blob = new Blob([audioData], { type: 'audio/mp3' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function hasSingleVoice(language: string): boolean {
  const voices = voiceIdMap[language as keyof typeof voiceIdMap];
  if (!voices) return false;
  return voices.female === voices.male;
} 