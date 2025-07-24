import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import ThemedButton from '../atoms/ThemedButton';
import ThemedText from '../atoms/ThemedText';
import ThemedView from '../atoms/ThemedView';

interface AlertAction {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface AlertProps {
  visible: boolean;
  title: string;
  message?: string;
  actions: AlertAction[];
  onDismiss?: () => void;
}

const Alert: React.FC<AlertProps> = ({
  visible,
  title,
  message,
  actions,
  onDismiss,
}) => {
  const handleActionPress = (action: AlertAction) => {
    if (action.onPress) {
      action.onPress();
    }
    if (onDismiss) {
      onDismiss();
    }
  };

  const handleBackdropPress = () => {
    // Find cancel action or dismiss
    const cancelAction = actions.find(action => action.style === 'cancel');
    if (cancelAction) {
      handleActionPress(cancelAction);
    } else if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleBackdropPress}
    >
      <TouchableOpacity 
        style={styles.backdrop} 
        activeOpacity={1}
        onPress={handleBackdropPress}
      >
        <TouchableOpacity 
          style={styles.alertContainer} 
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <ThemedView style={styles.alertContent}>
            <ThemedText style={styles.title}>{title}</ThemedText>
            {message && (
              <ThemedText style={styles.message}>{message}</ThemedText>
            )}
            
            <View style={styles.actionsContainer}>
              {actions.map((action, index) => (
                <ThemedButton
                  key={index}
                  title={action.text}
                  onPress={() => handleActionPress(action)}
                  style={[
                    styles.actionButton,
                    action.style === 'destructive' && styles.destructiveButton,
                    action.style === 'cancel' && styles.cancelButton,
                  ]}
                />
              ))}
            </View>
          </ThemedView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default Alert;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    width: '80%',
    maxWidth: 300,
  },
  alertContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#000',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
    lineHeight: 22,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  destructiveButton: {
    backgroundColor: '#dc3545',
  },
});
