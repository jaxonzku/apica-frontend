import React, { useEffect, useState } from "react";
import axios from "axios";
import {
	Grid,
	Button,
	Typography,
	Paper,
	InputBase,
	Divider,
	CircularProgress,
} from "@mui/material";

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
	const handleReset = async () => {
		//resets all jobs in backend
		try {
			await axios.delete("http://localhost:8080/jobs");
			setName("");
			setDuration("");
		} catch (error) {
			console.error("Error resetting jobs:", error);
		} finally {
			setJobs([]);
		}
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
				<Grid // left section shows the available tasks and its status
					sx={{
						minWidth: 500,
						background: "#1B1A1D",
						padding: 3,
						minHeight: 300,
						overflowY: "auto",
						maxHeight: "50vh",
						borderRadius: 5,
						boxShadow: "0px 4px 18px rgba(0, 0, 0, 0.5)",
					}}
				>
					{jobs?.map(
						(
							job // maps the response to tiles
						) => (
							<Grid
								key={job.id}
								sx={{
									background: "#484859",
									marginBottom: 1,
									borderRadius: 2,
									display: "flex",
									justifyContent: "space-around",
									alignItems: "center",
								}}
							>
								<Typography fontSize={25} width={"20%"}>
									{job.name}
								</Typography>
								<Typography fontSize={25} width={"20%"}>
									{job.duration / 1e9}s
								</Typography>
								<Grid
									sx={{
										background: getColorByStatus(job.status),
										paddingX: 2,
										display: "flex",
										alignItems: "center",
										borderRadius: 2,
									}}
									width={"23%"}
								>
									<Typography sx={{ color: "white" }}>{job.status}</Typography>
								</Grid>
								{job.status === "running" ? ( // if currently running circular progress
									<CircularProgress color="primary" size={20} width={"20%"} />
								) : null}
							</Grid>
						)
					)}
				</Grid>
				<Grid //right section give a form to add new jobs
					sx={{
						minWidth: 500,
						minHeight: 300,
						background: "#1B1A1D",
						padding: 7,
						borderRadius: 5,
						boxShadow: "0px 4px 18px rgba(0, 0, 0, 0.2)",
					}}
				>
					<form onSubmit={handleSubmit}>
						<Grid
							sx={{
								display: "flex",
								flexDirection: "column",
								marginTop: 10,
								rowGap: 2,
								alignItems: "center",
							}}
						>
							<Paper
								component="form"
								sx={{
									p: "2px 4px",
									display: "flex",
									alignItems: "center",
									width: 400,
									background: "#abc4b2",
								}}
							>
								<InputBase
									placeholder="Job name"
									inputProps={{ "aria-label": "search google maps" }}
									id="outlined-basic"
									label="Job Name"
									variant="outlined"
									onChange={(e) => setName(e.target.value)}
									value={name}
									sx={{
										"& .MuiOutlinedInput-root": { borderColor: "white" },
										ml: 1,
										flex: 1,
									}}
								/>
							</Paper>
							<Paper
								component="form"
								sx={{
									p: "2px 4px",
									display: "flex",
									alignItems: "center",
									width: 400,
									background: "#abc4b2",
								}}
							>
								<InputBase
									placeholder="duration in seconds (number only)"
									inputProps={{ "aria-label": "search google maps" }}
									id="outlined-basic"
									label="Duration (s)"
									variant="outlined"
									onChange={(e) => setDuration(e.target.value)}
									value={duration}
									sx={{
										"& .MuiOutlinedInput-root": { borderColor: "white" },
										ml: 1,
										flex: 1,
									}}
								/>

								<Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
							</Paper>

							<Button
								variant="contained"
								type="submit"
								sx={{
									"&.Mui-disabled": {
										background: "gray",
										color: "white",
									},
								}}
								disabled={
									name === "" || duration === "" || isNaN(parseInt(duration)) //should fill both fields and duration in number
								}
							>
								Submit Job
							</Button>
						</Grid>
					</form>
					<Button
						variant="contained"
						onClick={handleReset}
						sx={{
							"&.Mui-disabled": {
								background: "gray",
								color: "white",
							},
						}}
						disabled={
							jobs.length === 0 //should fill both fields and duration in number
						}
					>
						Reset
					</Button>
				</Grid>
			</Grid>
		</Grid>
	);
}

function getColorByStatus(status) {
	switch (status) {
		case "pending":
			return "red";
		case "running":
			return "blue";
		case "completed":
			return "green";
		default:
			return "black";
	}
}

export default JobList;
