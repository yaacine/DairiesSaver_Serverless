# Serverless Dairies App

This project, implements a simple Dairies savind application using AWS Lambda and Serverless framework. 

# Functionality of the application

This application will allow creating/removing/updating/fetching Dairy items. Each Dairy item can optionally have an attachment image. Each user only has access to Dairy items that he/she has created.

# Dairy items

The application should store Dairy items, and each Dairy item contains the following fields:

* `dairyId` (string) - a unique id for an item
* `createdAt` (string) - date and time when an item was created
* `name` (string) - name of a TODO item (e.g. "Change a light bulb")
* `dueDate` (string) - date and time by which an item should be completed
* `done` (boolean) - true if an item was completed, false otherwise
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a TODO item


All functions are already connected to appropriate events from API Gateway.

An id of a user can be extracted from a JWT token passed by a client.


# Frontend

The Frontend of the application was created by modifying the code of the client project of the 4th project

The `client` folder contains a web application that can use the API that should be developed in the project.




# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless TODO application.
