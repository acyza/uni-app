<template>
  <view class="content">
    <SlotDemo :useDefaultData="true">
      <template #default="item">
        <view @click="clickHandler(item)">{{ item }}</view>
      </template>
      </SlotDemo>
  </view>
</template>

<script setup>
import SlotDemo from '../../components/SlotDemo.vue';

function clickHandler(e) {
  console.log(e)
}
</script>
