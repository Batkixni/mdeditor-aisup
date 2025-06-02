## 歡迎使用Markdown編輯器

這個應用程式讓您可以輕鬆創建和管理Markdown格式的文件。以下是主要功能介紹：

### 主要功能

1. **Markdown編輯與預覽**
   - 左側是編輯區，右側是即時預覽區
   - 當您在左側編輯時，右側會自動更新顯示渲染後的結果

2. **文章管理**
   - 可以創建、保存、載入和刪除文章
   - 所有文章都會保存在瀏覽器的localStorage中
   - 使用左側面板管理您的文章

3. **AI寫作助手**
   - 在左側面板下方可以找到AI功能區塊
   - 需要設定API端點、API金鑰和模型名稱
   - 設定完成後可以輸入提示詞生成內容
   - 生成的內容會自動插入到編輯器中
   - 可以連線到各種OpenAI API服務，如[OpenAI](https://platform.openai.com/docs/api-reference/introduction)、[Gemini](https://ai.google.dev/gemini-api/docs/openai)、[Claude](https://docs.anthropic.com/zh-TW/api/openai-sdk)、[Mistral](https://docs.mistral.ai/getting-started/quickstart/)等
   - 可以使用各種不同的模型，詳情參照各AI模型提供商的官方文檔 (例: [Gemini](https://ai.google.dev/gemini-api/docs/models)、[Mistral](https://docs.mistral.ai/getting-started/models/models_overview/))

### 基本使用教學

1. **創建新文章**
   - 點擊左側面板頂部的「新增」按鈕
   - 在編輯區輸入您的Markdown內容
   - 點擊頂部的「儲存」按鈕保存文章

2. **編輯現有文章**
   - 在左側面板點擊要編輯的文章
   - 內容會載入到編輯區
   - 修改後自動保存到localStorage

3. **使用AI功能**
   - 在左側面板下方填寫API設定
   > 以 [Mistral AI](https://docs.mistral.ai/getting-started/quickstart/) 為例：

   ```
   API端點: https://api.mistral.ai 
   API金鑰: YOUR_API_KEY
   模型名稱: mistral-7b-instruct
   ```
   
   - 點擊「應用設定」保存
   - 輸入提示詞後點擊「生成內容」
   - 生成的內容會自動插入到編輯器

4. **導出內容**
   - 點擊頂部的「導出為.MD」可以導出已經寫好的文章至本機

### 注意事項

- 所有數據都保存在瀏覽器的localStorage中
- 清除瀏覽器快取會導致所有文章丟失
- 建議定期備份重要文章

### 工具欄說明

頂部工具欄提供常用的Markdown格式快捷按鈕：
- 粗體、斜體
- 標題、連結、圖片
- 程式碼區塊、列表
- 引用

### 主題切換

可以在頂部右側切換深色/淺色主題。

### 開始使用