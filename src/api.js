import { fetchData } from "./apiUtil"

// 案件列表 / 公告資訊
const GetAllTypeAnnouncementList = async() => {
    let res = await fetchData("/HccgApi/api/Announcement/GetAllTypeAnnouncementList", {
        headers: {
            "content-type": "application/json"
        }
    })
    res.forEach(i => {
        i.type = i.type.replace(/^都計$/g, "都市計畫")
        i.type = i.type.replace(/^都更$/g, "都市更新")
        i.type = i.type.replace(/^樁位$/g, "樁位資訊")
    })
    return res
}

// 案件列表 / 都市設計_委員會_委員名冊
const GetCommitteeMember = ({ PaginationSize = '' }) => fetchData("/HcUrbanDesign/api/data/GetCommitteeMember", {
    headers: {
        "content-type": "application/json"
    },
    body: { Page: 1, PaginationSize }
})

// 案件列表 / 都市設計_委員會_會議紀錄
const GetCommitteeMeetingMinutesList = ({ PaginationSize = '' }) => fetchData("/HcUrbanDesign/api/data/GetCommitteeMeetingMinutesList", {
    headers: {
        "content-type": "application/json"
    },
    body: { Page: 1, PaginationSize }
})

// 案件列表 / 都市設計_幹事會
const GetCouncilMeetingMinutesList = ({ PaginationSize = '' }) => fetchData("/HcUrbanDesign/api/data/GetCouncilMeetingMinutesList", {
    headers: {
        "content-type": "application/json"
    },
    body: { Page: 1, PaginationSize }
})

// 案件列表 / 都市計畫_審議會
const GetCityPlanCouncilFiles = ({ type = 1 }) => fetchData("/HccgApi/api/UrbanPlan/GetCityPlanCouncilFiles", {
    headers: {
        "content-type": "application/json"
    },
    body: { type }
})

/**
 * @param {都更及爭議處理審議會|更新地區推動小組|住宅諮詢及審議委員會} className
 * @param {議程與會議紀錄|委員名冊|設置依據} type
 */
const GetCouncilFiles = async({ className, type }) => {
    return fetchData("/HcUrbanApi/api/UrbanRenew/GetCouncilData", {
        headers: {
            "content-type": "application/json"
        },
        body: { type, className }
    })
}

// 儀錶板 / 都市計畫指標
const GetUrbanPlanCountList = () => fetchData("/HccgApi/api/DashBoard/GetUrbanPlanCountList", {
    headers: {
        "content-type": "application/json"
    }
})

// 儀錶板 / 建築管理指標
const GetBdLicYearCountList = () => fetchData("/HccgApi/api/DashBoard/GetBdLicYearCountList", {
    headers: {
        "content-type": "application/json"
    }
})

// 儀錶板 / 使用分區、圖資案件申請數
const GetApplicationCaseCountList = () => fetchData("/HccgApi/api/DashBoard/GetApplicationCaseCountList", {
    headers: {
        "content-type": "application/json"
    }
})

// 儀錶板 / 各年度使用分區、圖資案件申請數
const GetApplicationCaseYearCountList = async() => fetchData("/HccgApi/api/DashBoard/GetApplicationCaseYearCountList", {
    headers: {
        "content-type": "application/json"
    }
})

// 搜尋 / 取段清單
const GetSectList = () => fetchData("/HccgApi/api/MapLocation/GetSectList", {
    headers: {
        "content-type": "application/json"
    }
})

// 搜尋 / 取分區
const GetLanduseInfoByLandNo = ({ SectNo, LandNo }) => fetchData("/HccgApi/api/Landuse/GetLanduseInfoByLandNo", {
    headers: {
        "content-type": "application/json"
    },
    body: { SectNo, LandNo }
})

// 搜尋 / 取土管
const GetLandLawInfoByLandNo = ({ SectNo, LandNo }) => fetchData("/HccgApi/api/LandLaw/GetLandLawInfoByLandNo", {
    headers: {
        "content-type": "application/json"
    },
    body: { SectNo, LandNo }
})

// 登入驗證
const VerifyUserAccount = payload => fetchData("/HccgApi/api/Sso/VerifyUserAccount", {
    headers: {
        "content-type": "application/json"
    },
    body: payload
})


// 取都計案件
const GetUrbanCaseListByCriteria = ({ keyword, planType, caseType, cyearStart, cyearEnd }) => fetchData("/HccgApi/api/UrbanPlan/GetUrbanCaseListByCriteria", {
    headers: {
        "content-type": "application/json"
    },
    body: {
        keyword: keyword || "",
        type1: caseType || "",
        type2: planType || "",
        year1: cyearStart || 0,
        year2: cyearEnd || 0
    }
})
// 搜尋 / 取土管
const portalGetLandInfoByLandNo = ({ SectNo, LandNo }) => fetchData("/HccgApi/api/LandLaw/portalGetLandInfoByLandNo", {
    headers: {
        "content-type": "application/json"
    },
    body: { SectNo, LandNo }
})

export default {
    GetAllTypeAnnouncementList,
    GetApplicationCaseCountList,
    GetApplicationCaseYearCountList,
    GetBdLicYearCountList,
    GetUrbanPlanCountList,

    VerifyUserAccount,

    GetSectList,
    GetLanduseInfoByLandNo,
    GetLandLawInfoByLandNo,
    GetUrbanCaseListByCriteria,
    GetCityPlanCouncilFiles,
    GetCommitteeMember,
    GetCommitteeMeetingMinutesList,
    GetCouncilMeetingMinutesList,
    GetCouncilFiles,
    portalGetLandInfoByLandNo
}