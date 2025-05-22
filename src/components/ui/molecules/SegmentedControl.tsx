import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutRectangle, Animated } from 'react-native';

interface SegmentedControlProps {
  segments: string[];
  selectedSegment: string;
  onSegmentChange: (segment: string) => void;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  segments,
  selectedSegment,
  onSegmentChange,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [segmentWidth, setSegmentWidth] = useState(0);
  const [measurements, setMeasurements] = useState<LayoutRectangle[]>([]);

  useLayoutEffect(() => {
    if (measurements.length === segments.length) {
      const selectedIndex = segments.indexOf(selectedSegment);
      Animated.spring(translateX, {
        toValue: measurements[selectedIndex]?.x - 2, // Subtract container padding
        useNativeDriver: true,
        speed: 20, // Slightly faster animation
        bounciness: 0,
      }).start();
    }
  }, [selectedSegment, measurements]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.animatedBackground,
          {
            width: segmentWidth,
            transform: [{ translateX }],
            left: 2, // Add left offset to match container padding
          },
        ]}
      />
      {segments.map((segment, index) => (
        <TouchableOpacity
          key={segment}
          onLayout={(event) => {
            const { width, x } = event.nativeEvent.layout;
            setSegmentWidth(width);
            setMeasurements(prev => {
              const newMeasurements = [...prev];
              newMeasurements[index] = event.nativeEvent.layout;
              return newMeasurements;
            });
          }}
          style={[
            styles.segment,
            index === 0 && styles.firstSegment,
            index === segments.length - 1 && styles.lastSegment,
          ]}
          onPress={() => onSegmentChange(segment)}
        >
          <Text
            style={[
              styles.segmentText,
              selectedSegment === segment && styles.selectedSegmentText,
            ]}
          >
            {segment}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 2,
    paddingVertical: 2, // Explicit vertical padding
    borderWidth: 1,
    borderColor: '#000',
    marginHorizontal: 16,
  },
  animatedBackground: {
    position: 'absolute',
    top: 2, // Match container padding
    bottom: 2, // Match container padding
    backgroundColor: '#000',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  firstSegment: {
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  lastSegment: {
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  segmentText: {
    fontSize: 16,
    color: '#666',
  },
  selectedSegmentText: {
    color: '#fff',
    fontWeight: '600',
  },
});
