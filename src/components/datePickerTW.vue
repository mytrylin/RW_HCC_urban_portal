<style lang="scss" scoped >
    .datePicker{
        width:100%;
    }

    .header{
        display:flex;
        justify-content: space-between;
        align-items: center;
    }

    //- override element-ui
    /deep/ {
        .el-calendar{
          &__header{
              display: none;
          }
          &__body{
              padding: 0;
          }
        }

        .el-calendar-table{
          .el-calendar-day{
            height: 42px;
            &:hover{
              color:#fff;
              background-color: #27b5c8;
            }
          }
          .is-selected{
            color:#fff;
            background-color: #27b5c8;
          }
        }

        .el-input{
            margin: 0;
        }

        .el-input {
          &__prefix,&__suffix{
            width:30px; // same as input's padding left
            justify-content: center;
            display: flex;
            align-items: center;
          }
        }
    }

</style>

<template lang="pug">
    .datePicker
        el-popover(v-model="calendarVisibilityModel" placement='bottom' width='350' trigger='click' :disabled="!useCalendar")
            .header
                span
                    el-button(type="text" @click="_addCalendarYear(-1)" title="往前ㄧ年" icon="el-icon-d-arrow-left")
                    el-button(type="text" @click="_addCalendarMonth(-1)" title="往前ㄧ月" icon="el-icon-arrow-left")
                span.header__dateLabel(style="text-align:center;")
                    strong {{`民國${this.yearRoc}年${this.month}月`}}
                span
                    el-button(type="text" @click="_addCalendarMonth(1)" title="往後ㄧ月" icon="el-icon-arrow-right")
                    el-button(type="text" @click="_addCalendarYear(1)" title="往後ㄧ年" icon="el-icon-d-arrow-right")

            el-calendar(v-model="calendarModel")
                template(slot='dateCell' slot-scope='{data}')
                    //- 正常 - 超過傳入的起訖區間
                    span(v-if="!isDateExceedStart(new Date(data.day)) && !isDateExceedEnd(new Date(data.day))")
                        | {{data.day.split('-')[2]}}
                    //- 禁用
                    s(v-else style="color:#C0C4CC;")
                        | {{data.day.split('-')[2]}}
            //- @blur=""
            el-input(
                placeholder="yyy/mm/dd"
                slot='reference'
                :size="size"
                v-model="currentDateString"
                @change='handleFinalDate($event);calendarVisibility = false'
            )
                slot(name="suffix" slot="suffix")
                slot(name="prefix" slot="prefix")

</template>

<script>

/**
 *
 * Emitors:
 *
 * @input(Date)
 * @error(String)
 *
 *
*/

//- 轉換失敗則回傳 new Date()
let transactToDate = payload=>{
  if(typeof payload !== "string"){
    if(payload instanceof Date) return payload
    new TypeError("transactToDate(payload) payload expected String got :"+ typeof payload)
  }

  payload = payload.match(/[\w]*/g).filter(v=>v)

  if(!payload || payload.length!==3){ //- 如果解析為非法
    return new Date()
  }

  let y = payload[0]
  let m = payload[1]
  let d = payload[2]

  if(checkYearIsROC(y)){
    y = Number(y) + 1911
  }

  let date = new Date(`${y}/${m}/${d}`)

  if(!date || isNaN(date.getTime())){ //- 如果解析為非法
    return new Date()
  }

  return date
}

//- 是否為民國年 但 民國 1911 年 後則無法判斷
let checkYearIsROC = year=>{
  if(typeof year === "string" && typeof year === "number"){
    new TypeError("checkYearIsROC(year) year expected String|Number , got : " + typeof year)
  }
  return Number(year) - 1911 < 0
}

export default {
    name: 'datePicker',
    data(){
        return{
            calendarVisibility:false,
            start:null,
            end:null,
            //- -----
            currentDateString:'',
            //- -----
            lastDateString:''
        }
    },
    props:{
        //- 給定預設時間
        value:{
          type:Date|String,
          validator: d=> d instanceof Date || new Date(d) instanceof Date
        },
        //- 區間起訖 : 有傳入的才會進行限制
        intervalStart:{
          type:Date|String,
          validator: d=> d instanceof Date || new Date(d) instanceof Date
        },
        intervalEnd:{
          type:Date|String,
          validator: d=> d instanceof Date || new Date(d) instanceof Date
        },
        //- 是否使用日曆選取功能 : 若否只能輸入文字
        useCalendar:{
            type:Boolean,
            default:true
        },
        size:{
            type:String,
            default:'small'
        },
        useErrAlertDialog:{
          type:Boolean,
          default:true // 若否 ， 則僅會 emit 'error'
        },
    },
    computed:{
        calendarVisibilityModel:{
          get(){
            return this.calendarVisibility && this.useCalendar
          },
          set(bool){
            this.calendarVisibility = bool
          }
        },
        intervalStartModel:{
          get(){
            return this.start || this.intervalStart
          },
          set(date){
            this.start = date ? transactToDate(this.start) : null
          }
        },
        intervalEndModel:{
          get(){
            return this.end || this.intervalEnd
          },
          set(date){
            this.end = date ? transactToDate(this.end) : null
          }
        },
        //- 以下 getter 所計算的值 需要等到 currentDateString 被 set 後 ( 經由 this.handleFinalDate() )  才會正確
        calendarModel:{
          get(){
            return this.Date
          },
          set(date){
            if(!this.isDateExceedStart(date) && !this.isDateExceedEnd(date)){
              this.handleFinalDate(date)
            }
          }
        },
        Date(){
          return transactToDate(this.currentDateString)
        },
        year(){
          return this.Date.getFullYear()
        },
        month(){
          return this.Date.getMonth()+1
        },
        date(){
          return this.Date.getDate()
        },
        //- extract ---
        yearRoc(){
          return Number(this.year) - 1911
        },
        ROCDateLocalString(){
          return `${this.yearRoc}/${this.month}/${this.date}`
        },
        UTCDate(){
          return new Date(Date.UTC(this.year, this.month-1, this.date))
        },
        UTCDateJSON(){
          return this.UTCDate.toJSON()
        },
        timeStamp(){
          return this.Date.getTime()
        }
    },
    methods:{
        //- 超過開始時間 true : false
        isDateExceedStart(date){
          return this.intervalStartModel && ( date - this.intervalStartModel < 0 )
        },
        //- 超過結束時間 true : false
        isDateExceedEnd(date){
          return this.intervalEndModel && ( date - this.intervalEndModel > 0 )
        },
        //! 重要操作 : 流程結束點 - transactToDate() 類似處理但不同
        handleFinalDate(payload){

            //- 空值回傳
            if(payload === ""){
              this.$emit("input","")
              return
            }

            let date = null

            if(typeof payload === 'string'){

              let str = payload.match(/[\w]*/g).filter(v=>v)

              if(!str || str.length!==3){
                this.$emit("error",`${this.currentDateString} 不符合格式 yyy|yyyy/mm/dd`)
                this.useErrAlertDialog && this.$alert(`${this.currentDateString} 不符合格式 yyy|yyyy/mm/dd`, {type:'error'})
                this.currentDateString = this.lastDateString || new Date().toLocaleDateString()
                return
              }

              let y = str[0]
              let m = str[1]
              let d = str[2]

              if(checkYearIsROC(y)){
                y = Number(y) + 1911
              }

              date = new Date(`${y}/${m}/${d}`)
            }else if( payload instanceof Date ){
              date = payload
            }

            //- 輸入非法
            if(!date || isNaN(date.getTime())){
              this.$emit("error",`${this.currentDateString} 非法時間`)
              this.useErrAlertDialog && this.$alert(`${this.currentDateString} 非法時間`, {type:'error'})
              this.currentDateString = this.lastDateString || new Date().toLocaleDateString()
              return
            }

            if(this.isDateExceedStart(date)){
              this.$emit("error","輸入時間不能比開始時間早")
              this.useErrAlertDialog && this.$alert("輸入時間不能比開始時間早", {type:'error'})
              return
            }

            if(this.isDateExceedEnd(date)){
              this.$emit("error","輸入時間不能比結束時間晚")
              this.useErrAlertDialog && this.$alert("輸入時間不能比結束時間晚", {type:'error'})
              return
            }

            // console.log("Emit parent => ",date)
            this.$emit("input",date)

            //! 重要操作 影響結果計算 - 民國時間字串保存到成員
            this.currentDateString = `${date.getFullYear()-1911}/${date.getMonth()+1}/${date.getDate()}`

            //- 保留上一次格式正確的時間
            this.lastDateString = this.currentDateString

        },
        _addCalendarMonth(deltaM){

          let y = this.year
          let m = this.month + deltaM

          if( m > 12 ){
            y += 1
            m = 1
          }
          if( m <= 0 ){
            y -= 1
            m = 12
          }

          this.handleFinalDate(`${y}/${m}/${this.date}`)
        },
        _addCalendarYear(deltaY){
          this.handleFinalDate(`${this.year + deltaY}/${this.month}/${this.date}`)
        },
    },
    //- 若傳入值有改變時再調用 handleFinalDate()，否則會無法手動輸入
    watch:{
      value:{
        handler(newValue){
          newValue && this.handleFinalDate(newValue)
        },
        immediate:true
      }
    }
}

</script>
