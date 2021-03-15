# The Might Microwave

Welcome to The Mighty Microwave! This document is designed to help you build and run the application as well as provide you with some insight into the methodologies and strategies used in this project.

## Getting Started

### Install Dependencies

```bash
npm install
```

### Running the App Locally

```bash
npm run dev
```

### Building the App For Production

```bash
npm run build
```

### Running Tests

```bash
npm run test
```

## Methodologies

### Dependencies

I tried to keep the number of dependencies as low as possible. It may look like I am using jQuery for DOM manipulation, but I actually just created abstractions for `querySelector` (`$`), `querySelectorAll` (`$$`), and `addEventListener` (`on`) to improve the readability of the code. Those can be found in `./scripts/dom-utils.ts`.

I did also pull in [Kickstand UI](https://kickstand-ui.com/) to help with the UI development. I figured it wasn't _really_ cheating since I built it.

### Logic

All of the JavaScript is written in TypeScript to take advantage of it's type safety and autocomplete features provided by my code editor.

Effort was made to ensure all UI and DOM manipulation logic stayed in the `microwave-ui.ts` file. All validation and business logic is located in the `microwave.ts` file.

I also wrote it in a way so that if I wanted to implement a front-end framework like Vue or React, it could be done easily.

### Testing

All tests were written using Jest. Code coverage is not 100%, but the main logic should be covered and well tested.

### Persistence

The microwave presets take advantage of `sessionStorage` to persist the custom preset data when the page gets refreshed. Because it is using `sessionStorage` rather than `localStorage`, the data will be rest if you open the application in a new tab or browser window.

## Accessibility

The application and all components should be compliant with WCAG 2.1 AA standards (at least).

In addition to that, an alert was added to the page for assistive technologies to announce the state of the microwave ("ready", "running", "paused", and "programming"). This content is only visible for screen readers and uses the `alert` role with the `aria-live` attribute set to "polite". Any time the microwave's state is updated, the browser will announce the change.

All controls should be interactive though touch, keyboard, and mouse. When users interacts with the controls they should hear audio feedback. They should also get different audio feedback when the microwave is done.
