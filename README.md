# Drawing App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Created by: Akshat Vasudev

To start the project, run the following commands from project root:
```
yarn install
yarn run start
node server/index.js
```

# APPLICATION

## Persistence Layer

I chose to use the `data-store` npm module as my nodeJS persistence layer.  Ideally I would like to use a database like `postgres` with `Sequelize` as the ORM that would have a table for `USERS` that will save the username, password hash and other user details, a table for `DRAWINGS`
that will save the base64 drawing, creation date, time spent drawing, and a `USERS` foreign key.

My data is structured in the following manner:

```
{
<username>:{
 password: string,
 drawings:[{
	drawing: base64 string,
	isPublic: boolean,
	timeSpent: string
	}]
 }
}
```
## Main Component
This component is the entry point of the application and is responsible for the client side routing.  There are 3 routes(/auth, / , /drawing), each of which respectively map to a component below. Each of the following components maintain their own state using useState / this.state

## Authentication Component
The component takes care of letting the user sign up/login with a username and password.  The user cannot access any other pages if they're not authenticated. 

On sign up, the front end makes an API call to start a new session on the server side.  I use the `express-session` module for this purpose. It also adds a new entry to the persistence layer for the new user. Once a new session is created, a new property, username, is added to the `req.session` object.  This property is checked on every other api call to make sure the user is authenticated.

For this app, I am storing the username and password as plain text. An improvement I would make here is to hash the password before persisting it.

I would have liked to improve on the authentication flow: Right now, each component checks to see if a user is authenticated and acts accordingly. Along with this, I would like to add logic on the router level to check for authentication and conditionally load either the required component, if the user is logged in, or the authentication component, if the user isn't.

On every call that is specific to the user, the first thing that is checked is if the user is logged in. If they're not, the rest of the logic is not executed and a 401 is returned. I would like to handle this 401 more gracefully on the client side. For example, if the user gets logged out while on the home screen and tries to delete a drawing, while they are blocked from doing so and the console shows `401 Not Authenticated`, the user is not shown any messaging shown for it.

## Home Page Component
Once the component mounts, it makes an API call to get a list of all public drawings (and the associated details) from all users, and all drawings (not just public) for the logged in user and updates the state with it.

When a drawing is deleted, it makes an API call to an endpoint which looks up the drawing for the logged in user. If a drawing is found, it is deleted from the object and the updated object is set to the persistence layer. 

## Drawing page Component
This is the main page of the application and the most fun to work on.  It gives the user an empty 'canvas' to draw on and gives them a drop down with various options (colors, eraser, line width, visibility settings) to choose from.  Once the user saves the drawing, an API POST call, with all the data, is made to the server which checks for authentication and persists the data.

I missed adding the creation timestamp to the server here. Along with the data already being posted for persistence, I would also send the startTime variable as part of my API call.

I could not add functionality to create a new url for each drawing so the user can share it later. The way I would go about doing this is; when the user goes to the /drawing route, I would make an API call to an endpoint that will return an alpha numeric uuid of length 5, and will create an entry in the persistence layer with the same uuid where the drawing details will be saved. Once I have the UUID on the front end, I will save it to the state and when the user saves the drawing, it will be passed back to the server to persist the drawing in the right object. A shareable url can then be formed that will look like : 'http://localhost:3000/drawings/<uuid>'.
