import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import InvoiceCard from '../components/InvoiceCard';
import InvoiceField from '../components/InvoiceField';
import { colors, radius, spacing } from '../constants/theme';
import { FIELD_CONFIG, INITIAL_FORM, money, recalculateForm, toNumber } from '../utils/invoiceMath';

export default function InvoiceScreen() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [invoices, setInvoices] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const entryFade = useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();
  const isMobile = width < 640;

  useEffect(() => {
    Animated.timing(entryFade, {
      toValue: 1,
      duration: 480,
      useNativeDriver: true,
    }).start();
  }, [entryFade]);

  const dashboard = useMemo(() => {
    const totalInvoices = invoices.length;
    const gross = invoices.reduce((sum, item) => sum + toNumber(item.totalPrice), 0);
    const avg = totalInvoices === 0 ? 0 : gross / totalInvoices;
    return {
      totalInvoices,
      gross,
      avg,
    };
  }, [invoices]);

  const handleFieldChange = (field, value) => {
    const nextRawForm = { ...form, [field]: value };
    setForm(recalculateForm(nextRawForm, field));
  };

  const handleSubmit = () => {
    const finalInvoice = recalculateForm(form);

    if (editingId) {
      setInvoices((current) =>
        current.map((item) =>
          item.id === editingId ? { ...item, ...finalInvoice, lastUpdatedAt: new Date().toISOString() } : item,
        ),
      );
      setEditingId(null);
    } else {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setInvoices((current) => [
        {
          id,
          shortId: id.slice(-5).toUpperCase(),
          createdAt: new Date().toISOString(),
          ...finalInvoice,
        },
        ...current,
      ]);
    }

    setForm(INITIAL_FORM);
  };

  const handleEdit = (invoice) => {
    setEditingId(invoice.id);
    setForm({
      qty: invoice.qty,
      price: invoice.price,
      discountPercent: invoice.discountPercent,
      discount: invoice.discount,
      taxPercent: invoice.taxPercent,
      tax: invoice.tax,
      totalPrice: invoice.totalPrice,
    });
  };

  const handleReset = () => {
    setEditingId(null);
    setForm(INITIAL_FORM);
  };

  const yShift = entryFade.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 0],
  });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.bgBlobTop} />
      <View style={styles.bgBlobSide} />
      <ScrollView contentContainerStyle={styles.container}>
        <Animated.View style={{ opacity: entryFade, transform: [{ translateY: yShift }] }}>
          <View style={styles.hero}>
            <Text style={styles.heroEyebrow}>Billing Workspace</Text>
            <Text style={styles.heroTitle}>Invoice Studio</Text>
            <Text style={styles.heroSubtitle}>
              All seven fields are fully editable and mathematically linked in real time.
            </Text>
            <View style={styles.heroTags}>
              <View style={styles.heroTag}>
                <Text style={styles.heroTagText}>Live Sync</Text>
              </View>
              <View style={styles.heroTag}>
                <Text style={styles.heroTagText}>Card Grid</Text>
              </View>
              <View style={styles.heroTag}>
                <Text style={styles.heroTagText}>Edit Mode</Text>
              </View>
            </View>
          </View>

          <View style={styles.kpiRow}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Invoices</Text>
              <Text style={styles.kpiValue}>{dashboard.totalInvoices}</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Gross Total</Text>
              <Text style={styles.kpiValue}>{money(dashboard.gross)}</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Average</Text>
              <Text style={styles.kpiValue}>{money(dashboard.avg)}</Text>
            </View>
          </View>

          <View style={styles.panel}>
            <View style={styles.panelHead}>
              <Text style={styles.panelTitle}>{editingId ? 'Edit Invoice' : 'Create Invoice'}</Text>
              <Text style={styles.panelSub}>Editable, interdependent pricing fields</Text>
            </View>

            <View style={styles.fieldsRow}>
              {FIELD_CONFIG.map((field) => (
                <View
                  key={field.key}
                  style={[
                    styles.fieldWrap,
                    {
                      width: isMobile ? '100%' : '48.5%',
                    },
                  ]}
                >
                  <InvoiceField
                    label={field.label}
                    value={form[field.key]}
                    onChangeText={(value) => handleFieldChange(field.key, value)}
                  />
                </View>
              ))}
            </View>

            <View style={styles.actions}>
              <Pressable style={styles.primaryButton} onPress={handleSubmit}>
                <Text style={styles.primaryButtonText}>
                  {editingId ? 'Update Invoice Card' : 'Create Invoice Card'}
                </Text>
              </Pressable>
              <Pressable style={styles.secondaryButton} onPress={handleReset}>
                <Text style={styles.secondaryButtonText}>Reset</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.listHead}>
            <Text style={styles.listTitle}>Created Invoices</Text>
            <Text style={styles.listSub}>Tap Edit on any card to modify and save again.</Text>
          </View>

          {invoices.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No invoices yet</Text>
              <Text style={styles.emptySub}>
                Fill the form and create your first invoice card. It will appear in this grid.
              </Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {invoices.map((invoice) => (
                <View
                  key={invoice.id}
                  style={[styles.gridCell, isMobile ? styles.gridCellMobile : styles.gridCellDesktop]}
                >
                  <InvoiceCard invoice={invoice} onEdit={handleEdit} />
                </View>
              ))}
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    padding: spacing.lg,
    paddingBottom: 30,
  },
  bgBlobTop: {
    position: 'absolute',
    top: -120,
    left: -90,
    width: 280,
    height: 280,
    borderRadius: 160,
    backgroundColor: '#CADBFF',
  },
  bgBlobSide: {
    position: 'absolute',
    top: 220,
    right: -100,
    width: 220,
    height: 220,
    borderRadius: 120,
    backgroundColor: colors.bgAccent,
  },
  hero: {
    backgroundColor: colors.ink,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  heroEyebrow: {
    color: '#91B0FF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  heroSubtitle: {
    color: '#C6D3F0',
    marginTop: spacing.sm,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  heroTags: {
    marginTop: spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  heroTag: {
    backgroundColor: '#1D2538',
    borderWidth: 1,
    borderColor: '#2A3652',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  heroTagText: {
    color: '#D3E0FF',
    fontSize: 12,
    fontWeight: '700',
  },
  kpiRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    justifyContent: 'space-between',
  },
  kpiCard: {
    width: '32%',
    backgroundColor: colors.panel,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
  },
  kpiLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
  },
  kpiValue: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '800',
  },
  panel: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  panelHead: {
    marginBottom: spacing.sm,
  },
  panelTitle: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '800',
  },
  panelSub: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  fieldsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  fieldWrap: {
    marginBottom: 2,
  },
  actions: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  primaryButton: {
    width: '79%',
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  secondaryButton: {
    width: '19%',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '700',
  },
  listHead: {
    marginBottom: spacing.sm,
  },
  listTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '800',
  },
  listSub: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: '#F9FBFF',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#BCCAE9',
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptySub: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridCell: {
    marginBottom: spacing.sm,
  },
  gridCellDesktop: {
    width: '48.5%',
  },
  gridCellMobile: {
    width: '100%',
  },
});
