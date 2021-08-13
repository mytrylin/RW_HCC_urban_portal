<template lang="pug">
	.dashboard(v-loading='loading')
		el-tabs(v-model="currentTabName" stretch type="border-card")

			//- 標註資料時間
			p(style="text-align:center;")
				small
					strong {{dataYearRangeOfCaption}}

			//- 都市計畫
			el-tab-pane(label="都市計畫" name="urbanPlan")
				.dashboard__caption(v-if="currentTabName==='urbanPlan'")
					.dashboard__caption__item(v-for='val in urbanPlan.caption')
						strong {{val.title}}
						.number
							Number.number__value.number__value--urbanPlan(
								:from="0"
								:to="val.data"
								:duration="0.5"
								easing="Power1.easeOut"
								:ref="`urbanPlan_number_${val.data}`"
								@complete="handleComplete($refs[`urbanPlan_number_${val.data}`][0].$el,urbanPlan.caption.find(o=>o.title===val.title))"
							)
							small
								small {{ val.postfix }}
			//- 建築管理
			el-tab-pane(label="建築管理" name="buildingManagement")
				.dashboard__caption(v-if="currentTabName==='buildingManagement'")
					.dashboard__caption__item(v-for='val in buildingManagement.caption')
						strong {{val.title}}
						.number
							Number.number__value.number__value--buildingManagement(
								:from="0"
								:to="val.data"
								:duration="0.5"
								easing="Power1.easeOut"
								:ref="`buildingManagement_number_${val.data}`"
								@complete="handleComplete($refs[`buildingManagement_number_${val.data}`][0].$el,buildingManagement.caption.find(o=>o.title===val.title))"
							)
							small
								small {{ val.postfix }}
			//- 案件申請
			el-tab-pane(label="案件申請" name="application")
				.dashboard__caption(v-if="currentTabName==='application'")
					.dashboard__caption__item(v-for='val in application.caption')
						strong {{val.title}}
						.number
							Number.number__value.number__value--application(
								:from="0"
								:to="val.data"
								:duration="0.5"
								easing="Power1.easeOut"
								:ref="`application_number_${val.data}`"
								@complete="handleComplete($refs[`application_number_${val.data}`][0].$el,application.caption.find(o=>o.title===val.title))"
							)
							small
								small {{ val.postfix }}
			//- chart
			component(
				:is="screenWidth>768?'ve-histogram':'ve-bar'"
				v-bind="chartOptions"
			)

</template>

<script>

import Number from 'vue-number-animation/Number'

import api from "@/api"

/*
 * @see https://www.echartsjs.com/zh/tutorial.html#%E5%9C%A8%20webpack%20%E4%B8%AD%E4%BD%BF%E7%94%A8%20ECharts
 */

export default {
		name:'dashboard',
		components:{
				Number
		},
		computed:{
			dataYearRangeOfCaption(){ // tag(caption) 的資料時間範圍
        console.log("[this.chartOptions]",this.chartOptions)
				let yArr = this[this.currentTabName]['captionYearRange']

        let isSeq = true // 是否連續

        if(yArr.length === 1 ){
          isSeq = false
        }else{
          yArr.forEach((y,index)=>{
            if( !yArr[index+1] || !isSeq ) return
            isSeq = yArr[index+1] === y+1
          })
        }

        let resultRangeStr = `資料統計時間 ${yArr.join()} 年`

				if(isSeq){ // 連續取 最小 ~ 最大
					resultRangeStr = `資料統計時間 ${Math.min(...yArr)} ~ ${Math.max(...yArr)} 年`
        }

        return resultRangeStr

			},
			chartOptions(){
				let options = {}
				let colors = {
					// application:['#2b7852','#37d788','#5e9b7d'], #cddc39
					urbanPlan:['#7ebbf8','#4f78bc','#244d91','#002460'],
					application:['#8bc34a','#5e9b7d','#37d788'],
					buildingManagement:['#f89d9d','#f26363','#e02929'],
				}
				options.colors = colors[this.currentTabName]
				options.data = this[this.currentTabName]['chartData']
				options.grid = {
					containLabel: true
				}
				options.legend = {
					itemGap:50,
					type:'scroll'
				}

				//- 高度、label valeu 設置
				if(this.screenWidth <= 768) {
					options.height = '1000px'
					options.extend = {
						series: {
							type: 'bar',
							label: { show: true, position: "right" }
						}
					}
				}else{
					options.height = '500px'
					options.extend = {
						series: {
							type: 'bar',
							label: { show: true, position: "top" }
						}
					}
				}

				return options
			}
		},
		data:()=>({
			//-
			loading:false,
			//- screenWidth
			screenWidth:window.innerWidth,
			//- link to following properties
			currentTabName:"urbanPlan",
			//- urbanPlan no data
			urbanPlan:{
        caption:[], //- [...{title,data,postfix,最新年度}]
        captionYearRange:[], // number
				chartData:{
					columns: [], // [...title]
					rows: [] // [...{title}]
				}
			},
			application:{
        caption:[], //- [...{title,data,postfix}]
        captionYearRange:[], // number
				chartData:{
					columns: [], // [...title]
					rows: [] // [...{title}]
				}
			},
			buildingManagement:{
        caption:[], //- [...{title,data,postfix}]
        captionYearRange:[], // number
				chartData:{
					columns: [], // [...title]
					rows: [] // [...{title}]
				}
			}
		}),
		async mounted(){

			try{

				this.loading = !this.loading

        //-------
        // 都市計畫指標
        //-------
				let up = await api.GetUrbanPlanCountList()
				this.urbanPlan.caption = [...up['level1'],...up['level2']]
				//- Number animation only accept interger
				this.urbanPlan.caption.forEach(i=>{
					i['data_float'] =  String(i['data'])
					i['data'] = Math.floor(i['data'])
				})
				this.urbanPlan.chartData.columns = Object.keys(up['level3'][0]).filter(k=>k!=="公設已開闢率") //- 取陣列中一個物件的所有鍵名
				this.urbanPlan.chartData.rows = up['level3']
				this.urbanPlan.chartData.rows.forEach(i=>i["年度"] = `${i["年度"]}\n\n公設已開闢率\n\n${i["公設已開闢率"]}%`)
        this.urbanPlan.captionYearRange = [this.urbanPlan.caption[0]['最新年度']]

        //-------
        // 建築管理指標
        //-------
				let bdlic = await api.GetBdLicYearCountList()
				this.buildingManagement.caption = Object.keys(bdlic['level1']).map(k=>({
					title: k.split("_")[0],
					data_float: String(bdlic['level1'][k]),
					data: Math.floor(bdlic['level1'][k]),
					postfix: "",
				}))
				this.buildingManagement.chartData.columns = Object.keys(bdlic['level2'][0]) //- 取陣列中一個物件的所有鍵名
				this.buildingManagement.chartData.rows = bdlic['level2']
        this.buildingManagement.captionYearRange = this.buildingManagement.chartData.rows.map(i=>i["年度"])
        //-------
        //  案件申請指標
        //-------
				let ACY = await api.GetApplicationCaseYearCountList()

        //  計算累計案件數
				let sa1Cnt = 0 // 使用分區證明書申請件數
				let sa2Cnt = 0 // 地形圖資申請件數
				ACY.forEach(i=>{
          sa1Cnt+=i['使用分區證明書申請件數']
          sa2Cnt+=i['地形圖資申請件數']
        })

				// this.application.caption = await api.GetApplicationCaseCountList() //- old
				this.application.caption = [
					{
						title:"使用分區證明書申請件數",
						data_float:String(sa1Cnt),
						data:Math.floor(sa1Cnt)
					},
					{
						title:"地形圖資申請件數",
						data_float:String(sa2Cnt),
						data:Math.floor(sa2Cnt)
					}
        ]

        // 圖表呈現近五年
        const cy = new Date().getFullYear()
				this.application.chartData.rows = ACY.filter(i=>(cy-4)<=i['年度'] && i['年度']<=cy)
				this.application.chartData.columns = Object.keys(ACY[0]) //- 取陣列中一個物件的所有鍵名
        this.application.captionYearRange = ACY.map(i=>i["年度"])

			}catch(e){
        console.error("[ dashboard mounted ] 無法獲取儀表板資訊 : " + e)
			}finally{
				this.loading = !this.loading
				console.log("[ urbanPlan ]",this.urbanPlan)
				console.log("[ buildingManagement ]",this.buildingManagement)
				console.log("[ application ]",this.application)
			}

			// emit the widow size
			window.addEventListener("resize",()=>this.screenWidth = window.innerWidth)

		},
		methods:{
			//- handle Number component to add addThousandComma
			handleComplete(elm,ptr){
				this.$nextTick(()=>{
					elm.innerText = this.addThousandComma(ptr.data_float)
				})
			},
			//- add Thousand Comma
			addThousandComma(number){
				let num = number.toString()
				let pattern = /(-?\d+)(\d{3})/
				while(pattern.test(num))
				{
					num = num.replace(pattern, "$1,$2")
				}
				return num
			}
		}
}
</script>


<style lang="scss" scoped>

.number{
	flex-shrink: 0;
	padding: 0 0.5rem;
	&__value{
		font-weight: bold;
		font-size: 2rem;
		&--urbanPlan{color: $primary;}
		&--application{color: #2b7852;}
		&--buildingManagement{color: #f44336;}
	}
}

.dashboard{
	&__caption{
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		margin: 2rem 0;
		&__item{
			display: flex;
			margin: 1rem;
			align-items: center;
			justify-content: center;
			min-width: 300px;
			flex: 1 0 30%;
		}
	}
}

</style>
