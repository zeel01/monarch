import Monarch from "./Monarch.js";

/**
 * A form for inputting Monarch settings.
 *
 * @export
 * @class MonarchSettings
 * @extends {FormApplication}
 */
export default class MonarchSettings extends FormApplication {
	/**
	 * Default Options for this FormApplication
	 *
	 * @static
	 * @memberof MonarchSettings
	 */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			id: "monarch-settings",
			title: game.i18n.localize("monarch.settings.title"),
			template: "./modules/monarch/templates/monarch-settings.hbs",
			classes: ["monarch-settings", "sheet"],
			width: 500,
			height: "auto",
			closeOnSubmit: Monarch.debugLevel < 1,
			submitOnClose: false,
			resizable: true
		});
	}

	/**
	 * Construct an object of data to be passed to this froms HTML template.
	 *
	 * @return {object} The data being supplied to the template.
	 * @memberof SettingsForm
	 */
	getData() {
		// All settings
		const all = Object.entries(Monarch.settingDefinitions);

		// Settings expanded with all the relevant data
		const expanded = all.map(([key, def]) => ({
			...def,
			id: key,
			type: def.type.name,
			scope: def.scope ?? "world",
			name: game.i18n.localize(`monarch.settings.${key}.name`),
			hint: game.i18n.localize(`monarch.settings.${key}.hint`),
			value: Monarch.settings[key],
			choices: def.getChoices ? def.getChoices() : undefined
		}));

		// Settings that are grouped
		const grouped = expanded.filter(setting => setting.group);
		
		// Settings that aren't grouped
		const settings = expanded.filter(setting => !setting.group);

		// Setting groups
		const groups = {};
		grouped.forEach(setting => {
			const group = setting.group;
			if (!groups[group]) {
				groups[group] = {
					scope: setting.scope,
					type: setting.type,
					name: game.i18n.localize(`monarch.settings.groups.${group}.name`),
					hint: game.i18n.localize(`monarch.settings.groups.${group}.hint`),
					settings: []
				}
			}

			groups[group].settings.push(setting);
		});

		const worldSettings = settings.filter(setting => setting.scope == "world");	
		const clientSettings = settings.filter(setting => setting.scope == "client");

		const worldGroups = Object.values(groups).filter(group => group.scope == "world");
		const clientGroups = Object.values(groups).filter(group => group.scope == "client");

		return {
			isGM: game.user.isGM,
			worldSettings,
			clientSettings,
			worldGroups,
			clientGroups 
		};
	}

	/**
	 * Executes on form submission.
	 *
	 * @param {Event} event - the form submission event
	 * @param {object} data - the form data
	 * @memberof SettingsForm
	 */
	async _updateObject(event, data) {
		for (let [key, value] of Object.entries(data)) {
			await game.settings.set(Monarch.name, key, value);
		}
	}

	/**
	 * Handles form submission.
	 *
	 * @override Added sheet refresh
	 *
	 * @param {*} args
	 * @return {*} 
	 * @memberof MonarchSettings
	 */
	async _onSubmit(...args) {
		const ret = await super._onSubmit(...args);
		await Monarch.refreshSheetsAll();
		return ret;
	}

	/**
	 * Handles click events on buttons.
	 *
	 * Delegates handling to the appripiate method.
	 *
	 * @param {PointerEvent} event
	 * @memberof MonarchSettings
	 */
	_onButtonClick(event) {
		event.preventDefault();
		const action = event.currentTarget.dataset.action;
		if (this[action]) this[action](event);
	}

	/**
	 * Handles the enable sheet button.
	 *
	 * Set one or all of the Monarch sheets as default.
	 *
	 * @param {PointerEvent} event
	 * @memberof MonarchSettings
	 */
	async enableSheets(event) {
		const sheet = event.currentTarget.dataset.sheet;
		const settings = {
			card: { "Card.base": "monarch.MonarchCard" },
			hand: { "Cards.hand": "monarch.MonarchHand" },
			deck: { "Cards.deck": "monarch.MonarchDeck" },
			pile: { "Cards.pile": "monarch.MonarchPile" },
		}
		if (sheet == "all") await this._setSheets({
			...settings.card, ...settings.hand,
			...settings.deck, ...settings.pile
		});
		else await this._setSheets(settings[sheet]);

		ui.notifications.info(game.i18n.format(
			"monarch.settings.enableSheets.notification", {
				sheet: game.i18n.localize(`monarch.settings.enableSheets.${sheet}`)
			}
		));
	}

	/**
	 * Update the default sheet settings.
	 *
	 * @param {Object<string, string>} newSettings - The new settings
	 * @memberof MonarchSettings
	 */
	async _setSheets(newSettings) {
		const settings = game.settings.get("core", "sheetClasses") || {};
		foundry.utils.mergeObject(settings, newSettings);
		await game.settings.set("core", "sheetClasses", settings);
	} 

	/**
	 * Attach event handlers to the application.
	 *
	 * @param {HTMLElement} html - The element representing the application window
	 * @memberof MonarchCardsConfig
	 */
	activateListeners(html) {
		super.activateListeners(html);
		html = html[0];
		
		html.querySelectorAll("[data-action]").forEach(button => {
			button.addEventListener("click", this._onButtonClick.bind(this));
		});
	}
}
