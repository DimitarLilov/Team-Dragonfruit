# Team-Dragonfruit

Project Assignment for the JavaScript Core Module @ SoftUni
Design and implement a Single-Page Application, using JavaScript and tools of your choice.


1. Technologies:

Your project must demonstrate the use of the following:
  - JavaScript – your main functionality must be in JS
  - Structured Code – split your code into modules and make use of programming patterns, such as MVC
  - Templating and Routing – use a library of your choice (mustache and sammy, React and React-Router)
  - HTML & CSS – provide a UI for the user; bootstrap and other libraries are optional
  - Backend Service – your app must communicate with a REST service or API via AJAX calls or a web socket (Kinvey or a provider of your choice)
You are allowed to mix and match libraries as you see fit, but be prepared to motivate their usage.


2. Project Scope:

Your project should implement at least the following functionality:
  - User registration, login and logout
  - View some content (e.g. blog articles, listings, photos, issues, publications)
  - Create new content (e.g. post new blog article, post new listing, upload new photo, create new issue)
  - Edit existing content(e.g. editing blog post content, photo captions, issue status)
  - Delete existing content(e.g. deleting posts, issues, photoes, publications)
  - An admin role, able to modify other users’ profiles or data
Your project should keep its data in a Kinvey or some other backend service. You may implement any additional functionality as you see fit.


3. Project:

Online Ticket Store

Create a Web-based application for selling tickets for various venues (concerts, festivals, theater plays, etc.). The web application is supposed to include two parts:
  - Categorized catalog of venues with ability to view detailed information and purchase tickets
  - Administration interface for addition, editing and deletion of events
  - Provide the following functionality to all visitors (without authentication):
  - View upcoming events
  - Browse categories of events
  - Advanced search (by category, date, price, location, etc.)
  - View details about an event (information, location, date, price and availability of tickets)
  
In addition to the previous functionality, registered users can:
  - Purchase tickets
  - Manage their profile
  
Authenticated administrators should be able to:
  - Create / edit / delete events
  - Manage available tickets
Ticket count is updated live, to avoid conflicts. When purchasing a ticket, a user registration is required, but product basket is preserved.
