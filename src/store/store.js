import { writable } from 'svelte/store';

export const selectedObject = writable(null);
export const isButtonClicked = writable(false);

export const baseURL = "http://localhost:3000";
export const receiverEmail = "enachi.adrian52@gmail.com";
//export const receiverEmail = "aenachi@agcbio.com";

export const currentFloorId = writable(null);

export const allObjects = writable([]);
export const allDesks = writable([]);
export const allMeetings = writable([]);
export const allPrinters = writable([]);