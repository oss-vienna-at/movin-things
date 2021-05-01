# Starter Project

!!! note
    The starter has its [own repo](https://bitbucket.org/ma14pace/movin-things-starter)

* In order to show off the app, we will need a demo application,
  that can also work as a __starter application__
* Should be a __React__ app, that shows the variants of the component
* The basic structure of an the index.html and all JS/CSS/assets 
  are delivered by an NGINX webserver, that proxies "api/" to a 
  backend service. If the app is authenticated and the user is 
  authorized to call it, API calls are just an extension of the 
  app's base URL, and therefore the user is authorized for the 
  API as well.
* The __documentation__ should include how to construct a real app after this pattern
