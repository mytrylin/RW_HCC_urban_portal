//- token 管理
let token_get_cnt = 0
const token = {
    GetToken: async() => {
        try {
            console.log(`%c The times is ${token_get_cnt+1} of requesting Token`, "background:red;color:#fff", 'background:red;color:#fff')

            const stream = await fetch("/HcLanduseMapApi/api/Token/GetToken", {
                method: "post",
                headers: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            })
            const result = await stream.json()

            if (result && result.resultCode === "0000") {
                localStorage.setItem("token", result.DATA.token)
            } else {
                throw (result.resultCode || result)
            }

        } catch (e) {
            console.error("Token取得失敗" + e)
        } finally {
            token_get_cnt += 1
        }
    },
    // GetTokenWithErrRes: async(fn, msg) =>
}

//- 預設請求封裝
export const fetchData = async(url = "", option = {}) => {

    // 內部指標，為保留原參數遞迴
    let _body = option.body || {}
    let _method = option.method || "post"
    let _headers = option.headers || {}

    // 如果 localstorage 沒有 TOKEN 則進行取得
    if (!localStorage.getItem("token")) await token.GetToken()

    let rawPayload = {..._body, ... { Token: localStorage.getItem("token") } } // 未編碼前酬載，加入token
    let payload = null // 編碼後酬載
    let cType = _headers["content-type"] // 內容類型聲明，鍵名一律小寫

    // 依表頭進行編碼處理 預設 application/json
    if (/application\/x\-www\-form\-urlencoded/ig.test(cType)) {
        payload = new URLSearchParams(rawPayload)
    } else if (/application\/json/ig.test(cType)) {
        payload = JSON.stringify(rawPayload)
    } else {
        _headers["content-type"] = "application/json"
        payload = JSON.stringify(rawPayload)
    }

    const stream = await fetch(url, {
        ...option,
        ... {
            body: payload,
            headers: _headers,
            method: _method,
        }
    })
    const res = await stream.json()

    if ('resultCode' in res && 'DATA' in res && 'resultMsg' in res) { //- 預期格式
        switch (res.resultCode) {
            case "0000":
                token_get_cnt = 0 // 成功請求歸零 token 請求計數

                // 回應格式含 File
                if ('File' in res) {
                    return { data: res.DATA, file: res.File || [] }
                }
                // 無資料處理
                if (!res.DATA ||
                    (Array.isArray(res.DATA) && !res.DATA.length) ||
                    (typeof res.DATA === 'object' && !Object.keys(res.DATA).length)
                ) {
                    throw ("無資料")
                } else {
                    return res.DATA
                }
            case "0001":
                token_get_cnt = 0 // 成功請求歸零 token 請求計數
                throw ("無資料")
            case "9999":
                //- 嘗試 刷新TOKEN 遞迴重取，若仍無法取的資料會擲出例外強制重整
                if (token_get_cnt >= 5) {
                    if (localStorage.getItem("userId") !== "urbanMap") {
                        alert("已逾時或沒有權限")
                        window.location.replace(window.location.origin + window.location.pathname)
                    }
                    token_get_cnt = 0
                    throw "沒有權限或參數錯誤"
                }
                await token.GetToken()
                return fetchData(url, option)
            default:
                throw (res.resultMsg)
        }
    } else {
        //- 所有回傳的非預期格式 皆嘗試刷新TOKEN 遞迴重取
        //- 因為其中可能包含了 token 失效或其他錯誤 ，
        //- 若重新取權限 5 次 仍無法取的資料 擲出例外強制重整
        if (token_get_cnt >= 5) {
            if (localStorage.getItem("userId") !== "urbanMap") {
                alert("已逾時或沒有權限")
                window.location.replace(window.location.origin + window.location.pathname)
            }
            token_get_cnt = 0
            throw "沒有權限或參數錯誤"
        }
        await token.GetToken()
        return fetchData(url, option)
    }
}

//- 轉半形
export let toSBC = str => {
    let result = ""
    let cnt = 0
    while (cnt < str.length) {
        let cCode = str.charCodeAt(cnt)

        //全形與半形相差（除空格外）：65248（十進位制）
        cCode = (cCode >= 0xFF01 && cCode <= 0xFF5E) ? (cCode - 65248) : cCode

        //處理空格
        cCode = (cCode == 0x03000) ? 0x0020 : cCode
        result += String.fromCharCode(cCode)
        cnt++
    }
    return result
}

//- 會員
export const account = {
    //- /api/Acc/GetAccount
    GetAccount: async token => {
        try {
            let result = await (await fetch("/HcAccountApi/api/Acc/GetAccount?token=" + token, {
                method: "post"
            })).json()
            return result.DATA.userId
        } catch (e) {
            throw e
        }
    },
    //- /api/Acc/GetAccountDetail
    GetAccountDetail: async account => {
        try {
            let result = await (await fetch("/HcAccountApi/api/Acc/GetAccountDetail?account=" + account, {
                method: "post",
            })).json()
            return result.DATA
        } catch (e) {
            throw e
        }
    }
}

//- 都更請求封裝
export const fetchUrbanRenewalData = async(url, param = {}) => {

    let res = await fetchData(url, param)

    //- file 分配到對應 sid 、 UID 屬性
    if (res.file.length) {
        res.data.forEach(el => {
            if ('sid' in res.file[0] && 'UID' in el) { // API response TYPE 1
                el.file = res.file.filter(f => f.sid === el.sid && el.UID)
                if (el.file.length) {
                    el.file = el.file.map(f => f.files)
                }
            } else if ('id' in res.file[0] && 'id' in res.file[0]) { // API response TYPE 2
                el.file = res.file.filter(f => f.id === el.id)
            }
        })
    }
    return res.data
}
