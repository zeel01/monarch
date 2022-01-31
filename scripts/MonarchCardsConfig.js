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

	applyComponents(data) {
		data.cards.forEach((card, i) => {
			data.cardData[i].controls    = this.applyCardControls(card, data.controls, this.object);
			data.cardData[i].contextMenu = this.applyCardControls(card, data.contextMenu, this.object);
			data.cardData[i].badges      = this.applyCardBadges(card, data.badges, this.object);
			data.cardData[i].markers     = this.applyCardMarkers(card, data.markers, this.object);
		});
	}

	activateListeners(html) {
		super.activateListeners(html);
		html = html[0];

		html.querySelectorAll(".card").forEach(card => {
			const cardDocument = this.object.cards.get(card.dataset.cardId);

			card.addEventListener("contextmenu", event => {
				html.querySelectorAll(".card").forEach(card => card.classList.remove("show-ctx"));
				event.stopPropagation();
				event.preventDefault();
				card.classList.add("show-ctx");
				const menu = card.querySelector(".context-menu");
				menu.style.left = `${event.clientX}px`;
				menu.style.top = `${event.clientY}px`;
			});

			card.querySelectorAll(".card-control").forEach(button => {
				button.addEventListener("click", (event) => {
					event.stopPropagation();
					if (button.disabled) return;
					button.classList.forEach(className => {
						if (this._controlFns[className]) 
							this._controlFns[className](event, cardDocument, this.object);
					});
				});
			});
		});
	}
}