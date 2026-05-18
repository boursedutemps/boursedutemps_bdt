// src/lib/pdf/InstitutionReport.tsx
// Template PDF rapport mensuel institution — @react-pdf/renderer

import React from 'react'
import {
  Document, Page, Text, View, StyleSheet, Font, Image,
} from '@react-pdf/renderer'

// ── Types ─────────────────────────────────────────────────────────────────────

interface ReportData {
  institution: {
    name:          string
    logo_url?:     string
    country?:      string
    type:          string
    primary_color: string
  }
  period: {
    year:  number
    month: number
  }
  stats: {
    total_members:        number
    new_members:          number
    active_members:       number
    total_exchanges:      number
    total_hours:          number
    avg_rating:           number
    isolation_score:      number
    isolated_count:       number
    diversity_score:      number
    equivalent_value_eur: number
    gender_ratio:         number
    workshops_count:      number
    workshop_attendees:   number
    history:              HistoryPoint[]
  }
}

interface HistoryPoint {
  period_month:         number
  period_year:          number
  total_exchanges:      number
  new_members:          number
  equivalent_value_eur: number
}

const MONTHS_FR = [
  'Janvier','Février','Mars','Avril','Mai','Juin',
  'Juillet','Août','Septembre','Octobre','Novembre','Décembre'
]

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  page: {
    fontFamily:      'Helvetica',
    backgroundColor: '#FAFAFA',
    paddingBottom:   40,
  },
  // Header
  header: {
    backgroundColor: '#1E40AF',
    padding:         '32 40 28 40',
    flexDirection:   'row',
    justifyContent:  'space-between',
    alignItems:      'center',
  },
  headerLeft: { flex: 1 },
  headerTitle: {
    color:      '#FFFFFF',
    fontSize:   22,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    color:    '#93C5FD',
    fontSize: 11,
  },
  headerBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius:    8,
    padding:         '8 14',
    alignItems:      'center',
  },
  headerBadgeText: {
    color:      '#FFFFFF',
    fontSize:   10,
    fontFamily: 'Helvetica-Bold',
  },
  // Body
  body: { padding: '24 40' },
  // Section
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize:     13,
    fontFamily:   'Helvetica-Bold',
    color:        '#1E293B',
    marginBottom: 12,
    borderBottom: '1 solid #E2E8F0',
    paddingBottom: 6,
  },
  // KPI grid
  kpiGrid: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           10,
    marginBottom:  8,
  },
  kpiCard: {
    width:           '22%',
    backgroundColor: '#FFFFFF',
    borderRadius:    10,
    padding:         '14 12',
    border:          '1 solid #E2E8F0',
    alignItems:      'center',
  },
  kpiValue: {
    fontSize:   20,
    fontFamily: 'Helvetica-Bold',
    color:      '#1E293B',
    marginBottom: 4,
  },
  kpiLabel: {
    fontSize: 8,
    color:    '#64748B',
    textAlign: 'center',
  },
  kpiSub: {
    fontSize:   7,
    color:      '#94A3B8',
    marginTop:  2,
    textAlign:  'center',
  },
  // ESS cards
  essGrid: {
    flexDirection: 'row',
    gap:           10,
  },
  essCard: {
    flex:            1,
    backgroundColor: '#FFFFFF',
    borderRadius:    10,
    padding:         '14 12',
    border:          '1 solid #E2E8F0',
  },
  essCardTitle: {
    fontSize:     9,
    fontFamily:   'Helvetica-Bold',
    color:        '#475569',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  essValue: {
    fontSize:   18,
    fontFamily: 'Helvetica-Bold',
    color:      '#1E293B',
    marginBottom: 4,
  },
  essDesc: {
    fontSize: 8,
    color:    '#64748B',
    lineHeight: 1.4,
  },
  // Progress bar
  progressTrack: {
    height:          6,
    backgroundColor: '#E2E8F0',
    borderRadius:    3,
    marginTop:       6,
    overflow:        'hidden',
  },
  // Table historique
  table: {
    backgroundColor: '#FFFFFF',
    borderRadius:    10,
    border:          '1 solid #E2E8F0',
    overflow:        'hidden',
  },
  tableHeader: {
    flexDirection:   'row',
    backgroundColor: '#F8FAFC',
    padding:         '8 12',
    borderBottom:    '1 solid #E2E8F0',
  },
  tableHeaderCell: {
    flex:       1,
    fontSize:   8,
    fontFamily: 'Helvetica-Bold',
    color:      '#475569',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    padding:       '8 12',
    borderBottom:  '1 solid #F1F5F9',
  },
  tableRowAlt: {
    backgroundColor: '#FAFAFA',
  },
  tableCell: {
    flex:     1,
    fontSize: 9,
    color:    '#334155',
  },
  // Footer
  footer: {
    position:   'absolute',
    bottom:     0,
    left:       0,
    right:      0,
    padding:    '12 40',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:  'center',
    borderTop:  '1 solid #E2E8F0',
    backgroundColor: '#FAFAFA',
  },
  footerText: {
    fontSize: 8,
    color:    '#94A3B8',
  },
  // Recommandations
  recommBox: {
    backgroundColor: '#EFF6FF',
    borderRadius:    10,
    padding:         '14 16',
    border:          '1 solid #BFDBFE',
    marginBottom:    8,
  },
  recommTitle: {
    fontSize:     10,
    fontFamily:   'Helvetica-Bold',
    color:        '#1D4ED8',
    marginBottom: 6,
  },
  recommItem: {
    fontSize:   9,
    color:      '#1E40AF',
    marginBottom: 3,
    lineHeight:  1.4,
  },
})

// ── Composant PDF ─────────────────────────────────────────────────────────────

export function InstitutionReportPDF({ data }: { data: ReportData }) {
  const { institution, period, stats } = data
  const monthLabel = MONTHS_FR[period.month - 1]
  const color      = institution.primary_color || '#1E40AF'

  // Calcul taux de rétention
  const retentionRate = stats.total_members > 0
    ? Math.round((stats.active_members / stats.total_members) * 100)
    : 0

  // Recommandations auto
  const recommendations: string[] = []
  if (stats.isolation_score > 30)   recommendations.push(`• ${stats.isolated_count} membres sans échange — relancer avec une campagne de rappels ciblés`)
  if (stats.diversity_score < 5)     recommendations.push(`• Diversité faible (${stats.diversity_score} catégories) — encourager de nouvelles compétences`)
  if (stats.avg_rating < 4 && stats.total_exchanges > 0) recommendations.push(`• Note moyenne de ${stats.avg_rating}/5 — animer un atelier sur la qualité des échanges`)
  if (stats.new_members === 0)       recommendations.push(`• Aucun nouveau membre ce mois — activer les liens d'invitation et relancer les ambassadeurs`)
  if (stats.workshops_count === 0)   recommendations.push(`• Aucun atelier collectif — proposer aux membres experts d'en animer un`)
  if (recommendations.length === 0)  recommendations.push('• Excellente dynamique ! Continuer sur cette lancée et documenter les bonnes pratiques.')

  return (
    <Document title={`Rapport ${institution.name} — ${monthLabel} ${period.year}`}
              author="Bourse du Temps" subject="Rapport mensuel institution">

      {/* ── Page 1 : KPIs ── */}
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={[styles.header, { backgroundColor: color }]}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>{institution.name}</Text>
            <Text style={styles.headerSubtitle}>
              Rapport mensuel · {monthLabel} {period.year}
              {institution.country ? ` · ${institution.country}` : ''}
            </Text>
          </View>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>BOURSE DU TEMPS</Text>
            <Text style={[styles.headerBadgeText, { fontSize: 8, marginTop: 2, opacity: 0.8 }]}>
              Rapport généré automatiquement
            </Text>
          </View>
        </View>

        <View style={styles.body}>

          {/* KPIs membres */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>👥 Membres</Text>
            <View style={styles.kpiGrid}>
              {[
                { value: stats.total_members,   label: 'Total membres',     sub: '', color: '#2563EB' },
                { value: stats.new_members,      label: 'Nouveaux ce mois', sub: '↑ croissance',    color: '#16A34A' },
                { value: stats.active_members,   label: 'Membres actifs',   sub: `${retentionRate}% rétention`, color: '#7C3AED' },
                { value: `${retentionRate}%`,    label: 'Taux de rétention', sub: 'vs mois précédent', color: '#EA580C' },
              ].map((k, i) => (
                <View key={i} style={styles.kpiCard}>
                  <Text style={[styles.kpiValue, { color: k.color }]}>{k.value}</Text>
                  <Text style={styles.kpiLabel}>{k.label}</Text>
                  {k.sub ? <Text style={styles.kpiSub}>{k.sub}</Text> : null}
                </View>
              ))}
            </View>
          </View>

          {/* KPIs échanges */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔄 Échanges</Text>
            <View style={styles.kpiGrid}>
              {[
                { value: stats.total_exchanges,              label: 'Total échanges',     sub: 'cumulé',            color: '#2563EB' },
                { value: `${stats.total_hours}h`,            label: 'Heures échangées',   sub: 'temps collectif',   color: '#16A34A' },
                { value: `${stats.avg_rating}/5`,            label: 'Note moyenne',        sub: 'satisfaction',      color: '#F59E0B' },
                { value: `${stats.equivalent_value_eur} €`,  label: 'Valeur équivalente', sub: 'au SMIC horaire',   color: '#8B5CF6' },
              ].map((k, i) => (
                <View key={i} style={styles.kpiCard}>
                  <Text style={[styles.kpiValue, { color: k.color, fontSize: 16 }]}>{k.value}</Text>
                  <Text style={styles.kpiLabel}>{k.label}</Text>
                  <Text style={styles.kpiSub}>{k.sub}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* KPIs ESS */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📊 Indicateurs ESS</Text>
            <View style={styles.essGrid}>
              <View style={styles.essCard}>
                <Text style={styles.essCardTitle}>🔴 Isolement social</Text>
                <Text style={[styles.essValue, { color: stats.isolation_score > 30 ? '#EF4444' : '#16A34A' }]}>
                  {stats.isolation_score}%
                </Text>
                <Text style={styles.essDesc}>
                  {stats.isolated_count} membre{stats.isolated_count > 1 ? 's' : ''} sans échange.{'\n'}
                  {stats.isolation_score < 20 ? 'Excellent niveau de connexion.' : stats.isolation_score < 40 ? 'À surveiller.' : 'Action recommandée.'}
                </Text>
                <View style={styles.progressTrack}>
                  <View style={{ height: 6, width: `${Math.min(stats.isolation_score, 100)}%`, backgroundColor: stats.isolation_score > 30 ? '#EF4444' : '#16A34A', borderRadius: 3 }} />
                </View>
              </View>

              <View style={styles.essCard}>
                <Text style={styles.essCardTitle}>🌈 Diversité</Text>
                <Text style={[styles.essValue, { color: '#3B82F6' }]}>
                  {stats.diversity_score}/11
                </Text>
                <Text style={styles.essDesc}>
                  Catégories de compétences distinctes proposées par les membres.{'\n'}
                  {stats.diversity_score >= 8 ? 'Très bonne diversité.' : stats.diversity_score >= 5 ? 'Diversité correcte.' : 'À enrichir.'}
                </Text>
                <View style={styles.progressTrack}>
                  <View style={{ height: 6, width: `${(stats.diversity_score / 11) * 100}%`, backgroundColor: '#3B82F6', borderRadius: 3 }} />
                </View>
              </View>

              <View style={styles.essCard}>
                <Text style={styles.essCardTitle}>⚥ Parité genre</Text>
                <Text style={[styles.essValue, { color: '#8B5CF6' }]}>
                  {stats.gender_ratio}%
                </Text>
                <Text style={styles.essDesc}>
                  Proportion de femmes parmi les membres.{'\n'}
                  {stats.gender_ratio >= 45 && stats.gender_ratio <= 55 ? 'Parité atteinte ✓' : 'Objectif : 50%'}
                </Text>
                <View style={styles.progressTrack}>
                  <View style={{ height: 6, width: `${stats.gender_ratio}%`, backgroundColor: '#8B5CF6', borderRadius: 3 }} />
                </View>
              </View>
            </View>
          </View>

          {/* Ateliers */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎓 Ateliers collectifs</Text>
            <View style={styles.kpiGrid}>
              <View style={styles.kpiCard}>
                <Text style={[styles.kpiValue, { color: '#F59E0B' }]}>{stats.workshops_count}</Text>
                <Text style={styles.kpiLabel}>Ateliers organisés</Text>
              </View>
              <View style={styles.kpiCard}>
                <Text style={[styles.kpiValue, { color: '#10B981' }]}>{stats.workshop_attendees}</Text>
                <Text style={styles.kpiLabel}>Participants total</Text>
              </View>
              <View style={styles.kpiCard}>
                <Text style={[styles.kpiValue, { color: '#6366F1' }]}>
                  {stats.workshops_count > 0 ? Math.round(stats.workshop_attendees / stats.workshops_count) : 0}
                </Text>
                <Text style={styles.kpiLabel}>Moy. par atelier</Text>
              </View>
            </View>
          </View>

        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Bourse du Temps — Rapport confidentiel</Text>
          <Text style={styles.footerText}>Page 1/2</Text>
          <Text style={styles.footerText}>
            Généré le {new Date().toLocaleDateString('fr-FR')}
          </Text>
        </View>
      </Page>

      {/* ── Page 2 : Historique + Recommandations ── */}
      <Page size="A4" style={styles.page}>

        <View style={[styles.header, { backgroundColor: color }]}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>{institution.name}</Text>
            <Text style={styles.headerSubtitle}>Historique & Recommandations · {monthLabel} {period.year}</Text>
          </View>
        </View>

        <View style={styles.body}>

          {/* Historique 6 mois */}
          {stats.history && stats.history.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📈 Évolution sur 6 mois</Text>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  {['Période', 'Nouveaux membres', 'Échanges', 'Valeur créée (€)'].map(h => (
                    <Text key={h} style={styles.tableHeaderCell}>{h}</Text>
                  ))}
                </View>
                {stats.history.map((h, i) => (
                  <View key={i} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
                    <Text style={styles.tableCell}>{MONTHS_FR[h.period_month - 1]} {h.period_year}</Text>
                    <Text style={styles.tableCell}>{h.new_members}</Text>
                    <Text style={styles.tableCell}>{h.total_exchanges}</Text>
                    <Text style={styles.tableCell}>{h.equivalent_value_eur} €</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Recommandations */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💡 Recommandations automatiques</Text>
            <View style={styles.recommBox}>
              <Text style={styles.recommTitle}>Actions suggérées pour {MONTHS_FR[period.month % 12]} {period.month === 12 ? period.year + 1 : period.year}</Text>
              {recommendations.map((r, i) => (
                <Text key={i} style={styles.recommItem}>{r}</Text>
              ))}
            </View>
          </View>

          {/* Synthèse */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 Synthèse exécutive</Text>
            <View style={[styles.recommBox, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}>
              <Text style={[styles.recommTitle, { color: '#15803D' }]}>Points forts du mois</Text>
              <Text style={[styles.recommItem, { color: '#166534' }]}>
                • Valeur sociale créée : {stats.equivalent_value_eur} € (équivalent SMIC horaire 11,88 €/h)
              </Text>
              <Text style={[styles.recommItem, { color: '#166534' }]}>
                • Taux d'engagement : {retentionRate}% des membres actifs
              </Text>
              {stats.workshops_count > 0 && (
                <Text style={[styles.recommItem, { color: '#166534' }]}>
                  • {stats.workshops_count} atelier{stats.workshops_count > 1 ? 's' : ''} organisé{stats.workshops_count > 1 ? 's' : ''} avec {stats.workshop_attendees} participant{stats.workshop_attendees > 1 ? 's' : ''}
                </Text>
              )}
            </View>
          </View>

          {/* Mention légale */}
          <View style={{ marginTop: 20, padding: '12 16', backgroundColor: '#F8FAFC', borderRadius: 8, border: '1 solid #E2E8F0' }}>
            <Text style={{ fontSize: 7, color: '#94A3B8', lineHeight: 1.5 }}>
              Ce rapport est généré automatiquement par la plateforme Bourse du Temps à partir des données de la période indiquée.
              Les indicateurs ESS (Économie Sociale et Solidaire) sont calculés selon les méthodes standards du secteur.
              La valeur équivalente en euros est calculée sur la base du SMIC horaire en vigueur (11,88 €/h — France 2024).
              Document confidentiel destiné à l'usage exclusif de {institution.name}.
            </Text>
          </View>

        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Bourse du Temps — Rapport confidentiel</Text>
          <Text style={styles.footerText}>Page 2/2</Text>
          <Text style={styles.footerText}>boursedutemps.vercel.app</Text>
        </View>
      </Page>

    </Document>
  )
}
