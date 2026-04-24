exports.id=6977,exports.ids=[6977],exports.modules={59514:(e,t,s)=>{Promise.resolve().then(s.bind(s,285))},9924:(e,t,s)=>{Promise.resolve().then(s.t.bind(s,63642,23)),Promise.resolve().then(s.t.bind(s,87586,23)),Promise.resolve().then(s.t.bind(s,47838,23)),Promise.resolve().then(s.t.bind(s,58057,23)),Promise.resolve().then(s.t.bind(s,77741,23)),Promise.resolve().then(s.t.bind(s,13118,23))},69903:(e,t,s)=>{Promise.resolve().then(s.t.bind(s,34080,23))},64575:(e,t,s)=>{"use strict";s.d(t,{Z:()=>D});var a=s(97247),i=s(28964),n=s.n(i),r=s(79906),l=s(44597),o=s(34178),c=s(49256),u=s(81299),d=s(17712),x=s(37013),m=s(6683);let p=({currentPage:e,user:t,notifications:s,onNavigate:n,onLogin:p,onSignup:h,onLogout:b,onMarkRead:g})=>{let[f,v]=(0,i.useState)(!1),[j,N]=(0,i.useState)(!1),[y,w]=(0,i.useState)(!1),[C,L]=(0,i.useState)(!1),S=(0,i.useRef)(null),q=(0,i.useRef)(null),D=(0,o.useRouter)(),k=(0,o.usePathname)(),E=s.filter(e=>!e.isRead).length;(0,i.useEffect)(()=>{L(!0);let e=e=>{S.current&&!S.current.contains(e.target)&&N(!1),q.current&&!q.current.contains(e.target)&&w(!1)};return document.addEventListener("mousedown",e),()=>document.removeEventListener("mousedown",e)},[]);let T=[{label:"Accueil",page:"home",path:"/"},{label:"\xc0 Propos",page:"about",path:"/about"},{label:"Services",page:"services",path:"/services"},{label:"Demandes",page:"requests",path:"/requests"},{label:"Membres",page:"members",path:"/members"},{label:"Forum",page:"forum",path:"/forum"},{label:"Blog",page:"blog",path:"/blog"},{label:"T\xe9moignages",page:"testimonials",path:"/testimonials"}],I=t?.role==="admin"||t?.role==="moderator";return(0,a.jsxs)("nav",{className:"fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm transition-all duration-300",children:[a.jsx("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",children:(0,a.jsxs)("div",{className:"flex justify-between h-16 items-center",children:[(0,a.jsxs)(r.default,{href:"/",className:"flex items-center gap-3 cursor-pointer group",children:[(0,a.jsxs)("div",{className:"relative w-10 h-10",children:[a.jsx(l.default,{src:"https://i.postimg.cc/5Y3Rg6zs/image-1.jpg",alt:"Logo",fill:!0,className:"rounded-full shadow-sm group-hover:scale-105 transition-transform object-cover border border-slate-100"}),a.jsx("div",{className:"absolute inset-0 rounded-full bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors"})]}),a.jsx("span",{className:"font-heading font-bold text-lg tracking-tight text-slate-900 hidden sm:block uppercase",children:"BOURSE DU TEMPS"})]}),(0,a.jsxs)("div",{className:"hidden lg:flex items-center gap-1",children:[T.map(e=>a.jsx(r.default,{href:e.path,className:`px-3 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${k===e.path?"text-blue-600 bg-blue-50":"text-slate-600 hover:text-blue-600 hover:bg-slate-50"}`,children:e.label},e.page)),I&&a.jsx(r.default,{href:"/moderation",className:`px-3 py-2 rounded-full text-sm font-semibold transition-all duration-200 ml-1 ${"/moderation"===k?"text-purple-600 bg-purple-50":"text-purple-500 hover:text-purple-600 hover:bg-purple-50"}`,children:"Mod\xe9ration"}),(0,a.jsxs)("div",{className:"ml-4 pl-4 border-l border-slate-200 flex items-center gap-2",children:[(0,a.jsxs)("div",{className:"relative",ref:q,children:[a.jsx("button",{onClick:()=>w(!y),className:`p-2 rounded-full transition-all duration-200 ${y?"text-blue-600 bg-blue-50":"text-slate-500 hover:text-blue-600 hover:bg-slate-50"}`,children:a.jsx(c.Z,{className:"w-5 h-5"})}),y&&a.jsx("div",{className:"absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 animate-in fade-in slide-in-from-top-2 duration-200",children:a.jsx("input",{autoFocus:!0,type:"text",placeholder:"Rechercher...",className:"w-full px-4 py-2 text-sm bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"})})]}),t&&(0,a.jsxs)("div",{className:"relative",ref:S,children:[(0,a.jsxs)("button",{onClick:()=>N(!j),className:`p-2 rounded-full transition-all duration-200 relative ${j?"text-blue-600 bg-blue-50":"text-slate-500 hover:text-blue-600 hover:bg-slate-50"}`,children:[a.jsx(u.Z,{className:"w-5 h-5"}),E>0&&a.jsx("span",{className:"absolute top-1.5 right-1.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white",children:E})]}),j&&(0,a.jsxs)("div",{className:"absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200",children:[(0,a.jsxs)("div",{className:"p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50",children:[a.jsx("h3",{className:"font-bold text-sm text-slate-800",children:"Notifications"}),(0,a.jsxs)("span",{className:"text-[10px] font-bold text-slate-400 uppercase tracking-widest",children:[E," non lues"]})]}),a.jsx("div",{className:"max-h-96 overflow-y-auto",children:s.length>0?s.map(e=>a.jsx("div",{onClick:()=>{g(e.id),("message"===e.type||"connection"===e.type)&&D.push("/profile"),N(!1)},className:`p-4 border-b border-slate-50 cursor-pointer transition hover:bg-slate-50 ${e.isRead?"":"bg-blue-50/30"}`,children:(0,a.jsxs)("div",{className:"flex gap-3",children:[a.jsx("div",{className:`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-lg ${"transaction"===e.type?"bg-green-100":"connection"===e.type?"bg-purple-100":"bg-blue-100"}`,children:"transaction"===e.type?"\uD83D\uDCB0":"connection"===e.type?"\uD83E\uDD1D":"\uD83D\uDD14"}),(0,a.jsxs)("div",{className:"space-y-1",children:[(0,a.jsxs)("p",{className:"text-sm text-slate-700 leading-tight",children:[a.jsx("span",{className:"font-bold",children:e.fromName})," ",e.content]}),a.jsx("p",{className:"text-[10px] text-slate-400 font-medium",children:C?new Date(e.createdAt).toLocaleDateString("fr-FR",{hour:"2-digit",minute:"2-digit"}):""})]})]})},e.id)):a.jsx("div",{className:"p-8 text-center",children:a.jsx("p",{className:"text-sm text-slate-400",children:"Aucune notification"})})})]})]}),t?(0,a.jsxs)(r.default,{href:"/profile",className:"flex items-center gap-2 bg-blue-600 text-white pl-4 pr-1.5 py-1.5 rounded-full transition-all duration-200 hover:bg-blue-700 shadow-md shadow-blue-200 group",children:[(0,a.jsxs)("div",{className:"flex items-center gap-1.5",children:[a.jsx(d.Z,{className:"w-4 h-4 text-blue-100"}),a.jsx("span",{className:"text-sm font-bold",children:t.credits})]}),a.jsx("div",{className:"w-7 h-7 rounded-full bg-white flex items-center justify-center overflow-hidden border border-blue-400 shadow-sm group-hover:scale-105 transition-transform relative",children:t.avatar?a.jsx(l.default,{src:t.avatar??"",alt:"User avatar",fill:!0,className:"object-cover",unoptimized:(t.avatar??"").startsWith("data:"),sizes:"28px",quality:80}):a.jsx("span",{className:"text-[10px] text-blue-600 font-bold",children:t.firstName[0]})})]}):a.jsx("button",{onClick:p,className:"bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-bold transition shadow-lg shadow-blue-100 active:scale-95",children:"Acc\xe8s Membre"})]})]}),a.jsx("button",{className:"lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-full transition-colors",onClick:()=>v(!f),children:f?a.jsx(x.Z,{className:"w-6 h-6"}):a.jsx(m.Z,{className:"w-6 h-6"})})]})}),f&&(0,a.jsxs)("div",{className:"lg:hidden bg-white border-t border-slate-100 py-4 px-4 space-y-1 shadow-2xl animate-in slide-in-from-top duration-300",children:[T.map(e=>a.jsx(r.default,{href:e.path,onClick:()=>v(!1),className:`w-full text-left px-4 py-3 rounded-xl text-base font-bold transition-colors block ${k===e.path?"bg-blue-50 text-blue-600":"text-slate-700 hover:bg-slate-50"}`,children:e.label},e.page)),a.jsx("div",{className:"pt-4 mt-4 border-t border-slate-100 space-y-3",children:t?(0,a.jsxs)(r.default,{href:"/profile",onClick:()=>v(!1),className:"w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-100 flex items-center justify-center gap-2",children:[a.jsx(d.Z,{className:"w-5 h-5"}),"Mon Profil (",t.credits," cr\xe9dits)"]}):a.jsx("button",{onClick:()=>{p(),v(!1)},className:"w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-100",children:"Acc\xe8s Membre"})})]})]})};function h({onClose:e}){let[t,s]=(0,i.useState)(!1);return a.jsx("div",{className:`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 
                 transition-opacity duration-300 ease-out ${t?"opacity-0":"opacity-100"}`,role:"dialog","aria-modal":"true","aria-labelledby":"modal-title-loi",children:(0,a.jsxs)("div",{className:`bg-white max-h-[90vh] overflow-y-auto rounded-lg shadow-xl p-6 w-full max-w-3xl text-slate-800 
                   transform transition-transform duration-300 ease-out ${t?"scale-95 opacity-0":"scale-100 opacity-100"}`,children:[a.jsx("h2",{id:"modal-title-loi",className:"text-2xl font-bold mb-6 text-center",children:"LOI DES CONDITIONS D’\xc9CHANGE – BOURSE DU TEMPS"}),a.jsx("div",{className:"space-y-4 text-sm leading-relaxed whitespace-pre-line",children:`
LOI DE CONDITIONS D’\xc9CHANGE – BOURSE DU TEMPS
1. Objet de la Loi
La pr\xe9sente Loi de Conditions d’\xc9change a pour objectif d’encadrer les \xe9changes de services, de comp\xe9tences et de temps entre les utilisateurs du site Bourse du Temps (https://boursedutemps.vercel.app).
Elle d\xe9finit les droits, obligations et responsabilit\xe9s de chaque participant afin de garantir un environnement s\xfbr, \xe9quitable et respectueux.

2. D\xe9finitions
• Utilisateur : toute personne acc\xe9dant au site ou participant \xe0 un \xe9change.
• Offreur : utilisateur proposant un service ou une comp\xe9tence.
• Demandeur : utilisateur sollicitant un service ou une comp\xe9tence.
• \xc9change : prestation r\xe9alis\xe9e entre deux utilisateurs, bas\xe9e un principe de temps contre temps ou service contre service.
• Cr\xe9dit‑Temps : unit\xe9 symbolique repr\xe9sentant la valeur d’un \xe9change (si applicable).

3. Nature des \xc9changes
3.1 Gratuit\xe9
Les \xe9changes r\xe9alis\xe9s via Bourse du Temps sont non commerciaux.
Aucun paiement financier ne peut \xeatre exig\xe9 ou propos\xe9.
3.2 R\xe9ciprocit\xe9
Les \xe9changes reposent sur un principe d’\xe9quit\xe9 :
• un service rendu peut \xeatre compens\xe9 par un autre service,
• ou par un temps \xe9quivalent, selon les modalit\xe9s convenues entre les utilisateurs.
3.3 Libert\xe9 contractuelle
Les utilisateurs sont libres de :
• choisir leurs partenaires d’\xe9change,
• d\xe9finir les modalit\xe9s de l’\xe9change,
• refuser un \xe9change sans justification.

4. Engagements des Utilisateurs
4.1 Respect et courtoisie
Chaque utilisateur s’engage \xe0 adopter un comportement respectueux, bienveillant et non discriminatoire.
4.2 Exactitude des informations
Les utilisateurs doivent fournir des informations sinc\xe8res concernant :
• leurs comp\xe9tences,
• leur disponibilit\xe9,
• leur identit\xe9.
4.3 S\xe9curit\xe9
Les utilisateurs doivent veiller \xe0 leur propre s\xe9curit\xe9 et ne pas proposer :
• de services ill\xe9gaux,
• de services dangereux,
• de services n\xe9cessitant une qualification professionnelle r\xe9glement\xe9e (ex : m\xe9decine, droit, \xe9lectricit\xe9 haute tension).

5. Responsabilit\xe9s
5.1 Responsabilit\xe9 de l’\xe9diteur
Le site Bourse du Temps :
• n’intervient pas dans les \xe9changes,
• ne garantit pas la qualit\xe9 des services,
• ne peut \xeatre tenu responsable des litiges entre utilisateurs.
5.2 Responsabilit\xe9 des utilisateurs
Les utilisateurs sont seuls responsables :
• des engagements qu’ils prennent,
• de la qualit\xe9 des services rendus,
• des cons\xe9quences de leurs actions.

6. Confidentialit\xe9 et Donn\xe9es
Les \xe9changes doivent respecter la vie priv\xe9e de chacun.
Aucune donn\xe9e personnelle obtenue dans le cadre d’un \xe9change ne peut \xeatre :
• divulgu\xe9e,
• vendue,
• utilis\xe9e \xe0 des fins commerciales.

7. Annulation et Litiges
7.1 Annulation
Un utilisateur peut annuler un \xe9change, mais doit pr\xe9venir l’autre partie dans un d\xe9lai raisonnable.
7.2 Litiges
En cas de d\xe9saccord, les utilisateurs doivent tenter une r\xe9solution amiable.
Le site n’intervient pas dans les conflits.

8. Interdictions
Il est strictement interdit de :
• proposer des services ill\xe9gaux,
• exiger une r\xe9mun\xe9ration financi\xe8re,
• usurper l’identit\xe9 d’un tiers,
• harceler ou menacer un autre utilisateur,
• d\xe9tourner le site \xe0 des fins commerciales.

9. Suspension ou Exclusion
L’\xe9diteur du site se r\xe9serve le droit de suspendre ou supprimer l’acc\xe8s d’un utilisateur en cas de :
• non‑respect de la Loi,
• comportement dangereux,
• fraude ou tentative de fraude.

10. Modification de la Loi
La pr\xe9sente Loi peut \xeatre modifi\xe9e \xe0 tout moment.
La version en vigueur est celle publi\xe9e sur le site.

11. Acceptation
L’utilisation du site implique l’acceptation pleine et enti\xe8re de la pr\xe9sente Loi de Conditions d’\xc9change.
`}),a.jsx("hr",{className:"my-8 border-slate-300"}),a.jsx("h2",{className:"text-2xl font-bold mb-6 text-center",children:"CHARTE \xc9THIQUE – BOURSE DU TEMPS"}),a.jsx("div",{className:"space-y-4 text-sm leading-relaxed whitespace-pre-line",children:`
Pr\xe9ambule
La communaut\xe9 Bourse du Temps repose sur un principe simple : chacun poss\xe8de du temps, des talents et des comp\xe9tences qui peuvent b\xe9n\xe9ficier aux autres.
Cette Charte \xc9thique \xe9tablit les valeurs fondamentales qui guident les \xe9changes entre les membres.
En utilisant le site, chaque utilisateur s’engage \xe0 respecter ces principes.

1. Respect et Bienveillance
Chaque membre s’engage \xe0 :
traiter les autres avec courtoisie et respect
adopter une attitude positive et non discriminatoire
\xe9couter, comprendre et communiquer de mani\xe8re constructive
*Aucun comportement agressif, humiliant ou irrespectueux n’est tol\xe9r\xe9.

2. Confiance et Transparence
La confiance est la base de tout \xe9change.
Les utilisateurs doivent :
fournir des informations sinc\xe8res sur leurs comp\xe9tences et disponibilit\xe9s
respecter les engagements pris
pr\xe9venir en cas d’impr\xe9vu ou d’annulation
*La transparence renforce la qualit\xe9 des \xe9changes.

3. \xc9quit\xe9 et R\xe9ciprocit\xe9
Les \xe9changes doivent \xeatre :
\xe9quitables
\xe9quilibr\xe9s
bas\xe9s sur la r\xe9ciprocit\xe9
*Chaque service rendu doit \xeatre compens\xe9 par un autre service ou un temps \xe9quivalent, selon les modalit\xe9s convenues librement entre les utilisateurs.

4. Gratuit\xe9 des \xc9changes
La Bourse du Temps repose sur un principe fondamental :
aucune transaction financi\xe8re n’est autoris\xe9e
aucun utilisateur ne peut exiger ou proposer une r\xe9mun\xe9ration en argent
*Les \xe9changes sont bas\xe9s uniquement sur le temps, l’entraide et la solidarit\xe9.

5. S\xe9curit\xe9 et Responsabilit\xe9
Chaque utilisateur doit :
veiller \xe0 sa propre s\xe9curit\xe9
ne proposer que des services qu’il ma\xeetrise r\xe9ellement
ne pas s’engager dans des activit\xe9s dangereuses ou ill\xe9gales
*Les services n\xe9cessitant une qualification professionnelle r\xe9glement\xe9e (m\xe9decine, droit, travaux \xe9lectriques complexes, etc.) sont interdits.

6. Confidentialit\xe9 et Respect de la Vie Priv\xe9e
Les informations \xe9chang\xe9es entre utilisateurs doivent rester confidentielles.
Il est strictement interdit de :
divulguer des donn\xe9es personnelles
enregistrer ou publier des \xe9changes sans consentement
utiliser les informations obtenues \xe0 des fins commerciales ou malveillantes
*La confiance passe par la discr\xe9tion.

7. Inclusion et Non‑Discrimination
La communaut\xe9 est ouverte \xe0 tous, sans distinction de :
sexe
\xe2ge
origine
religion
situation sociale
handicap
*Toute forme de discrimination est strictement interdite.

8. Engagement envers la Qualit\xe9
Chaque utilisateur s’engage \xe0 :
fournir un service de qualit\xe9
respecter les d\xe9lais convenus
faire preuve de s\xe9rieux et de professionnalisme
*Un \xe9change r\xe9ussi renforce la communaut\xe9.

9. R\xe9solution des Conflits
En cas de d\xe9saccord, les utilisateurs doivent :
privil\xe9gier le dialogue
rechercher une solution amiable
faire preuve de compr\xe9hension
*Le site n’intervient pas dans les litiges, mais encourage la communication respectueuse.

10. Contribution \xe0 la Communaut\xe9
Chaque membre contribue \xe0 faire de Bourse du Temps un espace :
utile
solidaire
respectueux
enrichissant pour tous
*L’esprit d’entraide est au cœur du projet.

11. Acceptation de la Charte
L’utilisation du site implique l’acceptation pleine et enti\xe8re de la pr\xe9sente Charte \xc9thique.
Tout manquement peut entra\xeener une suspension ou une exclusion de la plateforme.
`}),a.jsx("button",{onClick:()=>{s(!0),setTimeout(()=>{e()},300)},className:"mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400",children:"Fermer"})]})})}function b({onClose:e}){let[t,s]=(0,i.useState)(!1);return a.jsx("div",{className:`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 
                 transition-opacity duration-300 ease-out ${t?"opacity-0":"opacity-100"}`,role:"dialog","aria-modal":"true","aria-labelledby":"modal-title-politique",children:(0,a.jsxs)("div",{className:`bg-white max-h-[90vh] overflow-y-auto rounded-lg shadow-xl p-6 w-full max-w-3xl text-slate-800 
                   transform transition-transform duration-300 ease-out ${t?"scale-95 opacity-0":"scale-100 opacity-100"}`,children:[a.jsx("h2",{id:"modal-title-politique",className:"text-2xl font-bold mb-6 text-center",children:"POLITIQUE DE CONFIDENTIALIT\xc9 – BOURSE DU TEMPS"}),a.jsx("div",{className:"space-y-4 text-sm leading-relaxed whitespace-pre-line",children:`
POLITIQUE DE CONFIDENTIALIT\xc9 – Bourse du Temps
1. Introduction
Le site Bourse du Temps (https://boursedutemps.vercel.app/) accorde une grande importance \xe0 la protection de vos donn\xe9es personnelles.
La pr\xe9sente Politique de Confidentialit\xe9 explique quelles informations nous collectons, comment nous les utilisons et quels sont vos droits.
En utilisant notre site, vous acceptez les pratiques d\xe9crites ci-dessous.

2. Donn\xe9es collect\xe9es
2.1 Donn\xe9es fournies volontairement
Lorsque vous utilisez notre formulaire de contact, nous collectons :
• Nom et pr\xe9nom
• Adresse e‑mail
• Message ou informations que vous choisissez de nous transmettre
2.2 Donn\xe9es collect\xe9es automatiquement
Lors de votre navigation au site :
• Adresse IP
• Type de navigateur et appareil
• Pages consult\xe9es
• Donn\xe9es analytiques anonymis\xe9es
• Cookies techniques et analytiques

3. Finalit\xe9s de la collecte
Les donn\xe9es collect\xe9es servent \xe0 :
• R\xe9pondre \xe0 vos demandes via le formulaire
• Am\xe9liorer l’exp\xe9rience utilisateur
• Assurer le fonctionnement technique du site
• Analyser l’audience et les performances du site
Aucune donn\xe9e n’est utilis\xe9e \xe0 des fins commerciales.

4. Partage des donn\xe9es
Vos donn\xe9es ne sont jamais vendues.
Elles peuvent \xeatre partag\xe9es uniquement avec :
• Notre h\xe9bergeur
• Nos outils techniques (ex : Vercel, services d’analyse)
• Les autorit\xe9s l\xe9gales en cas d’obligation

5. Cookies
Le site utilise des cookies pour :
• Assurer son bon fonctionnement
• Mesurer l’audience
• Optimiser les performances
Vous pouvez d\xe9sactiver les cookies via les param\xe8tres de votre navigateur.

6. S\xe9curit\xe9
Nous mettons en place des mesures techniques pour prot\xe9ger vos donn\xe9es contre :
• L’acc\xe8s non autoris\xe9
• La perte
• La modification
• La divulgation

7. Dur\xe9e de conservation
Les donn\xe9es envoy\xe9es via le formulaire sont conserv\xe9es uniquement le temps n\xe9cessaire au traitement de votre demande.

MENTIONS L\xc9GALES – Bourse du Temps
1. \xc9diteur du site
Nom / Raison sociale : PIERRE LOUIS Jean Bernard
Adresse : Universit\xe9 Senghor
Quartier des Universit\xe9s - Axe Central
Ville Borg El-Arab El-Gedida - 5220220 \xc9gypte
Email : jean.pierre-louis.2025@etu-usenghor.org
T\xe9l\xe9phone : +509 32 27 4422

2. Directeur de la publication
PIERRE LOUIS Jean Bernard 

3. H\xe9bergeur
Le site est h\xe9berg\xe9 par :
Vercel Inc.
340 S Lemon Ave #4133
Walnut, CA 91789
\xc9tats‑Unis

4. Propri\xe9t\xe9 intellectuelle
Tous les contenus pr\xe9sents sur le site (textes, images, logos, design) sont prot\xe9g\xe9s par le droit d’auteur.
Toute reproduction sans autorisation est interdite.

5. Responsabilit\xe9
L’\xe9diteur ne peut \xeatre tenu responsable :
• D’interruptions du site
• D’erreurs ou omissions dans le contenu
• De dommages li\xe9s \xe0 l’utilisation du site
• Des liens externes pr\xe9sents sur le site

CONDITIONS G\xc9N\xc9RALES D’UTILISATION (CGU)
1. Objet
Les pr\xe9sentes CGU encadrent l’utilisation du site Bourse du Temps.

2. Acc\xe8s au site
Le site est accessible gratuitement \xe0 toutes les personnes, membres de nos organisations partenaires.

3. Services propos\xe9s
Le site propose :
• Des informations sur le concept Bourse du Temps
• Un formulaire de contact
• Une pr\xe9sentation des services
Aucune transaction mon\xe9taire n’est effectu\xe9e sur le site.

4. Obligations de l’utilisateur
L’utilisateur s’engage \xe0 :
• Ne pas utiliser le site \xe0 des fins ill\xe9gales
• Ne pas tenter d’acc\xe9der aux donn\xe9es d’autres utilisateurs
• Fournir des informations exactes via le formulaire

5. Propri\xe9t\xe9 intellectuelle
Tous les contenus du site sont prot\xe9g\xe9s.
Toute reproduction est interdite sans autorisation \xe9crite.

6. Donn\xe9es personnelles
L’utilisation du site implique l’acceptation de notre Politique de Confidentialit\xe9.

7. Limitation de responsabilit\xe9
Nous ne garantissons pas :
• L’absence d’erreurs
• La disponibilit\xe9 permanente du site
• L’exactitude des informations

8. Modification des CGU
Les CGU peuvent \xeatre modifi\xe9es \xe0 tout moment.
La version en vigueur est celle affich\xe9e sur le site.

9. Droit applicable
Les pr\xe9sentes CGU sont soumises au droit des pays concern\xe9s et aux r\xe8glements de nos organisations partenaires.
`}),a.jsx("button",{onClick:()=>{s(!0),setTimeout(()=>{e()},300)},className:"mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400",children:"Fermer"})]})})}var g=s(165),f=s(97078),v=s(90526),j=s(74747),N=s(8749),y=s(1669);function w({onClose:e}){let[t,s]=(0,i.useState)({fullName:"",email:"",whatsapp:"",organization:"",subject:"",message:""}),[n,r]=(0,i.useState)("idle"),[l,o]=(0,i.useState)(""),c=async e=>{e.preventDefault(),r("loading"),o("");try{let e=await fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),s=await e.json();if(e.ok)r("success");else throw Error(s.error||"Une erreur est survenue")}catch(e){r("error"),o(e.message)}},u=e=>{s({...t,[e.target.name]:e.target.value})};return a.jsx("div",{className:"fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm",children:(0,a.jsxs)(g.E.div,{initial:{opacity:0,scale:.9,y:20},animate:{opacity:1,scale:1,y:0},exit:{opacity:0,scale:.9,y:20},className:"relative bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden",children:[(0,a.jsxs)("div",{className:"bg-blue-600 px-8 py-6 text-white relative",children:[a.jsx("button",{onClick:e,className:"absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors",children:a.jsx(x.Z,{size:24})}),(0,a.jsxs)("div",{className:"flex items-center gap-3 mb-2",children:[a.jsx(v.Z,{className:"text-blue-200",size:28}),a.jsx("h2",{className:"text-2xl font-bold font-heading",children:"Contactez-nous"})]}),a.jsx("p",{className:"text-blue-100 text-sm",children:"Signalez un probl\xe8me ou demandez une information."})]}),a.jsx("div",{className:"p-8 max-h-[80vh] overflow-y-auto custom-scrollbar",children:a.jsx(f.M,{mode:"wait",children:"success"===n?(0,a.jsxs)(g.E.div,{initial:{opacity:0,scale:.5},animate:{opacity:1,scale:1},className:"py-12 text-center",children:[a.jsx("div",{className:"w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6",children:a.jsx(j.Z,{size:48})}),a.jsx("h3",{className:"text-2xl font-bold text-slate-900 mb-2",children:"Message envoy\xe9 !"}),a.jsx("p",{className:"text-slate-600 mb-8 max-w-sm mx-auto",children:"Merci de nous avoir contact\xe9s. Un email de confirmation vous a \xe9t\xe9 envoy\xe9."}),a.jsx("button",{onClick:e,className:"px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all",children:"Fermer"})]},"success"):(0,a.jsxs)(g.E.form,{onSubmit:c,initial:{opacity:0},animate:{opacity:1},className:"space-y-5",children:[(0,a.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-5",children:[(0,a.jsxs)("div",{className:"space-y-2",children:[a.jsx("label",{className:"text-sm font-bold text-slate-700",children:"Nom complet *"}),a.jsx("input",{required:!0,name:"fullName",value:t.fullName,onChange:u,placeholder:"Votre nom",className:"w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"})]}),(0,a.jsxs)("div",{className:"space-y-2",children:[a.jsx("label",{className:"text-sm font-bold text-slate-700",children:"Email *"}),a.jsx("input",{required:!0,type:"email",name:"email",value:t.email,onChange:u,placeholder:"votre@email.com",className:"w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"})]})]}),(0,a.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-5",children:[(0,a.jsxs)("div",{className:"space-y-2",children:[a.jsx("label",{className:"text-sm font-bold text-slate-700",children:"WhatsApp *"}),a.jsx("input",{required:!0,name:"whatsapp",value:t.whatsapp,onChange:u,placeholder:"+509...",className:"w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"})]}),(0,a.jsxs)("div",{className:"space-y-2",children:[a.jsx("label",{className:"text-sm font-bold text-slate-700",children:"Organisation *"}),a.jsx("input",{required:!0,name:"organization",value:t.organization,onChange:u,placeholder:"Votre organisation",className:"w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"})]})]}),(0,a.jsxs)("div",{className:"space-y-2",children:[a.jsx("label",{className:"text-sm font-bold text-slate-700",children:"Sujet *"}),a.jsx("input",{required:!0,name:"subject",value:t.subject,onChange:u,placeholder:"De quoi s'agit-il ?",className:"w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"})]}),(0,a.jsxs)("div",{className:"space-y-2",children:[a.jsx("label",{className:"text-sm font-bold text-slate-700",children:"Message *"}),a.jsx("textarea",{required:!0,rows:4,name:"message",value:t.message,onChange:u,placeholder:"Dites-nous tout...",className:"w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none"})]}),l&&a.jsx("p",{className:"text-red-500 text-sm font-medium",children:l}),a.jsx("button",{type:"submit",disabled:"loading"===n,className:"w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group disabled:opacity-50",children:"loading"===n?a.jsx(N.Z,{className:"animate-spin",size:20}):(0,a.jsxs)(a.Fragment,{children:["Envoyer le message",a.jsx(y.Z,{size:20,className:"group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"})]})})]},"form")})})]})})}function C(){let e=(0,o.useRouter)(),[t,s]=n().useState(new Date().getFullYear()),[r,c]=(0,i.useState)(!1),[u,d]=(0,i.useState)(!1),[x,m]=(0,i.useState)(!1),p=t=>{"home"===t?e.push("/"):e.push(`/${t}`)};return(0,a.jsxs)("footer",{className:"bg-slate-900 pt-20 pb-10 px-6 text-slate-300",children:[(0,a.jsxs)("div",{className:"max-w-7xl mx-auto",children:[(0,a.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-4 gap-12 mb-16",children:[(0,a.jsxs)("div",{className:"col-span-1 md:col-span-1",children:[(0,a.jsxs)("div",{className:"flex items-center gap-3 mb-6",children:[a.jsx("div",{className:"relative w-10 h-10",children:a.jsx(l.default,{src:"https://i.postimg.cc/5Y3Rg6zs/image-1.jpg",alt:"Logo",fill:!0,className:"rounded-full object-cover border border-slate-700 shadow-sm"})}),a.jsx("h2",{className:"font-heading text-xl font-bold text-white uppercase tracking-tighter",children:"BOURSE DU TEMPS"})]}),a.jsx("p",{className:"text-slate-400 text-sm leading-relaxed mb-6",children:"Une plateforme pour favoriser l'entraide, le partage de connaissances et la solidarit\xe9."}),(0,a.jsxs)("div",{className:"flex gap-4",children:[a.jsx("a",{href:"#",className:"w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all border border-slate-700",children:a.jsx("span",{className:"text-lg",children:"FB"})}),a.jsx("a",{href:"#",className:"w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all border border-slate-700",children:a.jsx("span",{className:"text-lg",children:"IG"})}),a.jsx("a",{href:"#",className:"w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all border border-slate-700",children:a.jsx("span",{className:"text-lg",children:"LI"})})]})]}),(0,a.jsxs)("div",{children:[a.jsx("h3",{className:"font-bold text-white mb-6 text-sm uppercase tracking-widest",children:"Navigation"}),(0,a.jsxs)("ul",{className:"space-y-4",children:[a.jsx("li",{children:a.jsx("button",{onClick:()=>p("home"),className:"text-slate-400 hover:text-blue-400 text-sm transition-colors",children:"Accueil"})}),a.jsx("li",{children:a.jsx("button",{onClick:()=>p("services"),className:"text-slate-400 hover:text-blue-400 text-sm transition-colors",children:"Services Offerts"})}),a.jsx("li",{children:a.jsx("button",{onClick:()=>p("requests"),className:"text-slate-400 hover:text-blue-400 text-sm transition-colors",children:"Demandes d'Aide"})}),a.jsx("li",{children:a.jsx("button",{onClick:()=>p("members"),className:"text-slate-400 hover:text-blue-400 text-sm transition-colors",children:"Membres"})})]})]}),(0,a.jsxs)("div",{children:[a.jsx("h3",{className:"font-bold text-white mb-6 text-sm uppercase tracking-widest",children:"Communaut\xe9"}),(0,a.jsxs)("ul",{className:"space-y-4",children:[a.jsx("li",{children:a.jsx("button",{onClick:()=>p("blog"),className:"text-slate-400 hover:text-blue-400 text-sm transition-colors",children:"Blog & Actualit\xe9s"})}),a.jsx("li",{children:a.jsx("button",{onClick:()=>p("forum"),className:"text-slate-400 hover:text-blue-400 text-sm transition-colors",children:"Forum de Discussion"})}),a.jsx("li",{children:a.jsx("button",{onClick:()=>p("testimonials"),className:"text-slate-400 hover:text-blue-400 text-sm transition-colors",children:"T\xe9moignages"})}),a.jsx("li",{children:a.jsx("button",{onClick:()=>p("about"),className:"text-slate-400 hover:text-blue-400 text-sm transition-colors",children:"\xc0 propos"})})]})]}),(0,a.jsxs)("div",{children:[a.jsx("h3",{className:"font-bold text-white mb-6 text-sm uppercase tracking-widest",children:"Contact"}),(0,a.jsxs)("ul",{className:"space-y-4",children:[(0,a.jsxs)("li",{className:"flex items-start gap-3",children:[a.jsx("span",{className:"text-blue-400 mt-0.5",children:"\uD83D\uDCCD"}),a.jsx("span",{className:"text-slate-400 text-sm leading-relaxed",children:"1 Place Ahmed Orabi, Alexandrie, \xc9gypte"})]}),(0,a.jsxs)("li",{className:"flex items-center gap-3",children:[a.jsx("span",{className:"text-blue-400",children:"✉️"}),a.jsx("button",{onClick:()=>m(!0),className:"text-slate-400 hover:text-blue-400 text-sm transition-colors text-left",children:"Contactez-nous (Email)"})]}),(0,a.jsxs)("li",{className:"flex items-center gap-3",children:[a.jsx("span",{className:"text-blue-400",children:"\uD83D\uDCDE"}),(0,a.jsxs)("a",{href:"https://wa.me/50932274422",target:"_blank",rel:"noopener noreferrer",className:"text-slate-400 hover:text-green-400 text-sm transition-colors flex items-center gap-1",children:["+509 32 27 4422",a.jsx("span",{className:"text-[10px] bg-green-600 text-white px-1.5 py-0.5 rounded-full font-bold",children:"WhatsApp"})]})]})]})]})]}),(0,a.jsxs)("div",{className:"pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6",children:[(0,a.jsxs)("p",{className:"text-slate-500 text-xs font-medium",children:["\xa9 ",t," Bourse du Temps. Tous droits r\xe9serv\xe9s."]}),(0,a.jsxs)("div",{className:"flex gap-8",children:[a.jsx("button",{onClick:()=>d(!0),className:"text-slate-500 hover:text-slate-300 text-xs font-medium transition-colors",children:"Politique de Confidentialit\xe9"}),a.jsx("button",{onClick:()=>c(!0),className:"text-slate-500 hover:text-orange-400 text-xs font-medium transition-colors",children:"⚖️ Loi des Conditions d’\xc9change"})]})]})]}),u&&a.jsx(b,{onClose:()=>d(!1)}),r&&a.jsx(h,{onClose:()=>c(!1)}),x&&a.jsx(w,{onClose:()=>m(!1)})]})}var L=s(6109);function S({onClose:e,onSuccess:t}){let[s,n]=(0,i.useState)("login"),[r,l]=(0,i.useState)("email"),[o,c]=(0,i.useState)(""),[u,d]=(0,i.useState)(""),[x,m]=(0,i.useState)(""),[p,h]=(0,i.useState)(!1),[b,g]=(0,i.useState)(""),[f,v]=(0,i.useState)("");async function j(){g(""),h(!0);try{let{error:e}=await L.O.auth.signInWithOtp({email:o,options:{shouldCreateUser:"signup"===s}});if(e)throw e;v(`Un code a \xe9t\xe9 envoy\xe9 \xe0 ${o}`),l("signup"===s?"signup_name":"otp")}catch(e){g(e instanceof Error?e.message:"Erreur envoi OTP")}finally{h(!1)}}function N(){if(!x.trim()){g("Veuillez entrer votre nom");return}g(""),l("otp")}async function y(){g(""),h(!0);try{let{data:e,error:a}=await L.O.auth.verifyOtp({email:o,token:u,type:"email"});if(a)throw a;let i=e.session,n=e.user;if(!i||!n)throw Error("Session introuvable");"signup"===s&&x&&(await L.O.auth.updateUser({data:{full_name:x}}),await fetch("/api/profil",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${i.access_token}`},body:JSON.stringify({name:x,email:o})}));let r=x;if("login"===s){let e=await fetch("/api/profil",{headers:{Authorization:`Bearer ${i.access_token}`}});e.ok&&(r=(await e.json()).name??o)}t(i.access_token,n.id,r,o)}catch(e){g(e instanceof Error?e.message:"Code invalide ou expir\xe9")}finally{h(!1)}}return a.jsx("div",{className:"fixed inset-0 bg-black/50 flex items-center justify-center z-50",children:(0,a.jsxs)("div",{className:"bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative",children:[a.jsx("button",{onClick:e,className:"absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl",children:"✕"}),a.jsx("h2",{className:"text-2xl font-bold mb-6 text-center",children:"login"===s?"Connexion":"Cr\xe9er un compte"}),a.jsx("div",{className:"flex justify-center gap-4 mb-6",children:["login","signup"].map(e=>a.jsx("button",{onClick:()=>{n(e),l("email"),g(""),v("")},className:`px-4 py-1 rounded-full text-sm font-medium transition ${s===e?"bg-blue-600 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`,children:"login"===e?"Connexion":"Inscription"},e))}),b&&a.jsx("p",{className:"text-red-500 text-sm mb-4 text-center",children:b}),f&&a.jsx("p",{className:"text-green-600 text-sm mb-4 text-center",children:f}),"email"===r&&(0,a.jsxs)("div",{className:"space-y-4",children:[a.jsx("input",{type:"email",placeholder:"Votre adresse email",value:o,onChange:e=>c(e.target.value),onKeyDown:e=>"Enter"===e.key&&j(),className:"w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"}),a.jsx("button",{onClick:j,disabled:p||!o,className:"w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition",children:p?"Envoi…":"Envoyer le code"})]}),"signup_name"===r&&(0,a.jsxs)("div",{className:"space-y-4",children:[(0,a.jsxs)("p",{className:"text-sm text-gray-500 text-center",children:["Code envoy\xe9 \xe0 ",a.jsx("strong",{children:o})]}),a.jsx("input",{type:"text",placeholder:"Votre nom complet",value:x,onChange:e=>m(e.target.value),onKeyDown:e=>"Enter"===e.key&&N(),className:"w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"}),a.jsx("button",{onClick:N,disabled:!x.trim(),className:"w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition",children:"Continuer"})]}),"otp"===r&&(0,a.jsxs)("div",{className:"space-y-4",children:[(0,a.jsxs)("p",{className:"text-sm text-gray-500 text-center",children:["Code envoy\xe9 \xe0 ",a.jsx("strong",{children:o})]}),a.jsx("input",{type:"text",placeholder:"Code \xe0 6 chiffres",value:u,maxLength:6,onChange:e=>d(e.target.value.replace(/\D/g,"")),onKeyDown:e=>"Enter"===e.key&&6===u.length&&y(),className:"w-full border rounded-lg px-4 py-3 text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"}),a.jsx("button",{onClick:y,disabled:p||6!==u.length,className:"w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition",children:p?"V\xe9rification…":"Valider"}),a.jsx("button",{onClick:()=>{l("email"),d(""),v("")},className:"w-full text-sm text-gray-400 hover:text-gray-600",children:"← Changer d'email"})]})]})})}var q=s(285);function D({children:e}){let{user:t,setUser:s,notifications:n,logout:r}=(0,q.a)(),[l,c]=(0,i.useState)(null),u=(0,o.useRouter)(),d=(0,o.usePathname)(),x=async e=>{try{await fetch(`/api/notifications/${e}`,{method:"PATCH",headers:{"Content-Type":"application/json",Authorization:`Bearer ${localStorage.getItem("token")}`},body:JSON.stringify({isRead:!0})})}catch(e){console.error(e)}};return(0,a.jsxs)("div",{className:"min-h-screen flex flex-col bg-slate-50",children:[a.jsx(p,{currentPage:d.replace("/","")||"home",user:t,notifications:n,onNavigate:e=>{"home"===e?u.push("/"):u.push(`/${e}`)},onLogin:()=>c("login"),onSignup:()=>c("signup"),onLogout:r,onMarkRead:x}),a.jsx("main",{className:"flex-grow pt-16",children:e}),a.jsx(C,{}),l&&a.jsx(S,{mode:l,onClose:()=>c(null),onAuth:e=>{s(e),c(null)},onSwitch:c})]})}},285:(e,t,s)=>{"use strict";s.d(t,{UserProvider:()=>l,a:()=>o});var a=s(97247),i=s(28964),n=s(6109);let r=(0,i.createContext)(void 0);function l({children:e}){let[t,s]=(0,i.useState)(null),[l,o]=(0,i.useState)([]),[c,u]=(0,i.useState)(!1),d=async()=>{n.O&&await n.O.auth.signOut(),localStorage.removeItem("token"),s(null),window.location.href="/login"};return a.jsx(r.Provider,{value:{user:t,setUser:s,notifications:l,logout:d,isAuthReady:c},children:e})}function o(){let e=(0,i.useContext)(r);if(!e)throw Error("useUser must be used within a UserProvider");return e}},6109:(e,t,s)=>{"use strict";s.d(t,{O:()=>l});var a=s(47991);let i="https://ikhutkwtaqpdiosatros.supabase.co",n="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlraHV0a3d0YXFwZGlvc2F0cm9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4MjA4OTUsImV4cCI6MjA5MjM5Njg5NX0.VcRqOA_isRRbTRTeseJbNKwVTcfR33JlbfzsVce7o9c",r=null,l=i&&n&&i.startsWith("http")?(r||(r=(0,a.eI)(i,n)),r):null},7860:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>d,metadata:()=>u});var a=s(72051),i=s(31595),n=s.n(i),r=s(67133),l=s.n(r);s(67272);var o=s(45347);let c=(0,o.createProxy)(String.raw`P:\boursedutemps\components\UserProvider.tsx#UserProvider`);(0,o.createProxy)(String.raw`P:\boursedutemps\components\UserProvider.tsx#useUser`);let u={title:"Bourse du Temps",description:"\xc9changez vos talents, apprenez gratuitement et construisez l'avenir au sein de notre banque de temps solidaire.",keywords:["bourse du temps","\xe9change de services","cr\xe9dits temps","solidarit\xe9","entraide"],authors:[{name:"Bourse du Temps"}],openGraph:{title:"Bourse du Temps",description:"\xc9changez vos talents, apprenez gratuitement et construisez l'avenir au sein de notre banque de temps solidaire.",url:"https://boursedutemps.vercel.app",siteName:"Bourse du Temps",locale:"fr_FR",type:"website"}};async function d({children:e}){return a.jsx("html",{lang:"en",className:`${n().variable} ${l().variable}`,children:a.jsx("body",{className:"font-sans antialiased",children:a.jsx(c,{children:e})})})}},70546:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>n});var a=s(72051),i=s(92349);function n(){return(0,a.jsxs)("div",{className:"flex flex-col items-center justify-center min-h-screen bg-slate-50 px-6 text-center",children:[a.jsx("div",{className:"w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-4xl mb-8 shadow-inner",children:"\uD83D\uDD0D"}),a.jsx("h1",{className:"font-heading text-4xl font-bold text-slate-900 mb-4 uppercase tracking-tight",children:"Page Introuvable"}),a.jsx("p",{className:"text-slate-500 mb-8 max-w-md",children:"D\xe9sol\xe9, la page que vous recherchez n'existe pas ou a \xe9t\xe9 d\xe9plac\xe9e."}),a.jsx(i.default,{href:"/",className:"bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-200",children:"Retour \xe0 l'accueil"})]})}},67272:()=>{}};