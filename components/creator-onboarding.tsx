import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import * as Haptics from 'expo-haptics';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  content: React.ReactNode;
}

export function CreatorOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [formData, setFormData] = useState({
    creatorName: '',
    niche: '',
    bio: '',
  });

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: 'Welcome to Big Starz',
      description: 'Your journey as a creator starts here',
      icon: '🌟',
      content: (
        <View className="gap-4">
          <Text className="text-foreground text-center text-lg leading-relaxed">
            Join thousands of creators earning money by sharing their talent with the world.
          </Text>
          <View className="bg-primary/10 border border-primary rounded-lg p-4">
            <Text className="text-primary font-bold mb-2">✨ What you'll learn:</Text>
            <Text className="text-muted text-sm">
              • How to create viral content{'\n'}
              • Monetization strategies{'\n'}
              • Community guidelines{'\n'}
              • Earning potential
            </Text>
          </View>
        </View>
      ),
    },
    {
      id: 2,
      title: 'Create Your Profile',
      description: 'Tell us about yourself',
      icon: '👤',
      content: (
        <View className="gap-4">
          <View>
            <Text className="text-foreground font-semibold mb-2">Creator Name</Text>
            <TextInput
              placeholder="e.g., @DanceQueen"
              placeholderTextColor="#687076"
              value={formData.creatorName}
              onChangeText={text => setFormData({ ...formData, creatorName: text })}
              className="bg-surface border border-border rounded-lg p-3 text-foreground"
            />
          </View>
          <View>
            <Text className="text-foreground font-semibold mb-2">Your Niche</Text>
            <View className="flex-row flex-wrap gap-2">
              {['Dance', 'Music', 'Comedy', 'Gaming', 'Beauty', 'Fitness'].map(
                niche => (
                  <TouchableOpacity
                    key={niche}
                    onPress={() => setFormData({ ...formData, niche })}
                    className={`px-4 py-2 rounded-full border-2 ${
                      formData.niche === niche
                        ? 'bg-primary border-primary'
                        : 'bg-surface border-border'
                    }`}
                  >
                    <Text
                      className={
                        formData.niche === niche
                          ? 'text-background font-bold'
                          : 'text-foreground'
                      }
                    >
                      {niche}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          </View>
          <View>
            <Text className="text-foreground font-semibold mb-2">Bio</Text>
            <TextInput
              placeholder="Tell us about yourself..."
              placeholderTextColor="#687076"
              value={formData.bio}
              onChangeText={text => setFormData({ ...formData, bio: text })}
              multiline
              numberOfLines={3}
              className="bg-surface border border-border rounded-lg p-3 text-foreground"
            />
          </View>
        </View>
      ),
    },
    {
      id: 3,
      title: 'Content Creation',
      description: 'Master the basics',
      icon: '🎬',
      content: (
        <View className="gap-4">
          <View className="bg-primary/10 border border-primary rounded-lg p-4">
            <Text className="text-primary font-bold mb-3">📹 Video Tips:</Text>
            <View className="gap-2">
              <Text className="text-muted text-sm">
                ✓ Keep videos 15-60 seconds for best engagement
              </Text>
              <Text className="text-muted text-sm">
                ✓ Use trending sounds and hashtags
              </Text>
              <Text className="text-muted text-sm">
                ✓ Post consistently (3-5 times per week)
              </Text>
              <Text className="text-muted text-sm">
                ✓ Engage with your audience in comments
              </Text>
            </View>
          </View>
          <View className="bg-surface border border-border rounded-lg p-4">
            <Text className="text-foreground font-bold mb-2">🎵 Sound Selection:</Text>
            <Text className="text-muted text-sm">
              Use trending sounds from our library. Videos with trending audio get 5x more views!
            </Text>
          </View>
        </View>
      ),
    },
    {
      id: 4,
      title: 'Monetization',
      description: 'Start earning',
      icon: '💰',
      content: (
        <View className="gap-4">
          <View className="bg-primary/10 border border-primary rounded-lg p-4">
            <Text className="text-primary font-bold mb-3">💎 Tier Benefits:</Text>
            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-muted text-sm">Free</Text>
                <Text className="text-foreground text-sm font-bold">$0/month</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-muted text-sm">Budget</Text>
                <Text className="text-foreground text-sm font-bold">$2.40/month</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-muted text-sm">Pro</Text>
                <Text className="text-foreground text-sm font-bold">$24/month</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-muted text-sm">Elite</Text>
                <Text className="text-foreground text-sm font-bold">$98.40/month</Text>
              </View>
            </View>
          </View>
          <View className="bg-success/10 border border-success rounded-lg p-4">
            <Text className="text-success font-bold mb-2">✓ Earnings Model:</Text>
            <Text className="text-muted text-sm">
              • 90% of subscription revenue goes to creators{'\n'}
              • Bonus earnings from video views{'\n'}
              • Affiliate commissions from brand deals{'\n'}
              • Casting opportunity fees
            </Text>
          </View>
        </View>
      ),
    },
    {
      id: 5,
      title: 'Community Guidelines',
      description: 'Keep it safe and fun',
      icon: '📋',
      content: (
        <View className="gap-4">
          <View className="bg-warning/10 border border-warning rounded-lg p-4">
            <Text className="text-warning font-bold mb-3">⚠️ Content Rules:</Text>
            <View className="gap-2">
              <Text className="text-muted text-sm">
                ✗ No hate speech or discrimination
              </Text>
              <Text className="text-muted text-sm">
                ✗ No explicit sexual content
              </Text>
              <Text className="text-muted text-sm">✗ No violence or self-harm</Text>
              <Text className="text-muted text-sm">
                ✗ No copyright infringement
              </Text>
              <Text className="text-muted text-sm">
                ✗ No scams or misleading content
              </Text>
            </View>
          </View>
          <View className="bg-success/10 border border-success rounded-lg p-4">
            <Text className="text-success font-bold mb-2">✓ Best Practices:</Text>
            <Text className="text-muted text-sm">
              • Be authentic and genuine{'\n'}
              • Respond to comments positively{'\n'}
              • Collaborate with other creators{'\n'}
              • Keep improving your craft
            </Text>
          </View>
        </View>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      setIsComplete(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <Modal visible={!isComplete} transparent animationType="slide">
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="bg-surface border-b border-border p-4 pt-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-2xl font-bold text-foreground">
              {step.icon} {step.title}
            </Text>
            <TouchableOpacity onPress={() => setIsComplete(true)}>
              <Text className="text-muted text-2xl">✕</Text>
            </TouchableOpacity>
          </View>

          {/* Progress Bar */}
          <View className="bg-border rounded-full h-2 overflow-hidden">
            <View
              className="bg-primary h-full"
              style={{ width: `${progress}%` }}
            />
          </View>
          <Text className="text-muted text-xs mt-2 text-right">
            Step {currentStep + 1} of {steps.length}
          </Text>
        </View>

        {/* Content */}
        <ScrollView className="flex-1 p-6">
          <Text className="text-muted text-lg mb-6">{step.description}</Text>
          {step.content}
        </ScrollView>

        {/* Footer */}
        <View className="bg-surface border-t border-border p-4 flex-row gap-3">
          <TouchableOpacity
            onPress={handlePrevious}
            disabled={currentStep === 0}
            className={`flex-1 py-3 rounded-full border-2 ${
              currentStep === 0
                ? 'bg-muted/20 border-muted'
                : 'bg-surface border-border'
            }`}
          >
            <Text
              className={`text-center font-bold ${
                currentStep === 0 ? 'text-muted' : 'text-foreground'
              }`}
            >
              ← Back
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNext}
            className="flex-1 py-3 rounded-full bg-primary"
          >
            <Text className="text-center text-background font-bold">
              {currentStep === steps.length - 1 ? 'Start Creating!' : 'Next →'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
