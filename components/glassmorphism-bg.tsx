import { View, Image, StyleSheet } from "react-native";

interface GlassmorphismBgProps {
  imageSource?: any; // Vector image source
  children?: React.ReactNode;
  opacity?: number; // Default 0.25
  blurRadius?: number; // Default 20 (for future use)
}

export function GlassmorphismBg({
  imageSource,
  children,
  opacity = 0.25,
  blurRadius = 20,
}: GlassmorphismBgProps) {
  return (
    <View style={styles.container}>
      {/* Background Layer - Deep Obsidian */}
      <View style={[styles.bgLayer, { backgroundColor: "#0B0B0B" }]} />

      {/* Vector Image Layer with Blur Effect */}
      {imageSource && (
        <View style={styles.blurLayer}>
          <Image
            source={imageSource}
            style={[styles.vectorImage, { opacity }]}
            resizeMode="cover"
          />
        </View>
      )}

      {/* Content Layer */}
      <View style={styles.contentLayer}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  bgLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  blurLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  vectorImage: {
    width: "100%",
    height: "100%",
  },
  contentLayer: {
    flex: 1,
    zIndex: 2,
  },
});
