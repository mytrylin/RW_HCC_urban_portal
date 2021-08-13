<template lang="pug">
    swiper.video-gallery(:options="swiperOption")
        swiper-slide(
            v-for='item,index in data'
            :key="`${index}`"
        )
          video.video-gallery__item(
            controls
            autoplay
            muted
            loop
          )
            source(
              :src='item.src'
              type="video/mp4"
            )

          span.video-gallery__text(v-if='item.showtext') {{ item.text }}

        .swiper-pagination.swiper-pagination-white(slot='pagination')
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
      top: 50%;
      bottom: auto;
      margin-top: 0px;
      width: 1rem;
      background-color: rgba(51, 51, 51, 0.5);
      height: 1rem;
      border-radius: 100%;
      padding: 1rem;
      margin: 0 0.5rem;
      @media screen and (max-width:768px){
        display: none;
      }
    }

    /deep/ {
      .swiper-pagination{
        bottom: 0 !important;
        background: rgba(0,0,0,0.5);
        .swiper-pagination-bullet{
          background: rgba($white,0.7);
        }
        .swiper-pagination-bullet-active{
          background: rgba($white,1);
        }
      }
    }


    .video-gallery{
      max-width: 800px;
      height: auto;
      background-color: $black;
      &__text{
        font-size: 1.2rem;
        position: absolute;
        background-color: rgba(0,0,0,0.5);
        top:0;
        left: 0;
        right: 0;
        padding: 1rem;
        text-align: center;
        color: $white;
        @media screen and (max-width: 768px){
          font-size: 1rem;
          padding: 0.8rem;
        }
      }
      &__item{
        width: 100%;
      }
    }

</style>

<script>
export default {
    name: 'vidoeGallery',
    data:()=>({
    }),
    props:{
      data:{
        type: Array
      },
      swiperOption:{
        type:Object,
        default:()=>({
          pagination: {
            el: '.swiper-pagination',
            clickable: true
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }
        })
      }
    },
}
</script>
