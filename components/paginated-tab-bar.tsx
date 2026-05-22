import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/use-colors';

interface PaginatedTabBarProps {
  tabs: Array<{
    name: string;
    title: string;
    icon: React.ReactNode;
  }>;
  activeTab: string;
  onTabChange: (tabName: string) => void;
}

/**
 * Paginated Tab Bar Component
 * Shows 3 tabs per page with left/right navigation arrows
 */
export function PaginatedTabBar({
  tabs,
  activeTab,
  onTabChange,
}: PaginatedTabBarProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const TABS_PER_PAGE = 3;
  const totalPages = Math.ceil(tabs.length / TABS_PER_PAGE);
  const startIndex = currentPage * TABS_PER_PAGE;
  const visibleTabs = tabs.slice(startIndex, startIndex + TABS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const bottomPadding = Platform.OS === 'web' ? 12 : Math.max(insets.bottom, 8);

  return (
    <View
      style={{
        backgroundColor: '#000000',
        borderTopColor: '#333333',
        borderTopWidth: 0.5,
        paddingBottom: bottomPadding,
        paddingTop: 8,
      }}
    >
      {/* Tab Row */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          paddingHorizontal: 8,
          height: 56,
        }}
      >
        {/* Left Arrow */}
        <TouchableOpacity
          onPress={handlePrevPage}
          disabled={currentPage === 0}
          style={{
            padding: 8,
            opacity: currentPage === 0 ? 0.3 : 1,
          }}
        >
          <Text style={{ color: '#FF0055', fontSize: 20, fontWeight: 'bold' }}>‹</Text>
        </TouchableOpacity>

        {/* Visible Tabs */}
        {visibleTabs.map((tab) => (
          <TouchableOpacity
            key={tab.name}
            onPress={() => onTabChange(tab.name)}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 8,
            }}
          >
            <View
              style={{
                alignItems: 'center',
                opacity: activeTab === tab.name ? 1 : 0.6,
              }}
            >
              {tab.icon}
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: '700',
                  color: activeTab === tab.name ? '#FF0055' : '#888888',
                  marginTop: 2,
                }}
              >
                {tab.title}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Right Arrow */}
        <TouchableOpacity
          onPress={handleNextPage}
          disabled={currentPage === totalPages - 1}
          style={{
            padding: 8,
            opacity: currentPage === totalPages - 1 ? 0.3 : 1,
          }}
        >
          <Text style={{ color: '#FF0055', fontSize: 20, fontWeight: 'bold' }}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Page Indicator */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 4,
          paddingTop: 4,
        }}
      >
        {Array.from({ length: totalPages }).map((_, index) => (
          <View
            key={index}
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: index === currentPage ? '#FF0055' : '#444444',
            }}
          />
        ))}
      </View>
    </View>
  );
}
