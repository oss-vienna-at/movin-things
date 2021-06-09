# Web Component

## What it is

* The __web component__ is embeddable in HTML and in JS web apps
* It uses [Stencil](https://stenciljs.com/) as framework
* The component will __not__ be __published on NPM__, because it is 
  useless without the backend. For now, we expect users to clone
  [the repo](https://github.com/oss-vienna-at/movin-things) and
  install component and backend together

## Look and feel
  
* The web component is a map with moving dots
* With an icon in the lower right corner, we can switch
  between two different background tile sets, one for
  street map view and one for satellite map view
* Tiles providers can be configured, 
  [basemap.at](https://basemap.at/index_en.html) (required in
  Austria) and OpenStreetMap have been tested
* Dots represent objects
* Objects have attributes. One of them can be configured as __name__.
  Its value is shown beneath the dot
* Objects can be clicked
* A clicked dot pops up an overlay for __inspecting__ the hidden
  attributes
* The map component has no headline, it's just a frame
* Styling the component happens via CSS variables

## How to use it

### Syntax in HTML:

The web component has two parameters, the URL of the backend API,
and the name of a configuration defined in the backend.

```html
<movin-things
  api="api/v1/"
  config="flights-over-austria-config"
  />
```

Alternatively, the API URL can be absolute, host included,
but if the host differs from that serving the embedding
page, this might lead to CORS problems.

```html
<movin-things
  api="https://stp-test.wien.gv.at/movin-things/api/v1/"
  config="flights-over-austria-config"
  />
```

## Internals

* Upon __initialization__, the map component calls back to its
  API, in order to get the __configuration__ associated with the
  value of `config`
  
* The component has several __behavioral properties__, that can be
  __configured at the backend__, for instance geo-location of
  the center of the map, initial zoom, minimum and maximum
  zoom, update interval, ...

* The component polls the backend and gets JSON objects,
  representing objects observed by the configuration.
  The JSON objects contain a geo-location and whatever 
  attributes the observed objects have

* The protocol between component and backend is specified in
  [Backend Behaviour](backend_behaviour.md) under the heading
  "Client REST API".

## Possible future enhancements

* The map can be frozen in time

* Attribute values can be links, and a click on a 
  __link__ opens the link in a new window/tab

* Configurable object types with different colors/icons based on 
  attribute values, configured on backend, evaluated in the component

* Orientation of the object icon can indicate direction. This can't 
  be properly extracted from the data, it would have to be in 
  the raw sensor values
