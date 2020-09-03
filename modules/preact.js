import {h} from "https://unpkg.com/preact@latest?module";
import htm from "https://unpkg.com/htm@latest?module";

export * from "https://unpkg.com/preact@latest?module";
export * from "https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module";
export const html = htm.bind(h);
