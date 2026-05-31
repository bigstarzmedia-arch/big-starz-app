import { Image, View } from 'react-native';
import { cn } from '@/lib/utils';

interface GroupCartoonBackgroundProps {
  className?: string;
  opacity?: number;
  blurred?: boolean;
}

/**
 * Group Cartoon Background Component
 * Displays the unified 10-character group image across screens
 */
export function GroupCartoonBackground({
  className,
  opacity = 0.15,
  blurred = true,
}: GroupCartoonBackgroundProps) {
  return (
    <View
      className={cn(
        'absolute inset-0 w-full h-full',
        blurred && 'opacity-20',
        className
      )}
      style={{ opacity }}
    >
      <Image
        source={{
          uri: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663582603941/kdagQAS7AgDbyomZNfYzdv/group-cartoon-all-languages-Y9sUw9bdY85TN23sMwJxHZ.webp',
        }}
        className="w-full h-full"
        resizeMode="cover"
      />
    </View>
  );
}

/**
 * Hero Section with Group Cartoon
 * Full-screen background for onboarding and splash screens
 */
export function GroupCartoonHero({ children }: { children?: React.ReactNode }) {
  return (
    <View className="relative w-full h-full bg-background">
      <GroupCartoonBackground opacity={1} blurred={false} />
      <View className="absolute inset-0 bg-black/30" />
      <View className="relative z-10 flex-1 justify-center items-center p-6">
        {children}
      </View>
    </View>
  );
}

/**
 * Subtle Background Overlay
 * For screens that need subtle branding without overwhelming content
 */
export function GroupCartoonOverlay({ children }: { children?: React.ReactNode }) {
  return (
    <View className="relative w-full h-full bg-background">
      <GroupCartoonBackground opacity={0.1} blurred={true} />
      <View className="relative z-10 flex-1">
        {children}
      </View>
    </View>
  );
}
