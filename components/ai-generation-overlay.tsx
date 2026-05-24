import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  Dimensions,
  Animated,
  StyleSheet,
} from "react-native";
import { useColors } from "@/hooks/use-colors";

interface AIGenerationOverlayProps {
  visible: boolean;
  progress: number; // 0-100
  title?: string;
  subtitle?: string;
}

export function AIGenerationOverlay({
  visible,
  progress,
  title = "Generating...",
  subtitle = "Creating your AI masterpiece",
}: AIGenerationOverlayProps) {
  const colors = useColors();
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const spinAnim = new Animated.Value(0);

  // Animate spinning
  useEffect(() => {
    if (visible) {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [visible, spinAnim]);

  // Generate random sparkles
  useEffect(() => {
    if (visible) {
      const interval = setInterval(() => {
        const newSparkle = {
          id: Math.random(),
          x: Math.random() * (screenWidth - 100) + 50,
          y: Math.random() * (screenHeight * 0.6) + 100,
        };
        setSparkles((prev) => [...prev, newSparkle].slice(-15)); // Keep last 15 sparkles
      }, 200);
      return () => clearInterval(interval);
    }
  }, [visible, screenWidth, screenHeight]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.85)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Sparkle background animation */}
        {sparkles.map((sparkle) => (
          <Animated.View
            key={sparkle.id}
            style={{
              position: "absolute",
              left: sparkle.x,
              top: sparkle.y,
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: "#ff1493",
              opacity: 0.6,
            }}
          />
        ))}

        {/* Main content */}
        <View
          style={{
            alignItems: "center",
            zIndex: 10,
          }}
        >
          {/* Spinning star icon */}
          <Animated.View
            style={{
              transform: [{ rotate: spin }],
              marginBottom: 24,
            }}
          >
            <Text style={{ fontSize: 64 }}>⭐</Text>
          </Animated.View>

          {/* Title */}
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: colors.foreground,
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            {title}
          </Text>

          {/* Subtitle */}
          <Text
            style={{
              fontSize: 14,
              color: colors.muted,
              marginBottom: 32,
              textAlign: "center",
            }}
          >
            {subtitle}
          </Text>

          {/* Progress bar background */}
          <View
            style={{
              width: 240,
              height: 6,
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: 3,
              overflow: "hidden",
              marginBottom: 16,
            }}
          >
            {/* Progress bar fill */}
            <Animated.View
              style={{
                width: `${progress}%`,
                height: "100%",
                backgroundColor: "#ff1493",
                borderRadius: 3,
              }}
            />
          </View>

          {/* Progress text */}
          <Text
            style={{
              fontSize: 12,
              color: colors.muted,
              marginBottom: 24,
            }}
          >
            {Math.round(progress)}%
          </Text>

          {/* Animated dots */}
          <View
            style={{
              flexDirection: "row",
              gap: 8,
            }}
          >
            {[0, 1, 2].map((i) => (
              <Animated.View
                key={i}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "#ff1493",
                  opacity: 0.5 + (progress / 100) * 0.5,
                  transform: [
                    {
                      scale: 0.8 + (progress / 100) * 0.4,
                    },
                  ],
                }}
              />
            ))}
          </View>
        </View>

        {/* Decorative corners */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 40,
            height: 40,
            borderTopWidth: 2,
            borderLeftWidth: 2,
            borderColor: "#ff1493",
            opacity: 0.3,
          }}
        />
        <View
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 40,
            height: 40,
            borderTopWidth: 2,
            borderRightWidth: 2,
            borderColor: "#ff1493",
            opacity: 0.3,
          }}
        />
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: 40,
            height: 40,
            borderBottomWidth: 2,
            borderLeftWidth: 2,
            borderColor: "#ff1493",
            opacity: 0.3,
          }}
        />
        <View
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 40,
            height: 40,
            borderBottomWidth: 2,
            borderRightWidth: 2,
            borderColor: "#ff1493",
            opacity: 0.3,
          }}
        />
      </View>
    </Modal>
  );
}
