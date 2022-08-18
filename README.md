# EXPRESS MONGO BOILEPLATE

This boilerplate provides a proficient node with express and mongo structure.

- Linter (airbnb rules) configured with prettier and husky
- Dockerized with development and production stages
- Jest for testing
- folder structure:
  - controllers: Router logic
  - models: Models
  - tests: Jest tests
  - utils: Others functionalities

## How to use

First clone the project on your local machine

```shell
git clone https://github.com/CarlosPumar/Express_Mongo_Boilerplate
```

Then run the following command to remove the version tracking

```shell
rm -rf .git
```

In your github repository set the following secret keys:

- DOCKER_HUB_USERNAME
- DOCKER_HUB_ACCESS_TOKEN

And Voilà! Happy Hacking!

## How to run

### Download Docker

Download docker and docker-compose if you haven't already

### Development stage

```shell
docker compose -f docker-compose.dev.yml up -d --build
```

localhost:3001

### Production stage

```shell
docker compose -f docker-compose.prod.yml up -d --build --force-recreate
```

localhost:3000
