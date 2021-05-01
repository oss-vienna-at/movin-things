# Web Component

!!! note
    The component has its [own repo](https://bitbucket.org/ma14pace/movin-things-component)

## What it is

* The __web component__ is embeddable in HTML and in JS web apps
* [Stencil](https://stenciljs.com/) is the target framework
  and will be __published to NPM__
* Bindings for HTML and React need to be documented and published
  as well

## Look and feel
  
* The web component is a map with moving dots
* With an icon in the lower right corner, we can switch
  between two different background tile sets, one for
  street map view and one for satellite map view
* We need to support at least two tiles providers, namely
  [basemap.at](https://basemap.at/index_en.html) (required in
  Austria) and OpenStreetMap for everyone else
* Dots reperesent objects
* Objects have attributes: __visible__ (like shape, rotation, color)
  or __hidden__ (title, description, optionally an array of links:
  `[{url_text, url}, ...]`)
* Objects can be clicked
* In order to facilitate that, the map can be frozen in time
* A clicked dot pops up an overlay for __inspecting__ the hidden
  attributes
* A click on a __link__ opens the link in a new window/tab.
  The content of the link target is out of scope
* "Closing" the popup unfreezes the map, animating to the current
  position of the last inspected object
* "Close and follow" does the same, but also __follows__ the last
  inspected object
* The map component has no headline
* The map has a legend, that can be popped up, when a `?` 
  icon is clicked. The Legend has a description for each 
  type of dot. The legend is also configured in and supplied 
  by the backend

## How to use it

* Syntax in HTML: `<movin-things api="api/" config="demo" lang="de"/>`
* The component has attributes `api` (= backend URL, normally
  relative), `config` (= configuration name used in backend)
  and `lang`.
* The component mostly uses icons for navigation and switching
  between backgrounds, but it still needs `ALT` texts for those
  icons. We support a list of languages, and for each language,
  the translations for all `ALT` texts is coded into the 
  component. Which language to use, is decided by the value of
  the component's `lang` attribute. The embedding page is 
  supposed to supply a supported language code. Component
  language is an explicit parameter, because we need to keep 
  the language within the component in sync with the 
  language of the embedding page.
* Backend API calls are expected to be made to a relative backend
  URL, typically starting with `api/`. If an absolute URL is used,
  that does not have the index URL of the embedding page as
  prefix, then the backend has to handle CORS
* The web component is pre-authenticated, that means, when you 
  have access to it, you also have access to the data in that 
  backend

## Internals

* Upon __initialization__, the map component calls back to its
  API, in order to get the __configuration__ associated with the
  `configuration_name`
* The component has several __behavioral properties__, that can be
  __configured at the backend__, for instance size, resizeability,
  initial_position, initial_zoom, ...
* From the POV of the component, it gets JSON objects, representing all objects observed by the configuration. The 
  JSON objects contain position, visual and . It's just painting 
  silly dots on a canvas, with configuration determining how 
  they are painted
* Protocol between component and backend is specified in
  [Backend Behaviour](backend_behaviour.md) under the heading
  "Client REST API".
