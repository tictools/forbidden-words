# INTRODUCTION

I want to create a didactic web application in Catalan for learning and consolidating the spelling of a set of important words.

The app must be:

- interactive
- gamified

## ROLES

### TEACHER

As a teacher I want:

- to have an app that allows the student to learn and consolidate the spelling of a set of words.

### STUDENT

As a student I want:

- to have an app that allows me to consolidate the spelling of a set of words in a playful way.

## REQUIREMENTS

### FUNCTIONALITY

When the app loads it must display a main progress bar at the top.

- the primary progress bar shows the total number of correct answers over the total available words (<bar> n/total words)

When the app loads it must display a secondary progress bar at the top.

- the bar shows the total number of errors over the total possible errors (<bar> n/total errors)
- the bar is displayed with a color code (green | yellow | orange | red) based on the number of errors over the total
- the initial number of errors is 10

When the app loads it must display a card.

- The card must have
  - a button that verbally reproduces the target word
  - three options: one correct and two incorrect

When an option is selected on the card:

- the main progress bar is updated with the total correct answers, if applicable
- the main errors bar is updated with the total errors, if applicable
- confetti is displayed if the option is correct
- a message is displayed in Catalan: "L'opció correcta és <paraula-objectiu>"
- the card with the next target word is loaded randomly

The game ends when:

- the total number of errors is reached
- all cards are answered correctly

When the game ends two options are displayed:

- tornar a jugar
- sortir del joc

## STYLES

The app must have a modern and minimalist style

## ACCESSIBILITY

- The student must be able to reproduce the word using navigation keys
- The student must be able to select the word using navigation keys
