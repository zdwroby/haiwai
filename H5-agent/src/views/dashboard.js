(function (W) {
    const Dashboard = {
        template: `
  <div>
    <page-header icon="el-icon-data-analysis" title="仪表盘"/>
    <el-row :gutter="16" class="section">
      <el-col :span="6">
        <el-card shadow="never">
          <div style="font-size:12px;color:#8A9099">今日新增</div>
          <div style="font-size:26px;font-weight:800">{{ latest.newUsers || 0 }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never">
          <div style="font-size:12px;color:#8A9099">游戏在线用户</div>
          <div style="font-size:26px;font-weight:800">{{ latest.game || 0 }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never">
          <div style="font-size:12px;color:#8A9099">大厅在线用户</div>
          <div style="font-size:26px;font-weight:800">{{ latest.hall || 0 }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never">
          <div style="font-size:12px;color:#8A9099">活跃用户</div>
          <div style="font-size:26px;font-weight:800">{{ active }}</div>
        </el-card>
      </el-col>
    </el-row>
    <el-card shadow="never" class="section">
      <div style="margin-bottom:6px;color:#8A9099">新增人数 / 大厅在线 / 游戏在线</div>
      <canvas ref="cvs" style="width:100%;height:220px"></canvas>
    </el-card>
  </div>`,
        data() {
            const s = KKStore.data();
            return {
                metrics: s.metrics || [],
                active: Math.floor(Math.random() * 5)
            };
        },
        computed: {
            latest() {
                return this.metrics[this.metrics.length - 1] || {};
            }
        },
        mounted() {
            const s = KKStore.data();
            KKComponents.tinyLineChart(this.$refs.cvs, [
                { name: '新增人数', data: s.metrics.map(m => ({ x: m.ts, y: m.newUsers })) },
                { name: '大厅在线', data: s.metrics.map(m => ({ x: m.ts, y: m.hall })) },
                { name: '游戏在线', data: s.metrics.map(m => ({ x: m.ts, y: m.game })) },
            ]);
        }
    };
    W.Views = W.Views || {};
    W.Views.Dashboard = Dashboard;
})(window);