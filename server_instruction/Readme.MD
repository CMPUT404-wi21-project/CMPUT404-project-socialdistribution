# deploy to heroku instruction

## git branch on different folders
* these two commands shall establish subtree branches for `frontend` and `backend` on project git branch
* you should get back to project branch and run next command, running command in subtree branch result in error
``` 
make start-server-backend

make start-server-frontend
```

## change to different branch and proceed
* `git checkout fronend` and `git checkout backend`, in order
* the following set up need to get repeated on `frontend` and `backend` branches

## push code to heroku server
* running following commands shall connect branches to the heroku servers
* if account is not set up, sign up first


- run following commands if you have not create the `frontend` and `backend` host app on heroku
```
heroku login

heroku create <name of the heroku server>

************for backend only:

heroku addons:create heroku-postgresql:hobby-dev
```
- get db link by `heroku config -s | grep DATABASE_URL`
- for backend only, run `heroku config:set DISABLE_COLLECTSTATIC=1` to stop checking for django
- for frontend only, run `heroku create $APP_NAME --buildpack mars/create-react-app` to add react build pack

- bind code to heroku server
  - `git remote -v` to check if the remote is created
  - if no remote called heroku, set manually `git remote add heroku <heroku app git link>`, note it is git link, not app link. It will be better to set up `frontend` `backend` with different name of remote because the sit remote will stay after change branch, remote names such as `heroku-backend` is good, `heroku-frontend` for this read me, I will assume the remote name is `heroku`.
  - for backend branch, add env file, remember to have `HEROKU_HOST` and `DATABASE_URL` set up
  ```
  POSTGRES_DB=mydb_dev
  POSTGRES_NAME=mydb_dev
  POSTGRES_USER=coolusername
  POSTGRES_PASSWORD=password
  HOST_URL=http://127.0.0.1:8000/
  HEROKU_HOST = '<your app link not heroku git link>'
  DATABASE_URL = '<heroku postgres link>'
  DEBUG=1
  ```
  - then, `git push heroku +HEAD:main`, it will deploy your current code up to the logged in app

## wait for deployment