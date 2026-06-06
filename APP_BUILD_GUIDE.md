# 战场射击 - 手机 APP 构建指南

这是一个使用 Capacitor 打包的跨平台手机游戏。

## 在线试玩

直接访问：[https://gun-psi.vercel.app](https://gun-psi.vercel.app)

## 下载安装

### Android APK

**方式一：GitHub Actions 自动构建（推荐）**
1. 访问仓库的 [Actions](../../actions) 页面
2. 点击最新的构建任务
3. 在 Artifacts 中下载 `app-release`
4. 将 APK 传输到手机安装

**方式二：本地构建**
```bash
# 1. 同步项目
npx cap sync android

# 2. 打开 Android Studio
cd android
studio .

# 或使用 Gradle 构建
./gradlew assembleRelease
```

APK 路径：`android/app/build/outputs/apk/release/app-release-unsigned.apk`

### iOS 应用

**需要：Mac 电脑 + Xcode**

```bash
# 1. 同步项目
npx cap sync ios

# 2. 打开 Xcode
cd ios
open App.xcworkspace

# 3. 在 Xcode 中选择设备并构建
```

## 本地开发测试

```bash
# 启动本地服务器
npx cap serve

# 或在浏览器中打开
python3 -m http.server 8080
```

## PWA 安装

无需下载 APK，直接在手机浏览器中：
1. 访问 https://gun-psi.vercel.app
2. Chrome/Edge：菜单 → "添加到主屏幕"
3. Safari：分享 → "添加到主屏幕"

## 项目结构

```
gun/
├── android/          # Android 原生项目
├── ios/              # iOS 原生项目
├── www/              # 网页资源（打包用）
├── icons/            # 应用图标
├── manifest.json     # PWA 配置
├── sw.js             # Service Worker
├── capacitor.config.json  # Capacitor 配置
└── .github/workflows/     # 自动构建
```

## 技术栈

- HTML5 Canvas 游戏
- Capacitor 原生应用封装
- PWA 离线支持

## 应用信息

- **应用名称**：战场射击
- **包名**：com.brucesunxi.gun
- **版本**：1.0
- **屏幕方向**：横屏（Landscape）
- **最低 Android 版本**：Android 5.0 (API 22)
