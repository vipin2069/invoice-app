import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../constants/theme';
import { FIELD_CONFIG, money } from '../utils/invoiceMath';

export default function InvoiceCard({ invoice, onEdit, isCompact }) {
  return (
    <View style={[styles.card, isCompact ? styles.compact : null]}>
      <View style={styles.cardHead}>
        <Text style={styles.cardTitle}>Invoice #{invoice.shortId}</Text>
        <View style={styles.totalPill}>
          <Text style={styles.totalPillText}>{money(invoice.totalPrice)}</Text>
        </View>
      </View>

      <View style={styles.lines}>
        {FIELD_CONFIG.map((field) => (
          <View key={field.key} style={styles.lineItem}>
            <Text style={styles.lineLabel}>{field.label}</Text>
            <Text style={styles.lineValue}>{invoice[field.key]}</Text>
          </View>
        ))}
      </View>

      <Pressable style={styles.editButton} onPress={() => onEdit(invoice)}>
        <Text style={styles.editButtonText}>Edit</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: colors.panel,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    shadowColor: '#0E1320',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  compact: {
    width: '48.5%',
  },
  cardHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '800',
  },
  totalPill: {
    backgroundColor: colors.chip,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  totalPillText: {
    color: colors.chipText,
    fontSize: 12,
    fontWeight: '800',
  },
  lines: {
    marginBottom: spacing.sm,
  },
  lineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  lineLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  lineValue: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '700',
  },
  editButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 13,
  },
});
