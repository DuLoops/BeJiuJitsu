import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, View, Modal, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { ActivityType } from '../types/progress';
import { getActivityColor } from '@/src/constants/Colors';

interface ActivityFilterProps {
  selectedFilter: 'all' | ActivityType;
  onFilterChange: (filter: 'all' | ActivityType) => void;
  activityCounts?: {
    total: number;
    training: number;
    competition: number;
    footage: number;
  };
  testID?: string;
}

export function ActivityFilter({
  selectedFilter,
  onFilterChange,
  activityCounts = { total: 0, training: 0, competition: 0, footage: 0 },
  testID = 'activity-filter'
}: ActivityFilterProps) {
  const [expanded, setExpanded] = useState(false);
  const backgroundColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');

  const getLabel = (key: string) => {
    switch (key) {
      case 'all': return 'All';
      case 'training': return 'Training';
      case 'competition': return 'Comp';
      case 'footage': return 'Video';
      default: return 'Log';
    }
  };

  const currentLabel = selectedFilter === 'all' ? 'Log' : getLabel(selectedFilter);
  const currentCount = selectedFilter === 'all'
    ? activityCounts.total
    : activityCounts[selectedFilter as keyof typeof activityCounts] || 0;

  const handleSelect = (key: 'all' | ActivityType) => {
    onFilterChange(key);
    setExpanded(false);
  };

  return (
    <View style={styles.wrapper} testID={testID}>
      {/* Collapsed Button */}
      <TouchableOpacity
        style={[styles.collapsedButton, { backgroundColor }]}
        onPress={() => setExpanded(true)}
      >
        <ThemedText style={styles.collapsedLabel}>Filter</ThemedText>
        <Ionicons name="chevron-down" size={16} color={textColor} style={{ marginLeft: 4 }} />
      </TouchableOpacity>

      {/* Expanded Modal/Pop-over */}
      <Modal
        visible={expanded}
        transparent
        animationType="fade"
        onRequestClose={() => setExpanded(false)}
      >
        <TouchableWithoutFeedback onPress={() => setExpanded(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.expandedBubble, { backgroundColor }]}>
                {/* Row 1: All, Skill (Using footage logic for now?), Video */}
                <View style={styles.row}>
                  <FilterButton
                    label="All"
                    active={selectedFilter === 'all'}
                    onPress={() => handleSelect('all')}
                    count={activityCounts.total}
                  />
                  {/* Placeholder for 'Skill' requested - Mapping to footage for now until clarified, or maybe separate if we add skill tracking */}
                  <FilterButton
                    label="Skill"
                    active={false}
                    onPress={() => handleSelect('footage')} // Temporary mapping
                    count={0} // No dedicated count yet
                    disabled
                  />
                  <FilterButton
                    label="Video"
                    active={selectedFilter === 'footage'}
                    onPress={() => handleSelect('footage')}
                    count={activityCounts.footage}
                  />
                </View>
                {/* Row 2: Training, Comp */}
                <View style={styles.row}>
                  <FilterButton
                    label="Training"
                    active={selectedFilter === 'training'}
                    onPress={() => handleSelect('training')}
                    count={activityCounts.training}
                  />
                  <FilterButton
                    label="Comp"
                    active={selectedFilter === 'competition'}
                    onPress={() => handleSelect('competition')}
                    count={activityCounts.competition}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

function FilterButton({ label, active, onPress, count, disabled }: { label: string, active: boolean, onPress: () => void, count: number, disabled?: boolean }) {
  const activeColor = useThemeColor({}, 'tint');
  const inactiveColor = useThemeColor({}, 'text');

  return (
    <TouchableOpacity
      style={[styles.filterButton, active && { backgroundColor: activeColor }, disabled && { opacity: 0.5 }]}
      onPress={onPress}
      disabled={disabled}
    >
      <ThemedText style={[styles.filterLabel, { color: active ? '#FFF' : inactiveColor }]}>
        {label}
      </ThemedText>
      {count > 0 && (
        <View style={[styles.smallBadge, active ? { backgroundColor: '#FFF' } : { backgroundColor: activeColor }]}>
          <ThemedText style={[styles.smallBadgeText, active ? { color: activeColor } : { color: '#FFF' }]}>
            {count}
          </ThemedText>
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'flex-start',
    zIndex: 100,
  },
  collapsedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 8,
  },
  collapsedLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  badge: {
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandedBubble: {
    padding: 16,
    borderRadius: 16,
    width: '80%',
    maxWidth: 300,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 4,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  smallBadge: {
    borderRadius: 8,
    paddingHorizontal: 4,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
  }
});