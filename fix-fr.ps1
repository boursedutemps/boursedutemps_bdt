# fix-fr.ps1 — ajoute dashboard, members, forum + nav.contact dans fr.json
# Run from: P:\Mes Projets\boursedutemps

$file = "messages\fr.json"
$content = [System.IO.File]::ReadAllText((Resolve-Path $file).Path, [System.Text.Encoding]::UTF8)

# 1. Ajouter nav.contact avant notifications
if ($content -notmatch '"contact":\s*"Contact"') {
    $content = $content -replace '"notifications":', '"contact": "Contact",' + "`n    " + '"notifications":'
    Write-Host "OK: nav.contact ajoute"
} else {
    Write-Host "SKIP: nav.contact deja present"
}

# 2. Ajouter dashboard, members, forum avant le dernier }
$addition = @'
,
  "dashboard": {
    "loginRequired": "Connexion requise",
    "loginDesc": "Accédez à votre espace personnel",
    "login": "Se connecter",
    "greeting": "Bonjour, {name} \ud83d\udc4b",
    "subtitle": "Votre espace personnel",
    "myProfile": "Mon profil \u2192",
    "statCredits": "Crédits",
    "statServices": "Services",
    "statExchanges": "Échanges",
    "statEarned": "Crédits gagnés",
    "reviewsBanner": "{count} avis en attente",
    "reviewsDesc": "Partagez votre expérience après vos échanges récents",
    "rateUser": "Noter {name}",
    "leaveReview": "Laisser un avis \u2192",
    "creditHistory": "Historique des crédits",
    "earned": "gagnés",
    "spent": "dépensés",
    "myServices": "Mes services",
    "viewAll": "Voir tous \u2192",
    "noServices": "Vous n'avez pas encore de service proposé.",
    "exchange": "Échange",
    "shortcuts": {
      "services": "Explorer les services",
      "requests": "Voir les demandes",
      "members": "Trouver des membres",
      "workshops": "Ateliers collectifs",
      "projects": "Projets collaboratifs",
      "search": "Recherche IA"
    }
  },
  "members": {
    "label": "Notre communauté",
    "title": "Les membres",
    "subtitle": "{count} personne{plural} prête{plural} à échanger leur temps.",
    "searchPlaceholder": "Rechercher par nom, compétence, ville\u2026",
    "noResults": "Aucun membre trouvé",
    "verified": "\u2713 Vérifié",
    "member": "Membre"
  },
  "forum": {
    "title": "Forum des échanges",
    "newTopic": "Nouveau Sujet",
    "editTopic": "Modifier le sujet",
    "startDiscussion": "Lancer une discussion",
    "titlePlaceholder": "Titre du sujet",
    "messagePlaceholder": "Votre message...",
    "externalLinkPlaceholder": "Lien externe (optionnel)",
    "uploading": "Upload...",
    "fileReady": "Fichier prêt",
    "importMedia": "Importer Photo/Vidéo",
    "removeMedia": "Supprimer",
    "update": "Mettre à jour",
    "publish": "Publier",
    "cancel": "Annuler",
    "externalLink": "Lien externe",
    "by": "Par",
    "commentPlaceholder": "Commenter...",
    "send": "Envoyer",
    "empty": "Aucune discussion en cours. Soyez le premier !",
    "loginRequired": "Connectez-vous pour participer",
    "confirmDelete": "Supprimer définitivement ce sujet ?"
  }
'@

if ($content -notmatch '"forum":\s*\{') {
    $lastBrace = $content.LastIndexOf('}')
    $content = $content.Substring(0, $lastBrace).TrimEnd().TrimEnd(',')
    $content += $addition
    $content += "`n}"
    Write-Host "OK: dashboard + members + forum ajoutés"
} else {
    Write-Host "SKIP: sections deja presentes"
}

[System.IO.File]::WriteAllText((Resolve-Path $file).Path, $content, [System.Text.Encoding]::UTF8)
Write-Host "fr.json mis a jour."

# Vérification
$check = Select-String -LiteralPath $file -Pattern '"forum":\s*\{'
if ($check) { Write-Host "CHECK OK: forum section trouvee" }
else { Write-Host "CHECK FAIL: forum section manquante" }
