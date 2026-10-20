import type {
  FaceLandmarker as FaceLandmarkerType,
  FaceLandmarkerResult,
} from "@mediapipe/tasks-vision";

// ตัวแปรแคชสำหรับเก็บ instance ของ FaceLandmarker โหลดครั้งเดียวแล้วใช้ซ้ำ
let landmarkerPromise: Promise<FaceLandmarkerType> | null = null;

// พาธสำหรับ WASM และ Model ทั้งแบบ Local และ CDN สำรอง
const WASM_LOCAL_PATH = "/mediapipe/wasm";
const WASM_CDN_PATH = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm";
const MODEL_LOCAL_PATH = "/mediapipe/face_landmarker.task";
const MODEL_CDN_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

export const NO_FACE_ERROR_MESSAGE =
  "ไม่พบใบหน้าในรูปภาพ กรุณาถ่ายหน้าตรงให้เห็นชัดเจนครับ";

/**
 * ดึง FaceLandmarker instance (Singleton)
 * กำหนด outputFaceBlendshapes: true เพื่อให้ได้ blendshapes สำหรับตรวจสอบใบหน้า
 */
export function getFaceLandmarker(): Promise<FaceLandmarkerType> {
  if (!landmarkerPromise) {
    landmarkerPromise = (async () => {
      // โหลดเฉพาะฝั่ง Client
      const { FaceLandmarker, FilesetResolver } = await import(
        "@mediapipe/tasks-vision"
      );

      // 1. โหลด WASM fileset (ลอง Local ก่อน หากไม่สำเร็จให้ Fallback ไปที่ CDN)
      let vision;
      try {
        vision = await FilesetResolver.forVisionTasks(WASM_LOCAL_PATH);
      } catch (wasmErr) {
        console.warn(
          "MediaPipe local WASM failed, falling back to CDN:",
          wasmErr
        );
        vision = await FilesetResolver.forVisionTasks(WASM_CDN_PATH);
      }

      // 2. สร้าง FaceLandmarker จาก model task (ลอง Local ก่อน หากไม่สำเร็จใช้ Google CDN)
      try {
        return await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: MODEL_LOCAL_PATH,
            delegate: "CPU",
          },
          outputFaceBlendshapes: true,
          runningMode: "IMAGE",
          numFaces: 1,
          minFaceDetectionConfidence: 0.5,
          minFacePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });
      } catch (modelErr) {
        console.warn(
          "MediaPipe local model failed, falling back to CDN:",
          modelErr
        );
        return await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: MODEL_CDN_URL,
            delegate: "CPU",
          },
          outputFaceBlendshapes: true,
          runningMode: "IMAGE",
          numFaces: 1,
          minFaceDetectionConfidence: 0.5,
          minFacePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });
      }
    })().catch((err) => {
      // หากเกิดข้อผิดพลาด ให้ล้างค่า เพื่อให้เรียกใหม่ได้
      landmarkerPromise = null;
      throw err;
    });
  }
  return landmarkerPromise;
}

export interface FaceValidationResult {
  isValid: boolean;
  errorMessage?: string;
  result?: FaceLandmarkerResult;
}

/**
 * ตรวจสอบความถูกต้องของใบหน้าด้วย Google MediaPipe Tasks Vision
 * Condition:
 * 1. ตรวจพบใบหน้าอย่างน้อย 1 หน้า (faceLandmarks.length > 0)
 * 2. มี Face Blendshapes (faceBlendshapes.length > 0)
 * 3. หากไม่พบใบหน้าหรือความมั่นใจต่ำ ให้ปฏิเสธรูปภาพและแจ้งเตือน:
 *    "ไม่พบใบหน้าในรูปภาพ กรุณาถ่ายหน้าตรงให้เห็นชัดเจนครับ"
 */
export async function validateFace(
  source: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | string
): Promise<FaceValidationResult> {
  try {
    let targetElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement;

    if (typeof source === "string") {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = source;

      if (img.complete && img.naturalWidth > 0) {
        targetElement = img;
      } else {
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () =>
            reject(new Error("Failed to load image for face detection"));
        });
        targetElement = img;
      }
    } else {
      targetElement = source;
    }

    const landmarker = await getFaceLandmarker();

    // ดักจับข้อความ INFO จาก XNNPACK ของ MediaPipe เพื่อไม่ให้ Dev Overlay ขึ้นเตือน
    const originalError = console.error;
    console.error = (...args: unknown[]) => {
      if (typeof args[0] === "string" && args[0].includes("XNNPACK")) return;
      originalError(...args);
    };

    let result: FaceLandmarkerResult;
    try {
      result = landmarker.detect(targetElement);
    } finally {
      console.error = originalError;
    }

    // ตรวจสอบเงื่อนไข Face Validation
    const hasLandmarks =
      Array.isArray(result.faceLandmarks) && result.faceLandmarks.length > 0;
    const hasBlendshapes =
      Array.isArray(result.faceBlendshapes) && result.faceBlendshapes.length > 0;

    if (!hasLandmarks || !hasBlendshapes) {
      return {
        isValid: false,
        errorMessage: NO_FACE_ERROR_MESSAGE,
        result,
      };
    }

    return {
      isValid: true,
      result,
    };
  } catch (err) {
    console.error("Face validation error:", err);
    return {
      isValid: false,
      errorMessage: NO_FACE_ERROR_MESSAGE,
    };
  }
}