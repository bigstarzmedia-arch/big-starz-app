/**
 * Creator Onboarding Tutorial
 * 
 * Interactive 3-step walkthrough:
 * Step 1: Cameo Scan - Show how to use the face mesh scanner
 * Step 2: Voice Clone - Explain the voice synthesis feature
 * Step 3: First Song - Guide through lyric generation
 * 
 * Shown on first launch. Gated behind subscription.
 */

import { View, Text, Pressable, Modal, Dimensions, Platform } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { useSubscription } from "@/lib/subscription-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const STORAGE_KEY = "@bigstarz/onboarding_complete";

interface TutorialStep {
  id: number;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  actionLabel: string;
  color: string;
  features: string[];
}

const STEPS: TutorialStep[] = [
  {
    id: 1,
    icon: "\u{1F4F7}",
    title: "Cameo Scan",
    subtitle: "Create Your 3D Avatar",
    description: "Use your camera to scan your face from 4 angles. Our AI builds a photorealistic 3D model for cinematic music videos.",
    actionLabel: "NEXT: VOICE CLONE",
    color: "#FF007F",
    features: [
      "4-point face mesh scan",
      "AI-powered 3D reconstruction",
      "Cinematic video rendering",
      "Powered by Kling & HeyGen",
    ],
  },
  {
    id: 2,
    icon: "\u{1F3A4}",
    title: "Voice Clone",
    subtitle: "Synthesize Your Sound",
    description: "Record a 30-second voice sample. Our AI clones your vocal signature for custom ad-libs, harmonies, and full vocal tracks.",
    actionLabel: "NEXT: FIRST SONG",
    color: "#9D00FF",
    features: [
      "30-second voice capture",
      "AI vocal synthesis",
      "Custom ad-libs & harmonies",
      "Powered by ElevenLabs",
    ],
  },
  {
    id: 3,
    icon: "\u{1F3B5}",
    title: "First Song",
    subtitle: "Generate Your Hit",
    description: "Choose a genre, describe your vibe, and our AI writes original lyrics tailored to your style. Add vocals and export.",
    actionLabel: "START CREATING",
    color: "#00FFFF",
    features: [
      "7 genres: Pop, Country, EDM, Latin, Rock, Hip-Hop, R&B",
      "AI lyric generation",
      "Beat matching & production",
      "One-tap social export",
    ],
  },
];

export function OnboardingTutorial() {
  const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { canAccessPremium } = useSubscription();

  useEffect(() => {
    checkOnboardingStatus();
  }, [canAccessPremium]);

  const checkOnboardingStatus = async () => {
    try {
      const completed = await AsyncStorage.getItem(STORAGE_KEY);
      if (!completed && canAccessPremium) {
        setVisible(true);
      }
    } catch (e) {
      // Silently fail
    }
  };

  const handleNext = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = async () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setVisible(false);
    await AsyncStorage.setItem(STORAGE_KEY, "true");
  };

  const step = STEPS[currentStep];

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={handleSkip}>
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.92)", justifyContent: "center", padding: 24 }}>
        {/* Skip button */}
        <Pressable
          onPress={handleSkip}
          style={{ position: "absolute", top: 50, right: 20, zIndex: 10 }}
        >
          <Text style={{ color: "#888888", fontSize: 14, fontWeight: "600" }}>Skip</Text>
        </Pressable>

        {/* Step indicator */}
        <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 32, gap: 8 }}>
          {STEPS.map((_, idx) => (
            <View
              key={idx}
              style={{
                width: idx === currentStep ? 32 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: idx === currentStep ? step.color : "rgba(255,255,255,0.2)",
              }}
            />
          ))}
        </View>

        {/* Icon */}
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: `${step.color}20`,
              borderWidth: 2,
              borderColor: step.color,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 48 }}>{step.icon}</Text>
          </View>
        </View>

        {/* Step number */}
        <View style={{ alignItems: "center", marginBottom: 8 }}>
          <View
            style={{
              backgroundColor: `${step.color}30`,
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: step.color, fontSize: 11, fontWeight: "800", letterSpacing: 1 }}>
              STEP {step.id} OF 3
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 32,
            fontWeight: "900",
            textAlign: "center",
            letterSpacing: 1,
            marginBottom: 4,
          }}
        >
          {step.title}
        </Text>
        <Text
          style={{
            color: step.color,
            fontSize: 14,
            fontWeight: "600",
            textAlign: "center",
            letterSpacing: 1,
            marginBottom: 16,
          }}
        >
          {step.subtitle}
        </Text>

        {/* Description */}
        <Text
          style={{
            color: "#AAAAAA",
            fontSize: 15,
            textAlign: "center",
            lineHeight: 22,
            marginBottom: 24,
            paddingHorizontal: 12,
          }}
        >
          {step.description}
        </Text>

        {/* Features */}
        <View
          style={{
            backgroundColor: "rgba(26,26,26,0.8)",
            borderRadius: 16,
            padding: 16,
            marginBottom: 32,
            borderWidth: 1,
            borderColor: `${step.color}30`,
          }}
        >
          {step.features.map((feature, idx) => (
            <View key={idx} style={{ flexDirection: "row", alignItems: "center", marginBottom: idx < step.features.length - 1 ? 10 : 0 }}>
              <Text style={{ color: step.color, fontSize: 14, marginRight: 10 }}>{"\u2713"}</Text>
              <Text style={{ color: "#DDDDDD", fontSize: 13 }}>{feature}</Text>
            </View>
          ))}
        </View>

        {/* Action button */}
        <Pressable
          onPress={handleNext}
          style={({ pressed }) => ({
            backgroundColor: step.color,
            paddingVertical: 16,
            borderRadius: 30,
            alignItems: "center",
            shadowColor: step.color,
            shadowOpacity: 0.6,
            shadowRadius: 16,
            elevation: 8,
            transform: [{ scale: pressed ? 0.97 : 1 }],
            opacity: pressed ? 0.9 : 1,
          })}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "900", letterSpacing: 1 }}>
            {step.actionLabel}
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
}

/**
 * Hook to manually trigger the onboarding tutorial
 */
export function useResetOnboarding() {
  return async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
  };
}
