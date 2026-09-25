# Opération Otage 🎖️

Petite application de quiz pour téléphone. C'est un site statique, sans étape de build ni code serveur.

## Déroulé

Accueil → briefing (dossier classifié + photo « preuve de vie ») → vidéo d'intro → tirage au sort de l'agent → ordre de mission → 10 questions chronométrées → échec (« Remonter le temps ») ou victoire → annonce secrète.

## Personnaliser

Tout se modifie dans **`config.js`** :

- `participants` : nom, photo, rôle
  - `"player"` : peut être tiré au sort
  - `"host"` : toi. Tu n'es tiré que si tous les joueurs ont déjà joué.
  - `"protected"` : ta femme. Jamais tirée.
- `briefing` : la photo « preuve de vie », sa légende et le texte tapé à la machine
- `questions` : le texte, une `image` facultative, et les `answers` (chacune avec un `text` et éventuellement une `image`). `correct` est le numéro de la bonne réponse, 0 étant la première.
- `backgroundImage`, `introVideo`, `timerSeconds`
- `secret` : titre, image et musique de l'annonce finale
- `texts` : toutes les phrases affichées dans l'app

Mets tes fichiers dans `assets/`. Utilise du `.mp4` (H.264) pour la vidéo et du `.mp3` pour la musique, pour que ça marche sur iPhone et Android.

Fichiers attendus par défaut :

| Fichier | Rôle |
|---|---|
| `assets/fond.jpg` | Image de fond |
| `assets/preuve-de-vie.jpg` | Photo du briefing (toi avec l'otage) |
| `assets/intro.mp4` | Vidéo d'intro (toi avec l'otage) |
| `assets/people/*.jpg` | Photos des participants |
| `assets/questions/*.jpg` | Images des questions / réponses |
| `assets/secret.jpg`, `assets/secret.mp3` | Annonce secrète |

Un fichier manquant ne bloque rien : pas de vidéo → on passe au tirage, pas de photo → initiale du prénom.

## Tester en local

Ouvre `index.html` dans un navigateur, ou lance `npx serve .` et ouvre l'URL affichée.

## Héberger (gratuit)

- **Netlify Drop** : va sur https://app.netlify.com/drop et glisse tout le dossier `hostage-quiz`. Tu obtiens une URL tout de suite.
- **GitHub Pages** : pousse le dossier sur un dépôt, puis active Pages dans Settings → Pages.

## Notes

- La liste des agents déjà envoyés est enregistrée sur le téléphone, donc elle survit à un rechargement de la page. Le lien **Réinitialiser** sur l'écran d'accueil la vide, tout comme « Retour au début » sur la page secrète.
- En cas de mauvaise réponse, la bonne réponse n'est **pas** révélée, pour ne pas aider le joueur suivant.
- Les polices (Black Ops One, Special Elite, Share Tech Mono) viennent de Google Fonts : il faut une connexion internet, sinon des polices de secours s'affichent.
- N'importe qui ayant l'URL peut lire les fichiers du quiz, y compris les réponses et le secret. Ne partage le lien qu'avec des gens qui ne tricheront pas.
