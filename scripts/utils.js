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
	const data = window.localStorage.getItem("monarch-windows") || "";
	windowPositions = JSON.parse(data) || {};
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
	object.sheet.render(true, position);
}


/**
 * Stores the positions of all monarch windows in local storage
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
export function removePositon(uuid) {
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
	const img = new Image();
	img.src = path;
	await new Promise(resolve => img.onload = resolve);

	return { width: img.width, height: img.height };
}

/**
 * Load all the templates for handlebars partials.
 *
 * @export
 * @return {Promise<Function[]>} An array of functions that render the partials.
 */
export async function preLoadTemplates() {
	return loadTemplates([
		// Shared Partials
		"modules/monarch/templates/parts/card-badge.hbs",
		"modules/monarch/templates/parts/card-control.hbs",
		"modules/monarch/templates/parts/control-block.hbs",
		"modules/monarch/templates/parts/card-hud.hbs"
	]);
}

export function functionOrString(value, defaultValue = null) {
	return typeof value === "function" ? value : () => (value ?? defaultValue);
}