// =====================================================================
//  CONFIGURATION DU QUIZ : c'est le seul fichier à modifier.
//  Mets tes images / musiques dans le dossier "assets" et
//  référence-les ici avec un chemin relatif, ex. "assets/photo.jpg".
// =====================================================================

window.QUIZ_CONFIG = {
  // Image de fond de toute l'app ("" = fond militaire par défaut)
  backgroundImage: "assets/bg.png",

  // Musique de fond en boucle pendant tout le jeu ("" = aucune).
  // Remplacée par l'alarme sur l'écran final.
  backgroundMusic: "assets/musique.mp3",
  musicVolume: 0.4, // de 0 (muet) à 1 (plein volume)

  // Effets sonores ("" = aucun)
  sounds: {
    gunshot: "assets/sfx/tir.mp3",           // à chaque tap sur l'écran
    selecting: "assets/sfx/selection.mp3",   // pendant le tirage au sort (~4 s,
                                             // coupé dès que l'agent est trouvé)
    found: "assets/sfx/agent-trouve.mp3",    // agent désigné
    correct: "assets/sfx/bonne-reponse.mp3", // bonne réponse
    wrong: "assets/sfx/mauvaise-reponse.mp3", // mauvaise réponse
    fail: "assets/sfx/echec.mp3",            // écran "mission échouée"
                                             // (la musique de fond est coupée)
    volume: 0.8,
  },

  // Secondes par question
  timerSeconds: 15,

  // Mélanger l'ordre des réponses ? (false = ordre tel qu'écrit)
  shuffleAnswers: false,

  // ---------------------------------------------------------------
  //  BRIEFING : dossier classifié affiché avant le tirage au sort.
  //  photo : "preuve de vie" = la photo de toi avec l'otage
  //  lines : texte tapé à la machine, une ligne par élément
  // ---------------------------------------------------------------
  briefing: {
    photo: "assets/preuve-de-vie.jpg",
    caption: "Preuve de vie · il y a 2 heures",
    lines: [
      "RAPPORT N° 0417 · NIVEAU D'ACCRÉDITATION : OMEGA",
      "",
      "==== LIRE CE TEXTE A VOIX HAUTE ====",
      "Ce soir, un otage a été enlevé.",
      "Les ravisseurs n'accepteront qu'une seule chose :",
      "10 bonnes réponses. Aucune erreur tolérée.",
      "",
      "Un agent va être désigné parmi vous.",
      "Le sort de l'otage est entre ses mains.",
    ],
  },

  // ---------------------------------------------------------------
  //  PARTICIPANTS
  //  role : "player"    -> peut être tiré au sort normalement
  //         "host"      -> (toi) tiré UNIQUEMENT s'il ne reste personne
  //         "protected" -> (ta femme) jamais tirée
  // ---------------------------------------------------------------
  participants: [
    { name: "Ercan",   photo: "assets/people/Ercan.jpg",   role: "player" },
    { name: "Paul",     photo: "assets/people/Paul.jpg",     role: "player" },
    { name: "Dilara", photo: "assets/people/Dilara.jpg", role: "player" },
    { name: "Mathilde", photo: "assets/people/Mathilde.jpg", role: "player" },
    { name: "Manu", photo: "assets/people/Manu.jpg", role: "player" },
    { name: "Sabine", photo: "assets/people/Sabine.jpg", role: "player" },
    { name: "Tharsan", photo: "assets/people/Tharsan.jpg", role: "player" },
    { name: "Sugitha", photo: "assets/people/Sugitha.jpg", role: "player" },
    { name: "Annas",     photo: "assets/people/Annas.jpg",     role: "host" },
    { name: "Imène", photo: "assets/people/Imene.jpg",  role: "protected" },
  ],

  // ---------------------------------------------------------------
  //  QUESTIONS (10, mais n'importe quel nombre fonctionne)
  //  - image   : image d'appui facultative pour la question
  //  - answers : chaque réponse a un "text" et éventuellement une "image"
  //  - correct : numéro de la bonne réponse (0 = la première)
  // ---------------------------------------------------------------
  questions: [
    {
      question: "Quelle est la capitale de la France ?",
      image: "",
      answers: [
        { text: "Paris" },
        { text: "Lyon" },
        { text: "Marseille" },
        { text: "Bordeaux" },
      ],
      correct: 0,
    },
    {
      question: "Lequel de ces animaux est un chat ?",
      image: "",
      answers: [
        { text: "Celui-ci", image: "assets/questions/chat.jpg" },
        { text: "Celui-là", image: "assets/questions/chien.jpg" },
      ],
      correct: 0,
    },
    // ... ajoute jusqu'à 10 questions (ou plus)
  ],

  // ---------------------------------------------------------------
  //  RECHERCHE DE L'OBJET (après les 10 bonnes réponses)
  //  image : photo de l'objet caché dans la maison
  //  code  : code secret caché dans l'objet (majuscules/minuscules
  //          et espaces ignorés). Que des chiffres = clavier numérique.
  //  seconds : compte à rebours pour trouver le code (300 = 5 min).
  //            À zéro, "Temps dépassé" s'affiche mais le code reste
  //            accepté, pour ne jamais bloquer la suite.
  //  victoryDelaySeconds : le bouton "Poursuivre la mission" reste
  //            bloqué ce temps-là, pour qu'on lise les instructions.
  // ---------------------------------------------------------------
  hunt: {
    image: "assets/objet.jpg",
    code: "1234",
    seconds: 300,
    victoryDelaySeconds: 6,
  },

  // ---------------------------------------------------------------
  //  RÉVÉLATION DU SUSPECT (après le bon code)
  //  Le suspect est le participant "protected" : seule sa photo est
  //  affichée, son nom n'apparaît jamais.
  //  music : son d'alarme / musique en boucle, "" pour aucun
  // ---------------------------------------------------------------
  suspect: {
    music: "assets/alerte.mp3",
  },

  // ---------------------------------------------------------------
  //  TEXTES : modifie-les librement
  //  {name}, {seconds}, {n}, {total}, {list}, {host}
  //  sont remplacés automatiquement
  // ---------------------------------------------------------------
  texts: {
    appTitle: "Opération Otage",
    tagline: "Un otage. Dix questions. Aucune seconde chance.",
    fileNumber: "DOSSIER N° 0417",
    classifiedStamp: "Classifié",
    startButton: "Ouvrir le dossier",
    briefingButton: "Désigner l'agent",
    pickingTitle: "Désignation de l'agent…",
    chosenIntro: "Cible verrouillée",
    orderTitle: "Ordre de mission - LIRE A VOIX HAUTE",
    assignment:
      "Agent {name}, la vie de l'otage est entre tes mains.\n" +
      "Tu dois lire chaque question À VOIX HAUTE et y répondre seul(e).\n" +
      "Tous les autres : il vous est INTERDIT de souffler la réponse.\n" +
      "Une seule erreur, et c'est fini. Tu as {seconds} secondes par question.",
    readyButton: "Mission acceptée",
    questionLabel: "Question {n} / {total}",
    timeUp: "Temps écoulé !",
    wrongAnswer: "Mauvaise réponse…",
    gameOverTitle: "Mission échouée",
    gameOverText: "Personne ne sait ce qu'est devenu l'otage…",
    rewindButton: "⟲ Remonter le temps",
    victoryStamp: "Mission accomplie",
    victoryTitle: "Otage libéré !",
    victoryText:
      "Bravo, agent. L'otage est sain et sauf…\n" +
      "Mais la mission n'est pas terminée : le commanditaire court toujours.",
    continueButton: "Poursuivre la mission",
    huntStamp: "Nouvel objectif",
    huntTitle: "Retrouvez cet objet",
    huntText:
      "Cet objet est caché quelque part dans la maison. " +
      "Il contient un code secret. Trouvez-le et saisissez-le ci-dessous.",
    codeButton: "Valider le code",
    codeWrong: "Code invalide",
    huntTimeUp: "Temps dépassé ! Le suspect s'éloigne…",
    alertBar: "⚠ Alerte · Suspect identifié",
    suspectStamp: "Recherchée",
    suspectIdentity: "Identité :",
    suspectHead: "Rapport d'enquête · Priorité absolue",
    suspectText:
      "Le commanditaire de l'enlèvement a été identifié.\n" +
      "Elle tente en ce moment même de quitter les lieux avec des documents " +
      "hautement classifiés et extrêmement sensibles.\n" +
      "Retrouvez-la et arrêtez-la. Suivez les ordres de l'agent {host}.",
    backToStart: "Retour au début",
    alreadyPlayed: "Agents tombés au combat : {list}",
    resetHistory: "Réinitialiser",
  },
};
