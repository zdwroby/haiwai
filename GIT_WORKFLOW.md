# Git 工作流说明

## 📋  分支策略
💲USDT充值 💵汇旺扫码 💸汇旺转账 🧾充值历史 💒主菜单

🏦天空币提现 🔙返回 ❎取消 🚀工具 🎯一键安装 👉文心快码  ✨开启 🌟

💰充值  💹余额 🎮进入游戏 🏧提现 🎀邀请好友 💁客服支持 💡拉好友进机器人 👩‍💻 人工客服


### 分支结构
- **main** - 主分支，保持稳定，用于生产环境
- **wanc** - 个人开发分支，用于日常开发工作

## 🔄 开发工作流

### 1. 日常开发流程

```bash
# 确保在wanc分支上开发
git checkout wanc

# 开始开发前，先同步main分支的最新代码
git checkout main
git pull origin main
git checkout wanc
git merge main

# 进行开发工作...
# 修改代码、添加功能等

# 提交代码到wanc分支
git add .
git commit -m "feat: 添加新功能模块"
git push origin wanc
```

### 2. 功能完成后合并到main

```bash
# 方法一：直接合并（适用于简单功能）
git checkout main
git pull origin main          # 确保main是最新的
git merge wanc                # 合并wanc分支
git push origin main          # 推送到远程main

# 方法二：创建合并请求（推荐，适用于团队协作）
# 1. 推送wanc分支到远程
git push origin wanc

# 2. 在GitLab上创建Merge Request
# 访问：http://192.168.40.5:9091/backend/sky_admin/-/merge_requests/new?merge_request%5Bsource_branch%5D=wanc
# 填写MR信息，等待代码审查后合并
```

### 3. 常用Git命令

```bash
# 查看当前分支
git branch

# 查看所有分支（包括远程）
git branch -a

# 切换分支
git checkout <branch-name>

# 查看提交历史
git log --oneline

# 查看工作区状态
git status

# 同步远程分支
git fetch origin

# 删除本地分支（功能完成后清理）
git branch -d <branch-name>
```

## 📝 提交规范

### 提交信息格式
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### 类型说明
- **feat**: 新功能
- **fix**: 修复bug
- **docs**: 文档更新
- **style**: 代码格式调整
- **refactor**: 代码重构
- **test**: 测试相关
- **chore**: 构建过程或辅助工具的变动

### 示例
```bash
git commit -m "feat(user): 添加用户管理功能"
git commit -m "fix(login): 修复登录验证码显示问题"
git commit -m "docs: 更新API文档"
```

## 🚨 注意事项

1. **永远不要直接在main分支上开发**
2. **开发前先同步main分支的最新代码**
3. **提交前检查代码质量和测试**
4. **使用有意义的提交信息**
5. **定期推送代码到远程分支，避免代码丢失**

## 🔧 分支管理命令快捷方式

```bash
# 快速切换到开发分支并同步
alias dev="git checkout wanc && git pull origin wanc"

# 快速同步main分支
alias sync="git checkout main && git pull origin main && git checkout wanc && git merge main"

# 快速提交并推送
alias gcp="git add . && git commit && git push origin wanc"
```

## 📞 遇到问题时

1. **代码冲突**: 仔细检查冲突文件，手动解决冲突
2. **误操作**: 使用 `git reflog` 查看操作历史，可以恢复误删的提交
3. **需要帮助**: 随时询问团队成员或查看Git文档

---

**当前分支状态**: 
- 主分支: `main` 
- 开发分支: `wanc` ✅ (当前所在分支)
- 远程跟踪: 已设置
