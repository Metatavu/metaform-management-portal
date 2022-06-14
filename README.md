# Getting started with React Typescript template

### `Add OpenApi specification file (swagger.yaml)`

File can be added as a Git submodule, which helps the development with different spec versions:

```sh
  git submodule add git@github.com:example-api-spec.git
```

### `Update api spec generator command`

Change the command inside *package.json* to match the added API specification file location

```json
  ...
  "scripts": {
    ...
    "build-client": "... -i example-api-spec/swagger.yaml ..."
  }
```

### `Add environment variables`

To add necessary environment variables, create .env file to project root folder and write variables inside it with following syntax:

```
REACT_APP_EXAMPLE_ENVIRONMENT_VARIABLE=variable-value
REACT_APP_EXAMPLE_API_URL=https://example-api.example.com
...
```

### `Update public folder contents to match the project`

* Change title and description in *index.html*
* Update *favicon.ico*, *logo192.png* and *logo512.png*
* Update names and icon references in *manifest.json*

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run lint`

Fixes all linting problems reported by ESLint in the project.
**Always confirm the changes afterwards!**

### `npm run build-client`

Generates API client from the provided specification file into *src/generated/client*