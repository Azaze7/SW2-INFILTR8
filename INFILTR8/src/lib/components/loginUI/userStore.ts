import { writable } from 'svelte/store';


interface User {
    username: string;
}


export const user = writable<User | null>(null);
