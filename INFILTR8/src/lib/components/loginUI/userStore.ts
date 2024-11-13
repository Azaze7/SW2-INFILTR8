import { writable } from 'svelte/store';

interface User {
    username: string;
}

function isBrowser() {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}
const savedUser = isBrowser() ? localStorage.getItem('user') : null;
export const user = writable<User | null>(savedUser ? JSON.parse(savedUser) : null);

user.subscribe((value) => {
    if (isBrowser()) {
        if (value) {
            localStorage.setItem('user', JSON.stringify(value));
        } else {
            localStorage.removeItem('user');
        }
    }
});