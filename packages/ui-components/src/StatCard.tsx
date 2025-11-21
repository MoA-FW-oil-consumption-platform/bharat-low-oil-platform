import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
  style?: ViewStyle;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  variant = 'default',
  style,
}) => {
  return (
    <View style={[styles.card, styles[variant], style]}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {icon && <View style={styles.icon}>{icon}</View>}
      </View>
      <Text style={styles.value}>{value}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  icon: {
    width: 24,
    height: 24,
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  // Variants
  default: {
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  success: {
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  warning: {
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  error: {
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
});
