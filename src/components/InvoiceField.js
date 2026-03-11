import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radius, spacing } from '../constants/theme';

export default function InvoiceField({ label, value, onChangeText }) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType="decimal-pad"
        style={styles.input}
        placeholder="0.00"
        placeholderTextColor="#9AA4B8"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.sm,
  },
  label: {
    marginBottom: spacing.xs,
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: '#FAFCFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    color: colors.ink,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: '600',
  },
});
