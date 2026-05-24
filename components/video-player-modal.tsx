import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
  PanResponder,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";

export interface VideoData {
  id: string;
  url: string;
  title: string;
  creator: string;
  creatorImage?: string;
  likes: number;
  comments: number;
  shares: number;
  sound?: string;
  liked?: boolean;
}

interface VideoPlayerModalProps {
  visible: boolean;
  videos: VideoData[];
  initialIndex: number;
  onClose: () => void;
  onLike?: (videoId: string, liked: boolean) => void;
  onComment?: (videoId: string) => void;
  onShare?: (videoId: string) => void;
}

export function VideoPlayerModal({
  visible,
  videos,
  initialIndex,
  onClose,
  onLike,
  onComment,
  onShare,
}: VideoPlayerModalProps) {
  const colors = useColors();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [liked, setLiked] = useState(videos[currentIndex]?.liked || false);
  const scrollViewRef = useRef<ScrollView>(null);
  const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

  // Swipe gesture handler
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (evt, gestureState) => {
        // Swipe up to next video (gestureState.dy < -50 means upward swipe)
        if (gestureState.dy < -50) {
          goToNextVideo();
        }
        // Swipe down to previous video (gestureState.dy > 50 means downward swipe)
        else if (gestureState.dy > 50) {
          goToPreviousVideo();
        }
      },
    })
  ).current;

  const currentVideo = videos[currentIndex];

  const goToNextVideo = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setLiked(videos[currentIndex + 1]?.liked || false);
      setIsPlaying(true);
    }
  };

  const goToPreviousVideo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setLiked(videos[currentIndex - 1]?.liked || false);
      setIsPlaying(true);
    }
  };

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    onLike?.(currentVideo.id, newLiked);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          width: screenWidth,
          height: screenHeight,
        }}
        {...panResponder.panHandlers}
      >
        {/* Video Player */}
        <View
          style={{
            flex: 1,
            position: "relative",
            backgroundColor: "#000",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Video Thumbnail/Placeholder */}
          <Image
            source={{ uri: currentVideo.url }}
            style={{
              width: "100%",
              height: "100%",
              resizeMode: "cover",
            }}
          />

          {/* Close Button (Top Left) */}
          <TouchableOpacity
            onPress={onClose}
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              zIndex: 10,
              padding: 8,
              backgroundColor: "rgba(0,0,0,0.5)",
              borderRadius: 20,
            }}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>

          {/* Play/Pause Button (Center) */}
          <TouchableOpacity
            onPress={handlePlayPause}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              marginLeft: -30,
              marginTop: -30,
              zIndex: 5,
              opacity: isPlaying ? 0 : 0.7,
            }}
          >
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: "rgba(255,255,255,0.3)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={32}
                color="white"
              />
            </View>
          </TouchableOpacity>

          {/* Video Info (Bottom Left) */}
          <View
            style={{
              position: "absolute",
              bottom: 80,
              left: 16,
              right: 60,
              zIndex: 5,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 14,
                fontWeight: "600",
                marginBottom: 4,
              }}
            >
              @{currentVideo.creator}
            </Text>
            <Text
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: 13,
                marginBottom: 8,
              }}
              numberOfLines={2}
            >
              {currentVideo.title}
            </Text>
            {currentVideo.sound && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="musical-notes" size={12} color="white" />
                <Text
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    fontSize: 12,
                    marginLeft: 4,
                  }}
                  numberOfLines={1}
                >
                  {currentVideo.sound}
                </Text>
              </View>
            )}
          </View>

          {/* Action Buttons (Right Side) */}
          <View
            style={{
              position: "absolute",
              bottom: 80,
              right: 12,
              zIndex: 5,
              alignItems: "center",
              gap: 20,
            }}
          >
            {/* Like Button */}
            <TouchableOpacity
              onPress={handleLike}
              style={{
                alignItems: "center",
                gap: 4,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: "rgba(255,255,255,0.1)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name={liked ? "heart" : "heart-outline"}
                  size={24}
                  color={liked ? "#ff1744" : "white"}
                />
              </View>
              <Text style={{ color: "white", fontSize: 12 }}>
                {currentVideo.likes}
              </Text>
            </TouchableOpacity>

            {/* Comment Button */}
            <TouchableOpacity
              onPress={() => onComment?.(currentVideo.id)}
              style={{
                alignItems: "center",
                gap: 4,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: "rgba(255,255,255,0.1)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="chatbubble-outline" size={24} color="white" />
              </View>
              <Text style={{ color: "white", fontSize: 12 }}>
                {currentVideo.comments}
              </Text>
            </TouchableOpacity>

            {/* Share Button */}
            <TouchableOpacity
              onPress={() => onShare?.(currentVideo.id)}
              style={{
                alignItems: "center",
                gap: 4,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: "rgba(255,255,255,0.1)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="share-social-outline" size={24} color="white" />
              </View>
              <Text style={{ color: "white", fontSize: 12 }}>
                {currentVideo.shares}
              </Text>
            </TouchableOpacity>

            {/* Sound Icon */}
            <TouchableOpacity
              style={{
                alignItems: "center",
                gap: 4,
                marginTop: 8,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: "rgba(255,255,255,0.1)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="musical-notes" size={24} color="white" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Video Counter (Top Right) */}
          <View
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              backgroundColor: "rgba(0,0,0,0.5)",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 12,
              zIndex: 10,
            }}
          >
            <Text style={{ color: "white", fontSize: 12, fontWeight: "600" }}>
              {currentIndex + 1} / {videos.length}
            </Text>
          </View>

          {/* Swipe Indicator */}
          <View
            style={{
              position: "absolute",
              bottom: 20,
              left: "50%",
              marginLeft: -20,
              alignItems: "center",
              zIndex: 5,
            }}
          >
            <Ionicons name="chevron-up" size={24} color="rgba(255,255,255,0.5)" />
            <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 10 }}>
              Swipe up
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}
