import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { SkillType, Skills, CategorySkillMap } from '@/src/constants/Skills';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';

// Define props interface for ChooseSkillView component
interface ChooseSkillViewProps {
  selectedCategory: { id: string; name: string } | null;
  onSelectSkill: (value: string) => void;
}

const ItemSeparatorComponent = () => <View style={{ height: 1, width: '100%', backgroundColor: 'white' }} />;

const ChooseSkillView: React.FC<ChooseSkillViewProps> = ({ selectedCategory, onSelectSkill }) => {
  const [skillsData, setSkillsData] = useState<SkillType[]>(Skills);
  const [searchText, setSearchText] = useState<string>('');

  console.log('selectedCategory', selectedCategory);
  useEffect(() => {
    if (selectedCategory) {
      setSkillsData(CategorySkillMap[selectedCategory.name].map((skill, index) => ({
        id: index.toString(),
        title: skill,
        category: selectedCategory
      })));
      setSearchText("");
    } else {
      setSkillsData(Skills);
    }
  }, [selectedCategory]);

  // Update parent component when searchText changes
  useEffect(() => {
    if (searchText !== '') {
      onSelectSkill(searchText);
    }
  }, [searchText]);

  return (
    <View style={styles.container}>
      <AutocompleteDropdown
        clearOnFocus={false}
        trimSearchText={true}
        closeOnBlur={true}
        showClear={false}
        initialValue={undefined}
        onSelectItem={item => item?.title && setSearchText(item.title)}
        dataSet={skillsData}
        ItemSeparatorComponent={ItemSeparatorComponent}
        ignoreAccents
        inputContainerStyle={styles.inputContainer}
        textInputProps={{
          placeholder: 'Search or enter skill name',
          style: { color: 'black' },
          value: searchText,
        }}
        suggestionsListTextStyle={{ color: '#000' }}
        onChangeText={(text) => {
          setSearchText(text);
        }}
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
