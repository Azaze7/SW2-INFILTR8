// INFILTR8/src/lib/stores/user.ts
import { writable } from 'svelte/store';

// User store to hold authentication status or user data
export const user = writable(null);