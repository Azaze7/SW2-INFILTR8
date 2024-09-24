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

    <button type="button" class="button">
		<span class="button__text">Discard All</span>
		<span class="button__icon">
			<ion-icon name="trash-outline"></ion-icon>
		</span>
	</button>

</body>

<style>
    .button {
	display: flex;
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

.button__text,
.button__icon {
	display: inline-flex;
	align-items: center;
	padding: 0 24px;
	color: #fff;
	height: 100%;
}

.button__icon {
	font-size: 1.5em;
	background: rgba(0, 0, 0, 0.08);
}
</style>

