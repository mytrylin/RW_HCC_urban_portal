
<style lang="scss" scoped>

	.header{
		position:absolute;
		top:0;
		right:0;
		left:0;
		width:100%;

		&__main{
			background-color: $white;
			box-shadow: $boxShadow;
			position: relative;
			z-index: 2;
			&__logo{
				flex: 0 1 280px;
				img {
					width: 90%;
				}
			}
			&__operator{
				align-items:center;
				display: flex;
				&__text{
					@media screen and (max-width: 768px){
						display: none;
					}
				}
				a,span {
					white-space: nowrap;
					padding: 0 0.5rem;
				}
			}
		}

		&__nav{
			position: relative;
			z-index: 1;
			&--fixed {
				position: fixed;
				top: 0;
				left: 0;
				right: 0;
				z-index: 999;
				box-shadow: $boxShadow;
			}
		}

		//-
		&__container{
			max-width: $maxWidth;
			padding: 1rem;
			margin: 0 auto;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

	}

	//-
	// .main{
	// 	margin-top: 380px;
	// 	top: 0;
	// 	position: relative;
	// 	z-index: 2;
	// }

</style>

<template lang="pug">
	#app

		//- login dialog
		login(v-model="loginVisibility")

		//- header
		.header(ref="header")
			.header__main
				.header__container
					.header__main__logo
						img(:src="require('@/assets/logo.png')" alt="新竹市都市發展處都市發展資訊整合平台")
					.header__main__operator
						//- 如果是已登入狀態
						template(v-if="account.username")
							span.header__main__operator__text {{`${account.username},您好`}}
							el-button(type="text" @click="logout" title="登出")
								font-awesome-icon(icon='sign-out-alt' size="1x" fixed-width transform="left-4")
								span 登出
						//- 非登入狀態
						template(v-else)
							el-button(type="text" @click="openLogin" title="公務登入")
								font-awesome-icon(icon='user' size="1x" fixed-width transform="left-4")
								span.header__main__operator__text 公務登入
						el-divider(direction="vertical")
						a(href="#footer" title="移至相關連結")
							font-awesome-icon(icon="link" fixed-width transform="left-4")
							span.header__main__operator__text 相關連結

			//- 導覽列
			nav.header__nav(:class="{'header__nav--fixed':scrollBeyondHeader}")
				swiper.spy-menu(
					ref="swiperSpyMenu"
					:options='menus.MenuSwiperOption'
					v-scroll-spy-active="{selector: '.swiper-slide', class: 'active'}"
					v-scroll-spy-link=""
				)
					swiper-slide(v-for='val,index in menus.items' :key='index')
						a.spy-menu__href(href='#') {{ val }}
					.swiper-shadow-prev(slot='button-prev')
					.swiper-shadow-next(slot='button-next')

		//- ImageGallery + blockSearch
		.fv(style="position:relative;")
			imageGallery(:data='imageGallery' ref="imageGallery" :height="300")
			sectionStyled(style="position:absolute;top:auto;bottom:20px" ref="sectionSearch")
				sectionSearch(
					@result="handleSearchResult"
					:isLogin="!!account.userid && !!account.username"
				)

		//- main content
		.spy-menu-wrapper(v-scroll-spy="{offset:200}")
			sectionStyled(title="資訊服務" icon="concierge-bell" )
				service
			sectionStyled(title="公告資訊" icon="newspaper")
				news
			sectionStyled(title="業務資訊專區" icon="briefcase")
				business
			sectionStyled(title="都市發展儀表板" icon="tachometer-alt" )
				dashboard
			sectionStyled(title="影片宣導" icon="film")
				videoGallery(:data='videoGallery')

		footer#footer
			a.footer-backTop(href="#app")
				font-awesome-icon(icon="chevron-up" fixed-width)

			.footer-links
				.footer-links__container
					.footer-links__head
						big
							font-awesome-icon(icon="link" fixed-width transform="left-4")
							span 相關連結
					.footer-links__body
						a(target="_blank" href="http://landuse.hccg.gov.tw/LandusePortal")
							//- font-awesome-icon(icon="city" fixed-width transform="left-2")
							span 都市計畫服務網
						a(target="_blank" href="https://urban.hccg.gov.tw/")
							//- font-awesome-icon(icon="city" fixed-width transform="left-2")
							span 都市發展處
						//- a(target="_blank" href="")
						//- 	//- font-awesome-icon(icon="map" fixed-width transform="left-2")
						//- 	span 圖資共享
						//- 	small (新視窗開啟)
						a(target="_blank" href="http://opendata.hccg.gov.tw/")
							//- font-awesome-icon(icon="database" fixed-width transform="left-2")
							span 資料開放平台
						a(target="_blank" :href="getFbLink()")
							//- font-awesome-icon(icon="link" fixed-width transform="left-2")
							span 新竹市FB粉絲

			.footer-copyright
				small ©{{new Date().getFullYear()}} 新竹市政府都市發展處

		//- .pattern 背景圖
		//-   img(:src='require("@/assets/pattern.png")')

</template>

<script>

import login from "@/components/login"
import sectionStyled from '@/components/sectionStyled'

import imageGallery from '@/components/imageGallery'
import videoGallery from '@/components/videoGallery'

import sectionSearch from "@/components/sectionSearch"
import service from './_service'
import dashboard from './_dashboard'
import news from './_news'
import business from './_business'

export default {
	name: 'App',
	components: {
		sectionStyled,
		videoGallery,
		imageGallery,
		service,
		dashboard,
		news,
		business,
		login,
		sectionSearch
	},
	data:()=>({
			scrollBeyondHeader:false,
			loginVisibility:false,
			account:{
				userid:'',
				username:''
			},
			imageGallery:[
				{
					showtext: true,
					src:require("../static/sliderDemo_1.jpg"),
					text:"新竹市步行城市",
					caption:"-用步行打造一座美好城市!"
				},
				{
					showtext: true,
					src:require("../static/sliderDemo_2.jpg"),
					text:"新竹市步行城市",
					caption:"-用步行打造一座美好城市!"
				},
				{
					showtext: true,
					src:require("../static/sliderDemo_3.jpg"),
					text:"新竹之翼 - 大車站計畫",
					caption:"-翻轉軸線，再造城市風華!"
				},
				{
					showtext: true,
					src:require("../static/sliderDemo_4.jpg"),
					text:"新竹之翼 - 大車站計畫",
					caption:"-翻轉軸線，再造城市風華!"
				}
			],
			videoGallery:[
				{
					showtext: false,
					src:require("../static/v4.mp4"),
					text:"新竹步行城市"
				},
				{
					showtext: false,
					src:require("../static/v1.mp4"),
					text:"新竹步行城市"
				},
				{
					showtext: false,
					src:require("../static/v2.mp4"),
					text:"拼接電視牆"
				},
				{
					showtext: false,
					src:require("../static/v3.mp4"),
					text:"新竹綠園道三分鐘版"
				}
			],
			menus:{
				MenuSwiperOption:{
					slidesPerView: '5',
					freeMode: true,
					navigation: {
						nextEl: '.swiper-shadow-next',
						prevEl: '.swiper-shadow-prev'
					},
					freeMode: true,
					// slidesOffsetBefore: 100,
					breakpoints: {
						1024: {
							slidesPerView: 4
						},
						768: {
							slidesPerView: 3
						},
						525:{
							slidesPerView: 2
						}
					}
				},
				items:[
					"資訊服務",
					"公告資訊",
					"業務資訊專區",
					"都市發展儀表板",
					"影片宣導",
				]
			}
	}),
	mounted(){

    // user 處理
    localStorage.setItem("userId", "urbanMap")
		this.account.username = localStorage.getItem('username')
		this.account.userid = localStorage.getItem('userid')
		this.$EventBus.$on("storageChange",e=>{
			this.account.username = localStorage.getItem('username')
			this.account.userid = localStorage.getItem('userid')
		})

		let header = document.querySelector(".header")
		let fv = document.querySelector(".fv")

		//- 設置 fv 的
		fv.style.marginTop = header.clientHeight + "px"

		const swiperSpyMenu = this.$refs.swiperSpyMenu

		window.addEventListener("scroll",evt=>{

			// 固定 top NAV
			this.scrollBeyondHeader = window.pageYOffset > this.$refs.header.clientHeight

			// 導航列自動滑動當前畫面 - 主要針對手機
			if(!swiperSpyMenu || !swiperSpyMenu.$el){return}

			/**
			 * For IE>=8 NodeList foreach hack
			 * @see https://stackoom.com/question/3XJWY/%E5%AF%B9%E8%B1%A1%E4%B8%8D%E6%94%AF%E6%8C%81%E5%B1%9E%E6%80%A7%E6%88%96%E6%96%B9%E6%B3%95-forEach-IE
			 */
			if (typeof NodeList.prototype.forEach !== 'function')  {
				NodeList.prototype.forEach = Array.prototype.forEach;
			}

			const slidesNodes = swiperSpyMenu.$el.querySelectorAll(".swiper-slide")
			slidesNodes.forEach((el,index) => {
				/active/.test(el.classList.value) && swiperSpyMenu.swiper.slideTo(index, 800, false)
			})

		})

	},
	methods:{
		getFbLink(){
			let agent = navigator.userAgent
			let link = ''
			if(/Android/i.test(agent)){ // IOS
				link = "fb://page/924427494268643"
			}else if(/iPhone|iPad/i.test(agent)){// Android
				link = "fb://page/?id=924427494268643"
			}else{ // pc format
				link = "https://facebook.com/924427494268643"
			}
			return link
		},
		logout(){
			localStorage.removeItem('username')
			localStorage.removeItem('userid')
			this.$EventBus.$emit("storageChange")
		},
		openLogin(){
			window.open("http://eip.hccg.gov.tw/")
			// if(!this.account.username) this.loginVisibility = true
		},
		handleSearchResult(){
			this.$refs.imageGallery.calcHeight()
		}
	}
}
</script>

<style lang="scss" scoped>

nav{
	background-color: $primary;
}

/** SWIPER */
.spy-menu{
	flex: 0 0 100%;
	background-color: $primary;
	position: relative;
	z-index: 0;
	max-width: $maxWidth;
	&>*{
		border:0;
	}
	&__href{
		display: block;
		text-align: center;
		padding: 0.8rem;
		color: $white;
		transition: 0.1s all ease;
		&:hover{
			background-color: darken($primary,20);
		}
	}
}

.swiper-slide.active a{
	color: $primary;
	background-color: $white;
	transition: 0.1s all ease;
}

.swiper-shadow-prev,.swiper-shadow-next{
	display: block;
	position: absolute;
	z-index: 999;
	width: 3rem;
	height: 100%;
	top: 0;
	bottom: 0;
	&.swiper-button-disabled{
		display: none;
	}
}
.swiper-shadow-prev{
	background: linear-gradient(-90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 100%);
	left: 0 !important;
}
.swiper-shadow-next{
	background: linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 100%);
	right: 0 !important;
}


/** PATTERN */
.pattern{
	pointer-events: none;
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 0;
	img{
		width: 100%;
		height: 100%;
	}
}

/** FOOTER */
footer{
	text-align: center;
	color: $white;
	background-color: darken($primary,20);
	z-index: 1;
	position: relative;
	margin-top: 5rem;
}
.footer-backTop{
	position: absolute;
	margin: 0 auto;
	background: darken($primary,20);
	left: 0;
	right: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 1.5rem;
	height: 0.5rem;
	border-radius: 10px;
	padding: 0.5rem;
	top: -0.5rem;
}
.footer-links{
	background-color:darken($primary,10);
	padding: 1rem;
	&__container{
		max-width: $maxWidth;
		margin: 1rem auto;
		display: flex;
		flex-wrap:wrap;
		align-items: center;
	}
	&__head{
		flex: 1 0 200px;
		text-align: center;
		margin:1rem;
	}
	&__body{
		display: flex;
		flex-wrap:wrap;
		flex: 1 1 auto;
		justify-content: space-around;
		&>*{
			color:rgba($white,0.8);
			margin:1rem;
			display: block;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
}
.footer-copyright{
	padding: 0.5rem 0;
}

</style>
