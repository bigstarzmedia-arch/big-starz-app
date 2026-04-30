/**
 * Cameo Studio - 3D Face Mesh Head-Turn Scan
 * Active camera frame with face mesh instructions
 * Steps: Look Center -> Turn Right -> Turn Left -> Look Up
 */

import { View, Text, Pressable, Image } from "react-native";
import { useState, useEffect, useRef } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { Platform } from "react-native";
import * as Haptics from "expo-haptics";

const LOGO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663582603941/kdagQAS7AgDbyomZNfYzdv/big-starz-logo-MNPkwqFDvjz997BmgkJDyA.webp";

type ScanStep = "idle" | "center" | "right" | "left" | "up" | "complete";

interface ScanInstruction {
  step: ScanStep;
  label: string;
  icon: string;
  description: string;
}

const SCAN_STEPS: ScanInstruction[] = [
  { step: "center", label: "Look Center", icon: "\u{1F464}", description: "Face the camera directly" },
  { step: "right", label: "Turn Right", icon: "\u27A1\uFE0F", description: "Slowly turn your head to the right" },
  { step: "left", label: "Turn Left", icon: "\u2B05\uFE0F", description: "Slowly turn your head to the left" },
  { step: "up", label: "Look Up", icon: "\u2B06\uFE0F", description: "Tilt your head slightly upward" },
];

export default function CameoStudioScreen() {
  const [scanState, setScanState] = useState<ScanStep>("idle");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);

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

  return (
    <ScreenContainer className="bg-black">
      <View style={{ flex: 1, backgroundColor: "#000000" }}>
        {/* Header */}
        <View
          style={{
            paddingVertical: 12,
            paddingHorizontal: 20,
            alignItems: "center",
            borderBottomWidth: 1,
            borderBottomColor: "rgba(255, 0, 127, 0.2)",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "800",
              color: "#FFFFFF",
              letterSpacing: 2,
            }}
          >
            CAMEO STUDIO
          </Text>
          <Text style={{ fontSize: 11, color: "#FF007F", marginTop: 2, letterSpacing: 1 }}>
            3D FACE MESH SCAN
          </Text>
        </View>

        {/* Camera Frame Area */}
        <View style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 16 }}>
          {/* Camera Viewport */}
          <View
            style={{
              flex: 1,
              maxHeight: 420,
              borderRadius: 24,
              overflow: "hidden",
              borderWidth: 2,
              borderColor:
                scanState === "complete"
                  ? "#00FF00"
                  : scanState === "idle"
                  ? "rgba(255, 0, 127, 0.4)"
                  : "#FF007F",
              backgroundColor: "#0A0A0A",
              position: "relative",
              shadowColor: scanState === "complete" ? "#00FF00" : "#FF007F",
              shadowOpacity: 0.5,
              shadowRadius: 20,
              elevation: 10,
            }}
          >
            {/* Simulated Camera View with face mesh overlay */}
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#0D0D0D",
              }}
            >
              {/* Face Mesh Grid Overlay */}
              <View
                style={{
                  width: 200,
                  height: 260,
                  borderRadius: 100,
                  borderWidth: 1,
                  borderColor:
                    scanState === "idle"
                      ? "rgba(255, 0, 127, 0.3)"
                      : scanState === "complete"
                      ? "rgba(0, 255, 0, 0.5)"
                      : "rgba(0, 255, 255, 0.5)",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                {/* Horizontal mesh lines */}
                {[52, 91, 130, 169, 208].map((pos, i) => (
                  <View
                    key={`h-${i}`}
                    style={{
                      position: "absolute",
                      top: pos,
                      left: 20,
                      right: 20,
                      height: 1,
                      backgroundColor:
                        scanState === "complete"
                          ? "rgba(0, 255, 0, 0.3)"
                          : "rgba(0, 255, 255, 0.2)",
                    }}
                  />
                ))}
                {/* Vertical mesh lines */}
                {[60, 100, 140].map((pos, i) => (
                  <View
                    key={`v-${i}`}
                    style={{
                      position: "absolute",
                      left: pos,
                      top: 26,
                      bottom: 26,
                      width: 1,
                      backgroundColor:
                        scanState === "complete"
                          ? "rgba(0, 255, 0, 0.3)"
                          : "rgba(0, 255, 255, 0.2)",
                    }}
                  />
                ))}

                {/* Face outline dots */}
                {[
                  { top: 39, left: 97 },
                  { top: 91, left: 57 },
                  { top: 91, left: 137 },
                  { top: 143, left: 97 },
                  { top: 195, left: 77 },
                  { top: 195, left: 117 },
                ].map((pos, i) => (
                  <View
                    key={`dot-${i}`}
                    style={{
                      position: "absolute",
                      top: pos.top,
                      left: pos.left,
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor:
                        scanState === "complete"
                          ? "#00FF00"
                          : scanState === "idle"
                          ? "#FF007F"
                          : "#00FFFF",
                    }}
                  />
                ))}

                {/* Center face icon */}
                <Text style={{ fontSize: 48, opacity: 0.4 }}>
                  {scanState === "complete" ? "\u2705" : "\u{1F464}"}
                </Text>
              </View>

              {/* Direction Arrow Indicator */}
              {scanState !== "idle" && scanState !== "complete" && (
                <View
                  style={{
                    position: "absolute",
                    bottom: 30,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 36 }}>{currentInstruction?.icon}</Text>
                </View>
              )}
            </View>

            {/* Scan Status Overlay */}
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
                    ? "READY"
                    : scanState === "complete"
                    ? "SCAN COMPLETE"
                    : `STEP ${currentStepIndex + 1}/4`}
                </Text>
              </View>
              <Image
                source={{ uri: LOGO_URL }}
                style={{ width: 28, height: 28, opacity: 0.7 }}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Progress Bar */}
          <View
            style={{
              marginTop: 16,
              height: 6,
              backgroundColor: "rgba(26, 26, 26, 0.8)",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                width: `${progress}%`,
                height: "100%",
                backgroundColor:
                  scanState === "complete" ? "#00FF00" : "#FF007F",
                borderRadius: 3,
              }}
            />
          </View>

          {/* Instruction Text */}
          <View style={{ marginTop: 16, alignItems: "center" }}>
            {scanState === "idle" && (
              <Text style={{ color: "#AAAAAA", fontSize: 14, textAlign: "center" }}>
                Position your face within the frame and tap Start Scan
              </Text>
            )}
            {scanState !== "idle" && scanState !== "complete" && (
              <View style={{ alignItems: "center" }}>
                <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "700" }}>
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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 16,
              gap: 8,
            }}
          >
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
          <View style={{ marginTop: 20, alignItems: "center" }}>
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
                    opacity: pressed ? 0.8 : 1,
                  })}
                >
                  <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "600" }}>RESCAN</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => ({
                    backgroundColor: "#00FF00",
                    paddingHorizontal: 32,
                    paddingVertical: 14,
                    borderRadius: 24,
                    shadowColor: "#00FF00",
                    shadowOpacity: 0.5,
                    shadowRadius: 12,
                    elevation: 6,
                    opacity: pressed ? 0.8 : 1,
                  })}
                >
                  <Text style={{ color: "#000000", fontSize: 14, fontWeight: "800" }}>
                    CONTINUE TO VOICE CLONE
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
