declare module "scripts/utils" {
    export function loadWindowPositions(): void;
    export function restoreWindows(): Promise<void>;
    export function storeWindowPosition(uuid: string, position?: {
        left: number;
        top: number;
        width: number;
        height: number;
        scale: number;
    }): Promise<void>;
    export function removePosition(uuid: string): void;
    export function getImageDimensions(path: string): Promise<{
        width: number;
        height: number;
    }>;
    export function functionOrValue(value: any, defaultValue?: any): Function;
}
declare module "scripts/Components" {
    export const colors: {
        [x: string]: string;
    };
    export class Controls {
        static get default(): CardControl[];
        static get faces(): CardControl;
        static get faceNext(): CardControl;
        static get facePrevious(): CardControl;
        static get flipFace(): CardControl;
        static get play(): CardControl;
        static get edit(): CardControl;
        static get delete(): CardControl;
        static get discard(): CardControl;
        static get showCard(): CardControl;
        static _getColorToggle(color: string): CardControl;
        static get markerToggle(): {
            [x: string]: CardControl;
        };
        static get colorToggles(): CardControl;
        static get clearColorMarkers(): CardControl;
        static get consoleLog(): CardControl;
    }
    export class AppControls {
        static get shuffle(): AppControl;
        static get deal(): AppControl;
        static get reset(): AppControl;
        static get draw(): AppControl;
        static get pass(): AppControl;
    }
    export class Badges {
        static get default(): CardBadge[];
        static get name(): CardBadge;
        static get suit(): CardBadge;
        static get value(): CardBadge;
        static get type(): CardBadge;
        static get drawn(): CardBadge;
    }
    export class Markers {
        static get default(): CardMarker[];
        static _getColorMarker(color: string): CardMarker;
        static get color(): {
            [x: string]: CardMarker;
        };
    }
    export type stringCallback = (card: Card, container: Cards) => string;
    export type booleanCallback = (card: Card, container: Cards) => boolean;
    export type cardClickCallback = (event: Event, card: Card, container: Cards) => void;
    export type appStringCallback = (app: FormApplication, container: Cards) => string;
    export type appBooleanCallback = (app: FormApplication, container: Cards) => boolean;
    export type appClickCallback = (event: Event, app: FormApplication, container: Cards) => void;
    export type CardBadge = {
        tooltip: string | stringCallback;
        text: string | stringCallback;
        class?: string;
        hide?: boolean | booleanCallback;
    };
    export type CardMarker = {
        tooltip: string | stringCallback;
        class?: string;
        icon?: string | stringCallback;
        color?: string | stringCallback;
        show?: boolean | booleanCallback;
    };
    export type CardControl = {
        label?: string | stringCallback;
        tooltip?: string | stringCallback;
        aria?: string | stringCallback;
        icon?: string | stringCallback;
        color?: string | stringCallback;
        class?: string;
        disabled?: boolean | booleanCallback;
        hide?: boolean | appBooleanCallback;
        onclick?: cardClickCallback;
        controls?: Array<CardControl>;
    };
    export type AppControl = {
        label: string;
        tooltip?: string | appStringCallback;
        aria?: string | appStringCallback;
        class: string;
        icon: string | appStringCallback;
        disabled?: boolean | appBooleanCallback;
        hide?: boolean | appBooleanCallback;
        onclick: Function;
    };
}
declare module "scripts/MonarchApplicationMixin" {
    export default MonarchApplicationMixin;
    export type CardControl = import("scripts/Components").CardControl;
    export type CardBadge = import("scripts/Components").CardBadge;
    export type CardMarker = import("scripts/Components").CardMarker;
    export type AppControl = import("scripts/Components").AppControl;
    export type stringCallback = import("scripts/Components").stringCallback;
    export type Components = {
        badges: Array<CardBadge>;
        controls: Array<CardControl>;
        markers: Array<CardMarker>;
        contextMenu: Array<CardControl>;
        appControls: Array<AppControl>;
        cardClasses: Array<string | stringCallback>;
    };
    function MonarchApplicationMixin(Base: any): any;
}
declare module "scripts/MonarchCardsConfig" {
    export default class MonarchCardsConfig {
        _prepareContext(options: any): Promise<any>;
        applyComponents(context: any): void;
        _onRender(context: any, options: any): void;
        _onControl(event: PointerEvent, button: HTMLAnchorElement, card: HTMLElement): void;
        _onAppControl(event: PointerEvent, button: HTMLButtonElement): void;
        override _cardClickAction(event: PointerEvent, app: FormApplication, card: Card): void;
        override _cardDblclickAction(event: PointerEvent, app: FormApplication, card: Card): void;
        _cardContextmenuAction(event: PointerEvent, app: FormApplication, card: Card): void;
        override _cardHoverAction(event: PointerEvent, app: FormApplication, card: Card): void;
        _onEventWithHook(event: PointerEvent, card: Card, hook: string, defaultAction: any): Promise<void>;
    }
}
declare module "scripts/MonarchDeck" {
    export default class MonarchDeck extends MonarchCardsConfig {
        static DEFAULT_OPTIONS: {
            form: {
                submitOnClose: boolean;
            };
            position: {
                width: number;
                height: string;
            };
            window: {
                icon: string;
                resizable: boolean;
            };
            classes: string[];
            dragDrop: {
                dragSelector: string;
                dropSelector: string;
            }[];
        };
        static PARTS: {
            header: {
                template: string;
            };
            tabs: {
                template: string;
            };
            details: {
                template: string;
            };
            cards: {
                template: string;
                scrollable: string[];
            };
            footer: {
                template: string;
            };
        };
        static TABS: {
            primary: {
                tabs: {
                    id: string;
                    icon: string;
                }[];
                initial: string;
                labelPrefix: string;
            };
        };
        get controls(): import("scripts/Components").CardControl[];
        get badges(): import("scripts/Components").CardBadge[];
        get appControls(): import("scripts/Components").AppControl[];
        get classOptions(): {
            [x: string]: boolean;
        };
        _preparePartContext(partId: any, context: any, options: any): Promise<any>;
    }
    export type CardControl = import("scripts/Components").CardControl;
    export type CardBadge = import("scripts/Components").CardBadge;
    export type AppControl = import("scripts/Components").AppControl;
    import MonarchCardsConfig from "scripts/MonarchCardsConfig";
}
declare module "scripts/MonarchPile" {
    export default class MonarchPile extends MonarchCardsConfig {
        static DEFAULT_OPTIONS: {
            form: {
                submitOnClose: boolean;
            };
            position: {
                width: number;
                height: string;
            };
            window: {
                icon: string;
                resizable: boolean;
            };
            classes: string[];
            dragDrop: {
                dragSelector: string;
                dropSelector: string;
            }[];
        };
        static PARTS: {
            cards: {
                template: string;
                root: boolean;
                scrollable: string[];
            };
            footer: {
                template: string;
            };
        };
        get controls(): import("scripts/Components").CardControl[];
        get appControls(): import("scripts/Components").AppControl[];
        get classOptions(): {
            [x: string]: boolean;
        };
    }
    export type CardControl = import("scripts/Components").CardControl;
    export type CardBadge = import("scripts/Components").CardBadge;
    export type AppControl = import("scripts/Components").AppControl;
    import MonarchCardsConfig from "scripts/MonarchCardsConfig";
}
declare module "scripts/MonarchHand" {
    export default class MonarchHand extends MonarchCardsConfig {
        static DEFAULT_OPTIONS: {
            form: {
                submitOnClose: boolean;
            };
            position: {
                width: number;
                height: string;
            };
            window: {
                icon: string;
                resizable: boolean;
            };
            classes: string[];
            dragDrop: {
                dragSelector: string;
                dropSelector: string;
            }[];
        };
        static PARTS: {
            cards: {
                template: string;
                root: boolean;
                scrollable: string[];
            };
            footer: {
                template: string;
            };
        };
        _getHeaderButtons(): any;
        override _onCardControl(event: any): Promise<any>;
        get classOptions(): {
            [x: string]: boolean;
        };
        _onDragEnter(event: Event): void;
        _onDragLeave(event: Event): void;
        get controls(): import("scripts/Components").CardControl[];
        get appControls(): import("scripts/Components").AppControl[];
    }
    export type CardControl = import("scripts/Components").CardControl;
    export type CardBadge = import("scripts/Components").CardBadge;
    export type AppControl = import("scripts/Components").AppControl;
    import MonarchCardsConfig from "scripts/MonarchCardsConfig";
}
declare module "scripts/MonarchCard" {
    export default class MonarchCard {
        static DEFAULT_OPTIONS: {
            form: {
                submitOnClose: boolean;
                closeOnSubmit: boolean;
            };
            position: {
                width: number;
                height: string;
            };
            window: {
                icon: string;
                resizable: boolean;
                controls: {
                    class: string;
                    action: string;
                    icon: string;
                    label: string;
                    ownership: any;
                    visible: () => any;
                }[];
            };
            classes: string[];
        };
        static get PARTS(): {
            header: {
                template: string;
            };
            display: {
                template: string;
            };
            hud: {
                template: string;
            };
            menu: {
                template: string;
            };
            data: {
                template: string;
            };
        };
        constructor(...args: any[]);
        _onFirstRender(context: ApplicationRenderContext, options: RenderOptions): Promise<void>;
        _onRender(context: ApplicationRenderContext, options: RenderOptions): Promise<void>;
        _onDisplay(event: PointerEvent): void;
        _onConfigButton(event: PointerEvent): void;
        _onControl(event: PointerEvent, button: HTMLAnchorElement): void;
        _onContextMenu(event: PointerEvent): void;
        get controls(): import("scripts/Components").CardControl[];
        _getSubmitData: any;
        _prepareContext(): Promise<any>;
        applyComponents(context: any): void;
    }
    export type CardControl = import("scripts/Components").CardControl;
    export type CardBadge = import("scripts/Components").CardBadge;
}
declare module "scripts/MonarchSettings" {
    export default class MonarchSettings {
        static get defaultOptions(): any;
        getData(): object;
        _updateObject(event: Event, data: object): Promise<void>;
        override _onSubmit(...args: any): any;
        _onButtonClick(event: PointerEvent): void;
        enableSheets(event: PointerEvent): Promise<void>;
        _setSheets(newSettings: {
            [x: string]: string;
        }): Promise<void>;
        activateListeners(html: HTMLElement): void;
    }
}
declare module "scripts/Monarch" {
    export default class Monarch {
        static get name(): string;
        static ApplicationMixin: (Base: any) => any;
        static CardsConfig: typeof MonarchCardsConfig;
        static Deck: typeof MonarchDeck;
        static Pile: typeof MonarchPile;
        static Hand: typeof MonarchHand;
        static Card: typeof MonarchCard;
        static Controls: typeof Controls;
        static Badges: typeof Badges;
        static Markers: typeof Markers;
        static AppControls: typeof AppControls;
        static utils: typeof utils;
        static settings: any;
        static get settingDefinitions(): {
            showSuit: {
                type: BooleanConstructor;
                default: boolean;
                group: string;
            };
            showValue: {
                type: BooleanConstructor;
                default: boolean;
                group: string;
            };
            showType: {
                type: BooleanConstructor;
                default: boolean;
                group: string;
            };
            handReset: {
                type: BooleanConstructor;
                default: boolean;
            };
            showCard: {
                type: BooleanConstructor;
                default: boolean;
            };
            cardHeight: {
                type: NumberConstructor;
                default: number;
                scope: string;
            };
            discardPile: {
                type: StringConstructor;
                default: string;
                getChoices: () => any;
            };
            transparentHand: {
                type: BooleanConstructor;
                default: boolean;
                scope: string;
                group: string;
            };
            transparentPile: {
                type: BooleanConstructor;
                default: boolean;
                scope: string;
                group: string;
            };
            transparentDeck: {
                type: BooleanConstructor;
                default: boolean;
                scope: string;
                group: string;
            };
            fadeHand: {
                type: BooleanConstructor;
                default: boolean;
                scope: string;
                group: string;
            };
            fadePile: {
                type: BooleanConstructor;
                default: boolean;
                scope: string;
                group: string;
            };
            fadeDeck: {
                type: BooleanConstructor;
                default: boolean;
                scope: string;
                group: string;
            };
        };
        static get discardPile(): Cards;
        static refreshSheets(): void;
        static refreshSheetsAll(): Promise<void>;
        static showCard(data: {
            pile: string;
            card: string;
        }): Promise<void>;
        static preLoadTemplates(): Promise<Function[]>;
        static registerSettings(): void;
        static registerSheets(): void;
        static onInit(): void;
        static onReady(): Promise<void>;
        static get socketName(): string;
        static _onSocketMessage({ command, data }: {
            command: string;
            data: any;
        }): Promise<void>;
        static get debugLevel(): number;
    }
    import MonarchCardsConfig from "scripts/MonarchCardsConfig";
    import MonarchDeck from "scripts/MonarchDeck";
    import MonarchPile from "scripts/MonarchPile";
    import MonarchHand from "scripts/MonarchHand";
    import MonarchCard from "scripts/MonarchCard";
    import { Controls } from "scripts/Components";
    import { Badges } from "scripts/Components";
    import { Markers } from "scripts/Components";
    import { AppControls } from "scripts/Components";
    import * as utils from "scripts/utils";
}
declare module "monarch" {
    export {};
}
