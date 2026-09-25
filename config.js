// =====================================================================
//  CONFIGURATION DU QUIZ : c'est le seul fichier à modifier.
//  Mets tes images / vidéos / musiques dans le dossier "assets" et
//  référence-les ici avec un chemin relatif, ex. "assets/photo.jpg".
// =====================================================================

window.QUIZ_CONFIG = {
  // Image de fond de toute l'app ("" = fond militaire par défaut)
  backgroundImage: "assets/bg.png",

  // Vidéo d'intro : toi avec l'otage (mp4 conseillé pour les téléphones).
  // "" = pas de vidéo, on passe directement au tirage au sort.
  introVideo: "assets/intro.mp4",

  // Secondes par question
  timerSeconds: 15,

  // Mélanger l'ordre des réponses ? (false = ordre tel qu'écrit)
  shuffleAnswers: false,

  // ---------------------------------------------------------------
  //  BRIEFING : dossier classifié affiché avant la vidéo.
  //  photo : "preuve de vie" (ex. toi avec l'otage), "" pour aucune
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
    { name: "Alice",   photo: "assets/people/alice.jpg",   role: "player" },
    { name: "Bob",     photo: "assets/people/bob.jpg",     role: "player" },
    { name: "Charlie", photo: "assets/people/charlie.jpg", role: "player" },
    { name: "Moi",     photo: "assets/people/moi.jpg",     role: "host" },
    { name: "Ma femme", photo: "assets/people/femme.jpg",  role: "protected" },
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
  //  ANNONCE SECRÈTE (après 10 bonnes réponses)
  // ---------------------------------------------------------------
  secret: {
    title: "ON A UNE GRANDE NOUVELLE !",
    image: "assets/secret.jpg",
    music: "assets/secret.mp3",
  },

  // ---------------------------------------------------------------
  //  TEXTES : modifie-les librement
  //  {name}, {seconds}, {n}, {total}, {list} sont remplacés automatiquement
  // ---------------------------------------------------------------
  texts: {
    appTitle: "Opération Otage",
    tagline: "Un otage. Dix questions. Aucune seconde chance.",
    fileNumber: "DOSSIER N° 0417",
    classifiedStamp: "Classifié",
    startButton: "Ouvrir le dossier",
    briefingButton: "Intercepter la transmission",
    videoTag: "● TRANSMISSION INTERCEPTÉE",
    skipVideo: "Passer ▸",
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
    victoryText: "Bravo, agent. Et l'otage a quelque chose à vous dire…",
    revealButton: "Découvrir le secret",
    declassifiedStamp: "Déclassifié",
    backToStart: "Retour au début",
    alreadyPlayed: "Agents tombés au combat : {list}",
    resetHistory: "Réinitialiser",
  },
};
