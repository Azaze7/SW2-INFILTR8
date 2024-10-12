import { writable } from 'svelte/store';

export const projectFolders = writable<string[]>([]);
