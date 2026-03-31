/**
 * 小智的数智乐园 - 主应用逻辑
 * 心理学研究辅助工具平台
 * 包含登录认证、用户角色管理、项目管理功能
 */

// ==================== 认证系统 ====================
const Auth = {
    // 默认管理员账号
    DEFAULT_ADMIN: {
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        createdAt: '2024-01-01T00:00:00.000Z'
    },
    
    /**
     * 初始化认证系统
     */
    init() {
        // 初始化默认管理员
        this.initDefaultUsers();
        
        // 检查是否已登录
        this.checkLoginStatus();
        
        // 绑定登录事件
        this.bindAuthEvents();
    },
    
    /**
     * 初始化默认用户
     */
    initDefaultUsers() {
        const users = this.getUsers();
        if (!users.find(u => u.username === 'admin')) {
            users.push(this.DEFAULT_ADMIN);
            localStorage.setItem('xzpark_users', JSON.stringify(users));
        }
    },
    
    /**
     * 获取所有用户
     */
    getUsers() {
        return JSON.parse(localStorage.getItem('xzpark_users') || '[]');
    },
    
    /**
     * 保存用户列表
     */
    saveUsers(users) {
        localStorage.setItem('xzpark_users', JSON.stringify(users));
    },
    
    /**
     * 检查登录状态
     */
    checkLoginStatus() {
        const currentUser = localStorage.getItem('xzpark_current_user');
        if (currentUser) {
            const user = JSON.parse(currentUser);
            this.showApp(user);
        } else {
            this.showLogin();
        }
    },
    
    /**
     * 显示登录界面
     */
    showLogin() {
        document.getElementById('login-container').style.display = 'flex';
        document.getElementById('app-container').style.display = 'none';
    },
    
    /**
     * 显示主应用
     */
    showApp(user) {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('app-container').style.display = 'block';
        
        // 更新侧边栏用户信息
        document.getElementById('sidebar-user-name').textContent = user.username;
        document.getElementById('sidebar-user-avatar').textContent = user.username.charAt(0).toUpperCase();
        document.getElementById('sidebar-user-role').textContent = user.role === 'admin' ? '🔧 管理员' : '🟢 用户';
        
        // 根据角色显示/隐藏管理菜单
        const adminSection = document.querySelector('.nav-section-admin');
        if (adminSection) {
            adminSection.style.display = user.role === 'admin' ? 'block' : 'none';
        }
        
        // 更新最后登录时间
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.username === user.username);
        if (userIndex !== -1) {
            users[userIndex].lastLogin = new Date().toISOString();
            this.saveUsers(users);
            localStorage.setItem('xzpark_current_user', JSON.stringify(users[userIndex]));
        }
    },
    
    /**
     * 登录
     */
    login(username, password) {
        const users = this.getUsers();
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            localStorage.setItem('xzpark_current_user', JSON.stringify(user));
            this.showApp(user);
            App.showToast(`欢迎回来，${user.username}！`, 'success');
            return true;
        }
        
        return false;
    },
    
    /**
     * 注册
     */
    register(username, password, role = 'user') {
        const users = this.getUsers();
        
        // 检查用户名是否存在
        if (users.find(u => u.username === username)) {
            return { success: false, message: '用户名已存在' };
        }
        
        // 创建新用户
        const newUser = {
            username,
            password,
            role,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };
        
        users.push(newUser);
        this.saveUsers(users);
        
        // 自动登录
        localStorage.setItem('xzpark_current_user', JSON.stringify(newUser));
        this.showApp(newUser);
        
        return { success: true };
    },
    
    /**
     * 添加管理员
     */
    addAdmin(username, password) {
        const users = this.getUsers();
        
        if (users.find(u => u.username === username)) {
            return { success: false, message: '用户名已存在' };
        }
        
        const newAdmin = {
            username,
            password,
            role: 'admin',
            createdAt: new Date().toISOString(),
            lastLogin: null
        };
        
        users.push(newAdmin);
        this.saveUsers(users);
        
        return { success: true };
    },
    
    /**
     * 删除用户
     */
    deleteUser(username) {
        // 不能删除自己
        const currentUser = JSON.parse(localStorage.getItem('xzpark_current_user') || '{}');
        if (username === currentUser.username) {
            return { success: false, message: '不能删除自己' };
        }
        
        // 不能删除默认管理员
        if (username === 'admin') {
            return { success: false, message: '不能删除默认管理员' };
        }
        
        let users = this.getUsers();
        users = users.filter(u => u.username !== username);
        this.saveUsers(users);
        
        return { success: true };
    },
    
    /**
     * 获取当前用户
     */
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('xzpark_current_user') || 'null');
    },
    
    /**
     * 登出
     */
    logout() {
        localStorage.removeItem('xzpark_current_user');
        this.showLogin();
        App.showToast('已退出登录', 'info');
    },
    
    /**
     * 判断是否为管理员
     */
    isAdmin() {
        const user = this.getCurrentUser();
        return user && user.role === 'admin';
    },
    
    /**
     * 绑定认证事件
     */
    bindAuthEvents() {
        // 登录按钮
        document.getElementById('login-btn').addEventListener('click', () => {
            const username = document.getElementById('login-username').value.trim();
            const password = document.getElementById('login-password').value;
            const errorEl = document.getElementById('login-error');
            
            if (!username || !password) {
                errorEl.textContent = '请输入用户名和密码';
                errorEl.style.display = 'block';
                return;
            }
            
            if (!this.login(username, password)) {
                errorEl.textContent = '用户名或密码错误';
                errorEl.style.display = 'block';
            }
        });
        
        // 注册按钮
        document.getElementById('register-btn').addEventListener('click', () => {
            const username = document.getElementById('register-username').value.trim();
            const password = document.getElementById('register-password').value;
            const passwordConfirm = document.getElementById('register-password-confirm').value;
            const errorEl = document.getElementById('register-error');
            
            if (!username || !password) {
                errorEl.textContent = '请填写所有必填项';
                errorEl.style.display = 'block';
                return;
            }
            
            if (username.length < 3 || username.length > 20) {
                errorEl.textContent = '用户名长度应为3-20位';
                errorEl.style.display = 'block';
                return;
            }
            
            if (password.length < 6) {
                errorEl.textContent = '密码长度应至少为6位';
                errorEl.style.display = 'block';
                return;
            }
            
            if (password !== passwordConfirm) {
                errorEl.textContent = '两次输入的密码不一致';
                errorEl.style.display = 'block';
                return;
            }
            
            const result = this.register(username, password);
            if (!result.success) {
                errorEl.textContent = result.message;
                errorEl.style.display = 'block';
            }
        });
        
        // 切换到注册
        document.getElementById('show-register-btn').addEventListener('click', () => {
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('register-form').style.display = 'block';
        });
        
        // 切换到登录
        document.getElementById('show-login-btn').addEventListener('click', () => {
            document.getElementById('register-form').style.display = 'none';
            document.getElementById('login-form').style.display = 'block';
        });
        
        // 回车登录
        document.getElementById('login-password').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('login-btn').click();
            }
        });
    }
};

// ==================== 项目管理器 ====================
const ProjectManager = {
    // 项目列表
    projects: [],
    currentProject: null,
    
    /**
     * 获取用户数据前缀（包含项目）
     */
    getUserPrefix() {
        const user = Auth.getCurrentUser();
        if (!user) return '';
        let prefix = `xzpark_${user.username}_`;
        if (this.currentProject) {
            prefix += `proj_${this.currentProject.id}_`;
        }
        return prefix;
    },
    
    /**
     * 获取项目数据存储键
     */
    getProjectKey() {
        const user = Auth.getCurrentUser();
        if (!user) return 'xzpark_projects';
        return `xzpark_${user.username}_projects`;
    },
    
    /**
     * 初始化
     */
    init() {
        this.loadProjects();
        this.bindEvents();
        this.renderProjectList();
    },
    
    /**
     * 加载项目列表
     */
    loadProjects() {
        const saved = localStorage.getItem(this.getProjectKey());
        if (saved) {
            try {
                this.projects = JSON.parse(saved);
            } catch (e) {
                this.projects = [];
            }
        }
    },
    
    /**
     * 保存项目列表
     */
    saveProjects() {
        localStorage.setItem(this.getProjectKey(), JSON.stringify(this.projects));
    },
    
    /**
     * 绑定事件
     */
    bindEvents() {
        const newProjectBtn = document.getElementById('new-project-btn');
        if (newProjectBtn) {
            newProjectBtn.addEventListener('click', () => this.showCreateProjectModal());
        }
        
        const saveProjectBtn = document.getElementById('save-project-btn');
        if (saveProjectBtn) {
            saveProjectBtn.addEventListener('click', () => this.createProject());
        }
        
        const cancelProjectBtn = document.getElementById('cancel-project-btn');
        if (cancelProjectBtn) {
            cancelProjectBtn.addEventListener('click', () => this.hideProjectModal());
        }
    },
    
    /**
     * 渲染项目列表
     */
    renderProjectList() {
        const container = document.getElementById('project-list');
        if (!container) return;
        
        if (this.projects.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📁</div>
                    <div class="empty-state-title">暂无研究项目</div>
                    <div class="empty-state-desc">创建您的第一个科研项目，开启项目化数据管理</div>
                    <button class="btn btn-primary mt-lg" onclick="ProjectManager.showCreateProjectModal()">
                        ➕ 创建项目
                    </button>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.projects.map(project => `
            <div class="project-card ${this.currentProject?.id === project.id ? 'active' : ''}" 
                 data-project-id="${project.id}"
                 onclick="ProjectManager.selectProject('${project.id}')">
                <div class="project-card-header">
                    <div class="project-icon">${project.icon || '📁'}</div>
                    <div class="project-info">
                        <div class="project-name">${project.name}</div>
                        <div class="project-date">${new Date(project.createdAt).toLocaleDateString('zh-CN')}</div>
                    </div>
                    <div class="project-actions">
                        <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); ProjectManager.showEditProject('${project.id}')" title="编辑">✏️</button>
                        <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); ProjectManager.deleteProject('${project.id}')" title="删除">🗑️</button>
                    </div>
                </div>
                <div class="project-description">${project.description || '暂无描述'}</div>
                <div class="project-stats">
                    <span class="project-stat">💬 ${project.chatCount || 0}</span>
                    <span class="project-stat">📋 ${project.measureCount || 0}</span>
                    <span class="project-stat">📔 ${project.diaryCount || 0}</span>
                </div>
            </div>
        `).join('');
    },
    
    /**
     * 显示创建项目弹窗
     */
    showCreateProjectModal() {
        const modal = document.getElementById('project-modal');
        const title = document.getElementById('project-modal-title');
        const nameInput = document.getElementById('project-name-input');
        const descInput = document.getElementById('project-desc-input');
        const iconSelect = document.getElementById('project-icon-select');
        
        if (!modal) return;
        
        title.textContent = '创建新项目';
        if (nameInput) nameInput.value = '';
        if (descInput) descInput.value = '';
        if (iconSelect) iconSelect.value = '📁';
        
        // 隐藏删除按钮
        const deleteBtn = document.getElementById('delete-project-btn');
        if (deleteBtn) deleteBtn.style.display = 'none';
        
        modal.style.display = 'flex';
    },
    
    /**
     * 隐藏项目弹窗
     */
    hideProjectModal() {
        const modal = document.getElementById('project-modal');
        if (modal) modal.style.display = 'none';
    },
    
    /**
     * 创建项目
     */
    createProject() {
        const nameInput = document.getElementById('project-name-input');
        const descInput = document.getElementById('project-desc-input');
        const iconSelect = document.getElementById('project-icon-select');
        
        const name = nameInput?.value.trim();
        const description = descInput?.value.trim();
        const icon = iconSelect?.value || '📁';
        
        if (!name) {
            App.showToast('请输入项目名称', 'warning');
            return;
        }
        
        const project = {
            id: Date.now().toString(),
            name,
            description,
            icon,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            chatCount: 0,
            measureCount: 0,
            diaryCount: 0,
            letterCount: 0
        };
        
        this.projects.push(project);
        this.saveProjects();
        this.hideProjectModal();
        this.renderProjectList();
        this.selectProject(project.id);
        
        App.showToast(`项目「${name}」创建成功`, 'success');
    },
    
    /**
     * 选择项目
     */
    selectProject(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;
        
        this.currentProject = project;
        
        // 更新项目选择器
        this.updateProjectSelector();
        
        // 重新初始化各模块
        if (App.modules) {
            Object.values(App.modules).forEach(module => {
                if (module.loadConversations) module.loadConversations();
                if (module.loadResults) module.loadResults();
                if (module.loadEntries) module.loadEntries();
                if (module.loadLetters) module.loadLetters();
            });
        }
        
        this.renderProjectList();
        
        // 更新首页统计
        App.updateHomeStats();
        
        App.showToast(`已切换到项目：${project.name}`, 'info');
    },
    
    /**
     * 更新项目选择器
     */
    updateProjectSelector() {
        const selector = document.getElementById('current-project-name');
        if (selector) {
            if (this.currentProject) {
                selector.textContent = `${this.currentProject.icon} ${this.currentProject.name}`;
            } else {
                selector.textContent = '📋 全局模式';
            }
        }
        
        // 更新下拉列表
        this.renderProjectDropdownList();
    },
    
    /**
     * 渲染项目下拉列表
     */
    renderProjectDropdownList() {
        const container = document.getElementById('project-list-container');
        if (!container) return;
        
        let html = `
            <div class="project-panel-item ${!this.currentProject ? 'active' : ''}" onclick="ProjectManager.exitProjectMode()">
                <span>📋</span>
                <span>全局模式</span>
            </div>
        `;
        
        this.projects.forEach(project => {
            const isActive = this.currentProject?.id === project.id;
            html += `
                <div class="project-panel-item ${isActive ? 'active' : ''}" onclick="ProjectManager.selectProject('${project.id}')">
                    <span>${project.icon || '📁'}</span>
                    <span>${project.name}</span>
                </div>
            `;
        });
        
        container.innerHTML = html;
    },
    
    /**
     * 退出项目模式
     */
    exitProjectMode() {
        this.currentProject = null;
        this.updateProjectSelector();
        
        // 重新初始化各模块
        if (App.modules) {
            Object.values(App.modules).forEach(module => {
                if (module.loadConversations) module.loadConversations();
                if (module.loadResults) module.loadResults();
                if (module.loadEntries) module.loadEntries();
                if (module.loadLetters) module.loadLetters();
            });
        }
        
        this.renderProjectList();
        App.updateHomeStats();
        
        App.showToast('已退出项目模式，返回全局模式', 'info');
    },
    
    /**
     * 切换项目面板显示
     */
    toggleProjectPanel() {
        const panel = document.getElementById('project-panel');
        if (panel) {
            panel.classList.toggle('open');
        }
    },
    
    /**
     * 更新项目统计
     */
    updateProjectStats(type, count) {
        if (!this.currentProject) return;
        
        const project = this.projects.find(p => p.id === this.currentProject.id);
        if (!project) return;
        
        if (type === 'chat') project.chatCount = count;
        if (type === 'measure') project.measureCount = count;
        if (type === 'diary') project.diaryCount = count;
        if (type === 'letter') project.letterCount = count;
        
        project.updatedAt = new Date().toISOString();
        this.saveProjects();
    },
    
    /**
     * 显示编辑项目
     */
    showEditProject(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;
        
        const modal = document.getElementById('project-modal');
        const title = document.getElementById('project-modal-title');
        const nameInput = document.getElementById('project-name-input');
        const descInput = document.getElementById('project-desc-input');
        const iconSelect = document.getElementById('project-icon-select');
        
        if (!modal) return;
        
        title.textContent = '编辑项目';
        if (nameInput) nameInput.value = project.name;
        if (descInput) descInput.value = project.description || '';
        if (iconSelect) iconSelect.value = project.icon || '📁';
        
        // 显示删除按钮
        const deleteBtn = document.getElementById('delete-project-btn');
        if (deleteBtn) {
            deleteBtn.style.display = 'block';
            deleteBtn.onclick = () => this.deleteProject(projectId);
        }
        
        // 临时保存项目ID用于更新
        modal.dataset.editingProjectId = projectId;
        
        modal.style.display = 'flex';
    },
    
    /**
     * 保存编辑
     */
    saveProjectEdit() {
        const modal = document.getElementById('project-modal');
        const projectId = modal?.dataset?.editingProjectId;
        if (!projectId) return;
        
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;
        
        const nameInput = document.getElementById('project-name-input');
        const descInput = document.getElementById('project-desc-input');
        const iconSelect = document.getElementById('project-icon-select');
        
        project.name = nameInput?.value.trim() || project.name;
        project.description = descInput?.value.trim();
        project.icon = iconSelect?.value || '📁';
        project.updatedAt = new Date().toISOString();
        
        this.saveProjects();
        this.hideProjectModal();
        this.renderProjectList();
        this.updateProjectSelector();
        
        if (this.currentProject?.id === projectId) {
            this.currentProject = project;
            this.updateProjectSelector();
        }
        
        App.showToast('项目已更新', 'success');
    },
    
    /**
     * 删除项目
     */
    deleteProject(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;
        
        App.showConfirm({
            title: '删除项目',
            message: `确定要删除项目「${project.name}」吗？该操作不可恢复，所有相关数据将被删除。`,
            confirmText: '删除',
            danger: true
        }).then(confirmed => {
            if (confirmed) {
                // 如果当前选中该项目，退出项目模式
                if (this.currentProject?.id === projectId) {
                    this.exitProjectMode();
                }
                
                this.projects = this.projects.filter(p => p.id !== projectId);
                this.saveProjects();
                this.renderProjectList();
                
                App.showToast(`项目「${project.name}」已删除`, 'success');
                this.hideProjectModal();
            }
        });
    },
    
    /**
     * 导出项目数据
     */
    exportProjectData() {
        if (!this.currentProject) {
            App.showToast('请先选择一个项目', 'warning');
            return;
        }
        
        const project = this.currentProject;
        const prefix = this.getUserPrefix();
        
        const data = {
            project: {
                name: project.name,
                description: project.description,
                createdAt: project.createdAt
            },
            exportedAt: new Date().toISOString(),
            user: Auth.getCurrentUser()?.username,
            chatConversations: JSON.parse(localStorage.getItem(prefix + 'chat_conversations') || '[]'),
            measureResults: JSON.parse(localStorage.getItem(prefix + 'measure_results') || '[]'),
            diaryEntries: JSON.parse(localStorage.getItem(prefix + 'diary_entries') || '[]'),
            letterEntries: JSON.parse(localStorage.getItem(prefix + 'letter_entries') || '[]')
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${project.name}_项目数据_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        App.showToast('项目数据已导出', 'success');
    }
};

// ==================== 管理员模块 ====================
const AdminModule = {
    /**
     * 初始化管理员模块
     */
    init() {
        if (!Auth.isAdmin()) {
            App.showToast('您没有权限访问此页面', 'error');
            App.showModule('home');
            return;
        }
        
        this.bindEvents();
        this.refreshUserList();
        this.refreshStats();
    },
    
    /**
     * 刷新用户列表
     */
    refreshUserList() {
        const users = Auth.getUsers();
        const tbody = document.getElementById('user-list-tbody');
        if (!tbody) return;
        
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.username}</td>
                <td><span class="role-badge ${user.role}">${user.role === 'admin' ? '管理员' : '用户'}</span></td>
                <td>${new Date(user.createdAt).toLocaleDateString('zh-CN')}</td>
                <td>${user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('zh-CN') : '从未登录'}</td>
                <td>
                    ${user.username !== 'admin' && user.username !== Auth.getCurrentUser()?.username ? 
                        `<button class="btn btn-ghost btn-sm" onclick="AdminModule.deleteUser('${user.username}')">🗑️ 删除</button>` : 
                        '<span class="text-secondary">-</span>'}
                </td>
            </tr>
        `).join('');
    },
    
    /**
     * 刷新统计数据
     */
    refreshStats() {
        const users = Auth.getUsers();
        document.getElementById('admin-user-count').textContent = users.length;
        
        // 汇总所有用户的数据
        let totalDiary = 0, totalMeasure = 0, totalLetter = 0;
        
        // 从各用户的个人数据中汇总
        users.forEach(user => {
            const prefix = `xzpark_${user.username}_`;
            const diaryData = JSON.parse(localStorage.getItem(prefix + 'diary_entries') || '[]');
            const measureData = JSON.parse(localStorage.getItem(prefix + 'measure_results') || '[]');
            const letterData = JSON.parse(localStorage.getItem(prefix + 'letter_entries') || '[]');
            
            totalDiary += diaryData.length;
            totalMeasure += measureData.length;
            totalLetter += letterData.length;
        });
        
        document.getElementById('admin-diary-count').textContent = totalDiary;
        document.getElementById('admin-measure-count').textContent = totalMeasure;
        document.getElementById('admin-letter-count').textContent = totalLetter;
    },
    
    /**
     * 添加管理员
     */
    addAdmin() {
        const username = document.getElementById('add-admin-username').value.trim();
        const password = document.getElementById('add-admin-password').value;
        
        if (!username || !password) {
            App.showToast('请填写用户名和密码', 'error');
            return;
        }
        
        const result = Auth.addAdmin(username, password);
        if (result.success) {
            App.showToast(`管理员 ${username} 添加成功`, 'success');
            document.getElementById('add-admin-modal').style.display = 'none';
            document.getElementById('add-admin-username').value = '';
            document.getElementById('add-admin-password').value = '';
            this.refreshUserList();
            this.refreshStats();
        } else {
            App.showToast(result.message, 'error');
        }
    },
    
    /**
     * 删除用户
     */
    deleteUser(username) {
        App.showConfirm({
            title: '删除用户',
            message: `确定要删除用户 ${username} 吗？该操作不可恢复。`,
            confirmText: '删除',
            danger: true
        }).then(confirmed => {
            if (confirmed) {
                const result = Auth.deleteUser(username);
                if (result.success) {
                    App.showToast(`用户 ${username} 已删除`, 'success');
                    this.refreshUserList();
                    this.refreshStats();
                } else {
                    App.showToast(result.message, 'error');
                }
            }
        });
    },
    
    /**
     * 导出数据
     */
    exportData() {
        const exportDiary = document.getElementById('export-diary').checked;
        const exportMeasure = document.getElementById('export-measure').checked;
        const exportChat = document.getElementById('export-chat').checked;
        const exportLetter = document.getElementById('export-letter').checked;
        const exportRange = document.getElementById('export-range').value;
        
        const data = {
            exportedAt: new Date().toISOString(),
            exportedBy: Auth.getCurrentUser()?.username,
            range: exportRange
        };
        
        const users = exportRange === 'all' ? Auth.getUsers() : [Auth.getCurrentUser()];
        
        users.forEach(user => {
            const prefix = `xzpark_${user.username}_`;
            
            if (exportDiary) {
                data[`${user.username}_diary`] = JSON.parse(localStorage.getItem(prefix + 'diary_entries') || '[]');
            }
            if (exportMeasure) {
                data[`${user.username}_measure`] = JSON.parse(localStorage.getItem(prefix + 'measure_results') || '[]');
            }
            if (exportChat) {
                data[`${user.username}_chat`] = JSON.parse(localStorage.getItem(prefix + 'chat_conversations') || '[]');
            }
            if (exportLetter) {
                data[`${user.username}_letter`] = JSON.parse(localStorage.getItem(prefix + 'letter_entries') || '[]');
            }
        });
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `小智的数智乐园_导出数据_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        App.showToast('数据导出成功', 'success');
    },
    
    /**
     * 绑定事件
     */
    bindEvents() {
        // 刷新按钮
        const refreshBtn = document.getElementById('admin-refresh-btn');
        if (refreshBtn) {
            refreshBtn.onclick = () => {
                this.refreshUserList();
                this.refreshStats();
                App.showToast('已刷新', 'success');
            };
        }
        
        // 添加管理员按钮
        const addAdminBtn = document.getElementById('admin-add-user-btn');
        if (addAdminBtn) {
            addAdminBtn.onclick = () => {
                document.getElementById('add-admin-modal').style.display = 'flex';
            };
        }
        
        // 导出按钮
        const exportBtn = document.getElementById('do-export-btn');
        if (exportBtn) {
            exportBtn.onclick = () => this.exportData();
        }
    }
};

// ==================== 主应用 ====================
const App = {
    // 当前模块
    currentModule: 'home',
    
    // 模块注册表
    modules: {},
    
    // Toast容器
    toastContainer: null,
    
    /**
     * 初始化应用
     */
    init() {
        console.log('🌟 小智的数智乐园 初始化中...');
        
        // 初始化认证系统
        Auth.init();
        
        // 创建Toast容器
        this.createToastContainer();
        
        // 绑定全局事件
        this.bindGlobalEvents();
        
        // 初始化侧边栏
        this.initSidebar();
        
        // 初始化项目管理系统
        ProjectManager.init();
        
        // 初始化各模块
        this.initModules();
        
        // 显示首页
        this.showModule('home');
        
        // 初始化首页统计
        this.updateHomeStats();
        
        console.log('✅ 初始化完成');
    },
    
    /**
     * 创建Toast容器
     */
    createToastContainer() {
        if (this.toastContainer) return;
        
        this.toastContainer = document.createElement('div');
        this.toastContainer.className = 'toast-container';
        this.toastContainer.id = 'toast-container';
        document.body.appendChild(this.toastContainer);
    },
    
    /**
     * 绑定全局事件
     */
    bindGlobalEvents() {
        // 移动端菜单切换
        const menuToggle = document.getElementById('menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => this.toggleSidebar());
        }
        
        // 点击侧边栏外部关闭侧边栏（移动端）
        document.addEventListener('click', (e) => {
            const sidebar = document.querySelector('.sidebar');
            const menuToggle = document.getElementById('menu-toggle');
            
            if (sidebar && menuToggle) {
                if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                    sidebar.classList.remove('open');
                }
            }
        });
        
        // ESC键关闭弹窗
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal-overlay.active').forEach(modal => {
                    modal.classList.remove('active');
                });
            }
        });
    },
    
    /**
     * 初始化侧边栏
     */
    initSidebar() {
        // 绑定导航项点击事件
        document.querySelectorAll('.nav-item[data-module]').forEach(item => {
            item.addEventListener('click', () => {
                const module = item.dataset.module;
                
                // 检查管理员权限
                if ((module === 'userManagement' || module === 'dataExport') && !Auth.isAdmin()) {
                    this.showToast('您没有权限访问此功能', 'error');
                    return;
                }
                
                this.showModule(module);
                
                // 移动端：点击后关闭侧边栏
                if (window.innerWidth < 992) {
                    document.querySelector('.sidebar')?.classList.remove('open');
                }
            });
        });
    },
    
    /**
     * 初始化所有模块
     */
    initModules() {
        // 注册模块
        this.registerModule('chat', ChatModule);
        this.registerModule('diary', DiaryModule);
        this.registerModule('measure', MeasureModule);
        this.registerModule('letter', LetterModule);
        
        // 初始化已注册的模块
        Object.values(this.modules).forEach(module => {
            if (module.init) {
                module.init();
            }
        });
    },
    
    /**
     * 注册模块
     */
    registerModule(name, module) {
        this.modules[name] = module;
    },
    
    /**
     * 显示指定模块
     */
    showModule(moduleName) {
        // 管理员权限检查
        if ((moduleName === 'userManagement' || moduleName === 'dataExport') && !Auth.isAdmin()) {
            return;
        }
        
        // 更新导航状态
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.module === moduleName);
        });
        
        // 隐藏所有模块页面
        document.querySelectorAll('.module-page').forEach(page => {
            page.classList.remove('active');
        });
        
        // 显示目标模块页面
        const targetPage = document.getElementById(`${moduleName}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
        }
        
        // 更新面包屑
        this.updateBreadcrumb(moduleName);
        
        // 调用模块的show方法
        const module = this.modules[moduleName];
        if (module && module.onShow) {
            module.onShow();
        }
        
        // 管理员模块特殊处理
        if (moduleName === 'userManagement' && Auth.isAdmin()) {
            AdminModule.init();
        }
        
        if (moduleName === 'dataExport' && Auth.isAdmin()) {
            AdminModule.bindEvents();
        }
        
        // 更新当前模块
        this.currentModule = moduleName;
    },
    
    /**
     * 更新面包屑
     */
    updateBreadcrumb(moduleName) {
        const breadcrumb = document.getElementById('breadcrumb');
        if (!breadcrumb) return;
        
        const moduleNames = {
            home: '首页',
            chat: '智能对话',
            diary: '心理日记',
            measure: '心理测评',
            letter: '心理信件',
            userManagement: '用户管理',
            dataExport: '数据导出'
        };
        
        breadcrumb.innerHTML = `
            <span class="breadcrumb-item">${moduleNames[moduleName] || moduleName}</span>
        `;
    },
    
    /**
     * 切换侧边栏（移动端）
     */
    toggleSidebar() {
        document.querySelector('.sidebar')?.classList.toggle('open');
    },
    
    /**
     * 显示Toast通知
     */
    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        
        toast.innerHTML = `
            <div class="toast-icon">${icons[type] || icons.info}</div>
            <div class="toast-message">${message}</div>
        `;
        
        this.toastContainer.appendChild(toast);
        
        // 自动移除
        setTimeout(() => {
            toast.classList.add('hiding');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, duration);
    },
    
    /**
     * 显示确认弹窗
     */
    showConfirm(options) {
        return new Promise((resolve) => {
            const { title, message, confirmText = '确定', cancelText = '取消', danger = false } = options;
            
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay active';
            overlay.innerHTML = `
                <div class="modal">
                    <div class="modal-header">
                        <h3 class="modal-title">${title}</h3>
                        <button class="modal-close" onclick="this.closest('.modal-overlay').classList.remove('active'); resolve(false);">✕</button>
                    </div>
                    <div class="modal-body">
                        <p>${message}</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').classList.remove('active'); resolve(false);">${cancelText}</button>
                        <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" onclick="this.closest('.modal-overlay').classList.remove('active'); resolve(true);">${confirmText}</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(overlay);
            
            // 点击遮罩关闭
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.classList.remove('active');
                    resolve(false);
                }
            });
        });
    },
    
    /**
     * 更新首页统计
     */
    updateHomeStats() {
        const currentUser = Auth.getCurrentUser();
        if (!currentUser) return;
        
        // 获取当前前缀
        const prefix = ProjectManager.getUserPrefix();
        const basePrefix = `xzpark_${currentUser.username}_`;
        
        // 如果在项目模式下，统计项目数据
        // 如果在全局模式，统计全局数据
        
        // 统计日记数量
        const diaryEntries = JSON.parse(localStorage.getItem(prefix + 'diary_entries') || '[]');
        const diaryCount = diaryEntries.length;
        
        // 统计测评数量
        const measureResults = JSON.parse(localStorage.getItem(prefix + 'measure_results') || '[]');
        const measureCount = measureResults.length;
        
        // 统计对话数量
        const conversations = JSON.parse(localStorage.getItem(prefix + 'chat_conversations') || '[]');
        const chatCount = conversations.reduce((sum, c) => sum + (c.messages?.length || 0), 0);
        
        // 统计信件数量
        const letters = JSON.parse(localStorage.getItem(prefix + 'letter_entries') || '[]');
        const letterCount = letters.length;
        
        // 更新DOM
        const diaryStat = document.getElementById('stat-diary-count');
        if (diaryStat) diaryStat.textContent = diaryCount;
        
        const measureStat = document.getElementById('stat-measure-count');
        if (measureStat) measureStat.textContent = measureCount;
        
        const chatStat = document.getElementById('stat-chat-count');
        if (chatStat) chatStat.textContent = chatCount;
        
        const letterStat = document.getElementById('stat-letter-count');
        if (letterStat) letterStat.textContent = letterCount;
        
        // 更新项目统计
        if (ProjectManager.currentProject) {
            ProjectManager.updateProjectStats('chat', conversations.length);
            ProjectManager.updateProjectStats('measure', measureCount);
            ProjectManager.updateProjectStats('diary', diaryCount);
            ProjectManager.updateProjectStats('letter', letterCount);
        }
    },
    
    /**
     * 导出所有数据
     */
    exportAllData() {
        const currentUser = Auth.getCurrentUser();
        if (!currentUser) return;
        
        const prefix = `xzpark_${currentUser.username}_`;
        
        const data = {
            exportedAt: new Date().toISOString(),
            user: currentUser.username,
            diaryEntries: JSON.parse(localStorage.getItem(prefix + 'diary_entries') || '[]'),
            measureResults: JSON.parse(localStorage.getItem(prefix + 'measure_results') || '[]'),
            chatConversations: JSON.parse(localStorage.getItem(prefix + 'chat_conversations') || '[]'),
            letterEntries: JSON.parse(localStorage.getItem(prefix + 'letter_entries') || '[]')
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `小智的数智乐园_${currentUser.username}_数据_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showToast('数据已导出', 'success');
    },
    
    /**
     * 清除所有数据
     */
    async clearAllData() {
        const confirmed = await this.showConfirm({
            title: '清除所有数据',
            message: '确定要清除所有数据吗？此操作不可恢复。',
            confirmText: '确定清除',
            danger: true
        });
        
        if (!confirmed) return;
        
        const currentUser = Auth.getCurrentUser();
        if (!currentUser) return;
        
        const prefix = ProjectManager.getUserPrefix();
        
        localStorage.removeItem(prefix + 'diary_entries');
        localStorage.removeItem(prefix + 'measure_results');
        localStorage.removeItem(prefix + 'chat_conversations');
        localStorage.removeItem(prefix + 'chat_current_conversation');
        localStorage.removeItem(prefix + 'letter_entries');
        
        this.showToast('所有数据已清除', 'success');
        this.updateHomeStats();
        
        // 刷新当前模块
        if (this.modules[this.currentModule]?.init) {
            this.modules[this.currentModule].init();
        }
    },
    
    /**
     * 退出登录
     */
    logout() {
        Auth.logout();
    },
    
    /**
     * 格式化日期
     */
    formatDate(date, format = 'full') {
        const d = new Date(date);
        
        if (format === 'full') {
            return d.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
            });
        }
        
        if (format === 'short') {
            return d.toLocaleDateString('zh-CN', {
                month: 'short',
                day: 'numeric'
            });
        }
        
        return d.toLocaleDateString('zh-CN');
    },
    
    /**
     * 获取问候语
     */
    getGreeting() {
        const hour = new Date().getHours();
        
        if (hour < 6) return '夜深了';
        if (hour < 9) return '早上好';
        if (hour < 12) return '上午好';
        if (hour < 14) return '中午好';
        if (hour < 18) return '下午好';
        if (hour < 22) return '晚上好';
        return '夜深了';
    }
};

// ==================== 页面加载完成后初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// ==================== 首页模块特定逻辑 ====================
const HomeModule = {
    init() {
        App.updateHomeStats();
    },
    
    goToModule(moduleName) {
        App.showModule(moduleName);
    }
};

// 绑定首页模块卡片点击事件
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.home-module-card').forEach(card => {
        card.addEventListener('click', () => {
            const module = card.dataset.module;
            if (module) HomeModule.goToModule(module);
        });
    });
    
    // 绑定新建对话按钮
    const newChatCard = document.querySelector('[data-module="chat"]');
    if (newChatCard) {
        newChatCard.addEventListener('click', () => {
            if (ChatModule) {
                ChatModule.createNewConversation();
            }
            HomeModule.goToModule('chat');
        });
    }
});