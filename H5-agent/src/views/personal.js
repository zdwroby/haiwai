(function (W) {
    const Personal = {
        template: `
  <div>
    <page-header icon="el-icon-s-data" title="个人数据"/>
    <el-card shadow="never" class="section">
      <el-table :data="rows" border>
        <el-table-column prop="current" label="当前额度"></el-table-column>
        <el-table-column prop="profit" label="账户盈亏"></el-table-column>
        <el-table-column prop="rate" label="返水返点"></el-table-column>
        <el-table-column prop="rebate" label="返水金额"></el-table-column>
      </el-table>
    </el-card>
  </div>`, data() {
            return {rows: [{current: '0.00', profit: '0.00', rate: '按玩法配置', rebate: '0.00'}]}
        }
    };
    W.Views = W.Views || {};
    W.Views.Personal = Personal;
})(window);