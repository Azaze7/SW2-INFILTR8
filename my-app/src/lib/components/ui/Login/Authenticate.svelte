<script>
    let email = "";
    let password = "";
    let confirmPass = "";
    let error = false;
    let register = false;
    let errorMessage = "";
    let loading = false;

    async function handleAuthentication() {
        error = false;
        loading = true;

        if (!email || !password || (register && !confirmPass)) {
            errorMessage = "All fields are required.";
            error = true;
            loading = false;
            return;
        }

        if (register && password !== confirmPass) {
            errorMessage = "Passwords do not match.";
            error = true;
            loading = false;
            return;
        }

        const endpoint = register ? 'http://localhost:3000/register' : 'http://localhost:3000/login';
        const payload = {
            username: email,
            password: password
        };

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (!response.ok) {
                errorMessage = result.message || 'Authentication failed';
                error = true;
            } else {
                handleSuccess();
            }
        } catch (e) {
            errorMessage = "An error occurred during the request.";
            error = true;
        }

        loading = false;
    }

    function handleSuccess() {
        // Redirect to dashboard after successful login/registration
        window.location.href = "/dashboard";
    }

    function handleSubmit(event) {
        event.preventDefault(); // Prevent the default form submission
        handleAuthentication(); // Call the API
    }

    function handleRegister() {
        register = !register;
    }
</script>

<div class="authContainer">
    <form on:submit|preventDefault={handleSubmit}>
        <h1>{register ? "Register" : "Login"}</h1>
        {#if error}
            <p class="error">{errorMessage}</p>
        {/if}
        <label>
            <p class={email ? "above" : "center"}>Email</p>
            <input bind:value={email} type="email" placeholder="Email" required/>
        </label>
        <label>
            <p class={password ? "above" : "center"}>Password</p>
            <input bind:value={password} type="password" placeholder="Password" required/>
        </label>
        {#if register}
            <label>
                <p class={confirmPass ? "above" : "center"}>Confirm Password</p>
                <input bind:value={confirmPass} type="password" placeholder="Confirm Password" required/>
            </label>
        {/if}
        <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Submit'}
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


<style>
    .authContainer {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex: 1;
        padding: 24px;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 14px;
    }

    form,
    .options {
        width: 400px;
        max-width: 100%;
        margin: 0 auto;
    }

    form input {
        width: 100%;
    }

    h1 {
        text-align: center;
        font-size: 3rem;
    }

    form label {
        position: relative;
        border: 1px solid navy;
        border-radius: 5px;
    }

    form label:focus-within {
        border-color: blue;
    }

    form input {
        border: none;
        background: transparent;
        color: white;
        padding: 14px;
    }

    form input:focus {
        border: none;
        outline: none;
    }

    

    form button {
        background: navy;
        color: white;
        border: none;
        padding: 14px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1.1rem;
    }

    form button:hover {
        background: blue;
    }

    .above, 
    .center {
        position: absolute;
        transform: translateY(-50%);
        pointer-events: none;
        color: white;
        border-radius: 4px;
        padding: 0 6px;
        font-size: 0.8rem;
    }

    .above {
        top: 0;
        left: 24px;
        background: navy;
        border: 1px solid blue;
        font-size: 0.7rem;
    }

    .center {
        top: 50%;
        left: 6px;
        border: 1px solid transparent;
        opacity: 0;
    }

    .error {
        color: coral;
        font-size: 0.9rem;
    }

    .options {
        padding: 14px 0;
        overflow: hidden;
        font-size: 0.9rem;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .options > p {
        position: relative;
        text-align: center;
        width: fit-content;
        margin: 0 auto;
        padding: 0 8px;
    }

    .options > p::after,
    .options > p::before {
        position: absolute;
        content: '';
        top: 50%;
        transform: translateY(-50%);
        width: 100vw;
        height: 1.5px;
        background: white;
    }

    .options > p::after {
        right: 100%;
    }

    .options > p::before {
        left: 100%;
    }

    .options div {
        display: flex;
        align-items: center;
        gap: 8px;
        justify-content: center;
    }

    .options div p:last-of-type {
        color: cyan;
        cursor: pointer;
    }
</style>