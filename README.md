Elastic Admin (EADM) Elasticsearch Admin UI
=========

This is work in progress

Install as an ES plugin:
{ES_HOME} bin/plugin --install benoss/eadm

Online version [http://benoss.github.io/eadm/]
If using elasticsearch 1.4+ You need to add in your config elasticsearch.yml
```
http.cors.allow-origin: "*" #or "benoss.github.io"
http.cors.enabled: true
```

For dev: just clone, npm install, npm start
For build. npm run build:production and you should have a production ready folder in build/

### Todos

## General
- [ ] Create a gh-page
- [ ] Ability to install as an ES plugin

## Config Tab
- [x] Ability to add multiple clusters (name, protocol, url, port)
- [x] Ability to quickly change cluster with dropdown in the header
- [x] Save configuration to localstorage
- [ ] Add more cluster configuration options (basic auth, and expose other elasticsearchjs options
- [ ] Save configuration as a json file
- [ ] Import configuration as a json file
- [ ] Save configuration as a gist
- [ ] Import configuration as a gist

## Query Tab
- [x] Create a basic query tab
- [x] Raw Json result
- [x] Formatted Json result using react-json-inspector
- [x] YAML result
- [x] Table result
- [ ] Add index/type selection autocomplete
- [ ] Add basic keywords autocomplete in editor
- [ ] Query history
- [ ] Import/save snippets as gist/file
- [ ] Pre-loaded list of snippets

## Cluster Tab
- [ ] Basic Cluster Info
- [ ] List all index
- [ ] Alias Management
- [ ] Templates Management

## Index
- [ ] Basic Index Info
- [ ] Mappings
 
 
 


Powered by React Flux and Bootstrap
