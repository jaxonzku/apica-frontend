import React, { useState } from "react";
import { Grid, Button, Paper, InputBase, Divider } from "@mui/material";
import axios from "axios";
function JobAddComp({ jobs, setJobs }) {
	const [name, setName] = useState("");
	const [duration, setDuration] = useState("");

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

	return (
		<Grid sx={{ display: "flex", columnGap: 10 }}>
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
	);
}
export default JobAddComp;
