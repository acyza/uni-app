<template>
  <tree :data="data"/>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const data = reactive([
  {
    text: 'a',
    children:[
      {
        text: 'a_a',
        children: []
      },
      {
        text: 'a_b',
        children: []
      }
    ]
  },
  {
    text: 'b',
    children:[
      {
        text: 'b_a',
        children: []
      },
      {
        text: 'b_b',
        children: []
      }
    ]
  }
])
</script>

<style>
</style>
