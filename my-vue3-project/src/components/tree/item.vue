<template>
    <view>{{ text }}<item v-for="item,index of children" :key="index" :text="item.text" :children="item.children" /></view>
</template>
<script setup lang="ts">
type Item = {text:string,children:Item}[]
defineProps<{
    children: Item,
    text: string
}>()
</script>