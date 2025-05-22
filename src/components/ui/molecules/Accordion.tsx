import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Octicons from '@expo/vector-icons/Octicons';

const Accordion: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <View>{children}</View>;
};

interface AccordionItemProps {
  title: string;
  children: React.ReactNode | ((ref: React.RefObject<any>) => React.ReactNode);
  initialIsOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ 
  title, 
  children, 
  initialIsOpen = false,
  onOpen,
  onClose 
}) => {
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const inputRef = useRef<any>(null);

  const toggleAccordion = () => {
    if (isOpen) {
      if (onClose) {
        onClose();
      }
      setIsOpen(false);
    } else {
      if (onOpen) {
        onOpen();
      }
      setIsOpen(true);
    }
  };

  useEffect(() => {
    if (isOpen && inputRef.current && typeof inputRef.current.focus === 'function') {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <View style={styles.item}>
      <TouchableOpacity onPress={toggleAccordion} style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {isOpen ? (
          <Octicons name="x" size={24} color="black" />
        ) : (
          <Octicons name="plus" size={24} color="black" />
        )}
      </TouchableOpacity>
      {isOpen && <View style={styles.content}>
        {typeof children === 'function' ? children(inputRef) : children}
      </View>}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    position: 'relative',
    zIndex: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    paddingVertical: 10,
  },
});

export { Accordion, AccordionItem };
