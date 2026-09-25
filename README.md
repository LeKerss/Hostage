# Operation Hostage 🎬

A small static quiz web app for phones. There's no build step and no server code.

## Customize

Everything you edit lives in **`config.js`**:

- `participants`: name, photo, role
  - `"player"`: can be picked
  - `"host"`: you. You're picked only when every player has already played.
  - `"protected"`: your wife. Never picked.
- `questions`: the question text, an optional `image`, and `answers` (each with a `text` and an optional `image`). `correct` is the index of the right answer, where 0 is the first answer.
- `backgroundImage`, `introVideo`, `timerSeconds`
- `secret`: the title, image and music for the final announcement
- `texts`: every sentence shown in the app, so you can translate or rewrite any of them

Put your files in `assets/`. Use `.mp4` (H.264) for the video and `.mp3` for the music so they play on both iPhone and Android.

## Try it locally

Open `index.html` in a browser, or run `npx serve .` and open the URL it prints.

## Host it (free)

- **Netlify Drop**: go to https://app.netlify.com/drop and drag the whole `hostage-quiz` folder onto the page. You get a URL right away.
- **GitHub Pages**: push the folder to a repo, then turn on Pages under Settings → Pages.

## Notes

- The list of people who already played is saved on the phone, so it survives a page refresh. Use the **Reset** link on the start screen to clear it. The list is also cleared by "Back to the beginning" on the secret page.
- On a wrong answer, the correct answer is **not** shown, so the next person can't benefit.
- Anyone who opens the site can see the quiz files, including the answers and the secret. Only share the URL with people you trust not to peek.
>>>>>>> 30cb6ad (first commit)
