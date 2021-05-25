# Usage in HTML page

To get correct path to assets ```data-resources-url``` needs to be set. For example
```
<script type="module" src="https://unpkg.com/movinthings@1.0.0/dist/movinthings/movinthings.esm.js"
data-resources-url="https://unpkg.com/movinthings@1.0.0/dist/movinthings/"
data-stencil-namespace="movinthings" crossorigin=""></script>
```
Also element height size have to be countable like following
```
<body style="height: 400px; width: 50%;" >
    <movin-things ...
     ```
     If using percentage then parent element should have fixed height value. If parent element has
     percentage value then its parent should have fixed value and so on. Otherwise component height
     cannot be determined and component is not visible.
```

# Localization

Start point? https://github.com/ionic-team/ionic-stencil-conference-app/issues/69

# Stencil and Server Send Events

Event routing and routines offered by Stencil https://stenciljs.com/docs/events

# Stencil App Starter

Stencil is a compiler for building fast web apps using Web Components.

Stencil combines the best concepts of the most popular frontend frameworks into a compile-time rather than run-time tool. Stencil takes TypeScript, JSX, a tiny virtual DOM layer, efficient one-way data binding, an asynchronous rendering pipeline (similar to React Fiber), and lazy-loading out of the box, and generates 100% standards-based Web Components that run in any browser supporting the Custom Elements v1 spec.

Stencil components are just Web Components, so they work in any major framework or with no framework at all. In many cases, Stencil can be used as a drop in replacement for traditional frontend frameworks given the capabilities now available in the browser, though using it as such is certainly not required.

Stencil also enables a number of key capabilities on top of Web Components, in particular Server Side Rendering (SSR) without the need to run a headless browser, pre-rendering, and objects-as-properties (instead of just strings).

## Getting Started

To start a new project using Stencil, clone this repo to a new directory:

```bash
npm init stencil app
```

and run:

```bash
npm start
```

To build the app for production, run:

```bash
npm run build
```

To run the unit tests once, run:

```
npm test
```

To run the unit tests and watch for file changes during development, run:

```
npm run test.watch
```
