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
  timerSeconds: 20,

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
      "Que des bonnes réponses. Aucune erreur tolérée.",
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
      question: "Ou est allé Mokobe ?",
      image: "",
      answers: [
        { text: "Au barber shop" },
        { text: "A l'Opéra" },
        { text: "En concert avec le 113" },
        { text: "A Bordeaux" },
      ],
      correct: 1,
    },
    {
      question: "Qu'est ce qu'ils mangent les bébés ?",
      image: "",
      answers: [
        { text: "Du Lait" },
        { text: "Des Biscuits" },
        { text: "Des Boudoirs" },
        { text: "Du Yogourre™" },
      ],
      correct: 3,
    },
    {
      question: "Que signifie le sigle 3G™?",
      image: "",
      answers: [
        { text: "Grand Gorille Gainé" },
        { text: "Gay Gogole Gitan" },
        { text: "Gros Gourdin de Gueulard" },
        { text: "C'est un truc de téléphones" },
      ],
      correct: 1,
    },
    {
      question: "Qui est la fille de la grand-mère du frère de ce chat ?",
      image: "assets/spooky.png",
      answers: [
        { text: "Mimi" },
        { text: "Mocha" },
        { text: "Bulle" },
        { text: "Gluten" },
      ],
      correct: 2,
    },
    {
      question: "Qui a horreur de cet objet ?",
      image: "assets/liquidevaisselle.jpg",
      answers: [
        { text: "Lui", image: "assets/people/Ercan.jpg" },
        { text: "Elle de fou", image: "assets/people/Mathilde.jpg" },
        { text: "totalement lui", image: "assets/people/Annas.jpg" },
        { text: "C'est forcément lui", image: "assets/people/Manu.jpg" },
      ],
      correct: 0,
    },
    {
      question: "Trouvez le nom de cet animal",
      image: "assets/cafard.jpg",
      answers: [
        { text: "Super Cafard" },
        { text: "El chiquito cafardito" },
        { text: "Cafard Bolt" },
        { text: "Tuco Cafaranca" },
      ],
      correct: 2,
    },
    {
      question: "Quel est le métier de cet homme ?",
      image: "assets/merlouf.jpg",
      answers: [
        { text: "Bouzelouf" },
        { text: "Merlouf" },
        { text: "Pignouf" },
        { text: "Piffe-pouf" },
      ],
      correct: 1,
    },
    {
      question: "Ou habite-t'il ?",
      image: "assets/merlouf.jpg",
      answers: [
        { text: "A Casablanca" },
        { text: "A Mexico DC" },
        { text: "A Albufeira" },
        { text: "A Châtelet-les-Halles" },
      ],
      correct: 3,
    },
    {
      question: "Quelle innovation très audacieuse, le chef étoilé Tharsan Thilagathas, a-t'il apporté ?",
      image: "assets/chef.jpg",
      answers: [
        { text: "Oser enfermer un liquide dans une fine pellicule d'alginate qui éclate en bouche" },
        { text: "Transformer prodigieusement le chocolat en chantilly au niveau moléculaire" },
        { text: "Avoir eu l'audace d'experimenter de folles fermentations" },
        { text: "Faire revenir des oignons avant de cuire l'omelette" },
      ],
      correct: 3,
    },
    {
      question: "Trouvez la bonne orthographe",
      answers: [
        { text: "Arshem Shake" },
        { text: "Harlem Shake" },
        { text: "Harlem Cheikh" },
        { text: "Art l'aime chèque" },
      ],
      correct: 0,
    },
    {
      question: "La prochaine question est très importante. Êtes-vous prêt ?",
      image: "",
      answers: [
        { text: "Je suis entièrement prêt" },
        { text: "Je commence à trembler" },
        { text: "Donnez moi une pause" },
        { text: "J'ai peur" },
      ],
      correct: 0,
    },
    {
      question: "Samiam ?",
      image: "",
      answers: [
        { text: "Demain" },
        { text: "Non" },
        { text: "Je mange au Quick" },
        { text: "Oui" },
      ],
      correct: 3,
    } 
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
    code: "0427",
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
      "Tous les autres : il vous est INTERDIT de souffler la réponse. \nNe trichez pas, les ravisseurs le sauront.\n" +
      "Une seule erreur, et c'est fini. Tu as {seconds} secondes par question. Le temps est compté !",
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
