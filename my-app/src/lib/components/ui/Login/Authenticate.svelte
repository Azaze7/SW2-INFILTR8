<script lang="ts">
    import { onMount } from 'svelte';
  
    let email = '';
    let password = '';
    let confirmPass = '';
    let error = false;
    let register = false;
    let authMessage = '';
  
    async function handleAuthentication() {
      error = false;
      authMessage = '';
  
      if (!email || !password || (register && password !== confirmPass)) {
        error = true;
        return;
      }
  
      const endpoint = register ? '/register.json' : '/login.json';
      const payload = { email, password };
  
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          authMessage = data.message || 'An error occurred';
        } else {
          authMessage = data.message;
          if (data.token) {
            // Store the token for authenticated requests
            localStorage.setItem('token', data.token);
          }
        }
      } catch (err) {
        console.error(err);
        authMessage = 'An error occurred during authentication.';
      }
    }
  
    function handleRegister() {
      register = !register;
      error = false;
      authMessage = '';
    }
  </script>
  
  <div class="authContainer">
    <form on:submit|preventDefault={handleAuthentication}>
      <h1>{register ? 'Register' : 'Login'}</h1>
      {#if error}
        <p class="error">Please fill out all fields correctly.</p>
      {/if}
      {#if authMessage}
        <p class="authMessage">{authMessage}</p>
      {/if}
      <label>
        <p class={email ? 'above' : 'center'}>Email</p>
        <input bind:value={email} type="email" placeholder="Email" required />
      </label>
      <label>
        <p class={password ? 'above' : 'center'}>Password</p>
        <input bind:value={password} type="password" placeholder="Password" required />
      </label>
      {#if register}
        <label>
          <p class={confirmPass ? 'above' : 'center'}>Confirm Password</p>
          <input bind:value={confirmPass} type="password" placeholder="Confirm Password" required />
        </label>
      {/if}
      <button type="submit">Submit</button>
    </form>
  
    <div class="options">
      <p>Or</p>
      {#if register}
        <div>
          <p>Already have an account?</p>
          <p on:click={handleRegister} class="link">Login</p>
        </div>
      {:else}
        <div>
          <p>Don't have an account?</p>
          <p on:click={handleRegister} class="link">Register</p>
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
    .link {
      color: blue;
      cursor: pointer;
      text-decoration: underline;
    }
  </style>
  