(function (W) {
    const Report = {
        template: `
  <div>
    <page-header icon="el-icon-document" title="数据报表"/>
    <el-card shadow="never" class="section">
    <el-form :model="q" inline>
      <el-form-item label="代理账号"><el-input v-model="q.agent" placeholder="agent001"/></el-form-item>
      <el-date-picker
      v-model="q.from"
      type="datetimerange"
      range-separator="至"
      start-placeholder="YYYY-mm-dd HH:MM:SS"
      end-placeholder="YYYY-mm-dd HH:MM:SS">
      </el-date-picker>      
      <el-form-item label="快捷查询"><el-select v-model="q.quick" placeholder="--" style="width:140px">
        <el-option label="--" value=""/><el-option label="今天" value="today"/><el-option label="昨天" value="yesterday"/><el-option label="近7天" value="7d"/>
      </el-select></el-form-item>
      <el-form-item>
          <el-button type="primary" @click="save"><i class="el-icon-search"></i> 搜索</el-button>
          <el-button @click="reset"><i class="el-icon-refresh-right"></i> 重置</el-button>
      </el-form-item>
    </el-form>
    </el-card>
    <el-card shadow="never" class="section">
      <el-table :data="rows" border>
        <el-table-column prop="type" label="类型"></el-table-column>
        <el-table-column prop="count" label="注单笔数" width="100"></el-table-column>
        <el-table-column prop="amount" label="投注金额"></el-table-column>
        <el-table-column prop="valid" label="有效投注"></el-table-column>
        <el-table-column prop="member_rebate" label="会员返水"></el-table-column>
        <el-table-column prop="earn_rebate" label="赚水"></el-table-column>
        <el-table-column prop="diff_comp" label="赔差"></el-table-column>
        <el-table-column prop="member_winloss" label="会员输赢"></el-table-column>
        <el-table-column prop="member_result" label="会员结果"></el-table-column>
        <el-table-column prop="lvl2" label="二级代理结果"></el-table-column>
        <el-table-column prop="lvl3" label="三级代理结果"></el-table-column>
        <el-table-column prop="lvl4" label="四级代理结果"></el-table-column>
      </el-table>
    </el-card>
  </div>`, data() {
            return {
                q: {agent: '', from: '', quick: ''},
                rows: ['彩票', '体育', '捕鱼', '棋牌', '视讯', '电子'].map(t => ({
                    type: t,
                    count: 0,
                    amount: '0.00',
                    valid: '0.00',
                    member_rebate: '0.00',
                    earn_rebate: '0.00',
                    diff_comp: '0.00',
                    member_winloss: '0.00',
                    member_result: '0.00',
                    lvl2: '0.00',
                    lvl3: '0.00',
                    lvl4: '0.00'
                }))
            }
        }, methods: {
            save() {
                if (!this.q.agent) {
                    this.$message.error('请完整填写');
                    return;
                }
                KKStore.up(s => {
                    (s.agents || (s.agents = [])).push({
                        id: Date.now() % 100000,
                        agent: this.q.agent,
                        from: this.q.from,
                        quick: this.q.quick
                    });
                });
                this.$message.success('创建成功');
                this.reset();
            },
            reset() {
                this.q = {agent: '', from: '', quick: ''};
            }
        }
    };
    W.Views = W.Views || {};
    W.Views.Report = Report;
})(window);