import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AccordionItem } from '../../ui/Accordion'; // Import AccordionItem

const UploadVideoAccordion = ({ video, setVideoModalVisible }) => {
  return (
    <AccordionItem title="Video" onPress={() => setVideoModalVisible(true)}>
      <TouchableOpacity onPress={() => setVideoModalVisible(true)} style={styles.uploadButton}>
        <Text>Upload Video</Text>
      </TouchableOpacity>
      {video && (
        <View style={styles.videoContainer}>
          <Text>Uploaded Video: {video}</Text>
        </View>
      )}
    </AccordionItem>
  );
};

const styles = StyleSheet.create({
  uploadButton: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  videoContainer: {
    marginTop: 10,
  },
});

export default UploadVideoAccordion;
