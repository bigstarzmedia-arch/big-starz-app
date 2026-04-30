/**
 * Casting Detail Screen - Apply for Affiliate Modeling Gigs
 * Shows casting brief, requirements, portfolio selection, and Stripe payment
 */

import { ScrollView, Text, View, Pressable, Modal, Alert } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import * as Haptics from "expo-haptics";

interface CastingGig {
  id: string;
  brandName: string;
  title: string;
  description: string;
  requirements: string[];
  compensation: number;
  deadline: string;
  musicGenre: string;
  videoLength: string;
  deliverables: string[];
}

const MOCK_CASTING: CastingGig = {
  id: "cast-001",
  brandName: "Jaxxon Jewelry",
  title: "Latin Music Video Model - Luxury Jewelry",
  description:
    "We are seeking a high-energy model for a luxury jewelry showcase in a Latin music video. The video will feature our signature Jaxxon pieces in a vibrant, cinematic setting.",
  requirements: [
    "Minimum 500 subscribers",
    "Latin music genre experience preferred",
    "Professional video quality (1080p+)",
    "Availability within 7 days",
  ],
  compensation: 250,
  deadline: "2026-05-15",
  musicGenre: "Latin",
  videoLength: "60 seconds",
  deliverables: ["Final edited video (60s)", "Raw footage (optional)", "Behind-the-scenes content"],
};

export default function CastingDetailScreen() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApply = async () => {
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      setTimeout(() => {
        setIsProcessing(false);
        setShowPaymentModal(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          "Application Submitted!",
          `Your application for ${MOCK_CASTING.brandName} has been submitted. The brand will review and contact you within 48 hours.`
        );
      }, 2000);
    } catch (error) {
      setIsProcessing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "Failed to submit application. Please try again.");
    }
  };

  return (
    <ScreenContainer className="bg-black">
      <ScrollView className="flex-1 bg-black">
        {/* Header */}
        <View className="px-4 py-4 border-b border-gray-800">
          <Text className="text-2xl font-bold text-white mb-2">{MOCK_CASTING.brandName}</Text>
          <Text className="text-sm text-gray-400">{MOCK_CASTING.title}</Text>
        </View>

        {/* Brand Logo & Info */}
        <View className="px-4 py-6">
          <View className="h-40 bg-gradient-to-br from-purple-900 to-pink-900 rounded-xl mb-4 items-center justify-center">
            <Text className="text-4xl">💎</Text>
          </View>

          {/* Compensation Badge */}
          <View
            style={{
              backgroundColor: "rgba(212, 175, 55, 0.9)",
              borderWidth: 1,
              borderColor: "#D4AF37",
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              marginBottom: 16,
            }}
          >
            <Text className="text-xs text-gray-600 mb-1">COMPENSATION</Text>
            <Text className="text-2xl font-bold text-white">${MOCK_CASTING.compensation}</Text>
          </View>
        </View>

        {/* Description */}
        <View className="px-4 py-4 border-t border-gray-800">
          <Text className="text-lg font-bold text-white mb-2">About This Gig</Text>
          <Text className="text-sm text-gray-300 leading-relaxed">{MOCK_CASTING.description}</Text>
        </View>

        {/* Requirements */}
        <View className="px-4 py-4 border-t border-gray-800">
          <Text className="text-lg font-bold text-white mb-3">Requirements</Text>
          {MOCK_CASTING.requirements.map((req, idx) => (
            <View key={idx} className="flex-row items-start mb-2">
              <Text className="text-pink-500 mr-2">✓</Text>
              <Text className="text-sm text-gray-300 flex-1">{req}</Text>
            </View>
          ))}
        </View>

        {/* Deliverables */}
        <View className="px-4 py-4 border-t border-gray-800">
          <Text className="text-lg font-bold text-white mb-3">Deliverables</Text>
          {MOCK_CASTING.deliverables.map((item, idx) => (
            <View key={idx} className="flex-row items-start mb-2">
              <Text className="text-purple-400 mr-2">📹</Text>
              <Text className="text-sm text-gray-300 flex-1">{item}</Text>
            </View>
          ))}
        </View>

        {/* Specs */}
        <View className="px-4 py-4 border-t border-gray-800 mb-6">
          <View className="flex-row justify-between mb-3">
            <View>
              <Text className="text-xs text-gray-500 mb-1">GENRE</Text>
              <Text className="text-sm font-semibold text-white">{MOCK_CASTING.musicGenre}</Text>
            </View>
            <View>
              <Text className="text-xs text-gray-500 mb-1">LENGTH</Text>
              <Text className="text-sm font-semibold text-white">{MOCK_CASTING.videoLength}</Text>
            </View>
            <View>
              <Text className="text-xs text-gray-500 mb-1">DEADLINE</Text>
              <Text className="text-sm font-semibold text-white">{MOCK_CASTING.deadline}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Apply Button */}
      <View className="px-4 py-4 bg-black border-t border-gray-800">
        <Pressable
          onPress={handleApply}
          style={{
            backgroundColor: "#FF007F",
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: "center",
          }}
          className="active:opacity-80"
        >
          <Text className="text-white font-bold text-lg">Apply Now - ${MOCK_CASTING.compensation}</Text>
        </Pressable>
      </View>

      {/* Payment Modal */}
      <Modal visible={showPaymentModal} transparent animationType="slide">
        <View className="flex-1 bg-black/80 justify-end">
          <View className="bg-gray-900 rounded-t-3xl p-6 pb-12">
            {/* Close Button */}
            <Pressable onPress={() => !isProcessing && setShowPaymentModal(false)} className="mb-4">
              <Text className="text-gray-400 text-center">✕</Text>
            </Pressable>

            {/* Payment Summary */}
            <Text className="text-2xl font-bold text-white mb-6 text-center">Confirm Application</Text>

            <View className="bg-gray-800 rounded-xl p-4 mb-6">
              <View className="flex-row justify-between mb-3">
                <Text className="text-gray-400">Casting Fee</Text>
                <Text className="text-white font-semibold">${MOCK_CASTING.compensation}</Text>
              </View>
              <View className="flex-row justify-between border-t border-gray-700 pt-3">
                <Text className="text-white font-bold">Total</Text>
                <Text className="text-pink-500 font-bold text-lg">${MOCK_CASTING.compensation}</Text>
              </View>
            </View>

            {/* Payment Info */}
            <Text className="text-xs text-gray-400 mb-6 text-center">
              By confirming, you authorize payment via Stripe. Your portfolio video will be submitted to{" "}
              {MOCK_CASTING.brandName}.
            </Text>

            {/* Confirm Button */}
            <Pressable
              onPress={handlePayment}
              disabled={isProcessing}
              style={{
                backgroundColor: isProcessing ? "#FF007F80" : "#FF007F",
                paddingVertical: 16,
                borderRadius: 12,
                alignItems: "center",
              }}
              className="active:opacity-80 mb-3"
            >
              <Text className="text-white font-bold">{isProcessing ? "Processing..." : "Confirm & Pay"}</Text>
            </Pressable>

            {/* Cancel Button */}
            <Pressable
              onPress={() => setShowPaymentModal(false)}
              disabled={isProcessing}
              style={{
                backgroundColor: "rgba(157, 0, 255, 0.2)",
                paddingVertical: 16,
                borderRadius: 12,
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#9D00FF",
              }}
              className="active:opacity-80"
            >
              <Text className="text-purple-400 font-bold">Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
