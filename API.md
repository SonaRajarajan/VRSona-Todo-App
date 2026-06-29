# API.md

# REST API Documentation

## Base URL

```
http://localhost:5000
```

---

## Get All Todos

**GET**

```
/todos
```

Returns a list of all todos.

---

## Get Single Todo

**GET**

```
/todos/:id
```

Returns details of a specific todo.

---

## Create Todo

**POST**

```
/todos
```

### Sample Request

```json
{
  "title": "Buy Milk",
  "description": "Purchase from the supermarket",
  "completed": false,
  "priority": "High",
  "category": "Personal"
}
```

---

## Update Todo

**PUT**

```
/todos/:id
```

Updates an existing todo.

---

## Delete Todo

**DELETE**

```
/todos/:id
```

Deletes the specified todo.

---

## Storage

All todo information is stored in:

```
backend/data/todos.json
```
