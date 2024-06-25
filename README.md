# apica-frontend

# Getting Started with SJF Apica test

## Available Scripts

In the project directory, you can run:

### git clone [https://github.com/jaxonzku/apica-frontend]

### `cd apica-frontend`

### `npm install`

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

# Components

## JobListComp

Displays the list of jobs with their statuses.

Props
jobs: Array of job objects.
JobPage
Main component that fetches jobs, listens to WebSocket messages, and updates job statuses.

## JobAddComp

Provides a form to add new jobs and a button to reset the job list.

Props
jobs: Array of job objects.
setJobs: Function to update the jobs state.

