<template>
  <div style="display: flex; align-items: center; gap: 5px">
    <div>
      <select v-model="selectedItem">
        <option
          v-for="(item, i) in items"
          :key="i"
          :value="item"
        >
          <slot :item="item">
            {{ getDefaultLabel(item) }}
          </slot>
        </option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T">
  defineProps<{
    items: T[];
    label: string;
  }>();

  const selectedItem = defineModel<T>();

  const getDefaultLabel = (item: T) => {
    if (item && typeof item === "object" && "label" in item) {
      return item.label;
    }
    return item;
  };
</script>

<style scoped>
  select {
    font-family: Arial, Helvetica, sans-serif;
    margin-left: 15px;
  }
</style>
