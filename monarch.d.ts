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
    export class Controls {
        static get default(): CardControl[];
        static get faces(): CardControl;
        static get faceNext(): CardControl;
        static get facePrevious(): CardControl;
        static get play(): CardControl;
        static get edit(): CardControl;
        static get delete(): CardControl;
        static get discard(): CardControl;
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
        static _colors: {
            [x: string]: string;
        };
        static get color(): {
            [x: string]: CardMarker;
        };
    }
    export type CardBadge = {
        tooltip: string | Function;
        text: string | Function;
        class?: string;
        hide?: boolean | Function;
    };
    export type CardMarker = {
        tooltip: string | Function;
        class?: string;
        icon?: string | Function;
        color?: string | Function;
        show?: boolean | Function;
    };
    export type CardControl = {
        tooltip?: string | Function;
        aria?: string | Function;
        icon?: string | Function;
        class?: string;
        disabled?: boolean | Function;
        onclick?: Function;
        controls?: Array<CardControl>;
    };
    export type AppControl = {
        label: string;
        tooltip: string | Function;
        aria: string | Function;
        class: string;
        icon: string | Function;
        onclick: Function;
    };
}
declare module "scripts/MonarchApplicationMixin" {
    export default MonarchApplicationMixin;
    export type CardControl = import("scripts/Components").CardControl;
    export type CardBadge = import("scripts/Components").CardBadge;
    export type CardMarker = import("scripts/Components").CardMarker;
    export type AppControl = import("scripts/Components").AppControl;
    function MonarchApplicationMixin(Base: any): any;
}
declare module "scripts/MonarchCard" {
    export default class MonarchCard {
        static appName: string;
        static get defaultOptions(): any;
        constructor(...args: any[]);
        activateListeners(html: any): void;
        get controls(): CardControl[];
        override _getHeaderButtons(): any;
        _getSubmitData: any;
        getData(): Promise<any>;
        applyComponents(data: any): void;
    }
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
        static appName: string;
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
        static appName: string;
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
        static appName: string;
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
