import { View, ImageBackground, Text, StyleSheet } from 'react-native';
import { ReactNode } from 'react';

const BACKGROUND_IMAGES = [
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663582603941/kdagQAS7AgDbyomZNfYzdv/big-starz-bg-1-a7gnCXYeosxWVWWGFwy3oo.webp',
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663582603941/kdagQAS7AgDbyomZNfYzdv/big-starz-bg-2-jbbwbLb6SbWjNBvexVCWAd.webp',
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663582603941/kdagQAS7AgDbyomZNfYzdv/big-starz-bg-3-SRZ5tbyRhwbQ66fQv6sCmL.webp',
];

interface BigStarzBackgroundProps {
  children: ReactNode;
  showHeader?: boolean;
  headerTitle?: string;
}

/**
 * Reusable background component with vector images
 * Applies to all black screens with rotating cartoon vector backgrounds
 */
export function BigStarzBackground({
  children,
  showHeader = true,
  headerTitle = 'Big Starz Casting App',
}: BigStarzBackgroundProps) {
  // Get random background image (same for entire screen session)
  const randomBg = BACKGROUND_IMAGES[Math.floor(Math.random() * BACKGROUND_IMAGES.length)];

  return (
    <ImageBackground
      source={{ uri: randomBg }}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Dark overlay for readability */}
      <View style={styles.overlay}>
        {/* Header with Big Starz branding */}
        {showHeader && (
          <View style={styles.header}>
            <Text style={styles.headerText}>{headerTitle}</Text>
          </View>
        )}

        {/* Content */}
        {children}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay for readability
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0055',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF0055',
    letterSpacing: 1,
  },
});
