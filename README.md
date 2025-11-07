<a id="readme-top"></a>

![Node.js][Node.js]
![Typescript][Typescript]
![Express.js][Express.js]
![jsonwebtoken][jsonwebtoken]
![MongoDB][MongoDB]
![Zod][Zod]
![Pino][Pino]
![Jest][Jest]
![Docker][Docker]

<h1 align="center"> Resto API </h1>

A RESTful API service for managing restaurant operations including menu management, order processing, and customer data. Built to provide a comprehensive backend solution for restaurant management systems, food delivery platforms, and point-of-sale applications.

<br/>

## Getting Started

### Installation

```sh
git clone https://github.com/Felix-hafiz/resto-api.git
npm install
npm run dev
```

> [!NOTE]
> Don't forget to make `.env` file for your needs. please refer to `.env-example` file

### Usage

The API is accessible at `http://localhost:3000`. You may change the port in `.env` file

### Endpoints

##### Menu

- **GET /menus**: Retrieves a list of menu items.
- **GET /menus/:id**: Retrieves a specific menu item by ID.
- **POST /menus**: Creates a new menu item.
- **PUT /menus/:id**: Updates a specific menu item by ID.
- **DELETE /menus/:id**: Deletes a specific menu item by ID.

##### User

- **GET /users**: Retrieves a list of users.
- **GET /users/:id**: Retrieves a specific user by ID.
- **POST /users**: Creates a new user.
- **PUT /users/:id**: Updates a specific user's details by ID.
- **DELETE /users/:id**: Deletes a specific user by ID.

##### Order

- **GET /orders**: Retrieves a list of all orders.
- **GET /orders/:id**: Retrieves a specific order item by ID.
- **POST /orders**: Creates a new order item.

##### Auth

- **POST /register**: Registers a new user account.
- **POST /login**: Authenticates a user and issues tokens.
- **POST /refresh**: Refreshes an expired access token using a refresh token.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[Node.js]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node-url]: https://nodejs.org/
[Typescript]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[Typescript-url]: https://www.typescriptlang.org/
[Express.js]: https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white
[Express-url]: https://expressjs.com/
[jsonwebtoken]: https://img.shields.io/badge/jsonwebtoken-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white
[jsonwebtoken-url]: https://jwt.io/
[MongoDB]: https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]: https://www.mongodb.com/
[Zod]: https://img.shields.io/badge/Zod-3E67A2?style=for-the-badge&logo=zod&logoColor=white
[Zod-url]: https://zod.dev/
[Pino]: https://img.shields.io/badge/Pino-333333?style=for-the-badge&logo=pino&logoColor=white
[Pino-url]: https://getpino.io/
[Jest]: https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white
[Jest-url]: https://jestjs.io/
[Docker]: https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white
[Docker-url]: https://www.docker.com/
