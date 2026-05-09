import { Pressable, Text, StyleSheet, ViewStyle } from "react-native";
import { useColors } from "@/hooks/use-colors";

interface NeonButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  style?: ViewStyle;
}

export function NeonButton({
  label,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  style,
}: NeonButtonProps) {
  const colors = useColors();

  const sizeStyles = {
    small: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 12 },
    medium: { paddingVertical: 12, paddingHorizontal: 24, fontSize: 14 },
    large: { paddingVertical: 16, paddingHorizontal: 32, fontSize: 16 },
  };

  const variantStyles = {
    primary: {
      backgroundColor: "#FF007F",
      borderColor: "#FF007F",
      textColor: "#0B0B0B",
      shadowColor: "#FF007F",
    },
    secondary: {
      backgroundColor: "transparent",
      borderColor: "#FF007F",
      textColor: "#FF007F",
      shadowColor: "#FF007F",
    },
    outline: {
      backgroundColor: "transparent",
      borderColor: "#666666",
      textColor: "#FFFFFF",
      shadowColor: "transparent",
    },
  };

  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: currentVariant.backgroundColor,
          borderColor: currentVariant.borderColor,
          borderWidth: variant === "primary" ? 0 : 1.5,
          paddingVertical: currentSize.paddingVertical,
          paddingHorizontal: currentSize.paddingHorizontal,
          opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
          shadowColor: currentVariant.shadowColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: pressed ? 0.8 : 0.4,
          shadowRadius: 12,
          elevation: 8,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color: currentVariant.textColor,
            fontSize: currentSize.fontSize,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
