import { CategoryType, Skills as DefaultSkills } from '@/src/constants/Skills';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { AutocompleteDropdown, AutocompleteDropdownItem } from 'react-native-autocomplete-dropdown';

interface DataItem extends AutocompleteDropdownItem {
  id: string;
  title: string;
}

// Define props interface for SkillPicker component
interface SkillPickerProps {
  selectedCategory: CategoryType | null;
  onSelectSkill: (value: string) => void;
  categorySpecificSkills?: DataItem[];
  disabled?: boolean;
  initialValue?: string;
}

const ItemSeparatorComponent = () => <View style={{ height: 1, width: '100%', backgroundColor: 'white' }} />;

const SkillPicker: React.FC<SkillPickerProps> = ({ 
  selectedCategory, 
  onSelectSkill,
  categorySpecificSkills,
  disabled = false,
  initialValue = ''
}) => {
  const [skillsData, setSkillsData] = useState<DataItem[]>([]);
  const [searchText, setSearchText] = useState<string>(initialValue);

  const debouncedOnSelectSkill = useCallback(
    debounce((value: string) => {
      if (!disabled) {
        onSelectSkill(value);
      }
    }, 300),
    [onSelectSkill, disabled]
  );

  useEffect(() => {
    setSearchText(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (selectedCategory && categorySpecificSkills && categorySpecificSkills.length > 0) {
      setSkillsData(categorySpecificSkills);
      if (initialValue && !categorySpecificSkills.find(s => s.title === initialValue)) {
      }
    } else if (!selectedCategory) {
      setSkillsData(
        DefaultSkills.map((skill) => ({
          id: skill.id,
          title: skill.title
        }))
      );
    } else {
      setSkillsData([]);
    }
  }, [selectedCategory, categorySpecificSkills, initialValue]);

  const handleSelectItem = (item: AutocompleteDropdownItem | null) => {
    if (disabled) return;
    if (!item?.title) {
        if (searchText === '' && item === null) {
            debouncedOnSelectSkill(''); 
        }
        return;
    }
    setSearchText(item.title);
    debouncedOnSelectSkill(item.title);
  };

  const handleChangeText = (text: string) => {
    if (disabled) return;
    setSearchText(text);
    debouncedOnSelectSkill(text);
  };

  useEffect(() => {
    return () => {
      debouncedOnSelectSkill.cancel();
    };
  }, [debouncedOnSelectSkill]);

  return (
    <View style={styles.container}>
      <AutocompleteDropdown
        clearOnFocus={false}
        trimSearchText={true}
        closeOnBlur={true}
        showClear={true}
        initialValue={{ id: searchText }}
        onSelectItem={handleSelectItem}
        dataSet={skillsData}
        ItemSeparatorComponent={ItemSeparatorComponent}
        ignoreAccents
        inputContainerStyle={[
          styles.inputContainer,
          disabled && styles.disabledInput
        ]}
        textInputProps={{
          placeholder: 'Search or enter skill name',
          style: { color: 'black' },
          value: searchText,
          editable: !disabled,
        }}
        onChangeText={handleChangeText}
        suggestionsListTextStyle={{ color: '#000' }}
        suggestionsListContainerStyle={styles.suggestionsContainer}
        containerStyle={styles.dropdownContainer}
        emptyResultText={selectedCategory && (!categorySpecificSkills || categorySpecificSkills.length === 0) ? "No skills for this category or still loading" : "No results found"}
      />
    </View>
  );
};

export default SkillPicker;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    position: 'relative',
    zIndex: 10,
  },
  dropdownContainer: {
    flexGrow: 1,
    flexShrink: 1,
    zIndex: 10,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderColor: '#DDDDDD',
    borderWidth: 0.5,
    paddingHorizontal: 8,
    margin: 6,
  },
  suggestionsContainer: {
    backgroundColor: '#fff',
    zIndex: 1001,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    ...(Platform.OS === 'android' && { elevation: 5 }),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    maxHeight: 200,
  },
  disabledInput: {
    opacity: 0.5,
    backgroundColor: '#f5f5f5'
  }
});
