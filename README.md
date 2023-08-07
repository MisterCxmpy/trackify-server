# MVP Web Server

## Live application
(https://trackify-srv.onrender.com)[https://trackify-srv.onrender.com]

The objective is to make a web server that acts as a backend for a project management /bug tracker application.

The main data anchor in this case would be the "teams" you'll be able to create these with a user account and invite people to contribute to your project.

When a user has access to a project, they are able to see the amount of tasks in which are on the backlog of the team, add and edit tickets in the backlog (bugs is a bad term as it's not just bugs we're tracking it's tasks too), see other members and filter the tickets available.

The tickets themselves will be reminiscent of what is already available via Trello, Azure DevOps and other project management software.

## Later Condiderations

- Adding the concept of sprints/project timespans/deadlines later on

## Services and Architecture

- User service - responsible for creating and interfacing with the user data type
- Teams service - responsible for creating, interfacing and updating teams
- Tickets service - responsible for creating, searching, updating status of, etc of tickets
- Auth service - jwt authentication and authorisation (depending on what we're looking for I might add the ability to have different roles ie project admin, contributor, stakeholder, etc)

## Example Data

```javascript
const team = {
    team_name: 'blah',
    members: [1235, 5432, 5436, 5435, 2345],
    backlog: ["## Aggrigate of all member tasks by id"],
    completed_tickets: [21, 22, 33],
    in_progress_tickets: [43]
}

const member = {
    id: 1235,
    name: "mike oxlong",
    completed_tickets: [21, 22, 33],
    in_progress_tickets: [43]
}

const ticket = {
    id: 43,
    title: "Logic App Deployment",
    tags: ["Azure Automation"],
    owner: 1235,
    state: 'To Do',
    description: "Automating the deployment of our logic app to streamline BAU processes."
}
```
