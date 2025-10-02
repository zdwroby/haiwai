(function (W) {
    const MembersList = {
        props: ['kind'],
        template: `
  <div>
    <page-header 
        :icon="kind==='direct' ? 'el-icon-s-claim' : 'el-icon-s-custom'"
        :title="kind==='direct' ? '直属会员列表' : '非直属会员列表'"/>

    <el-card shadow="never" class="section">
      <el-form :model="q" inline>
        <el-form-item class="mb0" label="用户ID"><el-input v-model="q.member_id" placeholder="1"/></el-form-item>
        <el-form-item class="mb0" label="用户昵称"><el-input v-model="q.nick_name" placeholder="agent001"/></el-form-item>
        <el-form-item class="mb0">
            <el-button type="primary" @click="search"><i class="el-icon-search"></i> 搜索</el-button>
            <el-button @click="retetQuery"><i class="el-icon-refresh-right"></i> 重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" class="section">
      <el-table :data="tableData" border class="mb20">
        <el-table-column prop="user_id" label="用户ID" width="100"></el-table-column>
        <el-table-column prop="bet_nums" label="注单笔数"></el-table-column>
        <el-table-column prop="bet_money" label="投注金额"></el-table-column>
        <el-table-column prop="valid_bet" label="有效投注"></el-table-column>
        <el-table-column prop="recharge_money" label="累计充值"></el-table-column>
        <el-table-column prop="withdraw_money" label="累计提现"></el-table-column>
          <el-table-column prop="vip_level" label="VIP等级"></el-table-column>
          <el-table-column prop="register_time" label="注册时间"></el-table-column>
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="$router.push({name: 'member_rebate_fixed', params: {id: scope.row.user_id}})">
              <i class="el-icon-edit"></i> 固定返水
            </el-button>
            <el-button type="primary" size="mini" @click="$router.push({name: 'member_rebate_tiered', params: {id: scope.row.user_id}})">
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
                q: {member_id: '', nick_name: ''},
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
                Axios.post('/api/agent/member/list', {page:this.page.index, page_size: this.page.size, kind: this.$props.kind, search: this.q})
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
                if(!this.q.member_id && !this.q.nick_name){
                    this.$message.error('请填写搜索条件'); 
                    return false;                       
                }                
                this.fetchData();    
            }, 
            retetQuery() {
                this.q = {member_id: '', nick_name: ''};
                this.fetchData();
            },               
            resetForm() {
                this.f = { member_id: '', nick_name: '' };
            }
        }
    };
    W.Views = W.Views || {};
    W.Views.MembersList = MembersList;
})(window);