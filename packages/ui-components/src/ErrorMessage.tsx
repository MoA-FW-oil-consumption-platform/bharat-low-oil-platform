import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface ErrorMessageProps {
  message: string;
  style?: ViewStyle;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, style }) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  text: {
    color: '#991B1B',
    fontSize: 14,
  },
});
