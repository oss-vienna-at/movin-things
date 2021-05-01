# MovinThings

This is the documentation of MovinThings, a __visualization
web component__ for __things moving in geo-space__, in other
words: a map with moving dots and more.

Data comes from a __configurable, generic backend__, and
there's also a __starter project__, that shows off embedding
of the component.

## Projects

MovinThings consists of

* a [Stencil](https://stenciljs.com/) project, that produces
  a web component and deploys it to NPM

* a backend project created with
  [Nodejs](https://nodejs.org/) and
  [Express](https://expressjs.com/). The backend is a
  docker-compose app, created to be compatible with [Docker
  Smart CI](https://stp-test.wien.gv.at/docker-smart-ci/)

* a starter project in [React](https://reactjs.org/),
  created to show off the deployment of the web component.
  In order to do this, the backend must be deployed with a
  component configuration "demo", and a FIWARE context
  broker must be available for subscription, and to publish
  data to the backend. The project is a docker-compose app,
  created to be compatible with [Docker Smart
  CI](https://stp-test.wien.gv.at/docker-smart-ci/)

* this project, where all is documented

These projects each have their own git repository:

* [movin-things-component](https://bitbucket.org/ma14pace/movin-things-component)
* [movin-things-backend](https://bitbucket.org/ma14pace/movin-things-backend)
* [movin-things-starter](https://bitbucket.org/ma14pace/movin-things-starter)
* [movin-things-docs](https://bitbucket.org/ma14pace/movin-things-docs)

## Goals & Non-Goals

### Goals

* Component, embeddable in any page or app, regardless of
  framework, preferably a Web Component

* Display moving objects on a map, regardless of object type
  and data origin

* Object data is subscribed to from multiple sources via
  adapters and selected by adapter-specific expressions

* Implementation of at least one adapter, the FIWARE NGSIv2
  adapter

* Backend configurable per instance in terms of adapters

* Frontend configurable via named configurations stored at
  backend

* Frontend is responsive and can be configured to function
  on a smartphone, albeit with minimal interactivity

* Does not require web sockets, SSE or non-HTTP protocols

### Non-Goals

* no BI tool

* no customization for end-users

* no user administration: is only called by users authorized
  to do so

* No event histories: what the web component sees is a
  current state. State changes between two updates of the
  component may be lost

