<script>
    import neo4j from 'neo4j-driver';

    let email = "";
    let password = "";
    let confirmPass = "";
    let error = false;
    let register = false;
    let authMessage = "";

    // Neo4j connection setup
    const driver = neo4j.driver(
        "bolt://<your-neo4j-database-url>",  // Example: "bolt://localhost:7687" for local DB
        neo4j.auth.basic("<your-username>", "<your-password>")  // Replace with your Neo4j username and password
    );

    async function handleAuthentication() {
        error = false;
        authMessage = "";

        if (!email || !password || (register && password !== confirmPass)) {
            error = true;
            return;
        }

        const session = driver.session();

        if (register) {
            // Register new user
            try {
                const result = await session.run(
                    'MATCH (u:User {email: $email}) RETURN u',
                    { email }
                );

                if (result.records.length > 0) {
                    authMessage = "User already exists!";
                } else {
                    await session.run(
                        'CREATE (u:User {email: $email, password: $password})',
                        { email, password }
                    );
                    authMessage = "Registration successful!";
                }
            } catch (err) {
                console.error(err);
                authMessage = "An error occurred during registration.";
            } finally {
                await session.close();
            }
        } else {
            // Log in user
            try {
                const result = await session.run(
                    'MATCH (u:User {email: $email, password: $password}) RETURN u',
                    { email, password }
                );

                if (result.records.length === 0) {
                    authMessage = "Invalid email or password!";
                } else {
                    authMessage = "Login successful!";
                }
            } catch (err) {
                console.error(err);
                authMessage = "An error occurred during login.";
            } finally {
                await session.close();
            }
        }
    }

    function handleRegister() {
        register = !register;
        error = false;
        authMessage = "";
    }
</script>

<div class="authContainer">
    <form>
        <h1>{register ? "Register" : "Login"}</h1>
        {#if error}
            <p class="error">Please fill out all fields correctly.</p>
        {/if}
        {#if authMessage}
            <p class="authMessage">{authMessage}</p>
        {/if}
        <label>
            <p class={email ? " above" : " center"}>Email</p>
            <input bind:value={email} type="email" placeholder="Email" required/>
        </label>
        <label>
            <p class={password ? " above" : " center"}>Password</p>
            <input bind:value={password} type="password" placeholder="Password" required/>
        </label>
        {#if register}
            <label>
                <p class={confirmPass ? " above" : " center"}>Confirm Password</p>
                <input bind:value={confirmPass} type="password" placeholder="Confirm Password" required/>
            </label>
        {/if}
        <button type="button" on:click={handleAuthentication}>Submit</button>
    </form>

    <div class="options">
        <p>Or</p>
        {#if register}
            <div>
                <p>Already have an account?</p>
                <p on:click={handleRegister}>Login</p>
            </div>
        {:else}
            <div>
                <p>Don't have an account?</p>
                <p on:click={handleRegister}>Register</p>
            </div>
        {/if}
    </div>
</div>

<style>
    /* Add your existing styles here */
    .authMessage {
        color: limegreen;
        font-size: 1rem;
    }
    .error {
        color: coral;
        font-size: 0.9rem;
    }
</style>
