import React, { useRef, useState, useLayoutEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, LayoutRectangle, Animated } from 'react-native';
import ThemedText from '../atoms/ThemedText';
import { useThemeColor } from '@/src/hooks/useThemeColor';

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

  const backgroundColor = useThemeColor({}, 'card'); // Track background
  const borderColor = useThemeColor({}, 'border');
  const indicatorColor = useThemeColor({}, 'tint'); // Vermilion selection
  const textColor = useThemeColor({}, 'text');
  const selectedTextColor = '#FFFFFF'; // White text on Vermilion
  const shadowColor = useThemeColor({}, 'shadow');

  useLayoutEffect(() => {
    if (measurements.length === segments.length) {
      const selectedIndex = segments.indexOf(selectedSegment);
      Animated.spring(translateX, {
        toValue: measurements[selectedIndex]?.x - 2, // Subtract container padding
        useNativeDriver: true,
        speed: 20,
        bounciness: 0,
      }).start();
    }
  }, [selectedSegment, measurements]);

  return (
    <View style={[styles.container, { backgroundColor, borderColor }]}>
      <Animated.View
        style={[
          styles.animatedBackground,
          {
            width: segmentWidth,
            transform: [{ translateX }],
            left: 2,
            backgroundColor: indicatorColor,
            shadowColor,
          },
        ]}
      />
      {segments.map((segment, index) => (
        <TouchableOpacity
          key={segment}
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
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
          <ThemedText
            style={[
              styles.segmentText,
              { color: selectedSegment === segment ? selectedTextColor : textColor },
              selectedSegment === segment && styles.selectedSegmentText,
            ]}
          >
            {segment}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 2,
    borderWidth: 1,
    marginHorizontal: 16,
  },
  animatedBackground: {
    position: 'absolute',
    top: 2,
    bottom: 2,
    borderRadius: 6,
    // Hard Shadow for "Stamp" effect
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
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
    fontFamily: 'System',
  },
  selectedSegmentText: {
    fontWeight: '600',
  },
});
