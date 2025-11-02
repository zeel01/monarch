/** 
 * Stores the positions of all monarch windows in order to restore them later
 * 
 * @type {Object<string, {left: number, top: number, width: number, height: number, scale: number}>}
 */
let windowPositions = {};

/**
 * Loads the window positions from local storage
 *
 * @export
 */
export function loadWindowPositions() {
	const data = window.localStorage.getItem("monarch-windows") || "{}";
	try { windowPositions = JSON.parse(data) || {}; }
	catch (e) {
		// If there was an error parsing the data, reset it.
		window.localStorage.setItem(
			"monarch-windows",
			JSON.stringify(windowPositions)
		);
	}
}


/**
 * Restores all monarch windows to their previous position
 *
 * @export
 * @return {Promise<void>}
 */
export async function restoreWindows() {
	loadWindowPositions();

	const positions = Object.entries(windowPositions);

	await Promise.all(positions.map(restoreWindow));
}


/**
 * Re-renders and restores the position of a window that was open previosuly.
 *
 * @param {[uuid: string, position: object]}
 * @return {Promise<void>} 
 */
async function restoreWindow([uuid, position]) {
	const object = await fromUuid(uuid);
	if (!object) return;

	position.height = "auto";
	object.sheet.render(true, { position });
}


/**
 * Stores the position of a monarch window in local storage
 *
 * @export
 * @param {string} uuid
 * @param {{left: number, top: number, width: number, height: number, scale: number}} position
 * @return {Promise<void>}
 */
export function storeWindowPosition(uuid, position = {}) {
	windowPositions[uuid] = position;

	window.localStorage.setItem(
		"monarch-windows", 
		JSON.stringify(windowPositions)
	);
}


/**
 * Removes a given monarch application from the set of positions
 *
 * @export
 * @param {string} uuid
 * @return {void} 
 */
export function removePosition(uuid) {
	if (!windowPositions[uuid]) return;

	delete windowPositions[uuid];

	window.localStorage.setItem(
		"monarch-windows",
		JSON.stringify(windowPositions)
	);
}

/**
 * Obtains the dimensions of an image based on the provided path.
 *
 * @export
 * @param {string} path - The path to the image to get the dimensions of.
 * @return {Promise<{width: number, height: number}>} The dimensions of the image.
 */
export async function getImageDimensions(path) {
	const img = await loadTexture(path);
	return { width: img.baseTexture.width, height: img.baseTexture.height };
}

/**
 * Returns a function that is either stored in a value, or that
 * will return that value.
 *
 * Used to allow for a variable that can either be a constant or
 * a function.
 *
 * @export
 * @param {*} value - Some value
 * @param {*} [defaultValue=null] - The default value to return if the value is not a function and isn't defined.
 * @return {Function<typeof value>} A function that returns a value of the type needed. 
 */
export function functionOrValue(value, defaultValue = null) {
	return typeof value === "function" ? value : () => (value ?? defaultValue);
}