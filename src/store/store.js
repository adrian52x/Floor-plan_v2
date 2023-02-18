import { writable } from 'svelte/store';

export const myStore = writable(null);
export const buttonClicked = writable(false);