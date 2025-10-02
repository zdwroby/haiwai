(function (W) {
    const RebateTiered = {
        props: ['owner'],
        data() {
            return {
                selectData: [],
                tableData: [],
                rebateGameConfigId: 1,
                userId: 0
            };
        },
        created() {
            //获取参数值
            if(this.$route.params.id){
                this.userId = this.$route.params.id;
            }              
            this.fetchSelectData();
        },
        methods: {
            fetchSelectData() {
                Axios.get('/api/agent/config/getRebateConfigList', {})
                    .then(response => {
                        let data = response.data;
                        if(data.data){
                            this.selectData = data.data;
                            this.rebateGameConfigId = data.data[0]['id'];
                            this.fetchDetailData(this.rebateGameConfigId);
                        }
                    }) 
                    .catch(error => {
                        console.log(error);
                    });                
            },
            fetchDetailData(cateId) {
                Axios.post('/api/agent/config/getRebateConfigInfo', {id: cateId, is_agent_name: this.$props.owner, user_id: this.userId})
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
            changeSelect(val) {
                this.fetchDetailData(val);
            },
            //保存指定区块内容
            save(index) {
                this.tableData[index].is_agent_name = this.$props.owner;
                console.log(this.tableData[index]);
                Axios.post('/api/agent/config/saveRebateConfig', {table:this.tableData[index], user_id: this.userId})
                    .then(response => {
                        let data = response.data;
                        if(data.retCode){
                            this.fetchDetailData(this.tableData[index].protory_id)
                            this.$message.success(data.message);
                        }    
                    })
                    .catch(error => {
                        console.log(error);
                        this.$message.error('保存失败');
                    });                
            },
            //25-09-14防止嵌套循环时表单不实时显示输入内容
            handleInput(pindex, index, value)
            {
                console.log('Input value:', pindex+'##'+index+'##'+value);
                this.$set(this.tableData[pindex].rebate_vip_config, index, value);
            }
        },
        template: `
  <div>
    <page-header icon="el-icon-s-operation" title="阶梯返水配置"/>
    
    <el-card shadow="never" class="section">
      <el-select v-model="rebateGameConfigId" style="width:240px" @change="changeSelect">
        <el-option v-for="t in selectData" :key="t.id" :label="t.name" :value="t.id"/>         
      </el-select>
    </el-card>
    
    <el-card v-for="(item, index) in tableData" :key="index" shadow="never" class="section">
      <h4 style="margin:0 0 8px 0">
        <i class="el-icon-collection"></i> {{item.platform_name}} 

      </h4>
      <el-table :data="item.rebate_vip_config" border>
        <el-table-column align="center" label="返水阶梯%">
            <template slot-scope="scope">
              <span>VIP{{scope.$index}}</span>  
            </template>
        </el-table-column>     
        <el-table-column align="left" label="返水%">          
          <template v-slot="scope">
            <el-input type="number" :key="scope.$index" v-model="scope.row" @input="handleInput(index,scope.$index, $event)" placeholder="请输入"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:right;margin-top:10px">
        <el-button type="primary" @click="save(index)">
          <i class="el-icon-check"></i> 保存
        </el-button>
      </div>
    </el-card>
  </div>`
    };
    W.Views = W.Views || {};
    W.Views.RebateTiered = RebateTiered;
})(window);