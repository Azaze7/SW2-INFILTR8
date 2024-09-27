<script src="https://unpkg.com/ionicons@5.4.0/dist/ionicons.js"></script>

<body>
	<button type="button" class="button">
		<span class="button__text">Create Project</span>
		<span class="button__icon">
			<ion-icon name="add-circle-outline"></ion-icon>
		</span>
	</button>

    <button type="button" class="button">
		<span class="button__text">Open Project</span>
		<span class="button__icon">
			<ion-icon name="folder-outline"></ion-icon>
		</span>
	</button>

    <button type="button" class="button">
		<span class="button__text">Sync Project</span>
		<span class="button__icon">
			<ion-icon name="cloud-download-outline"></ion-icon>
		</span>
	</button>

    <button type="button" class="button discard-button">
		<span class="button__text">Discard Project</span>
		<span class="button__icon">
			<ion-icon name="trash-outline"></ion-icon>
		</span>
	</button>

</body>

<style>
    .button {
	display: flex;
	justify-content: space-between; /* Space between text and icon */
	align-items: center; /* Vertically align text and icon */
	width: 300px; /* Set a fixed width for all buttons */
	height: 50px;
	padding: 5px;
	background: #009578;
	border: none;
	outline: none;
	border-radius: 5px;
	overflow: hidden;
	font-family: "Quicksand", sans-serif;
	margin-bottom: 10px; /* Adds space between buttons */
	font-size: 16px;
	font-weight: 500;
	cursor: pointer;
}

.button:hover {
	background: #008168;
}

.button:active {
	background: #006e58;
}

.button__text {
	flex-grow: 1; /* Make the text take up the remaining space */
	color: #fff;
	padding-left: 24px; /* Add some padding to the left for better spacing */
}

.button__icon {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	font-size: 1.5em;
	background: rgba(0, 0, 0, 0.08);
	padding: 0 24px;
}

.discard-button {
	background: #ff4c4c;
}

.discard-button:hover {
	background: #e60000;
}

.discard-button:active {
	background: #cc0000;
}

</style>