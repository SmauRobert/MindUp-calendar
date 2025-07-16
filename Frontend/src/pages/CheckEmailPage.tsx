export default function CheckEmailPage() {
	return (
		<div
			style={{
				display: "flex",
				minHeight: "100vh",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<div
				style={{
					width: 350,
					padding: 32,
					background: "#fff",
					borderRadius: 12,
					boxShadow: "0 4px 24px #0002",
					textAlign: "center",
				}}
			>
				<h2 style={{ marginBottom: 12 }}>Verify Your Email</h2>
				<p>
					Please check your inbox and click on the verification link
					we sent you.
					<br />
					After verifying, you may log in.
				</p>
			</div>
		</div>
	);
}
