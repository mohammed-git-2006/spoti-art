## SpotiArt
SpotiArt is a weekend hobby project, destroyed by the Spotify API policies.
The main idea of the project to analyse the user's spotify tracks and albums, creating a beautiful visual experience for your hear age, top tracks, top artists, and some analytics.
---
## Local use
You can download the project and run locally, but you have to define these value in the .env file:

```
SPOTIFY_CLIENT_ID={}
SPOTIFY_CLIENT_SECRET={}
MONGO_DB_URI={}
DEV_MODE=TRUE
REDIRECT_URI=http://127.0.0.1:3000/
TRACKS_TIME_RANGE=long_term
BASE_URL=http://127.0.0.1:3000
```
---
## Finally
After entering the values in the .env file you can run it locally with either 'npm run dev' or 'bun run dev', 
also don't forget to setup your mongodb by creating a DB named 'spotiart', collection are created manually by the project.

Have fun!