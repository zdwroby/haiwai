(function (W) {
    const Promo = {
        template: `
  <div>
    <page-header icon="el-icon-link" title="推广链接"/>
    <el-card shadow="never" class="section">
      <el-form label-width="120px">
        <el-form-item label="飞机推广链接">
          <el-input v-model="q.tg_url" style="max-width:560px"></el-input>
          <el-button type="primary" @click="copy(q.tg_url)">
            <i class="el-icon-document-copy"></i> 复制
          </el-button>
        </el-form-item>
        <el-form-item label="网页推广链接">
          <el-input v-model="q.h5_url" style="max-width:560px"></el-input>
          <el-button type="primary" @click="copy(q.h5_url)">
            <i class="el-icon-document-copy"></i> 复制
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>`,
        data() {
            return {
                q: {tg_url: '', h5_url: ''},
            };
        },
        created() {
            this.fetchData();
        },
        methods: {
            fetchData(){
                Axios.get('/api/agent/agent/getPromoLink', {})
                    .then(response => {
                        let data = response.data;
                        if(data.data){
                            this.q = data.data;
                        }
                    }) 
                    .catch(error => {
                        console.log(error);
                    });

            },            
            copy(t) {
                navigator.clipboard?.writeText(t);
                this.$message.success('已复制');
            }
        }
    };
    W.Views = W.Views || {};
    W.Views.Promo = Promo;
})(window);