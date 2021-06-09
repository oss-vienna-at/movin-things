# Backend overview

## What it is

* The backend is implemented as a __Node.js/Express__ service

* The backend handles __backend configuration__,
  __data acquisition__, __component configuration__ and __delivery
  of object state__ to observing web components

## Tenants  

* The backend supports tenants

* From the POV of the backend, a tenant is just an opaque string

* Backend configuration has a map of __supported tenants__,
  dynamically created from the component configurations. The
  identification of a user as belonging to a tenant depends
  on an __HTTP header__, that must be set along with
  authentication. The header name is configurable (via App
  config / `tenant_header`). In general, it would be set by 
  some frontend reverse proxy.

* A client can be member of up to four tenants

* The Backend is configured with a regular expression for
  extracting tenants from the tenant header
  
* If the request contains no tenant header, or the configured
  regular expression does not match, the request is deemed
  to come from a configurable default tenant, e.g. `public`.

## Client API

* The backend allows for __lookup__ of component configurations
  available to a tenant. It responds with a list of
  configuration names available for the tenant

* Configuration names are treated opaquely, they are just
  strings. They are meant to be displayed as choices in
  multi-tenant clients, that create the web component 
  dynamically

* The __web component__ initializes itself by getting its
  __map configuration__ from the backend. If a lookup of
  possible configuration names is necessary (for
  multi-tenant clients), the lookup has to be called from a
  script outside of the web component, and the choice of
  configuration has to be made. Finally the web component
  tag has to be injected from JavaScript, initialized with
  the selected configuration_name. Normally the tag and
  configuration name would be hard-coded
  
* The __web component__ regularly polls the backend. The
  response is the current state.
