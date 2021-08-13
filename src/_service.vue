<template lang="pug">
.service
  template(v-for="val in itemsModel")
    //- h2 {{ val.title }}
    .service__row
      a.service__item(
        v-for="val2 in val.item"
        :href='val2.url'
        :title="val2.name+'(另開新視窗)'"
        target="_blank"
      )
        .service__item__head
          big
            font-awesome-icon.service__item__head__icon(:icon='val2.icon' fixed-width size="lg" style="margin-right:1rem;")
            strong
              | {{ val2.name }}

        .service__item__description(v-if='val2.description')
          p {{ val2.description }}
          //- small (另開新視窗)
</template>

<style lang="scss" scoped>
.service{
  display: flex;
  flex-direction: column;
}

.service__row{
  margin:1rem 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.service__item{
  margin:0.5rem;
  display: flex;
  border-radius: 0.5rem;
  flex-direction: column;
  align-items: space-between;
  justify-content: flex-start;
  transition: all 0.3s ease;
  text-align: left;
  flex: 1;
  &__head{
    padding: 1rem;
    font-weight: bold;
    max-width: 250px;
    color:$white;
    big{
      display: block;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
  &__description{
    padding: 1rem;
    flex-grow: 1;
    color:$white;
  }
  &:hover{
    box-shadow: $boxShadow;
    transform: translate3d(-2px,-2px,0);
  }
  //--- color
  &:nth-of-type(1) {
    background-color: $blueAux1;
    svg{
      color: darken($blueAux1,10);
    }
    .service__item__description{
      background-color: lighten($blueAux1,10);
    }
  }
  &:nth-of-type(2) {
      background-color: $blueAux2;
      svg{
        color: darken($blueAux2,10);
      }
      .service__item__description{
        background-color: lighten($blueAux2,10);
      }
  }
  &:nth-of-type(3) {
      background-color: $blueAux3;
      svg{
        color: darken($blueAux3,10);
      }
      .service__item__description{
        background-color: lighten($blueAux3,10);
      }
  }
  &:nth-of-type(4) {
      background-color: $blueAux4;
      svg{
        color: darken($blueAux4,10);
      }
      .service__item__description{
        background-color: lighten($blueAux4,10);
      }
  }
  &:nth-of-type(5) {
      background-color: $blueAux5;
      svg{
        color: darken($blueAux5,10);
      }
      .service__item__description{
        background-color: lighten($blueAux5,10);
      }
  }
}

</style>

<script>
export default {
    name: 'service',
    components:{
    },
    computed:{
      isAndroid(){
        const u = navigator.userAgent
        return u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
      },
      isIOS(){
        return !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
      },
      itemsModel(){
        const ptr = this.items.find(i=> i.title === "申領服務")
        const landuse = ptr.item.find(i=>i.name === "土地使用分區證明")
        const tpg = ptr.item.find(i=>i.name === "地形圖資及都市計畫圖資申領")
        const ANDROID_URL = "https://play.google.com/store/apps/details?id=chuanhwa.hccg.urbanplan&hl=zh_TW"
        const IOS_URL = "https://apps.apple.com/tw/app/%E6%96%B0%E7%AB%B9%E5%B8%82%E9%83%BD%E5%B8%82%E8%A8%88%E7%95%ABe%E7%B6%B2%E9%80%9A/id1060981549"

        if(this.isAndroid){
          landuse.url = ANDROID_URL
          tpg.url = ANDROID_URL
        }

        if(this.isIOS) {
          landuse.url = IOS_URL
          tpg.url = IOS_URL
        }

        return this.items
      }
    },
    data:()=>({
      items:[
          {
              title:'申領服務',
              item:[
                  {
                      icon:'map-signs',
                      name:'土地使用分區證明',
                      url:'http://landuse.hccg.gov.tw/LandusePortal/page_landuse_main.html',
                      description:"提供都市計畫使用分區證明書之線上申請、案件查詢及下載、證明書線上驗證等服務。"
                  },
                  {
                      icon:'city',
                      name:'地形圖資及都市計畫圖資申領',
                      url:'https://demo.chuanhwa.com.tw/HcLanduseMapArc4/?aside=topo',
                      description:"提供新竹市都市計畫數值圖檔線上申請、進度查詢及圖檔下載等服務。"
                  },
                  {
                      icon:'certificate',
                      name:'都市設計及土地開發許可審議案件',
                      url:'https://uddc.hccg.gov.tw/urbandesign/',
                      description:"提供都市設計及土地使用開發許可審議作業服務，服務對象包含有：申請人/設計師、審議委員、市府承辦員。"
                  },
                  {
                      icon:'download',
                      name:'申請書下載',
                      url:'https://urban.hccg.gov.tw/ch/home.jsp?id=20050&parentpath=0,19',
                      description:"提供相關申請表格、表單文件檔案"
                  }
              ]
          }
      ]
    })
}
</script>
