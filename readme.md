# 🦋 Monarch - A card UI fit for royalty.

**Monarch is currently in beta. There are some rough edges and incomplete features. Feel free to open [issues](https://github.com/zeel01/monarch/issues) if you find problems.**

Monarch is an enhanced card UI for Foundry VTT v9+ which provides replacements for card, hand, deck, and pile sheets.

![A "light" deck, with two open hands and two open individual cards.](examples/monarch.png)

## Features

Monarch includes apps for hands, decks, cards, and piles. It also remembers the positions of open card sheets, and restores them when the application is reloaded. This allows players and GMs to keep their hands, and any important card sheets, open without them being closed acceidentally.

Monarch supports drag and drop, including moving cards between piles, decks, and hands as well as re-ordering cards in these containers.

### Settings

**Card Height** - You can configure the visual hieght of cards in Monarch applications. This value is in pixels, the default is 200. Adjusting this will change how large cards appear in decks, piles, and hands. *Note: Other clients may need to refresh to see this change*

## 🦋 My Hand

The "My Hand" sheet displays your hand similarly to how you might see it in real life. All of the cards are layed out in a compact "fan" format. You can see more details about each card by hovering your mouse over it. You can also play a card, flip it over, or view its individual sheet.

![Animation showing the hand application.](examples/hand.gif)

## 🦋 Card

The card sheet is a compact view of a single card which shows off the artwork. When you hover your mouse over the card, you will reveal additional information and can edit its properties. There is a button for editing the faces and back of the card as well. There is also a magnifying glass button to pop open the card artwork for a full view.

![Animation showing three single card sheets.](examples/card.gif)

## 🦋 Deck

The deck sheet is a slightly restyled version of the standard deck sheet, which shows the card artwork more clearly, and arranges the cards in a grid rather than rows.

![A deck of standard playing cards using the "light" theme.](examples/deck.png)

## 🦋 Pile 

The pile sheet is very similar to the deck sheet, but with slightly different controls.

![A discard pile app.](examples/pile.png)

## Using Monarch

To use Monarch, open one of the supported documents (card, deck, pile, hand) and click the "⚙️ Sheet" button in the title bar. This will open the sheet config window. You can then choose to set either "This Sheet" for this specific document, or "Default Sheet" for all documents of this type to use the corresponding 🦋 Monarch sheet.

![A standard hand app, with the sheet config window open.](examples/sheet-config.png)