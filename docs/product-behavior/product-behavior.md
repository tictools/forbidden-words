# Product-behavior specifics worth knowing before touching game logic

- Error severity is derived from **cumulative wrong answers** in the current game: 0–2 green, 3–5 yellow, 6–8 orange, 9–10 red; `maxWrongAnswers` is 10 for V1.
- On a correct answer, the word leaves `remainingWords` and the next `currentCard` is drawn at random from remaining pending words only. On an incorrect answer, the word also leaves the pending pool (not counted as mastered, but won't reappear this run) — pending-word selection never revisits already-answered words either way.
- Speech synthesis is a hard gate: if `window.speechSynthesis`/Catalan (`ca-ES`) synthesis isn't usable, the game must not start — show a Catalan message instead of silently playing without audio.
- All user-facing UI copy is Catalan (see exact button labels/messages in `specs/product/SPECS_v1.md`); narrative docs/comments use American English.
