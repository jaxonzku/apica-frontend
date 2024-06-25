import { Grid, Typography, CircularProgress } from "@mui/material";

function JobListComp({ jobs }) {
	const getColorByStatus = (status) => {
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
	};

	return (
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
	);
}

export default JobListComp;
