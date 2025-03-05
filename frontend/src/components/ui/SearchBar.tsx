import React, { memo, useState, useEffect, useCallback, useRef } from 'react'
import { Text, View } from 'react-native'
import type { AutocompleteDropdownItem, IAutocompleteDropdownProps } from 'react-native-autocomplete-dropdown'
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'
import { SkillType } from '@/src/constants/Skills'

const ItemSeparatorComponent = () => <View style={{ height: 1, width: '100%', backgroundColor: 'white' }} />

export const SearchBar = memo((props: Omit<IAutocompleteDropdownProps, 'ref' | 'dataSet'> & { data: AutocompleteDropdownItem[], value: string, setValue: (value: string) => void }) => {
  const { data, value, setValue, ...restProps } = props;
  const ref = useRef<React.RefObject<typeof AutocompleteDropdown>>(null);

//   useEffect(() => {
//     if (!value) {
//       setSelectedItem(null);
//     }
//   }, [value]);

//   useEffect(() => {
//     setSearchText(value);
//   }, [value]);

  return (
    <>
      <AutocompleteDropdown
        ref={ref}
        clearOnFocus={false}
        trimSearchText={true}
        closeOnBlur={true}
        showClear={false}
        initialValue={undefined}
        onSelectItem={item => setValue(item?.title?? '')}
        dataSet={data}
        ItemSeparatorComponent={ItemSeparatorComponent}
        ignoreAccents
        inputContainerStyle={{backgroundColor:'white', borderColor: '#DDDDDD', borderWidth: 0.5, paddingHorizontal: 8, marginBottom: 8, margin: 6, }}
        textInputProps={{ placeholder: 'Search here', style: { color:'black' }, value: value as string }}
        suggestionsListTextStyle={{ color: '#000' }}
        onChangeText={(t)=>{setValue(t)}}
        suggestionsListContainerStyle={{
            backgroundColor: '#fff',
          }}
          containerStyle={{ flexGrow: 1, flexShrink: 1 }}
        {...restProps}
        emptyResultText=""
        
      />
    </>
  )
})