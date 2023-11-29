# Advent of Node

A full-stack dev environment to solve [Advent of Code](https://adventofcode.com) challenges in TypeScript or JavaScript.

<img src="https://img.shields.io/badge/yarn-v1.22.19-blue" /> <img src="https://img.shields.io/badge/Nx-v17.0.3-blue" /> <img src="https://img.shields.io/badge/React-v18.2.0-blue" /> <img src="https://img.shields.io/badge/Express-v4.18.1-blue" /> <img src="https://img.shields.io/badge/license-BSD--3-green" />

## About

Advent of Node is a full webapp stack bundled in an [Nx monorepo](https://nx.dev/) workspace. The repo includes three apps: `solver-app`,`react-app`, `express-app`.

[`react-app`](apps/react-app/) is a React webapp intended to be built once and served automatically from `express-app`. The user can open a puzzle to read its description and test their solution using either their puzzle input or a custom input entered on the right side of the UI. Custom inputs can be added, saved, modified, renamed, etc., and are also stored in Mongo alongside the user's provided puzzle input.

[`express-app`](apps/express-app/) is a Node Express API that statically serves the `react-app` build, fetches data from the AoC website, handles the MongoDB connection, and dispatches solution requests to `solver-app`. Since `express-app` handles your AoC account data, it is only configured to be hosted locally or in a private environment.

[`solver-app`](apps/solver-app/) is a separate, minimal Node Express application intended as the solution space. It is kept decoupled from `express-app` to avoid the time sink of rebuilding the full app and recreating the mongo connection on every solution update. By default, starting `express-app` will spawn an instance of `solver-app` that supports debugging and auto reloading.

<img src="https://i.imgur.com/ap7gRkX.png"/>

Opening a puzzle for the first time triggers the fetch from AoC, and renders the puzzle description and input pane side-by-side. Solutions should be submitted on the AoC website as normal, but the puzzle description can then be re-fetched using the star button in the upper-right of the UI.

## Requirements

Advent of Node requires the following to run:

- [Node.js](https://nodejs.org/en/) minimum version 16.20.1
- [npm](https://www.npmjs.com/), usually bundled with Node.js
- [Yarn](https://yarnpkg.com/) (install with `npm install -g yarn`)

You will also need to set up a MongoDB instance to store your data. I recommend using [MongoDB Atlas](https://www.mongodb.com/products/platform/cloud), Mongo's free cloud service. The full setup process is documented below.

Advent of Node is configured for development in [Visual Studio Code](https://code.visualstudio.com/). As an alternative, [Jetbrains IDEs are also supported by Nx](https://nx.dev/core-features/integrate-with-editors).

For the best experience, I recommend the Firefox web browser since that's my browser of choice and I've done very little testing on other browsers.

## Setup

### Initialization

Clone or download the repository, then navigate to the project directory and install required packages by running

```
yarn
```

This will install Nx along with all the project's dependencies listed in [package.json](package.json) into the `node_modules` directory. In general, you will need to rerun the `yarn` command after any dependency updates to make sure all dependencies are installed and the correct version.

I recommend installing the Nx console extension if it's available in your IDE. In VS Code, you should get a popup asking you to install it along with other recommended extensions.

### Environment

Prior to running the project, you will need to set some environment variables. There is an _.env.example_ file in [`express-app`](apps/express-app/) to get you started. You will need to add a _.env_ file at the same level and copy two variables from the _.env.example_.

#### `NX_AOC_SESSION`:

This session ID is how you get your own account's data from the AoC website. AoC allows you to sign in using your account with another service that supports [OAuth](https://en.wikipedia.org/wiki/OAuth), but doesn't offer its own OAuth endpoint (which is probably [a good thing](https://medium.com/@ibm_ptc_security/oauth-2-0-security-and-vulnerabilities-86e64c22b03d)). As a result, this is basically the only way for your Advent of Node instance to access account-specific data (like your puzzle input).

1. Sign in to https://adventofcode.com
2. Open the browser's dev console with F12 and navigate to the "Network" tab.
3. Select the first adventofcode.com "GET" request (you may need to refresh the page for the list to populate).
4. Under "Cookies", copy the "session" value. This should be a long string representing the hexadecimal value of your sessionId.
5. Paste the string into `NX_AOC_SESSION` field.

#### `NX_MONGO_URL`:

This serves as the location of and authentication for your MongoDB instance. You can host your own database locally if you'd like, or create a free account on [Atlas: Mongodb's cloud platform](https://www.mongodb.com/products/platform/cloud). The free tier stores up to 500MB, so this solution should be valid for the next couple of centuries.

Once you've created your account, follow the [setup instructions](https://www.mongodb.com/docs/atlas/getting-started/) for the Atlas UI to create your own database and set up a database user account Advent of Node can use. From your DB's overview screen, select Connect > Drivers, select Node.js and copy the URL. It should look like:

```
mongodb+srv://<user>:<password>@<url>/?retryWrites=true&w=majority
```

Paste the URL into the `NX_MONGO_URL` variable, making sure to include the password you associated with the account. You can also specify the name of your collection by adding the name to the path. For instance, to name the collection 'adventOfNode', you would use:

```
mongodb+srv://<user>:<password>@<url>/adventOfNode?retryWrites=true&w=majority
```

### Optional environment variables

There are a few more environment variables commented out in the example file. These shouldn't be set unless running a non-standard configuration.

#### `NX_SOLVER_URL`:

By default, `express-app` spawns a [Node child process](https://nodejs.org/api/child_process.html) that runs `solver-app` locally using Nx's `serve` configuration.

If you instead want to run `solver-app` as a completely separate process, setting `NX_SOLVER_URL` disables the above behavior and tells the app which endpoint to request solutions from.

#### `NX_SOLVER_PORT`:

Set this if you have configured `solver-app` to listen to API requests on a port besides the default 3000.

#### `NX_SOLVER_DEBUG_PORT`:

This is used to tell the child process which port to allow `solver-app` debugging on. This defaults to 19229 to match the [launch.json](.vscode/launch.json) configuration, change this if you need the automated process to debug on a different port.

#### `NX_AOC_URL`:

This defaults to "https://adventofcode.com" and should usually not be set unless testing some specific `express-app` changes.

## Usage

### Nx Console

To build and run Advent of Node, open the Nx Console extension and navigate to the _apps_ directory. To solve puzzles, I recommend running

```
react-app > build > production
express-app > serve > production
```

The first step generates the static files for `react-app`. `express-app` will then serve them at the default base url of _http://localhost:3333_ and automatically start the `solver-app` instance.

After `react-app` has been built once, you should only need to run the `express-app:serve` task.

Alternatively, I've set up some build and run tasks in the [tasks.json](.vscode/tasks.json) for use in this project. Look there for some guidelines on setting keybindings.

### Running tasks from the command line

If the Nx Console extension isn't available in your IDE, you will instead need to execute Nx commands from the command line.

```
yarn nx run react-app:build
yarn nx run express-app:serve
```

In general, to execute tasks with Nx use the following syntax:

```
yarn nx <target> <project> <...options>
```

You can also run multiple targets:

```
yarn nx run-many -t <target1> <target2>
```

..or add `-p` to filter specific projects

```
yarn nx run-many -t <target1> <target2> -p <proj1> <proj2>
```

Targets are defined in each project's _project.json_. Learn more [in the Nx docs](https://nx.dev/core-features/run-tasks).

## Solving Advent of Code puzzles

Solutions should be created in the `solver` library. See [its README](libs/solver/solver/README.md) for documentation on solution stub generation, workflow, and more.

## Contributing

To contribute to Advent of Node, fork this repo and commit your code on a new branch. If your changes require adding a library, I recommend adding one via the Nx Console "generate" option, or referring to the Nx docs. Make sure to set scope/type tags in the generator or in 'project.json'.

The test suite is a WIP, but don't break existing tests and make sure any additions include tests.

Prior to opening a PR, make sure to run the following commands from the Nx Console or from the terminal.

```
yarn nx affected --target=test
yarn nx affected --target=lint
```

This project was originally intended for my personal use to solve AoC puzzles, so as a general rule I won't accept changes that modify the workflow without a good reason.

For the same reason, I won't accept additions to the `solver` or `solver-helpers` libraries that include any solution code. I maintain my own solutions and helpers in my private repo and encourage anybody using Advent of Node to do the same.

To develop on `express-app` or `react-app` or any of their libraries, I recommend running their `serve:development` tasks (`express-app` defaults to the 'production' configuration).

Before developing on `react-app`,you will first need to configure the `VITE_EXPRESS_SERVER_URL` environment variable in the [`react-app`](apps/react-app) _.env_ to point to your Express server url. Once you've served the app (default address _http://localhost:4200_), you can take advantage of Vite's live rebuilds and reloads, as well as the "React" VS Code debug configuration for Edge. Debugging in other browsers is possible with some additional setup.

## License

Advent of Node is licensed under the [3-Clause BSD License](https://opensource.org/license/bsd-3-clause/).
