// src/views/login.js
(function (W) {
    const Login = {
        template: `
      <div class="login-page">
        <el-card class="login-card" shadow="never">
          <h2 style="text-align:center;margin-bottom:20px">KK 控制台登录</h2>
          <el-form :model="form" label-width="80px">
            <el-form-item label="账号">
              <el-input v-model="form.username" placeholder="请输入账号"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" style="width:100%" @click="login">登录</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    `,
        data() {
            return { form: { username: '', password: '' } };
        },
        methods: {
            login() {
                if (this.form.username && this.form.password) {
                    Axios.post('/api/agent/agent/login', this.form)
                    .then(response => {
                        let data = response.data;
                        if(data.retCode){
                            let token = data.data.login_token;
                            localStorage.setItem('kk_token', token);
                            localStorage.setItem('user_info', JSON.stringify(data.data));
                            //登录后全局添加token
                            window.Axios = axios.create({
                                baseURL: 'http://www.kk.com',
                                timeout:50000,
                                headers: {'Content-Type': 'application/json', 'Token': localStorage.getItem('kk_token')}
                              });
                            this.$router.push('/dashboard');
                            this.$message.success('登录成功');
                        }else{
                            this.$message.error(data.message);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
                } else {
                    this.$message.error('请输入账号和密码');
                }
            }
        }
    };
    W.Views = W.Views || {};
    W.Views.Login = Login;
})(window);