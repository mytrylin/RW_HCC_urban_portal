<template lang="pug">
    .date-picker-interval

        datePickerTW(
          :useCalendar="useCalendar"
          :size="size"
          :intervalEnd="intervalEnd"
          @input="handleIntervalStartDate($event)"
        )
          small(slot="prefix") 起

        datePickerTW(
          :useCalendar="useCalendar"
          :size="size"
          :intervalStart="intervalStart"
          @input="handleIntervalEndDate($event)"
        )
          small(slot="prefix") 迄

</template>

<script>

import datePickerTW from './datePickerTW'
export default {
    name:"datePickInterval",
    components:{
        datePickerTW
    },
    props:{
        size:{
            type:String,
            default:''
        }
    },
    data:()=>({
      intervalEnd:'',
      intervalStart:'',
    }),
    computed:{
        useCalendar(){
            return window.innerWidth > 768
        }
    },
    methods:{
        handleIntervalStartDate(evt){
            this.intervalStart = evt
            this.$emit("input",[this.intervalStart,this.intervalEnd])
        },
        handleIntervalEndDate(evt){
            this.intervalEnd = evt
            this.$emit("input",[this.intervalStart,this.intervalEnd])
        }
    }
}
</script>

<style lang="scss">

    .date-picker-interval{
        display: flex;
        align-items: center;
        justify-content:space-between;
    }

</style>
