
declare module 'fontawesome-svelte' {
    /// <reference types="svelte" />
    import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
    import type { SvelteComponentTyped } from "svelte";

    interface FontAwesomeIconProps {
        icon?: IconDefinition | string | string[]
        size?: '2xs' | 'xs' | 'sm' | 'lg' | 'xl' | '2xl' | '1x' | '2x' | '3x' | '4x' | '5x' | '6x' | '7x' | '8x' | '9x' | '10x'
        fixedWidth?: boolean
        rotation?: 90 | 180 | 270
        flip?: 'horizontal' | 'vertical' | 'both'
        spin?: boolean
        pulse?: boolean
        border?: boolean
        pull?: 'left' | 'right'
        inverse?: boolean
        swapOpacity?: boolean
        transform?: string | Partial<Record<'shrink' | 'grow' | 'up' | 'right' | 'down' | 'left' | 'rotate', number>>
        mask?: IconDefinition | string | string[]
        symbol?: string | boolean
        class?: string
        style?: string
    }

    export class FontAwesomeIcon extends SvelteComponentTyped<FontAwesomeIconProps> { }

    interface FontAwesomeLayersProps {
        fixedWidth?: boolean
        class?: string
    }

    export class FontAwesomeLayersProps extends SvelteComponentTyped<FontAwesomeLayersProps> { }

    interface FontAwesomeLayersTextProps {
        value?: string
        transform?: string | Partial<Record<'shrink' | 'grow' | 'up' | 'right' | 'down' | 'left' | 'rotate', number>>
        counter?: boolean
        position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
        class?: string
        style?: string
    }
};