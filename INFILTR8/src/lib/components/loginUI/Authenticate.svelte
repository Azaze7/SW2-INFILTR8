<script lang="ts">
    import { writable } from 'svelte/store';
    import { goto } from '$app/navigation';
    import { user } from './userStore'; 
    import RetroGrid from '$lib/components/AceternityUI/RetroGrid/RetroGrid.svelte';
    import { onMount } from "svelte";
    import { tweened } from "svelte/motion";
    import { cubicInOut, elasticOut, sineOut } from "svelte/easing";
    import { draw, fade } from "svelte/transition";
    import { fly } from "svelte/transition";
    import { Key, Lock, LockKeyholeOpen } from "lucide-svelte";
	import EncryptButton from '../Buttons/EncryptButton.svelte';
	import ShimmerButton from '../Buttons/ShimmerButton.svelte';
    import { createLogEntry } from '../../../routes/Logs/logservice';

    let intervalRef: string | number | NodeJS.Timeout | undefined;
    let text = "Framework ?";
    const TARGET_TEXT = "Svelte is Vibe";
    const CYCLES_PER_LETTER = 2;
    const SHUFFLE_TIME = 50;
    const CHARS = "!@#$%^&*():{};|,.<>/?";

    const SERVER_URL = 'http://localhost:3000';
    let username = '';
    let password = '';
    let confirmPass = '';
    let error = false;
    let register = false;
    let errorMessage = '';
    let loading = false;

    function scramble() {
        let pos = 0;

        intervalRef = setInterval(() => {
            const scrambled = TARGET_TEXT.split("")
            .map((char, index) => {
                if (pos / CYCLES_PER_LETTER > index) {
                    return char;
                }

                const randomCharIndex = Math.floor(Math.random() * CHARS.length);
                const randomChar = CHARS[randomCharIndex];

                return randomChar;
            })
            .join("");

            text = scrambled;
            pos++;

            if (pos >= TARGET_TEXT.length * CYCLES_PER_LETTER) {
            stopScramble();
        }
        }, SHUFFLE_TIME);
    }

    function stopScramble() {
        clearInterval(intervalRef);
        text = TARGET_TEXT;
    }

    const login = async (): Promise<void> => {
        loading = true;
        try {
            const response = await fetch(`${SERVER_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('user', JSON.stringify(data.user));
                user.set(data.user);
                
                await createLogEntry({
                    type: 'Information',
                    message: `${username} logged in`
                });

                goto('/dashboard');
            } else {
                await createLogEntry({
                    type: 'Warning',
                    message: `Failed login attempt using username: ${username}`
                });

                throw new Error(await response.text());
            }
        } catch (err) {
            errorMessage = typeof err === 'string' ? err : 'An error occurred during login';
            error = true;
            await createLogEntry({
                type: 'Error',
                message: `Failed to login using username: ${username}`
            });
        } finally {
            loading = false;
        }
    };

    const registerUser = async (): Promise<void> => {
        loading = true;
        try {
            const response = await fetch(`${SERVER_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('user', JSON.stringify(data.user));
                user.set(data.user);

                await createLogEntry({
                    type: 'Information',
                    message: `${username} registered successfully`
                });

                goto('/dashboard');
            } else {
                await createLogEntry({
                    type: 'Warning',
                    message: `Error registering the user: ${username}`
                });
                throw new Error(await response.text());
            }
        } catch (err) {
            errorMessage = typeof err === 'string' ? err : 'An error occurred during registration';
            error = true;
        } finally {
            loading = false;
        }
    };

    const handleAuthentication = async (): Promise<void> => {
        error = false;
        loading = true;
        errorMessage = '';
        if (!username || !password || (register && !confirmPass)) {
            errorMessage = 'All fields are required.';
            error = true;
            loading = false;
            return;
        }
        if (register && password !== confirmPass) {
            errorMessage = 'Passwords do not match.';
            error = true;
            loading = false;
            return;
        }
        if (register) {
            await registerUser();
        } else {
            await login();
        }
    };

    const handleRegister = (): void => {
        register = !register;
        error = false;
        errorMessage = '';
        password = '';
        confirmPass = '';
    };

    const logout = async (): Promise<void> => {
        try {
            await fetch(`${SERVER_URL}/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            localStorage.removeItem('user');
            user.set(null);
            username = '';
            password = '';
            confirmPass = '';
        } catch (err) {
            console.error('Logout error:', err);
        }
    };
</script>

{#if $user}
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div class="p-6 bg-white rounded-lg shadow-md">
            <h3 class="text-xl font-semibold mb-4 text-gray-700">Welcome, {$user.username}!</h3>
            <button 
                on:click={logout} 
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
                Logout
            </button>
        </div>
    </div>
{:else}

    <div class="relative min-h-screen flex items-center justify-center overflow-hidden ">
        <RetroGrid/>
        <div class="relative z-10 bg-white bg-opacity-90 p-8 rounded-lg shadow-lg max-w-md w-full">
            <form on:submit|preventDefault={handleAuthentication} class="flex flex-col">
                <h1 class="text-2xl font-bold mb-6 text-center text-gray-700">
                    {register ? "Register" : "Login"}
                </h1>

                {#if error}
                    <p class="text-red-500 text-sm mb-4 text-center">{errorMessage}</p>
                {/if}

                <!-- Username Field -->
                <label class="relative block mb-4 text-gray-700">
                    <input 
                        bind:value={username} 
                        type="text" 
                        id="username" 
                        required 
                        autocomplete="username" 
                        placeholder=" " 
                        class="peer placeholder-transparent block w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                    />
                    <span class="absolute left-3 top-3 text-gray-500 text-sm transition-all duration-200 transform -translate-y-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2">
                        Username
                    </span>
                </label>

                <!-- Password Field -->
                <label class="relative block mb-4 text-gray-700">
                    <input 
                        bind:value={password} 
                        type="password" 
                        id="password" 
                        required 
                        autocomplete="current-password" 
                        placeholder=" " 
                        class="peer placeholder-transparent block w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                    />
                    <span class="absolute left-3 top-3 text-gray-500 text-sm transition-all duration-200 transform -translate-y-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2">
                        Password
                    </span>
                </label>

                {#if register}
                    <!-- Confirm Password Field -->
                    <label class="relative block mb-4 text-gray-700">
                        <input 
                            bind:value={confirmPass} 
                            type="password" 
                            id="confirmPass" 
                            required 
                            autocomplete="new-password" 
                            placeholder=" " 
                            class="peer placeholder-transparent block w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                        />
                        <span class="absolute left-3 top-3 text-gray-500 text-sm transition-all duration-200 transform -translate-y-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2">
                            Confirm Password
                        </span>
                    </label>
                {/if}

                <!--<ShimmerButton/>

                <div class="z-10 flex min-h-[16rem] items-center justify-center">
                    <ShimmerButton class="shadow-2xl">
                      <span
                        class="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg"
                      >
                        Shimmer Button
                      </span>
                    </ShimmerButton>
                  </div>
                -->

                <!--<EncryptButton/>-->

                <button 
                    type='submit'
                    disabled={loading}
                    class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition disabled:opacity-50"
                >
                    {loading ? "Processing..." : "Submit"}
                </button>
            </form>

            <div class="options mt-6 text-center text-gray-700">
                <p class="mb-4">Or</p>
                {#if register}
                    <div>
                        <p class="text-gray-700">Already have an account?</p>
                        <button 
                            type="button" 
                            on:click={() => (register = false)}
                            class="mt-2 text-blue-500 hover:underline"
                        >
                            Login
                        </button>
                    </div>
                {:else}
                    <div>
                        <p class="text-gray-700">Don't have an account?</p>
                        <button 
                            type="button" 
                            on:click={() => (register = true)}
                            class="mt-2 text-blue-500 hover:underline"
                        >
                            Register
                        </button>
                    </div>
                {/if}
            </div>
        </div>
    </div>
{/if}
