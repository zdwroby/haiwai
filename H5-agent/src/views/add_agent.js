(function (W) {
    const AddAgent = {
        template: `
  <div>
    <page-header icon="el-icon-document" title="数据报表"/>
    <el-card shadow="never" class="section">
    <el-form :model="q" inline>
      <el-form-item class="mb0" label="代理账号"><el-input v-model="q.agent" placeholder="agent001"/></el-form-item>
      <el-form-item class="mb0">
          <el-button type="primary" @click="search"><i class="el-icon-search"></i> 搜索</el-button>
          <el-button @click="retetQuery"><i class="el-icon-refresh-right"></i> 重置</el-button>
          <el-button type="warning" @click="dialogVisible = true"><i class="el-icon-plus"></i>新增</el-button>
      </el-form-item>
    </el-form>
    </el-card>
    <el-dialog
      :title="isEdit ? '编辑' : '新增'"
      :visible.sync="dialogVisible"
      width="40%"
      destroy-on-close      
      :close-on-click-modal="false"      
      :before-close="handleClose">
      <el-form :model="addForm" ref="addForm" label-width="100px" class="demo-ruleForm pr20">
        <el-form-item label="用户昵称" prop="nick_name">
            <el-input type="text" v-model="addForm.nick_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户账号" prop="account">
            <el-input type="text" v-model="addForm.account" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="account">
            <el-input type="text" v-model="addForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户ID" prop="account">
            <el-input type="number" :disabled="isEdit ? true : false" v-model="addForm.user_id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="account_status">
            <el-switch
              v-model="addForm.account_status"
              active-value="1"
              inactive-value="0"  
              active-text="冻结"
              inactive-text="正常">
            </el-switch> 
        </el-form-item>
   
      </el-form>      
      <span slot="footer" class="dialog-footer pr20">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>            
    <el-card shadow="never" class="section">
      <el-table :data="tableData" border class="mb20">
        <el-table-column align="center" prop="nick_name" label="用户昵称"></el-table-column>
        <el-table-column align="center" prop="account" label="用户账号" width="100"></el-table-column>
        <el-table-column align="center" prop="user_id" label="用户ID" width="100"></el-table-column>    
        <el-table-column align="center" prop="account_status" label="状态" >
            <template slot-scope="scope">
                <el-tag
                  :type="scope.row.account_status === 1 ? 'danger' : 'success'"
                  disable-transitions>{{scope.row.account_status==1 ? '冻结' : '正常'}}
                </el-tag>
            </template>
        </el-table-column>    
        <el-table-column align="center" prop="create_time" label="添加时间"></el-table-column>
        <el-table-column align="center" prop="update_time" label="修改时间"></el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="s">
            <el-button
              type="primary"
              size="mini"
              @click="editButton(s.row)">
              <i class="el-icon-edit"></i> 编辑
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
  </div>`, data() {
            return {
                q: {agent:''},
                page: {
                    index: 1,   //当前页面
                    size: 10,   //每页条数
                    total: 0,
                },
                tableData: [],
                isEdit: false,
                dialogVisible: false,
                addForm: {id: '', nick_name: '', account: '', password: '', account_status: '', user_id: ''},
            }
        }, created() {
            this.fetchData();       //组件创建时获取表格数据
        }, methods: {
            //ajax加载表格数据
            fetchData() {
                Axios.post('/api/agent/agent/list', {page:this.page.index, page_size: this.page.size,search: this.q.agent})
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
                if(!this.q.agent){
                    this.$message.error('请填写搜索条件'); 
                    return false;                       
                }
                this.fetchData();    
            },
            //关闭弹窗
            handleClose(done) {
                this.$confirm('确认关闭？')
                  .then(_ => {
                    done();
                    this.resetDialog()
                  })
                  .catch(_ => {});
            },
            //新增或编辑 提交按钮
            handleSubmit() {
                //是编辑，可以不传密码
                if(!this.addForm.nick_name || !this.addForm.account || !this.addForm.user_id){
                    this.$message.error('请完整填写');
                    return;
                }
                if(!this.addForm.id){
                    if(!this.addForm.password){
                        this.$message.error('请完整填写');
                        return;
                    }  
                }
                Axios.post('/api/agent/agent/add', this.addForm)
                .then(response => {
                    let data = response.data;
                    if(data.retCode){
                        this.$message.success(data.message);
                        this.fetchData();
                        this.dialogVisible = false;     //关闭弹框
                        this.resetDialog();             //重置弹框，免复编辑时影响别处
                    }
                })
                .catch(error => {
                    console.log(error);
                });
            },
            //表格点击编辑按钮  [不显示密码]
            editButton(row) {
                this.addForm.id= row.id;
                this.addForm.nick_name = row.nick_name;
                this.addForm.account = row.account;
                this.addForm.account_status = row.account_status.toString();
                this.addForm.user_id = row.user_id;
                this.isEdit = true;
                this.dialogVisible = true; //打开弹窗
            },
            retetQuery() {
                this.q = {agent: ''};
                this.fetchData(); 
            },
            resetDialog() {
                this.isEdit = false;
                this.addForm = {id:'', nick_name: '', account: '', password: '', account_status: '', user_id: ''}
            }
        }
    };
    W.Views = W.Views || {};
    W.Views.AddAgent = AddAgent;
})(window);