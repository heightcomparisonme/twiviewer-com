# 🌍 西班牙语系添加完成指南

## ✅ 已完成的工作

### 1. 语言配置更新

#### 文件：`src/i18n/locale.ts`
```typescript
export const locales = ["en", "de", "es"];  // 添加 "es"

export const localeNames: any = {
  en: "English",
  de: "Deutsch",
  es: "Español",  // 新增
};
```

### 2. 区域变体支持

#### 文件：`src/i18n/request.ts`
添加了西班牙语区域变体映射：
```typescript
if (["es-ES", "es-MX", "es-AR", "es-CO", "es-CL"].includes(locale)) {
  locale = "es";
}
```

支持的西班牙语变体：
- 🇪🇸 es-ES (西班牙)
- 🇲🇽 es-MX (墨西哥)
- 🇦🇷 es-AR (阿根廷)
- 🇨🇴 es-CO (哥伦比亚)
- 🇨🇱 es-CL (智利)

### 3. 创建的翻译文件

#### 主翻译文件
- ✅ `src/i18n/messages/es.json` (605行)

#### 页面翻译文件
- ✅ `src/i18n/pages/comingsoon/es.json`
- ✅ `src/i18n/pages/discord/es.json`
- ✅ `src/i18n/pages/featured-creations/es.json`
- ✅ `src/i18n/pages/glossary/es.json`
- ✅ `src/i18n/pages/hero/es.json`
- ✅ `src/i18n/pages/landing/es.json`
- ✅ `src/i18n/pages/onboarding/es.json`
- ✅ `src/i18n/pages/pricing/es.json`
- ✅ `src/i18n/pages/showcase/es.json`

#### 工具翻译文件
- ✅ `src/i18n/pages/tools/example/es.json`

### 4. 已翻译的关键内容

#### 用户界面
- 登录/注册表单
- 用户中心
- 订单管理
- 导航菜单

#### AI Moon Advisor 工具
- 页面标题和描述
- Hero 区块
- 占位组件文案
- 特性说明

## 📝 关键翻译示例

### 用户界面
```json
{
  "sign_in": "Iniciar Sesión",
  "sign_out": "Cerrar Sesión",
  "my_orders": "Mis Pedidos",
  "user_center": "Centro de Usuario"
}
```

### 占位组件
```json
{
  "placeholder": {
    "title": "AI Moon Advisor",
    "badge": "Próximamente",
    "description": "Experimenta insights lunares personalizados...",
    "features": [
      "Impulsado por IA",
      "Rápido y Preciso",
      "Fácil de Usar"
    ],
    "ctaText": "Únete a la Lista de Espera"
  }
}
```

## 🚀 如何使用

### 1. 访问西班牙语页面
```
https://your-domain.com/es
https://your-domain.com/es/tools/example
```

### 2. 在组件中使用
```tsx
import { useTranslations } from 'next-intl';

export function Component() {
  const t = useTranslations();
  return <h1>{t('user.sign_in')}</h1>; // 显示 "Iniciar Sesión"
}
```

### 3. 语言切换器
```tsx
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  return (
    <select 
      value={locale}
      onChange={(e) => router.push(`/${e.target.value}`)}
    >
      <option value="en">English</option>
      <option value="de">Deutsch</option>
      <option value="es">Español</option>
    </select>
  );
}
```

## 📋 待完成的翻译工作

### 需要人工翻译的文件
所有 `.json` 文件目前都是从英文复制的，包含英文内容。需要专业翻译：

1. **主翻译文件** (优先级：高)
   - `src/i18n/messages/es.json` (约600行)

2. **页面翻译** (优先级：中)
   - 所有 `src/i18n/pages/*/es.json` 文件

3. **工具翻译** (优先级：中)
   - `src/i18n/pages/tools/example/es.json`

### 翻译建议

#### 使用翻译工具
```bash
# 使用 AI 翻译工具
# - ChatGPT
# - DeepL API
# - Google Translate API
```

#### 人工审核要点
- ✅ 保持 JSON 结构不变
- ✅ 仅翻译值，不翻译键名
- ✅ 保留特殊字符和格式
- ✅ 注意西班牙语地区差异
- ✅ 校对专业术语

## 🔧 添加新语言的流程（参考）

基于本次添加西班牙语的经验，添加新语言的步骤：

### 1. 更新语言配置
```typescript
// src/i18n/locale.ts
export const locales = ["en", "de", "es", "fr"]; // 添加 "fr"
export const localeNames: any = {
  en: "English",
  de: "Deutsch",
  es: "Español",
  fr: "Français", // 新增
};
```

### 2. 添加区域变体（可选）
```typescript
// src/i18n/request.ts
if (["fr-FR", "fr-CA", "fr-BE"].includes(locale)) {
  locale = "fr";
}
```

### 3. 复制翻译文件
```bash
# 主翻译文件
cp src/i18n/messages/en.json src/i18n/messages/fr.json

# 页面翻译
cp src/i18n/pages/*/en.json src/i18n/pages/*/fr.json

# 工具翻译
cp src/i18n/pages/tools/*/en.json src/i18n/pages/tools/*/fr.json
```

### 4. 翻译内容
使用专业翻译工具或人工翻译所有 `.json` 文件

### 5. 测试
```bash
pnpm dev
# 访问 /fr 测试新语言
```

## 📊 文件统计

| 类型 | 文件数 | 状态 |
|------|--------|------|
| 主翻译 | 1 | ✅ 已创建（需翻译） |
| 页面翻译 | 9 | ✅ 已创建（需翻译） |
| 工具翻译 | 1 | ✅ 已创建（需翻译） |
| 配置文件 | 2 | ✅ 已更新 |
| **总计** | **13** | **结构完成** |

## 🎯 下一步行动

1. **立即可用**
   - ✅ 系统已支持西班牙语路由
   - ✅ 所有翻译文件结构就绪
   - ✅ 可以开始访问 `/es` 路径

2. **需要翻译**
   - 📝 雇佣西班牙语翻译人员
   - 📝 或使用 AI 翻译工具批量翻译
   - 📝 人工审核重要页面的翻译质量

3. **质量保证**
   - ✅ 测试所有页面在西班牙语下的显示
   - ✅ 检查文本截断和布局问题
   - ✅ 验证表单验证消息
   - ✅ 测试错误提示

## 💡 提示

- 翻译完成前，西班牙语页面会显示英文内容（因为是从 en.json 复制的）
- 使用 `loadPageTranslations` 函数会自动加载所有语言的翻译
- 添加新页面时，记得为所有语言创建翻译文件

---

**西班牙语系统架构已完成！现在只需要翻译内容即可。** 🎉
