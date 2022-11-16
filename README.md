# FYP-22-S4-23

## Start the Application

Choose only one of the two following methods below to start the app. Once the app is running, you should be able to
access it via `http://localhost:3000`. If you have issues with starting or running the app, please refer to the
[setup guide](#setup-guide-local) below.

### 1. Node

A batch and shell script has been created for your convenience. The script will attempt to set any process environment
variables before executing `npm start`. Remember to run `npm ci` in the before executing the batch or shell script. You
may find out more about the npm commands [here](#npm-commands).

You may simply execute the following command to start the application:

#### For Windows

```batch
.\start.bat
```

#### For Linux/MacOS

```shell
./start.sh
```

> **NOTE:** Please configure the required environment variables in the script. For more details, you may refer to the 
> setup guide [below](#2-process-environment-variables).

## Setup Guide (Local)

Needless to say, please clone the project first before proceeding.

### 1. Node.js

To run this project locally, you must have Node.js installed on your device. A quick way to get started is to directly
install Node.js on your system. You may download the installer [here](https://nodejs.org/en/download/).

However, it is strongly recommended to use a Node version manager such
as [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
to install Node.js and npm. You may read more about
it [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

### 2. Process Environment Variables

Before running the app and unit test, you must configure the required process environment variable(s).

```
URI_IGNORE_PORT=0
ENV=test
PORT=3000
DB_HOSTNAME=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_DATABASE=dhrms
```

| Parameters        | Type     | Description                                                                                                                                                                                       |
|:------------------|:---------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `URI_IGNORE_PORT` | `Number` | **Required**. Set `1` if the port is not required. By default, you should set to `0` when running locally or when the port is necessary. Live deployment may require this value to be set to `1`. |
| `ENV`             | `String` | **Optional**. Set value to `test` for unit testing only.                                                                                                                                          |
| `PORT`            | `Number` | **Optional**. Specify the port that your app will run on. By default, it is set to 3000.                                                                                                          |
| `DB_HOSTNAME`     | `String` | **Required**. Set database server hostname here.                                                                                                                                                  |
| `DB_PORT`         | `Number` | **Required**. Set database server port here. By default, MySQL port is set to `3306`.                                                                                                             |
| `DB_USER`         | `String` | **Required**. Set database username here.                                                                                                                                                         |
| `DB_PASS`         | `String` | **Required**. Set database password here.                                                                                                                                                         |
| `DB_DATABASE`     | `String` | **Required**. Set name of database here.                                                                                                                                                          |

## npm Commands

Here, we have a list of CLI commands that may be useful to you. In the project directory, simply open a terminal to run
the following:

### `npm ci`

- This command will install all necessary dependencies based on the `package-lock.json`.
- You only need to run this command <b>once</b> in the project directory.

### `npm start`

- This command starts the node server located in the root of the repository.
- Alternatively, you may run `node app.js`.
- You can now access the app through `localhost:3000`.

### `npm run dev`

- This command starts the node server in development mode using nodemon.
- It will monitor for any changes to the JavaScript files and restart the node server when changes are observed.
- Alternatively, you may run `nodemon app.js`
- For more info, please refer to [Nodemon](https://github.com/remy/nodemon#nodemon).

### `npm run test`

- This command runs the unit tests and generates a code coverage report.
- Code coverage report are generated in `./coverage`, in HTML format for ease of readability.
- Alternatively, you may run `nyc --reporter=html --reporter=text mocha test/test.js --exit"`
- For more info, you may read up on them in their official documentations: [Istanbul / nyc](https://istanbul.js.org/)
  , [Mocha.js](https://mochajs.org/), [Chai.js](https://www.chaijs.com/).

## Dependencies

#### Running on Node v16.13.1

Refer to [package-lock.json](./package-lock.json) for all the nitty-gritty details, or refer to the following for a
summarised list taken from [package.json](./package.json):

```json5
    "dependencies": {
      "body-parser": "^1.20.1",
      "bootstrap": "^5.2.2",
      "cookie-parser": "^1.4.6",
      "cors": "^2.8.5",
      "ejs": "^3.1.8",
      "express": "^4.18.2",
      "express-flash": "^0.0.2",
      "express-session": "^1.17.3",
      "express-validator": "^6.14.2",
      "jquery": "^3.6.1",
      "knex": "^2.3.0",
      "lodash": "^4.17.21",
      "morgan": "^1.10.0",
      "mysql2": "^2.3.3",
      "request": "^2.88.2",
      "serve-favicon": "^2.5.0"
    },
    "devDependencies": {
      "chai": "^4.3.7",
      "chai-http": "^4.3.0",
      "mocha": "^10.1.0",
      "nodemon": "^2.0.20",
      "nyc": "^15.1.0"
    }
```