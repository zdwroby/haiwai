(function (W) {
    const RebateFixed = {
        props: ['owner'],
        data() {
            return {
                defaultId: '1',
                tabs: [],
                tableData: [],
                userId: 0,
            };
        },
        created() {
            //获取参数值
            if(this.$route.params.id){
                this.userId = this.$route.params.id;
            }            
            this.fetchTabData();
            this.fetchData(this.defaultId);
        },
        methods: {
            handleClick(tab, event) {
                let itemId = tab.name;
                this.fetchData(itemId);
            },           
            fetchTabData(){
                Axios.get('/api/agent/config/getProtory', {})
                    .then(response => {
                        let data = response.data;
                        if(data.data){
                            this.tabs = data.data;
                            this.defaultId = String(this.tabs[0]['id']);                            
                        }
                    }) 
                    .catch(error => {
                        console.log(error);
                    });

            },
            //获取表格数据
            fetchData(protoryId) {
                Axios.post('/api/agent/config/list', {protory_id: protoryId, is_agent_name: this.$props.owner, user_id: this.userId})
                    .then(response => {
                        let data = response.data;
                        if(data.data){
                            this.tableData = data.data
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });


            },
            save() {
                Axios.post('/api/agent/config/editFixRebate', {table: this.tableData, user_id: this.userId})
                    .then(response => {
                        let data = response.data;
                        if(data.retCode){
                            this.$message.success(data.message);
                        }    
                    })
                    .catch(error => {
                        console.log(error);
                        this.$message.error('保存失败');
                    });
                
            }
        },
        template: `
  <div>
    <page-header
      :icon="owner==='agent' ? 'el-icon-coin' : 'el-icon-money'"
      :title="owner==='agent' ? '代理固定返水配置' : '会员固定返水配置'"/>
    
    <div class="section">
        <el-tabs type="card" v-model="defaultId"  @tab-click="handleClick">
            <el-tab-pane v-for="t in tabs" :key="t.id" :label="t.name" :name="String(t.id)">
                <span slot="label">{{t.name}}</span>
            </el-tab-pane>           
        </el-tabs>
<el-table :data="tableData" border class="mb20">
    <el-table-column align="center" prop="name" label="玩法 / 返水"></el-table-column>
    <el-table-column align="center" label="盘口A">
        <template slot-scope="scope">
          <el-input v-model="scope.row.va" placeholder="请输入"></el-input>
        </template>
    </el-table-column>
    <el-table-column align="center" label="盘口B">
        <template slot-scope="scope">
          <el-input type="number" v-model="scope.row.vb" placeholder="请输入"></el-input>
        </template>
    </el-table-column>
    <el-table-column align="center" label="盘口C">
        <template slot-scope="scope">
          <el-input v-model="scope.row.vc" placeholder="请输入"></el-input>
        </template>
    </el-table-column> 
    <el-table-column align="center" label="盘口D">
        <template slot-scope="scope">
          <el-input v-model="scope.row.vd" placeholder="请输入"></el-input>
        </template>
    </el-table-column>                    
</el-table>            
        <el-button type="primary" @click="save">
          <i class="el-icon-check"></i> 保存
        </el-button>
    </div>
    
  </div>`
    };
    W.Views = W.Views || {};
    W.Views.RebateFixed = RebateFixed;
})(window);