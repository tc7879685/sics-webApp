<template>
	<section  class="login-form">
		<bc-form v-bind="formConfig"> </bc-form>


	</section>
</template>

<script lang="ts">
  import { defineComponent, reactive } from 'vue';
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
          ]
        });
        return {
          formConfig,
        }
    }
	});
</script>

<style scoped lang="scss">
  .login-form{
     top: 20%;
  }

</style>
