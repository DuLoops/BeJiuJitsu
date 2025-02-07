/* eslint-disable @typescript-eslint/no-shadow */
import React, { useEffect, useState } from 'react';
import {
  Image,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  I18nManager,
  StyleSheet,
} from 'react-native';
import type {
    ImageStyle,
    StyleProp,
    TextInputProps,
    TextStyle,
    ViewStyle,
  } from 'react-native';
  import FontAwesome from '@expo/vector-icons/FontAwesome';
  
  interface CTextInput extends TextInputProps {
    fontFamily?: string;
    style?: StyleProp<TextStyle>;
    inputStyle?: StyleProp<TextStyle>;
    iconStyle?: StyleProp<ImageStyle>;
    showIcon?: boolean;
    renderRightIcon?: () => React.ReactElement | null;
    renderLeftIcon?: () => React.ReactElement | null;
  }
  

const TextInputComponent = (props: CTextInput) => {
  const {
    fontFamily,
    style,
    value,
    placeholderTextColor = '#000',
    placeholder = '',
    showIcon,
    inputStyle,
    iconStyle,
    onChangeText = (_value: string) => {},
    renderLeftIcon,
    renderRightIcon,
  } = props;

  const [text, setText] = useState<string>('');

  useEffect(() => {
    if (value) {
      setText(value);
    }
  }, [value]);

  const onChange = (text: string) => {
    setText(text);
    onChangeText(text);
  };

  const _renderRightIcon = () => {
    if (showIcon) {
      if (renderRightIcon) {
        return renderRightIcon();
      }
      if (text.length > 0) {
        return (
          <TouchableOpacity>
            <FontAwesome name="close" size={24} color="black" style={styles.icon}/>
          </TouchableOpacity>
        );
      }
      return null;
    }
    return null;
  };

  const font = () => {
    if (fontFamily) {
      return {
        fontFamily: fontFamily,
      };
    } else {
      return {};
    }
  };

  return (
    <TouchableWithoutFeedback>
      <View style={[style]}>
        <View style={styles.textInput}>
          {renderLeftIcon?.()}
          <TextInput
            {...props}
            style={StyleSheet.flatten([styles.input, inputStyle, font()])}
            value={text}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            onChangeText={onChange}
          />
          {_renderRightIcon()}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 12,
      justifyContent: 'center',
    },
    textInput: {
      flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      flex: 1,
    },
    input: {
      fontSize: 16,
      flex: 1,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    label: {
      marginBottom: 4,
      fontSize: 16,
    },
    row: {
      flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    },
    icon: {
      width: 20,
      height: 20,
    },
  });

  
export default TextInputComponent;
