import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, shadow } from '@/constants/colors';
import { IMAGES, PROFILE_INFO, PROFILE_STATS } from '@/constants/mockData';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header - full bleed gradient */}
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>प्रोफाइल</Text>
            <Pressable style={styles.editBtn}>
              <Text style={styles.editText}>✏️</Text>
            </Pressable>
          </View>
        </View>

        {/* Avatar card floats over header */}
        <View style={styles.avatarCardWrap}>
          <View style={styles.avatarCard}>
            <View style={styles.avatarWrap}>
              <Image source={{ uri: IMAGES.avatar }} style={styles.avatar} />
              <View style={styles.verified}>
                <Text style={styles.verifiedText}>✓</Text>
              </View>
            </View>
            <View style={styles.avatarCardText}>
              <Text style={styles.name}>Ramesh Kumar</Text>
              <Text style={styles.location}>Chandrapur, Maharashtra</Text>
              <View style={styles.badges}>
                <View style={styles.badgeBrand}>
                  <Text style={styles.badgeBrandText}>Verified Artisan</Text>
                </View>
                <View style={styles.badgeOk}>
                  <Text style={styles.badgeOkText}>★ 4.8</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          {PROFILE_STATS.map((s, i) => (
            <View key={i} style={styles.stat}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.hindi}</Text>
            </View>
          ))}
        </View>

        {/* Info list */}
        <View style={styles.infoCard}>
          {PROFILE_INFO.map((item, i) => (
            <View
              key={i}
              style={[styles.infoRow, i < PROFILE_INFO.length - 1 && styles.infoRowBorder]}
            >
              <View style={styles.infoIcon}>
                <Text style={styles.infoIconText}>{item.icon}</Text>
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoHindi}>{item.hindi}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </View>
          ))}
        </View>

        {/* Language preference */}
        <View style={styles.langCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Text style={styles.infoIconText}>🗣️</Text>
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoHindi}>भाषा</Text>
              <Text style={styles.infoValue}>हिंदी (Hindi)</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </View>
        </View>

        {/* Helper */}
        <Pressable style={styles.helper}>
          <Text style={styles.helperText}>होम पर जाएं</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  header: {
    backgroundColor: colors.brand,
    paddingHorizontal: 20,
    paddingBottom: 60,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '700',
  },
  editBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editText: {
    fontSize: 16,
  },
  avatarCardWrap: {
    paddingHorizontal: 20,
    marginTop: -46,
  },
  avatarCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    ...shadow.card,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
  },
  verified: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.ok,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  avatarCardText: {
    flex: 1,
  },
  name: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '700',
  },
  location: {
    color: colors.inkMuted,
    fontSize: 13,
    marginTop: 2,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  badgeBrand: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(224,123,30,0.1)',
  },
  badgeBrandText: {
    color: colors.brand,
    fontSize: 10,
    fontWeight: '700',
  },
  badgeOk: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: colors.okBg,
  },
  badgeOkText: {
    color: colors.ok,
    fontSize: 10,
    fontWeight: '700',
  },
  stats: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 18,
  },
  stat: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    ...shadow.card,
  },
  statValue: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    color: colors.inkMuted,
    fontSize: 11,
    marginTop: 4,
  },
  infoCard: {
    marginHorizontal: 20,
    marginTop: 18,
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadow.card,
  },
  langCard: {
    marginHorizontal: 20,
    marginTop: 12,
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadow.card,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoIconText: {
    fontSize: 18,
  },
  infoText: {
    flex: 1,
  },
  infoHindi: {
    color: colors.inkMuted,
    fontSize: 12,
  },
  infoValue: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  chevron: {
    color: colors.border,
    fontSize: 20,
  },
  helper: {
    marginHorizontal: 20,
    marginTop: 20,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helperText: {
    color: colors.inkMuted,
    fontSize: 14,
    fontWeight: '600',
  },
});
