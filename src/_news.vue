

<template lang='pug'>

#news(v-loading="loading")
    el-tabs(v-model="currentTabName" stretch)
      //- 公告專區
      el-tab-pane(label="公告專區" name="公告專區")

        .announcement-filter
          el-select(placeholder="篩選計畫類別" v-model="announcementType" clearable)
            el-option(label="都市計畫" value="都市計畫")
            el-option(label="都市更新" value="都市更新")
            el-option(label="樁位資訊" value="樁位資訊")

          datePickInterval(v-model="announcementDateInterval")
          el-input(placeholder="關鍵字篩選" type="text" v-model="announcementKeyword" clearable)

        div(v-infinite-scroll="announcementLoadHandler" style="height:500px;overflow: auto;")
          caseList(:data="announcementListModel" :loading="loading")
            template(slot-scope="item")
              .announcement-cell
                el-tag(size="mini" :type="getPlanTagType(item.data.type)" effect="dark" ) {{item.data.type}}
                span(style="margin:0 1rem;") {{item.data.pubDate}}

                template(v-if="item.data.link")
                  a(:href="item.data.link" :title="item.data.title" target="_blank") {{item.data.title}}
                template(v-else)
                  span {{item.data.title}}

      //- 計畫動態
      el-tab-pane(label="計畫動態" name="計畫動態")

        div
          el-button(
            style="margin:1rem;"
            round
            type="primary"
            @click=""
          ) 都市計畫審議
          el-button(
            style="margin:1rem;"
            round
            type="primary"
            plain
            @click="$openLink('https://urbangis.hccg.gov.tw/HcUrbanRenew/Information.aspx?page=progress')"
          ) 都市更新審議
          el-button(
            style="margin:1rem;"
            round
            type="primary"
            plain
            @click="$openLink('https://uddc.hccg.gov.tw/HsinchuUrbanDesign/QueryCase/B?development=1')"
          ) 都市設計審議

        .planStatus-filter
          el-select(placeholder="篩選計畫動態" v-model="planStatus" clearable)
            el-option(label="辦理中" value="辦理中")
            el-option(label="發布實施" value="發布實施")

          el-select(placeholder="請選擇" v-model="planType" clearable)
            el-option(label="新訂" value="新訂")
            el-option(label="通盤檢討" value="通盤檢討")
            el-option(label="個案變更" value="個案變更")

          el-input(placeholder="關鍵字篩選" type="text" v-model="planKeyword" clearable)

        //- main content
        div(v-infinite-scroll="planStatusLoadHandler" style="height:500px;overflow: auto;")
          urbanPlanUrbanCaseTimeLine(:type="planStatus" :data="planCaseModel")


      //- 審議會
      el-tab-pane(label="審議會" name="審議會")
        .review-filter
          el-select( placeholder="請選擇分類" v-model="reviewType_1_value" clearable)
            el-option( v-for="val,index in reviewType_1_option" :label="val.label" :value="val.value" :key="`${val.label}${index}`")

          el-select( placeholder="請選擇主題" v-model="reviewType_2_value" clearable :disabled="!reviewType_2_option.length")
            el-option( v-for="val,index in reviewType_2_option" :label="val.label" :value="val.value" :key="`${val.label}${index}`")

          el-select( placeholder="請選擇項目" v-model="reviewType_3_value" clearable :disabled="!reviewType_3_option.length")
            el-option( v-for="val,index in reviewType_3_option" :label="val.label" :value="val.value" :key="`${val.label}${index}`")

          el-input(placeholder="關鍵字篩選" type="text" v-model="reviewKeyword" clearable)

        div(v-infinite-scroll="reviewListLoadHandler" style="height:500px;overflow: auto;")
          caseList(:data="reviewListModel")

            template(slot-scope="item")
              template(v-if="item.data.hasOwnProperty('filetype')")
                .review-cell
                  a(:href="item.data.files" :title="`${item.data.title}${item.data.filetype}`" target="_blank") {{item.data.title}}{{item.data.filetype}}

              template(v-else-if="item.data.hasOwnProperty('Memo')")
                .review-cell
                  a(:href="item.data.files" :title="item.data.Memo" target="_blank") {{item.data.Memo}}

              template(v-else-if="item.data.hasOwnProperty('DocTitle')")
                .review-cell
                  el-tag(size="mini" style="margin-right:1rem;" v-if="item.data.Date") {{new Date(item.data.Date).toLocaleDateString().replace(/\//g,".").replace(/^\d{4}/, y=>Number(y)-1911)}}
                  a(:href="item.data.DocUrl" :title="item.data.DocTitle" target="_blank") {{item.data.DocTitle.replace(/^\d+/,"")}}

              template(v-else-if="item.data.hasOwnProperty('fileArray')")
                .review-cell
                  el-tag(size="mini" style="margin-right:1rem;" v-if="item.data.date") {{item.data.date.replace(/-/g,".")}}
                  a(href="javascript:;" @click="openfileArray(item.data.fileArray)" :title="item.data.title" ) {{item.data.title}}

              template(v-else)
                .review-cell
                  el-tag(size="mini" style="margin-right:1rem;" v-if="item.data.cbDate") {{item.data.cbDate}}
                  a(:href="item.data.files" :title="item.data.title" target="_blank") {{item.data.title}}

      //- 法規
      el-tab-pane(label="法規" name="法規")
        el-button(
          style="margin:1rem;"
          title="本市法規 ( 新視窗開啟連結 )"
          type="primary"
          round
          plain
          icon="el-icon-connection"
          @click="$openLink('https://urban.hccg.gov.tw/ch/home.jsp?id=38&parentpath=0,19,25')"
        ) 本市法規
        el-button(
          style="margin:1rem;"
          type="primary"
          round
          plain
          title="標準作業流程 ( 新視窗開啟連結 )"
          icon="el-icon-connection"
          @click="$openLink('https://urban.hccg.gov.tw/ch/home.jsp?id=24&parentpath=0,19')"
        ) 標準作業流程

</template>


<script>

import caseList from '@/components/caseList'
import datePickInterval from '@/components/datePickInterval'

import urbanPlanUrbanCaseTimeLine from '@/components/urbanPlanUrbanCaseTimeLine'

import api from '@/api'

export default {
    name:'news',
    components:{
      caseList,
      datePickInterval,
      urbanPlanUrbanCaseTimeLine
    },
    data:()=>({
      loading: false,

      //- 預設頁籤
      currentTabName: "公告專區",

      //- 計畫動態
      planStatus: "",
      planType: "",
      planKeyword: "",
      planCase:[],
      planCaseAmount:10,
      planFilterVisibility:false,

      //- 公告
      announcementList: [],
      announcementDateInterval:["",""],
      announcementType:null,
      announcementKeyword:"",
      announcementAmount:10,

      //- 審議
      reviewList:[],
      reviewListAmount:10,
      reviewKeyword:"",

      //- 審議 1
      reviewType_1_value:"",
      reviewType_1_option_enum:[
        "都市計畫",
        "都市設計",
        "都市更新"
      ],

      //- 審議 2
      reviewType_2_value:"",
      reviewType_2_option_enum:[
        "都市計畫_委員會",

        "都市設計_委員會",
        "都市設計_幹事會",

        "都市更新_都更及爭議處理審議會",
        "都市更新_更新地區推動小組",
        "都市更新_住宅諮詢及審議委員會"
      ],

      //- 審議 3
      reviewType_3_value:"",
      reviewType_3_option_enum:[
        "都市計畫_委員會_會議紀錄及議程",
        "都市計畫_委員會_委員名冊",

        "都市設計_委員會_會議紀錄",
        "都市設計_委員會_委員名冊",
        "都市設計_幹事會_會議紀錄",

        "都市更新_都更及爭議處理審議會_議程與會議紀錄",
        "都市更新_都更及爭議處理審議會_委員名冊",
        "都市更新_都更及爭議處理審議會_設置依據",

        "都市更新_更新地區推動小組_議程與會議紀錄",
        "都市更新_更新地區推動小組_委員名冊",
        "都市更新_更新地區推動小組_設置依據",

        "都市更新_住宅諮詢及審議委員會_議程與會議紀錄",
        "都市更新_住宅諮詢及審議委員會_委員名冊",
        "都市更新_住宅諮詢及審議委員會_設置依據"
      ],

    }),
    computed:{
      reviewType_1_option(){
        let option = this.reviewType_1_option_enum.map(i=>({label:i,value:i}))
        //- 如果只有一個選項 自動選擇
        if(option.length === 1){
          this.reviewType_1_value = option[0].value
        }
        return option
      },
      reviewType_2_option(){
        let option = []
        let v = this.reviewType_1_value
        if(!v) return option
        this.reviewType_2_option_enum.forEach(el => {
          if(new RegExp(v,"g").test(el)){
            option.push({
              label:el.replace(new RegExp(v+"_"),""),
              value:el,
            })
          }
        })
        //- 如果只有一個選項 自動選擇
        if(option.length === 1){
          this.reviewType_2_value = option[0].value
        }

        return option
      },
      reviewType_3_option(){
        let option = []
        let v = this.reviewType_2_value
        if(!v) return option
        this.reviewType_3_option_enum.forEach(el => {
          if(new RegExp(v,"g").test(el)){
            option.push({
              label:el.replace(new RegExp(v+"_"),""),
              value:el,
            })
          }
        })
        //- 如果只有一個選項 自動選擇
        if(option.length === 1){
          this.reviewType_3_value = option[0].value
        }
        return option
      },
      reviewListModel(){
        let result = this.reviewList

        if(this.reviewKeyword){
          result = result.filter(({Memo,DocTitle,title})=>{
            const reg = new RegExp(this.reviewKeyword,"g")
            return reg.test(Memo) || reg.test(DocTitle) || reg.test(title)
          })
        }

        return result.filter((i,index)=>index<this.reviewListAmount)
      },
      announcementListModel(){
        let resultFilterd = this.announcementList
        //- filter type
        if(this.announcementType){
          resultFilterd = resultFilterd.filter(o=>new RegExp(this.announcementType,"g").test(o.type))
        }
        //- filter date
        let startD = this.announcementDateInterval[0]
        let endD = this.announcementDateInterval[1]

        resultFilterd = resultFilterd.filter(o=>{
          let caseD = new Date(o.post_date)
          if(startD && endD){
            return caseD <= endD && caseD >= startD
          }
          if(startD){
            return caseD >= startD
          }
          if(endD){
            return caseD <= endD
          }
          return true
        })

        //- filter keyword
        if(this.announcementKeyword){
          resultFilterd = resultFilterd.filter(o=>Object.keys(o).some(k=>new RegExp(String(this.announcementKeyword),"g").test(o[k])))
        }

        return resultFilterd.filter((i,index)=>index<=this.announcementAmount)//- filter amount
      },
      planCaseModel(){
        let status = this.planCase.filter(i=>{
          switch(this.planStatus){
            case "辦理中":
              return !i.AdminDate
            case "發布實施":
              return i.AdminDate
            default:
              return true
          }
        })
        let requirement = status.filter(i=>{
          switch(this.planType){
            case "新訂":
              return /新訂/g.test(i.CorePlanProperty)
            case "通盤檢討":
              return /通盤檢討/g.test(i.CorePlanProperty)
            case "個案變更":
              return /個案變更/g.test(i.CorePlanProperty)
            default:
              return true
          }
        })

        let keyword = requirement.filter(i=>new RegExp(this.planKeyword,"g").test(i.PlanName))
        // 發布實施 按 AdminDate 降冪
        const groupA = keyword.filter(i=>i.AdminDate).sort((a,b)=>{
          let diff = 0
          const aD = a.AdminDate.split('/')
          const bD = b.AdminDate.split('/')
          diff = new Date(1911+aD[0],aD[1],aD[2]) - new Date(1911+bD[0],bD[1],bD[2])
          return diff ? (diff>0) ? -1 : 0 : 0
        })
        // 辦理中 按 CorePlanFileNo 升冪
        const groupB = keyword.filter(i=>!i.AdminDate).sort((a,b)=>{
          let diff = 0
          diff = a.CorePlanFileNo.replace(/\-/,"")-b.CorePlanFileNo.replace(/\-/,"")
          return diff ? (diff>0) ? -1 : 0 : 0
        })

        let limit =  groupA.concat(groupB).filter((i,index)=>index<=this.planCaseAmount)

        return limit
      }
    },
    methods:{
      openfileArray(fileArray){
        for (const filePath of fileArray) {
          window.open(filePath, "_blank")
        }
      },
      getPlanTagType(type){
        if(/都市計畫/g.test(type)) return "primary"
        if(/都市更新/g.test(type)) return "success"
        if(/樁位資訊/g.test(type)) return "info"
      },
      //- 都計 - 捲動載入控制
      planStatusLoadHandler(){
        this.planCaseAmount += 5
      },
      //- 公告資訊 - 捲動載入控制
      announcementLoadHandler(){
        if(this.announcementListModel.length){
          this.announcementAmount+=5
        }
      },
      //- 審議會 - 捲動載入控制
      async reviewListLoadHandler(){
        if(!this.reviewList.length) return
        this.reviewListAmount+=5

        console.log("[this.reviewType_1_value]",this.reviewType_1_value)
        if(this.reviewType_1_value !== "都市設計") return

        if(this.reviewType_3_value){
          await this.handleReview3Condition(this.reviewType_3_value)
        }else if(this.reviewType_2_value){
          await this.handleReview2Condition(this.reviewType_2_value)
        }else if(this.reviewType_1_value){
          await this.handleReview1Condition(this.reviewType_1_value)
        }

      },
      // 都市計畫_審議會_type(1:會議紀錄/2:委員名冊) 取得
      async getUrbanPlanCouncilFiles(type){
        try{
          this.loading = true
          return await api.GetCityPlanCouncilFiles({type})
        }catch(e){
          console.error("無法取得都市計畫審議會記錄"+e,{type:"warning"})
          return []
        }finally{
          this.loading = false
        }
      },
      // 取得 都市設計_委員會_委員名冊
      async getCommitteeMember({PaginationSize}){
        try{
          this.loading = true
          return await api.GetCommitteeMember({PaginationSize})
        }catch(e){
          console.error("都市設計_委員會_委員名冊"+e,{type:"warning"})
          return []
        }finally{
          this.loading = false
        }
      },
      // 取得 都市設計_委員會_會議紀錄
      async getCommitteeMeetingMinutesList({PaginationSize}){
        try{
          this.loading = true
          return await api.GetCommitteeMeetingMinutesList({PaginationSize})
        }catch(e){
          console.error("無法取得都市設計_委員會_會議紀錄"+e,{type:"warning"})
          return []
        }finally{
          this.loading = false
        }
      },
      // 取得 都市設計_幹事會
      async getCouncilMeetingMinutesList({PaginationSize}){
        try{
          this.loading = true
          return await api.GetCouncilMeetingMinutesList({PaginationSize})
        }catch(e){
          console.error("無法取得都市設計_幹事會"+e,{type:"warning"})
          return []
        }finally{
          this.loading = false
        }
      },
      // 取得 都市更新_className(都更及爭議處理審議會|更新地區推動小組|住宅諮詢及審議委員會)_type(議程與會議紀錄|委員名冊|設置依據)
      async GetCouncilFiles({type, className}){
        try{
          this.loading = true

          const {file,data} = await api.GetCouncilFiles({type, className})
          console.log("[api.GetCouncilFiles] file", file)
          console.log("[api.GetCouncilFiles] data", data)

          return data.map(({Council_Name,Council_Time,Council_id,Council_Type})=>{
            const {FileArray = []} = file.find(({council_id})=>Council_id==council_id) || {}
            return {
              fileArray:FileArray,
              date:Council_Time,
              title:Council_Name+Council_Type
            }
          })

        }catch(e){
          console.error(`無法取得都市更新_${className}_${type} `+e)
          return []
        }finally{
          this.loading = false
        }
      },
      //- 第一個選項 可能的情況
      async handleReview1Condition(val){
        switch(val){
          case "都市計畫":
            this.reviewList = await this.getUrbanPlanCouncilFiles(1)
            break
          case "都市設計":
            this.reviewList = [
              ...(await this.getCommitteeMember({PaginationSize:this.reviewListAmount})),
              ...(await this.getCommitteeMeetingMinutesList({PaginationSize:this.reviewListAmount})),
              ...(await this.getCouncilMeetingMinutesList({PaginationSize:this.reviewListAmount}))
            ]
            break
          case "都市更新":
            this.reviewList = [
              ...(await this.GetCouncilFiles({type:"議程與會議紀錄",className:"都更及爭議處理審議會"})),
              ...(await this.GetCouncilFiles({type:"議程與會議紀錄",className:"更新地區推動小組"})),
              ...(await this.GetCouncilFiles({type:"議程與會議紀錄",className:"住宅諮詢及審議委員會"})),

              ...(await this.GetCouncilFiles({type:"委員名冊",className:"都更及爭議處理審議會"})),
              ...(await this.GetCouncilFiles({type:"委員名冊",className:"更新地區推動小組"})),
              ...(await this.GetCouncilFiles({type:"委員名冊",className:"住宅諮詢及審議委員會"})),

              ...(await this.GetCouncilFiles({type:"設置依據",className:"都更及爭議處理審議會"})),
              ...(await this.GetCouncilFiles({type:"設置依據",className:"更新地區推動小組"})),
              ...(await this.GetCouncilFiles({type:"設置依據",className:"住宅諮詢及審議委員會"})),
            ]
            break
          default:
            this.reviewList = [
              ...(await this.getUrbanPlanCouncilFiles(1)),
              ...(await this.getCommitteeMember({PaginationSize:this.reviewListAmount})),
              ...(await this.getCommitteeMeetingMinutesList({PaginationSize:this.reviewListAmount})),
              ...(await this.getCouncilMeetingMinutesList({PaginationSize:this.reviewListAmount}))
            ]
        }
      },
      //- 第二個選項 可能的情況
      async handleReview2Condition(val){
        switch(val){
          case "都市計畫_委員會":
              this.reviewList = [
                ...(await this.getUrbanPlanCouncilFiles(1)),
                ...(await this.getUrbanPlanCouncilFiles(2)),
              ]
            break

          case "都市設計_委員會":
            this.reviewList = [
              ...(await this.getCommitteeMeetingMinutesList({PaginationSize:this.reviewListAmount})),
              ...(await this.getCommitteeMember({PaginationSize:this.reviewListAmount}))
            ]
            break
          case "都市設計_幹事會":
            this.reviewList = await this.getCouncilMeetingMinutesList({PaginationSize:this.reviewListAmount})
            break

          case "都市更新_都更及爭議處理審議會":
            this.reviewList = [
              ...(await this.GetCouncilFiles({type:"議程與會議紀錄",className:"都更及爭議處理審議會"})),
              ...(await this.GetCouncilFiles({type:"委員名冊",className:"都更及爭議處理審議會"})),
              ...(await this.GetCouncilFiles({type:"設置依據",className:"都更及爭議處理審議會"}))
            ]
            break
          case "都市更新_更新地區推動小組":
            this.reviewList = [
              ...(await this.GetCouncilFiles({type:"議程與會議紀錄",className:"更新地區推動小組"})),
              ...(await this.GetCouncilFiles({type:"委員名冊",className:"更新地區推動小組"})),
              ...(await this.GetCouncilFiles({type:"設置依據",className:"更新地區推動小組"}))
            ]
            break
          case "都市更新_住宅諮詢及審議委員會":
            this.reviewList = [
              ...(await this.GetCouncilFiles({type:"議程與會議紀錄",className:"住宅諮詢及審議委員會"})),
              ...(await this.GetCouncilFiles({type:"委員名冊",className:"住宅諮詢及審議委員會"})),
              ...(await this.GetCouncilFiles({type:"設置依據",className:"住宅諮詢及審議委員會"}))
            ]
            break
        }
      },
      //- 第三個選項 可能的情況
      async handleReview3Condition(val){
        switch(val){
          case "都市計畫_委員會_委員名冊":
            this.reviewList = await this.getUrbanPlanCouncilFiles(2)
            break
          case "都市計畫_委員會_會議紀錄及議程":
            this.reviewList = await this.getUrbanPlanCouncilFiles(1)
            break
          case "都市設計_委員會_會議紀錄":
            this.reviewList = await this.getCommitteeMeetingMinutesList({PaginationSize:this.reviewListAmount})
            break
          case "都市設計_委員會_委員名冊":
            this.reviewList = await this.getCommitteeMember({PaginationSize:this.reviewListAmount})
            break
          case "都市設計_幹事會_會議紀錄":
            this.reviewList = await this.getCouncilMeetingMinutesList({PaginationSize:this.reviewListAmount})
            break
          case "都市更新_都更及爭議處理審議會_議程與會議紀錄":
            this.reviewList = await this.GetCouncilFiles({type:"議程與會議紀錄",className:"都更及爭議處理審議會"})
            break
          case "都市更新_都更及爭議處理審議會_委員名冊":
            this.reviewList = await this.GetCouncilFiles({type:"委員名冊",className:"都更及爭議處理審議會"})
            break
          case "都市更新_都更及爭議處理審議會_設置依據":
            this.reviewList = await this.GetCouncilFiles({type:"設置依據",className:"都更及爭議處理審議會"})
            break
          case "都市更新_更新地區推動小組_議程與會議紀錄":
            this.reviewList = await this.GetCouncilFiles({type:"議程與會議紀錄",className:"更新地區推動小組"})
            break
          case "都市更新_更新地區推動小組_委員名冊":
            this.reviewList = await this.GetCouncilFiles({type:"委員名冊",className:"更新地區推動小組"})
            break
          case "都市更新_更新地區推動小組_設置依據":
            this.reviewList = await this.GetCouncilFiles({type:"設置依據",className:"更新地區推動小組"})
            break
          case "都市更新_住宅諮詢及審議委員會_議程與會議紀錄":
            this.reviewList = await this.GetCouncilFiles({type:"議程與會議紀錄",className:"住宅諮詢及審議委員會"})
            break
          case "都市更新_住宅諮詢及審議委員會_委員名冊":
            this.reviewList = await this.GetCouncilFiles({type:"委員名冊",className:"住宅諮詢及審議委員會"})
            break
          case "都市更新_住宅諮詢及審議委員會_設置依據":
            this.reviewList = await this.GetCouncilFiles({type:"設置依據",className:"住宅諮詢及審議委員會"})
            break
        }
      }
    },
    async mounted(){
        try{
          this.loading = true
          this.reviewType_1_value = "都市計畫" //- 審議會
          this.announcementList = await api.GetAllTypeAnnouncementList()//- 公告資訊
          this.planCase = await api.GetUrbanCaseListByCriteria({})//- 計畫動態
        }catch(e){
          console.error(e)
          this.$alert("無法載入公告資訊 : " + e, {type:"warning"})
        }finally{
          this.loading = false
        }
    },
    watch:{
      // 公告專區 、都市更新開新連結
      announcementType:{
        handler(n,o){
          if(n === "都市更新"){
            window.open("https://urban.hccg.gov.tw/ch/home.jsp?id=3&parentpath=0,1&mcustomize=announcement_list.jsp","_blank")
            this.announcementType = o // not change to 都市更新 (use old value)
          }
        }
      },
      // 當頁籤切換重置所有已載入總量
      currentTabName:{
        handler(){
          this.announcementAmount = 10
          this.planCaseAmount = 10
          this.reviewListAmount = 10
        }
      },
      // 第一個選項 所選的值
      reviewType_1_value:{
        async handler(val){
          this.reviewListAmount = 10
          this.reviewType_2_value=''
          this.reviewType_3_value=''
          if(!val){// 空值載入
            await this.handleReview1Condition()
            return
          }
          // 預設載入
          await this.handleReview1Condition(val)
        }
      },
      // 第二個選項 所選的值
      reviewType_2_value:{
        async handler(val){
          this.reviewListAmount = 10
          this.reviewType_3_value=''
          if(!val){// 空值載入
            if(this.reviewType_1_value){
              await this.handleReview1Condition(this.reviewType_1_value)
            }
            return
          }
          // 預設載入
          await this.handleReview2Condition(val)
        }
      },
      // 第三個選項 所選的值
      reviewType_3_value:{
        async handler(val){
          this.reviewListAmount = 10
          if(!val){ // 空值載入
            if(this.reviewType_2_value){
              await this.handleReview2Condition(this.reviewType_2_value)
            }else if(this.reviewType_1_value){
              await this.handleReview1Condition(this.reviewType_1_value)
            }
            return
          }
          // 預設載入
          await this.handleReview3Condition(val)
        }
      }
    }
}

</script>

<style lang="scss" scoped>
  /deep/ {
    .el-input__inner{
      border-radius: 2rem;
    }
  }

  // 計畫動態
  .planStatus-filter{
    display: flex;
    flex-wrap: wrap;
    margin: 1rem -1rem;
    &>*{
      margin: 1rem;
      flex:1 0 250px;
      &:nth-last-of-type(1){
        flex:1 1 200px;
      }
    }
  }

  // announcement
  .announcement-filter {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -1rem;
    &>*{
      margin: 1rem;
      flex:1 0 200px;
      &:nth-last-of-type(1){
        flex:1 1 200px;
      }
    }
  }

  .announcement-cell{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
    margin:0.5rem 0.25rem;
  }

  // review
  .review-filter{
    display: flex;
    flex-wrap: wrap;
    margin: 0 -0.5rem;
    &>*{
      margin: 0.5rem;
      flex:1 0 180px;
      &:nth-last-of-type(1){
        flex:1 1 200px;
      }
    }
  }
  .review-cell{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
    margin:0.5rem 0.25rem;
    &:nth-last-of-type(1){
      flex:1 0 70%;
    }
    flex:1 0 250px;
  }

  @media screen and (max-width: 768px){
    .announcement-cell,.review-cell{
      white-space: normal;
    }
  }

</style>
