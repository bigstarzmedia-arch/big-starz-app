import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Modal, TextInput, Alert, Image } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export interface MarketplaceListing {
  id: string;
  creatorName: string;
  creatorHandle: string;
  service: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  category: 'voiceover' | 'production' | 'editing' | 'design' | 'other';
  portfolio: string[];
  available: boolean;
  responseTime: string;
}

interface CreatorMarketplaceProps {
  listings: MarketplaceListing[];
  onBookService: (listingId: string) => void;
  onCreateListing: (listing: Omit<MarketplaceListing, 'id' | 'rating' | 'reviews'>) => void;
}

const CATEGORIES = [
  { id: 'voiceover', name: '🎤 Voiceover', icon: '🎤' },
  { id: 'production', name: '🎛️ Production', icon: '🎛️' },
  { id: 'editing', name: '✂️ Editing', icon: '✂️' },
  { id: 'design', name: '🎨 Design', icon: '🎨' },
  { id: 'other', name: '⭐ Other', icon: '⭐' },
];

export function CreatorMarketplace({
  listings,
  onBookService,
  onCreateListing,
}: CreatorMarketplaceProps) {
  const colors = useColors();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('voiceover');
  const [serviceName, setServiceName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const handleCreateListing = async () => {
    if (!serviceName.trim() || !price.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    onCreateListing({
      creatorName: 'You',
      creatorHandle: '@yourhandle',
      service: serviceName,
      description,
      price: parseFloat(price),
      category: selectedCategory as any,
      portfolio: [],
      available: true,
      responseTime: '24 hours',
    });

    setServiceName('');
    setDescription('');
    setPrice('');
    setCreateModalVisible(false);
    Alert.alert('Success', 'Listing created successfully!');
  };

  const handleBookService = async (listingId: string) => {
    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    onBookService(listingId);
    Alert.alert('Success', 'Service booked! Check your messages for details.');
  };

  return (
    <View className="flex-1">
      {/* Create Listing Button */}
      <Pressable
        onPress={() => setCreateModalVisible(true)}
        style={({ pressed }) => [
          {
            backgroundColor: colors.primary,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 12,
            marginBottom: 16,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <Text className="text-center font-bold text-background">+ Create Service Listing</Text>
      </Pressable>

      {/* Create Listing Modal */}
      <Modal visible={createModalVisible} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-surface rounded-t-3xl p-6 gap-4">
            <Text className="text-xl font-bold text-foreground">Create Service Listing</Text>

            {/* Service Name */}
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">Service Name *</Text>
              <TextInput
                placeholder="e.g., Professional Voiceover"
                value={serviceName}
                onChangeText={setServiceName}
                className="bg-background border border-border rounded-lg p-3 text-foreground"
                placeholderTextColor="#999"
              />
            </View>

            {/* Category */}
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
                {CATEGORIES.map((cat) => (
                  <Pressable
                    key={cat.id}
                    onPress={() => setSelectedCategory(cat.id)}
                    style={({ pressed }) => [
                      {
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 8,
                        backgroundColor:
                          selectedCategory === cat.id ? colors.primary : colors.background,
                        borderWidth: 1,
                        borderColor: colors.border,
                        opacity: pressed ? 0.7 : 1,
                      },
                    ]}
                  >
                    <Text
                      className={`font-semibold ${
                        selectedCategory === cat.id ? 'text-background' : 'text-foreground'
                      }`}
                    >
                      {cat.icon}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Description */}
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">Description</Text>
              <TextInput
                placeholder="Describe your service and what you offer..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                className="bg-background border border-border rounded-lg p-3 text-foreground"
                placeholderTextColor="#999"
              />
            </View>

            {/* Price */}
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">Price ($) *</Text>
              <TextInput
                placeholder="50"
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
                className="bg-background border border-border rounded-lg p-3 text-foreground"
                placeholderTextColor="#999"
              />
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setCreateModalVisible(false)}
                style={({ pressed }) => [
                  {
                    flex: 1,
                    paddingVertical: 12,
                    borderRadius: 8,
                    backgroundColor: colors.background,
                    borderWidth: 1,
                    borderColor: colors.border,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Text className="text-center font-semibold text-foreground">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleCreateListing}
                style={({ pressed }) => [
                  {
                    flex: 1,
                    paddingVertical: 12,
                    borderRadius: 8,
                    backgroundColor: colors.primary,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text className="text-center font-semibold text-background">Create Listing</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Marketplace Listings */}
      <ScrollView showsVerticalScrollIndicator={false} className="gap-4">
        {listings.length > 0 ? (
          listings.map((listing) => (
            <View
              key={listing.id}
              className="bg-background border border-border rounded-lg overflow-hidden"
            >
              {/* Header */}
              <View className="p-4 gap-3">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="font-bold text-lg text-foreground">{listing.service}</Text>
                    <Text className="text-xs text-muted">{listing.creatorHandle}</Text>
                  </View>
                  <Text className="text-3xl">
                    {CATEGORIES.find((c) => c.id === listing.category)?.icon}
                  </Text>
                </View>

                {/* Description */}
                <Text className="text-sm text-muted">{listing.description}</Text>

                {/* Stats */}
                <View className="flex-row justify-between items-center">
                  <View className="flex-row gap-4">
                    <View className="items-center">
                      <Text className="text-lg font-bold text-primary">${listing.price}</Text>
                      <Text className="text-xs text-muted">per service</Text>
                    </View>
                    <View className="items-center">
                      <Text className="text-lg font-bold text-foreground">
                        ⭐ {listing.rating.toFixed(1)}
                      </Text>
                      <Text className="text-xs text-muted">({listing.reviews} reviews)</Text>
                    </View>
                  </View>
                  <View className="items-center">
                    <Text className="text-xs text-muted">Response</Text>
                    <Text className="text-xs font-semibold text-foreground">
                      {listing.responseTime}
                    </Text>
                  </View>
                </View>

                {/* Availability Badge */}
                <View
                  className={`py-2 px-3 rounded-lg ${
                    listing.available ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      listing.available ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {listing.available ? '✓ Available' : '✗ Not Available'}
                  </Text>
                </View>

                {/* Book Button */}
                <Pressable
                  onPress={() => handleBookService(listing.id)}
                  disabled={!listing.available}
                  style={({ pressed }) => [
                    {
                      paddingVertical: 12,
                      borderRadius: 8,
                      backgroundColor: listing.available ? colors.primary : colors.border,
                      opacity: pressed && listing.available ? 0.8 : 1,
                    },
                  ]}
                >
                  <Text className="text-center font-bold text-background">
                    {listing.available ? '📅 Book Service' : 'Unavailable'}
                  </Text>
                </Pressable>
              </View>
            </View>
          ))
        ) : (
          <View className="flex-1 justify-center items-center py-12">
            <Text className="text-4xl mb-4">🏪</Text>
            <Text className="text-lg font-bold text-foreground">No Services Available</Text>
            <Text className="text-sm text-muted text-center mt-2">
              Create your first service listing to start earning
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
