import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';

import ThemedButton from '@/src/components/ui/atoms/ThemedButton';
import ThemedCard from '@/src/components/ui/atoms/ThemedCard';
import VideoRecorder from '@/src/components/ui/molecules/VideoRecorder';

interface VideoRecorderModalProps {
  visible: boolean;
  onClose: () => void;
  matchId?: string;
  onVideoSelected?: (uri: string) => void;
}

const VideoRecorderModal: React.FC<VideoRecorderModalProps> = ({
  visible,
  onClose,
  matchId,
  onVideoSelected
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <ThemedCard style={styles.modalContent}>
          <VideoRecorder onVideoSelected={(uri: string) => {
            onVideoSelected?.(uri);
            onClose();
          }} />
          <ThemedButton
            title="Close"
            onPress={onClose}
            style={styles.closeVideoButton}
            variant="outline"
          />
        </ThemedCard>
      </View>
    </Modal>
  );
};

export default VideoRecorderModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  videoRecorderContainer: {
    width: '100%',
  },
  closeVideoButton: {
    marginTop: 10,
    width: '100%',
  },
});