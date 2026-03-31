/**
 * 心理信件模块 - modules/letter.js
 * 给未来自己/管理员的信、定时开启
 */

const LetterModule = {
    // 模块状态
    isOpen: false,
    letters: [],
    currentLetter: null,
    
    // 提示语
    writingTips: [
        '想象你正在和一个老朋友聊天，轻松地写下你的想法',
        '可以描述你最近的心情、遇到的挑战或取得的进步',
        '不要担心语法或措辞，真实地表达最重要',
        '可以写下你对未来的期望和目标',
        '感谢那些帮助过你的人，或原谅那些伤害过你的人'
    ],
    
    /**
     * 获取用户数据前缀
     */
    getUserPrefix() {
        const user = Auth.getCurrentUser();
        if (!user) return '';
        let prefix = `xzpark_${user.username}_`;
        if (ProjectManager.currentProject) {
            prefix += `proj_${ProjectManager.currentProject.id}_`;
        }
        return prefix;
    },
    
    /**
     * 获取收件人选项（根据用户角色）
     */
    getRecipientTypes() {
        const user = Auth.getCurrentUser();
        const types = [
            { id: 'future_self', label: '未来的自己', icon: '🔮', placeholder: '亲爱的未来的我：' }
        ];
        
        // 如果是管理员，可以写信给用户（用于反馈）
        if (user && user.role === 'admin') {
            types.push({ id: 'user', label: '用户', icon: '👤', placeholder: '亲爱的用户：' });
        }
        
        return types;
    },
    
    /**
     * 初始化信件模块
     */
    init() {
        this.loadLetters();
        this.bindEvents();
        this.renderLetterList();
    },
    
    /**
     * 加载信件数据
     */
    loadLetters() {
        const prefix = this.getUserPrefix();
        const saved = localStorage.getItem(prefix + 'letter_entries');
        if (saved) {
            try {
                this.letters = JSON.parse(saved);
            } catch (e) {
                this.letters = [];
            }
        }
    },
    
    /**
     * 保存信件数据
     */
    saveLetters() {
        const prefix = this.getUserPrefix();
        localStorage.setItem(prefix + 'letter_entries', JSON.stringify(this.letters));
    },
    
    /**
     * 绑定事件
     */
    bindEvents() {
        // 新建信件
        const newLetterBtn = document.getElementById('letter-new-btn');
        if (newLetterBtn) {
            newLetterBtn.addEventListener('click', () => this.createNewLetter());
        }
    },
    
    /**
     * 渲染信件列表
     */
    renderLetterList() {
        const container = document.getElementById('letter-list');
        const editorContainer = document.getElementById('letter-editor');
        const listBody = document.getElementById('letter-list-body');
        
        if (!container) return;
        
        if (editorContainer) editorContainer.style.display = 'none';
        container.style.display = 'block';
        
        // 更新新建按钮
        const newBtn = container.querySelector('#letter-new-btn');
        if (newBtn) {
            newBtn.onclick = () => this.createNewLetter();
        }
        
        if (this.letters.length === 0) {
            if (listBody) {
                listBody.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">💌</div>
                        <div class="empty-state-title">还没有信件</div>
                        <div class="empty-state-desc">写下你想对未来自己说的话，让时间见证你的成长</div>
                    </div>
                `;
            }
            return;
        }
        
        // 按状态分组
        const lockedLetters = this.letters.filter(l => !this.canOpen(l));
        const readLetters = this.letters.filter(l => l.isRead && this.canOpen(l));
        const draftLetters = this.letters.filter(l => !l.isRead && !l.lockedUntil && this.canOpen(l));
        
        let html = '';
        
        if (draftLetters.length > 0) {
            html += `
                <div class="mb-lg">
                    <div class="nav-section-title mb-md">📝 草稿</div>
                    ${draftLetters.map(letter => this.renderLetterItem(letter)).join('')}
                </div>
            `;
        }
        
        if (lockedLetters.length > 0) {
            html += `
                <div class="mb-lg">
                    <div class="nav-section-title mb-md">🔒 待开启</div>
                    ${lockedLetters.map(letter => this.renderLetterItem(letter)).join('')}
                </div>
            `;
        }
        
        if (readLetters.length > 0) {
            html += `
                <div class="mb-lg">
                    <div class="nav-section-title mb-md">📖 已开启</div>
                    ${readLetters.map(letter => this.renderLetterItem(letter)).join('')}
                </div>
            `;
        }
        
        if (listBody) {
            listBody.innerHTML = html;
        }
        
        // 绑定点击事件
        container.querySelectorAll('.letter-item').forEach(item => {
            item.addEventListener('click', () => {
                const letterId = item.dataset.letterId;
                this.openLetter(letterId);
            });
        });
    },
    
    /**
     * 渲染单个信件项
     */
    renderLetterItem(letter) {
        const recipientTypes = this.getRecipientTypes();
        const recipientType = recipientTypes.find(t => t.id === letter.recipientType) || recipientTypes[0];
        const canOpen = this.canOpen(letter);
        
        let statusHtml = '';
        if (!canOpen) {
            const unlockDate = new Date(letter.lockedUntil);
            statusHtml = `<span class="letter-item-status locked">${unlockDate.toLocaleDateString('zh-CN')}开启</span>`;
        } else if (letter.isRead) {
            statusHtml = `<span class="letter-item-status read">已读</span>`;
        } else {
            statusHtml = `<span class="letter-item-status draft">草稿</span>`;
        }
        
        const date = new Date(letter.createdAt).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        return `
            <div class="letter-item ${!canOpen ? 'locked' : ''}" data-letter-id="${letter.id}">
                <div class="letter-item-icon">${recipientType.icon}</div>
                <div>
                    <div class="letter-item-title">${recipientType.label}</div>
                    <div class="letter-item-date">${date}</div>
                    ${statusHtml}
                </div>
            </div>
        `;
    },
    
    /**
     * 检查是否可以开启信件
     */
    canOpen(letter) {
        if (!letter.lockedUntil) return true;
        return new Date() >= new Date(letter.lockedUntil);
    },
    
    /**
     * 创建新信件
     */
    createNewLetter() {
        const recipientTypes = this.getRecipientTypes();
        
        this.currentLetter = {
            id: Date.now().toString(),
            recipientType: 'future_self',
            recipientName: '',
            lockedUntil: '',
            content: '',
            isRead: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.showEditor(recipientTypes);
    },
    
    /**
     * 显示编辑器
     */
    showEditor(recipientTypes) {
        const container = document.getElementById('letter-list');
        const editorContainer = document.getElementById('letter-editor');
        
        if (!editorContainer) return;
        
        if (container) container.style.display = 'none';
        
        // 构建收件人选项HTML
        const recipientOptions = recipientTypes.map(t => 
            `<option value="${t.id}">${t.icon} ${t.label}</option>`
        ).join('');
        
        editorContainer.innerHTML = `
            <div class="letter-editor-header">
                <div class="d-flex align-center justify-between mb-md">
                    <div class="card-title">
                        <span>✏️</span>
                        <span>写信</span>
                    </div>
                    <button class="btn btn-ghost" onclick="LetterModule.showLetterList()">取消</button>
                </div>
                
                <div class="letter-recipient">
                    <span class="letter-recipient-label">写给</span>
                    <select id="letter-recipient-type" class="input" style="flex:1; max-width: 200px;">
                        ${recipientOptions}
                    </select>
                </div>
                
                <div class="letter-open-date">
                    <span class="letter-recipient-label">开启日期</span>
                    <input type="date" id="letter-unlock-date" class="input" style="flex:1;">
                    <span class="text-secondary" style="font-size: var(--font-size-xs);">留空则立即可读</span>
                </div>
                
                <div class="letter-tips">
                    <div class="letter-tips-title">
                        <span>💡</span> 写信小提示
                    </div>
                    <ul class="letter-tips-list">
                        <li>想象你正在和一个老朋友聊天，轻松地写下你的想法</li>
                        <li>可以描述你最近的心情、遇到的挑战或取得的进步</li>
                        <li>不要担心语法或措辞，真实地表达最重要</li>
                    </ul>
                </div>
            </div>
            <div class="letter-editor-body">
                <textarea id="letter-content" class="letter-content-input" placeholder="在这里写下你想说的话..."></textarea>
            </div>
            <div class="letter-editor-footer">
                <div class="letter-privacy">
                    <span class="letter-privacy-icon">🔒</span>
                    <span>信件仅存储在您的本地设备</span>
                </div>
                <div class="d-flex gap-md">
                    <button class="btn btn-danger" id="letter-delete-btn" style="display:none;">删除</button>
                    <button class="btn btn-primary" id="letter-save-btn" onclick="LetterModule.saveCurrentLetter()">💾 保存</button>
                </div>
            </div>
        `;
        
        editorContainer.style.display = 'flex';
        editorContainer.style.flexDirection = 'column';
        
        // 如果是编辑已有信件，显示删除按钮
        if (this.currentLetter && this.currentLetter.content) {
            const deleteBtn = document.getElementById('letter-delete-btn');
            if (deleteBtn) {
                deleteBtn.style.display = 'block';
                deleteBtn.onclick = () => this.deleteCurrentLetter();
            }
        }
        
        this.populateEditor();
    },
    
    /**
     * 填充编辑器内容
     */
    populateEditor() {
        const letter = this.currentLetter;
        if (!letter) return;
        
        // 填充收件人类型
        const recipientSelect = document.getElementById('letter-recipient-type');
        if (recipientSelect) {
            recipientSelect.value = letter.recipientType || 'future_self';
        }
        
        // 填充开启日期
        const unlockDateInput = document.getElementById('letter-unlock-date');
        if (unlockDateInput) {
            if (letter.lockedUntil) {
                unlockDateInput.value = letter.lockedUntil.split('T')[0];
            } else {
                // 默认设置为一个月后
                const defaultDate = new Date();
                defaultDate.setMonth(defaultDate.getMonth() + 1);
                unlockDateInput.value = defaultDate.toISOString().split('T')[0];
            }
        }
        
        // 填充信件内容
        const contentInput = document.getElementById('letter-content');
        if (contentInput) {
            contentInput.value = letter.content || '';
        }
    },
    
    /**
     * 保存信件
     */
    saveCurrentLetter() {
        if (!this.currentLetter) return;
        
        const recipientType = document.getElementById('letter-recipient-type');
        const unlockDate = document.getElementById('letter-unlock-date');
        const content = document.getElementById('letter-content');
        
        if (!content || !content.value.trim()) {
            App.showToast('请写下你想说的话', 'warning');
            return;
        }
        
        this.currentLetter.recipientType = recipientType ? recipientType.value : 'future_self';
        this.currentLetter.content = content.value.trim();
        this.currentLetter.updatedAt = new Date().toISOString();
        
        // 处理开启日期
        if (unlockDate && unlockDate.value) {
            this.currentLetter.lockedUntil = new Date(unlockDate.value).toISOString();
        } else {
            this.currentLetter.lockedUntil = '';
        }
        
        // 检查是否已存在
        const existingIndex = this.letters.findIndex(l => l.id === this.currentLetter.id);
        if (existingIndex >= 0) {
            this.letters[existingIndex] = this.currentLetter;
        } else {
            this.letters.push(this.currentLetter);
        }
        
        this.saveLetters();
        App.showToast('信件已保存', 'success');
        
        // 如果设置了未来日期且未到，开启锁定状态
        if (this.currentLetter.lockedUntil && !this.canOpen(this.currentLetter)) {
            App.showToast('信件已锁定，将在指定日期开启', 'info');
        }
        
        this.showLetterList();
    },
    
    /**
     * 删除信件
     */
    deleteCurrentLetter() {
        if (!this.currentLetter) return;
        
        App.showConfirm({
            title: '删除信件',
            message: '确定要删除这封信吗？',
            confirmText: '删除',
            danger: true
        }).then(confirmed => {
            if (confirmed) {
                this.letters = this.letters.filter(l => l.id !== this.currentLetter.id);
                this.saveLetters();
                this.currentLetter = null;
                App.showToast('信件已删除', 'success');
                this.showLetterList();
            }
        });
    },
    
    /**
     * 打开信件
     */
    openLetter(letterId) {
        const letter = this.letters.find(l => l.id === letterId);
        if (!letter) return;
        
        this.currentLetter = letter;
        
        // 检查是否可以开启
        if (!this.canOpen(letter)) {
            const unlockDate = new Date(letter.lockedUntil);
            App.showToast(`这封信将在 ${unlockDate.toLocaleDateString('zh-CN')} 开启`, 'info');
            return;
        }
        
        // 标记为已读
        if (!letter.isRead) {
            letter.isRead = true;
            this.saveLetters();
        }
        
        this.showLetterViewer();
    },
    
    /**
     * 显示信件查看器
     */
    showLetterViewer() {
        const container = document.getElementById('letter-list');
        const editorContainer = document.getElementById('letter-editor');
        
        if (!editorContainer) return;
        
        if (container) container.style.display = 'none';
        
        const letter = this.currentLetter;
        const recipientTypes = this.getRecipientTypes();
        const recipientType = recipientTypes.find(t => t.id === letter.recipientType) || recipientTypes[0];
        
        // 显示查看器
        editorContainer.innerHTML = `
            <div class="letter-editor-header">
                <div class="d-flex align-center justify-between">
                    <div class="card-title">
                        <span>${recipientType.icon}</span>
                        <span>${recipientType.label}</span>
                    </div>
                    <div class="d-flex gap-sm">
                        <button class="btn btn-ghost" onclick="LetterModule.editLetter()">编辑</button>
                        <button class="btn btn-ghost" onclick="LetterModule.showLetterList()">返回</button>
                    </div>
                </div>
            </div>
            <div class="letter-editor-body">
                <div class="letter-viewer">
                    <div class="letter-paper">
                        <div class="letter-paper-header">
                            <div class="letter-paper-date">${new Date(letter.createdAt).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                            <div class="letter-paper-recipient">
                                ${recipientType.icon} ${recipientType.label}
                            </div>
                        </div>
                        <div class="letter-paper-body">${letter.content}</div>
                    </div>
                </div>
            </div>
        `;
        
        editorContainer.style.display = 'flex';
        editorContainer.style.flexDirection = 'column';
    },
    
    /**
     * 编辑信件
     */
    editLetter() {
        if (!this.currentLetter) return;
        
        // 重新显示编辑器
        const container = document.getElementById('letter-editor');
        if (!container) return;
        
        const recipientTypes = this.getRecipientTypes();
        const recipientOptions = recipientTypes.map(t => 
            `<option value="${t.id}">${t.icon} ${t.label}</option>`
        ).join('');
        
        container.innerHTML = `
            <div class="letter-editor-header">
                <div class="d-flex align-center justify-between mb-md">
                    <div class="card-title">
                        <span>✏️</span>
                        <span>编辑信件</span>
                    </div>
                    <button class="btn btn-ghost" onclick="LetterModule.showLetterList()">取消</button>
                </div>
                
                <div class="letter-recipient">
                    <span class="letter-recipient-label">写给</span>
                    <select id="letter-recipient-type" class="input" style="flex:1; max-width: 200px;">
                        ${recipientOptions}
                    </select>
                </div>
                
                <div class="letter-open-date">
                    <span class="letter-recipient-label">开启日期</span>
                    <input type="date" id="letter-unlock-date" class="input" style="flex:1;">
                    <span class="text-secondary" style="font-size: var(--font-size-xs);">留空则立即可读</span>
                </div>
                
                <div class="letter-tips">
                    <div class="letter-tips-title">
                        <span>💡</span> 写信小提示
                    </div>
                    <ul class="letter-tips-list">
                        <li>想象你正在和一个老朋友聊天，轻松地写下你的想法</li>
                        <li>可以描述你最近的心情、遇到的挑战或取得的进步</li>
                        <li>不要担心语法或措辞，真实地表达最重要</li>
                    </ul>
                </div>
            </div>
            <div class="letter-editor-body">
                <textarea id="letter-content" class="letter-content-input" placeholder="在这里写下你想说的话..."></textarea>
            </div>
            <div class="letter-editor-footer">
                <div class="letter-privacy">
                    <span class="letter-privacy-icon">🔒</span>
                    <span>信件仅存储在您的本地设备</span>
                </div>
                <div class="d-flex gap-md">
                    <button class="btn btn-danger" onclick="LetterModule.deleteCurrentLetter()">删除</button>
                    <button class="btn btn-primary" onclick="LetterModule.saveCurrentLetter()">保存</button>
                </div>
            </div>
        `;
        
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        
        this.populateEditor();
    },
    
    /**
     * 返回信件列表
     */
    showLetterList() {
        this.currentLetter = null;
        this.renderLetterList();
    },
    
    /**
     * 导出所有信件
     */
    exportLetters() {
        if (this.letters.length === 0) {
            App.showToast('暂无信件数据', 'warning');
            return;
        }
        
        const recipientTypes = this.getRecipientTypes();
        const data = this.letters.map(letter => {
            const recipientType = recipientTypes.find(t => t.id === letter.recipientType);
            return {
                recipient: recipientType ? recipientType.label : letter.recipientType,
                content: letter.content,
                createdAt: letter.createdAt,
                lockedUntil: letter.lockedUntil,
                canOpen: this.canOpen(letter)
            };
        });
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `心理信件_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        App.showToast('信件已导出', 'success');
    }
};

// 初始化
if (typeof App !== 'undefined') {
    App.registerModule('letter', LetterModule);
}