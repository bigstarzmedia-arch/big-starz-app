import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";

export interface Sound {
  id: string;
  title: string;
  artist: string;
  duration: string;
  plays: number;
  image?: string;
}

interface SoundLibraryModalProps {
  visible: boolean;
  sounds: Sound[];
  selectedSound?: Sound;
  onSelect: (sound: Sound) => void;
  onClose: () => void;
}

export function SoundLibraryModal({
  visible,
  sounds,
  selectedSound,
  onSelect,
  onClose,
}: SoundLibraryModalProps) {
  const colors = useColors();
  const [searchQuery, setSearchQuery] = useState("");
  const { height: screenHeight } = Dimensions.get("window");

  const filteredSounds = sounds.filter(
    (sound) =>
      sound.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sound.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (sound: Sound) => {
    onSelect(sound);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          paddingTop: 16,
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 16,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: colors.foreground,
            }}
          >
            Select Sound
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.surface,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 8,
            }}
          >
            <Ionicons name="search" size={18} color={colors.muted} />
            <TextInput
              placeholder="Search sounds..."
              placeholderTextColor={colors.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{
                flex: 1,
                marginLeft: 8,
                color: colors.foreground,
                fontSize: 14,
              }}
            />
          </View>
        </View>

        {/* Sound List */}
        <FlatList
          data={filteredSounds}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSelect(item)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
                backgroundColor:
                  selectedSound?.id === item.id ? colors.surface : "transparent",
              }}
            >
              {/* Album Art */}
              {item.image ? (
                <Image
                  source={{ uri: item.image }}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 4,
                    marginRight: 12,
                  }}
                />
              ) : (
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 4,
                    backgroundColor: colors.primary,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 12,
                  }}
                >
                  <Ionicons name="musical-notes" size={24} color="white" />
                </View>
              )}

              {/* Sound Info */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: colors.foreground,
                    marginBottom: 4,
                  }}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.muted,
                    }}
                  >
                    {item.artist}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.muted,
                    }}
                  >
                    •
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.muted,
                    }}
                  >
                    {item.duration}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 11,
                    color: colors.muted,
                    marginTop: 2,
                  }}
                >
                  {item.plays > 999
                    ? `${(item.plays / 1000).toFixed(1)}K plays`
                    : `${item.plays} plays`}
                </Text>
              </View>

              {/* Check mark if selected */}
              {selectedSound?.id === item.id && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={colors.primary}
                  style={{ marginLeft: 12 }}
                />
              )}
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 40,
              }}
            >
              <Ionicons
                name="musical-notes"
                size={48}
                color={colors.muted}
                style={{ marginBottom: 12 }}
              />
              <Text
                style={{
                  fontSize: 14,
                  color: colors.muted,
                  textAlign: "center",
                }}
              >
                No sounds found
              </Text>
            </View>
          }
        />
      </View>
    </Modal>
  );
}
