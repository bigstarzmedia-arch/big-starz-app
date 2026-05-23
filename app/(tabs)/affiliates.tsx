import { ScrollView, Text, View, TouchableOpacity, Linking } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { BigStarzBackground } from '@/components/big-starz-background';
import { useColors } from '@/hooks/use-colors';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';

const AFFILIATES = [
  // Ultra-Luxury
  { name: 'SSENSE', category: 'Ultra-Luxury', commission: '15%', url: 'https://ssense.com', logo: '👜' },
  { name: 'Farfetch', category: 'Ultra-Luxury', commission: '12%', url: 'https://farfetch.com', logo: '👗' },
  { name: 'Nordstrom', category: 'Ultra-Luxury', commission: '10%', url: 'https://nordstrom.com', logo: '🏬' },
  { name: 'Saks Fifth Avenue', category: 'Ultra-Luxury', commission: '12%', url: 'https://saks.com', logo: '💎' },
  { name: 'Neiman Marcus', category: 'Ultra-Luxury', commission: '10%', url: 'https://neimanmarcus.com', logo: '👑' },
  { name: 'Macy\'s', category: 'Ultra-Luxury', commission: '8%', url: 'https://macys.com', logo: '🛍️' },
  { name: 'LTK', category: 'Ultra-Luxury', commission: '20%', url: 'https://ltk.com', logo: '📱' },
  { name: 'ShopStyle', category: 'Ultra-Luxury', commission: '15%', url: 'https://shopstyle.com', logo: '✨' },
  { name: 'MR PORTER', category: 'Ultra-Luxury', commission: '12%', url: 'https://mrporter.com', logo: '👔' },
  { name: 'Cettire', category: 'Ultra-Luxury', commission: '14%', url: 'https://cettire.com', logo: '🌟' },
  { name: 'End Clothing', category: 'Ultra-Luxury', commission: '12%', url: 'https://endclothing.com', logo: '👕' },

  // Streetwear
  { name: 'Fashion Nova', category: 'Streetwear', commission: '18%', url: 'https://fashionnova.com', logo: '🔥' },
  { name: 'BoohooMAN', category: 'Streetwear', commission: '16%', url: 'https://boohooman.com', logo: '👖' },
  { name: 'StockX', category: 'Streetwear', commission: '10%', url: 'https://stockx.com', logo: '📈' },
  { name: 'Stadium Goods', category: 'Streetwear', commission: '12%', url: 'https://stadiumgoods.com', logo: '👟' },
  { name: 'True Religion', category: 'Streetwear', commission: '14%', url: 'https://truereligion.com', logo: '🎯' },
  { name: 'PacSun', category: 'Streetwear', commission: '15%', url: 'https://pacsun.com', logo: '🌊' },

  // Premium Jewelry
  { name: 'The GLD Shop', category: 'Premium Jewelry', commission: '20%', url: 'https://thegldshop.com', logo: '⌚' },
  { name: 'Frost NYC', category: 'Premium Jewelry', commission: '18%', url: 'https://frostnyc.com', logo: '💍' },
  { name: 'Jaxxon', category: 'Premium Jewelry', commission: '16%', url: 'https://jaxxon.com', logo: '✨' },
  { name: 'King Ice', category: 'Premium Jewelry', commission: '17%', url: 'https://kingice.com', logo: '👑' },
  { name: 'Cernucci', category: 'Premium Jewelry', commission: '19%', url: 'https://cernucci.com', logo: '💎' },
  { name: 'Gold Presidents', category: 'Premium Jewelry', commission: '18%', url: 'https://goldpresidents.com', logo: '🏆' },
  { name: 'Helloice', category: 'Premium Jewelry', commission: '17%', url: 'https://helloice.com', logo: '❄️' },
  { name: 'Guess', category: 'Premium Jewelry', commission: '12%', url: 'https://guess.com', logo: '⌛' },
];

export default function AffiliatesScreen() {
  const colors = useColors();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Ultra-Luxury', 'Streetwear', 'Premium Jewelry'];
  const filteredAffiliates = selectedCategory === 'All' 
    ? AFFILIATES 
    : AFFILIATES.filter(a => a.category === selectedCategory);

  const handleApply = async (affiliate: typeof AFFILIATES[0]) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(affiliate.url);
  };

  return (
    <BigStarzBackground>
      <ScreenContainer className="flex-1 bg-black/80">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="gap-6 p-6">
            {/* Header */}
            <View className="items-center gap-2">
              <Text className="text-4xl font-bold text-foreground">Affiliate Hub</Text>
              <Text className="text-base text-muted text-center">
                Partner with luxury brands. Earn instant commissions.
              </Text>
            </View>

            {/* Category Filter */}
            <View className="gap-3">
              <Text className="text-lg font-semibold text-foreground">Categories</Text>
              <View className="flex-row flex-wrap gap-2">
                {categories.map(cat => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => {
                      setSelectedCategory(cat);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    className={`px-4 py-2 rounded-full ${
                      selectedCategory === cat
                        ? 'bg-primary'
                        : 'bg-surface border border-border'
                    }`}
                  >
                    <Text
                      className={`font-semibold ${
                        selectedCategory === cat ? 'text-background' : 'text-foreground'
                      }`}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Affiliates Grid */}
            <View className="gap-3">
              <Text className="text-lg font-semibold text-foreground">
                {filteredAffiliates.length} Partners
              </Text>
              {filteredAffiliates.map(affiliate => (
                <TouchableOpacity
                  key={affiliate.name}
                  onPress={() => handleApply(affiliate)}
                  className="bg-surface border border-border rounded-xl p-4 flex-row items-center justify-between active:opacity-70"
                >
                  <View className="flex-row items-center gap-4 flex-1">
                    <Text className="text-4xl">{affiliate.logo}</Text>
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-foreground">
                        {affiliate.name}
                      </Text>
                      <Text className="text-sm text-muted">{affiliate.category}</Text>
                    </View>
                  </View>
                  <View className="items-end gap-1">
                    <Text className="text-lg font-bold text-primary">{affiliate.commission}</Text>
                    <Text className="text-xs text-muted">commission</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Apply CTA */}
            <View className="bg-primary/10 border border-primary rounded-xl p-4 gap-2">
              <Text className="text-base font-semibold text-primary">
                💰 Instant API Access
              </Text>
              <Text className="text-sm text-muted">
                Apply to any brand above and get instant API access to their product catalog. Start earning immediately.
              </Text>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    </BigStarzBackground>
  );
}
