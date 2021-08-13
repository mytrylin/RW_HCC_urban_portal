# RW_HCC_urban_portal
hcurbanportal_新竹都發整整合平台入口

### 安裝依賴
``` bash
npm install
```
### serve with hot reload at localhost:8080
``` bash
npm run dev
```

### build for production with minification
``` bash
npm run build
```

### 部署到 packages.json 內 config 設定的位置
``` bash
npm run deploy
```

#### 測試 dummy data
``` bash
node api
npm i -g nodemon
nodemon mock_api.js
```

#### REMARK
- [ ] pwa assets / icon  generater add ( deploying path of `manifest.json` must be root `./`)
- [ ] migrate to Vue CLI 4
- [ ] pretty UI of `_new.vue`
