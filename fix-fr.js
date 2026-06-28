// fix-fr.js — corrige les sections corrompues dans fr.json
// Run: node fix-fr.js

const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'messages', 'fr.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

// Nav
data.nav.contact = "Contact";

// Dashboard
data.dashboard = {
  loginRequired: "Connexion requise",
  loginDesc: "Accédez à votre espace personnel",
  login: "Se connecter",
  greeting: "Bonjour, {name} \uD83D\uDC4B",
  subtitle: "Votre espace personnel",
  myProfile: "Mon profil \u2192",
  statCredits: "Crédits",
  statServices: "Services",
  statExchanges: "Échanges",
  statEarned: "Crédits gagnés",
  reviewsBanner: "{count} avis en attente",
  reviewsDesc: "Partagez votre expérience après vos échanges récents",
  rateUser: "Noter {name}",
  leaveReview: "Laisser un avis \u2192",
  creditHistory: "Historique des crédits",
  earned: "gagnés",
  spent: "dépensés",
  myServices: "Mes services",
  viewAll: "Voir tous \u2192",
  noServices: "Vous n'avez pas encore de service proposé.",
  exchange: "Échange",
  shortcuts: {
    services: "Explorer les services",
    requests: "Voir les demandes",
    members: "Trouver des membres",
    workshops: "Ateliers collectifs",
    projects: "Projets collaboratifs",
    search: "Recherche IA"
  }
};

// Members
data.members = {
  label: "Notre communauté",
  title: "Les membres",
  subtitle: "{count} personne{plural} prête{plural} à échanger leur temps.",
  searchPlaceholder: "Rechercher par nom, compétence, ville\u2026",
  noResults: "Aucun membre trouvé",
  verified: "\u2713 Vérifié",
  member: "Membre"
};

// Forum
data.forum = {
  title: "Forum des échanges",
  newTopic: "Nouveau Sujet",
  editTopic: "Modifier le sujet",
  startDiscussion: "Lancer une discussion",
  titlePlaceholder: "Titre du sujet",
  messagePlaceholder: "Votre message...",
  externalLinkPlaceholder: "Lien externe (optionnel)",
  uploading: "Upload...",
  fileReady: "Fichier prêt",
  importMedia: "Importer Photo/Vidéo",
  removeMedia: "Supprimer",
  update: "Mettre à jour",
  publish: "Publier",
  cancel: "Annuler",
  externalLink: "Lien externe",
  by: "Par",
  commentPlaceholder: "Commenter...",
  send: "Envoyer",
  empty: "Aucune discussion en cours. Soyez le premier !",
  loginRequired: "Connectez-vous pour participer",
  confirmDelete: "Supprimer définitivement ce sujet ?"
};

fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
console.log('fr.json corrige avec succes!');
console.log('nav.contact:', data.nav.contact);
console.log('forum.title:', data.forum.title);
console.log('members.title:', data.members.title);
