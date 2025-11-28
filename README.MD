# my_crud_tester

## Installation du projet

```bash
docker-compose build
```

## Lancer les tests

### Unitaires

Pour lancer les tests unitaires, il faut lancer la commande suivante :

```bash
npm run test
```

### Fonctionnels

Il faut préalablement lancer le serveur de l'API avec la commande suivante :

```bash
docker-compose up
```

`--build` pouvant être ajouté si des changements ont été effectués dans le code de l'API.

Pour lancer les tests fonctionnels, il faut lancer _Postman_ puis importer la collection `my_crud_tester.postman_collection.json`. Ensuite il faut créer un environnement (en haut à droite), et le sélectionner, puis lancer la collection (trois points -> _Run collection_). Dans les paramètres avancés de lancement de la collection, vérifiez à ce que soit bien sélectionné _Keep variable values_.

Parfois Postman pert se perd un peu dans l'envoi et la récupération de paquets (puisque tous lancés en quasi-simultané), n'hésitez pas à définir un délais de 100ms entre chaque requête.
