# INTRODUCTION

Narrative in this document uses **American English (en-US)**. **User-facing strings** called out in requirements remain **Catalan** where specified.

I want to create a didactic web application in Catalan for learning and consolidating the spelling of a set of important words.

The app must be:

- interactive
- gamified
- **fully in Catalan** (UI copy, messages, and spoken text via `ca-ES`)
- **responsive** (mobile, tablet, desktop), using defined breakpoints to drive layout and typography

## SCOPE (V1)

- **Student experience only.** The teacher role is **out of scope** for this iteration and is not modeled in the product or app.

## ROLES

### STUDENT

As a student I want:

- to have an app that allows me to consolidate the spelling of a set of words in a playful way.

## REQUIREMENTS

### FUNCTIONALITY

When the app loads it must display a main progress bar at the top.

- The primary progress bar shows **n / total words** (correct answers so far over total words in the current game).
- **Initial state before any answer:** `0 / total` (e.g. `0 / 3` when three words are loaded).

When the app loads it must display a secondary progress bar at the top (errors / max allowed).

- The bar shows **n / max errors allowed**, where **max errors allowed is 10** in this first iteration.
- **Initial state before any answer:** `0 / 10`.
- The bar uses a **color code** from the **current error count** (not remaining):
  - **Green:** 0–2 errors
  - **Yellow:** 3–5 errors
  - **Orange:** 6–8 errors
  - **Red:** 9–10 errors

When the app loads it must display a card.

- The card must have:
  - a button that verbally reproduces the target word (Web Speech API, Catalan)
  - three options: one correct and two incorrect (order shuffled)

#### Pending words and random next card

- **Correct answer:** the target word **leaves** the pending pool. The next card’s target is chosen **at random among the remaining pending words only**.
- **Incorrect answer:** the target word is **marked as incorrect** and also **leaves the pending pool** (it is not counted as mastered, but will not appear again in the current run).
- The next target is always drawn from **pending words only** (never from words already answered correctly).

#### When an option is selected on the card

- The main progress bar is updated when applicable (correct answers).
- The errors bar is updated when applicable (each wrong selection increments errors).
- **If correct:** show **confetti** (implemented with the external package [js-confetti](https://www.npmjs.com/package/js-confetti)). No explanatory text message.
- **If incorrect:** show this Catalan message to the user (no confetti): `L'opció correcta és <paraula-objectiu>` (en-US meaning: “The correct option is” plus the target word).
- Then load the next card according to the pending-word rules above.

The game ends when:

- the **maximum number of errors (10)** is reached, or
- **all words** have been answered correctly (pending pool empty).

When the game ends, two actions are shown:

- **Tornar a jugar** (Catalan button label; en-US: “Play again”): resets the game (new run with the same configuration, e.g. words and max errors as defined for V1).
- **Sortir del joc** (Catalan button label; en-US: “Exit game”): show the Catalan message **`Fins una altra`** (en-US gloss: “See you later”), then **close the browser tab after 5 seconds** (same-window behavior; subject to browser security if the tab was not opened by script).

## STYLES

The app must have a modern and minimalist style, implemented responsively with explicit breakpoints in the design system (Tailwind / layout) so layout and typography adapt cleanly across viewports.

## ACCESSIBILITY

- **Tab** / **Shift+Tab:** move focus between interactive elements (play button, three options, end-game actions when visible).
- **Arrow keys:** move focus **only among the three answer options** when that group is in context; arrows do not navigate the rest of the UI in this iteration.
- **Focus:** when a new card loads, **focus moves to the button that plays the target word** (listen).
- **Speech synthesis (V1):** the game **must not run** if speech synthesis is unavailable or unusable for the session (no “silent play” in this iteration). The user is informed appropriately in Catalan before or instead of starting play.
