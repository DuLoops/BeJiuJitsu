import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedCard from '@/src/components/ui/atoms/ThemedCard';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View, TouchableWithoutFeedback } from 'react-native';

// Custom Context for AutocompleteDropdown
interface AutocompleteDropdownContextType {
  content: React.ReactNode | undefined;
  setContent: (content: React.ReactNode | undefined) => void;
  activeInputContainerRef: React.MutableRefObject<View | null>;
  activeBlurCallback: React.MutableRefObject<(() => void) | null>;
}

const AutocompleteDropdownContext = createContext<AutocompleteDropdownContextType | undefined>(undefined);

export const AutocompleteDropdownContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<React.ReactNode | undefined>(undefined);
  const activeInputContainerRef = useRef<View | null>(null);
  const activeBlurCallback = useRef<(() => void) | null>(null);

  const contextValue: AutocompleteDropdownContextType = {
    content,
    setContent,
    activeInputContainerRef,
    activeBlurCallback,
  };

  const handleOverlayPress = () => {
    setContent(undefined);
    // Blur the active input
    if (activeBlurCallback.current) {
      activeBlurCallback.current();
    }
  };

  return (
    <AutocompleteDropdownContext.Provider value={contextValue}>
      {children}
      {/* Render dropdown content at the top level */}
      {content && (
        <TouchableWithoutFeedback onPress={handleOverlayPress}>
          <View style={styles.overlayContainer}>
            {content}
          </View>
        </TouchableWithoutFeedback>
      )}
    </AutocompleteDropdownContext.Provider>
  );
};

export interface AutocompleteDropdownItem {
  id: string;
  title: string;
}

interface AutocompleteDropdownProps {
  data: AutocompleteDropdownItem[];
  value: string;
  onChangeText: (text: string) => void;
  onSelectItem: (item: AutocompleteDropdownItem | null) => void;
  placeholder?: string;
  maxSuggestions?: number;
  style?: any;
  // Optional style override for the inner input container (to match other inputs)
  inputContainerStyle?: any;
}

const AutocompleteDropdown: React.FC<AutocompleteDropdownProps> = ({
  data,
  value,
  onChangeText,
  onSelectItem,
  placeholder = "Type to search...",
  maxSuggestions = 5,
  style,
  inputContainerStyle,
}) => {
  const context = useContext(AutocompleteDropdownContext);
  if (!context) {
    throw new Error('AutocompleteDropdown must be used within AutocompleteDropdownContextProvider');
  }

  const { setContent, activeInputContainerRef, activeBlurCallback } = context;

  const [filteredData, setFilteredData] = useState<AutocompleteDropdownItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const backgroundColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');
  const tintColor = useThemeColor({}, 'tint');

  // Create blur function that can be called e  xternally
  const blurInput = () => {
    setIsFocused(false);
    setShowDropdown(false);
    setContent(undefined);
    inputRef.current?.blur();
  };

  // Register blur callback with context
  useEffect(() => {
    activeBlurCallback.current = blurInput;

    // Cleanup on unmount
    return () => {
      if (activeBlurCallback.current === blurInput) {
        activeBlurCallback.current = null;
      }
    };
  }, [activeBlurCallback]);

  // Generous matching function
  const filterData = (query: string, showAll = false) => {
    if (showAll || !query.trim()) {
      const allData = data.slice(0, maxSuggestions);
      setFilteredData(allData);
      return allData.length > 0;
    }

    const queryLower = query.toLowerCase();
    const matches = data.filter(item => {
      const titleLower = item.title.toLowerCase();

      return (
        titleLower.startsWith(queryLower) ||
        titleLower.includes(queryLower) ||
        titleLower.split(' ').some(word => word.startsWith(queryLower)) ||
        isSequenceMatch(titleLower, queryLower)
      );
    })
      .slice(0, maxSuggestions);

    setFilteredData(matches);
    return matches.length > 0;
  };

  // Fuzzy matching for character sequences
  const isSequenceMatch = (text: string, query: string): boolean => {
    let textIndex = 0;
    let queryIndex = 0;

    while (textIndex < text.length && queryIndex < query.length) {
      if (text[textIndex] === query[queryIndex]) {
        queryIndex++;
      }
      textIndex++;
    }

    return queryIndex === query.length;
  };

  // No re-measuring: dropdown is rendered inline just below the input

  // Update active input container ref
  useEffect(() => {
    activeInputContainerRef.current = null;
  }, [activeInputContainerRef]);

  // Filter data when value changes
  useEffect(() => {
    const hasMatches = filterData(value);
    setShowDropdown(hasMatches && isFocused);
  }, [value, data]);

  const handleTextChange = (text: string) => {
    onChangeText(text);
    const hasMatches = filterData(text);
    setShowDropdown(hasMatches && isFocused);
  };

  const handleSelectItem = (item: AutocompleteDropdownItem) => {
    onChangeText(item.title);
    onSelectItem(item);
    setShowDropdown(false);
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    onChangeText('');
    onSelectItem(null);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    setIsFocused(true);
    const hasMatches = filterData(value, true);
    setShowDropdown(hasMatches);
  };

  const handleBlur = () => {
    // Delay to allow item selection, then close dropdown
    setTimeout(() => {
      blurInput();
    }, 200);
  };

  // Inline dropdown; no outer overlay handling needed

  // Clean up content on unmount
  useEffect(() => {
    return () => {
      setContent(undefined);
    };
  }, [setContent]);

  return (
    <View style={[styles.container, style]}>
      <View
        style={[styles.inputContainer, { borderColor: isFocused ? tintColor : borderColor, backgroundColor }, inputContainerStyle]}
      >
        <TextInput
          ref={inputRef}
          style={[styles.textInput, { color: textColor }]}
          value={value}
          onChangeText={handleTextChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor="#999"
          autoCorrect={false}
          autoCapitalize="none"
        />
        {value.length > 0 ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleClear}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconButton}>
            <Ionicons name="search" size={20} color="#999" />
          </View>
        )}
      </View>

      {showDropdown && filteredData.length > 0 && (
        <ThemedCard style={[styles.dropdownCard, styles.inlineDropdown, { backgroundColor }]}>
          <ScrollView
            style={styles.scrollView}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            {filteredData.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.dropdownItem,
                  index === filteredData.length - 1 && styles.lastDropdownItem
                ]}
                onPress={() => handleSelectItem(item)}
                activeOpacity={0.7}
              >
                <ThemedText style={styles.dropdownItemText}>
                  {item.title}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ThemedCard>
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
  dropdownCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    maxHeight: 200,
  },
  overlayContainer: {
    position: 'absolute',
    top: -100,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99999,
  },
  inlineDropdown: {
    marginTop: 6,
  },
  scrollView: {
    maxHeight: 200,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  lastDropdownItem: {
    borderBottomWidth: 0,
  },
  dropdownItemText: {
    fontSize: 16,
  },
});

export default AutocompleteDropdown;
