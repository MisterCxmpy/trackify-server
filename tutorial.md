# Structuring Modular Services for a Project Management Web Application

In this guide, we'll walk through the process of structuring modular services for a project management web application using Express API. This approach allows for easy integration with various storage technologies while maintaining a clean and organized codebase.

## Folder Structure

Here's a recommended folder structure for your project:

```bash
project-management-app/
│
├── controllers/
│   ├── teamController.js
│   ├── memberController.js
│   └── ticketController.js
│
├── services/
│   ├── teamService.js
│   ├── memberService.js
│   └── ticketService.js
│
├── routes/
│   ├── teamRoutes.js
│   ├── memberRoutes.js
│   └── ticketRoutes.js
│
├── models/
│   ├── teamModel.js
│   ├── memberModel.js
│   └── ticketModel.js
│
├── app.js
└── ...
```

## Services

### Team Service (`teamService.js`)

Handles operations related to teams.

```javascript
const TeamService = {
  createTeam: (teamData) => { ... },
  addMember: (teamId, memberId) => { ... },
  addToBacklog: (teamId, ticketId) => { ... },
  // ...
};

module.exports = TeamService;
```

### Member Service (`memberService.js`)

Manages member-related operations.

```javascript
const MemberService = {
  createMember: (memberData) => { ... },
  assignTicket: (memberId, ticketId) => { ... },
  updateTicketStatus: (memberId, ticketId, newStatus) => { ... },
  // ...
};

module.exports = MemberService;
```

### Ticket Service (`ticketService.js`)

Handles ticket-related operations.

```javascript
const TicketService = {
  createTicket: (ticketData) => { ... },
  updateTicket: (ticketId, newTicketData) => { ... },
  changeTicketState: (ticketId, newState) => { ... },
  // ...
};

module.exports = TicketService;
```

## Controllers

### Team Controller (`teamController.js`)

Connects routes with the Team Service.

```javascript
const TeamService = require('../services/teamService');

const TeamController = {
  // Define route handler methods that use TeamService
};

module.exports = TeamController;
```

### Member Controller (`memberController.js`)

Connects routes with the Member Service.

```javascript
const MemberService = require('../services/memberService');

const MemberController = {
  // Define route handler methods that use MemberService
};

module.exports = MemberController;
```

### Ticket Controller (`ticketController.js`)

Connects routes with the Ticket Service.

```javascript
const TicketService = require('../services/ticketService');

const TicketController = {
  // Define route handler methods that use TicketService
};

module.exports = TicketController;
```

## Routes

### Team Routes (`teamRoutes.js`)

Maps endpoints to Team Controller methods.

```javascript
const express = require('express');
const router = express.Router();
const TeamController = require('../controllers/teamController');

// Define routes that use TeamController methods

module.exports = router;
```

### Member Routes (`memberRoutes.js`)

Maps endpoints to Member Controller methods.

```javascript
const express = require('express');
const router = express.Router();
const MemberController = require('../controllers/memberController');

// Define routes that use MemberController methods

module.exports = router;
```

### Ticket Routes (`ticketRoutes.js`)

Maps endpoints to Ticket Controller methods.

```javascript
const express = require('express');
const router = express.Router();
const TicketController = require('../controllers/ticketController');

// Define routes that use TicketController methods

module.exports = router;
```

## Models

Define data models for teams, members, and tickets (`teamModel.js`, `memberModel.js`, `ticketModel.js`) using any storage technology (e.g., a database or in-memory store).

In our case, this is sequelize for a good ORM for postgres and other SQL databases.

```javascript

const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize'); // Import your Sequelize instance
const User = require('./UserModel');

const { v4: uuidv4 } = require('uuid');

const Team = sequelize.define('Team', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: () => uuidv4() // Create a long unique Id for each team 
    },
    team_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    backlog: {
        type: DataTypes.ARRAY(DataTypes.INTEGER), // Assuming backlog contains ticket IDs
        defaultValue: [] // Initialize with an empty array
    }
});

// Define associations
Team.hasMany(User, { foreignKey: 'team_id', as: 'members' });

module.exports = Team;


```

## App Setup (`app.js`)

Set up your Express application, configure routes, and start the server.

```javascript
const express = require('express');
const app = express();

// Configure middleware, routes, and error handling

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

## Conclusion

By organizing your project using this modular structure, you can easily integrate different storage technologies into your services while maintaining clear separation of concerns. This approach promotes testability, maintainability, and scalability as your project evolves.
