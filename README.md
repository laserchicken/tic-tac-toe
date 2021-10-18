## App local setup

Build and start:
```
docker-compose up
```

Setup db:
```
docker-compose run web rails db:setup
```

Run webpacker:install (do not overwrite config):
```
docker-compose run web rails webpacker:install
```

Visit http://localhost:3000

## TODOs

1. Add tests
2. Implement sign-up
