import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { SkillType, Skills, CategorySkillMap } from '@/src/constants/Skills';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';

// Define props interface for ChooseSkillView component
interface ChooseSkillViewProps {
  selectedCategory: string | null;
  onSelectSkill: (value: string) => void;
}

const ItemSeparatorComponent = () => <View style={{ height: 1, width: '100%', backgroundColor: 'white' }} />;

const ChooseSkillView: React.FC<ChooseSkillViewProps> = ({ selectedCategory, onSelectSkill }) => {
  const [skillsData, setSkillsData] = useState<SkillType[]>(Skills);
  const [searchText, setSearchText] = useState<string>('');

  useEffect(() => {
    if (selectedCategory) {
      setSkillsData(CategorySkillMap[selectedCategory].map((skill, index) => ({
        id: index.toString(),
        title: skill,
        category: selectedCategory
      })));
      setSearchText("");
    } else {
      setSkillsData(Skills);
    }
  }, [selectedCategory]);


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
          placeholder: 'Search here',
          style: { color: 'black' },
          value: searchText
        }}
        suggestionsListTextStyle={{ color: '#000' }}
        onChangeText={(text)=>{setSearchText(text)}}
        suggestionsListContainerStyle={styles.suggestionsContainer}
        containerStyle={{ flexGrow: 1, flexShrink: 1 }}
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
    zIndex: 0
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
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
  },
});
