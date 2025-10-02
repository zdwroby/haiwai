// src/main.js
new Vue({
  router: KKRouter,
  data() {
    return {
      ui: KKStore.ui()
    };
  },
  watch: {
    '$route.path'(p) {
      this.ensureOpenByRoute(p);
    }
  },
  created() {
    this.applyUI();
    this.ensureOpenByRoute(this.$route.path);

    // 路由守卫：未登录就跳到 /login
    this.$router.beforeEach((to, from, next) => {
      const token = localStorage.getItem('kk_token');
      if (!token && to.path !== '/login') {
        return next('/login');
      }
      if (token && to.path === '/login') {
        return next('/dashboard'); // 已登录访问 login → 重定向
      }
      next();
    });
  },
  methods: {
    applyUI() {
      document.body.classList.remove('theme-blue','theme-purple','theme-green','theme-gray','compact');
      document.body.classList.add('theme-' + (this.ui.theme || 'blue'));
      if (this.ui.compact) {
        document.body.classList.add('compact');
      }
    },
    setTheme(t) {
      this.ui.theme = t;
      KKStore.saveUI(this.ui);
      this.applyUI();
      this.$message.success('已切换主题：' + t);
    },
    setDensity(compact) {
      this.ui.compact = compact;
      KKStore.saveUI(this.ui);
      this.applyUI();
    },
    onOpen(key) {
      this.ui.openeds = [key];
      KKStore.saveUI(this.ui);
    },
    onClose() {},
    ensureOpenByRoute(p) {
      const map = [
        {key:'grp-account', routes:['/add_agent','/promo']},
        {key:'grp-personal', routes:['/personal','/report']},
        {key:'grp-agents', routes:['/direct_agents','/indirect_agents','/edit_agent']},
        {key:'grp-members', routes:['/direct_members','/indirect_members','/edit_member']},
        {key:'grp-agent-rebate', routes:['/agent_rebate_fixed','/agent_rebate_tiered']},
        {key:'grp-member-rebate', routes:['/member_rebate_fixed','/member_rebate_tiered']}
      ];
      const hit = map.find(m => m.routes.some(r => p.indexOf(r) === 0));
      this.ui.openeds = hit ? [hit.key] : [];
      KKStore.saveUI(this.ui);
    },
    logout() {
      localStorage.removeItem('kk_token');
      this.$message.success('已退出登录');
      this.$router.push('/login');
    }
  },
  render(h) {
    if (this.$route.path === '/login') {
      return h('div', {attrs:{id:'kk-login'}}, [h('router-view')]);
    }

    return h('el-container', {style:{height:'100%'}}, [
      h('el-header', [
        h('div', {staticClass:'brand'}, ['KK 控制台']),
        h('div', {staticClass:'head-right'}, [
          h('el-input', {
            attrs:{placeholder:'搜索功能/页面…',size:'small',clearable:true},
            style:{width:'240px'}
          }),
          h('el-dropdown', [
            h('span',{class:'el-dropdown-link',style:{cursor:'pointer'}},[
              h('i',{staticClass:'el-icon-s-operation'}),' 偏好'
            ]),
            h('el-dropdown-menu',{slot:'dropdown'},[
              h('el-dropdown-item',[h('strong','主题')]),
              h('el-dropdown-item',{on:{click:()=>this.setTheme('blue')}},'蓝'),
              h('el-dropdown-item',{on:{click:()=>this.setTheme('purple')}},'紫'),
              h('el-dropdown-item',{on:{click:()=>this.setTheme('green')}},'绿'),
              h('el-dropdown-item',{on:{click:()=>this.setTheme('gray')}},'灰'),
              h('el-dropdown-item',{attrs:{divided:true}},[h('strong','表格密度')]),
              h('el-dropdown-item',{on:{click:()=>this.setDensity(false)}},'舒适'),
              h('el-dropdown-item',{on:{click:()=>this.setDensity(true)}},'紧凑')
            ])
          ]),
          h('el-avatar',{props:{size:28}},'A'),
          h('el-button',{props:{type:'danger',size:'mini'},style:{marginLeft:'10px'},on:{click:this.logout}},'退出')
        ])
      ]),
      h('el-container', [
        h('el-aside',{staticClass:'sidebar',attrs:{width:'264px'}},[
          h('el-menu',{
            staticClass:'sidebar-menu',
            props:{
              'default-active': this.$route.path,
              router:true,
              'unique-opened':true,
              'background-color':'transparent',
              'text-color':'#E6E8EC',
              'active-text-color':'#fff',
              'default-openeds':this.ui.openeds
            },
            on:{open:this.onOpen,close:this.onClose}
          }, [
            h('el-menu-item',{attrs:{index:'/dashboard'}},[
              h('i',{staticClass:'el-icon-odometer'}),
              h('span',{slot:'title'},'仪表盘')
            ]),
            // 账号管理
            h('el-submenu',{attrs:{index:'grp-account'}},[
              h('template',{slot:'title'},[ h('i',{staticClass:'el-icon-edit'}), h('span','账号管理') ]),
              h('el-menu-item',{attrs:{index:'/add_agent'}},[ h('i',{staticClass:'el-icon-circle-plus'}), ' 添加代理' ]),
              h('el-menu-item',{attrs:{index:'/promo'}},[ h('i',{staticClass:'el-icon-link'}), ' 推广链接' ])
            ]),

            // 个人管理
            h('el-submenu',{attrs:{index:'grp-personal'}},[
              h('template',{slot:'title'},[ h('i',{staticClass:'el-icon-s-management'}), h('span','个人管理') ]),
              h('el-menu-item',{attrs:{index:'/personal'}},[ h('i',{staticClass:'el-icon-s-data'}), ' 个人数据' ]),
              h('el-menu-item',{attrs:{index:'/report'}},[ h('i',{staticClass:'el-icon-document'}), ' 数据报表' ])
            ]),

            // 代理用户
            h('el-submenu',{attrs:{index:'grp-agents'}},[
              h('template',{slot:'title'},[ h('i',{staticClass:'el-icon-s-custom'}), h('span','代理用户') ]),
              h('el-menu-item',{attrs:{index:'/direct_agents'}},[ h('i',{staticClass:'el-icon-user-solid'}), ' 直属代理列表' ]),
              h('el-menu-item',{attrs:{index:'/indirect_agents'}},[ h('i',{staticClass:'el-icon-user'}), ' 非直属代理列表' ])
            ]),

            // 会员用户
            h('el-submenu',{attrs:{index:'grp-members'}},[
              h('template',{slot:'title'},[ h('i',{staticClass:'el-icon-user-solid'}), h('span','会员用户') ]),
              h('el-menu-item',{attrs:{index:'/direct_members'}},[ h('i',{staticClass:'el-icon-s-claim'}), ' 直属会员列表' ]),
              h('el-menu-item',{attrs:{index:'/indirect_members'}},[ h('i',{staticClass:'el-icon-s-custom'}), ' 非直属会员列表' ])
            ]),

            // 代理返水配置
            h('el-submenu',{attrs:{index:'grp-agent-rebate'}},[
              h('template',{slot:'title'},[ h('i',{staticClass:'el-icon-setting'}), h('span','代理返水配置') ]),
              h('el-menu-item',{attrs:{index:'/agent_rebate_fixed'}},[ h('i',{staticClass:'el-icon-coin'}), ' 固定返水配置' ]),
              h('el-menu-item',{attrs:{index:'/agent_rebate_tiered'}},[ h('i',{staticClass:'el-icon-s-operation'}), ' 阶梯返水配置' ])
            ]),

            // 会员返水配置（子项带图标）
            h('el-submenu',{attrs:{index:'grp-member-rebate'}},[
              h('template',{slot:'title'},[ h('i',{staticClass:'el-icon-tools'}), h('span','会员返水配置') ]),
              h('el-menu-item',{attrs:{index:'/member_rebate_fixed'}},[ h('i',{staticClass:'el-icon-money'}), ' 固定返水配置' ]),
              h('el-menu-item',{attrs:{index:'/member_rebate_tiered'}},[ h('i',{staticClass:'el-icon-s-grid'}), ' 阶梯返水配置' ])
            ])
          ])
        ]),
        h('el-main',[h('router-view')])
      ])
    ]);
  }
}).$mount('#app');