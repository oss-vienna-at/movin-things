# MovinThings

This is the documentation of MovinThings, a __visualization
web component__ for __things moving in geo-space__, in other
words: a map with moving dots and more. Data comes from a
__configurable, generic backend__, normally polling a
[FIWARE Orion Context
Broker](https://fiware-orion.readthedocs.io/en/master/).
Other data sources can be adapted to.

Here's the screenshot of a demo:

![Flights over Austria](img/screenshot_flights_over_austria.png)

## Purpose

MovinThings provides a generic visualization component for
the [FIWARE Orion Context
Broker](https://fiware-orion.readthedocs.io/en/master/).
Find out more about FIWARE on the [FIWARE Home
Page](https://www.fiware.org/).

MovinThings is released under the [EUPL
1.2](https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12).

## Contributors

MovinThings is developed in a collaboration between PACE,
the innovation team of the [City of Vienna,
Austria](https://www.wien.gv.at/), [Swiss Smart
Technologies](https://swiss-smart.tech) and
[Profirator](https://profirator.fi).

## Project structure

MovinThings consists of

* a [Stencil](https://stenciljs.com/) web component. This is 
  the frontend. It can be embedded in a simple HTML page or
  any modern Web Application, regardless of being a _Single
  Page Application_ (SPA), a _Progressive Web App_ (PWA), or
  just a server-rendered web app.

* a backend project created with
  [Nodejs](https://nodejs.org/) and
  [Express](https://expressjs.com/).

* this documentation

## Goals & Non-Goals

### Goals

* Web component, embeddable in any page or app, regardless of
  framework

* Display moving objects on a map, regardless of object type
  and data origin

* Object data is read from multiple sources via
  adapters and selected by adapter-specific configurations

* Implementation of at least one adapter, the FIWARE Orion Polling 
  Adapter

* Backend configurable per instance in terms of adapters

* Frontend configurable via named configurations stored at
  backend

* Frontend is responsive and functions on mobile devices

* Does not require web sockets, SSE or non-HTTP protocols

### Non-Goals

* no BI tool

* no customization for end-users

* no user administration: is only called by users authorized
  to do so

* No event histories: what the web component sees is a
  current state. State changes between two updates of the
  component may get lost
  
* no usage of Context Broker subscriptions. The backend polls 
  Orion by querying periodically. The frontend displays the result.
  Subscribing to incremental updates would require holding state
  and would essentially replicate Context Broker functionality.
