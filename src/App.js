import "./App.css";
import JobList from "./JobPage";

import { Typography, Grid } from "@mui/material";

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<Typography>Job App</Typography>
				<Grid
					sx={{ display: "flex", flexDirection: "column", background: "gray" }}
				>
					<JobList />
				</Grid>
			</header>
		</div>
	);
}

export default App;

