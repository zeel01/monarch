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
    export function removePositon(uuid: string): void;
    export function getImageDimensions(path: string): Promise<{
        width: number;
        height: number;
    }>;
    export function preLoadTemplates(): Promise<Function[]>;
    export function functionOrValue(value: any, defaultValue?: any): any;
}
declare module "scripts/Monarch" {
    export default class Monarch {
        static get name(): string;
        static get settings(): {
            readonly cardHeight: any;
            readonly discardPile: any;
        };
        static get discardPile(): any;
    }
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
        static get play(): CardControl;
        static get edit(): CardControl;
        static get delete(): CardControl;
        static get discard(): CardControl;
        static _getColorToggle(color: string): CardControl;
        static get markerToggle(): {
            [x: string]: CardControl;
        };
        static get colorToggles(): CardControl;
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
        onclick?: cardClickCallback;
        controls?: Array<CardControl>;
    };
    export type AppControl = {
        label: string;
        tooltip: string | stringCallback;
        aria: string | stringCallback;
        class: string;
        icon: string | stringCallback;
        onclick: Function;
    };
}
declare module "scripts/MonarchApplicationMixin" {
    export default MonarchApplicationMixin;
    export type cardClickCallback = import("scripts/Components").cardClickCallback;
    export type CardControl = import("scripts/Components").CardControl;
    export type CardBadge = import("scripts/Components").CardBadge;
    export type CardMarker = import("scripts/Components").CardMarker;
    export type AppControl = import("scripts/Components").AppControl;
    export type Components = {
        badges: Array<CardBadge>;
        controls: Array<CardControl>;
        markers: Array<CardMarker>;
        contextMenu: Array<CardControl>;
        appControls: Array<AppControl>;
    };
    function MonarchApplicationMixin(Base: any): any;
}
declare module "scripts/MonarchCard" {
    export default class MonarchCard {
        static get defaultOptions(): any;
        constructor(...args: any[]);
        activateListeners(html: any): void;
        get controls(): import("scripts/Components").CardControl[];
        override _getHeaderButtons(): any;
        _getSubmitData: any;
        getData(): Promise<any>;
        applyComponents(data: any): void;
    }
    export type CardControl = import("scripts/Components").CardControl;
    export type CardBadge = import("scripts/Components").CardBadge;
}
declare module "scripts/MonarchCardsConfig" {
    export default class MonarchCardsConfig {
        getData(options: any): Promise<any>;
        applyComponents(data: any): void;
        activateListeners(html: any): void;
    }
}
declare module "scripts/MonarchHand" {
    export default class MonarchHand extends MonarchCardsConfig {
        static get defaultOptions(): any;
        _getHeaderButtons(): any;
        override _onCardControl(event: any): Promise<any>;
        _onDragEnter(event: Event): void;
        _onDragLeave(event: Event): void;
        get controls(): import("scripts/Components").CardControl[];
    }
    export type CardControl = import("scripts/Components").CardControl;
    export type CardBadge = import("scripts/Components").CardBadge;
    import MonarchCardsConfig from "scripts/MonarchCardsConfig";
}
declare module "scripts/MonarchDeck" {
    export default class MonarchDeck extends MonarchCardsConfig {
        static get defaultOptions(): any;
        get controls(): import("scripts/Components").CardControl[];
        get badges(): import("scripts/Components").CardBadge[];
    }
    export type CardControl = import("scripts/Components").CardControl;
    export type CardBadge = import("scripts/Components").CardBadge;
    import MonarchCardsConfig from "scripts/MonarchCardsConfig";
}
declare module "scripts/MonarchPile" {
    export default class MonarchPile extends MonarchCardsConfig {
        static get defaultOptions(): any;
        get controls(): import("scripts/Components").CardControl[];
    }
    export type CardControl = import("scripts/Components").CardControl;
    export type CardBadge = import("scripts/Components").CardBadge;
    import MonarchCardsConfig from "scripts/MonarchCardsConfig";
}
declare module "monarch" {
    export {};
}
