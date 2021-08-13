<template lang="pug">
    .items
        a.item(v-for='val in datas' :href='val.link' target="blank")
            h3  {{ val.title }}
            .img-wrapper-outer
                .img-wrapper(:style="{backgroundImage: 'url(' + val.bg + ')'}")
            .tag(:style="{backgroundColor:val.tagcolor}") {{ val.tag }}
</template>

<style lang="scss" scoped>

    $yellow2:#cc9966;
    $blue2:#66cccc;
    $yellow3:#ffcc66;

    .items{
        display: flex;
        flex-wrap: wrap;
        a.item{
            border-radius: 3px;
            color: #fff;
            padding: 1.5rem;
            margin: 1rem;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-height: 6rem;
        }
        .tag{
            color: #222;
            border-radius: 1rem;
            font-weight: bold;
            position: absolute;
            right: -0.5rem;
            bottom: -0.5rem;
            padding: 0.5rem;
        }
        h3{
            z-index: 1;
            transition: all .3s ease-out;
            white-space: pre;
            line-height: 150%;
        }
    }
    a.item{
        flex: 20%;
        @media screen and (max-width: 768px) {
            flex: 40%;
        }
        @media screen and (max-width: 425px) {
            flex: 100%;
        }
    }
    .img-wrapper-outer{
        overflow: hidden;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        .img-wrapper{
            height: 100%;
            width: 100%;
            transition: all .3s ease-in-out	;
            background-position: center center;
            background-size:cover;
            background-repeat:no-repeat;
            &:before{
                content: "";
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                right: 0;
                background-color: rgba(0,0,0,0.35);
                transition: all .3s ease-out;
            }
        }
    }
    a.item:hover{
        h3{
            transform: scale(1.15);
            transition: all .4s ease-in-out	;
        }
        .img-wrapper{
            transform: scale(1.1);
            transition: all .3s ease-in-out	;
            &:before{
                background-color: rgba(0,0,0,0);
                transition: all .3s ease-in;
            }
        }
    }
</style>

<script>

export default {
    name: 'business',
    components:{},
    data(){
        return{
            datas:[
                {
                    title:'公寓大廈諮詢',
                    tag:'使管',
                    tagcolor:'#cc9966',
                    link:'https://urban.hccg.gov.tw/ch/home.jsp?id=20105&parentpath=0,9,20101',
                    bg:'./static/b1.jpg'
                },
                {
                    title:'建築管理業務',
                    tag:'建管',
                    tagcolor:'#cddc39',
                    link:'https://urban.hccg.gov.tw/ch/home.jsp?id=20109&parentpath=0,9,20100',
                    bg:'./static/b5.jpg'
                },
                {
                    title:'都市設計及土地使用\n開發許可審議資訊',
                    tag:'都設',
                    tagcolor:'#ffcc66',
                    link:'https://uddc.hccg.gov.tw/HsinchuUrbanDesign',
                    bg:'./static/b3.jpg'
                },
                {
                    title:'無障礙專屬業務',
                    tag:'使管',
                    tagcolor:'#cc9966',
                    link:'https://urban.hccg.gov.tw/ch/home.jsp?id=20104&parentpath=0,9,20101',
                    bg:'./static/b4.jpg'
                },
                {
                    title:'都市更新資訊',
                    tag:'都更',
                    tagcolor:'#66cccc',
                    link:'https://urbangis.hccg.gov.tw/HcUrbanRenew/index.aspx',
                    bg:'./static/b2.jpg'
                },
                {
                    title:'新竹市國土計畫',
                    tag:'綜規',
                    tagcolor:'#f89d9d',
                    link:'http://114.33.28.253',
                    bg:'./static/b6.jpg'
                },
            ]
        }
    }
}
</script>
