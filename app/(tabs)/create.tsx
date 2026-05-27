import { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert, Image } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { AIGenerationOverlay } from '@/components/ai-generation-overlay';
import { SoundLibraryModal, type Sound } from '@/components/sound-library-modal';
import { CameraRecorder } from '@/components/camera-recorder';
import { FaceCloneWithCountdown } from '@/components/face-clone-with-countdown';
import { VoiceCloneRecorder } from '@/components/voice-clone-recorder';
import { useColors } from '@/hooks/use-colors';
import * as DocumentPicker from 'expo-document-picker';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const VIDEO_BACKGROUNDS = [
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663582603941/kdagQAS7AgDbyomZNfYzdv/vector-bg-studio-1-7ofBMqM2cmK4Wnwqxd5WyJ.webp',
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663582603941/kdagQAS7AgDbyomZNfYzdv/vector-bg-stage-2-TzLtdKjRjUTSoRVQdYsdPU.webp',
];

// Mock sounds data
const TRENDING_SOUNDS: Sound[] = [
  { id: '1', title: 'Neon Nights', artist: 'Synth Wave', duration: '3:24', plays: 45000 },
  { id: '2', title: 'Electric Dreams', artist: 'Cyber Pulse', duration: '2:58', plays: 32000 },
  { id: '3', title: 'Midnight Vibes', artist: 'Lo-Fi Beats', duration: '4:12', plays: 28000 },
  { id: '4', title: 'Golden Hour', artist: 'Chill Beats', duration: '3:45', plays: 19000 },
  { id: '5', title: 'Urban Jungle', artist: 'Hip Hop Prod', duration: '3:15', plays: 52000 },
];

export default function CreateScreen() {
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<'text-video' | 'make-music' | 'casting'>('text-video');
  const [videoPrompt, setVideoPrompt] = useState('');
  const [musicPrompt, setMusicPrompt] = useState('');
  const [selectedInstrumental, setSelectedInstrumental] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [soundLibraryVisible, setSoundLibraryVisible] = useState(false);
  const [selectedSound, setSelectedSound] = useState<Sound | undefined>(undefined);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [recordedVideoUri, setRecordedVideoUri] = useState<string | null>(null);
  const [faceCloneVisible, setFaceCloneVisible] = useState(false);
  const [voiceCloneVisible, setVoiceCloneVisible] = useState(false);
  const [faceCloneComplete, setFaceCloneComplete] = useState(false);
  const [voiceCloneComplete, setVoiceCloneComplete] = useState(false);

  const handleCameraRecordingComplete = (videoUri: string) => {
    setRecordedVideoUri(videoUri);
    setCameraVisible(false);
    Alert.alert('Success', 'Video recorded! Ready to generate AI Cameo.');
  };

  const handleTextToVideo = async () => {
    if (!videoPrompt.trim()) {
      Alert.alert('Error', 'Please enter a video description');
      return;
    }
    setIsGenerating(true);
    setGenerationProgress(0);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    try {
      console.log('Generating video:', videoPrompt, 'with sound:', selectedSound?.title);
      // Simulate progress
      const interval = setInterval(() => {
        setGenerationProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsGenerating(false);
            Alert.alert('Success', 'Video generation complete!');
            setVideoPrompt('');
            return 100;
          }
          return prev + Math.random() * 30;
        });
      }, 500);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate video');
      setIsGenerating(false);
    }
  };

  const handleMakeMusic = async () => {
    if (!musicPrompt.trim()) {
      Alert.alert('Error', 'Please enter a music description');
      return;
    }
    setIsGenerating(true);
    setGenerationProgress(0);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    try {
      console.log('Generating music:', musicPrompt);
      // Simulate progress
      const interval = setInterval(() => {
        setGenerationProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsGenerating(false);
            Alert.alert('Success', 'Music generation complete!');
            setMusicPrompt('');
            return 100;
          }
          return prev + Math.random() * 30;
        });
      }, 500);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate music');
      setIsGenerating(false);
    }
  };

  const handleUploadInstrumental = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
      });
      if (result.assets && result.assets.length > 0) {
        setSelectedInstrumental(result.assets[0].name);
        Alert.alert('Success', `Instrumental uploaded: ${result.assets[0].name}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload instrumental');
    }
  };

  const handleGenerateOnBeat = async () => {
    if (!selectedInstrumental || !videoPrompt.trim()) {
      Alert.alert('Error', 'Please upload an instrumental and enter a video description');
      return;
    }
    setIsGenerating(true);
    setGenerationProgress(0);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    try {
      console.log('Generating video on beat:', videoPrompt, selectedInstrumental);
      // Simulate progress
      const interval = setInterval(() => {
        setGenerationProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsGenerating(false);
            Alert.alert('Success', 'Video generation complete!');
            setVideoPrompt('');
            return 100;
          }
          return prev + Math.random() * 30;
        });
      }, 500);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate video on beat');
      setIsGenerating(false);
    }
  };

  const handleSelectSound = (sound: Sound) => {
    setSelectedSound(sound);
  };

  return (
    <>
      <ScreenContainer containerClassName="bg-black">
        <Image
          source={{ uri: VIDEO_BACKGROUNDS[currentBgIndex] }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: 0.15,
          }}
        />

        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>
            {/* Header */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 4 }}>
                Create with Big Starz
              </Text>
              <Text style={{ fontSize: 14, color: '#999' }}>
                Generate videos, music, and more ✨
              </Text>
            </View>

            {/* Tab Buttons at TOP */}
            <View
              style={{
                flexDirection: 'row',
                gap: 12,
                marginBottom: 24,
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <TouchableOpacity
                onPress={() => setActiveTab('text-video')}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                  backgroundColor: activeTab === 'text-video' ? '#FF1493' : '#1A1A1A',
                  borderWidth: 1,
                  borderColor: activeTab === 'text-video' ? '#FF1493' : '#333',
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: '600',
                    textAlign: 'center',
                    fontSize: 12,
                  }}
                >
                  📹 Video
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setActiveTab('make-music')}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                  backgroundColor: activeTab === 'make-music' ? '#FF1493' : '#1A1A1A',
                  borderWidth: 1,
                  borderColor: activeTab === 'make-music' ? '#FF1493' : '#333',
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: '600',
                    textAlign: 'center',
                    fontSize: 12,
                  }}
                >
                  🎵 Music
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setActiveTab('casting')}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                  backgroundColor: activeTab === 'casting' ? '#FF1493' : '#1A1A1A',
                  borderWidth: 1,
                  borderColor: activeTab === 'casting' ? '#FF1493' : '#333',
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: '600',
                    textAlign: 'center',
                    fontSize: 12,
                  }}
                >
                  👥 Casting
                </Text>
              </TouchableOpacity>
            </View>

            {/* TEXT TO VIDEO TAB */}
            {activeTab === 'text-video' && (
              <View style={{ gap: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>
                  Describe Your Video
                </Text>
                <TextInput
                  placeholder="E.g., A luxury music video in a Tokyo neon street, hip-hop beat, fashion editorial style..."
                  placeholderTextColor="#666"
                  value={videoPrompt}
                  onChangeText={setVideoPrompt}
                  multiline
                  numberOfLines={4}
                  style={{
                    backgroundColor: '#1A1A1A',
                    borderRadius: 12,
                    padding: 12,
                    color: '#fff',
                    borderWidth: 1,
                    borderColor: '#333',
                    fontSize: 14,
                  }}
                />

                {/* Sound Selection Button */}
                <TouchableOpacity
                  onPress={() => setSoundLibraryVisible(true)}
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    backgroundColor: selectedSound ? '#FF1493' : '#1A1A1A',
                    borderWidth: 1,
                    borderColor: selectedSound ? '#FF1493' : '#333',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontSize: 16 }}>🎵</Text>
                    <View>
                      <Text style={{ color: '#fff', fontWeight: '600', fontSize: 12 }}>
                        {selectedSound ? 'Sound Selected' : 'Select Sound'}
                      </Text>
                      {selectedSound && (
                        <Text style={{ color: '#aaa', fontSize: 11, marginTop: 2 }}>
                          Syncing to: {selectedSound.title}
                        </Text>
                      )}
                    </View>
                  </View>
                  <Text style={{ fontSize: 16 }}>›</Text>
                </TouchableOpacity>

                <View style={{ gap: 8 }}>
                  <Text style={{ fontSize: 12, color: '#999' }}>
                    Powered by Seedance (Elite) / Kling (Pro) / Runway (Free)
                  </Text>
                </View>

                {/* AI Cameo Button */}
                <TouchableOpacity
                  onPress={() => setCameraVisible(true)}
                  style={{
                    backgroundColor: '#FFD700',
                    paddingVertical: 12,
                    borderRadius: 12,
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: '#FF1493',
                  }}
                >
                  <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 14 }}>
                    🎬 Record AI Cameo (15 sec)
                  </Text>
                </TouchableOpacity>

                {recordedVideoUri && (
                  <View style={{ backgroundColor: '#1A1A1A', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#FF1493' }}>
                    <Text style={{ color: '#FF1493', fontWeight: '600', fontSize: 12, marginBottom: 4 }}>✓ Video Recorded</Text>
                    <Text style={{ color: '#aaa', fontSize: 11 }}>Ready to generate AI Cameo</Text>
                  </View>
                )}

                <TouchableOpacity
                  onPress={handleTextToVideo}
                  disabled={isGenerating}
                  style={{
                    backgroundColor: '#FF1493',
                    paddingVertical: 14,
                    borderRadius: 12,
                    alignItems: 'center',
                    opacity: isGenerating ? 0.6 : 1,
                  }}
                >
                  {isGenerating ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                      Generate Video ✨
                    </Text>
                  )}
                </TouchableOpacity>

                {/* Instrumental Upload Section */}
                <View
                  style={{
                    backgroundColor: '#1A1A1A',
                    borderRadius: 12,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: '#333',
                    gap: 12,
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>
                    Or Upload an Instrumental
                  </Text>
                  <TouchableOpacity
                    onPress={handleUploadInstrumental}
                    style={{
                      backgroundColor: '#2A2A2A',
                      paddingVertical: 12,
                      borderRadius: 8,
                      borderWidth: 2,
                      borderStyle: 'dashed',
                      borderColor: '#FF1493',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: '#FF1493', fontWeight: '600' }}>
                      {selectedInstrumental ? `✓ ${selectedInstrumental}` : '+ Upload Beat'}
                    </Text>
                  </TouchableOpacity>

                  {selectedInstrumental && (
                    <TouchableOpacity
                      onPress={handleGenerateOnBeat}
                      disabled={isGenerating}
                      style={{
                        backgroundColor: '#FFD700',
                        paddingVertical: 12,
                        borderRadius: 8,
                        alignItems: 'center',
                        opacity: isGenerating ? 0.6 : 1,
                      }}
                    >
                      <Text style={{ color: '#000', fontWeight: 'bold' }}>
                        Generate Video on This Beat 🎶
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}

            {/* MAKE MUSIC TAB */}
            {activeTab === 'make-music' && (
              <View style={{ gap: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>
                  Describe Your Music
                </Text>
                <TextInput
                  placeholder="E.g., Upbeat hip-hop track with trap beats, 140 BPM, energetic vibe..."
                  placeholderTextColor="#666"
                  value={musicPrompt}
                  onChangeText={setMusicPrompt}
                  multiline
                  numberOfLines={4}
                  style={{
                    backgroundColor: '#1A1A1A',
                    borderRadius: 12,
                    padding: 12,
                    color: '#fff',
                    borderWidth: 1,
                    borderColor: '#333',
                    fontSize: 14,
                  }}
                />

                <View style={{ gap: 8 }}>
                  <Text style={{ fontSize: 12, color: '#999' }}>
                    Powered by MusicGen / Udio / Suno
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={handleMakeMusic}
                  disabled={isGenerating}
                  style={{
                    backgroundColor: '#FF1493',
                    paddingVertical: 14,
                    borderRadius: 12,
                    alignItems: 'center',
                    opacity: isGenerating ? 0.6 : 1,
                  }}
                >
                  {isGenerating ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                      Generate Music ✨
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {/* CASTING TAB */}
            {activeTab === 'casting' && (
              <View style={{ gap: 16, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
                <Text style={{ fontSize: 24 }}>👥</Text>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>
                  Casting Coming Soon
                </Text>
                <Text style={{ fontSize: 14, color: '#999', textAlign: 'center' }}>
                  Hire creators and models for your AI videos
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* AI Generation Overlay */}
        <AIGenerationOverlay
          visible={isGenerating}
          progress={generationProgress}
          title="Creating Your Masterpiece..."
          subtitle={selectedSound ? `Syncing to ${selectedSound.title}` : 'Generating...'}
        />

        {/* Sound Library Modal */}
        <SoundLibraryModal
          visible={soundLibraryVisible}
          sounds={TRENDING_SOUNDS}
          selectedSound={selectedSound}
          onSelect={handleSelectSound}
          onClose={() => setSoundLibraryVisible(false)}
        />

        {/* Camera Recorder Modal */}
        <CameraRecorder
          visible={cameraVisible}
          onClose={() => setCameraVisible(false)}
          onRecordingComplete={handleCameraRecordingComplete}
        />
      </ScreenContainer>
    </>
  );
}
