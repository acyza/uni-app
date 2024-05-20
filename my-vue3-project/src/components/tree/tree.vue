<template>
    <item v-for="item,index of data" :key="index" :children="item.children" :text="item.text"/>
</template>
<script setup lang="ts">
import item from './item.vue'
type Item = {text:string,children:Item}[]
defineProps<{
    data: Item
}>()
</script>