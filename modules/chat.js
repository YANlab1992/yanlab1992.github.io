/**
 * 聊天模块 - modules/chat.js
 * 智能对话功能，支持DeepSeek API
 */

const ChatModule = {
    // 模块状态
    isOpen: false,
    maxMessages: 50,
    apiEndpoint: 'https://yanzqvip.pythonanywhere.com/chat',
    
    // 对话历史
    conversations: [],
    currentConversationId: null,
    messages: [],
    
    // 加载状态
    isLoading: false,
    
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
     * 初始化聊天模块
     */
    init() {
        this.loadConversations();
        this.bindEvents();
        this.renderConversationList();
    },
    
    /**
     * 绑定事件
     */
    bindEvents() {
        // 发送消息
        const sendBtn = document.getElementById('chat-send-btn');
        const chatInput = document.getElementById('chat-input');
        
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }
        
        if (chatInput) {
            chatInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
            
            // 自动调整高度
            chatInput.addEventListener('input', () => {
                chatInput.style.height = 'auto';
                chatInput.style.height = Math.min(chatInput.scrollHeight, 150) + 'px';
            });
        }
        
        // 新建对话
        const newChatBtn = document.getElementById('new-chat-btn');
        if (newChatBtn) {
            newChatBtn.addEventListener('click', () => this.createNewConversation());
        }
        
        // 清除对话
        const clearChatBtn = document.getElementById('clear-chat-btn');
        if (clearChatBtn) {
            clearChatBtn.addEventListener('click', () => this.clearCurrentChat());
        }
        
        // 历史面板
        const historyBtn = document.getElementById('chat-history-btn');
        const closeHistoryBtn = document.getElementById('close-history-btn');
        
        if (historyBtn) {
            historyBtn.addEventListener('click', () => this.toggleHistoryPanel());
        }
        
        if (closeHistoryBtn) {
            closeHistoryBtn.addEventListener('click', () => this.toggleHistoryPanel(false));
        }
    },
    
    /**
     * 加载对话历史
     */
    loadConversations() {
        const prefix = this.getUserPrefix();
        const saved = localStorage.getItem(prefix + 'chat_conversations');
        if (saved) {
            try {
                this.conversations = JSON.parse(saved);
            } catch (e) {
                this.conversations = [];
            }
        }
        
        const savedCurrent = localStorage.getItem(prefix + 'chat_current_conversation');
        if (savedCurrent) {
            this.currentConversationId = savedCurrent;
            const conv = this.conversations.find(c => c.id === this.currentConversationId);
            if (conv) {
                this.messages = conv.messages || [];
            }
        }
    },
    
    /**
     * 保存对话历史
     */
    saveConversations() {
        const prefix = this.getUserPrefix();
        localStorage.setItem(prefix + 'chat_conversations', JSON.stringify(this.conversations));
        localStorage.setItem(prefix + 'chat_current_conversation', this.currentConversationId || '');
    },
    
    /**
     * 创建新对话
     */
    createNewConversation() {
        const id = Date.now().toString();
        const conversation = {
            id,
            title: '新的对话',
            messages: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.conversations.unshift(conversation);
        this.currentConversationId = id;
        this.messages = [];
        
        this.saveConversations();
        this.renderConversationList();
        this.renderMessages();
        
        // 关闭历史面板
        this.toggleHistoryPanel(false);
        
        // 聚焦输入框
        const chatInput = document.getElementById('chat-input');
        if (chatInput) chatInput.focus();
        
        App.showToast('新对话已创建', 'success');
    },
    
    /**
     * 选择对话
     */
    selectConversation(id) {
        this.currentConversationId = id;
        const conv = this.conversations.find(c => c.id === id);
        if (conv) {
            this.messages = conv.messages || [];
        }
        
        this.saveConversations();
        this.renderConversationList();
        this.renderMessages();
        this.toggleHistoryPanel(false);
    },
    
    /**
     * 删除对话
     */
    deleteConversation(id, e) {
        e.stopPropagation();
        
        this.conversations = this.conversations.filter(c => c.id !== id);
        
        if (this.currentConversationId === id) {
            if (this.conversations.length > 0) {
                this.selectConversation(this.conversations[0].id);
            } else {
                this.createNewConversation();
            }
        } else {
            this.saveConversations();
            this.renderConversationList();
        }
        
        App.showToast('对话已删除', 'success');
    },
    
    /**
     * 清除当前对话
     */
    clearCurrentChat() {
        if (!this.currentConversationId) return;
        
        const conv = this.conversations.find(c => c.id === this.currentConversationId);
        if (conv) {
            conv.messages = [];
            this.messages = [];
            this.saveConversations();
            this.renderMessages();
        }
        
        App.showToast('对话已清除', 'success');
    },
    
    /**
     * 渲染对话列表
     */
    renderConversationList() {
        const container = document.getElementById('chat-history-list');
        if (!container) return;
        
        if (this.conversations.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">💬</div>
                    <div class="empty-state-title">暂无对话记录</div>
                    <div class="empty-state-desc">开始一段新的对话吧</div>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.conversations.map(conv => {
            const preview = conv.messages.length > 0 
                ? conv.messages[conv.messages.length - 1].content.substring(0, 50) + '...'
                : '开始对话';
            
            const date = this.formatDate(conv.updatedAt);
            
            return `
                <div class="history-item ${conv.id === this.currentConversationId ? 'active' : ''}" 
                     data-id="${conv.id}">
                    <div class="history-item-title">
                        <span>${conv.title}</span>
                        <button class="btn btn-ghost btn-sm" onclick="ChatModule.deleteConversation('${conv.id}', event)">
                            🗑️
                        </button>
                    </div>
                    <div class="history-item-date">${date}</div>
                    <div class="history-item-preview">${preview}</div>
                </div>
            `;
        }).join('');
        
        // 绑定点击事件
        container.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                this.selectConversation(item.dataset.id);
            });
        });
    },
    
    /**
     * 切换历史面板
     */
    toggleHistoryPanel(show) {
        const panel = document.getElementById('chat-history-panel');
        if (!panel) return;
        
        if (show === undefined) {
            show = !panel.classList.contains('open');
        }
        
        panel.classList.toggle('open', show);
    },
    
    /**
     * 渲染消息列表
     */
    renderMessages() {
        const container = document.getElementById('chat-messages');
        if (!container) return;
        
        if (this.messages.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🌟</div>
                    <div class="empty-state-title">你好！有什么可以帮你的吗？</div>
                    <div class="empty-state-desc">
                        我是你的心理陪伴助手，可以和你聊聊心情、压力、困惑...
                    </div>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.messages.map(msg => this.renderMessage(msg)).join('');
        
        // 滚动到底部
        container.scrollTop = container.scrollHeight;
    },
    
    /**
     * 渲染单条消息
     */
    renderMessage(msg) {
        const time = this.formatTime(msg.timestamp);
        const avatar = msg.role === 'user' ? '👤' : '🤖';
        
        if (msg.role === 'assistant' && msg.loading) {
            return `
                <div class="message assistant loading">
                    <div class="message-avatar">${avatar}</div>
                    <div class="message-content">
                        <div class="loading-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            `;
        }
        
        return `
            <div class="message ${msg.role}">
                <div class="message-avatar">${avatar}</div>
                <div class="message-content">
                    ${msg.content}
                </div>
                <div class="message-time">${time}</div>
            </div>
        `;
    },
    
    /**
     * 发送消息
     */
    async sendMessage() {
        const input = document.getElementById('chat-input');
        if (!input) return;
        
        const content = input.value.trim();
        if (!content) return;
        
        // 确保有当前对话
        if (!this.currentConversationId) {
            this.createNewConversation();
        }
        
        // 添加用户消息
        const userMessage = {
            role: 'user',
            content,
            timestamp: new Date().toISOString()
        };
        
        this.messages.push(userMessage);
        
        // 清空输入框
        input.value = '';
        input.style.height = 'auto';
        
        // 更新对话标题（如果是第一条消息）
        const conv = this.conversations.find(c => c.id === this.currentConversationId);
        if (conv && conv.messages.length === 1) {
            conv.title = content.substring(0, 30) + (content.length > 30 ? '...' : '');
        }
        
        // 保存并渲染
        this.saveConversations();
        this.renderMessages();
        this.renderConversationList();
        
        // 添加加载状态
        this.messages.push({
            role: 'assistant',
            content: '',
            loading: true,
            timestamp: new Date().toISOString()
        });
        this.renderMessages();
        
        // 发送到API
        try {
            await this.callAPI();
        } catch (error) {
            console.error('API调用失败:', error);
            this.handleAPIError(error);
        }
    },
    
    /**
     * 调用DeepSeek API
     */
    async callAPI() {
        // 构建消息历史
        const messagesForAPI = this.messages
            .filter(m => !m.loading)
            .slice(-10) // 最多10轮
            .map(m => ({
                role: m.role,
                content: m.content
            }));
        
        // 添加系统提示
        const systemPrompt = `你是"小智"，一个温柔、支持性的AI心理陪伴助手。你的目标是：
1. 提供情感支持和倾听
2. 帮助用户理解自己的情绪
3. 给予积极的建议和鼓励
4. 绝不评判，始终保持温暖和耐心
5. 如发现用户有严重心理困扰，引导其寻求专业帮助

请用温暖、亲切的语气回复。`;
        
        const requestMessages = [
            { role: 'system', content: systemPrompt },
            ...messagesForAPI
        ];
        
        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: requestMessages,
                    user_id: Auth.getCurrentUser()?.username || 'anonymous'
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            
            // 移除加载状态
            this.messages = this.messages.filter(m => !m.loading);
            
            // 添加助手回复
            const assistantMessage = {
                role: 'assistant',
                content: data.response || data.reply || data.message || '抱歉，我暂时无法回复。',
                timestamp: new Date().toISOString()
            };
            
            this.messages.push(assistantMessage);
            
            // 更新对话
            const conv = this.conversations.find(c => c.id === this.currentConversationId);
            if (conv) {
                conv.messages = this.messages;
                conv.updatedAt = new Date().toISOString();
            }
            
            this.saveConversations();
            this.renderMessages();
            
        } catch (error) {
            // 移除加载状态
            this.messages = this.messages.filter(m => !m.loading);
            
            // 添加错误消息
            const errorMessage = {
                role: 'assistant',
                content: '抱歉，连接服务器时遇到了问题。请稍后再试，或检查网络连接。',
                timestamp: new Date().toISOString()
            };
            
            this.messages.push(errorMessage);
            this.renderMessages();
        }
    },
    
    /**
     * 处理API错误
     */
    handleAPIError(error) {
        console.error('Chat API Error:', error);
        App.showToast('消息发送失败，请检查网络连接', 'error');
    },
    
    /**
     * 格式化日期
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return '刚刚';
        if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前';
        if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前';
        if (diff < 604800000) return Math.floor(diff / 86400000) + '天前';
        
        return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    },
    
    /**
     * 格式化时间
     */
    formatTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    },
    
    /**
     * 导出对话
     */
    exportConversation() {
        if (!this.currentConversationId) return;
        
        const conv = this.conversations.find(c => c.id === this.currentConversationId);
        if (!conv) return;
        
        const content = conv.messages.map(m => {
            const role = m.role === 'user' ? '我' : '小智';
            const time = this.formatTime(m.timestamp);
            return `[${time}] ${role}: ${m.content}`;
        }).join('\n\n');
        
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `对话_${conv.title}_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        
        App.showToast('对话已导出', 'success');
    }
};

// 初始化
if (typeof App !== 'undefined') {
    App.registerModule('chat', ChatModule);
}