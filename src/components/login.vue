<template lang="pug">
el-dialog(
  title="公務登入"
  :visible="value"
  width="80%"
  center
  lock-scroll
  append-to-body
  modal-append-to-body
  :close-on-click-modal="false"
  :show-close="false"
  style="max-width:600px;margin:0 auto;"
)
  el-form.demo-ruleForm(
    :model='ruleForm'
    :rules='rules'
    ref='ruleForm'
    label-width='100px'
    label-position="left"
    status-icon=true
    v-loading='loading'
  )
    el-form-item(label='登入方式')
      el-radio-group(v-model='ruleForm.Type' size="medium")
        el-radio-button(label='公務帳號登入')
        el-radio-button(label='府外會員登入' disabled=true)

    el-form-item(label="會員帳號" prop='Account')
      el-input(type='text' v-model='ruleForm.Account')

    el-form-item(label='會員密碼' prop='Pass')
      el-input(type='password' v-model='ruleForm.Pass' @keydown.native="$event.keyCode==13 && !loading && submitForm('ruleForm')")

  span.dialog-footer(slot='footer')
    el-button(type='primary' @click="submitForm('ruleForm')" :disabled='loading') 登入
    el-button(@click="$emit('input',false) && $refs['ruleForm'].resetFields()" :disabled='loading') 取消

</template>

<script>

import api from "@/api"

export default {
  name:"login",
  data(){
    var validateAccount = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("請輸入帳號"))
      } else {
        callback();
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("請輸入密碼"))
      } else {
        callback()
      }
    }
    return {
      loading:false,
      ruleForm: {
        Type: "公務帳號登入",
        Account: "",
        Pass: "",
      },
      rules: {
        Account: [{ validator: validateAccount, trigger: "blur" }],
        Pass: [{ validator: validatePass, trigger: "blur" }],
      },
    }
  },
  props:{
    value:{
      type:Boolean,
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.login()
        } else {
          return false;
        }
      })
    },
    async login(res){

      this.loading = !this.loading

      try {
        const res = await api.VerifyUserAccount({
          body:{
            "username": this.ruleForm.Account,
            "password": this.ruleForm.Pass
          }
        })

        this.$message.success(`登入成功，${res.username}您好`)

        localStorage.setItem("userid",res.userid)
        localStorage.setItem("username",res.username)

        this.$EventBus.$emit("storageChange")

        this.$refs['ruleForm'].resetFields()
        this.$emit('input',false)

        this.loading = !this.loading

      }catch(err){

        localStorage.clear("userid")
        localStorage.clear("username")

        this.loading = !this.loading
        this.$message.error(`登入失敗:${err}`)

      }

    }
  }
}
</script>
