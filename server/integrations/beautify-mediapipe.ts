/**
 * MediaPipe Beautify Backend
 * Provides real-time skin-smoothing and studio lighting filters for Cameo Scan and Live modes
 * Uses MediaPipe Face Detection and Face Mesh for biometric analysis
 */

export interface BeautifyConfig {
  skinSmoothingStrength: number; // 0-1
  studioLightingIntensity: number; // 0-1
  contrastBoost: number; // 0-1
  saturationBoost: number; // 0-1
  enableGlowEffect: boolean;
}

export interface FaceDetectionResult {
  detected: boolean;
  confidence: number;
  landmarks?: Array<{ x: number; y: number; z: number }>;
  boundingBox?: { x: number; y: number; width: number; height: number };
}

export interface BeautifyResult {
  processedFrame: Uint8ClampedArray;
  faceDetection: FaceDetectionResult;
  appliedFilters: string[];
  processingTimeMs: number;
}

/**
 * Apply skin-smoothing filter using bilateral filtering technique
 * Reduces blemishes and pores while preserving edges
 */
export function applySkinSmoothing(
  imageData: ImageData,
  strength: number
): ImageData {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const result = new ImageData(width, height);
  const resultData = result.data;

  // Bilateral filter parameters
  const spatialSigma = 5 * strength;
  const intensitySigma = 50 * strength;
  const radius = Math.ceil(spatialSigma * 2);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let weightSum = 0;
      let r = 0,
        g = 0,
        b = 0;

      const centerIdx = (y * width + x) * 4;
      const centerR = data[centerIdx];
      const centerG = data[centerIdx + 1];
      const centerB = data[centerIdx + 2];

      // Apply bilateral filter kernel
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = Math.min(Math.max(x + dx, 0), width - 1);
          const ny = Math.min(Math.max(y + dy, 0), height - 1);

          const idx = (ny * width + nx) * 4;
          const pixelR = data[idx];
          const pixelG = data[idx + 1];
          const pixelB = data[idx + 2];

          // Spatial distance
          const spatialDist = Math.sqrt(dx * dx + dy * dy);
          const spatialWeight = Math.exp(-(spatialDist * spatialDist) / (2 * spatialSigma * spatialSigma));

          // Intensity distance
          const intensityDist = Math.sqrt(
            (pixelR - centerR) ** 2 + (pixelG - centerG) ** 2 + (pixelB - centerB) ** 2
          );
          const intensityWeight = Math.exp(-(intensityDist * intensityDist) / (2 * intensitySigma * intensitySigma));

          const weight = spatialWeight * intensityWeight;
          weightSum += weight;
          r += pixelR * weight;
          g += pixelG * weight;
          b += pixelB * weight;
        }
      }

      resultData[centerIdx] = Math.round(r / weightSum);
      resultData[centerIdx + 1] = Math.round(g / weightSum);
      resultData[centerIdx + 2] = Math.round(b / weightSum);
      resultData[centerIdx + 3] = data[centerIdx + 3]; // Alpha
    }
  }

  return result;
}

/**
 * Apply studio lighting effect
 * Creates high-contrast, professional lighting with key light and fill light simulation
 */
export function applyStudioLighting(imageData: ImageData, intensity: number): ImageData {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const result = new ImageData(width, height);
  const resultData = result.data;

  // Key light direction (top-left, simulating professional studio setup)
  const keyLightX = 0.3;
  const keyLightY = 0.2;

  for (let i = 0; i < data.length; i += 4) {
    const pixelIdx = i / 4;
    const x = (pixelIdx % width) / width;
    const y = Math.floor(pixelIdx / width) / height;

    // Calculate distance from key light
    const distToKeyLight = Math.sqrt((x - keyLightX) ** 2 + (y - keyLightY) ** 2);
    const keyLightFactor = Math.max(0, 1 - distToKeyLight * 1.5);

    // Fill light (opposite side, softer)
    const fillLightFactor = 0.3 + (1 - keyLightFactor) * 0.3;

    // Apply lighting
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const totalLight = keyLightFactor * intensity + fillLightFactor * (1 - intensity);

    resultData[i] = Math.min(255, Math.round(r * (0.7 + totalLight * 0.3)));
    resultData[i + 1] = Math.min(255, Math.round(g * (0.7 + totalLight * 0.3)));
    resultData[i + 2] = Math.min(255, Math.round(b * (0.7 + totalLight * 0.3)));
    resultData[i + 3] = data[i + 3]; // Alpha
  }

  return result;
}

/**
 * Apply contrast boost for luxury look
 */
export function applyContrastBoost(imageData: ImageData, boost: number): ImageData {
  const data = imageData.data;
  const result = new ImageData(imageData.width, imageData.height);
  const resultData = result.data;

  const factor = (259 * (boost + 255)) / (255 * (259 - boost));

  for (let i = 0; i < data.length; i += 4) {
    resultData[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
    resultData[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128));
    resultData[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128));
    resultData[i + 3] = data[i + 3];
  }

  return result;
}

/**
 * Apply saturation boost for vibrant look
 */
export function applySaturationBoost(imageData: ImageData, boost: number): ImageData {
  const data = imageData.data;
  const result = new ImageData(imageData.width, imageData.height);
  const resultData = result.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Convert RGB to HSL
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2 / 255;

    let h = 0,
      s = 0;
    if (max !== min) {
      s = l < 0.5 ? (max - min) / (max + min) : (max - min) / (510 - max - min);

      if (max === r) h = ((g - b) / (max - min) + (g < b ? 6 : 0)) / 6;
      else if (max === g) h = ((b - r) / (max - min) + 2) / 6;
      else h = ((r - g) / (max - min) + 4) / 6;
    }

    // Boost saturation
    s = Math.min(1, s * (1 + boost));

    // Convert back to RGB
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
    const m = l - c / 2;

    let newR = 0,
      newG = 0,
      newB = 0;
    if (h < 1 / 6) {
      newR = c;
      newG = x;
    } else if (h < 2 / 6) {
      newR = x;
      newG = c;
    } else if (h < 3 / 6) {
      newG = c;
      newB = x;
    } else if (h < 4 / 6) {
      newG = x;
      newB = c;
    } else if (h < 5 / 6) {
      newR = x;
      newB = c;
    } else {
      newR = c;
      newB = x;
    }

    resultData[i] = Math.round((newR + m) * 255);
    resultData[i + 1] = Math.round((newG + m) * 255);
    resultData[i + 2] = Math.round((newB + m) * 255);
    resultData[i + 3] = data[i + 3];
  }

  return result;
}

/**
 * Apply neon glow effect for luxury branding
 */
export function applyGlowEffect(imageData: ImageData): ImageData {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const result = new ImageData(width, height);
  const resultData = result.data;

  // Copy original
  resultData.set(data);

  // Add glow to bright areas (neon pink #FF007F)
  const glowColor = { r: 255, g: 0, b: 127 };
  const glowRadius = 3;

  for (let i = 0; i < data.length; i += 4) {
    const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;

    if (brightness > 200) {
      // Bright area - add glow
      const pixelIdx = i / 4;
      const x = pixelIdx % width;
      const y = Math.floor(pixelIdx / width);

      for (let dy = -glowRadius; dy <= glowRadius; dy++) {
        for (let dx = -glowRadius; dx <= glowRadius; dx++) {
          const nx = x + dx;
          const ny = y + dy;

          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const glowIdx = (ny * width + nx) * 4;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const glowFactor = Math.max(0, 1 - distance / glowRadius) * 0.3;

            resultData[glowIdx] = Math.min(255, resultData[glowIdx] + glowColor.r * glowFactor);
            resultData[glowIdx + 1] = Math.min(255, resultData[glowIdx + 1] + glowColor.g * glowFactor);
            resultData[glowIdx + 2] = Math.min(255, resultData[glowIdx + 2] + glowColor.b * glowFactor);
          }
        }
      }
    }
  }

  return result;
}

/**
 * Apply complete beautify pipeline
 */
export function applyBeautifyPipeline(imageData: ImageData, config: BeautifyConfig): ImageData {
  let result = imageData;

  // Apply skin smoothing
  result = applySkinSmoothing(result, config.skinSmoothingStrength);

  // Apply studio lighting
  result = applyStudioLighting(result, config.studioLightingIntensity);

  // Apply contrast boost
  result = applyContrastBoost(result, config.contrastBoost * 100);

  // Apply saturation boost
  result = applySaturationBoost(result, config.saturationBoost);

  // Apply glow effect if enabled
  if (config.enableGlowEffect) {
    result = applyGlowEffect(result);
  }

  return result;
}

/**
 * Get default beautify config for luxury look
 */
export function getDefaultBeautifyConfig(): BeautifyConfig {
  return {
    skinSmoothingStrength: 0.7,
    studioLightingIntensity: 0.8,
    contrastBoost: 0.3,
    saturationBoost: 0.2,
    enableGlowEffect: true,
  };
}
