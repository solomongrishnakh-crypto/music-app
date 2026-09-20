import zlib from "zlib";

/**
 * Lädt und cached den Cliopatria-Datensatz (Seshat Global History Databank,
 * CC BY 4.0, github.com/Seshat-Global-History-Databank/cliopatria) — löst
 * das alte Problem fester Kartenstände alle paar Jahrzehnte (Nutzerkorrektur
 * 20.09.2026: "kannst du diese jahresraster fixieren ... fast jedes jahr
 * ändert sich die territoriums"): jedes der rund 14.000 Gebiets-Datensätze
 * trägt ein echtes FromYear/ToYear statt einer von wenigen fixen
 * Schnappschuss-Dateien, dadurch lässt sich für JEDES Kalenderjahr filtern.
 *
 * Das Dataset liegt auf GitHub als ZIP (wegen GitHub's Dateigrößen-Limit).
 * Statt dafür ein npm-Paket zu installieren — auf dem verbundenen PC ist
 * der npm-Registry-Zugriff durch eine Geräterichtlinie blockiert
 * ("npm error 403 ... registry.npmjs.org") — wird das simple ZIP-Format
 * hier direkt mit Node's eingebautem "zlib" ausgelesen (siehe
 * extractFirstZipEntry unten).
 */

// Nutzerkorrektur 20.09.2026 ("wo bleibt imperien?"): jsDelivr's GitHub-
// Proxy verweigert Dateien über 20 MB ("File size exceeded the configured
// limit of 20 MB") — das Cliopatria-ZIP ist aber ~42 MB (entpackt ~165 MB).
// Deshalb direkt von raw.githubusercontent.com laden (kein Größenlimit dort).
const ZIP_URL =
  "https://raw.githubusercontent.com/Seshat-Global-History-Databank/cliopatria/main/cliopatria.geojson.zip";

// Bewusst 30 Tage: der Datensatz ist eine wissenschaftliche Veröffentlichung
// und ändert sich praktisch nie; unnötig oft neu laden würde nur unnötig
// Zeit/Bandbreite kosten.
const CACHE_SECONDS = 60 * 60 * 24 * 30;

export interface CliopatriaFeature {
  type: "Feature";
  properties: {
    Name?: string;
    FromYear?: number;
    ToYear?: number;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  geometry: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface RawCliopatriaFeature {
  type: "Feature";
  properties?: {
    Name?: string;
    Type?: string;
    FromYear?: number;
    ToYear?: number;
    [key: string]: unknown;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  geometry?: any;
}

/**
 * Sehr kleiner, abhängigkeitsfreier ZIP-Entpacker für genau eine Datei in
 * einem ZIP-Archiv: liest End-of-Central-Directory -> Central-Directory-
 * Eintrag -> Local-File-Header -> komprimierte Daten (Methode 0 =
 * unkomprimiert gespeichert, 8 = DEFLATE, per Node "zlib" entpackt). Reicht
 * für ein simples Ein-Datei-ZIP wie das von GitHub erzeugte, ohne ein
 * npm-Paket wie "jszip"/"yauzl" zu benötigen.
 */
function extractFirstZipEntry(buffer: Buffer): Buffer {
  const eocdSignature = 0x06054b50;
  let eocdOffset = -1;
  for (let i = buffer.length - 22; i >= 0; i--) {
    if (buffer.readUInt32LE(i) === eocdSignature) {
      eocdOffset = i;
      break;
    }
  }
  if (eocdOffset === -1) {
    throw new Error("ZIP: End-of-Central-Directory nicht gefunden");
  }

  const centralDirOffset = buffer.readUInt32LE(eocdOffset + 16);
  const cdSignature = 0x02014b50;
  if (buffer.readUInt32LE(centralDirOffset) !== cdSignature) {
    throw new Error("ZIP: Central-Directory-Eintrag nicht gefunden");
  }

  const compressionMethod = buffer.readUInt16LE(centralDirOffset + 10);
  const compressedSize = buffer.readUInt32LE(centralDirOffset + 20);
  const localHeaderOffset = buffer.readUInt32LE(centralDirOffset + 42);

  const localSignature = 0x04034b50;
  if (buffer.readUInt32LE(localHeaderOffset) !== localSignature) {
    throw new Error("ZIP: Local-File-Header nicht gefunden");
  }
  const localFileNameLength = buffer.readUInt16LE(localHeaderOffset + 26);
  const localExtraLength = buffer.readUInt16LE(localHeaderOffset + 28);
  const dataStart = localHeaderOffset + 30 + localFileNameLength + localExtraLength;
  const compressedData = buffer.subarray(dataStart, dataStart + compressedSize);

  if (compressionMethod === 0) {
    return Buffer.from(compressedData);
  }
  if (compressionMethod === 8) {
    return zlib.inflateRawSync(compressedData);
  }
  throw new Error(`ZIP: nicht unterstützte Kompressionsmethode ${compressionMethod}`);
}

// Modul-weiter Cache: bleibt für die Lebensdauer der warmen Server-Instanz
// erhalten, damit nicht jede einzelne Anfrage das ~14.000 Einträge große
// Archiv erneut herunterladen und entpacken muss. Schlägt ein Versuch fehl,
// wird der Cache zurückgesetzt, damit der nächste Request es erneut
// versuchen kann statt für immer denselben Fehler zu wiederholen.
let cachedFeaturesPromise: Promise<CliopatriaFeature[]> | null = null;

export function loadCliopatriaFeatures(): Promise<CliopatriaFeature[]> {
  if (!cachedFeaturesPromise) {
    cachedFeaturesPromise = (async () => {
      const res = await fetch(ZIP_URL, { next: { revalidate: CACHE_SECONDS } });
      if (!res.ok) {
        throw new Error(`Cliopatria-Datensatz-Fehler (Status ${res.status})`);
      }
      const zipBuffer = Buffer.from(await res.arrayBuffer());
      const jsonBuffer = extractFirstZipEntry(zipBuffer);
      const parsed: unknown = JSON.parse(jsonBuffer.toString("utf-8"));
      const rawFeatures: RawCliopatriaFeature[] =
        parsed && typeof parsed === "object" && Array.isArray((parsed as { features?: unknown }).features)
          ? ((parsed as { features: RawCliopatriaFeature[] }).features)
          : [];

      // Nur echte Territorien ("POLITY") — "RELATION"-Einträge beschreiben
      // z.B. Vasallen-/Bündnisbeziehungen, keine eigene Fläche. Auf die
      // wirklich benötigten Felder eindampfen (Wikipedia/Wikidata/SeshatID/
      // Area werden hier nicht gebraucht) — hält den warmgehaltenen
      // Server-Cache kleiner, bei ~14.000 Einträgen und einer ~165 MB
      // großen Rohdatei nicht unerheblich.
      const features: CliopatriaFeature[] = [];
      for (const f of rawFeatures) {
        if (f?.properties?.Type !== "POLITY" || !f.geometry) continue;
        features.push({
          type: "Feature",
          properties: {
            Name: f.properties.Name,
            FromYear: f.properties.FromYear,
            ToYear: f.properties.ToYear,
          },
          geometry: f.geometry,
        });
      }
      return features;
    })();
    cachedFeaturesPromise.catch(() => {
      cachedFeaturesPromise = null;
    });
  }
  return cachedFeaturesPromise;
}
