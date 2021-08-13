
<template lang="pug">
.search(v-loading="loading")
    h2(style="margin-top: 0") 使用分區速查
    .search__input
        //- 選擇地段
        el-select(
            v-model="sect.value",
            placeholder="請選擇地段",
            filterable,
            @change="landno = ''"
        )
            el-option(
                v-for="item in sectOptions",
                :key="item.value",
                :label="item.label",
                :value="item.value"
            )

        //- 輸入地號
        el-input(
            clearable,
            type="text",
            v-model.trim="landno",
            placeholder="請輸入地號(多筆使用逗號分隔)",
            :disabled="!sect.value",
            @keydown.native="$event.keyCode === 13 && sect.value && landno && searchResult()"
        )

        //- 搜尋按鈕
        el-button(
            type="primary",
            plain,
            @click="searchResult",
            :disabled="!(sect.value && landno)"
        )
            font-awesome-icon(
                icon="search",
                fixed-width,
                size="lg",
                transform="left-2"
            )
            span 搜尋

        //- 地圖按鈕
        el-button(
            type="primary",
            :title="mapButtonMsg + '進入地圖'",
            @click="openMap"
        )
            font-awesome-icon(
                icon="globe-asia",
                fixed-width,
                size="lg",
                transform="left-2"
            )
            span(v-if="isLogin || queryString") {{ mapButtonMsg }}
            span 進入地圖

    //- 搜尋結果
    transition(name="fade")
        .search__result(
            ref="result",
            v-if="resultErrMsg || tableData.length > 0"
        )
            el-alert(
                v-if="resultErrMsg",
                :closable="false",
                :show-icon="false"
            )
                strong(slot="title") {{ resultErrMsg }}

            template(v-for="sect in tableData")
                .sect_result
                    .sect_title
                        span {{ nowSect }}-{{ sect.landNo }}
                    .sect_info
                        template(v-for="n in sect.plan")
                            el-tag(style="margin-right: 1rem", size="small") {{ n.date }}
                            span {{ n.name }}
                            <br/>
                        template(v-for="n in sect.landuse")
                            .search__result__tags
                                el-tag {{ n.name }}
                    .error_info(v-if="sect.code != '0000'")
                        span(style="color: red") {{ sect.message }}
</template>

<style scoped lang='scss'>
/deep/ {
    .el-input__inner,
    .el-button {
        border-radius: 0;
    }

    .el-input__inner,
    .el-select > .el-input.el-input--suffix {
        height: 100% !important;
        line-height: 100% !important;
    }

    .el-input__inner,
    .el-button {
        border-color: $primary;
        &:focus {
            box-shadow: 0 0 0.5rem 0.3rem rgba($primary, 0.4);
        }
    }
}
.search {
    flex: 1 0 70%;
    padding: 1.5rem;
    color: $primary;
    border-top: 0.5rem solid $primary;
    background-color: rgba(256, 256, 256, 0.65);
    border-radius: 3px;
    z-index: 2;
    box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14),
        0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.2);

    &__input {
        display: flex;
        align-items: stretch;
        flex-wrap: wrap;
        & > * {
            margin: 1rem 0 !important;
            width: auto;
            min-height: 3rem;
            flex: 1 1 auto;
        }
    }

    &__result {
        padding: 1rem;
        margin-top: 1rem;
        border-radius: 5px;
        background-color: rgba(256, 256, 256, 1);
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        text-align: left;
        justify-content: space-between;
        & > * {
            line-height: 200%;
        }
        &:nth-of-type(1) {
            flex: 1 1 100%;
        }
        &:nth-of-type(2) {
            flex: 1 0 300px;
        }
        &:nth-of-type(3) {
            flex: 1 0 200px;
        }
        &__tags {
            font-weight: bolder;
            & > * {
                margin: 0.5rem 0.5rem 0 0;
            }
        }
    }

    .xs__head {
        display: none;
    }

    .sect_result{
        width: 100%;
    }

    .sect_title {
        font-size: larger;
        font-weight: bold;
    }
    .sect_info {
        padding-left: 2rem;
    }


    @media screen and (max-width: 768px) {
        /deep/ {
            .el-table__header-wrapper {
                display: none;
            }
            table,
            tbody {
                display: block !important;
                width: 100% !important;
            }
            .el-table__row {
                display: flex;
                flex-direction: column;
            }
            .xs {
                display: flex;
                justify-content: space-between;

                &__head {
                    display: block;
                    flex: 1 0 100px;
                }
            }
        }
    }
}
</style>

<script>
import api from "@/api"

export default {
    name: 'search',
    components: {
    },
    props: {
        isLogin: {
            type: Boolean,
            default: false
        }
    },
    data: () => ({
        loading: false,
        tabledata: [],
        tableData: [],
        resultErrMsg: '',
        landno: '',
        sect: {
            options: [], // [...{label,value}]
            value: ''
        },
        nowSect: ""
    }),
    async mounted() {
        await this.getSectList()
    },
    computed: {
        mapURL() {
            let dev = "https://demo.chuanhwa.com.tw/HcLanduseMapArc4"
            let prod = "https://urbangis.hccg.gov.tw/HcUrbanMapArc4"
            return (/localhost|demo/ig.test(window.location.host)) ? dev : prod
        },

        /** 計畫名稱列表 */
        planResult() {
            let result = this.tabledata.map(({ title }) => title).filter(i => i.some(_i => _i !== null))
            return result
        },
        /** 分區列表 */
        luseBlockResult() {
            let result = this.tabledata.map(({ items }) => items.map(b => b.LUSE_DES2))
            result = [].concat(...result.filter(t => t))
            result = result.map(i => ({
                label: result.length > 1 ? `部分${i}` : i,
                type: /非都/.test(i) ? 'warning' : 'primary'
            }))
            //console.log(result)
            return result
        },
        queryString() {
            if (this.tableData.length > 0) {
                const landnoArrayT = this.tableData.filter(obj => obj.code == '0000').map(obj => obj.landNo)
                const lnadNoString = landnoArrayT.join(',')
                return new URLSearchParams({
                    sect: this.sect.value,
                    sectName: this.nowSect,
                    landno: lnadNoString,
                })
            } else {
                return null
            }
        },

        mapButtonMsg() {
            if (this.queryString) {
                return this.isLogin ? " ( 依分區搜尋結果及身份 ) " : " ( 依分區搜尋結果 ) "
            } else {
                return this.isLogin ? " ( 依登入身分 ) " : ""
            }
        },
        sectOptions() {
            return this.sect.options
        }
    },
    methods: {
        openMap() {
            gtag(
                'event',
                '進入地圖', {
                'event_category': '入口網進入地圖',
                'event_label': '新竹都市發展資訊整合平台'
            });

            let path = ''
            if (this.queryString) {
                path = this.isLogin ? `${this.mapURL}/?userInfo=${this.userInfo}&${this.queryString}` : `${this.mapURL}/?${this.queryString}`
            }
            else {
                path = this.isLogin ? `${this.mapURL}/?userInfo=${this.userInfo}` : this.mapURL
            }
            if (!path) {
                this.$alert("發生錯誤", { type: 'warning' })
                return
            }
            window.open(path, "_self")
        },
        async getSectList() {
            // 取地段清單
            try {
                this.loading = !this.loading
                this.sect.options = (await api.GetSectList()).map(el => ({ label: el.SECTNAME, value: el.CODE }))
            } catch (e) {
                this.$alert(e, { type: "error" })
            } finally {
                this.loading = !this.loading
            }
        },
        getSectName() {
            return this.sect.options.find(el => el.value === this.sect.value).label
        },
        async searchResult() {

            this.loading = !this.loading
            this.nowSect = this.getSectName();
            // 初始化
            this.resultErrMsg = ''
            this.tabledata.length = 0
            this.tableData.length = 0

            const landnoArray = this.landno.split(',')
            const landnoArrayT = landnoArray.map(x => this.GetLandNoLen8FromSimple(x))
            const lnadNoString = landnoArrayT.join(',')
            try {
                this.tableData = await api.portalGetLandInfoByLandNo({
                    SectNo: this.sect.value,
                    LandNo: lnadNoString
                });

            } finally {
                this.loading = false
                this.$nextTick(() => this.$emit("result", this.$refs.result))
                this.tableData = this.tableData.sort(function (a, b) {
                    return a.landNo > b.landNo;
                });
                const landnoArrayT = this.tableData.filter(obj => obj.code == '0000').map(obj => obj.landNo)
                const lnadNoString = landnoArrayT.join(',')
                console.log(lnadNoString);
            }
            /*
            landnoArrayT.forEach(async t_landno => {

                try {
                    //const t_landno = this.GetLandNoLen8FromSimple(this.landno)

                    // 取得對應的 土管、分區資訊
                    const landuse_res = await api.GetLanduseInfoByLandNo({
                        SectNo: this.sect.value,
                        LandNo: t_landno
                    })

                    const landlaw_res = await api.GetLandLawInfoByLandNo({
                        SectNo: this.sect.value,
                        LandNo: t_landno
                    })

                    // 若都有成功回傳可進行比對
                    if (Array.isArray(landlaw_res) || typeof landlaw_res === 'object' && Array.isArray(landuse_res) || typeof landuse_res === 'object') {

                        let planList = []
                        let landuseList = []

                        let landuses = landuse_res.map(({
                            core_plan_name,
                            law_date,
                            LUSE_DES2,
                            BLOCK_CODE,
                            USED_PLN,
                            PLN_CODE_FOR_MUSE,
                            USED_LUSE,
                        }) => ({
                            core_plan_name,
                            law_date,
                            LUSE_DES2,
                            BLOCK_CODE,
                            USED_PLN,
                            PLN_CODE_FOR_MUSE,
                            USED_LUSE
                        }))

                        landuses.forEach(landuse => {
                            let item = {
                                LUSE_DES2: landuse.LUSE_DES2,
                                BLOCK_CODE: landuse.BLOCK_CODE,
                                RATE_A: "",
                                RATE_B: ""
                            }
                            
                            // 對應 landuse 的 landlaw ， 填入 RATE_A 、 RATE_B
                            landlaws.forEach(landlaw => {
                                if (landlaw.PLN_CODE_FOR_MUSE + landlaw.USED_LUSE === landuse.PLN_CODE_FOR_MUSE + landuse.USED_LUSE) {
                                    item.RATE_A = landlaw.RATE_A
                                    item.RATE_B = landlaw.RATE_B
                                }
                            })
                            //- 檢查是否已存在分組(比對主計畫名)，若有則將當前的項目放到已存在的分組;否則新建分組放入
                            if (!planList.find(_exsist => _exsist.title === landuse.core_plan_name)) {
                                planList.push({
                                    title: landuse.core_plan_name,
                                    date: landuse.law_date
                                })
                            }
                            if (!landuseList.find(_exsist => _exsist.title === item.LUSE_DES2)) {
                                landuseList.push({
                                    title: item.LUSE_DES2
                                })
                            }
                        })
                        this.tableData.push({
                            sectName: this.getSectName,
                            landNo: t_landno,
                            plan: planList,
                            landuse: landuseList
                        })
                    } else {
                        this.resultErrMsg += `地號 ${t_landno} 查詢錯誤：${landlaw_res || landuse_res}`
                    }

                } catch (e) {
                    this.$alert(`地號 ${t_landno} 查詢錯誤：${e}`, { type: "error" })
                } finally {
                    this.loading = false
                    this.$nextTick(() => this.$emit("result", this.$refs.result))
                    this.tableData = this.tableData.sort(function (a, b) {
                        return a.landNo > b.landNo;
                    });
                    console.log(this.tableData);
                }
            });*/
        },
        //-
        GetLandNoLen8FromSimple(landNo) {
            let result = "";
            if (landNo.indexOf("-") !== -1) {
                result = this.GetPadLeft(landNo.split('-')[0], 4) + this.GetPadLeft(landNo.split('-')[1], 4);
            } else {
                if (landNo.length < 5) {
                    result = this.GetPadRight(this.GetPadLeft(landNo, 4), 8);
                } else if (landNo.length === 8) {
                    result = landNo;
                } else {
                    result = landNo.substring(0, 4) + this.GetPadLeft(landNo.substring(4, landNo.length - 4), 4);
                }
            }
            return result;
        },
        GetPadLeft(str, length, paddingChar) {
            paddingChar = paddingChar || "0";
            if (str.toString().length >= length) {
                return str;
            } else {
                return this.GetPadLeft(paddingChar + str, length);
            }
        },
        GetPadRight(str, length, paddingChar) {
            paddingChar = paddingChar || "0";
            if (str.toString().length >= length) {
                return str;
            } else {
                return this.GetPadRight(str + paddingChar, length);
            }
        }
    }
}
</script>
