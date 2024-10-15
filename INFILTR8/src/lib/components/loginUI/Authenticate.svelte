<script lang="ts">
    import { writable } from 'svelte/store';
    import { goto } from '$app/navigation';
    import { user } from './userStore'; 
    import RetroGrid from '$lib/components/AceternityUI/RetroGrid/RetroGrid.svelte';

    const SERVER_URL = 'http://localhost:3000';
    let username = '';
    let password = '';
    let confirmPass = '';
    let error = false;
    let register = false;
    let errorMessage = '';
    let loading = false;

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
                goto('/dashboard');
            } else {
                throw new Error(await response.text());
            }
        } catch (err) {
            errorMessage = typeof err === 'string' ? err : 'An error occurred during login';
            error = true;
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
                goto('/dashboard');
            } else {
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
    <div class="welcome">
        <h3>Welcome, {$user.username}!</h3>
        <button on:click={logout}>Logout</button>
    </div>
{:else}
    <div class="authWrapper">
        <RetroGrid /> <!-- Add the RetroGrid component as the background -->
        <div class="authContainer">
            <form on:submit|preventDefault={handleAuthentication}>
                <h1>{register ? "Register" : "Login"}</h1>
                {#if error}
                    <p class="error">{errorMessage}</p>
                {/if}
                <label>
                    <p class={username ? "above" : "center"}>Username</p>
                    <input bind:value={username} type="text" placeholder="Username" required autocomplete="username" />
                </label>
                <label>
                    <p class={password ? "above" : "center"}>Password</p>
                    <input bind:value={password} type="password" placeholder="Password" required autocomplete="current-password" />
                </label>
                {#if register}
                    <label>
                        <p class={confirmPass ? "above" : "center"}>Confirm Password</p>
                        <input bind:value={confirmPass} type="password" placeholder="Confirm Password" required autocomplete="new-password" />
                    </label>
                {/if}
                <button type="submit" disabled={loading}>
                    {loading ? "Processing..." : "Submit"}
                </button>
            </form>

            <div class="options">
                <p>Or</p>
                {#if register}
                    <div>
                        <p>Already have an account?</p>
                        <button type="button" on:click={handleRegister}>Login</button>
                    </div>
                {:else}
                    <div>
                        <p>Don't have an account?</p>
                        <button type="button" on:click={handleRegister}>Register</button>
                    </div>
                {/if}
            </div>
        </div>
    </div>
{/if}

<style>
    .authWrapper {
        position: relative;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
    }

    .authContainer {
        position: relative;
        z-index: 10;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 20px;
        box-sizing: border-box;
        background: rgba(255, 255, 255, 0.9); /* White background with transparency */
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    form {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        max-width: 400px;
    }

    form {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        max-width: 400px;
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    label {
        width: 100%;
        margin-bottom: 15px;
        position: relative;
    }

    label p {
        position: absolute;
        top: 15px;
        left: 15px;
        transform: translateY(-50%);
        transition: all 0.2s ease-in-out;
        background: white;
        padding: 0 5px;
        font-size: 0.9rem;
        color: #555;
        pointer-events: none;
    }

    input {
        width: 100%;
        padding: 15px 10px;
        font-size: 1rem;
        border: 1px solid #ccc;
        border-radius: 5px;
        outline: none;
        color: #333; /* Ensures that the text color is visible */
        background-color: white; /* Ensures the input background is white for contrast */
    }

    input:focus {
        border: 1px solid #007bff;
    }

 
    input:not(:placeholder-shown)  {
        top: -10px;
        left: 15px;
        font-size: 0.8rem;
        color: #007bff; /* Color change to indicate focus */
    }

    button {
        padding: 10px 20px;
        font-size: 1rem;
        color: white;
        background-color: #007bff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease-in-out;
    }

    button:hover {
        background-color: #0056b3;
    }

    .error {
        color: red;
        font-size: 0.9rem;
        margin-bottom: 15px;
    }

    .options {
        margin-top: 20px;
        text-align: center;
    }

    .options p {
        margin: 0 0 10px 0;
    }

    .options button {
        background: transparent;
        color: #007bff;
        border: none;
        cursor: pointer;
    }

    .options button:hover {
        text-decoration: underline;
    }
</style>