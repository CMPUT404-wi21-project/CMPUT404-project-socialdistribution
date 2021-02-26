# Frontend
***Using the React Framework***
* Assume all commands are being run from within the `frontend/` directory
## Prerequisites
- Ensure you have node and npm installed: <br>
`https://docs.npmjs.com/downloading-and-installing-node-js-and-npm`

- Install npx
```
npm install npx
```
- Instal yarn
```
npm install --global yarn
```

## Start Development Server
```
yarn start
```

### Build for Production
```
yarn build
```

### Start Tests
```
yarn test
```

### env file
- Add in file .env, with `REACT_APP_HOST=<your-Host>`, has to start with `REACT_APP` to let react read in env var
