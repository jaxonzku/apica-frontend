import React, { useEffect, useState } from "react";
import axios from "axios";
import { TextField, Grid, Button } from "@mui/material";

function JobList() {
	const [jobs, setJobs] = useState([]);
	const [name, setName] = useState("");
	const [duration, setDuration] = useState("");

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

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await axios.post("http://localhost:8080/jobs", {
				name,
				duration: parseInt(duration),
			});
			setName("");
			setDuration("");
		} catch (error) {
			console.error("Error submitting job:", error);
		}
	};

	useEffect(() => {
		const ws = new WebSocket("ws://localhost:8080/ws");
		ws.onmessage = (event) => {
			const newJob = JSON.parse(event.data);
			setJobs((prevJobs) => {
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
		<div>
			{jobs?.map((job) => (
				<div key={job.id} style={{ color: getColorByStatus(job.status) }}>
					{job.name} - {job.duration}s - {job.status}
				</div>
			))}
			<form onSubmit={handleSubmit}>
				<Grid
					sx={{
						display: "flex",
						flexDirection: "column",
						marginTop: 10,
						rowGap: 2,
					}}
				>
					<TextField
						id="outlined-basic"
						label="Job Name"
						variant="outlined"
						onChange={(e) => setName(e.target.value)}
						value={name}
					/>
					<TextField
						id="outlined-basic"
						label="Duration (s)"
						variant="outlined"
						onChange={(e) => setDuration(e.target.value)}
						value={duration}
					/>
					<Button variant="contained" type="submit">
						Submit Job
					</Button>
				</Grid>
			</form>
		</div>
	);
}

function getColorByStatus(status) {
	switch (status) {
		case "pending":
			return "blue";
		case "running":
			return "blue";
		case "completed":
			return "green";
		default:
			return "black";
	}
}

export default JobList;
