import classNames from "classnames";

export const THEMES = {
    ['Blueprint']: 'mosaic-blueprint-theme',
    ['Blueprint Dark']: classNames('mosaic-blueprint-theme', 'bp4-dark'),
};

export type Theme = keyof typeof THEMES;