# patch-i18n.ps1
# Run from: P:\Mes Projets\boursedutemps
# Usage: .\patch-i18n.ps1

$patches = @{}

$patches["en"] = @'
,
  "about": {
    "label": "Our philosophy", "titleLine1": "Reinventing mutual aid", "titleLine2": "through time",
    "subtitle": "Bourse du Temps is a skills exchange platform where 1 hour given equals 1 hour received - no money, no hierarchy, open to all.",
    "mission": { "label": "Our Mission", "text": "Create an exchange ecosystem where everyone can leverage their skills without financial barriers." },
    "vision": { "label": "Our Vision", "text": "Build the largest community of mutual aid through skills, fostering connections between people anywhere in the world." },
    "values": {
      "label": "What guides us", "title": "Our values", "subtitle": "Six fundamental principles that define every decision we make.",
      "equality":     { "title": "Time equality",         "desc": "1 hour given = 1 hour received. Every hour has the same value regardless of skill or status." },
      "trust":        { "title": "Mutual trust",          "desc": "Every exchange relies on one word given. Reputation is built through actions." },
      "inclusion":    { "title": "Inclusion & Diversity", "desc": "Open to all, no diploma or income required. Diversity of profiles is our greatest asset." },
      "solidarity":   { "title": "Solidarity",            "desc": "The most resilient communities are those that help each other." },
      "economy":      { "title": "Non-monetary economy",  "desc": "Time, not money. An alternative to the market economy, accessible to all." },
      "transparency": { "title": "Transparency",          "desc": "Non-profit platform. Every exchange is tracked, every credit is visible." }
    },
    "howItWorks": {
      "label": "Simple & concrete", "title": "How does it work?",
      "step1": { "title": "Sign up",               "desc": "Create your profile with your skills and needs. Receive 5 welcome credits to get started." },
      "step2": { "title": "Offer & Exchange",       "desc": "Post a service or request. Contact members, negotiate and complete your first exchange." },
      "step3": { "title": "Build your reputation",  "desc": "After each exchange, leave a testimonial. Earn badges and level up." },
      "step4": { "title": "Join projects",          "desc": "Participate in collective workshops and collaborative projects to go further together." }
    },
    "cta": { "title": "Ready to join the community?", "subtitle": "Thousands of skills await you. Your next enriching encounter is just one exchange away.", "btn": "Discover services ->" }
  },
  "contact": {
    "label": "We are here", "title": "Contact us", "subtitle": "A question, partnership or bug? Write to us, we respond within 48h.",
    "name": "Name", "email": "Email", "subject": "Subject", "message": "Message",
    "namePlaceholder": "Your name", "emailPlaceholder": "your@email.com",
    "subjectPlaceholder": "E.g.: Institution partnership, bug report...", "messagePlaceholder": "Describe your request...",
    "submit": "Send message ->", "sending": "Sending...", "successTitle": "Message sent!", "successMsg": "We will get back to you very soon.",
    "sendAnother": "Send another message", "errorMsg": "An error occurred. Please try again.",
    "channelEmail": "Email", "channelForum": "Forum", "channelAI": "ALDEA", "channelForumVal": "Community", "channelAIVal": "AI Chat"
  },
  "requests": {
    "label": "Community needs", "title": "Current requests", "subtitle": "A member needs you? Offer your help and earn credits.",
    "searchPlaceholder": "Search a request...", "noResults": "No requests yet",
    "today": "Today", "yesterday": "Yesterday", "daysAgo": "{days} days ago",
    "member": "Member", "reply": "Reply", "credit": "credit", "credits": "credits"
  },
  "dashboard": {
    "loginRequired": "Login required", "loginDesc": "Access your personal space", "login": "Log in",
    "greeting": "Hello, {name}", "subtitle": "Your personal space", "myProfile": "My profile ->",
    "statCredits": "Credits", "statServices": "Services", "statExchanges": "Exchanges", "statEarned": "Credits earned",
    "reviewsBanner": "{count} pending review(s)", "reviewsDesc": "Share your experience after your recent exchanges",
    "rateUser": "Rate {name}", "leaveReview": "Leave a review ->",
    "creditHistory": "Credit history", "earned": "earned", "spent": "spent",
    "myServices": "My services", "viewAll": "View all ->", "noServices": "You have not posted any services yet.",
    "exchange": "Exchange",
    "shortcuts": { "services": "Explore services", "requests": "View requests", "members": "Find members", "workshops": "Group workshops", "projects": "Collaborative projects", "search": "AI Search" }
  },
  "members": {
    "label": "Our community", "title": "Members", "subtitle": "{count} person(s) ready to exchange their time.",
    "searchPlaceholder": "Search by name, skill, city...", "noResults": "No members found",
    "verified": "Verified", "member": "Member"
  },
  "forum": {
    "title": "Exchange Forum", "newTopic": "New Topic", "editTopic": "Edit topic", "startDiscussion": "Start a discussion",
    "titlePlaceholder": "Topic title", "messagePlaceholder": "Your message...", "externalLinkPlaceholder": "External link (optional)",
    "uploading": "Uploading...", "fileReady": "File ready", "importMedia": "Import Photo/Video",
    "removeMedia": "Remove", "update": "Update", "publish": "Publish", "cancel": "Cancel",
    "externalLink": "External link", "by": "By", "commentPlaceholder": "Comment...", "send": "Send",
    "empty": "No discussions yet. Be the first!", "loginRequired": "Log in to participate", "confirmDelete": "Permanently delete this topic?"
  }
'@

$patches["ht"] = @'
,
  "about": {
    "label": "Filozofi nou", "titleLine1": "Reenvante ed mityel", "titleLine2": "nan tan",
    "subtitle": "Bous du Tan se yon platfom echanj konpetans kote 1 edtan bay = 1 edtan resevwa - san lajan, san yerachi, louvri pou tout moun.",
    "mission": { "label": "Misyon nou", "text": "Kreye yon ekosistem echanj kote chak moun ka valorize konpetans li san baryye finansye." },
    "vision": { "label": "Vizyon nou", "text": "Bati pi gwo kominote ed mityel nan konpetans, fasilite koneksyon ant moun, kilti ak ekspetiz tout kote nan mond lan." },
    "values": {
      "label": "Sa ki gide nou", "title": "Vale nou yo", "subtitle": "Sis prensip fondamantal ki defini chak desizyon nou pran.",
      "equality":     { "title": "Egalite tan",          "desc": "1 edtan bay = 1 edtan resevwa. Chak edtan gen menm vale." },
      "trust":        { "title": "Konfyans mityel",       "desc": "Chak echanj repoze sou pawol bay. Reputasyon bati sou aksyon." },
      "inclusion":    { "title": "Enklizyon ak Diveste",  "desc": "Louvri pou tout moun san kondisyon. Diveste pwofil yo se pi gran riches nou." },
      "solidarity":   { "title": "Solidarite",            "desc": "Kominote ki pi rezilyant yo se sa ki ede youn lot." },
      "economy":      { "title": "Ekonomi san lajan",     "desc": "Tan, pa lajan. Yon altenaif pou ekonomi machann, aksesib pou tout moun." },
      "transparency": { "title": "Transparan",            "desc": "Platfom san bi likratif. Chak echanj trace, chak kredi vizib." }
    },
    "howItWorks": {
      "label": "Senp ak konkre", "title": "Kijan sa mache?",
      "step1": { "title": "Enskri ou",           "desc": "Kreye pwofil ou ak konpetans ak bezwen ou. Resevwa 5 kredi byenveni pou komanse." },
      "step2": { "title": "Pwopoz ak Echanj",    "desc": "Mete yon sèvis oswa demann anliy. Kontakte manm yo epi fè premye echanj ou." },
      "step3": { "title": "Bati reputasyon ou",  "desc": "Apre chak echanj, kite yon temwayaj. Akimile badge epi monte nivo." },
      "step4": { "title": "Rejwenn pwoje",       "desc": "Patisipe nan atelye kolektif ak pwoje kolaboratif." }
    },
    "cta": { "title": "Pare pou rejwenn kominote a?", "subtitle": "De milye konpetans ap tann ou.", "btn": "Dekouvri sevis yo ->" }
  },
  "contact": {
    "label": "Nou la", "title": "Kontakte nou", "subtitle": "Yon kesyon, patenarya, bug? Ekri nou, nou reponn nan 48h.",
    "name": "Non", "email": "Imel", "subject": "Sije", "message": "Mesaj",
    "namePlaceholder": "Non ou", "emailPlaceholder": "ou@imel.com",
    "subjectPlaceholder": "Egzanp: Patenarya enstitisyon, rapo bug...", "messagePlaceholder": "Dekri demann ou...",
    "submit": "Voye mesaj ->", "sending": "Ap voye...", "successTitle": "Mesaj voye!", "successMsg": "Nou pral tounen vers ou tre vit.",
    "sendAnother": "Voye yon lot mesaj", "errorMsg": "Yon ere te rive. Eseye anko.",
    "channelEmail": "Imel", "channelForum": "Fowom", "channelAI": "ALDEA", "channelForumVal": "Kominote", "channelAIVal": "Chat IA"
  },
  "requests": {
    "label": "Bezwen kominote a", "title": "Demann aktyel yo", "subtitle": "Yon manm bezwen ou? Ofri ed ou epi fe kredi.",
    "searchPlaceholder": "Cheche yon demann...", "noResults": "Pa gen demann pou kounye a",
    "today": "Jodi a", "yesterday": "Ye", "daysAgo": "gen {days} jou",
    "member": "Manm", "reply": "Reponn", "credit": "kredi", "credits": "kredi"
  },
  "dashboard": {
    "loginRequired": "Koneksyon obligatwa", "loginDesc": "Jwenn akse nan espas pesonèl ou", "login": "Konekte",
    "greeting": "Bonjou, {name}", "subtitle": "Espas pesonèl ou", "myProfile": "Pwofil mwen ->",
    "statCredits": "Kredi", "statServices": "Sevis", "statExchanges": "Echanj", "statEarned": "Kredi touche",
    "reviewsBanner": "{count} avi an atant", "reviewsDesc": "Pataje eksperyans ou apre echanj resan ou yo",
    "rateUser": "Evalye {name}", "leaveReview": "Kite yon avi ->",
    "creditHistory": "Istwa kredi", "earned": "touche", "spent": "depanse",
    "myServices": "Sevis mwen yo", "viewAll": "We tout ->", "noServices": "Ou poko gen okenn sevis pwopoze.",
    "exchange": "Echanj",
    "shortcuts": { "services": "Eksplore sevis yo", "requests": "We demann yo", "members": "Jwenn manm yo", "workshops": "Atelye kolektif", "projects": "Pwoje kolaboratif", "search": "Rechech IA" }
  },
  "members": {
    "label": "Kominote nou an", "title": "Manm yo", "subtitle": "{count} moun pare pou echanj tan yo.",
    "searchPlaceholder": "Cheche pa non, konpetans, vil...", "noResults": "Pa jwenn okenn manm",
    "verified": "Verifye", "member": "Manm"
  },
  "forum": {
    "title": "Fowom echanj yo", "newTopic": "Nouvo Sije", "editTopic": "Modifye sije a", "startDiscussion": "Komanse yon diskisyon",
    "titlePlaceholder": "Tit sije a", "messagePlaceholder": "Mesaj ou...", "externalLinkPlaceholder": "Lyen eksten (opsyonel)",
    "uploading": "Ap telechaje...", "fileReady": "Fichye pare", "importMedia": "Enpote Foto/Videyo",
    "removeMedia": "Efase", "update": "Mete ajou", "publish": "Pibliye", "cancel": "Anile",
    "externalLink": "Lyen eksten", "by": "Pa", "commentPlaceholder": "Komante...", "send": "Voye",
    "empty": "Pa gen diskisyon. Ou ka premye!", "loginRequired": "Konekte pou patisipe", "confirmDelete": "Efase sije sa a definitisman?"
  }
'@

$patches["es"] = @'
,
  "about": {
    "label": "Nuestra filosofia", "titleLine1": "Reinventando la ayuda mutua", "titleLine2": "a traves del tiempo",
    "subtitle": "Bourse du Temps es una plataforma de intercambio de habilidades donde 1 hora dada vale 1 hora recibida - sin dinero, sin jerarquia, abierta a todos.",
    "mission": { "label": "Nuestra Mision", "text": "Crear un ecosistema de intercambio donde cada persona pueda valorar sus habilidades sin barreras financieras." },
    "vision": { "label": "Nuestra Vision", "text": "Construir la mayor comunidad de ayuda mutua mediante habilidades en cualquier parte del mundo." },
    "values": {
      "label": "Lo que nos guia", "title": "Nuestros valores", "subtitle": "Seis principios fundamentales que definen cada decision que tomamos.",
      "equality":     { "title": "Igualdad de tiempos",   "desc": "1 hora dada = 1 hora recibida. Cada hora tiene el mismo valor." },
      "trust":        { "title": "Confianza mutua",        "desc": "Cada intercambio se basa en la palabra dada. La reputacion se construye con actos." },
      "inclusion":    { "title": "Inclusion y Diversidad", "desc": "Abierta a todos sin condicion. La diversidad de perfiles es nuestra mayor riqueza." },
      "solidarity":   { "title": "Solidaridad",            "desc": "Las comunidades mas resilientes son las que se ayudan mutuamente." },
      "economy":      { "title": "Economia no monetaria",  "desc": "El tiempo, no el dinero. Una alternativa al mercado, accesible para todos." },
      "transparency": { "title": "Transparencia",          "desc": "Plataforma sin animo de lucro. Cada intercambio registrado, cada credito visible." }
    },
    "howItWorks": {
      "label": "Simple y concreto", "title": "Como funciona?",
      "step1": { "title": "Registrate",               "desc": "Crea tu perfil con tus habilidades y necesidades. Recibe 5 creditos de bienvenida." },
      "step2": { "title": "Ofrece e Intercambia",     "desc": "Publica un servicio o solicitud. Contacta miembros, negocia y completa tu primer intercambio." },
      "step3": { "title": "Construye tu reputacion",  "desc": "Tras cada intercambio, deja un testimonio. Acumula insignias y sube de nivel." },
      "step4": { "title": "Unete a proyectos",        "desc": "Participa en talleres colectivos y proyectos colaborativos." }
    },
    "cta": { "title": "Listo para unirte a la comunidad?", "subtitle": "Miles de habilidades te esperan.", "btn": "Descubrir los servicios ->" }
  },
  "contact": {
    "label": "Estamos aqui", "title": "Contactanos", "subtitle": "Una pregunta, asociacion o error? Escribenos, respondemos en 48h.",
    "name": "Nombre", "email": "Correo electronico", "subject": "Asunto", "message": "Mensaje",
    "namePlaceholder": "Tu nombre", "emailPlaceholder": "tu@correo.com",
    "subjectPlaceholder": "Ej.: Asociacion institucion, reporte de error...", "messagePlaceholder": "Describe tu solicitud...",
    "submit": "Enviar mensaje ->", "sending": "Enviando...", "successTitle": "Mensaje enviado!", "successMsg": "Nos pondremos en contacto muy pronto.",
    "sendAnother": "Enviar otro mensaje", "errorMsg": "Ocurrio un error. Intentalo de nuevo.",
    "channelEmail": "Correo", "channelForum": "Foro", "channelAI": "ALDEA", "channelForumVal": "Comunidad", "channelAIVal": "Chat IA"
  },
  "requests": {
    "label": "Necesidades de la comunidad", "title": "Solicitudes actuales", "subtitle": "Un miembro te necesita? Ofrece tu ayuda y gana creditos.",
    "searchPlaceholder": "Buscar una solicitud...", "noResults": "No hay solicitudes por ahora",
    "today": "Hoy", "yesterday": "Ayer", "daysAgo": "hace {days} dias",
    "member": "Miembro", "reply": "Responder", "credit": "credito", "credits": "creditos"
  },
  "dashboard": {
    "loginRequired": "Inicio de sesion requerido", "loginDesc": "Accede a tu espacio personal", "login": "Iniciar sesion",
    "greeting": "Hola, {name}", "subtitle": "Tu espacio personal", "myProfile": "Mi perfil ->",
    "statCredits": "Creditos", "statServices": "Servicios", "statExchanges": "Intercambios", "statEarned": "Creditos ganados",
    "reviewsBanner": "{count} opinion(es) pendiente(s)", "reviewsDesc": "Comparte tu experiencia tras tus intercambios recientes",
    "rateUser": "Valorar a {name}", "leaveReview": "Dejar una opinion ->",
    "creditHistory": "Historial de creditos", "earned": "ganados", "spent": "gastados",
    "myServices": "Mis servicios", "viewAll": "Ver todos ->", "noServices": "Aun no tienes ningun servicio publicado.",
    "exchange": "Intercambio",
    "shortcuts": { "services": "Explorar servicios", "requests": "Ver solicitudes", "members": "Encontrar miembros", "workshops": "Talleres colectivos", "projects": "Proyectos colaborativos", "search": "Busqueda IA" }
  },
  "members": {
    "label": "Nuestra comunidad", "title": "Los miembros", "subtitle": "{count} persona(s) lista(s) para intercambiar su tiempo.",
    "searchPlaceholder": "Buscar por nombre, habilidad, ciudad...", "noResults": "No se encontraron miembros",
    "verified": "Verificado", "member": "Miembro"
  },
  "forum": {
    "title": "Foro de intercambios", "newTopic": "Nuevo Tema", "editTopic": "Editar tema", "startDiscussion": "Iniciar una discusion",
    "titlePlaceholder": "Titulo del tema", "messagePlaceholder": "Tu mensaje...", "externalLinkPlaceholder": "Enlace externo (opcional)",
    "uploading": "Subiendo...", "fileReady": "Archivo listo", "importMedia": "Importar Foto/Video",
    "removeMedia": "Eliminar", "update": "Actualizar", "publish": "Publicar", "cancel": "Cancelar",
    "externalLink": "Enlace externo", "by": "Por", "commentPlaceholder": "Comentar...", "send": "Enviar",
    "empty": "No hay discusiones. Se el primero!", "loginRequired": "Inicia sesion para participar", "confirmDelete": "Eliminar permanentemente este tema?"
  }
'@

$patches["pt"] = @'
,
  "about": {
    "label": "Nossa filosofia", "titleLine1": "Reinventando a ajuda mutua", "titleLine2": "atraves do tempo",
    "subtitle": "Bourse du Temps e uma plataforma de troca de habilidades onde 1 hora dada vale 1 hora recebida - sem dinheiro, sem hierarquia, aberta a todos.",
    "mission": { "label": "Nossa Missao", "text": "Criar um ecossistema de troca onde cada pessoa possa valorizar suas habilidades sem barreiras financeiras." },
    "vision": { "label": "Nossa Visao", "text": "Construir a maior comunidade de ajuda mutua por habilidades em qualquer lugar do mundo." },
    "values": {
      "label": "O que nos guia", "title": "Nossos valores", "subtitle": "Seis principios fundamentais que definem cada decisao que tomamos.",
      "equality":     { "title": "Igualdade de tempo",     "desc": "1 hora dada = 1 hora recebida. Cada hora tem o mesmo valor." },
      "trust":        { "title": "Confianca mutua",         "desc": "Cada troca se baseia na palavra dada. A reputacao e construida por acoes." },
      "inclusion":    { "title": "Inclusao e Diversidade",  "desc": "Aberta a todos sem condicao. A diversidade de perfis e nossa maior riqueza." },
      "solidarity":   { "title": "Solidariedade",           "desc": "As comunidades mais resilientes sao as que se ajudam." },
      "economy":      { "title": "Economia nao monetaria",  "desc": "Tempo, nao dinheiro. Uma alternativa ao mercado, acessivel a todos." },
      "transparency": { "title": "Transparencia",           "desc": "Plataforma sem fins lucrativos. Cada troca registrada, cada credito visivel." }
    },
    "howItWorks": {
      "label": "Simples e concreto", "title": "Como funciona?",
      "step1": { "title": "Cadastre-se",             "desc": "Crie seu perfil com suas habilidades e necessidades. Receba 5 creditos de boas-vindas." },
      "step2": { "title": "Ofrece e Troque",         "desc": "Publique um servico ou pedido. Contate membros, negocie e conclua sua primeira troca." },
      "step3": { "title": "Construa sua reputacao",  "desc": "Apos cada troca, deixe um depoimento. Acumule emblemas e suba de nivel." },
      "step4": { "title": "Junte-se a projetos",     "desc": "Participe de workshops coletivos e projetos colaborativos." }
    },
    "cta": { "title": "Pronto para entrar na comunidade?", "subtitle": "Milhares de habilidades esperam por voce.", "btn": "Descobrir os servicos ->" }
  },
  "contact": {
    "label": "Estamos aqui", "title": "Fale conosco", "subtitle": "Uma pergunta, parceria ou bug? Escreva-nos, respondemos em 48h.",
    "name": "Nome", "email": "E-mail", "subject": "Assunto", "message": "Mensagem",
    "namePlaceholder": "Seu nome", "emailPlaceholder": "seu@email.com",
    "subjectPlaceholder": "Ex.: Parceria institucional, relatorio de bug...", "messagePlaceholder": "Descreva sua solicitacao...",
    "submit": "Enviar mensagem ->", "sending": "Enviando...", "successTitle": "Mensagem enviada!", "successMsg": "Entraremos em contato muito em breve.",
    "sendAnother": "Enviar outra mensagem", "errorMsg": "Ocorreu um erro. Tente novamente.",
    "channelEmail": "E-mail", "channelForum": "Forum", "channelAI": "ALDEA", "channelForumVal": "Comunidade", "channelAIVal": "Chat IA"
  },
  "requests": {
    "label": "Necessidades da comunidade", "title": "Pedidos atuais", "subtitle": "Um membro precisa de voce? Ofreca sua ajuda e ganhe creditos.",
    "searchPlaceholder": "Buscar um pedido...", "noResults": "Nenhum pedido por enquanto",
    "today": "Hoje", "yesterday": "Ontem", "daysAgo": "ha {days} dias",
    "member": "Membro", "reply": "Responder", "credit": "credito", "credits": "creditos"
  },
  "dashboard": {
    "loginRequired": "Login necessario", "loginDesc": "Acesse seu espaco pessoal", "login": "Entrar",
    "greeting": "Ola, {name}", "subtitle": "Seu espaco pessoal", "myProfile": "Meu perfil ->",
    "statCredits": "Creditos", "statServices": "Servicos", "statExchanges": "Trocas", "statEarned": "Creditos ganhos",
    "reviewsBanner": "{count} avaliacao(oes) pendente(s)", "reviewsDesc": "Compartilhe sua experiencia apos suas trocas recentes",
    "rateUser": "Avaliar {name}", "leaveReview": "Deixar uma avaliacao ->",
    "creditHistory": "Historico de creditos", "earned": "ganhos", "spent": "gastos",
    "myServices": "Meus servicos", "viewAll": "Ver todos ->", "noServices": "Voce ainda nao publicou nenhum servico.",
    "exchange": "Troca",
    "shortcuts": { "services": "Explorar servicos", "requests": "Ver pedidos", "members": "Encontrar membros", "workshops": "Workshops coletivos", "projects": "Projetos colaborativos", "search": "Pesquisa IA" }
  },
  "members": {
    "label": "Nossa comunidade", "title": "Os membros", "subtitle": "{count} pessoa(s) pronta(s) para trocar seu tempo.",
    "searchPlaceholder": "Buscar por nome, habilidade, cidade...", "noResults": "Nenhum membro encontrado",
    "verified": "Verificado", "member": "Membro"
  },
  "forum": {
    "title": "Forum de trocas", "newTopic": "Novo Topico", "editTopic": "Editar topico", "startDiscussion": "Iniciar uma discussao",
    "titlePlaceholder": "Titulo do topico", "messagePlaceholder": "Sua mensagem...", "externalLinkPlaceholder": "Link externo (opcional)",
    "uploading": "Enviando...", "fileReady": "Arquivo pronto", "importMedia": "Importar Foto/Video",
    "removeMedia": "Remover", "update": "Atualizar", "publish": "Publicar", "cancel": "Cancelar",
    "externalLink": "Link externo", "by": "Por", "commentPlaceholder": "Comentar...", "send": "Enviar",
    "empty": "Nenhuma discussao ainda. Seja o primeiro!", "loginRequired": "Faca login para participar", "confirmDelete": "Excluir permanentemente este topico?"
  }
'@

$patches["de"] = @'
,
  "about": {
    "label": "Unsere Philosophie", "titleLine1": "Gegenseitige Hilfe neu erfinden", "titleLine2": "durch Zeit",
    "subtitle": "Bourse du Temps: 1 Stunde gegeben = 1 Stunde empfangen - ohne Geld, ohne Hierarchie, offen fuer alle.",
    "mission": { "label": "Unsere Mission", "text": "Ein Tausch-Oekosystem schaffen, in dem jeder seine Faehigkeiten ohne finanzielle Huerden einbringen kann." },
    "vision": { "label": "Unsere Vision", "text": "Die groesste Gemeinschaft gegenseitiger Hilfe durch Faehigkeiten aufbauen, ueberall auf der Welt." },
    "values": {
      "label": "Was uns leitet", "title": "Unsere Werte", "subtitle": "Sechs grundlegende Prinzipien, die jede Entscheidung definieren.",
      "equality":     { "title": "Zeitgleichheit",         "desc": "1 Stunde gegeben = 1 Stunde empfangen. Jede Stunde hat denselben Wert." },
      "trust":        { "title": "Gegenseitiges Vertrauen","desc": "Jeder Tausch basiert auf gegebenem Wort. Reputation wird durch Taten aufgebaut." },
      "inclusion":    { "title": "Inklusion und Vielfalt", "desc": "Offen fuer alle ohne Voraussetzung. Die Vielfalt der Profile ist unser groesster Reichtum." },
      "solidarity":   { "title": "Solidaritaet",           "desc": "Die widerstandsfaehigsten Gemeinschaften sind die, die sich gegenseitig helfen." },
      "economy":      { "title": "Nicht-monetaere Wirtschaft","desc": "Zeit, nicht Geld. Eine Alternative zur Marktwirtschaft, zugaenglich fuer alle." },
      "transparency": { "title": "Transparenz",            "desc": "Gemeinnuetzige Plattform. Jeder Tausch wird erfasst, jedes Guthaben ist sichtbar." }
    },
    "howItWorks": {
      "label": "Einfach und konkret", "title": "Wie funktioniert es?",
      "step1": { "title": "Registrieren",          "desc": "Erstellen Sie Ihr Profil mit Ihren Faehigkeiten. Erhalten Sie 5 Willkommensguthaben." },
      "step2": { "title": "Anbieten und Tauschen", "desc": "Stellen Sie einen Dienst oder eine Anfrage ein. Tauschen Sie sich mit Mitgliedern aus." },
      "step3": { "title": "Reputation aufbauen",   "desc": "Hinterlassen Sie nach jedem Tausch ein Zeugnis. Sammeln Sie Abzeichen." },
      "step4": { "title": "Projekten beitreten",   "desc": "Nehmen Sie an kollektiven Workshops und kollaborativen Projekten teil." }
    },
    "cta": { "title": "Bereit, der Gemeinschaft beizutreten?", "subtitle": "Tausende von Faehigkeiten warten auf Sie.", "btn": "Dienste entdecken ->" }
  },
  "contact": {
    "label": "Wir sind da", "title": "Kontakt", "subtitle": "Eine Frage, Partnerschaft oder Fehler? Schreiben Sie uns, wir antworten innerhalb von 48h.",
    "name": "Name", "email": "E-Mail", "subject": "Betreff", "message": "Nachricht",
    "namePlaceholder": "Ihr Name", "emailPlaceholder": "ihre@email.com",
    "subjectPlaceholder": "z.B.: Institutionspartnerschaft, Fehlerreport...", "messagePlaceholder": "Beschreiben Sie Ihr Anliegen...",
    "submit": "Nachricht senden ->", "sending": "Senden...", "successTitle": "Nachricht gesendet!", "successMsg": "Wir melden uns sehr bald bei Ihnen.",
    "sendAnother": "Eine weitere Nachricht senden", "errorMsg": "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
    "channelEmail": "E-Mail", "channelForum": "Forum", "channelAI": "ALDEA", "channelForumVal": "Gemeinschaft", "channelAIVal": "KI-Chat"
  },
  "requests": {
    "label": "Beduerfnisse der Gemeinschaft", "title": "Aktuelle Anfragen", "subtitle": "Ein Mitglied braucht Sie? Bieten Sie Ihre Hilfe an und verdienen Sie Guthaben.",
    "searchPlaceholder": "Eine Anfrage suchen...", "noResults": "Noch keine Anfragen",
    "today": "Heute", "yesterday": "Gestern", "daysAgo": "vor {days} Tagen",
    "member": "Mitglied", "reply": "Antworten", "credit": "Guthaben", "credits": "Guthaben"
  },
  "dashboard": {
    "loginRequired": "Anmeldung erforderlich", "loginDesc": "Zugang zu Ihrem persoenlichen Bereich", "login": "Anmelden",
    "greeting": "Hallo, {name}", "subtitle": "Ihr persoenlicher Bereich", "myProfile": "Mein Profil ->",
    "statCredits": "Guthaben", "statServices": "Dienste", "statExchanges": "Tausche", "statEarned": "Verdientes Guthaben",
    "reviewsBanner": "{count} ausstehende Bewertung(en)", "reviewsDesc": "Teilen Sie Ihre Erfahrung nach Ihren letzten Tauschen",
    "rateUser": "{name} bewerten", "leaveReview": "Bewertung hinterlassen ->",
    "creditHistory": "Guthabenverlauf", "earned": "verdient", "spent": "ausgegeben",
    "myServices": "Meine Dienste", "viewAll": "Alle anzeigen ->", "noServices": "Sie haben noch keine Dienste veroeffentlicht.",
    "exchange": "Tausch",
    "shortcuts": { "services": "Dienste erkunden", "requests": "Anfragen anzeigen", "members": "Mitglieder finden", "workshops": "Gemeinschafts-Workshops", "projects": "Kollaborative Projekte", "search": "KI-Suche" }
  },
  "members": {
    "label": "Unsere Gemeinschaft", "title": "Mitglieder", "subtitle": "{count} Person(en) bereit zum Tauschen ihrer Zeit.",
    "searchPlaceholder": "Nach Name, Faehigkeit, Stadt suchen...", "noResults": "Keine Mitglieder gefunden",
    "verified": "Verifiziert", "member": "Mitglied"
  },
  "forum": {
    "title": "Tauschforum", "newTopic": "Neues Thema", "editTopic": "Thema bearbeiten", "startDiscussion": "Eine Diskussion starten",
    "titlePlaceholder": "Thementitel", "messagePlaceholder": "Ihre Nachricht...", "externalLinkPlaceholder": "Externer Link (optional)",
    "uploading": "Hochladen...", "fileReady": "Datei bereit", "importMedia": "Foto/Video importieren",
    "removeMedia": "Entfernen", "update": "Aktualisieren", "publish": "Veroeffentlichen", "cancel": "Abbrechen",
    "externalLink": "Externer Link", "by": "Von", "commentPlaceholder": "Kommentieren...", "send": "Senden",
    "empty": "Noch keine Diskussionen. Seien Sie der Erste!", "loginRequired": "Anmelden zum Teilnehmen", "confirmDelete": "Dieses Thema dauerhaft loeschen?"
  }
'@

$patches["it"] = @'
,
  "about": {
    "label": "La nostra filosofia", "titleLine1": "Reinventare il mutuo aiuto", "titleLine2": "attraverso il tempo",
    "subtitle": "Bourse du Temps: 1 ora data vale 1 ora ricevuta - senza soldi, senza gerarchia, aperta a tutti.",
    "mission": { "label": "La Nostra Missione", "text": "Creare un ecosistema di scambio dove ogni persona possa valorizzare le proprie competenze senza barriere finanziarie." },
    "vision": { "label": "La Nostra Visione", "text": "Costruire la piu grande comunita di mutuo aiuto attraverso le competenze ovunque nel mondo." },
    "values": {
      "label": "Cosa ci guida", "title": "I nostri valori", "subtitle": "Sei principi fondamentali che definiscono ogni decisione che prendiamo.",
      "equality":     { "title": "Uguaglianza dei tempi",  "desc": "1 ora data = 1 ora ricevuta. Ogni ora ha lo stesso valore." },
      "trust":        { "title": "Fiducia reciproca",       "desc": "Ogni scambio si basa sulla parola data. La reputazione si costruisce con le azioni." },
      "inclusion":    { "title": "Inclusione e Diversita",  "desc": "Aperta a tutti senza requisiti. La diversita dei profili e la nostra piu grande ricchezza." },
      "solidarity":   { "title": "Solidarieta",             "desc": "Le comunita piu resilienti sono quelle che si aiutano reciprocamente." },
      "economy":      { "title": "Economia non monetaria",  "desc": "Il tempo, non i soldi. Un'alternativa all'economia di mercato, accessibile a tutti." },
      "transparency": { "title": "Trasparenza",             "desc": "Piattaforma senza scopo di lucro. Ogni scambio tracciato, ogni credito visibile." }
    },
    "howItWorks": {
      "label": "Semplice e concreto", "title": "Come funziona?",
      "step1": { "title": "Registrati",                   "desc": "Crea il tuo profilo con le tue competenze. Ricevi 5 crediti di benvenuto." },
      "step2": { "title": "Offri e Scambia",              "desc": "Pubblica un servizio o una richiesta. Contatta i membri e completa il tuo primo scambio." },
      "step3": { "title": "Costruisci la tua reputazione","desc": "Dopo ogni scambio, lascia una testimonianza. Accumula badge e sali di livello." },
      "step4": { "title": "Unisciti ai progetti",         "desc": "Partecipa a workshop collettivi e progetti collaborativi." }
    },
    "cta": { "title": "Pronto ad unirti alla comunita?", "subtitle": "Migliaia di competenze ti aspettano.", "btn": "Scopri i servizi ->" }
  },
  "contact": {
    "label": "Siamo qui", "title": "Contattaci", "subtitle": "Una domanda, partnership o bug? Scrivici, rispondiamo entro 48h.",
    "name": "Nome", "email": "Email", "subject": "Oggetto", "message": "Messaggio",
    "namePlaceholder": "Il tuo nome", "emailPlaceholder": "tua@email.com",
    "subjectPlaceholder": "Es.: Partnership istituzionale, segnalazione bug...", "messagePlaceholder": "Descrivi la tua richiesta...",
    "submit": "Invia messaggio ->", "sending": "Invio...", "successTitle": "Messaggio inviato!", "successMsg": "Ti risponderemo molto presto.",
    "sendAnother": "Invia un altro messaggio", "errorMsg": "Si e verificato un errore. Riprova.",
    "channelEmail": "Email", "channelForum": "Forum", "channelAI": "ALDEA", "channelForumVal": "Comunita", "channelAIVal": "Chat IA"
  },
  "requests": {
    "label": "Bisogni della comunita", "title": "Richieste in corso", "subtitle": "Un membro ha bisogno di te? Offri il tuo aiuto e guadagna crediti.",
    "searchPlaceholder": "Cerca una richiesta...", "noResults": "Nessuna richiesta per ora",
    "today": "Oggi", "yesterday": "Ieri", "daysAgo": "{days} giorni fa",
    "member": "Membro", "reply": "Rispondere", "credit": "credito", "credits": "crediti"
  },
  "dashboard": {
    "loginRequired": "Accesso richiesto", "loginDesc": "Accedi al tuo spazio personale", "login": "Accedi",
    "greeting": "Ciao, {name}", "subtitle": "Il tuo spazio personale", "myProfile": "Il mio profilo ->",
    "statCredits": "Crediti", "statServices": "Servizi", "statExchanges": "Scambi", "statEarned": "Crediti guadagnati",
    "reviewsBanner": "{count} recensione/i in attesa", "reviewsDesc": "Condividi la tua esperienza dopo i tuoi scambi recenti",
    "rateUser": "Valuta {name}", "leaveReview": "Lascia una recensione ->",
    "creditHistory": "Storico crediti", "earned": "guadagnati", "spent": "spesi",
    "myServices": "I miei servizi", "viewAll": "Vedi tutti ->", "noServices": "Non hai ancora pubblicato nessun servizio.",
    "exchange": "Scambio",
    "shortcuts": { "services": "Esplora servizi", "requests": "Vedi richieste", "members": "Trova membri", "workshops": "Workshop collettivi", "projects": "Progetti collaborativi", "search": "Ricerca IA" }
  },
  "members": {
    "label": "La nostra comunita", "title": "I membri", "subtitle": "{count} persona/e pronta/e a scambiare il proprio tempo.",
    "searchPlaceholder": "Cerca per nome, competenza, citta...", "noResults": "Nessun membro trovato",
    "verified": "Verificato", "member": "Membro"
  },
  "forum": {
    "title": "Forum degli scambi", "newTopic": "Nuovo Argomento", "editTopic": "Modifica argomento", "startDiscussion": "Avvia una discussione",
    "titlePlaceholder": "Titolo dell'argomento", "messagePlaceholder": "Il tuo messaggio...", "externalLinkPlaceholder": "Link esterno (facoltativo)",
    "uploading": "Caricamento...", "fileReady": "File pronto", "importMedia": "Importa Foto/Video",
    "removeMedia": "Rimuovi", "update": "Aggiorna", "publish": "Pubblica", "cancel": "Annulla",
    "externalLink": "Link esterno", "by": "Di", "commentPlaceholder": "Commenta...", "send": "Invia",
    "empty": "Nessuna discussione ancora. Sii il primo!", "loginRequired": "Accedi per partecipare", "confirmDelete": "Eliminare definitivamente questo argomento?"
  }
'@

$patches["nl"] = @'
,
  "about": {
    "label": "Onze filosofie", "titleLine1": "Wederzijdse hulp opnieuw uitvinden", "titleLine2": "door de tijd",
    "subtitle": "Bourse du Temps: 1 uur gegeven = 1 uur ontvangen - zonder geld, zonder hierarchie, open voor iedereen.",
    "mission": { "label": "Onze Missie", "text": "Een uitwisselingsecosysteem creeren waar iedereen zijn vaardigheden kan inzetten zonder financiele belemmeringen." },
    "vision": { "label": "Onze Visie", "text": "De grootste gemeenschap van wederzijdse hulp door vaardigheden opbouwen, verbindingen bevorderen overal ter wereld." },
    "values": {
      "label": "Wat ons leidt", "title": "Onze waarden", "subtitle": "Zes fundamentele principes die elke beslissing definiëren.",
      "equality":     { "title": "Tijdsgelijkheid",         "desc": "1 uur gegeven = 1 uur ontvangen. Elk uur heeft dezelfde waarde." },
      "trust":        { "title": "Wederzijds vertrouwen",   "desc": "Elke uitwisseling berust op het gegeven woord. Reputatie wordt opgebouwd door daden." },
      "inclusion":    { "title": "Inclusie en Diversiteit", "desc": "Open voor iedereen zonder vereisten. De diversiteit van profielen is onze grootste rijkdom." },
      "solidarity":   { "title": "Solidariteit",            "desc": "De meest veerkrachtige gemeenschappen zijn die welke elkaar helpen." },
      "economy":      { "title": "Niet-monetaire economie", "desc": "Tijd, niet geld. Een alternatief voor de markteconomie, toegankelijk voor iedereen." },
      "transparency": { "title": "Transparantie",           "desc": "Non-profit platform. Elke uitwisseling bijgehouden, elk tegoed zichtbaar." }
    },
    "howItWorks": {
      "label": "Eenvoudig en concreet", "title": "Hoe werkt het?",
      "step1": { "title": "Registreer je",          "desc": "Maak je profiel aan met je vaardigheden. Ontvang 5 welkomsttegoeden." },
      "step2": { "title": "Bied aan en Wissel uit", "desc": "Publiceer een dienst of verzoek. Neem contact op met leden en voltooi je eerste uitwisseling." },
      "step3": { "title": "Bouw je reputatie op",   "desc": "Laat na elke uitwisseling een getuigenis achter. Verzamel badges en stijg in niveau." },
      "step4": { "title": "Doe mee aan projecten",  "desc": "Neem deel aan collectieve workshops en collaboratieve projecten." }
    },
    "cta": { "title": "Klaar om lid te worden?", "subtitle": "Duizenden vaardigheden wachten op je.", "btn": "Diensten ontdekken ->" }
  },
  "contact": {
    "label": "We zijn er", "title": "Contact", "subtitle": "Een vraag, partnerschap of bug? Schrijf ons, we reageren binnen 48u.",
    "name": "Naam", "email": "E-mail", "subject": "Onderwerp", "message": "Bericht",
    "namePlaceholder": "Uw naam", "emailPlaceholder": "uw@email.com",
    "subjectPlaceholder": "Bijv.: Institutioneel partnerschap, bugrapport...", "messagePlaceholder": "Beschrijf uw verzoek...",
    "submit": "Bericht versturen ->", "sending": "Versturen...", "successTitle": "Bericht verstuurd!", "successMsg": "We nemen zeer snel contact met u op.",
    "sendAnother": "Nog een bericht sturen", "errorMsg": "Er is een fout opgetreden. Probeer opnieuw.",
    "channelEmail": "E-mail", "channelForum": "Forum", "channelAI": "ALDEA", "channelForumVal": "Gemeenschap", "channelAIVal": "AI-chat"
  },
  "requests": {
    "label": "Behoeften van de gemeenschap", "title": "Huidige verzoeken", "subtitle": "Een lid heeft je nodig? Bied je hulp aan en verdien tegoeden.",
    "searchPlaceholder": "Een verzoek zoeken...", "noResults": "Nog geen verzoeken",
    "today": "Vandaag", "yesterday": "Gisteren", "daysAgo": "{days} dagen geleden",
    "member": "Lid", "reply": "Antwoorden", "credit": "tegoed", "credits": "tegoeden"
  },
  "dashboard": {
    "loginRequired": "Aanmelding vereist", "loginDesc": "Toegang tot uw persoonlijke ruimte", "login": "Aanmelden",
    "greeting": "Hallo, {name}", "subtitle": "Uw persoonlijke ruimte", "myProfile": "Mijn profiel ->",
    "statCredits": "Tegoeden", "statServices": "Diensten", "statExchanges": "Uitwisselingen", "statEarned": "Verdiende tegoeden",
    "reviewsBanner": "{count} openstaande beoordeling(en)", "reviewsDesc": "Deel uw ervaring na uw recente uitwisselingen",
    "rateUser": "{name} beoordelen", "leaveReview": "Een beoordeling achterlaten ->",
    "creditHistory": "Tegoedengeschiedenis", "earned": "verdiend", "spent": "uitgegeven",
    "myServices": "Mijn diensten", "viewAll": "Alle bekijken ->", "noServices": "U heeft nog geen diensten gepubliceerd.",
    "exchange": "Uitwisseling",
    "shortcuts": { "services": "Diensten verkennen", "requests": "Verzoeken bekijken", "members": "Leden vinden", "workshops": "Collectieve workshops", "projects": "Collaboratieve projecten", "search": "AI-zoeken" }
  },
  "members": {
    "label": "Onze gemeenschap", "title": "De leden", "subtitle": "{count} persoon/personen klaar om hun tijd uit te wisselen.",
    "searchPlaceholder": "Zoek op naam, vaardigheid, stad...", "noResults": "Geen leden gevonden",
    "verified": "Geverifieerd", "member": "Lid"
  },
  "forum": {
    "title": "Uitwisselingsforum", "newTopic": "Nieuw onderwerp", "editTopic": "Onderwerp bewerken", "startDiscussion": "Een discussie starten",
    "titlePlaceholder": "Onderwerptitel", "messagePlaceholder": "Uw bericht...", "externalLinkPlaceholder": "Externe link (optioneel)",
    "uploading": "Uploaden...", "fileReady": "Bestand klaar", "importMedia": "Foto/Video importeren",
    "removeMedia": "Verwijderen", "update": "Bijwerken", "publish": "Publiceren", "cancel": "Annuleren",
    "externalLink": "Externe link", "by": "Door", "commentPlaceholder": "Reageren...", "send": "Versturen",
    "empty": "Nog geen discussies. Wees de eerste!", "loginRequired": "Aanmelden om deel te nemen", "confirmDelete": "Dit onderwerp permanent verwijderen?"
  }
'@

$patches["tr"] = @'
,
  "about": {
    "label": "Felsefemiz", "titleLine1": "Karsilikli yardimi yeniden kesfetmek", "titleLine2": "zaman araciligiyla",
    "subtitle": "Bourse du Temps: 1 saat verilen = 1 saat alinan - para yok, hiyerarsji yok, herkese acik.",
    "mission": { "label": "Misyonumuz", "text": "Herkesin finansal engeller olmadan becerilerini degerlendirebildigi bir degis tokus ekosistemi olusturmak." },
    "vision": { "label": "Vizyonumuz", "text": "Beceriler araciligiyla en buyuk karsilikli yardim toplulugunu olusturmak, dunyada insanlar arasinda baglantilar kurmak." },
    "values": {
      "label": "Bizi yonlendiren", "title": "Degerlerimiz", "subtitle": "Aldigimiz her karari tanimlayan alti temel ilke.",
      "equality":     { "title": "Zaman esitligi",         "desc": "1 saat verildi = 1 saat alindi. Her saatin ayni degeri vardir." },
      "trust":        { "title": "Karsilikli guven",        "desc": "Her degis tokus verilen soze dayanir. Itibar eylemlerle insaa edilir." },
      "inclusion":    { "title": "Kapsayicilik ve Cesitlilik","desc": "Sart aranmaksizin herkese acik. Profillerin cesitliligi en buyuk zenginligimizdir." },
      "solidarity":   { "title": "Dayanisma",               "desc": "En direncli topluluklar birbirine yardim edenlerdir." },
      "economy":      { "title": "Parasal olmayan ekonomi", "desc": "Para degil, zaman. Herkese erisebilir piyasa ekonomisine bir alternatif." },
      "transparency": { "title": "Seffaflik",               "desc": "Kar amaci gutmeyen platform. Her degis tokus izlenir, her kredi gorulur." }
    },
    "howItWorks": {
      "label": "Basit ve somut", "title": "Nasil calisir?",
      "step1": { "title": "Kaydol",                       "desc": "Becerilerinizi belirterek profilinizi olusturun. 5 hosgeldin kredisi alin." },
      "step2": { "title": "Teklif et ve Degis tokus et",  "desc": "Bir hizmet veya talep yayinlayin. Uyelerle iletisime gecin ve ilk degis tokusu tamamlayin." },
      "step3": { "title": "Itibarini olustur",            "desc": "Her degis tokus sonrasi bir referans birakin. Rozetler kazanin ve seviye atlayin." },
      "step4": { "title": "Projelere katil",              "desc": "Toplu atolyelere ve isbirligi projelerine katilarak birlikte daha ileri gidin." }
    },
    "cta": { "title": "Topluluğa katilmaya hazir misiniz?", "subtitle": "Binlerce beceri sizi bekliyor.", "btn": "Hizmetleri kesfet ->" }
  },
  "contact": {
    "label": "Buradayiz", "title": "Iletisim", "subtitle": "Bir soru, ortaklik veya hata mi? Bize yazin, 48 saat icinde cevap veririz.",
    "name": "Ad", "email": "E-posta", "subject": "Konu", "message": "Mesaj",
    "namePlaceholder": "Adiniz", "emailPlaceholder": "sizin@email.com",
    "subjectPlaceholder": "Orn.: Kurum ortakligi, hata bildirimi...", "messagePlaceholder": "Talebinizi aciklayin...",
    "submit": "Mesaj gonder ->", "sending": "Gonderiliyor...", "successTitle": "Mesaj gonderildi!", "successMsg": "Cok yakinda size donecegiz.",
    "sendAnother": "Baska bir mesaj gonder", "errorMsg": "Bir hata olustu. Lutfen tekrar deneyin.",
    "channelEmail": "E-posta", "channelForum": "Forum", "channelAI": "ALDEA", "channelForumVal": "Topluluk", "channelAIVal": "YZ Sohbet"
  },
  "requests": {
    "label": "Topluluk ihtiyaclari", "title": "Mevcut talepler", "subtitle": "Bir uye size ihtiyac duyuyor mu? Yardiminizi sunun ve kredi kazanin.",
    "searchPlaceholder": "Bir talep arayin...", "noResults": "Henuz talep yok",
    "today": "Bugun", "yesterday": "Dun", "daysAgo": "{days} gun once",
    "member": "Uye", "reply": "Yanitla", "credit": "kredi", "credits": "kredi"
  },
  "dashboard": {
    "loginRequired": "Giris gerekli", "loginDesc": "Kisisel alaniniza erisIN", "login": "Giris yap",
    "greeting": "Merhaba, {name}", "subtitle": "Kisisel alaniniz", "myProfile": "Profilim ->",
    "statCredits": "Krediler", "statServices": "Hizmetler", "statExchanges": "Degis tokuslar", "statEarned": "Kazanilan krediler",
    "reviewsBanner": "{count} bekleyen degerlendirme", "reviewsDesc": "Son degis tokuslarinizdan sonra deneyiminizi paylasin",
    "rateUser": "{name} degerlendir", "leaveReview": "Degerlendirme birak ->",
    "creditHistory": "Kredi gecmisi", "earned": "kazanildi", "spent": "harcandi",
    "myServices": "Hizmetlerim", "viewAll": "Tumunu gor ->", "noServices": "Henuz hicbir hizmet yayinlamadiniz.",
    "exchange": "Degis tokus",
    "shortcuts": { "services": "Hizmetleri kesfet", "requests": "Talepleri gor", "members": "Uye bul", "workshops": "Toplu atolyeler", "projects": "Isbirligi projeleri", "search": "YZ Arama" }
  },
  "members": {
    "label": "Toplulugumuz", "title": "Uyeler", "subtitle": "{count} kisi zamanini degis tokus etmeye hazir.",
    "searchPlaceholder": "Ad, beceri, sehir ile arayin...", "noResults": "Uye bulunamadi",
    "verified": "Dogrulandi", "member": "Uye"
  },
  "forum": {
    "title": "Degis tokus forumu", "newTopic": "Yeni Konu", "editTopic": "Konuyu duzenle", "startDiscussion": "Tartisma basla",
    "titlePlaceholder": "Konu basligi", "messagePlaceholder": "Mesajiniz...", "externalLinkPlaceholder": "Dis baglanti (istege bagli)",
    "uploading": "Yukleniyor...", "fileReady": "Dosya hazir", "importMedia": "Fotograf/Video ice aktar",
    "removeMedia": "Kaldir", "update": "Guncelle", "publish": "Yayinla", "cancel": "Iptal",
    "externalLink": "Dis baglanti", "by": "Yazan", "commentPlaceholder": "Yorum yap...", "send": "Gonder",
    "empty": "Henuz tartisma yok. Ilk siz olun!", "loginRequired": "Katilmak icin giris yapin", "confirmDelete": "Bu konuyu kalici olarak silin mi?"
  }
'@

$patches["sw"] = @'
,
  "about": {
    "label": "Falsafa yetu", "titleLine1": "Kugundua upya usaidizi wa pamoja", "titleLine2": "kupitia muda",
    "subtitle": "Bourse du Temps: saa 1 iliyotolewa = saa 1 iliyopokelewa - bila pesa, bila uongozi, wazi kwa wote.",
    "mission": { "label": "Dhamira Yetu", "text": "Kuunda mfumo wa kubadilishana ambapo kila mtu anaweza kuthamini ujuzi wake bila vikwazo vya kifedha." },
    "vision": { "label": "Maono Yetu", "text": "Kujenga jumuiya kubwa zaidi ya usaidizi wa pamoja kupitia ujuzi duniani kote." },
    "values": {
      "label": "Kinachotuongoza", "title": "Maadili yetu", "subtitle": "Kanuni sita za msingi zinazofafanua kila uamuzi tunaoufanya.",
      "equality":     { "title": "Usawa wa muda",          "desc": "Saa 1 iliyotolewa = saa 1 iliyopokelewa. Kila saa ina thamani sawa." },
      "trust":        { "title": "Imani ya pamoja",         "desc": "Kila ubadilishano unategemea neno lililotolewa. Sifa inajengwa kupitia vitendo." },
      "inclusion":    { "title": "Ujumuishaji na Utofauti", "desc": "Wazi kwa wote bila masharti. Utofauti wa wasifu ni utajiri wetu mkubwa zaidi." },
      "solidarity":   { "title": "Mshikamano",              "desc": "Jamii zenye ustahimilivu zaidi ni zile zinazosaidiana." },
      "economy":      { "title": "Uchumi usio wa fedha",    "desc": "Muda, si pesa. Mbadala wa uchumi wa soko, unaoweza kufikiwa na wote." },
      "transparency": { "title": "Uwazi",                   "desc": "Jukwaa lisilo la faida. Kila ubadilishano unafuatiliwa, kila mkopo unaonekana." }
    },
    "howItWorks": {
      "label": "Rahisi na halisi", "title": "Inafanyaje kazi?",
      "step1": { "title": "Jiandikishe",        "desc": "Unda wasifu wako ukiorodhesha ujuzi na mahitaji yako. Pokea mikopo 5 ya karibu." },
      "step2": { "title": "Toa na Badilishana", "desc": "Chapisha huduma au ombi. Wasiliana na wanachama na ukamilishe ubadilishano wako wa kwanza." },
      "step3": { "title": "Jenga sifa yako",    "desc": "Baada ya kila ubadilishano, acha ushuhuda. Kusanya beji na panda kiwango." },
      "step4": { "title": "Jiunge na miradi",   "desc": "Shiriki katika warsha za pamoja na miradi ya ushirikiano." }
    },
    "cta": { "title": "Uko tayari kujiunga na jumuiya?", "subtitle": "Maelfu ya ujuzi yanakungoja.", "btn": "Gundua huduma ->" }
  },
  "contact": {
    "label": "Tuko hapa", "title": "Wasiliana nasi", "subtitle": "Swali, ushirikiano, hitilafu? Tuandikie, tunajibu ndani ya masaa 48.",
    "name": "Jina", "email": "Barua pepe", "subject": "Mada", "message": "Ujumbe",
    "namePlaceholder": "Jina lako", "emailPlaceholder": "wako@barua.com",
    "subjectPlaceholder": "Mf.: Ushirikiano wa taasisi, ripoti ya hitilafu...", "messagePlaceholder": "Elezea ombi lako...",
    "submit": "Tuma ujumbe ->", "sending": "Inatumwa...", "successTitle": "Ujumbe umetumwa!", "successMsg": "Tutawasiliana nawe hivi karibuni.",
    "sendAnother": "Tuma ujumbe mwingine", "errorMsg": "Kosa limetokea. Jaribu tena.",
    "channelEmail": "Barua pepe", "channelForum": "Jukwaa", "channelAI": "ALDEA", "channelForumVal": "Jumuiya", "channelAIVal": "Mazungumzo ya AI"
  },
  "requests": {
    "label": "Mahitaji ya jumuiya", "title": "Maombi ya sasa", "subtitle": "Mwanachama anahitaji msaada wako? Toa msaada na upate mikopo.",
    "searchPlaceholder": "Tafuta ombi...", "noResults": "Hakuna maombi kwa sasa",
    "today": "Leo", "yesterday": "Jana", "daysAgo": "siku {days} zilizopita",
    "member": "Mwanachama", "reply": "Jibu", "credit": "mkopo", "credits": "mikopo"
  },
  "dashboard": {
    "loginRequired": "Ingia inahitajika", "loginDesc": "Fikia nafasi yako ya kibinafsi", "login": "Ingia",
    "greeting": "Habari, {name}", "subtitle": "Nafasi yako ya kibinafsi", "myProfile": "Wasifu wangu ->",
    "statCredits": "Mikopo", "statServices": "Huduma", "statExchanges": "Ubadilishano", "statEarned": "Mikopo iliyopatikana",
    "reviewsBanner": "{count} tathmini zinazosubiri", "reviewsDesc": "Shiriki uzoefu wako baada ya mabadilishano yako ya hivi karibuni",
    "rateUser": "Tathmini {name}", "leaveReview": "Acha tathmini ->",
    "creditHistory": "Historia ya mikopo", "earned": "iliyopatikana", "spent": "iliyotumika",
    "myServices": "Huduma zangu", "viewAll": "Ona zote ->", "noServices": "Bado haujachapisha huduma yoyote.",
    "exchange": "Ubadilishano",
    "shortcuts": { "services": "Chunguza huduma", "requests": "Ona maombi", "members": "Pata wanachama", "workshops": "Warsha za pamoja", "projects": "Miradi ya ushirikiano", "search": "Utafutaji wa AI" }
  },
  "members": {
    "label": "Jumuiya yetu", "title": "Wanachama", "subtitle": "{count} mtu tayari kubadilishana muda wao.",
    "searchPlaceholder": "Tafuta kwa jina, ujuzi, mji...", "noResults": "Hakuna wanachama waliopatikana",
    "verified": "Imethibitishwa", "member": "Mwanachama"
  },
  "forum": {
    "title": "Jukwaa la ubadilishano", "newTopic": "Mada Mpya", "editTopic": "Hariri mada", "startDiscussion": "Anza mjadala",
    "titlePlaceholder": "Kichwa cha mada", "messagePlaceholder": "Ujumbe wako...", "externalLinkPlaceholder": "Kiungo cha nje (hiari)",
    "uploading": "Inapakia...", "fileReady": "Faili iko tayari", "importMedia": "Ingiza Picha/Video",
    "removeMedia": "Ondoa", "update": "Sasisha", "publish": "Chapisha", "cancel": "Ghairi",
    "externalLink": "Kiungo cha nje", "by": "Na", "commentPlaceholder": "Toa maoni...", "send": "Tuma",
    "empty": "Hakuna majadiliano bado. Kuwa wa kwanza!", "loginRequired": "Ingia kushiriki", "confirmDelete": "Futa mada hii kabisa?"
  }
'@

$patches["wo"] = @'
,
  "about": {
    "label": "Falsafa bii", "titleLine1": "Regle ci kanam ndimbal bu rey", "titleLine2": "ci yoon bu digg",
    "subtitle": "Bourse du Temps: 1 waxtu jox = 1 waxtu jend - xaalis aldul, nit ni dem ci kanam.",
    "mission": { "label": "Misiyong bi", "text": "Defar ekosistem bu jefandikoo nit nep nu men a bayyil seen karaw ci pepp taxaw u xaalis." },
    "vision": { "label": "Viziyon bi", "text": "Defar kelefaay bu mag bu ndimbal ci karaw ci aduna bii yep." },
    "values": {
      "label": "Lii nu naan", "title": "Njarin yi", "subtitle": "Fukki ak jurom prinsip yu digg yi def ak yep lep nu dekkal.",
      "equality":     { "title": "Dekkante ak waxtu",  "desc": "1 waxtu jox = 1 waxtu jend. Waxtu bep am na njarin bu dekk." },
      "trust":        { "title": "Njiitu jaaxle",       "desc": "Jefandikoo bep defar na ci wax bu jox. Mbooloo bu bokk." },
      "inclusion":    { "title": "Bokkandoo ak Yokute", "desc": "Ub na ci nit nep. Yokute yi am na njarin bu mag." },
      "solidarity":   { "title": "Mbooloo",             "desc": "Kelefaay yu deger yi mooy ni ndimbal neneen." },
      "economy":      { "title": "Ekonomi bu xaalis aldul","desc": "Waxtu, xaalis du dem. Elk yu wecce ci ekonomi bu jaay." },
      "transparency": { "title": "Seetlu",              "desc": "Elk bu xaalis aldul. Jefandikoo bep xam-xamu, kredi bep gis-gisna." }
    },
    "howItWorks": {
      "label": "Yomb ak wecce", "title": "Naka la def?",
      "step1": { "title": "Serina",             "desc": "Defar sa profil ak seen karaw ak njekl yi. Jend 5 kredi yu dalal." },
      "step2": { "title": "Jox ak Jefandikoo",  "desc": "Bindi serin walla demantal. Xam nit nu epi yen ci kanam." },
      "step3": { "title": "Defar sa mbooloo",   "desc": "Ginnaaw jefandikoo bep, bindi teraanga. Dejel badge epi yegel niveoo." },
      "step4": { "title": "Bokk ci proje yi",   "desc": "Bokk ci atelier yi ak proje bu nu bokk." }
    },
    "cta": { "title": "Xool ngir bokk ci kelefaay bi?", "subtitle": "Junni karaw yi xaar nga.", "btn": "Xool serina yi ->" }
  },
  "contact": {
    "label": "Nanu fi", "title": "Jokkoo ak nun", "subtitle": "Laaj, mbokk, bug? Bind ci nun, nu tontu ci 48 waxtu.",
    "name": "Tur", "email": "Imel", "subject": "Suje bi", "message": "Xabaar bi",
    "namePlaceholder": "Sa tur", "emailPlaceholder": "yaw@imel.com",
    "subjectPlaceholder": "Ex: Mbokk ci institution, bug...", "messagePlaceholder": "Wax sa demantal...",
    "submit": "Yonni xabaar ->", "sending": "Yonniwaat...", "successTitle": "Xabaar yonniwoon!", "successMsg": "Nu di tontu ci yaw ci kanam bu kanam.",
    "sendAnother": "Yonni yeneen xabaar", "errorMsg": "Wereg am na. Jeema tukki.",
    "channelEmail": "Imel", "channelForum": "Forum bi", "channelAI": "ALDEA", "channelForumVal": "Kelefaay bi", "channelAIVal": "Chat IA"
  },
  "requests": {
    "label": "Njekl kelefaay bi", "title": "Demantal yi attee", "subtitle": "Gestu bokk am na njekl yaw? Jox sa ndimbal te jend kredi.",
    "searchPlaceholder": "Seet demantal...", "noResults": "Demantal du am legi",
    "today": "Tey", "yesterday": "Demb", "daysAgo": "{days} fan weesu",
    "member": "Gestu bokk", "reply": "Tontu", "credit": "kredi", "credits": "kredi"
  },
  "dashboard": {
    "loginRequired": "Jokkoo waajoo", "loginDesc": "Duggu ci sa espas", "login": "Jokkoo",
    "greeting": "Salaam, {name}", "subtitle": "Sa espas", "myProfile": "Sa profil ->",
    "statCredits": "Kredi yi", "statServices": "Serina yi", "statExchanges": "Jefandikoo yi", "statEarned": "Kredi yu jend",
    "reviewsBanner": "{count} avi yi xaar", "reviewsDesc": "Wax sa momel ginnaaw jefandikoo yi bu mujj",
    "rateUser": "Juge {name}", "leaveReview": "Bindi avi ->",
    "creditHistory": "Taalif kredi yi", "earned": "jenday", "spent": "dekkal",
    "myServices": "Serina yi", "viewAll": "Xool yep ->", "noServices": "Serina amul legi.",
    "exchange": "Jefandikoo",
    "shortcuts": { "services": "Xool serina yi", "requests": "Xool demantal yi", "members": "Seet gestu bokk yi", "workshops": "Atelier yi", "projects": "Proje yi", "search": "Seet IA" }
  },
  "members": {
    "label": "Kelefaay bi", "title": "Gestu bokk yi", "subtitle": "{count} nit xaar ngir jefandikoo waxtu.",
    "searchPlaceholder": "Seet tur, karaw, dekk...", "noResults": "Gestu bokk gena amul",
    "verified": "Seetlu", "member": "Gestu bokk"
  },
  "forum": {
    "title": "Forum jefandikoo yi", "newTopic": "Sujet Bees", "editTopic": "Sakk sujet bi", "startDiscussion": "Takk mbeg mi",
    "titlePlaceholder": "Tur sujet bi", "messagePlaceholder": "Sa xabaar...", "externalLinkPlaceholder": "Lien bu kanam (opsiyonel)",
    "uploading": "Di yonniwaat...", "fileReady": "Fichier xam-xam", "importMedia": "Dugal Foto/Video",
    "removeMedia": "Fatte", "update": "Yegel", "publish": "Bind", "cancel": "Taxaw",
    "externalLink": "Lien bu kanam", "by": "Ak", "commentPlaceholder": "Wax...", "send": "Yonni",
    "empty": "Mbeg amul legi. Yaw la njek!", "loginRequired": "Jokkoo ngir bokk", "confirmDelete": "Fatte sujet bi ci diir?"
  }
'@

$patches["ar"] = @'
,
  "about": {
    "label": "فلسفتنا", "titleLine1": "إعادة اختراع التعاون المتبادل", "titleLine2": "من خلال الوقت",
    "subtitle": "بورص دو تون: ساعة معطاة = ساعة مستلمة - بدون مال، بدون تراتبية، مفتوحة للجميع.",
    "mission": { "label": "مهمتنا", "text": "إنشاء نظام بيئي للتبادل حيث يمكن لكل شخص تثمين مهاراته دون حواجز مالية." },
    "vision": { "label": "رؤيتنا", "text": "بناء أكبر مجتمع للتعاون المتبادل من خلال المهارات في كل مكان في العالم." },
    "values": {
      "label": "ما يوجهنا", "title": "قيمنا", "subtitle": "ستة مبادئ أساسية تحدد كل قرار نتخذه.",
      "equality":     { "title": "مساواة الأوقات",  "desc": "ساعة معطاة = ساعة مستلمة. لكل ساعة نفس القيمة." },
      "trust":        { "title": "الثقة المتبادلة", "desc": "يعتمد كل تبادل على الكلمة المعطاة. السمعة تبنى من خلال الأفعال." },
      "inclusion":    { "title": "الشمول والتنوع",  "desc": "مفتوحة للجميع دون اشتراط. تنوع الملفات الشخصية هو ثروتنا الأكبر." },
      "solidarity":   { "title": "التضامن",         "desc": "أكثر المجتمعات مرونة هي تلك التي تساعد بعضها." },
      "economy":      { "title": "اقتصاد غير نقدي", "desc": "الوقت، لا المال. بديل لاقتصاد السوق، يمكن الوصول إليه من الجميع." },
      "transparency": { "title": "الشفافية",        "desc": "منصة غير ربحية. كل تبادل متتبع، وكل رصيد مرئي." }
    },
    "howItWorks": {
      "label": "بسيط وملموس", "title": "كيف يعمل؟",
      "step1": { "title": "سجّل",              "desc": "أنشئ ملفك الشخصي مع مهاراتك. احصل على 5 رصيد ترحيبي للبدء." },
      "step2": { "title": "اعرض وتبادل",       "desc": "انشر خدمة أو طلباً. تواصل مع الأعضاء وأكمل أول تبادل." },
      "step3": { "title": "ابنِ سمعتك",        "desc": "بعد كل تبادل، اترك شهادة. اجمع الشارات وارتقِ في المستوى." },
      "step4": { "title": "انضم إلى المشاريع", "desc": "شارك في ورش العمل الجماعية والمشاريع التعاونية." }
    },
    "cta": { "title": "هل أنت مستعد للانضمام؟", "subtitle": "آلاف المهارات تنتظرك.", "btn": "اكتشف الخدمات ->" }
  },
  "contact": {
    "label": "نحن هنا", "title": "تواصل معنا", "subtitle": "سؤال، شراكة، خطأ؟ اكتب لنا، نرد خلال 48 ساعة.",
    "name": "الاسم", "email": "البريد الإلكتروني", "subject": "الموضوع", "message": "الرسالة",
    "namePlaceholder": "اسمك", "emailPlaceholder": "بريدك@الإلكتروني.com",
    "subjectPlaceholder": "مثال: شراكة مؤسسية، تقرير خطأ...", "messagePlaceholder": "صف طلبك...",
    "submit": "إرسال الرسالة ->", "sending": "جارٍ الإرسال...", "successTitle": "تم إرسال الرسالة!", "successMsg": "سنتواصل معك قريباً جداً.",
    "sendAnother": "إرسال رسالة أخرى", "errorMsg": "حدث خطأ. يرجى المحاولة مرة أخرى.",
    "channelEmail": "البريد الإلكتروني", "channelForum": "المنتدى", "channelAI": "ALDEA", "channelForumVal": "المجتمع", "channelAIVal": "دردشة الذكاء الاصطناعي"
  },
  "requests": {
    "label": "احتياجات المجتمع", "title": "الطلبات الحالية", "subtitle": "عضو يحتاجك؟ قدم مساعدتك واكسب رصيداً.",
    "searchPlaceholder": "البحث عن طلب...", "noResults": "لا توجد طلبات في الوقت الحالي",
    "today": "اليوم", "yesterday": "أمس", "daysAgo": "منذ {days} أيام",
    "member": "عضو", "reply": "رد", "credit": "رصيد", "credits": "أرصدة"
  },
  "dashboard": {
    "loginRequired": "تسجيل الدخول مطلوب", "loginDesc": "الوصول إلى مساحتك الشخصية", "login": "تسجيل الدخول",
    "greeting": "مرحباً، {name}", "subtitle": "مساحتك الشخصية", "myProfile": "ملفي الشخصي ->",
    "statCredits": "الأرصدة", "statServices": "الخدمات", "statExchanges": "التبادلات", "statEarned": "الأرصدة المكتسبة",
    "reviewsBanner": "{count} تقييم(ات) معلقة", "reviewsDesc": "شارك تجربتك بعد تبادلاتك الأخيرة",
    "rateUser": "تقييم {name}", "leaveReview": "اترك تقييماً ->",
    "creditHistory": "سجل الأرصدة", "earned": "مكتسبة", "spent": "منفقة",
    "myServices": "خدماتي", "viewAll": "عرض الكل ->", "noServices": "لم تنشر أي خدمة بعد.",
    "exchange": "تبادل",
    "shortcuts": { "services": "استكشاف الخدمات", "requests": "عرض الطلبات", "members": "البحث عن أعضاء", "workshops": "ورش العمل الجماعية", "projects": "المشاريع التعاونية", "search": "البحث بالذكاء الاصطناعي" }
  },
  "members": {
    "label": "مجتمعنا", "title": "الأعضاء", "subtitle": "{count} شخص مستعد لتبادل وقته.",
    "searchPlaceholder": "البحث بالاسم أو المهارة أو المدينة...", "noResults": "لم يتم العثور على أعضاء",
    "verified": "موثّق", "member": "عضو"
  },
  "forum": {
    "title": "منتدى التبادلات", "newTopic": "موضوع جديد", "editTopic": "تعديل الموضوع", "startDiscussion": "بدء نقاش",
    "titlePlaceholder": "عنوان الموضوع", "messagePlaceholder": "رسالتك...", "externalLinkPlaceholder": "رابط خارجي (اختياري)",
    "uploading": "جارٍ الرفع...", "fileReady": "الملف جاهز", "importMedia": "استيراد صورة/فيديو",
    "removeMedia": "إزالة", "update": "تحديث", "publish": "نشر", "cancel": "إلغاء",
    "externalLink": "رابط خارجي", "by": "بواسطة", "commentPlaceholder": "أضف تعليقاً...", "send": "إرسال",
    "empty": "لا توجد نقاشات بعد. كن الأول!", "loginRequired": "سجّل الدخول للمشاركة", "confirmDelete": "حذف هذا الموضوع نهائياً؟"
  }
'@

$patches["ru"] = @'
,
  "about": {
    "label": "Наша философия", "titleLine1": "Переосмысление взаимопомощи", "titleLine2": "через время",
    "subtitle": "Bourse du Temps: 1 час отданный = 1 час полученный - без денег, без иерархии, открытая для всех.",
    "mission": { "label": "Наша Миссия", "text": "Создать экосистему обмена, где каждый может реализовать свои навыки без финансовых барьеров." },
    "vision": { "label": "Наше Видение", "text": "Построить крупнейшее сообщество взаимопомощи через навыки, содействуя связям между людьми везде в мире." },
    "values": {
      "label": "Что нас направляет", "title": "Наши ценности", "subtitle": "Шесть основных принципов, которые определяют каждое принимаемое нами решение.",
      "equality":     { "title": "Равенство времени",        "desc": "1 час отдан = 1 час получен. Каждый час имеет одинаковую ценность." },
      "trust":        { "title": "Взаимное доверие",          "desc": "Каждый обмен основан на данном слове. Репутация строится поступками." },
      "inclusion":    { "title": "Инклюзивность и разнообразие","desc": "Открыта для всех без условий. Разнообразие профилей - наше главное богатство." },
      "solidarity":   { "title": "Солидарность",              "desc": "Наиболее устойчивые сообщества - те, что помогают друг другу." },
      "economy":      { "title": "Неденежная экономика",      "desc": "Время, не деньги. Альтернатива рыночной экономике, доступная для всех." },
      "transparency": { "title": "Прозрачность",              "desc": "Некоммерческая платформа. Каждый обмен отслеживается, каждый кредит виден." }
    },
    "howItWorks": {
      "label": "Просто и конкретно", "title": "Как это работает?",
      "step1": { "title": "Зарегистрируйтесь",           "desc": "Создайте профиль с вашими навыками. Получите 5 приветственных кредитов." },
      "step2": { "title": "Предлагайте и обменивайтесь", "desc": "Опубликуйте услугу или запрос. Свяжитесь с участниками и завершите первый обмен." },
      "step3": { "title": "Стройте репутацию",           "desc": "После каждого обмена оставляйте отзыв. Зарабатывайте значки и повышайте уровень." },
      "step4": { "title": "Присоединяйтесь к проектам", "desc": "Участвуйте в коллективных мастер-классах и совместных проектах." }
    },
    "cta": { "title": "Готовы вступить в сообщество?", "subtitle": "Тысячи навыков ждут вас.", "btn": "Открыть для себя услуги ->" }
  },
  "contact": {
    "label": "Мы здесь", "title": "Связаться с нами", "subtitle": "Вопрос, партнёрство, ошибка? Напишите нам, мы ответим в течение 48 часов.",
    "name": "Имя", "email": "Электронная почта", "subject": "Тема", "message": "Сообщение",
    "namePlaceholder": "Ваше имя", "emailPlaceholder": "ваш@email.com",
    "subjectPlaceholder": "Напр.: Партнёрство с учреждением, сообщение об ошибке...", "messagePlaceholder": "Опишите ваш запрос...",
    "submit": "Отправить сообщение ->", "sending": "Отправка...", "successTitle": "Сообщение отправлено!", "successMsg": "Мы свяжемся с вами очень скоро.",
    "sendAnother": "Отправить ещё одно сообщение", "errorMsg": "Произошла ошибка. Попробуйте снова.",
    "channelEmail": "Эл. почта", "channelForum": "Форум", "channelAI": "ALDEA", "channelForumVal": "Сообщество", "channelAIVal": "ИИ-чат"
  },
  "requests": {
    "label": "Потребности сообщества", "title": "Текущие запросы", "subtitle": "Участнику нужна ваша помощь? Предложите её и заработайте кредиты.",
    "searchPlaceholder": "Найти запрос...", "noResults": "Запросов пока нет",
    "today": "Сегодня", "yesterday": "Вчера", "daysAgo": "{days} дней назад",
    "member": "Участник", "reply": "Ответить", "credit": "кредит", "credits": "кредитов"
  },
  "dashboard": {
    "loginRequired": "Необходима авторизация", "loginDesc": "Войдите в личный кабинет", "login": "Войти",
    "greeting": "Привет, {name}", "subtitle": "Ваш личный кабинет", "myProfile": "Мой профиль ->",
    "statCredits": "Кредиты", "statServices": "Услуги", "statExchanges": "Обмены", "statEarned": "Заработанные кредиты",
    "reviewsBanner": "{count} ожидающих отзыва", "reviewsDesc": "Поделитесь впечатлениями после недавних обменов",
    "rateUser": "Оценить {name}", "leaveReview": "Оставить отзыв ->",
    "creditHistory": "История кредитов", "earned": "заработано", "spent": "потрачено",
    "myServices": "Мои услуги", "viewAll": "Посмотреть все ->", "noServices": "Вы ещё не опубликовали ни одной услуги.",
    "exchange": "Обмен",
    "shortcuts": { "services": "Изучить услуги", "requests": "Просмотреть запросы", "members": "Найти участников", "workshops": "Групповые мастер-классы", "projects": "Совместные проекты", "search": "ИИ-поиск" }
  },
  "members": {
    "label": "Наше сообщество", "title": "Участники", "subtitle": "{count} человек готовы обменяться временем.",
    "searchPlaceholder": "Поиск по имени, навыку, городу...", "noResults": "Участники не найдены",
    "verified": "Подтверждён", "member": "Участник"
  },
  "forum": {
    "title": "Форум обменов", "newTopic": "Новая тема", "editTopic": "Редактировать тему", "startDiscussion": "Начать обсуждение",
    "titlePlaceholder": "Название темы", "messagePlaceholder": "Ваше сообщение...", "externalLinkPlaceholder": "Внешняя ссылка (необязательно)",
    "uploading": "Загрузка...", "fileReady": "Файл готов", "importMedia": "Импортировать фото/видео",
    "removeMedia": "Удалить", "update": "Обновить", "publish": "Опубликовать", "cancel": "Отмена",
    "externalLink": "Внешняя ссылка", "by": "Автор", "commentPlaceholder": "Комментировать...", "send": "Отправить",
    "empty": "Обсуждений пока нет. Будьте первым!", "loginRequired": "Войдите для участия", "confirmDelete": "Навсегда удалить эту тему?"
  }
'@

$patches["zh"] = @'
,
  "about": {
    "label": "我们的理念", "titleLine1": "重新定义互助", "titleLine2": "通过时间",
    "subtitle": "Bourse du Temps：1小时付出 = 1小时获得 - 无需金钱，无需等级，向所有人开放。",
    "mission": { "label": "我们的使命", "text": "创建一个交换生态系统，让每个人都能在没有财务障碍的情况下发挥自己的技能。" },
    "vision": { "label": "我们的愿景", "text": "建立最大的技能互助社区，促进世界各地人们之间的联系。" },
    "values": {
      "label": "指导我们的原则", "title": "我们的价值观", "subtitle": "六项基本原则，定义了我们做出的每一个决定。",
      "equality":     { "title": "时间平等",   "desc": "付出1小时 = 获得1小时。每小时具有相同的价值。" },
      "trust":        { "title": "相互信任",   "desc": "每次交换都建立在承诺的基础上。声誉通过行动建立。" },
      "inclusion":    { "title": "包容与多样性","desc": "向所有人开放，不要求文凭或收入。多样化档案是我们最大的财富。" },
      "solidarity":   { "title": "团结互助",   "desc": "最有韧性的社区是那些相互帮助的社区。" },
      "economy":      { "title": "非货币经济", "desc": "时间，而非金钱。市场经济的替代方案，人人可及。" },
      "transparency": { "title": "透明度",     "desc": "非营利平台。每次交换都有记录，每个积分都可见。" }
    },
    "howItWorks": {
      "label": "简单且具体", "title": "如何运作？",
      "step1": { "title": "注册",        "desc": "创建个人资料，列出您的技能和需求。获得5个欢迎积分开始使用。" },
      "step2": { "title": "提供和交换",  "desc": "发布服务或请求。联系会员，协商并完成您的第一次交换。" },
      "step3": { "title": "建立声誉",    "desc": "每次交换后留下证明。积累徽章，提升等级。" },
      "step4": { "title": "加入项目",    "desc": "参与集体工作坊和协作项目，共同走得更远。" }
    },
    "cta": { "title": "准备好加入社区了吗？", "subtitle": "成千上万的技能等待着您。", "btn": "探索服务 ->" }
  },
  "contact": {
    "label": "我们在这里", "title": "联系我们", "subtitle": "有问题、合作或错误？给我们写信，我们在48小时内回复。",
    "name": "姓名", "email": "电子邮件", "subject": "主题", "message": "消息",
    "namePlaceholder": "您的姓名", "emailPlaceholder": "您的@邮件.com",
    "subjectPlaceholder": "例如：机构合作、错误报告...", "messagePlaceholder": "描述您的请求...",
    "submit": "发送消息 ->", "sending": "发送中...", "successTitle": "消息已发送！", "successMsg": "我们很快会回复您。",
    "sendAnother": "发送另一条消息", "errorMsg": "发生错误，请重试。",
    "channelEmail": "电子邮件", "channelForum": "论坛", "channelAI": "ALDEA", "channelForumVal": "社区", "channelAIVal": "AI聊天"
  },
  "requests": {
    "label": "社区需求", "title": "当前请求", "subtitle": "有会员需要您的帮助？提供帮助并赚取积分。",
    "searchPlaceholder": "搜索请求...", "noResults": "暂无请求",
    "today": "今天", "yesterday": "昨天", "daysAgo": "{days}天前",
    "member": "会员", "reply": "回复", "credit": "积分", "credits": "积分"
  },
  "dashboard": {
    "loginRequired": "需要登录", "loginDesc": "访问您的个人空间", "login": "登录",
    "greeting": "你好，{name}", "subtitle": "您的个人空间", "myProfile": "我的资料 ->",
    "statCredits": "积分", "statServices": "服务", "statExchanges": "交换", "statEarned": "已赚积分",
    "reviewsBanner": "{count}条待处理评价", "reviewsDesc": "在最近的交换后分享您的体验",
    "rateUser": "评价{name}", "leaveReview": "留下评价 ->",
    "creditHistory": "积分历史", "earned": "已赚", "spent": "已花",
    "myServices": "我的服务", "viewAll": "查看全部 ->", "noServices": "您还没有发布任何服务。",
    "exchange": "交换",
    "shortcuts": { "services": "探索服务", "requests": "查看请求", "members": "查找会员", "workshops": "集体工作坊", "projects": "协作项目", "search": "AI搜索" }
  },
  "members": {
    "label": "我们的社区", "title": "会员", "subtitle": "{count}人准备好交换他们的时间。",
    "searchPlaceholder": "按姓名、技能、城市搜索...", "noResults": "未找到会员",
    "verified": "已认证", "member": "会员"
  },
  "forum": {
    "title": "交换论坛", "newTopic": "新话题", "editTopic": "编辑话题", "startDiscussion": "开始讨论",
    "titlePlaceholder": "话题标题", "messagePlaceholder": "您的消息...", "externalLinkPlaceholder": "外部链接（可选）",
    "uploading": "上传中...", "fileReady": "文件已准备好", "importMedia": "导入图片/视频",
    "removeMedia": "移除", "update": "更新", "publish": "发布", "cancel": "取消",
    "externalLink": "外部链接", "by": "作者", "commentPlaceholder": "评论...", "send": "发送",
    "empty": "暂无讨论，成为第一个！", "loginRequired": "登录后参与", "confirmDelete": "永久删除此话题？"
  }
'@

$patches["ja"] = @'
,
  "about": {
    "label": "私たちの哲学", "titleLine1": "相互扶助を再定義する", "titleLine2": "時間を通じて",
    "subtitle": "Bourse du Temps：1時間提供 = 1時間受け取る - お金なし、階層なし、すべての人に開かれています。",
    "mission": { "label": "私たちのミッション", "text": "すべての人が財務的な障壁なしにスキルを活かせる交換エコシステムを構築します。" },
    "vision": { "label": "私たちのビジョン", "text": "スキルを通じた最大の相互扶助コミュニティを構築し、世界中の人々をつなぎます。" },
    "values": {
      "label": "私たちを導くもの", "title": "私たちの価値観", "subtitle": "私たちが行うすべての決定を定義する6つの基本原則。",
      "equality":     { "title": "時間の平等",   "desc": "1時間提供 = 1時間受け取る。すべての時間は同じ価値を持ちます。" },
      "trust":        { "title": "相互信頼",      "desc": "すべての交換は言葉の約束に基づいています。評判は行動によって築かれます。" },
      "inclusion":    { "title": "包容と多様性",  "desc": "条件なしにすべての人に開かれています。プロフィールの多様性が最大の財産です。" },
      "solidarity":   { "title": "連帯",          "desc": "最も回復力のあるコミュニティは互いに助け合うものです。" },
      "economy":      { "title": "非金銭的経済",  "desc": "お金ではなく時間。すべての人にアクセス可能な市場経済の代替案。" },
      "transparency": { "title": "透明性",        "desc": "非営利プラットフォーム。すべての交換が追跡され、すべてのクレジットが見えます。" }
    },
    "howItWorks": {
      "label": "シンプルで具体的", "title": "どのように機能しますか？",
      "step1": { "title": "登録する",             "desc": "スキルとニーズを記載してプロフィールを作成します。5つのウェルカムクレジットを受け取ります。" },
      "step2": { "title": "提供して交換する",      "desc": "サービスやリクエストを投稿します。メンバーと連絡を取り、最初の交換を完了します。" },
      "step3": { "title": "評判を築く",            "desc": "各交換後に証言を残します。バッジを集め、レベルアップします。" },
      "step4": { "title": "プロジェクトに参加する","desc": "集団ワークショップと協働プロジェクトに参加してさらに前進します。" }
    },
    "cta": { "title": "コミュニティに参加する準備はできていますか？", "subtitle": "何千ものスキルがあなたを待っています。", "btn": "サービスを探す ->" }
  },
  "contact": {
    "label": "ここにいます", "title": "お問い合わせ", "subtitle": "質問、パートナーシップ、バグ？ご連絡ください。48時間以内に回答します。",
    "name": "名前", "email": "メールアドレス", "subject": "件名", "message": "メッセージ",
    "namePlaceholder": "あなたの名前", "emailPlaceholder": "あなた@メール.com",
    "subjectPlaceholder": "例：機関パートナーシップ、バグ報告...", "messagePlaceholder": "リクエストを説明してください...",
    "submit": "メッセージを送信 ->", "sending": "送信中...", "successTitle": "メッセージが送信されました！", "successMsg": "まもなくご連絡いたします。",
    "sendAnother": "別のメッセージを送る", "errorMsg": "エラーが発生しました。もう一度お試しください。",
    "channelEmail": "メール", "channelForum": "フォーラム", "channelAI": "ALDEA", "channelForumVal": "コミュニティ", "channelAIVal": "AIチャット"
  },
  "requests": {
    "label": "コミュニティのニーズ", "title": "現在のリクエスト", "subtitle": "メンバーがあなたを必要としていますか？助けを提供してクレジットを獲得しましょう。",
    "searchPlaceholder": "リクエストを検索...", "noResults": "リクエストはまだありません",
    "today": "今日", "yesterday": "昨日", "daysAgo": "{days}日前",
    "member": "メンバー", "reply": "返信", "credit": "クレジット", "credits": "クレジット"
  },
  "dashboard": {
    "loginRequired": "ログインが必要です", "loginDesc": "個人スペースにアクセス", "login": "ログイン",
    "greeting": "こんにちは、{name}", "subtitle": "あなたの個人スペース", "myProfile": "マイプロフィール ->",
    "statCredits": "クレジット", "statServices": "サービス", "statExchanges": "交換", "statEarned": "獲得クレジット",
    "reviewsBanner": "{count}件の保留中レビュー", "reviewsDesc": "最近の交換後に体験を共有してください",
    "rateUser": "{name}を評価", "leaveReview": "レビューを残す ->",
    "creditHistory": "クレジット履歴", "earned": "獲得", "spent": "使用",
    "myServices": "マイサービス", "viewAll": "すべて見る ->", "noServices": "まだサービスを投稿していません。",
    "exchange": "交換",
    "shortcuts": { "services": "サービスを探す", "requests": "リクエストを見る", "members": "メンバーを探す", "workshops": "集団ワークショップ", "projects": "協働プロジェクト", "search": "AI検索" }
  },
  "members": {
    "label": "私たちのコミュニティ", "title": "メンバー", "subtitle": "{count}人が時間を交換する準備ができています。",
    "searchPlaceholder": "名前、スキル、都市で検索...", "noResults": "メンバーが見つかりません",
    "verified": "認証済み", "member": "メンバー"
  },
  "forum": {
    "title": "交換フォーラム", "newTopic": "新しいトピック", "editTopic": "トピックを編集", "startDiscussion": "ディスカッションを始める",
    "titlePlaceholder": "トピックのタイトル", "messagePlaceholder": "あなたのメッセージ...", "externalLinkPlaceholder": "外部リンク（任意）",
    "uploading": "アップロード中...", "fileReady": "ファイルの準備完了", "importMedia": "写真/動画をインポート",
    "removeMedia": "削除", "update": "更新", "publish": "投稿", "cancel": "キャンセル",
    "externalLink": "外部リンク", "by": "投稿者", "commentPlaceholder": "コメント...", "send": "送信",
    "empty": "まだディスカッションはありません。最初になりましょう！", "loginRequired": "参加するにはログインしてください", "confirmDelete": "このトピックを完全に削除しますか？"
  }
'@

$patches["ko"] = @'
,
  "about": {
    "label": "우리의 철학", "titleLine1": "상호 지원을 재발명하다", "titleLine2": "시간을 통해",
    "subtitle": "Bourse du Temps：1시간 제공 = 1시간 수령 - 돈 없이, 계층 없이, 모든 사람에게 열려 있습니다.",
    "mission": { "label": "우리의 사명", "text": "모든 사람이 재정적 장벽 없이 자신의 기술을 발휘할 수 있는 교환 생태계를 만듭니다." },
    "vision": { "label": "우리의 비전", "text": "기술을 통한 가장 큰 상호 지원 커뮤니티를 구축하고 전 세계 사람들 사이의 연결을 촉진합니다." },
    "values": {
      "label": "우리를 이끄는 것", "title": "우리의 가치", "subtitle": "우리가 내리는 모든 결정을 정의하는 여섯 가지 기본 원칙.",
      "equality":     { "title": "시간 평등",     "desc": "1시간 제공 = 1시간 수령. 모든 시간은 동일한 가치를 가집니다." },
      "trust":        { "title": "상호 신뢰",     "desc": "모든 교환은 약속의 말에 기반합니다. 명성은 행동으로 쌓입니다." },
      "inclusion":    { "title": "포용과 다양성", "desc": "조건 없이 모든 사람에게 열려 있습니다. 프로필의 다양성이 우리의 가장 큰 자산입니다." },
      "solidarity":   { "title": "연대",          "desc": "가장 회복력 있는 커뮤니티는 서로 돕는 커뮤니티입니다." },
      "economy":      { "title": "비화폐 경제",   "desc": "돈이 아닌 시간. 모든 사람이 접근할 수 있는 시장 경제의 대안." },
      "transparency": { "title": "투명성",        "desc": "비영리 플랫폼. 모든 교환이 추적되고 모든 크레딧이 보입니다." }
    },
    "howItWorks": {
      "label": "간단하고 구체적", "title": "어떻게 작동하나요?",
      "step1": { "title": "가입하기",            "desc": "기술과 필요사항을 기재하여 프로필을 만드세요. 5 웰컴 크레딧을 받으세요." },
      "step2": { "title": "제공하고 교환하기",   "desc": "서비스나 요청을 게시하세요. 멤버에게 연락하고 첫 번째 교환을 완료하세요." },
      "step3": { "title": "명성 쌓기",           "desc": "각 교환 후 증언을 남기세요. 배지를 모으고 레벨을 올리세요." },
      "step4": { "title": "프로젝트에 참여하기", "desc": "집단 워크숍과 협력 프로젝트에 참여하여 함께 더 멀리 나아가세요." }
    },
    "cta": { "title": "커뮤니티에 참여할 준비가 되셨나요？", "subtitle": "수천 가지 기술이 당신을 기다리고 있습니다.", "btn": "서비스 탐색 ->" }
  },
  "contact": {
    "label": "여기 있습니다", "title": "문의하기", "subtitle": "질문, 파트너십, 버그? 저희에게 연락하세요. 48시간 내에 답변 드립니다.",
    "name": "이름", "email": "이메일", "subject": "제목", "message": "메시지",
    "namePlaceholder": "이름", "emailPlaceholder": "이메일@주소.com",
    "subjectPlaceholder": "예: 기관 파트너십, 버그 신고...", "messagePlaceholder": "요청사항을 설명하세요...",
    "submit": "메시지 보내기 ->", "sending": "전송 중...", "successTitle": "메시지가 전송되었습니다!", "successMsg": "곧 연락 드리겠습니다.",
    "sendAnother": "다른 메시지 보내기", "errorMsg": "오류가 발생했습니다. 다시 시도하세요.",
    "channelEmail": "이메일", "channelForum": "포럼", "channelAI": "ALDEA", "channelForumVal": "커뮤니티", "channelAIVal": "AI 채팅"
  },
  "requests": {
    "label": "커뮤니티 필요", "title": "현재 요청", "subtitle": "회원이 당신을 필요로 하나요? 도움을 제공하고 크레딧을 획득하세요.",
    "searchPlaceholder": "요청 검색...", "noResults": "아직 요청이 없습니다",
    "today": "오늘", "yesterday": "어제", "daysAgo": "{days}일 전",
    "member": "회원", "reply": "답변", "credit": "크레딧", "credits": "크레딧"
  },
  "dashboard": {
    "loginRequired": "로그인이 필요합니다", "loginDesc": "개인 공간에 접근", "login": "로그인",
    "greeting": "안녕하세요, {name}", "subtitle": "개인 공간", "myProfile": "내 프로필 ->",
    "statCredits": "크레딧", "statServices": "서비스", "statExchanges": "교환", "statEarned": "획득 크레딧",
    "reviewsBanner": "{count}개의 대기 중인 리뷰", "reviewsDesc": "최근 교환 후 경험을 공유하세요",
    "rateUser": "{name} 평가하기", "leaveReview": "리뷰 남기기 ->",
    "creditHistory": "크레딧 내역", "earned": "획득", "spent": "사용",
    "myServices": "내 서비스", "viewAll": "전체 보기 ->", "noServices": "아직 서비스를 게시하지 않았습니다.",
    "exchange": "교환",
    "shortcuts": { "services": "서비스 탐색", "requests": "요청 보기", "members": "회원 찾기", "workshops": "집단 워크숍", "projects": "협력 프로젝트", "search": "AI 검색" }
  },
  "members": {
    "label": "우리 커뮤니티", "title": "회원", "subtitle": "{count}명이 시간을 교환할 준비가 되어 있습니다.",
    "searchPlaceholder": "이름, 기술, 도시로 검색...", "noResults": "회원을 찾을 수 없습니다",
    "verified": "인증됨", "member": "회원"
  },
  "forum": {
    "title": "교환 포럼", "newTopic": "새 주제", "editTopic": "주제 편집", "startDiscussion": "토론 시작",
    "titlePlaceholder": "주제 제목", "messagePlaceholder": "메시지...", "externalLinkPlaceholder": "외부 링크 (선택사항)",
    "uploading": "업로드 중...", "fileReady": "파일 준비 완료", "importMedia": "사진/영상 가져오기",
    "removeMedia": "제거", "update": "업데이트", "publish": "게시", "cancel": "취소",
    "externalLink": "외부 링크", "by": "작성자", "commentPlaceholder": "댓글...", "send": "전송",
    "empty": "아직 토론이 없습니다. 첫 번째가 되세요!", "loginRequired": "참여하려면 로그인하세요", "confirmDelete": "이 주제를 영구적으로 삭제하시겠습니까？"
  }
'@

$patches["hi"] = @'
,
  "about": {
    "label": "हमारा दर्शन", "titleLine1": "पारस्परिक सहायता को पुनः परिभाषित करना", "titleLine2": "समय के माध्यम से",
    "subtitle": "Bourse du Temps: 1 घंटा दिया = 1 घंटा प्राप्त - बिना पैसे के, बिना पदानुक्रम के, सभी के लिए खुला।",
    "mission": { "label": "हमारा मिशन", "text": "एक ऐसा विनिमय पारिस्थितिकी तंत्र बनाना जहाँ हर व्यक्ति वित्तीय बाधाओं के बिना अपने कौशल का मूल्य निर्धारित कर सके।" },
    "vision": { "label": "हमारी दृष्टि", "text": "कौशल के माध्यम से पारस्परिक सहायता का सबसे बड़ा समुदाय बनाना, दुनिया भर में लोगों के बीच संबंधों को बढ़ावा देना।" },
    "values": {
      "label": "जो हमें मार्गदर्शन करता है", "title": "हमारे मूल्य", "subtitle": "छह मूलभूत सिद्धांत जो हमारे हर निर्णय को परिभाषित करते हैं।",
      "equality":     { "title": "समय की समानता",    "desc": "1 घंटा दिया = 1 घंटा प्राप्त। हर घंटे का समान मूल्य है।" },
      "trust":        { "title": "आपसी विश्वास",     "desc": "हर विनिमय दिए गए वचन पर आधारित है। प्रतिष्ठा कार्यों से बनती है।" },
      "inclusion":    { "title": "समावेश और विविधता","desc": "बिना किसी शर्त के सभी के लिए खुला। प्रोफ़ाइल की विविधता हमारी सबसे बड़ी संपदा है।" },
      "solidarity":   { "title": "एकजुटता",          "desc": "सबसे लचीले समुदाय वे हैं जो एक-दूसरे की मदद करते हैं।" },
      "economy":      { "title": "गैर-मौद्रिक अर्थव्यवस्था","desc": "पैसा नहीं, समय। सभी के लिए सुलभ बाजार अर्थव्यवस्था का एक विकल्प।" },
      "transparency": { "title": "पारदर्शिता",       "desc": "गैर-लाभकारी मंच। हर विनिमय ट्रैक किया जाता है, हर क्रेडिट दिखाई देता है।" }
    },
    "howItWorks": {
      "label": "सरल और ठोस", "title": "यह कैसे काम करता है?",
      "step1": { "title": "साइन अप करें",             "desc": "अपने कौशल और जरूरतों के साथ प्रोफ़ाइल बनाएं। 5 स्वागत क्रेडिट प्राप्त करें।" },
      "step2": { "title": "प्रस्ताव दें और विनिमय करें","desc": "कोई सेवा या अनुरोध पोस्ट करें। सदस्यों से संपर्क करें और पहला विनिमय पूरा करें।" },
      "step3": { "title": "अपनी प्रतिष्ठा बनाएं",   "desc": "हर विनिमय के बाद एक प्रशंसापत्र छोड़ें। बैज जमा करें और स्तर बढ़ाएं।" },
      "step4": { "title": "परियोजनाओं में शामिल हों","desc": "सामूहिक कार्यशालाओं और सहयोगी परियोजनाओं में भाग लें।" }
    },
    "cta": { "title": "समुदाय में शामिल होने के लिए तैयार हैं?", "subtitle": "हजारों कौशल आपका इंतजार कर रहे हैं।", "btn": "सेवाएं खोजें ->" }
  },
  "contact": {
    "label": "हम यहाँ हैं", "title": "संपर्क करें", "subtitle": "कोई सवाल, साझेदारी, बग? हमें लिखें, हम 48 घंटों में जवाब देते हैं।",
    "name": "नाम", "email": "ईमेल", "subject": "विषय", "message": "संदेश",
    "namePlaceholder": "आपका नाम", "emailPlaceholder": "आपका@ईमेल.com",
    "subjectPlaceholder": "उदा.: संस्थागत साझेदारी, बग रिपोर्ट...", "messagePlaceholder": "अपना अनुरोध बताएं...",
    "submit": "संदेश भेजें ->", "sending": "भेजा जा रहा है...", "successTitle": "संदेश भेजा गया!", "successMsg": "हम जल्द ही आपसे संपर्क करेंगे।",
    "sendAnother": "एक और संदेश भेजें", "errorMsg": "एक त्रुटि हुई। कृपया पुनः प्रयास करें।",
    "channelEmail": "ईमेल", "channelForum": "फोरम", "channelAI": "ALDEA", "channelForumVal": "समुदाय", "channelAIVal": "AI चैट"
  },
  "requests": {
    "label": "समुदाय की जरूरतें", "title": "वर्तमान अनुरोध", "subtitle": "किसी सदस्य को आपकी जरूरत है? सहायता प्रदान करें और क्रेडिट कमाएं।",
    "searchPlaceholder": "अनुरोध खोजें...", "noResults": "अभी कोई अनुरोध नहीं",
    "today": "आज", "yesterday": "कल", "daysAgo": "{days} दिन पहले",
    "member": "सदस्य", "reply": "जवाब दें", "credit": "क्रेडिट", "credits": "क्रेडिट"
  },
  "dashboard": {
    "loginRequired": "लॉगिन आवश्यक है", "loginDesc": "अपने व्यक्तिगत स्थान तक पहुँचें", "login": "लॉगिन करें",
    "greeting": "नमस्ते, {name}", "subtitle": "आपका व्यक्तिगत स्थान", "myProfile": "मेरी प्रोफ़ाइल ->",
    "statCredits": "क्रेडिट", "statServices": "सेवाएं", "statExchanges": "विनिमय", "statEarned": "कमाए गए क्रेडिट",
    "reviewsBanner": "{count} लंबित समीक्षा", "reviewsDesc": "अपने हालिया विनिमय के बाद अनुभव साझा करें",
    "rateUser": "{name} को रेट करें", "leaveReview": "समीक्षा छोड़ें ->",
    "creditHistory": "क्रेडिट इतिहास", "earned": "कमाए", "spent": "खर्च किए",
    "myServices": "मेरी सेवाएं", "viewAll": "सभी देखें ->", "noServices": "आपने अभी तक कोई सेवा पोस्ट नहीं की है।",
    "exchange": "विनिमय",
    "shortcuts": { "services": "सेवाएं खोजें", "requests": "अनुरोध देखें", "members": "सदस्य खोजें", "workshops": "सामूहिक कार्यशालाएं", "projects": "सहयोगी परियोजनाएं", "search": "AI खोज" }
  },
  "members": {
    "label": "हमारा समुदाय", "title": "सदस्य", "subtitle": "{count} व्यक्ति अपना समय विनिमय करने के लिए तैयार हैं।",
    "searchPlaceholder": "नाम, कौशल, शहर से खोजें...", "noResults": "कोई सदस्य नहीं मिला",
    "verified": "सत्यापित", "member": "सदस्य"
  },
  "forum": {
    "title": "विनिमय फोरम", "newTopic": "नया विषय", "editTopic": "विषय संपादित करें", "startDiscussion": "चर्चा शुरू करें",
    "titlePlaceholder": "विषय का शीर्षक", "messagePlaceholder": "आपका संदेश...", "externalLinkPlaceholder": "बाहरी लिंक (वैकल्पिक)",
    "uploading": "अपलोड हो रहा है...", "fileReady": "फ़ाइल तैयार है", "importMedia": "फोटो/वीडियो आयात करें",
    "removeMedia": "हटाएं", "update": "अपडेट करें", "publish": "प्रकाशित करें", "cancel": "रद्द करें",
    "externalLink": "बाहरी लिंक", "by": "द्वारा", "commentPlaceholder": "टिप्पणी करें...", "send": "भेजें",
    "empty": "अभी कोई चर्चा नहीं। पहले बनें!", "loginRequired": "भाग लेने के लिए लॉगिन करें", "confirmDelete": "इस विषय को स्थायी रूप से हटाएं?"
  }
'@

# ── Apply all patches ─────────────────────────────────────────────────────────
$count = 0
foreach ($lang in $patches.Keys) {
    $file = "messages\$lang.json"
    if (!(Test-Path $file)) { Write-Host "SKIP $lang - not found"; continue }
    $content = [System.IO.File]::ReadAllText((Resolve-Path $file).Path, [System.Text.Encoding]::UTF8)
    $content = $content.TrimEnd()
    $lastBrace = $content.LastIndexOf('}')
    $content = $content.Substring(0, $lastBrace).TrimEnd().TrimEnd(',')
    $content += $patches[$lang]
    $content += "`n}"
    [System.IO.File]::WriteAllText((Resolve-Path $file).Path, $content, [System.Text.Encoding]::UTF8)
    Write-Host "OK: $lang"
    $count++
}
Write-Host ""
Write-Host "Done! $count language files patched."
