<template lang="pug">
  swiper.image-gallery(:options="swiperOption")
      swiper-slide(
        v-for='item,index in data'
        :key="`${index}`"
      )
        .image-gallery__item(:style="{backgroundImage: 'url(' + item.src + ')'}")
          .image-gallery__text
            span(v-if='item.showtext') {{ item.text }}
            small(v-if='item.caption')
              small {{item.caption}}

      .swiper-button-prev.swiper-button-white(slot='button-prev')
      .swiper-button-next.swiper-button-white(slot='button-next')

</template>

<style lang="scss" scoped>

    // swiper slider
    .swiper-slide {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 3rem;
        font-weight: bold;
        position: relative;
    }
    .swiper-button-prev,.swiper-button-next{
      background-size: 1.5rem 1.5rem;
      background-color:transparent;
      top: 25%;
      // @media screen and (max-width:1300px){
      //   display: none;
      // }
    }


    .image-gallery{
      position: relative;
      &__item{
        position: absolute;
        top: 0;
        left: 0;
        background-position: center;
        background-size: cover;
        height: 100%;
        width: 100%;
        &:before{
          content: '';
          background-color: rgba(0,0,0,0.2);
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }
      }
      &__text{
        color: #fff;
        z-index: 9;
        display: flex;
        align-items: flex-end;
        align-content: center;
        justify-content: center;
        flex-wrap:wrap;
        position: absolute;
        left: 0;
        right: 0;
        top: 100px;
        bottom: auto;
        text-shadow: 3px 3px 6px rgba(black,0.5), 0 0 rgba(black,0.5), 0 0 rgba(black,0.5), 0 0 rgba(black,0.5);
        @media screen and (max-width: 768px){
            font-size: 2rem;
        }
      }
    }

</style>

<script>
export default {
    name: 'imageGallery',
    data:()=>({
    }),
    props:{
      data:{
        type: Array
      },
      swiperOption:{
        type:Object,
        default:()=>({
          // autoHeight: true, //enable auto height
          pagination: {
            el: '.swiper-pagination',
            clickable: true
          },
          autoplay:true,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }
        })
      },
      height:{
        type:Number,
        default:380
      }
    },
    mounted(){

      this.$el.style.height = this.height + "px"

      //- 重新計算高度
      this.calcHeight()
      window.addEventListener("resize",this.calcHeight)

    },
    methods:{
      calcHeight(){
        this.$el.style.height = this.height + this.$parent.$refs.sectionSearch.$el.clientHeight + "px"
      }
    }
}
</script>
