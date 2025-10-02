// src/router.js
(function (W) {
  const routes = [
    { path: '/', redirect: '/dashboard' },
    { path: '/login', component: W.Views.Login, name: 'login' },
    { path: '/dashboard', component: W.Views.Dashboard, name: 'dashboard' },
    { path: '/add_agent', component: W.Views.AddAgent },
    { path: '/promo', component: W.Views.Promo },
    { path: '/personal', component: W.Views.Personal },
    { path: '/report', component: W.Views.Report },
    { 
      path: '/direct_agents', 
      component: { render: h => h(W.Views.DirectAgents, { props: { kind: 'direct' } }) }
    },
    { 
      path: '/indirect_agents', 
      component: { render: h => h(W.Views.DirectAgents, { props: { kind: 'indirect' } }) } 
    },
    {
      path: '/direct_members',
      component: { render: h => h(W.Views.MembersList, { props: { kind: 'direct' } }) }
    },
    {
      path: '/indirect_members',
      component: { render: h => h(W.Views.MembersList, { props: { kind: 'indirect' } }) }
    },
    {
      path: '/agent_rebate_fixed',
      component: { render: h => h(W.Views.RebateFixed, { props: { owner: 'agent' } }) },
    },
    {
      path: '/agent_rebate_fixed/:id',
      component: { render: h => h(W.Views.RebateFixed, { props: { owner: 'agent' } }) },
      name: 'agent_rebate_fixed'
    },    
    { 
      path: '/agent_rebate_tiered', 
      component: { render: h => h(W.Views.RebateTiered, { props: { owner: 'agent' } }) },
    },
    { 
      path: '/agent_rebate_tiered/:id', 
      component: { render: h => h(W.Views.RebateTiered, { props: { owner: 'agent' } }) },
      name: 'agent_rebate_tiered'
    },    
    {
      path: '/member_rebate_fixed',
      component: { render: h => h(W.Views.RebateFixed, { props: { owner: 'member' } }) }
    },
    {
      path: '/member_rebate_fixed/:id',
      component: { render: h => h(W.Views.RebateFixed, { props: { owner: 'member' } }) },
      name: 'member_rebate_fixed'
    },    
    { 
      path: '/member_rebate_tiered', 
      component: { render: h => h(W.Views.RebateTiered, { props: { owner: 'member' } }) }
    },
    { 
      path: '/member_rebate_tiered/:id', 
      component: { render: h => h(W.Views.RebateTiered, { props: { owner: 'member' } }) },
      name: 'member_rebate_tiered'
    },    
    { path: '/edit_agent/:id', component: W.Views.EditAgent, name: 'edit_agent' },
    { path: '/edit_member/:id', component: W.Views.EditMember, name: 'edit_member' }
  ];

  const router = new VueRouter({ routes });

  // 登录守卫333
  router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('kk_token');
    if (!token && to.path !== '/login') {
      next('/login'); // 未登录强制跳转到 login
    } else {
      next();
    }
  });
  window.KKRouter = router;

  //异步请求设置[请求域名]
  window.Axios = axios.create({
    baseURL: 'http://www.kk.com',
    timeout:50000,
    headers: {'Content-Type': 'application/json', 'Token': localStorage.getItem('kk_token')}
  });
})(window);