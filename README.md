# Advent of Node

A full-stack dev environment to solve [Advent of Code](https://adventofcode.com) challenges in TypeScript.

<img src="https://img.shields.io/badge/yarn-v1.22.19-blue" /> <img src="https://img.shields.io/badge/Nx-v17.0.3-blue" /> <img src="https://img.shields.io/badge/React-v18.2.0-blue" /> <img src="https://img.shields.io/badge/Express-v4.18.1-blue" /> <img src="https://img.shields.io/badge/license-BSD--3-green" />

## About

Advent of Node is a full webapp stack bundled in an [Nx monorepo](https://nx.dev/) workspace and configured to use TypeScript. The repo includes two apps: the backend `express-app` and frontend `react-app` along with their required libraries.

`express-app` is a Node Express server intended as a solution space for a single developer and should only ever be hosted locally. The server also fetches a puzzle's input and description for the user's account from the Advent of Code website, then stores the data in a personal Atlas MongoDB cloud instance to avoid hammering the AoC site.

`react-app` is a React UI app that interacts with the Express API. The user can open a puzzle to read its description and test their solution using either their puzzle input or a custom input entered on the right side of the UI. Custom inputs can be added, saved, modified, renamed, etc., and are also stored in Mongo alongside the user's provided puzzle input.

<img src="https://i.imgur.com/ap7gRkX.png"/>

Opening a puzzle for the first time triggers the fetch from AoC, and renders the puzzle description and input pane side-by-side. Solutions should be submitted on the AoC website as normal, but the puzzle description can then be updated using the star button in the upper-right of the UI.

## Requirements

Advent of Node requires the following to run:

- [Node.js](https://nodejs.org/en/) minimum version 16.20.1
- [npm](https://www.npmjs.com/), usually bundled with Node.js
- [Yarn](https://yarnpkg.com/) (install with `npm install -g yarn`)
- [MongoDB Atlas](https://www.mongodb.com/products/platform/cloud), Mongo's free cloud service.

Advent of Node is configured for development in [Visual Studio Code](https://code.visualstudio.com/). As an alternative, Jetbrains IDEs are also [supported by Nx](https://nx.dev/core-features/integrate-with-editors).

For the best experience, I recommend the Firefox web browser since that's my browser of choice and I've done very little testing on other browsers.

## Setup

### Initialization

Clone or download the repository, then navigate to the project directory and install required packages by running

```
yarn
```

I recommend installing the Nx console extension if it's available in your IDE. In VS Code, you should get a popup asking you to install it along with other recommended extensions.

### Environment

Prior to running the project, you will need to set some environment variables. There are _.env.example_ files in the main directories of both apps. You will need to add a _.env_ file at the same level in each app and copy the variable assignments from the _.env.example_.

The _react-app/.env_ file should work out of the box. However, since `express-app` communicates with both the AoC website and your MongoDB instance, you will need to configure its _.env_ a bit.

`NX_AOC_SESSION`: This session ID is how you get your own account's data from the AoC website. AoC allows you to sign in using your account with another service that supports [OAuth](https://en.wikipedia.org/wiki/OAuth), but doesn't offer its own OAuth endpoint (which is probably [a good thing](https://medium.com/@ibm_ptc_security/oauth-2-0-security-and-vulnerabilities-86e64c22b03d)). As a result, this is basically the only way for your Advent of Node instance to access account-specific data (like your puzzle input).

1. Sign in to https://adventofcode.com
2. Open the browser's dev console with F12 and navigate to the "Network" tab.
3. Select the first adventofcode.com "GET" request (you may need to refresh the page for the list to populate).
4. Under "Cookies", copy the "session" value. This should be a long string representing the hexadecimal value of your sessionId.
5. Paste the string into `NX_AOC_SESSION` field.

`NX_MONGO_URL`: This serves as the location of and authentication for your MongoDB instance. You can host your own database locally if you'd like, or create a free account on [Mongodb's cloud platform](https://www.mongodb.com/products/platform/cloud). The free tier stores up to 500MB, so this solution should be valid for the next couple of centuries.

Once you've created your account, follow the [setup instructions](https://www.mongodb.com/docs/atlas/getting-started/) for the Atlas UI to create your own database and a database user account. From your DB's overview screen, select Connect > Drivers, select Node.js and copy the URL. It should look like:

```
mongodb+srv://<user>:<password>@<url>/?retryWrites=true&w=majority
```

Paste the URL into the `NX_MONGO_URL` variable, making sure to include the password you associated with the account. You can also specify the name of your collection by adding the name to the path. For instance, to name the collection 'adventOfNode', you would use:

```
mongodb+srv://<user>:<password>@<url>/adventOfNode?retryWrites=true&w=majority
```

## Usage

### Nx Console

To build and run the apps, open the Nx Console extension and navigate to `react-app` and `express-app` under the _apps_ directory. To solve puzzles, I recommend running

```
react-app:preview:production
```

to host the React app at _http://localhost:4300_ and

```
express-app:serve:development
```

which will serve the Express app at _http://localhost:3333_

Alternatively, I've set up some build and run tasks in the tasks.json for use in this project. Look there for some guidelines on setting keybindings.

### Running tasks from the command line

If the Nx Console extension isn't available in your IDE, you will instead need to execute Nx commands from the command line.

```
yarn nx run react-app:preview
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

Solutions should be created in the `solver` library. See its README for documentation on solution stub generation, workflow, and more.

## Contributing

To contribute to Advent of Node, clone this repo locally and commit your code on a separate branch. If your changes require adding a library, I recommend adding one via the Nx Console "generate" option, or referring to the Nx docs. Make sure to set scope/type tags in the generator or in 'project.json'.

The test suite is a WIP, but don't break existing tests and make sure any additions include tests.

Prior to opening a PR, make sure to run the following commands from the Nx Console or from the terminal.

```
yarn nx affected --target=test
yarn nx affected --target=lint
```

This project was originally intended for my personal use to solve AoC puzzles, so as a general rule I won't accept changes that modify the workflow without a good reason.

For the same reason, I won't accept additions to the `solver` or `solver-helpers` libraries related to solving AoC challenges. I maintain my own solutions and helpers in my private repo and encourage anybody using Advent of Node to do the same.

## License

Advent of Node is licensed under the [3-Clause BSD License](https://opensource.org/license/bsd-3-clause/).
