<template>
  <div class="header"></div>
	<div  class="content">
    <div class="login-form">
      <bc-form v-bind="formConfig"> </bc-form>
      <img :src=captcha()>
    </div>
	</div>
  <div class="footer"></div>
</template>

<script lang="ts">
  import { defineComponent, reactive } from 'vue';
  import {getCaptcha} from '@/api'
  import {noNumericToBlank, patternSMs} from "@fe-hl/utils";
	export default defineComponent( {
		name: 'Login',
    setup(){
        const  formConfig = reactive({
          formConfigList:[
            {
              componentType: 'text',
              type: 'text',
              label: '用户名:',
              placeholder: '请输入用户名',
              key: 'userName',
              maxlength: 20,
              rules: [
                { required: true, message: '请填写用户名' }
              ],
            },
            {
              componentType: 'text',
              type: 'password',
              label: '密码:',
              placeholder: '请输入密码',
              key: 'password',
              maxlength: 20,
              rules: [
                { required: true, message: '请输入密码' }
              ],
            },
            {
              label: '验证码',
              componentType: 'captcha',
              type: 'text',
              formatter: noNumericToBlank,
              placeholder: '请输入验证码',
              src:async ()=>{return  await captcha()},
              key: 'smsCode',
              handlerCountdown: countdown => {
                countdown();
              },
              maxlength: 6,
              rules: [{ pattern: patternSMs, message: '请输入验证码' }],
            },
          ],
          buttonLabel:"登陆"
        });
        //获取验证吗
        let captcha = async ()=>{
            let res = await getCaptcha();
            debugger
            console.log(3243432)
            return Promise.resolve(res.data).then(res()=>);
        }
        console.log(123)
        return {
          formConfig,
          captcha
        }
    }
	});
</script>

<style scoped lang="scss">
    .header{
      height: 30%;
    }
    .content{
      height: 50%;
    }
    .header{
      height: 20%;
    }

</style>
