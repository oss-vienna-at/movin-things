# Configuration

This chapter explains the test configuration in
`api/src/config_vienna`.

## Overview of config.json

This is the main configuration file. The first part is about
tenants. We have a header, a default tenant, a regular
expression, and a string that, if starting a regexp match,
lets us skip the match.

The idea is to match things like

```
tenant(name=pace)
tenant(name=other)
tenant(name=pace,name=admin)
```

The regular expression does that. Among its matches are all 
tenant names `pace`, `other` and `admin`. It also produces 
a few unwanted matches, but thankfully they all start with 
`name=`, which we have configured to skip.

The last part is a map of configurations, with configuration
name being the keys. Only the first configuration,
`flights-over-austria-config`, will be fleshed out. For now
its details are omitted.

In between, we have a map `tenants`, containing a list of
available configurations for each tenant. Clients cannot
initialize or request data from a configuration, that is not
available.

```json
{
  "tenant_header": "X-PVP-Roles",
  "tenant_default": "public",
  "tenant_regex": "tenant\\(name=(\\w+,?)+(,name=(\\w+))?(,name=(\\w+))?(,name=(\\w+))?\\)",
  "tenant_result_skip": ["name="],

  "tenants": {
    "pace": ["flights-over-austria-config", "pace-config"],
    "public": ["flights-over-austria-config"]
  },

  "configurations": {
    "flights-over-austria-config": {
      // Details omitted for now
    },
    "pace-config": {
      // Details omitted
    }
  }
}
```

Before we look into the details of a named configuration, let's
just look at where the data comes from.

## adapter.json

Say, we want to poll an Orion instance for airplanes. We need
to configure an adapter in `adapter.json`. Here's an example
with only one adapter configuration:

```json
{
  "configurations": [
    {
      "adapter_id": "flights-over-austria",
      "filename": "orionpoller",
      "disabled": false,
      "ms_timeout": 1000,
      "url": "http://orion-proxy.docker:1026/v2/entities?type=Plane&limit=1000&options=keyValues",
      "headers": {
        "accept": "application/json",
        "fiware-service": "vienna",
        "fiware-servicepath": "/ma01/pace"
      }
    }
  ]
}
```

The adapter has an ID, the code of the adapter is in a file
named `api/src/lib/adapters/orionpoller.js`. It is not
disabled. Every second, it polls Orion at a given URL, and
along with the request, it send some HTTP headers.

That means, the result set of this query into the Context
Broker will be fetched periodically, and stored in the
backend. Subscription (remember: that's not an Orion
subscription, it means just to start polling) will begin,
once the first web component instance has initialized.

!!! note
    The backend is supposed to hold "the entire world". The
    backend does not use the geo bounding box given as 
    parameter to `get_state` for anything but filtering. 
    

## subscription.json

This configuration currently is an unnecessary additional
indirection. As implemented, there is one subscription per
adapter, and the adapter is basically the configuration of
one adapter class instance. For now, get over it, this needs
some refactoring and cleanup.

```json
{
  "flights-over-austria-subscription": {
    "adapter": "flights-over-austria"
  }
}
```

## subscription_usage.json

Loaded adapters, with subscriptions triggered, that means,
data is available. It does not necessarily mean, that all 
clients want to see all of that data, and for some data types,
we might want to help along with formatting.

```json
{
  "flights-over-austria-usage": {
    "subscription_id": "flights-over-austria-subscription",
    "omit": [
      "sensors",
      "description",
      "time_position",
      "position_source",
      "spi",
      "callsign"
    ],
    "timestamps": [
      { "attr": "last_contact", "locale": "de-AT", "tz": "Europe/Vienna" },
      { "attr": "time_position", "locale": "de-AT", "tz": "Europe/Vienna" }
    ]
  }
}
```

Subscription usages refer to the base data of a
subscription, detail what fields to omit (i.e. not ship to
the client), and designate certain field as timestamps.

## Details of config.json

Now we can continue with `config.json`. Here is the version 
with `flights-over-austria-config` fully fleshed out.

```json
{
  // tenant part omitted
  
  "configurations": {
    "flights-over-austria-config": {
      "usage_configs": ["flights-over-austria-usage"],
      "zoom": 8,
      "maxzoom": "19",
      "minzoom": "6",
      "attribution": "Flugdaten <a href=\"https://opensky-network.org/\" target=\"_blank\">OpenSkyNetwork</a>; Kartenmaterial &copy; <a href=\"https://basemap.at/en/#lizenz\" target=\"_blank\">basemap.at</a>",
      "geolocation": [47.7, 13.2],
      "initlayer": "geolandbasemap",
      "title_attribute": "name",
      "ms_timeout": 1000,
      "layers": [
        {
          "id": "geolandbasemap",
          "name": "Streets",
          "url": "https://maps.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.png"
        },
        {
          "id": "bmaporthofoto30cm",
          "name": "Satellite",
          "url": "https://maps.wien.gv.at/basemap/bmaporthofoto30cm/normal/google3857/{z}/{y}/{x}.jpeg"
        }
      ]
    },
    "pace-config": {
      // Details omitted
    }
  }
}
```

We want to see data from at least (frequently exactly) one
`usage_config`. We have `zoom` `minzoom` and `maxzoom` for a
map having its centerpoint at `geolocation`.

There are two layers, with `initlayer` the one initially
shown. Every `ms_timeout`, the component shall poll the
backend. Each object in the result set will have a certain
`title_attribute`, that is fit for display as title below
the dot on the map.

And that's it, hooray, we have configured the backend.
