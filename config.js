// =====================================================================
//  QUIZ CONFIGURATION: this is the only file you need to edit.
//  Put your images / videos / music in the "assets" folder and
//  reference them here with a relative path like "assets/photo.jpg".
// =====================================================================

window.QUIZ_CONFIG = {
  // Background image for the whole app (leave "" for a dark default)
  backgroundImage: "assets/background.jpg",

  // Intro video that raises the stakes (mp4 recommended for phones)
  introVideo: "assets/intro.mp4",

  // Seconds allowed per question
  timerSeconds: 10,

  // Shuffle answer order on each question? (false = order as written)
  shuffleAnswers: false,

  // ---------------------------------------------------------------
  //  PARTICIPANTS
  //  role: "player"    -> can be picked normally
  //        "host"      -> (you) picked ONLY when nobody else is left
  //        "protected" -> (your wife) never picked
  // ---------------------------------------------------------------
  participants: [
    { name: "Alice",   photo: "assets/people/alice.jpg", role: "player" },
    { name: "Bob",     photo: "assets/people/bob.jpg",   role: "player" },
    { name: "Charlie", photo: "assets/people/charlie.jpg", role: "player" },
    { name: "Me",      photo: "assets/people/me.jpg",    role: "host" },
    { name: "My wife", photo: "assets/people/wife.jpg",  role: "protected" },
  ],

  // ---------------------------------------------------------------
  //  QUESTIONS (10 of them, but any number works)
  //  - image:   optional supporting image for the question
  //  - answers: each has a "text", and optionally an "image"
  //  - correct: index of the right answer (0 = first answer)
  // ---------------------------------------------------------------
  questions: [
    {
      question: "What is the capital of France?",
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
      question: "Which one of these is a cat?",
      image: "",
      answers: [
        { text: "This one", image: "assets/questions/cat.jpg" },
        { text: "That one", image: "assets/questions/dog.jpg" },
      ],
      correct: 0,
    },
    // ... add up to 10 (or more)
  ],

  // ---------------------------------------------------------------
  //  SECRET ANNOUNCEMENT (shown after all questions are right)
  // ---------------------------------------------------------------
  secret: {
    title: "WE HAVE BIG NEWS!",
    image: "assets/secret.jpg",
    music: "assets/secret.mp3",
  },

  // ---------------------------------------------------------------
  //  TEXTS: translate / rewrite freely
  // ---------------------------------------------------------------
  texts: {
    appTitle: "OPERATION HOSTAGE",
    startButton: "Start the mission",
    skipVideo: "Skip ▸",
    pickingTitle: "Choosing the agent…",
    chosenIntro: "The chosen agent is…",
    // {name} is replaced by the chosen participant's name
    assignment:
      "{name}, the hostage's life is in your hands. " +
      "You must read every question OUT LOUD and answer it yourself. " +
      "Everyone else: you are FORBIDDEN to give the answer. " +
      "One wrong answer, and it's over. You have {seconds} seconds per question.",
    readyButton: "I'm ready",
    questionLabel: "Question {n} / {total}",
    timeUp: "Time's up!",
    wrongAnswer: "Wrong answer…",
    gameOverTitle: "GAME OVER",
    gameOverText: "Nobody knows what happened to the hostage…",
    rewindButton: "⟲ Rewind time",
    victoryTitle: "HOSTAGE FREED!",
    victoryText: "You did it. And the hostage has something to tell you…",
    revealButton: "Discover the secret",
    backToStart: "Back to the beginning",
    alreadyPlayed: "Already played: {list}",
    resetHistory: "Reset",
  },
};
