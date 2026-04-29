import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/hooks/use-auth";

export default function LoginScreen() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth({ autoFetch: false });
  const [error, setError] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, loading, router]);

  /**
   * Handle OAuth sign-in
   */
  const handleOAuthSignIn = async (provider: "google" | "apple") => {
    try {
      setError(null);
      // In production, this would redirect to OAuth provider
      // For now, simulate OAuth flow with deep link
      router.push({
        pathname: "/oauth/callback",
        params: { provider },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    }
  };

  /**
   * Handle email/password sign-in
   */
  const handleEmailSignIn = async () => {
    try {
      setError(null);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Navigation failed");
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 justify-center items-center px-6 gap-8">
          {/* Logo & Branding */}
          <View className="items-center gap-2">
            <Text className="text-5xl font-bold text-primary">✨</Text>
            <Text className="text-3xl font-bold text-foreground">Big Starz</Text>
            <Text className="text-base text-muted text-center">
              Create. Beautify. Monetize.
            </Text>
          </View>

          {/* Error Message */}
          {error && (
            <View className="w-full bg-error/10 border border-error rounded-lg p-4">
              <Text className="text-error text-sm">{error}</Text>
            </View>
          )}

          {/* OAuth Sign-In Buttons */}
          <View className="w-full gap-3">
            <TouchableOpacity
              onPress={() => handleOAuthSignIn("google")}
              disabled={loading}
              className="w-full bg-surface border border-border rounded-lg py-4 px-6 active:opacity-80"
            >
              <Text className="text-center text-foreground font-semibold">
                {loading ? "Signing in..." : "Continue with Google"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleOAuthSignIn("apple")}
              disabled={loading}
              className="w-full bg-surface border border-border rounded-lg py-4 px-6 active:opacity-80"
            >
              <Text className="text-center text-foreground font-semibold">
                {loading ? "Signing in..." : "Continue with Apple"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View className="w-full flex-row items-center gap-4">
            <View className="flex-1 h-px bg-border" />
            <Text className="text-muted text-sm">or</Text>
            <View className="flex-1 h-px bg-border" />
          </View>

          {/* Email Sign-In Button */}
          <TouchableOpacity
            onPress={handleEmailSignIn}
            disabled={loading}
            className="w-full bg-primary rounded-lg py-4 px-6 active:scale-95"
          >
            <Text className="text-center text-background font-bold text-base">
              Sign in with Email
            </Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View className="flex-row justify-center gap-2">
            <Text className="text-muted text-sm">Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/")}>
              <Text className="text-primary font-semibold text-sm">Sign up</Text>
            </TouchableOpacity>
          </View>

          {/* Terms & Privacy */}
          <View className="flex-row justify-center gap-4 mt-4">
            <TouchableOpacity>
              <Text className="text-muted text-xs underline">Terms</Text>
            </TouchableOpacity>
            <Text className="text-muted text-xs">•</Text>
            <TouchableOpacity>
              <Text className="text-muted text-xs underline">Privacy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
