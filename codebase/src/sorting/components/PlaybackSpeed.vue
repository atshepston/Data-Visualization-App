<template>
  <div class="playback-speed-container">
    <label for="playback-speed">Playback Speed:</label>
    <select
      id="playback-speed"
      v-bind="$attrs"
    >
      <option
        v-for="speed in speeds"
        :key="speed.delay"
        :value="speed"
      >
        {{ speed.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    speeds: { delay: number; label: string }[];
  }>();
</script>

<style scoped>
  .playback-speed-container {
    margin-top: 20px;
    margin-bottom: 20px;
    font-size: 14px;
    font-family: monospace;
    font-weight: bold;
  }

  select {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
    margin-left: 5px;
  }
</style>
