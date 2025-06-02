document.addEventListener('DOMContentLoaded', function() {
    const editor = document.getElementById('editor');
    const preview = document.getElementById('preview');
    const saveBtn = document.getElementById('saveBtn');
    const articlesList = document.getElementById('articlesList');
    const searchInput = document.getElementById('searchInput');
    const newArticleBtn = document.getElementById('newArticleBtn');
    const themeToggle = document.getElementById('themeToggle');
    const articleCount = document.getElementById('articleCount');

    // 初始化marked
    marked.setOptions({
        highlight: function(code, lang) {
            if (lang && hljs.getLanguage(lang)) {
                return hljs.highlight(code, { language: lang }).value;
            }
            return hljs.highlightAuto(code).value;
        },
        breaks: true,
        gfm: true
    });

    // 實時預覽
    editor.addEventListener('input', function() {
        try {
            preview.innerHTML = marked.parse(editor.value);
            saveToLocalDraft();
            // 重新渲染代碼高亮
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
        } catch (e) {
            console.error('Markdown rendering error:', e);
            preview.innerHTML = '<div class="text-error">Markdown渲染錯誤，請檢查您的語法。</div>';
        }
    });

    // 初始化預覽
    if (editor.value) {
        try {
            preview.innerHTML = marked.parse(editor.value);
            // 重新渲染代碼高亮
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
        } catch (e) {
            console.error('Initial markdown rendering error:', e);
        }
    }

    // 保存草稿到localStorage
    function saveToLocalDraft() {
        localStorage.setItem('markdownDraft', editor.value);
    }

    // 載入草稿
    function loadDraft() {
        const draft = localStorage.getItem('markdownDraft');
        if (draft) {
            editor.value = draft;
            try {
                preview.innerHTML = marked.parse(draft);
                // 重新渲染代碼高亮
                document.querySelectorAll('pre code').forEach((block) => {
                    hljs.highlightElement(block);
                });
            } catch (e) {
                console.error('Draft loading error:', e);
            }
        }
    }

// 載入已保存的文章
function loadArticles() {
    let articles = JSON.parse(localStorage.getItem('markdownArticles')) || [];

    // 如果沒有文章，添加預設的ReadMe文章
    if (articles.length === 0) {
        const now = new Date();
        articles = [{
            title: "ReadMe - 使用說明",
            content: `# Markdown編輯器使用說明

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
   - 可以連線到各種OpenAI API服務，如[OpenAI](https://platform.openai.com/docs/api-reference/introduction)、[Gemini](https://ai.google.dev/gemini-api/docs/openai)、 [Claude](https://docs.anthropic.com/zh-TW/api/openai-sdk)、[Mistral](https://docs.mistral.ai/getting-started/quickstart/)等
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
   \`\`\`
   API端點: https://api.mistral.ai 
   API金鑰: YOUR_API_KEY
   模型名稱: mistral-7b-instruct
   \`\`\`
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

現在您可以刪除這個預設文章，開始撰寫您自己的Markdown文章了！
`,
            date: now.toISOString(),
            lastModified: now.toISOString()
        }];

        localStorage.setItem('markdownArticles', JSON.stringify(articles));
    }
        articlesList.innerHTML = '';
        articleCount.textContent = articles.length;

        articles.forEach((article, index) => {
            const date = article.date ? new Date(article.date).toLocaleDateString() : '未知日期';
            const articleItem = document.createElement('div');
            articleItem.className = 'article-item';
            articleItem.dataset.index = index;
            articleItem.innerHTML = `
                <div class="flex flex-col w-full">
                    <div class="flex justify-between items-center w-full">
                        <h3 class="truncate">${article.title}</h3>
                        <div class="article-actions flex space-x-1">
                            <button class="btn btn-xs btn-ghost btn-circle" onclick="event.stopPropagation(); loadArticle(${index})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-xs btn-ghost btn-circle" onclick="event.stopPropagation(); deleteArticle(${index})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="article-date mt-1">${date}</div>
                </div>
            `;
            articleItem.addEventListener('click', () => loadArticle(index));
            articlesList.appendChild(articleItem);
        });
    }

    // 搜尋文章
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const articles = JSON.parse(localStorage.getItem('markdownArticles')) || [];
        const filteredArticles = articles.filter(article => 
            article.title.toLowerCase().includes(searchTerm) || 
            article.content.toLowerCase().includes(searchTerm)
        );

        articlesList.innerHTML = '';
        
        if (filteredArticles.length === 0) {
            articlesList.innerHTML = `
                <div class="text-center py-4 text-base-content text-opacity-60">
                    <i class="fas fa-search mb-2 text-2xl"></i>
                    <p>找不到符合「${searchTerm}」的文章</p>
                </div>
            `;
            return;
        }

        filteredArticles.forEach((article, index) => {
            const originalIndex = articles.findIndex(a => a.title === article.title && a.content === article.content);
            const date = article.date ? new Date(article.date).toLocaleDateString() : '未知日期';
            const articleItem = document.createElement('div');
            articleItem.className = 'article-item';
            articleItem.dataset.index = originalIndex;
            articleItem.innerHTML = `
                <div class="flex flex-col w-full">
                    <div class="flex justify-between items-center w-full">
                        <h3 class="truncate">${article.title}</h3>
                        <div class="article-actions flex space-x-1">
                            <button class="btn btn-xs btn-ghost btn-circle" onclick="event.stopPropagation(); loadArticle(${originalIndex})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-xs btn-ghost btn-circle" onclick="event.stopPropagation(); deleteArticle(${originalIndex})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="article-date mt-1">${date}</div>
                </div>
            `;
            articleItem.addEventListener('click', () => loadArticle(originalIndex));
            articlesList.appendChild(articleItem);
        });
    });

    // 儲存文章
    saveBtn.addEventListener('click', function() {
        const title = prompt('請輸入文章標題:');
        if (title) {
            const content = editor.value;
            const articles = JSON.parse(localStorage.getItem('markdownArticles')) || [];
            const now = new Date();
            
            articles.push({ 
                title, 
                content, 
                date: now.toISOString(),
                lastModified: now.toISOString()
            });
            
            localStorage.setItem('markdownArticles', JSON.stringify(articles));
            loadArticles();
            
            // 顯示通知
            showToast(`文章「${title}」已成功儲存！`, 'success');
        }
    });

    // 新增文章
    newArticleBtn.addEventListener('click', function() {
        if (editor.value.trim() !== '' && !confirm('編輯器中有未儲存的內容，確定要開始新文章嗎？')) {
            return;
        }
        editor.value = '';
        preview.innerHTML = '';
        localStorage.removeItem('markdownDraft');
        // 移除所有文章的active狀態
        document.querySelectorAll('.article-item').forEach(item => {
            item.classList.remove('active');
        });
    });

    // 載入文章
    window.loadArticle = function(index) {
        const articles = JSON.parse(localStorage.getItem('markdownArticles')) || [];
        if (articles[index]) {
            editor.value = articles[index].content;
            try {
                preview.innerHTML = marked.parse(articles[index].content);
                // 重新渲染代碼高亮
                document.querySelectorAll('pre code').forEach((block) => {
                    hljs.highlightElement(block);
                });
            } catch (e) {
                console.error('Article loading error:', e);
            }
            
            // 設置active狀態
            document.querySelectorAll('.article-item').forEach(item => {
                item.classList.remove('active');
                if (parseInt(item.dataset.index) === index) {
                    item.classList.add('active');
                }
            });
            
            // 在手機版上自動關閉抽屜
            if (window.innerWidth < 1024) {
                document.getElementById('my-drawer').checked = false;
            }
        }
    };

    // 刪除文章
    window.deleteArticle = function(index) {
        const articles = JSON.parse(localStorage.getItem('markdownArticles')) || [];
        if (articles[index] && confirm(`確定要刪除「${articles[index].title}」嗎？`)) {
            articles.splice(index, 1);
            localStorage.setItem('markdownArticles', JSON.stringify(articles));
            loadArticles();
            
            // 顯示通知
            showToast('文章已刪除', 'error');
        }
    };

    // 插入Markdown語法
    window.insertMarkdown = function(before, after) {
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const selectedText = editor.value.substring(start, end);
        const replacement = before + selectedText + after;
        editor.value = editor.value.substring(0, start) + replacement + editor.value.substring(end);
        
        try {
            preview.innerHTML = marked.parse(editor.value);
            // 重新渲染代碼高亮
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
        } catch (e) {
            console.error('Markdown insertion error:', e);
        }
        
        saveToLocalDraft();
        
        // 重新設置光標位置
        editor.focus();
        if (selectedText.length > 0) {
            editor.selectionStart = start + before.length;
            editor.selectionEnd = end + before.length;
        } else {
            editor.selectionStart = start + before.length;
            editor.selectionEnd = start + before.length;
        }
    };

    // 主題切換
    themeToggle.addEventListener('click', function() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // 更新圖標
        const icon = themeToggle.querySelector('i');
        if (newTheme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });

    // 載入保存的主題
    function loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        // 設置正確的圖標
        const icon = themeToggle.querySelector('i');
        if (savedTheme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }

    // 初始化
    const openApiBtn = document.getElementById('openApiBtn');
    const openApiModal = document.getElementById('openapi-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const generateDocsBtn = document.getElementById('generate-docs-btn');
    const tabInput = document.getElementById('tab-input');
    const tabUpload = document.getElementById('tab-upload');
    const tabUrl = document.getElementById('tab-url');
    const inputContainer = document.getElementById('input-container');
    const uploadContainer = document.getElementById('upload-container');
    const urlContainer = document.getElementById('url-container');
    
    // 打開OpenAPI模態框
    if (openApiBtn) {
        openApiBtn.addEventListener('click', function() {
            openApiModal.showModal();
        });
    }
    
    // 關閉模態框
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            openApiModal.close();
        });
    }
    
    // 標籤切換
    if (tabInput && tabUpload && tabUrl) {
        tabInput.addEventListener('click', function() {
            tabInput.classList.add('tab-active');
            tabUpload.classList.remove('tab-active');
            tabUrl.classList.remove('tab-active');
            inputContainer.classList.remove('hidden');
            uploadContainer.classList.add('hidden');
            urlContainer.classList.add('hidden');
        });
        
        tabUpload.addEventListener('click', function() {
            tabInput.classList.remove('tab-active');
            tabUpload.classList.add('tab-active');
            tabUrl.classList.remove('tab-active');
            inputContainer.classList.add('hidden');
            uploadContainer.classList.remove('hidden');
            urlContainer.classList.add('hidden');
        });
        
        tabUrl.addEventListener('click', function() {
            tabInput.classList.remove('tab-active');
            tabUpload.classList.remove('tab-active');
            tabUrl.classList.add('tab-active');
            inputContainer.classList.add('hidden');
            uploadContainer.classList.add('hidden');
            urlContainer.classList.remove('hidden');
        });
    }
    
    // 處理文件上傳
    const openApiFile = document.getElementById('openapi-file');
    if (openApiFile) {
        openApiFile.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('openapi-input').value = e.target.result;
                tabInput.click(); // 切換到輸入標籤
            };
            reader.readAsText(file);
        });
    }
    
    // 從URL獲取OpenAPI規範
    const openApiUrl = document.getElementById('openapi-url');
    if (openApiUrl) {
        openApiUrl.addEventListener('change', async function() {
            const url = this.value.trim();
            if (!url) return;
            
            try {
                const response = await fetch(url);
                const text = await response.text();
                document.getElementById('openapi-input').value = text;
                tabInput.click(); // 切換到輸入標籤
                
                // 顯示成功通知
                showToast('成功從URL獲取OpenAPI規範', 'success');
            } catch (error) {
                console.error('獲取OpenAPI規範失敗:', error);
                showToast('獲取OpenAPI規範失敗: ' + error.message, 'error');
            }
        });
    }
    
    // 生成文檔
    if (generateDocsBtn) {
        generateDocsBtn.addEventListener('click', async function() {
            const openApiInput = document.getElementById('openapi-input').value.trim();
            const aiPrompt = document.getElementById('ai-prompt').value.trim();
            
            if (!openApiInput) {
                showToast('請輸入OpenAPI規範', 'error');
                return;
            }
            
            try {
                // 顯示加載中
                generateDocsBtn.classList.add('loading');
                generateDocsBtn.disabled = true;
                
                // 解析OpenAPI規範
                let spec;
                try {
                    // 嘗試解析為JSON
                    spec = JSON.parse(openApiInput);
                } catch (e) {
                    // 如果不是JSON，嘗試解析為YAML
                    try {
                        spec = jsyaml.load(openApiInput);
                    } catch (yamlError) {
                        throw new Error('無法解析OpenAPI規範，請確保格式正確 (JSON或YAML)');
                    }
                }
                
                // 驗證OpenAPI規範
                if (!spec || !spec.openapi && !spec.swagger) {
                    throw new Error('無效的OpenAPI規範，缺少openapi或swagger版本信息');
                }
                
                // 使用widdershins將OpenAPI轉換為Markdown
                let markdown = await convertOpenApiToMarkdown(spec);
                
                // 如果有AI提示，使用AI增強文檔
                if (aiPrompt) {
                    markdown = await enhanceDocumentationWithAI(markdown, spec, aiPrompt);
                }
                
                // 將生成的Markdown插入編輯器
                insertToEditor(markdown);
                
                // 關閉模態框
                openApiModal.close();
                
                // 顯示成功通知
                showToast('API文檔生成成功！', 'success');
            } catch (error) {
                console.error('生成文檔失敗:', error);
                showToast('生成文檔失敗: ' + error.message, 'error');
            } finally {
                generateDocsBtn.classList.remove('loading');
                generateDocsBtn.disabled = false;
            }
        });
    }
    
    // 將OpenAPI規範轉換為Markdown
    async function convertOpenApiToMarkdown(spec) {
        // 這裡使用簡單的轉換邏輯，實際項目中可以使用更複雜的轉換
        let markdown = `# ${spec.info.title || 'API文檔'}\n\n`;
        
        // 添加API描述
        if (spec.info.description) {
            markdown += `${spec.info.description}\n\n`;
        }
        
        // 添加版本信息
        if (spec.info.version) {
            markdown += `**版本:** ${spec.info.version}\n\n`;
        }
        
        // 添加服務器信息
        if (spec.servers && spec.servers.length > 0) {
            markdown += `## 服務器\n\n`;
            spec.servers.forEach(server => {
                markdown += `* ${server.url} - ${server.description || ''}\n`;
            });
            markdown += '\n';
        }
        
        // 添加路徑信息
        if (spec.paths) {
            markdown += `## API端點\n\n`;
            
            for (const [path, methods] of Object.entries(spec.paths)) {
                for (const [method, operation] of Object.entries(methods)) {
                    if (['get', 'post', 'put', 'delete', 'patch'].includes(method)) {
                        markdown += `### ${method.toUpperCase()} ${path}\n\n`;
                        
                        if (operation.summary) {
                            markdown += `**摘要:** ${operation.summary}\n\n`;
                        }
                        
                        if (operation.description) {
                            markdown += `${operation.description}\n\n`;
                        }
                        
                        // 添加參數信息
                        if (operation.parameters && operation.parameters.length > 0) {
                            markdown += `#### 參數\n\n`;
                            markdown += `| 名稱 | 位置 | 描述 | 必填 | 類型 |\n`;
                            markdown += `| ---- | ------ | ----------- | -------- | ---- |\n`;
                            
                            operation.parameters.forEach(param => {
                                markdown += `| ${param.name} | ${param.in} | ${param.description || ''} | ${param.required ? '是' : '否'} | ${param.schema?.type || ''} |\n`;
                            });
                            
                            markdown += '\n';
                        }
                        
                        // 添加請求體信息
                        if (operation.requestBody) {
                            markdown += `#### 請求體\n\n`;
                            
                            const content = operation.requestBody.content;
                            if (content) {
                                for (const [mediaType, mediaTypeObj] of Object.entries(content)) {
                                    markdown += `**媒體類型:** \`${mediaType}\`\n\n`;
                                    
                                    if (mediaTypeObj.schema) {
                                        markdown += `\`\`\`json\n${JSON.stringify(mediaTypeObj.schema, null, 2)}\n\`\`\`\n\n`;
                                    }
                                }
                            }
                        }
                        
                        // 添加響應信息
                        if (operation.responses) {
                            markdown += `#### 響應\n\n`;
                            
                            for (const [statusCode, response] of Object.entries(operation.responses)) {
                                markdown += `**狀態碼:** ${statusCode}\n\n`;
                                
                                if (response.description) {
                                    markdown += `${response.description}\n\n`;
                                }
                                
                                if (response.content) {
                                    for (const [mediaType, mediaTypeObj] of Object.entries(response.content)) {
                                        markdown += `**媒體類型:** \`${mediaType}\`\n\n`;
                                        
                                        if (mediaTypeObj.schema) {
                                            markdown += `\`\`\`json\n${JSON.stringify(mediaTypeObj.schema, null, 2)}\n\`\`\`\n\n`;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        
        return markdown;
    }
    
    // 使用AI增強文檔
    async function enhanceDocumentationWithAI(markdown, spec, prompt) {
        // 這裡可以集成OpenAI或其他AI服務
        // 由於API密鑰和安全性問題，這裡只提供一個模擬實現
        
        // 在實際項目中，您需要使用真實的AI API
        // 例如：
        /*
        const openai = new OpenAI({
            apiKey: 'your-api-key'
        });
        
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "你是一個專業的API文檔編寫助手。你的任務是根據提供的OpenAPI規範和Markdown文檔，按照用戶的要求優化和增強文檔。"
                },
                {
                    role: "user",
                    content: `根據以下OpenAPI規範和初步生成的Markdown文檔，${prompt}\n\nOpenAPI規範：${JSON.stringify(spec)}\n\nMarkdown文檔：${markdown}`
                }
            ]
        });
        
        return response.choices[0].message.content;
        */
        
        // 模擬AI增強
        // 在沒有實際AI API的情況下，我們只是添加一個提示說明
        return `${markdown}

---

> 📝 **AI輔助說明**
> 
> 根據您的提示「${prompt}」，這個文檔可以進一步優化。在實際實現中，這裡會使用OpenAI或其他AI服務來增強文檔內容。
`;
    }
    
    // AI功能初始化
    initAIFeatures();
    
    // 初始化
    loadTheme();
    loadDraft();
    loadArticles();

    // 添加導出功能
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            const content = editor.value;
            if (!content || content.trim() === '') {
                showToast('編輯器內容為空，無法導出', 'error');
                return;
            }

            // 創建Blob對象
            const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });

            // 創建下載連結
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'markdown-export-' + new Date().toISOString().slice(0, 10) + '.md';
            document.body.appendChild(a);
            a.click();

            // 清理
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 0);

            showToast('文件導出成功！', 'success');
        });
    }
});

// 全局AI設定變數
let aiApiEndpoint = localStorage.getItem('aiApiEndpoint') || '';
let aiApiKey = localStorage.getItem('aiApiKey') || '';
let aiModelName = localStorage.getItem('aiModelName') || '';

// 顯示通知函數
function showToast(message, type = 'info') {
    // 限制消息长度，防止溢出
    if (message.length > 100) {
        message = message.substring(0, 97) + '...';
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast toast-top toast-end';
    
    let icon = 'fa-info-circle';
    let alertClass = 'alert-info';
    
    if (type === 'success') {
        icon = 'fa-check-circle';
        alertClass = 'alert-success';
    } else if (type === 'error') {
        icon = 'fa-exclamation-circle';
        alertClass = 'alert-error';
    } else if (type === 'warning') {
        icon = 'fa-exclamation-triangle';
        alertClass = 'alert-warning';
    }
    
    toast.innerHTML = `
        <div class="alert ${alertClass}">
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// 將Markdown插入編輯器
function insertToEditor(markdown) {
    const editor = document.getElementById('editor');
    const preview = document.getElementById('preview');
    
    if (!editor || !preview) {
        console.error('插入編輯器失敗：找不到編輯器或預覽元素');
        return;
    }
    
    // 獲取當前光標位置
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    
    // 插入Markdown
    editor.value = editor.value.substring(0, start) + markdown + editor.value.substring(end);
    
    // 更新預覽
    try {
        preview.innerHTML = marked.parse(editor.value);
        // 重新渲染代碼高亮
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
    } catch (e) {
        console.error('Markdown rendering error:', e);
    }
    
    // 保存到本地草稿
    localStorage.setItem('markdownDraft', editor.value);
}

// AI功能初始化
function initAIFeatures() {
    const aiApiEndpointInput = document.getElementById('ai-api-endpoint');
    const aiApiKeyInput = document.getElementById('ai-api-key');
    const aiModelNameInput = document.getElementById('ai-model-name');
    const saveAiSettingsBtn = document.getElementById('save-ai-settings-btn');
    const aiPromptInput = document.getElementById('ai-prompt-input');
    const generateAiContentBtn = document.getElementById('generate-ai-content-btn');
    
    // 檢查元素是否存在
    if (!aiApiEndpointInput || !aiApiKeyInput || !aiModelNameInput || !saveAiSettingsBtn || !aiPromptInput || !generateAiContentBtn) {
        console.error('AI功能初始化失敗：缺少必要的HTML元素');
        return;
    }

    // 載入已保存的設定
    aiApiEndpointInput.value = aiApiEndpoint;
    aiApiKeyInput.value = aiApiKey;
    aiModelNameInput.value = aiModelName;

    // 保存AI設定
    saveAiSettingsBtn.addEventListener('click', function() {
        const endpoint = aiApiEndpointInput.value.trim();
        const apiKey = aiApiKeyInput.value.trim();
        const modelName = aiModelNameInput.value.trim();
        
        if (!endpoint || !apiKey || !modelName) {
            showToast('請填寫所有必填欄位', 'error');
            return;
        }
        
        // 保存設定
        aiApiEndpoint = endpoint;
        aiApiKey = apiKey;
        aiModelName = modelName;
        
        localStorage.setItem('aiApiEndpoint', aiApiEndpoint);
        localStorage.setItem('aiApiKey', aiApiKey);
        localStorage.setItem('aiModelName', aiModelName);
        
        showToast('AI設定已保存', 'success');
    });

    // 生成AI內容
    generateAiContentBtn.addEventListener('click', async function() {
        const prompt = aiPromptInput.value.trim();
        
        if (!prompt) {
            showToast('請輸入提示詞', 'error');
            return;
        }
        
        if (!aiApiEndpoint || !aiApiKey || !aiModelName) {
            showToast('請先設定AI API並應用設定', 'error');
            return;
        }
        
        try {
            // 顯示加載中
            generateAiContentBtn.classList.add('loading');
            generateAiContentBtn.disabled = true;
            
            // 調用AI API生成內容
            const content = await generateAiContent(prompt);
            
            // 將生成的內容插入編輯器
            insertToEditor(content);
            
            // 清空提示詞輸入框
            aiPromptInput.value = '';
            
            // 顯示成功通知
            showToast('AI內容生成成功！', 'success');
        } catch (error) {
            console.error('生成AI內容失敗:', error);
            showToast('生成AI內容失敗: ' + error.message, 'error');
        } finally {
            generateAiContentBtn.classList.remove('loading');
            generateAiContentBtn.disabled = false;
        }
    });
}

// 調用AI API生成內容
async function generateAiContent(prompt) {
    try {
        // 檢查API端點格式
        if (!aiApiEndpoint.startsWith('http')) {
            aiApiEndpoint = 'https://' + aiApiEndpoint;
        }
        
        // 移除尾部斜線
        aiApiEndpoint = aiApiEndpoint.replace(/\/$/, '');
        
        // 確定正確的API路徑
        let apiPath = '/chat/completions';
        
        // 檢查是否為OpenAI兼容API
        if (aiApiEndpoint.includes('openai.com')) {
            apiPath = '/v1/chat/completions';
        } else if (aiApiEndpoint.includes('mistral.ai')) {
            apiPath = '/v1/chat/completions';
        } else if (!aiApiEndpoint.endsWith('/v1')) {
            // 如果端點不以/v1結尾，則添加/v1
            if (!aiApiEndpoint.endsWith('/')) {
                aiApiEndpoint += '/';
            }
            aiApiEndpoint += 'v1';
        }
        
        // 構建完整的API URL
        const apiUrl = `${aiApiEndpoint}${apiPath}`;
        
        // 準備請求數據
        const requestData = {
            model: aiModelName,
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7
        };
        
        // 發送API請求
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${aiApiKey}`
            },
            body: JSON.stringify(requestData)
        });
        
        // 檢查響應狀態
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `API請求失敗: ${response.status} ${response.statusText}`);
        }
        
        // 解析響應數據
        const data = await response.json();
        
        // Check for API-specific error structure in the response body (even with HTTP 200 OK)
        if (data.error && data.error.message) {
            throw new Error(`API錯誤: ${data.error.message}${data.error.type ? ' (類型: ' + data.error.type + ')' : ''}`);
        }

        // Standard OpenAI/Mistral-like response structure
        const generatedContent = data.choices?.[0]?.message?.content;

        if (!generatedContent) {
            let specificError = 'API返回的內容為空或結構不符期望';
            if (data.choices === undefined) {
                specificError = 'API回應中缺少 "choices" 欄位';
            } else if (!Array.isArray(data.choices)) {
                specificError = 'API回應中 "choices" 欄位不是一個陣列';
            } else if (data.choices.length === 0) {
                specificError = 'API回應中 "choices" 陣列為空';
            } else if (data.choices[0].message === undefined) {
                specificError = 'API回應的 "choices" 首個元素中缺少 "message" 欄位';
            } else if (data.choices[0].message.content === undefined) {
                specificError = 'API回應的 "choices" 首個元素中 "message" 物件缺少 "content" 欄位';
            }
            // You can add more specific checks here based on expected response structures
            // For example, log the actual data structure for debugging if it's unexpected
            console.error('Unexpected API response structure:', data);
            throw new Error(specificError);
        }
        
        return generatedContent;
    } catch (error) {
        console.error('AI API調用失敗:', error);
        throw error;
    }
}
