import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SkillType, Skills, CategorySkillMap } from '@/src/constants/Skills';
import { SearchBar } from '@/src/components/ui/SearchBar';

// Create a Skill data structure


// Define props interface for ChooseSkillView component
interface ChooseSkillViewProps {
  selectedCategory: string | null;
  onSelectSkill: (value: string) => void;
}

const ChooseSkillView: React.FC<ChooseSkillViewProps> = ({ selectedCategory, onSelectSkill }) => {
  const [skillsData, setSkillsData] = useState<SkillType[]>(Skills);
  const [skillValue, setSkillValue] = useState<string>('');

  useEffect(() => {
    if (selectedCategory) {
      setSkillsData(CategorySkillMap[selectedCategory].map((skill, index) => ({
        id: index.toString(),
        name: skill,
        category: selectedCategory
        })));
      setSkillValue("");
    } else {
      setSkillsData(Skills);
    }
  }, [selectedCategory]);

  const handleSetValue = useCallback((value: string) => {
    setSkillValue(value);
    if (value) {
      onSelectSkill(value);
      if (!selectedCategory) {
        const skill = Skills.find(s => s.name === value);
        if (skill) {
          onSelectSkill(skill.category);
        }
      }
    }
  }, [onSelectSkill, selectedCategory]);

  const transformedSkillsData = useCallback(() => {
    return skillsData.map((skill) => ({
      id: skill.id,
      title: skill.name
    }));
  }, [skillsData]);

  return (
    <View style={styles.container}>
      <SearchBar
        data={transformedSkillsData()}
        value={skillValue}
        setValue={handleSetValue}
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
});
