# 多语言学习工具 (Multi-language Learning Tool)

一个基于 Next.js 和 AWS Polly 的多语言文本转语音学习工具，支持13种语言，提供高质量的语音合成服务。

## ✨ 主要特性

- 🌍 支持13种语言的文本转语音
- 🎯 支持男声/女声切换
- ⚡ 实时语速调节 (0.5x - 2.0x)
- 📚 支持逐词朗读模式
- 💾 支持音频下载
- 📤 支持文本文件上传
- 🌓 支持浅色/深色主题
- 🔤 界面支持13种语言本地化

## 🛠️ 技术栈

- **框架**: Next.js 14
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI组件**: shadcn/ui
- **语音服务**: AWS Polly
- **状态管理**: React Context
- **构建工具**: SWC

## 📦 安装

1. 克隆项目
```bash
git clone https://github.com/yourusername/multi-language-learning-tool.git
cd multi-language-learning-tool
```

2. 安装依赖
```bash
npm install
# 或
yarn install
# 或
pnpm install
```

3. 配置环境变量

创建 `.env.local` 文件并添加以下配置：
```env
NEXT_PUBLIC_AWS_REGION=your_aws_region
NEXT_PUBLIC_AWS_ACCESS_KEY_ID=your_access_key_id
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=your_secret_access_key
```

4. 启动开发服务器
```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

## 🌍 支持的语言

| 语言 | 区域 | 声音选项 |
|------|------|----------|
| 英语 | 美国、英国、澳大利亚 | 男/女声 |
| 中文 | 中国大陆 | 单一声音 |
| 法语 | 法国 | 男/女声 |
| 西班牙语 | 西班牙、墨西哥 | 男/女声 |
| 德语 | 德国 | 男/女声 |
| 意大利语 | 意大利 | 男/女声 |
| 日语 | 日本 | 男/女声 |
| 韩语 | 韩国 | 单一声音 |
| 葡萄牙语 | 巴西、葡萄牙 | 男/女声 |
| 波兰语 | 波兰 | 男/女声 |
| 俄语 | 俄罗斯 | 男/女声 |
| 土耳其语 | 土耳其 | 单一声音 |
| 印地语 | 印度 | 单一声音 |

## 📄 支持的文件格式

### 上传
- ✅ `.txt` (文本文件)
- ✅ `.md` (Markdown文件)
- ❌ `.pdf` (PDF文件) - 开发中
- ❌ `.doc/.docx` (Word文档) - 开发中
- ❌ `.rtf` (富文本格式) - 开发中

### 下载
- 📁 MP3格式音频文件

## 🤝 贡献指南

欢迎提交 Pull Request 或创建 Issue！

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📝 开发计划

- [ ] 支持更多文件格式（PDF、Word等）
- [ ] 添加音频可视化效果
- [ ] 支持音频播放控制（暂停/继续）
- [ ] 添加用户发音评分功能
- [ ] 支持生成字幕
- [ ] 添加单词本功能

## 📜 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 鸣谢

- [Next.js](https://nextjs.org/)
- [AWS Polly](https://aws.amazon.com/polly/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) 