# Backend overview

## What it is

* The backend is implemented as a __Node.js/Express__ service
* The backend handles __backend configuration__,
  __data acquisition__, __component configuration__ and __delivery
  of object state__ to observing web components

## Tenants  

* The backend supports tenants
* __Tenants__ are structured strings (incidentally concatenated
  FIWARE headers), but from the POV of the backend, a tenant is 
  just an opaque string
* Backend configuration has a map of __supported tenants__,
  dynamically created from the component configurations. The
  identification of a user as belonging to a tenant depends on an
  __HTTP header__, that must be set along with authentication. The
  header name is configurable (via App config /
  `http_header_tenant`) and would in our case be a portal header. In
  general, it would be set by some frontend reverse proxy

## Client API

* The backend allows for __lookup__ of component configurations
  available to a tenant. It responds with a list of
  `configuration_name` available for tenant
* Configuration names are treated opaquely, they are just
  strings. They are meant to be displayed as choices in
  multi-tenant clients
* The __web component__ initializes itself by getting its
  __map configuration__ from the backend. If a lookup of possible
  configuration names is necessary (for multi-tenant clients), the
  lookup has to be called from a script outside of the web
  component, and the choice of configuration has to be made.
  Finally the web component tag has to be injected from JavaScript,
  initialized with the selected configuration_name. Normally the
  tag and configuration name would be hard-coded
  
## Publisher side

* The __backend__ acquires data from __publishers__ using
  __subscriptions__
* For each __data source type__ an __adapter__ exists, that
  handles subscriptions, data conversions, etc
* For data sources unable to publish themselves, a
  __polling adapter__ is provided, that acts towards the backend
  as a publisher
* In the general case, __adapter configuration__ specifies how
  to get which data from where (DB connection, ContextBroker URL,
  web service URL, ...). Initially we will have at least one
  adapter for __FIWARE NGSIv2__
* The __FIWARE adapter__ reconstructs FIWARE headers from tenant
* __Adapter config__ has an `adapter_id` and `adapter_type`
  and `constructor_parameters`. They are needed to bootstrap the
  adapter
  
## Data structure decisions

The following list contains details about how the [data
structures](backend_api_data.md) interact with each other

* __Component configuration__ contains a list of
  __subscription usage configs__
* __Subscription usage config__ has a list of __attributes__
  to be __omitted__ when the object is delivered to the web
  component: This happens when objects are converted to
  __object DTOs__
* __Subscription usage config__ has __object style defaults__
  (symbol, color, ...)
* __Subscription usage config__ has __rules__ for how
  __object styles__ depend on attribute values (e.g.
  "speed > 30: color = red")
* __Subscription usage config__ references a __subscription
  config__ with a `subscription_id`, a unique, opaque string.
  In the case of FIWARE, a subscription ID from the context broker
  could be used
* Multiple subscription usage configs can __share__ the same
  __subscription config__
* __Subscription config__ has an `adapter_id` and
  `adapter_parameters`. The parameters are used to maintain the
  subscription
* An __adapter map__ contains __adapter objects__. They are
  used to __maintain subscriptions__ upon initialization,
  and to __normalize objects__ as they get published. It is,
  for instance, their job to make sure, geo-locations are in NGSIv2
  representation
* A __subscription map__, indexed by `subscription_id`, holds the
  actual `object_map`
* An `object_map` is updated by its publisher with state of
  __observed objects__

## Rule grammar

For rules modifying object styles, we use the following
[EBNF grammar](https://en.wikipedia.org/wiki/Extended_Backus%E2%80%93Naur_form):

```
DigitWithoutZero    = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" ;
Digit               = "0" | DigitWithoutZero
Number              = DigitWithoutZero, { Digit } ;
String              = '"', CharSequence, '"' ;
Value               = Number | String ; 
RelOp               = " < " | " <= " | " = " | " != " | " >= " | ">" ;
AttributeExpression = Attribute, RelOp, Value ;
AttributeAssignment = Attribute, " = ", Value ;
AttributeDrop       = "drop ", Attribute ;
Rule                = AttributeExpression, " : ", AttributeAssignment | AttributeDrop ;
```

* `CharSequence` is any sequence of characters, excluding 
  double Quotes.
* Attributes are existing attributes of normalized objects
* Each rule is a single line, that can be split on `:`.
* Sequences of white space should be replaced with single space
* Left and right side can then be split upon whitespace

!!! note
    Attributes on left and right hand side may be different.
    Thus `speed > 30 : color = "red"` is a valid rule.
