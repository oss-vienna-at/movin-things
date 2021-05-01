# MovinThings

## Introduction

This is MovinThings, a __visualization
web component__ for __things moving in geo-space__, in other
words: a map with moving dots and more.

Data comes from a __configurable, generic backend__, and
there's are also a __demos__, that show off embedding
of the component.

MovinThings is developed as a collaboration between PACE,
the innovation team of the [City of Vienna, Austria](https://www.wien.gv.at/), 
[Swiss Smart Technologies](https://swiss-smart.tech) and 
[Profirator](https://profirator.fi).

## Initial setup

This is preliminary. Vienna and Profirator use very different 
environments and setups. First please clone the project. 
Then, if you are

* Vienna: execute [build/init_dev_env_vienna.sh](./build/init_dev_env_vienna.sh)
* Profirator: execute [build/init_dev_env_profirator.sh](./build/init_dev_env_profirator.sh)
* everyone else, please be patient, we're working on it

After the setup has been executed once, a proper
`docker-compose.yml` will have been set up as symbolic link,
as well as a few other links.

At this point, the project can be started, running 

```
docker-compose up --build
```

### Further documentation

Once the compose app is running, further documentation is 
served by the service `docs` (container `movin-things_docs_1`)
under [localhost:8000](http://localhost:8000). The documentation
is formatted with [MkDocs](https://www.mkdocs.org). The original
Markdown sources are in [docs/docs](./docs/docs).