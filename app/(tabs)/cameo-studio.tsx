/**
 * Cameo Studio - Real Camera + 3D Face Mesh Head-Turn Scan
 * Uses expo-camera for live camera preview
 * Steps: Look Center -> Turn Right -> Turn Left -> Look Up
 */

import { View, Text, Pressable, Image, Platform } from "react-native";
import { useState, useEffect, useRef } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";

const LOGO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663582603941/kdagQAS7AgDbyomZNfYzdv/big-starz-logo-MNPkwqFDvjz997BmgkJDyA.webp";

type ScanStep = "idle" | "center" | "right" | "left" | "up" | "complete";

interface ScanInstruction {
  step: ScanStep;
  label: string;
  icon: string;
  description: string;
  arrow: string;
}

const SCAN_STEPS: ScanInstruction[] = [
  { step: "center", label: "Look Center", icon: "\u{1F464}", description: "Face the camera directly", arrow: "\u{1F7E2}" },
  { step: "right", label: "Turn Right", icon: "\u27A1\uFE0F", description: "Slowly turn your head to the right", arrow: "\u27A1\uFE0F" },
  { step: "left", label: "Turn Left", icon: "\u2B05\uFE0F", description: "Slowly turn your head to the left", arrow: "\u2B05\uFE0F" },
  { step: "up", label: "Look Up", icon: "\u2B06\uFE0F", description: "Tilt your head slightly upward", arrow: "\u2B06\uFE0F" },
];

export default function CameoStudioScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanState, setScanState] = useState<ScanStep>("idle");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    return () => {
      if (progressTimer.current) clearInterval(progressTimer.current);
    };
  }, []);

  const startScan = () => {
    setScanState("center");
    setCurrentStepIndex(0);
    setProgress(0);
    setScanComplete(false);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    simulateStepProgress(0);
  };

  const simulateStepProgress = (stepIdx: number) => {
    let p = 0;
    if (progressTimer.current) clearInterval(progressTimer.current);

    progressTimer.current = setInterval(() => {
      p += 2;
      const totalProgress = (stepIdx * 25) + (p / 4);
      setProgress(Math.min(totalProgress, 100));

      if (p >= 100) {
        if (progressTimer.current) clearInterval(progressTimer.current);
        if (Platform.OS !== "web") {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }

        const nextIdx = stepIdx + 1;
        if (nextIdx < SCAN_STEPS.length) {
          setCurrentStepIndex(nextIdx);
          setScanState(SCAN_STEPS[nextIdx].step);
          setTimeout(() => simulateStepProgress(nextIdx), 500);
        } else {
          setScanState("complete");
          setScanComplete(true);
          setProgress(100);
        }
      }
    }, 50);
  };

  const resetScan = () => {
    if (progressTimer.current) clearInterval(progressTimer.current);
    setScanState("idle");
    setCurrentStepIndex(0);
    setProgress(0);
    setScanComplete(false);
  };

  const currentInstruction = SCAN_STEPS[currentStepIndex];

  // Permission not yet determined
  if (!permission) {
    return (
      <ScreenContainer className="bg-black">
        <View style={{ flex: 1, backgroundColor: "#000000", alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: "#888888", fontSize: 14 }}>Loading camera...</Text>
        </View>
      </ScreenContainer>
    );
  }

  // Permission not granted
  if (!permission.granted) {
    return (
      <ScreenContainer className="bg-black">
        <View style={{ flex: 1, backgroundColor: "#000000", alignItems: "center", justifyContent: "center", padding: 40 }}>
          <Image
            source={{ uri: LOGO_URL }}
            style={{ width: 80, height: 80, marginBottom: 24 }}
            resizeMode="contain"
          />
          <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "800", textAlign: "center", marginBottom: 12 }}>
            Camera Access Required
          </Text>
          <Text style={{ color: "#888888", fontSize: 14, textAlign: "center", marginBottom: 32, lineHeight: 20 }}>
            Big Starz needs camera access to perform the 3D Face Mesh scan for your Cameo avatar synthesis.
          </Text>
          <Pressable
            onPress={requestPermission}
            style={({ pressed }) => ({
              backgroundColor: "#FF007F",
              paddingHorizontal: 40,
              paddingVertical: 16,
              borderRadius: 30,
              shadowColor: "#FF007F",
              shadowOpacity: 0.7,
              shadowRadius: 16,
              elevation: 8,
              transform: [{ scale: pressed ? 0.97 : 1 }],
            })}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "800", letterSpacing: 1 }}>
              ENABLE CAMERA
            </Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-black">
      <View style={{ flex: 1, backgroundColor: "#000000" }}>
        {/* Header */}
        <View
          style={{
            paddingVertical: 10,
            paddingHorizontal: 20,
            alignItems: "center",
            borderBottomWidth: 1,
            borderBottomColor: "rgba(255, 0, 127, 0.2)",
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "800", color: "#FFFFFF", letterSpacing: 2 }}>
            CAMEO STUDIO
          </Text>
          <Text style={{ fontSize: 11, color: "#FF007F", marginTop: 2, letterSpacing: 1 }}>
            3D FACE MESH SCAN
          </Text>
        </View>

        {/* Camera Frame Area */}
        <View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 12 }}>
          {/* Live Camera Viewport */}
          <View
            style={{
              flex: 1,
              maxHeight: 400,
              borderRadius: 24,
              overflow: "hidden",
              borderWidth: 2,
              borderColor:
                scanState === "complete"
                  ? "#00FF00"
                  : scanState === "idle"
                  ? "rgba(255, 0, 127, 0.4)"
                  : "#FF007F",
              position: "relative",
              shadowColor: scanState === "complete" ? "#00FF00" : "#FF007F",
              shadowOpacity: 0.5,
              shadowRadius: 20,
              elevation: 10,
            }}
          >
            {/* Real Camera Feed */}
            <CameraView
              ref={cameraRef}
              style={{ flex: 1 }}
              facing="front"
              mirror={true}
            />

            {/* Face Mesh Overlay (on top of camera) */}
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Face oval guide */}
              <View
                style={{
                  width: 180,
                  height: 240,
                  borderRadius: 90,
                  borderWidth: 2,
                  borderColor:
                    scanState === "idle"
                      ? "rgba(255, 0, 127, 0.4)"
                      : scanState === "complete"
                      ? "rgba(0, 255, 0, 0.6)"
                      : "rgba(0, 255, 255, 0.6)",
                  borderStyle: "dashed",
                }}
              />

              {/* Mesh grid lines */}
              {scanState !== "idle" && scanState !== "complete" && (
                <>
                  {[25, 40, 55, 70].map((pct, i) => (
                    <View
                      key={`h-${i}`}
                      style={{
                        position: "absolute",
                        top: pct,
                        left: 45,
                        right: 45,
                        height: 1,
                        backgroundColor: "rgba(0, 255, 255, 0.3)",
                      }}
                    />
                  ))}
                  {[65, 90, 115].map((px, i) => (
                    <View
                      key={`v-${i}`}
                      style={{
                        position: "absolute",
                        left: px,
                        top: 48,
                        bottom: 48,
                        width: 1,
                        backgroundColor: "rgba(0, 255, 255, 0.3)",
                      }}
                    />
                  ))}
                </>
              )}

              {/* Direction Arrow */}
              {scanState !== "idle" && scanState !== "complete" && (
                <View style={{ position: "absolute", bottom: 20 }}>
                  <Text style={{ fontSize: 40 }}>{currentInstruction?.arrow}</Text>
                </View>
              )}

              {/* Complete checkmark */}
              {scanState === "complete" && (
                <View style={{ position: "absolute" }}>
                  <Text style={{ fontSize: 60 }}>{"\u2705"}</Text>
                </View>
              )}
            </View>

            {/* Top Status Bar */}
            <View
              style={{
                position: "absolute",
                top: 12,
                left: 12,
                right: 12,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "rgba(255, 0, 127, 0.3)",
                }}
              >
                <Text style={{ color: "#FFFFFF", fontSize: 10, fontWeight: "600" }}>
                  {scanState === "idle"
                    ? "\u{1F534} READY"
                    : scanState === "complete"
                    ? "\u{1F7E2} SCAN COMPLETE"
                    : `\u{1F7E1} STEP ${currentStepIndex + 1}/4`}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 12,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#FF0000", marginRight: 4 }} />
                <Text style={{ color: "#FFFFFF", fontSize: 10, fontWeight: "600" }}>REC</Text>
              </View>
            </View>
          </View>

          {/* Progress Bar */}
          <View
            style={{
              marginTop: 12,
              height: 6,
              backgroundColor: "rgba(26, 26, 26, 0.8)",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                width: `${progress}%` as any,
                height: 6,
                backgroundColor: scanState === "complete" ? "#00FF00" : "#FF007F",
                borderRadius: 3,
              }}
            />
          </View>

          {/* Instruction Text */}
          <View style={{ marginTop: 12, alignItems: "center", minHeight: 50 }}>
            {scanState === "idle" && (
              <Text style={{ color: "#AAAAAA", fontSize: 14, textAlign: "center" }}>
                Position your face within the oval and tap Start Scan
              </Text>
            )}
            {scanState !== "idle" && scanState !== "complete" && (
              <View style={{ alignItems: "center" }}>
                <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "700" }}>
                  {currentInstruction?.label}
                </Text>
                <Text style={{ color: "#888888", fontSize: 13, marginTop: 4 }}>
                  {currentInstruction?.description}
                </Text>
              </View>
            )}
            {scanState === "complete" && (
              <View style={{ alignItems: "center" }}>
                <Text style={{ color: "#00FF00", fontSize: 18, fontWeight: "700" }}>
                  Scan Complete!
                </Text>
                <Text style={{ color: "#888888", fontSize: 13, marginTop: 4 }}>
                  Your 3D face mesh has been captured successfully
                </Text>
              </View>
            )}
          </View>

          {/* Step Indicators */}
          <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 12, gap: 8 }}>
            {SCAN_STEPS.map((step, idx) => (
              <View
                key={step.step}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor:
                    idx < currentStepIndex || scanComplete
                      ? "rgba(0, 255, 0, 0.2)"
                      : idx === currentStepIndex && scanState !== "idle"
                      ? "rgba(255, 0, 127, 0.3)"
                      : "rgba(26, 26, 26, 0.8)",
                  borderWidth: 1,
                  borderColor:
                    idx < currentStepIndex || scanComplete
                      ? "#00FF00"
                      : idx === currentStepIndex && scanState !== "idle"
                      ? "#FF007F"
                      : "#333333",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 18 }}>
                  {idx < currentStepIndex || scanComplete ? "\u2713" : step.icon}
                </Text>
              </View>
            ))}
          </View>

          {/* Action Button */}
          <View style={{ marginTop: 16, alignItems: "center", paddingBottom: 10 }}>
            {scanState === "idle" && (
              <Pressable
                onPress={startScan}
                style={({ pressed }) => ({
                  backgroundColor: "#FF007F",
                  paddingHorizontal: 48,
                  paddingVertical: 16,
                  borderRadius: 30,
                  shadowColor: "#FF007F",
                  shadowOpacity: 0.7,
                  shadowRadius: 16,
                  elevation: 8,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                  opacity: pressed ? 0.9 : 1,
                })}
              >
                <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "800", letterSpacing: 1 }}>
                  START SCAN
                </Text>
              </Pressable>
            )}
            {scanState === "complete" && (
              <View style={{ flexDirection: "row", gap: 12 }}>
                <Pressable
                  onPress={resetScan}
                  style={({ pressed }) => ({
                    backgroundColor: "rgba(26, 26, 26, 0.8)",
                    paddingHorizontal: 24,
                    paddingVertical: 14,
                    borderRadius: 24,
                    borderWidth: 1,
                    borderColor: "#333333",
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                    opacity: pressed ? 0.8 : 1,
                  })}
                >
                  <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "600" }}>RESCAN</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    // Navigate to voice clone (would use router.push in production)
                  }}
                  style={({ pressed }) => ({
                    backgroundColor: "#00FF00",
                    paddingHorizontal: 32,
                    paddingVertical: 14,
                    borderRadius: 24,
                    shadowColor: "#00FF00",
                    shadowOpacity: 0.5,
                    shadowRadius: 12,
                    elevation: 6,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                    opacity: pressed ? 0.8 : 1,
                  })}
                >
                  <Text style={{ color: "#000000", fontSize: 14, fontWeight: "800" }}>
                    GENERATE CAMEO
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}
