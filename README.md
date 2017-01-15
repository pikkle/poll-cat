# poll-cat
Interactive poll app for the TWEB course at HEIG-VD.<br>The team is composed by [Loïc Serafin](https://github.com/pikkle) and [Julien Leroy](https://github.com/limayankee)<br>

## Brief description
This project intends to offer a web application usable by a speaker and its audience, mainly for a teacher and his/her students.<br>
They can interract with each other with questions and polls. Only the speaker can open a poll which the user can respond to.
The speaker can also have a visualisation for each poll showing statistics of poll participations. The audience can also ask
questions about the speech and can comment existing questions. They can also evaluate the relevance of a question.

### Landing page
A full description of the application usage can be found on [https://pikkle.github.io/poll-cat/](https://pikkle.github.io/poll-cat/)

## Technologies
We will use the following technologies:
### Client technologies
- [Angular2](https://angular.io/)
- [Webpack](https://webpack.github.io/)
- [Npm](https://www.npmjs.com/)
- [WebSocket](https://www.python.org/)

### Server technologeis
- [Python](https://www.python.org/)
- [Django](https://www.djangoproject.com/)
- [MySQL](https://www.mysql.com/)
- [Channels (ws)](http://socket.io/)

## Instructions
There is nothing to be run at the moment. 

## Mockups
The application mockups can also be viewed on the [landing page](https://pikkle.github.io/poll-cat/) without the actions and links descriptions.<br>
The mockups were made with the web application [Moqups](https://moqups.com/).

#### Index page
a simple index page that leads to either joining or opening a room
![Simple index page](doc/mockups/mockup1.png)

#### The room creation interface
a simple interface to create a room. Lets the choice to the room admin to let the other users to post questions or not.
![a simple interface to create a room. Lets the choice to the room admin to let the other users to post questions or not.](doc/mockups/mockup2.png)

#### The room displaying interface
that shows simply the room number for your audience to join in.
![The room displaying interface for easy joining](doc/mockups/mockup3.png)

#### The room joining interface
that has a simple form to join in a room.
![The room joining interface to join in easily](doc/mockups/mockup4.png)

#### The audience interface
that shows live questions from other people in white stickers, and pollings from the speaker in yellow stickers.
![The audience interface, showing live questions from other people in white stickers, and pollings from the speaker in yellow stickers.](doc/mockups/mockup5.png)

#### The comment interface
that allow users to comment questions.
![The comment interface that allow users to comment questions.](doc/mockups/mockup6.png)

#### The speaker interface
that shows questions from the audience and access to live results to polls.
![The speaker interface that shows questions from the audience and access to live results to polls.](doc/mockups/mockup7.png)

#### The stats interface
that shows a bar chart of responses from the audience to a poll.
![The stats interfacethat shows a bar chart of responses from the audience to a poll.](doc/mockups/mockup8.png)
