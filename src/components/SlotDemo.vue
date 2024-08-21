<template>
    <view class="wrapper">
        <view v-for="item,index of data" :key="index">
            <view>
                <slot :data="item" />
            </view>
        </view>
        <view class="end"></view>
    </view>
</template>
<script lang="ts" setup>
const props = defineProps<{
    getData?: Function
    useDefaultData: boolean
}>()

const data = props.useDefaultData ? ['1','2','3'] : props.getData?.()
</script>
<style scoped>
.wrapper{
    width: 100%;
    height: 100%;
}
</style>