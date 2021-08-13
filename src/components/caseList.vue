<template lang="pug">
  .case-list
      .case-list__item(v-if="!isEmpty")
        slot(name="header")

      el-alert(
          v-if="isEmpty"
          center
          type="info"
          :closable="false"
          :show-icon="true"
          title="沒有資料"
      )

      .case-list__item(
          v-else
          v-for="item,index in data"
          :key="`${index}`"
      )
          slot(:data="item")

</template>

<script>
export default {
    name:'caseTable',
    components:{},
    data:()=>({}),
    props:{
        data:{
          type:Array,
          required:true
        },
        amount:{
          type:Number
        }
    },
    computed:{
        isEmpty(){
            return !this.data.length
        }
    },
    methods:{},
    destroyed(){}
}
</script>


<style lang="scss" scoped>
    .case-list{
        width:100%;
        margin: 1rem 0;
        overflow: hidden;
        &__item{
            padding: 0.5rem;
            display: flex;
            flex-wrap: wrap;
            align-items:center;
            justify-content: space-between;
            box-sizing: border-box;
            border-bottom: 1px dashed rgba($primary,0.1);
            border-top: 1px dashed rgba($primary,0.1);
            &:nth-of-type(even){
                background-color: rgba($primary,0.1);
            }
        }
    }

</style>
