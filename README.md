# Scavenger-html

## General Idea
- Users can create, play, and browse for scavenger hunts. The end goal is to have users compete in scavenger hunt games. 

## My Process
- I wanted to focus on the general idea of hunt as the main feature. Each hunt is comprised of "hunt items". For my current implementation,
I decided to keep hunt items as a question (text display), and answer (text input). Later on, I will expand this idea of hunt items as described in some of my description for the hunts I have already created. 

## Current Feature Progress
- Create: Users can create their own scavenger hunt by hitting the create button. In the create page, users can add the title and description of the hunt. They can add a hunt item into the hunt by inputting a question and answer and hitting the submit button. The hunt items will be saved if the user submitted the items but not the hunt. 
- Play: Users can play a game following this flow: hit play button in userhome/browse -> newgame -> startgame (shows players) => playgame (actually plays the game) -> userhome
- Browse: If users don't want to create their own scavenger hunt, they can choose a hunt to play and go through the same process outlined in play.

## Next Steps
- Create:
  - Hello


## What you need to change

- Change the font in utilities.css
- Change the Frontend CLIENT_ID for Google Auth (Skeleton.js) (we'll talk about it at the end of week 2)
- Change the Server CLIENT_ID for Google Auth (auth.js) (we'll talk about it at the end of week 2)
- Change the Database SRV for Atlas (server.js)
- Change the Database Name for MongoDB (server.js)
- Add a favicon to your website at the path client/dist/favicon.ico
- Update website title in client/dist/index.html
- Update this README file ;)
- Update the package.json file with your app name :) (line 2)

## Socket stuff
Note: we'll be getting to this in lecture in week 2, so don't worry if you don't know it yet

- If you're not using realtime updating or don't need server->client communication, you can remove socket entirely! (server-socket.js, client-socket.js, and anything that imports them)
- If you are using socket, consider what you want to do with the FIXME in server-socket.js


## How to integrate into your own project

On GitHub download this repository as a zip file, then extract the files into your own repository.
Warning: make sure you copy the hidden files too: .babelrc, .gitignore, .npmrc, and .prettierrc

## don't touch

the following files students do not need to edit. feel free to read them if you would like.

```
client/src/index.js
client/src/utilities.js
client/src/client-socket.js
server/validator.js
server/server-socket.js
.babelrc
.npmrc
.prettierrc
package-lock.json
webpack.config.js
```

## Good luck on your project :)
