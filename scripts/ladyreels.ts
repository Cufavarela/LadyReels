// scripts/ladyreels.ts
//
// Pasos 2, 3 y 4 del protocolo ladyReels:
//   2. SCAN        -> encuentra y ordena los clips en public/raw-clips/
//   3. TRANSCRIBE  -> extrae audio y transcribe con timestamps por palabra
//   4. UPDATE       -> mergea el resultado en config.json (con backup)
//
// El render (paso 5) queda AFUERA de este script a propósito.
// Se corre por separado con: npm run render

import { readdir, readFile, writeFile, copyFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
//@ts-ignore
import ffprobeStatic from "ffprobe-static";
import { nodewhisper } from "nodejs-whisper";

// No dependemos de que el usuario tenga ffmpeg instalado en el sistema:
// usamos los binarios estáticos que vienen como dependencia npm.
ffmpeg.setFfmpegPath(ffmpegStatic as unknown as string);
ffmpeg.setFfprobePath(ffprobeStatic.path);

// ---------- Configuración ----------
const FPS = 30;
const RAW_CLIPS_DIR = path.join(process.cwd(), "public", "raw-clips");
const TEMP_AUDIO_DIR = path.join(process.cwd(), ".ladyreels-tmp");
const CONFIG_PATH = path.join(process.cwd(), "config.json");
const VIDEO_EXTENSIONS = [".mp4", ".mov"];
const WHISPER_MODEL = "medium"; // tiny/base/small/medium/large
const WHISPER_LANGUAGE = "es";

interface WhisperWord {
  word: string;
  start: number; // segundos
  end: number; // segundos
}

interface SceneEntry {
  video: string;
  durationInFrames: number;
  startFrom: number;             // Inicializado en 0 para que Claude decida el recorte
  endAt: number;                 // Inicializado en la duración total para que Claude decida el recorte
  zoomWindows: { startFrame: number; endFrame: number }[];
  graphicWindows: { startFrame: number; endFrame: number; type: string; label: string }[];
  words: { text: string; startFrame: number; endFrame: number }[];
}

// ---------- PASO 2: SCAN ----------
async function scanClips(): Promise<string[]> {
  if (!existsSync(RAW_CLIPS_DIR)) {
    throw new Error(`No se encontró la carpeta: ${RAW_CLIPS_DIR}`);
  }

  const files = await readdir(RAW_CLIPS_DIR);
  const clips = files.filter((f) =>
    VIDEO_EXTENSIONS.includes(path.extname(f).toLowerCase())
  );

  if (clips.length === 0) {
    throw new Error(
      `No se encontraron archivos ${VIDEO_EXTENSIONS.join("/")} en ${RAW_CLIPS_DIR}`
    );
  }

  // Natural sort: "2.mp4" antes que "10.mp4" (a diferencia del sort lexicográfico normal)
  clips.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  return clips;
}

// ---------- Utilidades de audio / duración ----------
function getDurationInSeconds(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, data) => {
      if (err) return reject(err);
      resolve(data.format.duration ?? 0);
    });
  });
}

function extractAudio(videoPath: string, audioPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .noVideo()
      .audioFrequency(16000) // Whisper prefiere 16kHz
      .audioChannels(1) // mono
      .format("wav")
      .on("end", () => resolve())
      .on("error", reject)
      .save(audioPath);
  });
}

function secondsToFrame(seconds: number): number {
  return Math.round(seconds * FPS);
}

// ---------- PASO 3: TRANSCRIBE ----------
async function transcribeAudio(audioPath: string): Promise<WhisperWord[]> {
  await nodewhisper(audioPath, {
    modelName: WHISPER_MODEL,
    autoDownloadModelName: WHISPER_MODEL,
    whisperOptions: {
      outputInJson: true,
      language: WHISPER_LANGUAGE,
      // NOTA: el flag exacto para timestamps por palabra puede llamarse distinto
      // según la versión de nodejs-whisper que termines instalando (ej. wordTimestamps,
      // word_timestamps, o requerir un flag de whisper.cpp aparte). Revisar el README
      // de la versión instalada y ajustar esta línea si el JSON no trae "words".
      wordTimestamps: true,
    },
  });

  // nodejs-whisper genera el .json al lado del archivo de audio de entrada.
  const jsonPath = audioPath.replace(/\.wav$/, ".json");
  if (!existsSync(jsonPath)) {
    throw new Error(
      `No se generó el archivo esperado: ${jsonPath}. Revisar opciones de whisperOptions.`
    );
  }

  const raw = await readFile(jsonPath, "utf-8");
  const parsed = JSON.parse(raw);

  // Estructura esperada (puede variar): { transcription: [{ words: [{word,start,end}] }] }
  // Ajustar este mapeo si tu versión devuelve un shape distinto.
  const words: WhisperWord[] = parsed.transcription.flatMap((segment: any) =>
    (segment.words ?? []).map((w: any) => ({
      word: String(w.word).trim(),
      start: w.start,
      end: w.end,
    }))
  );

  return words;
}

// ---------- PASO 4: UPDATE ARCHITECTURE ----------
async function updateConfig(scenes: SceneEntry[]) {
  let existingConfig: Record<string, any> = {};

  if (existsSync(CONFIG_PATH)) {
    const backupPath = CONFIG_PATH.replace(".json", `.backup-${Date.now()}.json`);
    await copyFile(CONFIG_PATH, backupPath);
    console.log(`Backup del config.json anterior guardado en: ${backupPath}`);
    existingConfig = JSON.parse(await readFile(CONFIG_PATH, "utf-8"));
  }

  // Estructuramos el plano definitivo. Mantenemos tus estilos fijos de la tipografía Anton
  const newConfig = {
    ...existingConfig,
    timeline: {
      ...(existingConfig.timeline ?? {}),
      scenes, // Inyectamos el mapa dinámico de escenas con subtítulos locales
      words: [] // Nos aseguramos de limpiar la lista global vieja para evitar duplicados
    },
  };

  const serialized = JSON.stringify(newConfig, null, 2);
  await writeFile(CONFIG_PATH, serialized, "utf-8");
  console.log(`✅ config.json actualizado: ${scenes.length} escenas listas con transcripción real.`);
}

// ---------- ORQUESTACIÓN ----------
async function main() {
  console.log("Zesamme simmer stark, FC Köööööööölle 🤍❤️🐐");

  await mkdir(TEMP_AUDIO_DIR, { recursive: true });

  const clipNames = await scanClips();
  console.log(`Encontrados ${clipNames.length} clips:`, clipNames);

  const scenes: SceneEntry[] = [];

  for (const clipName of clipNames) {
    const videoPath = path.join(RAW_CLIPS_DIR, clipName);
    const audioPath = path.join(TEMP_AUDIO_DIR, clipName.replace(path.extname(clipName), ".wav"));

    console.log(`Procesando ${clipName} de forma real...`);

    // 1. ffprobe mide el tamaño real exacto del clip de video de entrada
    const durationSec = await getDurationInSeconds(videoPath);
    const durationFrames = secondsToFrame(durationSec);

    // 2. Extraemos el canal de audio limpio compatible con IA
    await extractAudio(videoPath, audioPath);

    // 3. Whisper escucha el habla real y nos devuelve las palabras con timestamps de segundos
    const transcribedWords = await transcribeAudio(audioPath);

    // 4. Mapeamos los subtítulos en TIEMPO LOCAL (relativos al inicio de este video, empezando en frame 0)
    const sceneWords = transcribedWords.map((w) => ({
      text: w.word,
      startFrame: secondsToFrame(w.start),
      endFrame: secondsToFrame(w.end),
    }));

    // 5. Ensamblamos la escena limpia. Dejamos los controles de efectos vacíos 
    // e inicializamos startFrom/endAt en el rango completo para que Claude tome el control.
    scenes.push({
      video: `raw-clips/${clipName}`,
      durationInFrames: durationFrames,
      startFrom: 0,
      endAt: durationFrames,
      zoomWindows: [],
      graphicWindows: [],
      words: sceneWords, // Subtítulos reales indexados localmente adentro del clip
    });
  }

  // 6. Escribimos la estructura base en el config.json
  await updateConfig(scenes);
  console.log("🎉 Pipeline nativo completado. Pista libre para la dirección creativa de Claude.");
}

main().catch((err) => {
  console.error("Error en el pipeline de ladyReels:", err);
  process.exit(1);
});