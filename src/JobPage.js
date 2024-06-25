import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid, Typography } from "@mui/material";
import JobListComp from "./jobListComp";
import JobAddComp from "./jobAddComp";

function JobPage() {
	const [jobs, setJobs] = useState([]);

	useEffect(() => {
		fetchJobs();
	}, []);

	const fetchJobs = () => {
		axios
			.get("http://localhost:8080/jobs")
			.then((response) => {
				setJobs(response.data);
			})
			.catch((error) => {
				console.error("Error fetching jobs:", error);
			});
	};

	useEffect(() => {
		const ws = new WebSocket("ws://localhost:8080/ws"); //connecting to ws

		ws.onmessage = (event) => {
			//listening to messages
			const newJob = JSON.parse(event.data);
			setJobs((prevJobs) => {
				//updating existing state based on the recieved message (using unique id to check which job got updated)
				const jobIndex = prevJobs.findIndex((job) => job.id === newJob.id);
				if (jobIndex > -1) {
					return prevJobs.map((job) =>
						job.id === newJob.id ? { ...job, status: newJob.status } : job
					);
				} else {
					return [...prevJobs, newJob];
				}
			});
		};
		return () => {
			ws.close();
		};
	}, []);

	return (
		<Grid>
			<Typography fontSize={30} fontWeight={600} paddingBottom={5}>
				Shortest Job First scheduling - Apica assignment
			</Typography>
			<Grid sx={{ display: "flex", columnGap: 10 }}>
				<JobListComp jobs={jobs} />
				<JobAddComp jobs={jobs} setJobs={setJobs} />
			</Grid>
		</Grid>
	);
}

export default JobPage;
