import ThemedButton from '@/src/components/ui/atoms/ThemedButton';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import VideoRecorder from '@/src/components/ui/molecules/VideoRecorder';
import React from 'react';

interface VideoRecorderModalProps {
  visible: boolean;
  onClose: () => void;
  matchId?: string;
}

const VideoRecorderModal: React.FC<VideoRecorderModalProps> = ({
  visible,
  onClose,
  matchId,
}) => {
  if (!visible) return null;

  return (
    <ThemedView style={styles.videoRecorderContainer}>
      <VideoRecorder />
      <ThemedButton
        title="Close"
        onPress={onClose}
        style={styles.closeVideoButton}
      />
    </ThemedView>
  );
};

export default VideoRecorderModal;

const styles = {
  videoRecorderContainer: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  closeVideoButton: {
    marginTop: 20,
  },
}; 