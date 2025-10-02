(function (W) {
    const DirectAgents = {
        props: ['kind'],
        template: `
  <div>
    <page-header 
        :icon="kind==='direct' ? 'el-icon-s-claim' : 'el-icon-s-custom'"
        :title="kind==='direct' ? '直属会员列表' : '非直属会员列表'"/>

    <el-card shadow="never" class="section">
      <el-form :model="q" inline>
        <el-form-item class="mb0" label="代理ID"><el-input v-model="q.agent" placeholder="1"/></el-form-item>
        <el-form-item class="mb0" label="账号"><el-input v-model="q.account" placeholder="agent001"/></el-form-item>
        <el-form-item class="mb0">
            <el-button type="primary" @click="search"><i class="el-icon-search"></i> 搜索</el-button>
            <el-button @click="retetQuery"><i class="el-icon-refresh-right"></i> 重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" class="section">
      <el-table :data="tableData" border class="mb20">
        <el-table-column prop="account" label="账号"></el-table-column>
        <el-table-column prop="user_id" label="代理ID" width="100"></el-table-column>
        <el-table-column prop="nick_name" label="代理名称"></el-table-column>
        <el-table-column prop="parent_id" label="上级ID"></el-table-column>
        <el-table-column prop="sub_agent_num" label="下级代理数"></el-table-column>
        <el-table-column prop="team_directly_size" label="直属会员数"></el-table-column>
        <el-table-column prop="team_size" label="会员总数"></el-table-column>
        <el-table-column label="操作" width="320">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="$router.push({name: 'agent_rebate_fixed', params: {id: scope.row.user_id}})">
              <i class="el-icon-edit"></i> 固定返水
            </el-button>
            <el-button type="primary" size="mini" @click="$router.push({name: 'agent_rebate_tiered', params: {id: scope.row.user_id}})">
              <i class="el-icon-edit"></i> 阶梯返水
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination 
          background
          @current-change="currentChange"
          :current-change="page.index"
          :page-size="page.size" 
          layout="total, prev, pager, next"
          :total="page.total">
      </el-pagination>

    </el-card>
  </div>`,
        data() {
            return {
                q: {agent: '', account: ''},
                page: {
                    index: 1,   //当前页面
                    size: 10,   //每页条数
                    total: 0,
                },
                tableData: [],                
            };
        },
        created() {
          this.fetchData();
        },
        methods: {
            //ajax加载表格数据
            fetchData() {
                Axios.post('/api/agent/agent/directList', {page:this.page.index, page_size: this.page.size, kind: this.$props.kind, search: this.q})
                .then(response => {
                    let data = response.data;
                    if(data.data){
                        this.page.total = data.data.total;
                        this.page.index = data.data.currentPage;
                        this.tableData = data.data.list;                        
                    }else{
                        this.tableData = [];
                    }
                })
                .catch(error => {
                    console.log(error);
                });
            },    
            //改变页码
            currentChange(val) {
                this.page.index = val;
                this.fetchData();
            },              
            //搜索
            search() {
                if(!this.q.agent && !this.q.account){
                    this.$message.error('请填写搜索条件'); 
                    return false;                       
                }                
                this.fetchData();    
            }, 
            retetQuery() {
                this.q = {agent: '', account: ''};
                this.fetchData();
            },               
            resetForm() {
                this.f = { aid: '', username: '' };
            }
        }
    };
    W.Views = W.Views || {};
    W.Views.DirectAgents = DirectAgents;
})(window);