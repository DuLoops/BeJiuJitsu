import { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';

import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedCard from '@/src/components/ui/atoms/ThemedCard';
import { Colors } from '@/src/constants/Colors';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';

export function Collapsible({ children, title, style, contentStyle }: PropsWithChildren & { title: string; style?: StyleProp<ViewStyle>; contentStyle?: StyleProp<ViewStyle> }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useColorScheme() ?? 'light';

  return (
    <ThemedCard style={style}>
      <TouchableOpacity
        style={[styles.heading, styles.titlePill]}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}
      >
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color="#666"
        />
      </TouchableOpacity>
      {isOpen && <ThemedCard style={[styles.content, contentStyle]}>{children}</ThemedCard>}
    </ThemedCard>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  content: {
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  titlePill: {
    backgroundColor: '#EFF1F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
