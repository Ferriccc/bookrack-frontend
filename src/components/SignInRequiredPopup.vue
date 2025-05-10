<template>
  <div class="signin-popup-overlay">
    <div class="signin-popup">
      <h2>Sign In Required</h2>
      <p>You must be signed in to use BookRack. Please sign in to continue.</p>
      <button @click="useUserStore().signInWithGoogle()" class="signin-btn">
        Sign In with Google
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
</script>

<style scoped>
.signin-popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(18, 18, 18, 0.95);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.signin-popup {
  background: #181818;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  padding: 2.5rem 2rem;
  max-width: 90vw;
  width: 350px;
  text-align: center;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.signin-popup h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.signin-popup p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.signin-btn {
  display: inline-block;
  background: linear-gradient(90deg, #007aff, #339af0);
  color: #fff;
  padding: 0.9rem 2.2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s;
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.08);
}

.signin-btn:hover {
  background: linear-gradient(90deg, #339af0, #007aff);
}
</style>
