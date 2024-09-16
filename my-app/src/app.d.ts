// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
declare namespace App {
	interface Locals {
	  auth: import('@auth/core').Auth; // Replace with the correct type if known
	}
  }