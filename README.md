# NestJS Microservice | React Native | Messenger

#### generate apps

nest g app auth

#### generate library

nest g library shared

#### Database Migration

```bash
# first, create migration inside docker container in terminal
$ npm run make:migration -- apps/auth/src/db/migration/InitDB

# and stop the docker compose then
$ yarn build # and run docker compose up again

# migrate
$ npm run migrate

# when updating the code, run yarn build and run docker compose up

# when there's changes on entity, generate new migration in container --
$ docker compose up
$ npm run make:migration -- apps/auth/src/db/migrations/SecondMigration
$ yarn build # from vscode
$ docker compose up

```
