# FEATURES.md

# Features and Functionalities

## Todo List Page

The main page displays all available todos and provides the following functionalities:

* View all todos
* Add a new todo
* Edit an existing todo
* Delete a todo
* Mark a todo as completed or pending
* Search todos by title
* Filter todos by status
* Sort todos by creation date
* Navigate to the Todo Details page

## Todo Details Page

A separate page displays detailed information for a selected todo.

The page receives the todo ID as a query parameter.

Example:

```
/todo?id=3
```

The page displays:

* Title
* Description
* Completion Status
* Priority
* Category
* Creation Date

## Backend Functionalities

The backend provides RESTful CRUD APIs to manage todos.

Supported operations include:

* Create Todo
* Read All Todos
* Read Single Todo
* Update Todo
* Delete Todo

## Data Storage

Todo data is stored in a JSON file inside the backend to provide persistent storage without requiring a database.

## Responsive Design

The application is designed to work across desktop and mobile devices.
