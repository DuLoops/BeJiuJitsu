import { Platform } from 'react-native';
import { Alert } from 'react-native';

export const showAlert = (
  title: string,
  message?: string,
  buttons?: Array<{
    text: string;
    style?: 'default' | 'cancel' | 'destructive';
    onPress?: () => void;
  }>
) => {
  if (Platform.OS === 'web') {
    if (buttons && buttons.length > 1) {
      // For confirmations on web
      if (window.confirm(message || title)) {
        const confirmButton = buttons.find(b => b.style !== 'cancel');
        confirmButton?.onPress?.();
      } else {
        const cancelButton = buttons.find(b => b.style === 'cancel');
        cancelButton?.onPress?.();
      }
    } else {
      // For simple alerts on web
      window.alert(message || title);
    }
  } else {
    Alert.alert(title, message, buttons);
  }
};
