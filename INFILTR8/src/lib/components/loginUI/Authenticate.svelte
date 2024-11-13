<script lang="ts">
    import { writable } from 'svelte/store';
    import { goto } from '$app/navigation';
    import { user } from './userStore'; 
    import RetroGrid from '$lib/components/AceternityUI/RetroGrid/RetroGrid.svelte';
    import { createLogEntry } from '../../../routes/Logs/logservice';

    const SERVER_URL = 'http://localhost:3000';
    let username = '';
    let password = '';
    let confirmPass = '';
    let error = false;
    let register = false;
    let errorMessage = '';
    let loading = false;

    // Password validation function
    function isPasswordValid(password: string): boolean {
        const minLength = /.{15,}/;
        const hasUpperCase = /[A-Z]/;
        const hasLowerCase = /[a-z]/;
        const hasNumber = /[0-9]/;
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

        return (
            minLength.test(password) &&
            hasUpperCase.test(password) &&
            hasLowerCase.test(password) &&
            hasNumber.test(password) &&
            hasSpecialChar.test(password)
        );
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
                const data = await response.json();
                if (data.locked) {
                    errorMessage = "Your account is locked due to multiple failed attempts.";
                } else if (data.attemptsLeft !== undefined) {
                    errorMessage = `Invalid username or password. You have ${data.attemptsLeft} login attempt(s) remaining.`;
                } else {
                    errorMessage = "Invalid username or password.";
                }
                error = true;

                await createLogEntry({
                    type: 'Warning',
                    message: `Failed login attempt using username: ${username}`
                });
            }
        } catch (err) {
            errorMessage = `Invalid username or password. Please try again.`;
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
        if (register && !isPasswordValid(password)) {
            errorMessage = 'Password must be at least 15 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.';
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
