import MonarchApplicationMixin from "./MonarchApplicationMixin.js";

export default class MonarchCardsConfig extends MonarchApplicationMixin(CardsConfig) {
	async getData(options) {
		const data = await super.getData(options);

		// Create a mutable copy of the data for each card
		data.cardData = data.cards.map(card => {
			const cardData = card.data.toObject();
			cardData.img = card.img;
			cardData.backImg = card.backImg;
			cardData.id = card.id;
			cardData.hasPreviousFace = card.hasPreviousFace;
			cardData.hasNextFace = card.hasNextFace;
			cardData.hasPlayerOwner = card.hasPlayerOwner;
			cardData.isOwner = card.isOwner;
			return cardData;
		});

		await Promise.all(data.cardData.map(this._calcCardDimensions.bind(this)));
		data.cardHeight = this.cardHeight;

		data.cardWidth = Math.max(...data.cardData.map(card => card.width));

		data.cardData.forEach(this._getCssImageUrl);

		this.applyComponents(data);

		return data;
	}

	/**
	 * Construct all the data for each component per-card.
	 *
	 * @param {Object} data - The data for rendering the application template.
	 * @memberof MonarchCardsConfig
	 */
	applyComponents(data) {
		data.appControls = this.applyApplicationControls(data.appControls, this.object);

		data.cards.forEach((card, i) => {
			data.cardData[i].controls    = this.applyCardControls(card, data.controls, this.object);
			data.cardData[i].contextMenu = this.applyCardControls(card, data.contextMenu, this.object);
			data.cardData[i].badges      = this.applyCardBadges(card, data.badges, this.object);
			data.cardData[i].markers     = this.applyCardMarkers(card, data.markers, this.object);
		});
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

		// For each card in the pile
		html.querySelectorAll(".card").forEach(card => {
			card.addEventListener("contextmenu", event => this._onContextMenu(event, html, card));

			// For each card control button
			card.querySelectorAll(".card-control").forEach(button => {
				button.addEventListener("click", event => this._onControl(event, button, card));
			});
		});

		// For each app control button
		html.querySelectorAll(".app-control").forEach(button => {
			button.addEventListener("click", event => this._onAppControl(event, button));
		});

		// Handle drag and drop events
		html.querySelectorAll(".card-wrapper").forEach(wrap => {
			wrap.addEventListener("dragenter", this._onDragEnter.bind(this));
			wrap.addEventListener("dragleave", this._onDragLeave.bind(this));
		});

		// Clicking the card will open its sheet
		html.querySelectorAll(".card").forEach(card => {
			card.addEventListener("mouseenter", event => this._onHoverCard(event, card));
			card.addEventListener("click", event => this._onClickCard(event, card));
		});
	}

	/**
	 * Handles clicks on card controls
	 *
	 * Delegates the click event to the appropriate handler found in the `_controlFns` object,
	 * and passses the appropirate arguments.
	 *
	 * @param {PointerEvent}      event  - The click event
	 * @param {HTMLAnchorElement} button - The element that was clicked
	 * @param {HTMLElement}       card   - The element representing the card
	 * @return {void} 
	 * @memberof MonarchCardsConfig
	 */
	_onControl(event, button, card) {
		const cardDocument = this.object.cards.get(card.dataset.cardId);
		event.stopPropagation();
		if (button.dataset.disabled) return;
		button.classList.forEach(className => {
			if (this._controlFns[className])
				this._controlFns[className](event, cardDocument, this.object);
		});
	}
	
	/**
	 * Handles clicks on app controls
	 *
	 * Delegates the click event to the appropriate handler found in the `_controlFns` object,
	 * and passses the appropirate arguments.
	 *
	 * @param {PointerEvent}      event  - The click event
	 * @param {HTMLButtonElement} button - The element that was clicked
	 * @return {void} 
	 * @memberof MonarchCardsConfig
	 */
	_onAppControl(event, button) {
		event.stopPropagation();
		if (button.disabled) return;
		button.classList.forEach(className => {
			if (this._controlFns[className])
				this._controlFns[className](event, this, this.object);
		});
	}

	/**
	 * Handles the right click event.
	 *
	 * Displays a context menu for the targetted card.
	 *
	 * @param {PointerEvent} event - The click event
	 * @param {HTMLElement}  html  - The element representing the application window
	 * @param {HTMLElement}  card  - The element representing the card
	 * @memberof MonarchCardsConfig
	 */
	_onContextMenu(event, html, card) {
		html.querySelectorAll(".card").forEach(card => card.classList.remove("show-ctx"));
		event.stopPropagation();
		event.preventDefault();
		card.classList.add("show-ctx");
		const menu = card.querySelector(".context-menu");
		menu.style.left = `${event.clientX}px`;
		menu.style.top = `${event.clientY}px`;
	}

	/**
	 * Handles click events on the card.
	 *
	 * @param {PointerEvent} event - The click event
	 * @param {HTMLElement}  card  - The element representing the card
	 * @memberof MonarchHand
	 */
	_onClickCard(event, card) {
		event.stopPropagation();
		const cardDocument = this.object.cards.get(card.dataset.cardId);
		
		const doDefault = Hooks.call("clickMonarchCard", event, this, cardDocument);

		if (doDefault) this._cardClickAction(event, this, cardDocument);
	}

	/**
	 * Action to perform when a card is clicked.
	 *
	 * @param {PointerEvent}    event - The click event
	 * @param {FormApplication} app   - The application object
	 * @param {Card}            card  - The card object
	 * @override
	 * @memberof MonarchHand
	 */
	_cardClickAction(event, app, card) {
		return;
	}

	/**
	 * Handles click events on the card.
	 *
	 * @param {PointerEvent} event - The click event
	 * @param {HTMLElement}  card  - The element representing the card
	 * @memberof MonarchHand
	 */
	_onHoverCard(event, card) {
		event.stopPropagation();
		const cardDocument = this.object.cards.get(card.dataset.cardId);
		
		const doDefault = Hooks.call("hoverMonarchCard", event, this, cardDocument);

		if (doDefault) this._cardHoverAction(event, this, cardDocument);
	}

	/**
	 * Action to perform when a card is hovered over.
	 *
	 * @param {PointerEvent}    event - The click event
	 * @param {FormApplication} app   - The application object
	 * @param {Card}            card  - The card object
	 * @override
	 * @memberof MonarchHand
	 */
	_cardHoverAction(event, app, card) {
		return;
	}
}