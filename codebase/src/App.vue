<script setup lang="ts"></script>

<template>
  <div>
    <nav class="navbar">
      <router-link
        to="/graph"
        class="nav-button"
      >
        Graph View
      </router-link>
      <router-link
        to="/sorting"
        class="nav-button"
      >
        Sorting View
      </router-link>
    </nav>
    <router-view />
  </div>
</template>

<style>
  html,
  body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
  }
  .navbar {
    display: flex;
    justify-content: center;
    background-color: #04aa6d;
    padding: 1rem 0;
    width: 100%;
    height: 60px;
    box-sizing: border-box;
    margin-bottom: 10px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
  .nav-button {
    margin: 0 1rem;
    color: white;
    text-decoration: none;
    font-weight: bold;
    padding: 3px;
  }
  .nav-button:hover {
    color: #04aa6d;
    background-color: white;
    transform: scale(110%);
    border: solid black 1px;
    border-radius: 5px;
  }
</style>
