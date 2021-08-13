<template lang="pug">
  .urbanPlanUrbanCaseTimeLine(v-loading="!data.length" style="min-height:500px;")
    template(v-for="item in data")
      //- 辦理中
      .urbanPlanUrbanCaseTimeLine__item(
        v-if="type==='辦理中'"
        style="margin:0;border:none;padding: 1rem;flex-direction:row;align-items:center;justify-content:flex-start;"
      )
        .urbanPlanUrbanCaseTimeLine__item__circle(style="position:relative;top:0;left:0;margin-right:1rem;")
          small {{item.CorePlanFileNo}}
        strong {{item.PlanName}}

      //- 發布實施 ?
      .urbanPlanUrbanCaseTimeLine__item(
        v-else
        v-loading="item.CorePlanFileNo===loadingID"
      )
        .urbanPlanUrbanCaseTimeLine__item__circle
            small {{item.CorePlanFileNo}}
            //- font-awesome-icon(:icon="hasStatusIcon ? '' : 'info'" fixed-width)
        .urbanPlanUrbanCaseTimeLine__item__numerical
            strong {{item.LawDate||item.AdminDate}}
        .urbanPlanUrbanCaseTimeLine__item__main(
          @click.stop="open(`${item.LawDate||item.AdminDate}-${item.PlanName}`,item.CorePlanId)"
        )
            strong {{item.PlanName}}
        //- 下載附件
        .urbanPlanUrbanCaseTimeLine__item__main__button
          el-popover(
              placement='bottom'
              width='150'
              trigger='click'
          )
              el-button(
                  slot="reference"
                  style="padding:0;"
                  round
                  type="text"
                  title="附件下載"
              )
                  strong 下載附件

              .files(v-loading="fileLoading")
                  template(v-for="f,index in Object.values(item.file)")
                      el-button.files__link(
                          style="margin:0 0.5rem;text-align: left;"
                          type="text"
                          :disabled="!f.filePath"
                          :key="index"
                          :title="`下載${f.desc}`"
                          @click="downloadFile(`${item.AdminDate}-${item['PlanName']}${f.desc}`,f.filePath)"
                      )
                          font-awesome-icon(:icon="/圖/.test(f.desc) ? 'images' : 'file'" fixed-width transform="left-5" )
                          span 下載{{f.desc}}

</template>

<style lang="scss" scoped>
    $date_width: 10rem;

    .urbanPlanUrbanCaseTimeLine{
        display: flex;
        flex-direction: column;

        &__item{
            text-align: left;
            border-left: 2px dashed $info;
            padding: 1rem 0 1rem 3rem;
            margin-left: $date_width;
            position: relative;

            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
            transition:  all 0.2s ease;
            &:hover {
                background-color: rgba($primary,0.1);
            }
            &:nth-of-type(even){
                &:not(:hover){
                    background-color: rgba($info,0.1);
                }
            }
            &__circle{
                white-space: nowrap;

                flex-shrink: 0;
                border-radius:100%;
                padding: 0.25rem;
                height: 2.5rem;
                width: 2.5rem;

                text-align: center;

                display:flex;
                align-items: center;
                justify-content: center;

                position: absolute;
                background-color: $primary;

                z-index: 1;
                left: -1.5rem;

                color:#fff;
            }
            &__numerical{
                left: -$date_width;
                right: auto;
                top: auto;
                bottom: auto;
                width: 100px;
                position: absolute;
                color: $primary;
            }
            &__main{
                display: flex;
                flex-direction:  column;
                margin: 0.8rem 0;
                cursor: pointer;
            }
            @media screen and (max-width:500px){
              margin-left: 2rem;
              &__numerical{
                left: 3rem;
                top: 0.5rem;
              }
            }

        }
    }
</style>

<script>

import { mapGetters, mapActions } from 'vuex'

export default {
    name:"urbanPlanUrbanCaseTimeLine",
    title:"時間軸",
    components:{
    },
    data:()=>({
        loadingID:"",
        fileLoading:false
    }),
    props:{
        data:{
            type:Array,
            default:[],
        },
        type:{
          type:String,
        }
    },
    computed:{
        hasStatusIcon(){
            return "status" in this.data[0]
        }
    },
    methods:{
        async downloadFile(fName,fPath){
            try {

                this.fileLoading = true
                if(!fPath) throw("檔案不存在")

                let stream = await fetch(fPath)
                let blob = await stream.blob()

                let url = window.URL.createObjectURL(blob)
                let link = document.createElement('a')
                link.href = url
                link.download = `${fName}.pdf`
                link.click()
                window.URL.revokeObjectURL(url)

            }catch(e){
                this.$alert("檔案下載失敗 : " + e, {type:"error"})
            }finally{
                this.fileLoading = false
            }
        },
        async open(filename,id){
            id && window.open("http://landuse.hccg.gov.tw/landuseportal/updoc/mapquery/plan_detail.aspx?plan_id="+id)
        }
    }
}
</script>
