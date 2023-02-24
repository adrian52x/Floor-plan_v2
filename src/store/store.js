import { writable } from 'svelte/store';

export const selectedObject = writable(null);
export const isButtonClicked = writable(false);

export const baseURL = "http://localhost:3000";