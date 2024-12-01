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
    let resetToken = '';
    let newPassword = '';
    let error = false;
    let register = false;
    let resetPasswordFormVisible = false;
    let showTokenPopup = false;
    let tokenMessage = '';
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
                resetToken = data.user.token;
                tokenMessage = `Your reset token is: ${resetToken}. Please write it down and keep it safe.`;
                showTokenPopup = true; // Show popup after registration

                await createLogEntry({
                    type: 'Information',
                    message: `${username} registered successfully`
                });
            } else {
                const errorData = await response.text();
                errorMessage = errorData;
                error = true;

                await createLogEntry({
                    type: 'Warning',
                    message: `Error registering the user: ${username}`
                });
            }
        } catch (err) {
            errorMessage = 'An error occurred during registration.';
            error = true;
        } finally {
            loading = false;
        }
    };

    const closeTokenPopup = () => {
        showTokenPopup = false;
        user.set({ username }); // Set the user as authenticated
        goto('/dashboard'); // Navigate to the dashboard
    };

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

    const resetPassword = async (): Promise<void> => {
        loading = true;
        try {
            const response = await fetch(`${SERVER_URL}/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: resetToken, newPassword })
            });
            if (response.ok) {
                alert('Password reset successful!');
                resetToken = '';
                newPassword = '';
                resetPasswordFormVisible = false;
            } else {
                const errorData = await response.text();
                errorMessage = errorData;
                error = true;
            }
        } catch (err) {
            errorMessage = 'An error occurred while resetting your password.';
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

    const showResetPasswordForm = (): void => {
        resetPasswordFormVisible = true;
        register = false;
        error = false;
        errorMessage = '';
        resetToken = '';
        newPassword = '';
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

<!-- Token Popup -->
{#if showTokenPopup}
    <div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
        <div class="bg-white p-10 rounded-lg shadow-lg max-w-2xl w-full">
            <h2 class="text-2xl font-bold mb-6 text-center text-gray-700">Important</h2>
            <p class="text-gray-700 text-lg break-words mb-8">{tokenMessage}</p>
            <button
                on:click={closeTokenPopup}
                class="px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded hover:bg-blue-600 transition w-full"
            >
                I have saved my token
            </button>
        </div>
    </div>
{/if}


<!-- Main Component -->
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
{:else if resetPasswordFormVisible}
    <div class="relative min-h-screen flex items-center justify-center overflow-hidden">
        <RetroGrid />
        <div class="relative z-10 bg-white bg-opacity-90 p-8 rounded-lg shadow-lg max-w-md w-full">
            <form on:submit|preventDefault={resetPassword} class="flex flex-col">
                <h1 class="text-2xl font-bold mb-6 text-center text-gray-700">Reset Password</h1>

                {#if error}
                    <p class="text-red-500 text-sm mb-4 text-center">{errorMessage}</p>
                {/if}

                <label class="relative block mb-4 text-gray-700">
                    <input 
                        bind:value={resetToken} 
                        type="text" 
                        id="resetToken" 
                        required 
                        placeholder="Reset Token" 
                        class="block w-full p-3 border border-gray-300 rounded-md"
                    />
                </label>

                <label class="relative block mb-4 text-gray-700">
                    <input 
                        bind:value={newPassword} 
                        type="password" 
                        id="newPassword" 
                        required 
                        placeholder="New Password" 
                        class="block w-full p-3 border border-gray-300 rounded-md"
                    />
                </label>

                <button 
                    type="submit" 
                    class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Reset Password
                </button>
            </form>
        </div>
    </div>
{:else}
    <div class="relative min-h-screen flex items-center justify-center overflow-hidden">
        <RetroGrid />
        <div class="relative z-10 bg-white bg-opacity-90 p-8 rounded-lg shadow-lg max-w-md w-full">
            <form on:submit|preventDefault={handleAuthentication} class="flex flex-col">
                <h1 class="text-2xl font-bold mb-6 text-center text-gray-700">
                    {register ? "Register" : "Login"}
                </h1>

                {#if error}
                    <p class="text-red-500 text-sm mb-4 text-center">{errorMessage}</p>
                {/if}

                <label class="relative block mb-4 text-gray-700">
                    <input 
                        bind:value={username} 
                        type="text" 
                        id="username" 
                        required 
                        placeholder="Username" 
                        class="block w-full p-3 border border-gray-300 rounded-md"
                    />
                </label>

                <label class="relative block mb-4 text-gray-700">
                    <input 
                        bind:value={password} 
                        type="password" 
                        id="password" 
                        required 
                        placeholder="Password" 
                        class="block w-full p-3 border border-gray-300 rounded-md"
                    />
                </label>

                {#if register}
                    <label class="relative block mb-4 text-gray-700">
                        <input 
                            bind:value={confirmPass} 
                            type="password" 
                            id="confirmPass" 
                            required 
                            placeholder="Confirm Password" 
                            class="block w-full p-3 border border-gray-300 rounded-md"
                        />
                    </label>
                {/if}

                <button 
                    type="submit" 
                    class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    {loading ? "Processing..." : "Submit"}
                </button>
            </form>

            <div class="mt-6 text-center">
                {#if register}
                    <p>Already have an account?</p>
                    <button on:click={handleRegister} class="text-blue-500 hover:underline">
                        Login
                    </button>
                {:else}
                    <p>Don't have an account?</p>
                    <button on:click={handleRegister} class="text-blue-500 hover:underline">
                        Register
                    </button>
                    <p class="mt-4">Forgot your password?</p>
                    <button on:click={showResetPasswordForm} class="text-blue-500 hover:underline">
                        Reset Password
                    </button>
                {/if}
            </div>
        </div>
    </div>
{/if}
