import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { CategoryType, Skills, CategorySkillMap } from '@/src/constants/Skills';
import { AutocompleteDropdown, AutocompleteDropdownItem } from 'react-native-autocomplete-dropdown';
import { debounce } from 'lodash';

interface DataItem extends AutocompleteDropdownItem {
  id: string;
  title: string;
}

// Define props interface for ChooseSkillView component
interface ChooseSkillViewProps {
  selectedCategory: CategoryType | null;
  onSelectSkill: (value: string) => void;
}

const ItemSeparatorComponent = () => <View style={{ height: 1, width: '100%', backgroundColor: 'white' }} />;

const ChooseSkillView: React.FC<ChooseSkillViewProps> = ({ selectedCategory, onSelectSkill }) => {
  const [skillsData, setSkillsData] = useState<DataItem[]>(
    Skills.map((skill) => ({
      id: skill.id,
      title: skill.title
    }))
  );
  const [searchText, setSearchText] = useState<string>('');



  useEffect(() => {
    if (selectedCategory) {
      const categorySkills = CategorySkillMap[selectedCategory.name] || [];
      setSkillsData(
        categorySkills.map((skillName, index) => ({
          id: `${selectedCategory.id}-${index}`,
          title: skillName
        }))
      );
      setSearchText("");
    } else {
      setSkillsData(
        Skills.map((skill) => ({
          id: skill.id,
          title: skill.title
        }))
      );
    }
  }, [selectedCategory]);

  const handleSelectItem = (item: AutocompleteDropdownItem | null) => {
    if (!item?.title) return;
    setSearchText(item.title);
  };

  useEffect(() => {
    onSelectSkill(searchText);
  }, [searchText]);

  return (
    <View style={styles.container}>
      <AutocompleteDropdown
        clearOnFocus={false}
        trimSearchText={true}
        closeOnBlur={true}
        showClear={false}
        initialValue={undefined}
        onSelectItem={handleSelectItem}
        dataSet={skillsData}
        ItemSeparatorComponent={ItemSeparatorComponent}
        ignoreAccents
        inputContainerStyle={styles.inputContainer}
        textInputProps={{
          placeholder: 'Search or enter skill name',
          style: { color: 'black' },
          value: searchText,
        }}
        onChangeText={(text) => {
          setSearchText(text);
        }}
        suggestionsListTextStyle={{ color: '#000' }}
        suggestionsListContainerStyle={styles.suggestionsContainer}
        containerStyle={styles.dropdownContainer}
        emptyResultText="No results found"
      />
    </View>
  );
};

export default ChooseSkillView;

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
    marginBottom: 8,
    margin: 6,
  },
  suggestionsContainer: {
    backgroundColor: '#fff',
    zIndex: 1001,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    // On Android, elevation helps with z-index
    ...(Platform.OS === 'android' && { elevation: 5 }),
    // iOS shadow properties
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
