class DocumentManager {
    constructor() {
        this.documents = this.loadDocuments();
        this.currentDocument = null;
        this.filteredDocs = this.documents;
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.uploadedFiles = []; // 存储上传的文件信息
        
        this.initializeApp();
        this.bindEvents();
        this.applyTheme();
        this.initializeDecorations();
    }

    // 初始化应用
    initializeApp() {
        this.renderDocumentList();
        this.renderCategories();
        this.renderTags();
        this.renderRecentDocuments();
    }

    // 绑定事件
    bindEvents() {
        // 搜索功能
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        
        searchInput.addEventListener('input', () => this.handleSearch());
        searchBtn.addEventListener('click', () => this.handleSearch());
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });

        // 主题切换
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

        // 返回按钮
        document.getElementById('backBtn').addEventListener('click', () => this.showDocumentList());

        // 编辑相关
        document.getElementById('editBtn').addEventListener('click', () => this.showEditDocModal());
        document.querySelector('.close-edit').addEventListener('click', () => this.hideEditDocModal());
        document.getElementById('cancelEditBtn').addEventListener('click', () => this.hideEditDocModal());
        document.getElementById('editDocForm').addEventListener('submit', (e) => this.handleEditDocument(e));

        // 添加文档相关
        document.getElementById('addDocBtn').addEventListener('click', () => this.showAddDocModal());
        document.querySelector('.close').addEventListener('click', () => this.hideAddDocModal());
        document.getElementById('addDocForm').addEventListener('submit', (e) => this.handleAddDocument(e));

        // 输入方式切换
        const inputTypeRadios = document.querySelectorAll('input[name="inputType"]');
        inputTypeRadios.forEach(radio => {
            radio.addEventListener('change', () => this.toggleInputType());
        });

        // 文件上传
        document.getElementById('mdFileInput').addEventListener('change', (e) => this.handleFileUpload(e));

        // 点击模态框外部关闭
        document.getElementById('addDocModal').addEventListener('click', (e) => {
            if (e.target.id === 'addDocModal') {
                this.hideAddDocModal();
            }
        });

        // 点击编辑模态框外部关闭
        document.getElementById('editDocModal').addEventListener('click', (e) => {
            if (e.target.id === 'editDocModal') {
                this.hideEditDocModal();
            }
        });

        // 分类点击事件
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-category]')) {
                e.preventDefault();
                this.filterByCategory(e.target.dataset.category);
            }
            if (e.target.matches('.tag')) {
                this.filterByTag(e.target.textContent);
            }
            if (e.target.matches('.doc-item') || e.target.closest('.doc-item')) {
                const docItem = e.target.closest('.doc-item');
                const docId = docItem.dataset.docId;
                this.showDocument(docId);
            }
        });
    }

    // 加载文档数据
    loadDocuments() {
        const defaultDocs = [
            {
                id: '1',
                title: 'JavaScript 高级技巧',
                category: '技术笔记',
                tags: ['JavaScript', '前端', '高级'],
                content: `# JavaScript 高级技巧

## 1. 闭包的实际应用

闭包是 JavaScript 中一个重要的概念，它允许函数访问其外部作用域的变量。

\`\`\`javascript
function createCounter() {
    let count = 0;
    return function() {
        return ++count;
    };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
\`\`\`

## 2. 防抖与节流

### 防抖 (Debounce)
\`\`\`javascript
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
\`\`\`

### 节流 (Throttle)
\`\`\`javascript
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}
\`\`\`

## 3. Promise 链式调用优化

使用 async/await 让异步代码更优雅：

\`\`\`javascript
// 传统 Promise 链
fetchUser()
    .then(user => fetchPosts(user.id))
    .then(posts => renderPosts(posts))
    .catch(error => handleError(error));

// 使用 async/await
async function loadUserPosts() {
    try {
        const user = await fetchUser();
        const posts = await fetchPosts(user.id);
        renderPosts(posts);
    } catch (error) {
        handleError(error);
    }
}
\`\`\`

这些技巧在实际项目开发中非常有用！`,
                createdAt: new Date('2024-01-15'),
                updatedAt: new Date('2024-01-15')
            },
            {
                id: '2',
                title: 'React Hooks 学习笔记',
                category: '学习心得',
                tags: ['React', 'Hooks', '前端框架'],
                content: `# React Hooks 学习心得

## useState 基础用法

\`\`\`jsx
import React, { useState } from 'react';

function Counter() {
    const [count, setCount] = useState(0);
    
    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>
                Click me
            </button>
        </div>
    );
}
\`\`\`

## useEffect 生命周期

\`\`\`jsx
useEffect(() => {
    // 组件挂载后执行
    document.title = \`You clicked \${count} times\`;
    
    // 清理函数（组件卸载时执行）
    return () => {
        document.title = 'React App';
    };
}, [count]); // 依赖数组
\`\`\`

## 自定义 Hook

\`\`\`jsx
function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            setStoredValue(value);
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
}
\`\`\`

Hooks 让函数组件拥有了类组件的能力，同时代码更简洁！`,
                createdAt: new Date('2024-01-10'),
                updatedAt: new Date('2024-01-12')
            },
            {
                id: '3',
                title: 'CSS Grid 布局完全指南',
                category: '技术笔记',
                tags: ['CSS', '布局', '响应式'],
                content: `# CSS Grid 布局完全指南

## 基础概念

CSS Grid 是一个二维布局系统，非常适合创建复杂的网页布局。

\`\`\`css
.container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto;
    gap: 1rem;
}
\`\`\`

## 网格项目定位

\`\`\`css
.item1 {
    grid-column: 1 / 3;
    grid-row: 1;
}

.item2 {
    grid-column: 3;
    grid-row: 1 / 3;
}
\`\`\`

## 响应式网格

\`\`\`css
.responsive-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
}
\`\`\`

## 网格区域

\`\`\`css
.layout {
    display: grid;
    grid-template-areas: 
        "header header header"
        "sidebar main main"
        "footer footer footer";
    grid-template-columns: 200px 1fr 1fr;
    grid-template-rows: auto 1fr auto;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
\`\`\`

Grid 布局为现代网页设计提供了强大的工具！`,
                createdAt: new Date('2024-01-08'),
                updatedAt: new Date('2024-01-08')
            }
        ];

        const saved = localStorage.getItem('documents');
        return saved ? JSON.parse(saved) : defaultDocs;
    }

    // 保存文档数据
    saveDocuments() {
        localStorage.setItem('documents', JSON.stringify(this.documents));
    }

    // 渲染文档列表
    renderDocumentList() {
        const docList = document.getElementById('docList');
        const docs = this.filteredDocs;

        if (docs.length === 0) {
            docList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">没有找到匹配的文档</p>';
            return;
        }

        docList.innerHTML = docs.map(doc => `
            <div class="doc-item" data-doc-id="${doc.id}">
                <h3>${doc.title}</h3>
                <div class="doc-meta">
                    <span>📁 ${doc.category}</span>
                    <span>📅 ${this.formatDate(doc.updatedAt)}</span>
                </div>
                <div class="doc-preview">
                    ${this.getPreview(doc.content)}
                </div>
                <div class="doc-tags">
                    ${doc.tags.map(tag => `<span class="doc-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `).join('');
    }

    // 渲染分类列表
    renderCategories() {
        const categoryList = document.getElementById('categoryList');
        const categories = ['全部', ...new Set(this.documents.map(doc => doc.category))];
        
        categoryList.innerHTML = categories.map(category => `
            <li><a href="#" data-category="${category === '全部' ? 'all' : category}" 
                  class="${category === '全部' ? 'active' : ''}">${category}</a></li>
        `).join('');
    }

    // 渲染标签列表
    renderTags() {
        const tagList = document.getElementById('tagList');
        const allTags = this.documents.flatMap(doc => doc.tags);
        const uniqueTags = [...new Set(allTags)];
        
        tagList.innerHTML = uniqueTags.map(tag => `
            <span class="tag">${tag}</span>
        `).join('');
    }

    // 渲染最近更新的文档
    renderRecentDocuments() {
        const recentList = document.getElementById('recentList');
        const recentDocs = [...this.documents]
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .slice(0, 5);
        
        recentList.innerHTML = recentDocs.map(doc => `
            <li><a href="#" onclick="docManager.showDocument('${doc.id}')">${doc.title}</a></li>
        `).join('');
    }

    // 搜索功能
    handleSearch() {
        const query = document.getElementById('searchInput').value.toLowerCase().trim();
        
        if (!query) {
            this.filteredDocs = this.documents;
        } else {
            this.filteredDocs = this.documents.filter(doc => 
                doc.title.toLowerCase().includes(query) ||
                doc.content.toLowerCase().includes(query) ||
                doc.category.toLowerCase().includes(query) ||
                doc.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }
        
        this.renderDocumentList();
    }

    // 按分类筛选
    filterByCategory(category) {
        // 更新分类选中状态
        document.querySelectorAll('[data-category]').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');

        // 筛选文档
        if (category === 'all') {
            this.filteredDocs = this.documents;
        } else {
            this.filteredDocs = this.documents.filter(doc => doc.category === category);
        }
        
        this.renderDocumentList();
    }

    // 按标签筛选
    filterByTag(tag) {
        // 切换标签选中状态
        const tagElement = event.target;
        const isActive = tagElement.classList.contains('active');
        
        // 清除其他标签的选中状态
        document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
        
        if (!isActive) {
            tagElement.classList.add('active');
            this.filteredDocs = this.documents.filter(doc => doc.tags.includes(tag));
        } else {
            this.filteredDocs = this.documents;
        }
        
        this.renderDocumentList();
    }

    // 显示文档内容
    showDocument(docId) {
        const doc = this.documents.find(d => d.id === docId);
        if (!doc) return;

        this.currentDocument = doc;
        const docContent = document.getElementById('docContent');
        const docList = document.getElementById('docList');
        const docBody = document.getElementById('docBody');
        const mainContent = document.querySelector('.main-content');
        const marioDecoration = document.getElementById('marioDecoration');
        const snorlaxDecoration = document.getElementById('snorlaxDecoration');

        // 渲染 Markdown 内容
        docBody.innerHTML = marked.parse(doc.content);
        
        // 高亮代码
        docBody.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightBlock(block);
        });

        // 添加阅读模式类
        mainContent.classList.add('reading-mode');

        // 切换装饰角色
        marioDecoration.classList.add('hidden');
        snorlaxDecoration.classList.remove('hidden');

        // 切换显示
        docList.classList.add('hidden');
        docContent.classList.remove('hidden');
    }

    // 显示文档列表
    showDocumentList() {
        const docContent = document.getElementById('docContent');
        const docList = document.getElementById('docList');
        const mainContent = document.querySelector('.main-content');
        const marioDecoration = document.getElementById('marioDecoration');
        const snorlaxDecoration = document.getElementById('snorlaxDecoration');

        // 移除阅读模式类
        mainContent.classList.remove('reading-mode');

        // 切换装饰角色
        marioDecoration.classList.remove('hidden');
        snorlaxDecoration.classList.add('hidden');

        docContent.classList.add('hidden');
        docList.classList.remove('hidden');
        this.currentDocument = null;
    }

    // 显示添加文档模态框
    showAddDocModal() {
        const modal = document.getElementById('addDocModal');
        modal.classList.remove('hidden');
    }

    // 隐藏添加文档模态框
    hideAddDocModal() {
        const modal = document.getElementById('addDocModal');
        modal.classList.add('hidden');
        document.getElementById('addDocForm').reset();
    }

    // 显示编辑文档模态框
    showEditDocModal() {
        if (!this.currentDocument) return;

        const modal = document.getElementById('editDocModal');
        
        // 填充表单数据
        document.getElementById('editDocTitle').value = this.currentDocument.title;
        document.getElementById('editDocCategory').value = this.currentDocument.category;
        document.getElementById('editDocTags').value = this.currentDocument.tags.join(', ');
        document.getElementById('editDocContentInput').value = this.currentDocument.content;

        modal.classList.remove('hidden');
    }

    // 隐藏编辑文档模态框
    hideEditDocModal() {
        const modal = document.getElementById('editDocModal');
        modal.classList.add('hidden');
        document.getElementById('editDocForm').reset();
    }

    // 处理编辑文档
    handleEditDocument(event) {
        event.preventDefault();
        
        if (!this.currentDocument) return;

        const title = document.getElementById('editDocTitle').value.trim();
        const category = document.getElementById('editDocCategory').value.trim() || '未分类';
        const tags = document.getElementById('editDocTags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
        const content = document.getElementById('editDocContentInput').value.trim();

        if (!title || !content) {
            alert('请填写标题和内容');
            return;
        }

        // 更新文档数据
        const docIndex = this.documents.findIndex(doc => doc.id === this.currentDocument.id);
        if (docIndex !== -1) {
            this.documents[docIndex] = {
                ...this.documents[docIndex],
                title,
                category,
                tags,
                content,
                updatedAt: new Date()
            };

            // 更新当前文档引用
            this.currentDocument = this.documents[docIndex];

            // 保存到localStorage
            this.saveDocuments();
            this.filteredDocs = this.documents;

            // 重新渲染当前文档
            this.renderUpdatedDocument();

            // 更新界面
            this.renderDocumentList();
            this.renderCategories();
            this.renderTags();
            this.renderRecentDocuments();

            this.hideEditDocModal();
            alert('文档更新成功！');
        }
    }

    // 重新渲染更新后的文档
    renderUpdatedDocument() {
        const docBody = document.getElementById('docBody');
        
        // 渲染 Markdown 内容
        docBody.innerHTML = marked.parse(this.currentDocument.content);
        
        // 高亮代码
        docBody.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightBlock(block);
        });
    }

    // 处理添加文档
    handleAddDocument(event) {
        event.preventDefault();
        
        const inputType = document.querySelector('input[name="inputType"]:checked').value;
        
        if (inputType === 'file') {
            // 处理文件上传
            this.handleFileSubmission();
        } else {
            // 处理手动输入
            this.handleManualSubmission();
        }
    }

    // 处理手动输入的文档
    handleManualSubmission() {
        const title = document.getElementById('docTitle').value.trim();
        const category = document.getElementById('docCategory').value.trim() || '未分类';
        const tags = document.getElementById('docTags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
        const content = document.getElementById('docContentInput').value.trim();

        if (!title || !content) {
            alert('请填写标题和内容');
            return;
        }

        const newDoc = {
            id: Date.now().toString(),
            title,
            category,
            tags,
            content,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.addDocumentAndUpdate(newDoc);
    }

    // 处理文件上传的文档
    handleFileSubmission() {
        if (this.uploadedFiles.length === 0) {
            alert('请选择要上传的Markdown文件');
            return;
        }

        const defaultCategory = document.getElementById('docCategory').value.trim() || '导入文档';
        const defaultTags = document.getElementById('docTags').value.split(',').map(tag => tag.trim()).filter(tag => tag);

        this.uploadedFiles.forEach((fileData, index) => {
            // 从文件名提取标题（去掉扩展名）
            const title = document.getElementById('docTitle').value.trim() || 
                         fileData.name.replace(/\.(md|markdown|txt)$/i, '');

            const newDoc = {
                id: (Date.now() + index).toString(),
                title: title,
                category: defaultCategory,
                tags: [...defaultTags], // 复制数组
                content: fileData.content,
                images: fileData.images || [],
                createdAt: new Date(),
                updatedAt: new Date()
            };

            this.documents.unshift(newDoc);
        });

        // 确保图像目录存在
        this.ensureImageDirectory();
        
        // 显示图像处理提示
        if (this.uploadedFiles.some(file => file.images && file.images.length > 0)) {
            const totalImages = this.uploadedFiles.reduce((sum, file) => sum + (file.images?.length || 0), 0);
            alert(`文档导入成功！检测到 ${totalImages} 个图像引用，已自动转换为相对路径。请将相关图像文件放置到 assets/images/ 目录下。`);
        } else {
            alert(`成功导入 ${this.uploadedFiles.length} 个文档！`);
        }

        this.saveDocuments();
        this.filteredDocs = this.documents;
        
        // 更新界面
        this.renderDocumentList();
        this.renderCategories();
        this.renderTags();
        this.renderRecentDocuments();
        
        this.hideAddDocModal();
        
        // 清空上传的文件
        this.uploadedFiles = [];
    }

    // 添加文档并更新界面的通用方法
    addDocumentAndUpdate(newDoc) {
        this.documents.unshift(newDoc);
        this.saveDocuments();
        this.filteredDocs = this.documents;
        
        // 更新界面
        this.renderDocumentList();
        this.renderCategories();
        this.renderTags();
        this.renderRecentDocuments();
        
        this.hideAddDocModal();
        alert('文档添加成功！');
    }

    // 切换输入方式
    toggleInputType() {
        const manualInput = document.getElementById('manualInput');
        const fileInput = document.getElementById('fileInput');
        const inputType = document.querySelector('input[name="inputType"]:checked').value;

        if (inputType === 'manual') {
            manualInput.classList.remove('hidden');
            fileInput.classList.add('hidden');
        } else {
            manualInput.classList.add('hidden');
            fileInput.classList.remove('hidden');
        }
    }

    // 处理文件上传
    handleFileUpload(event) {
        const files = Array.from(event.target.files);
        const filePreview = document.getElementById('filePreview');
        
        if (files.length === 0) {
            filePreview.innerHTML = '';
            this.uploadedFiles = [];
            return;
        }

        filePreview.innerHTML = '<h4>已选择的文件：</h4>';
        this.uploadedFiles = [];

        files.forEach((file, index) => {
            if (file.name.match(/\.(md|markdown|txt)$/i)) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = e.target.result;
                    const processedContent = this.processMarkdownImages(content, file.name);
                    
                    this.uploadedFiles.push({
                        name: file.name,
                        content: processedContent.content,
                        images: processedContent.images,
                        originalContent: content
                    });

                    const fileDiv = document.createElement('div');
                    fileDiv.className = 'file-item';
                    fileDiv.innerHTML = `
                        <div class="file-info">
                            <strong>📄 ${file.name}</strong> (${this.formatFileSize(file.size)})
                            ${processedContent.images.length > 0 ? 
                                `<br><small>包含 ${processedContent.images.length} 个图像引用</small>` : 
                                ''
                            }
                        </div>
                        <div class="file-preview">
                            ${this.getPreview(processedContent.content, 100)}
                        </div>
                    `;
                    filePreview.appendChild(fileDiv);
                };
                reader.readAsText(file);
            } else {
                const fileDiv = document.createElement('div');
                fileDiv.className = 'file-item error';
                fileDiv.innerHTML = `
                    <div class="file-info">
                        <strong>❌ ${file.name}</strong> - 不支持的文件类型
                    </div>
                `;
                filePreview.appendChild(fileDiv);
            }
        });
    }

    // 处理 Markdown 中的图像链接
    processMarkdownImages(content, fileName) {
        const images = [];
        const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
        
        let processedContent = content.replace(imageRegex, (match, alt, src) => {
            // 如果是相对路径或本地文件路径，需要处理
            if (!src.startsWith('http://') && !src.startsWith('https://') && !src.startsWith('data:')) {
                // 提取文件名
                const imageName = src.split('/').pop();
                const newPath = `assets/images/${imageName}`;
                
                images.push({
                    originalPath: src,
                    newPath: newPath,
                    alt: alt,
                    imageName: imageName
                });
                
                return `![${alt}](${newPath})`;
            }
            return match;
        });

        return {
            content: processedContent,
            images: images
        };
    }

    // 格式化文件大小
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // 创建图像存储目录
    ensureImageDirectory() {
        // 在实际应用中，这里可能需要与后端API交互
        // 现在只是在前端标记需要创建的目录
        console.log('确保图像目录存在: assets/images/');
    }

    // 切换主题
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
    }

    // 应用主题
    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
        
        // 更新代码高亮主题
        const highlightTheme = document.getElementById('highlight-theme');
        if (this.currentTheme === 'dark') {
            highlightTheme.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github-dark.min.css';
        } else {
            highlightTheme.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github.min.css';
        }
    }

    // 工具函数：格式化日期
    formatDate(date) {
        const d = new Date(date);
        return d.toLocaleDateString('zh-CN');
    }

    // 工具函数：获取内容预览
    getPreview(content, maxLength = 150) {
        // 移除 Markdown 标记
        const plainText = content
            .replace(/#{1,6}\s+/g, '')
            .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1')
            .replace(/`([^`]+)`/g, '$1')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            .replace(/>\s+/g, '')
            .trim();
        
        return plainText.length > maxLength 
            ? plainText.substring(0, maxLength) + '...'
            : plainText;
    }

    // 初始化装饰元素状态
    initializeDecorations() {
        const marioDecoration = document.getElementById('marioDecoration');
        const snorlaxDecoration = document.getElementById('snorlaxDecoration');
        
        // 初始状态：显示马里奥，隐藏卡比兽
        if (marioDecoration && snorlaxDecoration) {
            marioDecoration.classList.remove('hidden');
            snorlaxDecoration.classList.add('hidden');
        }
    }
}

// 初始化应用
let docManager;
document.addEventListener('DOMContentLoaded', () => {
    docManager = new DocumentManager();
});