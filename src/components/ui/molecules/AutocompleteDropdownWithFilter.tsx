import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedCard from '@/src/components/ui/atoms/ThemedCard';
import { getCategoryColor, PALETTE } from '@/src/constants/Colors';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

export interface AutocompleteWithFilterItem {
  id: string;
  title: string;
  categoryId?: string | null;
  categoryName?: string | null;
  isMine?: boolean;
}

export interface CategoryTagItem {
  id: string;
  name: string;
}

interface AutocompleteDropdownWithFilterProps {
  data: AutocompleteWithFilterItem[];
  categories: CategoryTagItem[];
  value: string;
  onChangeText: (text: string) => void;
  onSelectItem: (item: AutocompleteWithFilterItem | null) => void;
  placeholder?: string;
  maxSuggestions?: number;
  style?: any;
  showCategoryChips?: boolean;
  showMineChip?: boolean;
  // Number of chip rows to display; when >1, chips will wrap instead of horizontal scroll
  chipRows?: number;
}

const AutocompleteDropdownWithFilter: React.FC<AutocompleteDropdownWithFilterProps> = ({
  data,
  categories,
  value,
  onChangeText,
  onSelectItem,
  placeholder = 'Type to search...',
  maxSuggestions = 8,
  style,
  showCategoryChips = true,
  showMineChip = true,
  chipRows = 1,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [chipsExpanded, setChipsExpanded] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string | 'ALL' | 'MINE'>('ALL');
  const [inputPosition, setInputPosition] = useState<{ x: number; y: number; width: number; height: number }>({ x: 0, y: 0, width: 0, height: 0 });
  const containerRef = useRef<View>(null);
  const inputRef = useRef<TextInput>(null);

  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');
  // Fuzzy matching for character sequences (defined before useMemo to avoid init errors)
  function isSequenceMatch(text: string, query: string): boolean {
    let textIndex = 0;
    let queryIndex = 0;
    while (textIndex < text.length && queryIndex < query.length) {
      if (text[textIndex] === query[queryIndex]) {
        queryIndex++;
      }
      textIndex++;
    }
    return queryIndex === query.length;
  }

  const { height: windowHeight, width: windowWidth } = Dimensions.get('window');

  const { combinedList, suggestedIds } = useMemo(() => {
    const queryLower = value.trim().toLowerCase();
    let list = data;
    if (activeCategoryId === 'MINE') {
      list = list.filter((item) => item.isMine);
    } else if (activeCategoryId !== 'ALL') {
      list = list.filter((item) => item.categoryId === activeCategoryId);
    }
    // Sorting: Mine first, then by category order, then by title
    const CATEGORY_ORDER = [
      'Submission', 'Takedown', 'Pass', 'Control', 'Escape', 'Guard', 'Sweep', 'System',
    ];
    const getCategoryRank = (categoryId?: string | null) => {
      const idx = CATEGORY_ORDER.indexOf(String(categoryId || ''));
      return idx === -1 ? CATEGORY_ORDER.length : idx;
    };
    const sortByMineThenCategory = (arr: AutocompleteWithFilterItem[]) =>
      [...arr].sort((a, b) => {
        const mineDelta = Number(!!b.isMine) - Number(!!a.isMine);
        if (mineDelta !== 0) return mineDelta;
        const catDelta = getCategoryRank(a.categoryId) - getCategoryRank(b.categoryId);
        if (catDelta !== 0) return catDelta;
        return a.title.localeCompare(b.title);
      });
    if (!queryLower) {
      return { combinedList: sortByMineThenCategory(list), suggestedIds: new Set<string>() };
    }
    const suggestions = list.filter((item) => {
      const titleLower = item.title.toLowerCase();
      return (
        titleLower.startsWith(queryLower) ||
        titleLower.includes(queryLower) ||
        titleLower.split(' ').some((w) => w.startsWith(queryLower)) ||
        isSequenceMatch(titleLower, queryLower)
      );
    });
    const suggestedSet = new Set(suggestions.map((s) => s.id));
    const others = list.filter((item) => !suggestedSet.has(item.id));
    return { combinedList: [...sortByMineThenCategory(suggestions), ...sortByMineThenCategory(others)], suggestedIds: suggestedSet };
  }, [data, value, activeCategoryId]);

  function renderHighlightedTitle(title: string, query: string) {
    const q = query.trim();
    if (!q) return <ThemedText style={styles.itemText}>{title}</ThemedText>;
    const lower = title.toLowerCase();
    const qLower = q.toLowerCase();
    const parts: Array<{ text: string; bold: boolean }> = [];
    let index = 0;
    while (index < title.length) {
      const found = lower.indexOf(qLower, index);
      if (found === -1) {
        parts.push({ text: title.slice(index), bold: false });
        break;
      }
      if (found > index) {
        parts.push({ text: title.slice(index, found), bold: false });
      }
      parts.push({ text: title.slice(found, found + q.length), bold: true });
      index = found + q.length;
    }
    return (
      <ThemedText style={styles.itemText}>
        {parts.map((p, i) => (
          <Text key={i} style={p.bold ? styles.bold : undefined}>{p.text}</Text>
        ))}
      </ThemedText>
    );
  }

  useEffect(() => {
    if (isFocused) setShowDropdown(true);
  }, [isFocused]);

  const measureInputPosition = () => {
    if (containerRef.current) {
      containerRef.current.measureInWindow((x, y, width, height) => {
        setInputPosition({ x, y, width, height });
      });
    }
  };

  const handleClear = () => {
    onChangeText('');
    onSelectItem(null);
    setShowDropdown(true);
    inputRef.current?.focus();
  };

  const handleSelectItem = (item: AutocompleteWithFilterItem) => {
    onChangeText(item.title);
    onSelectItem(item);
    setShowDropdown(false);
    setIsFocused(false);
  };

  const chips = useMemo(() => {
    const hasMine = data.some((d) => d.isMine);
    const base: Array<{ id: string; name: string; color?: string; textColor?: string }> = [
      { id: 'ALL', name: 'All', color: '#F3F4F6', textColor: '#111827' },
    ];
    const categoryChips = categories.map((c) => ({ id: c.id, name: c.name, color: getCategoryColor(c.id), textColor: '#111827' }));
    // Place "Mine" at the end
    const mineChip = showMineChip && hasMine ? [{ id: 'MINE', name: 'Mine', color: PALETTE.common.accent, textColor: '#111827' }] : [];
    return [...base, ...categoryChips, ...mineChip];
  }, [categories, data, showMineChip]);

  return (
    <View style={[styles.container, style]}>
      <TouchableWithoutFeedback onPress={(e) => { e.stopPropagation(); inputRef.current?.focus(); }}>
        <View ref={containerRef} style={[styles.inputContainer]} onLayout={measureInputPosition}>
          <TextInput
            ref={inputRef}
            style={[styles.textInput, { color: textColor }]}
            value={value}
            onChangeText={(text) => { onChangeText(text); setShowDropdown(true); }}
            onFocus={() => { setIsFocused(true); measureInputPosition(); setShowDropdown(true); }}
            onBlur={() => { /* keep dropdown open when interacting with chips/list; outside clicks handled by backdrop */ }}
            placeholder={placeholder}
            placeholderTextColor="#999"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {value.length > 0 ? (
            <TouchableOpacity style={styles.iconButton} onPress={handleClear} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          ) : (
            <View style={styles.iconButton}>
              <Ionicons name="search" size={20} color="#999" />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
      {/* Chips rendered inside dropdown to ensure visibility above backdrop */}
      {showDropdown && (
        <>
          <TouchableWithoutFeedback onPress={() => { if (chipsExpanded) { setChipsExpanded(false); } else { setShowDropdown(false); setIsFocused(false); } }}>
            <View style={[
              styles.backdrop,
              { top: -inputPosition.y, left: -inputPosition.x, width: windowWidth, height: windowHeight }
            ]} />
          </TouchableWithoutFeedback>
          <View
            style={[
              styles.dropdownContainer,
              { width: inputPosition.width },
            ]}
          >
            <ThemedCard style={styles.dropdownCard}>
              {showCategoryChips && (
                <View style={styles.headerChipsContainer}>
                  {chipsExpanded ? (
                    <View style={styles.chipsWrap}>
                      {chips.map((chip) => {
                        const isActive = activeCategoryId === chip.id;
                        const isMine = chip.id === 'MINE';
                        const isAll = chip.id === 'ALL';
                        const backgroundColor = isMine
                          ? '#fee2e2'
                          : isAll
                            ? '#F3F4F6'
                            : getCategoryColor(chip.id);
                        const textColor = '#111827';
                        return (
                          <TouchableOpacity
                            key={chip.id}
                            style={[
                              styles.chip,
                              styles.chipWrapItem,
                              { backgroundColor },
                              isActive ? { borderWidth: 1, borderColor: '#111827' } : null,
                            ]}
                            onPress={() => { setActiveCategoryId(chip.id as any); setShowDropdown(true); setChipsExpanded(false); }}
                          >
                            <ThemedText style={[styles.chipText, { color: textColor }]}>
                              {chip.name}
                            </ThemedText>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ) : (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
                      {chips.map((chip) => {
                        const isActive = activeCategoryId === chip.id;
                        const isMine = chip.id === 'MINE';
                        const isAll = chip.id === 'ALL';
                        const backgroundColor = isMine
                          ? '#fee2e2'
                          : isAll
                            ? '#F3F4F6'
                            : getCategoryColor(chip.id);
                        const textColor = isMine || isAll ? '#111827' : '#FFFFFF';

                        return (
                          <TouchableOpacity
                            key={chip.id}
                            style={[
                              styles.chip,
                              { backgroundColor },
                              isActive ? { borderWidth: 1, borderColor: '#111827' } : null,
                            ]}
                            onPress={() => { setActiveCategoryId(chip.id as any); setShowDropdown(true); setChipsExpanded(false); }}
                          >
                            <ThemedText style={[styles.chipText, { color: textColor }]}>
                              {chip.name}
                            </ThemedText>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  )}

                </View>
              )}
              <ScrollView
                style={[styles.suggestions, { maxHeight: Math.min(windowHeight * 0.6, 520) }]}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled
                onScrollBeginDrag={() => { if (chipsExpanded) setChipsExpanded(false); }}
              >
                {combinedList.map((item) => (
                  <TouchableOpacity key={item.id} style={[styles.itemRow, suggestedIds.has(item.id) && styles.suggestedRow]} onPress={() => handleSelectItem(item)} activeOpacity={0.7}>
                    <View style={styles.itemRowInner}>
                      <View style={{ flexShrink: 1 }}>
                        {renderHighlightedTitle(item.title, value)}
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        {item.isMine && (
                          <View style={[styles.mineTag, { backgroundColor: '#fee2e2' }]}>
                            <ThemedText style={styles.mineTagText}>Mine</ThemedText>
                          </View>
                        )}
                        {item.categoryName && (
                          <View style={[styles.categoryTag, { backgroundColor: getCategoryColor(item.categoryId) }]}>
                            <ThemedText style={styles.categoryTagText}>{item.categoryName}</ThemedText>
                          </View>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
                {combinedList.length === 0 && (
                  <View style={styles.emptyState}><ThemedText>No results</ThemedText></View>
                )}
              </ScrollView>

              <View style={styles.dropdownFooter}>
                <TouchableOpacity onPress={() => { setShowDropdown(false); setIsFocused(false); }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Ionicons name="chevron-up" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </ThemedCard>
          </View>
        </>
      )}
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 8,
    paddingHorizontal: 12,
    minHeight: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  iconButton: {
    padding: 4,
    marginLeft: 8,
  },
  dropdownContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 50,
    zIndex: 100000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 99999,
  },
  dropdownCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    maxHeight: 420,
  },
  headerChipsContainer: {
    paddingTop: 8,
    paddingBottom: 4,
  },
  chipsToggleBarWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipsToggleBar: {
    marginTop: 2,
    width: '100%',
    height: 20,
    backgroundColor: '#F3F4F6',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 6,
    top: 6,
    padding: 6,
    zIndex: 1,
  },
  chipsRow: {
    paddingHorizontal: 8,
    paddingTop: 4,
    paddingBottom: 4,
    gap: 8,
  },
  chipsRowInlineContainer: {
    marginTop: 8,
  },
  chipsRowInline: {
    paddingHorizontal: 8,
    paddingBottom: 4,
    gap: 6,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 4,
    gap: 6,
  },
  chip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  chipWrapItem: {
    marginRight: 6,
    marginBottom: 6,
  },
  activeChip: {
    backgroundColor: '#007AFF',
  },
  chipText: {
    fontSize: 13,
  },
  activeChipText: {
    color: '#fff',
  },
  suggestions: {
    maxHeight: 220,
  },
  stickyHeader: {
    backgroundColor: '#ffffff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  itemRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#f0f0f0',
  },
  itemRowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  itemText: {
    fontSize: 16,
  },
  bold: {
    fontWeight: '700',
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mineTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryTagText: {
    fontSize: 12,
    color: '#FFFFFF', // Added for contrast
  },
  mineTagText: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '700',
  },
  emptyState: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  suggestedRow: {
    backgroundColor: '#F8FAFC',
  },
  dropdownFooter: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#eee',
  },
});

// Use global category color helper from Colors.ts

export default AutocompleteDropdownWithFilter;


