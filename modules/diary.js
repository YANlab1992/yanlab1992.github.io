/**
 * 心理日记模块 - modules/diary.js
 * 每日心情记录、日历视图、数据导出
 */

const DiaryModule = {
    // 模块状态
    isOpen: false,
    currentDate: new Date(),
    selectedDate: null,
    entries: [],
    
    // 心情选项
    moods: [
        { id: 'happy', icon: '😊', label: '开心', color: '#FFD54F' },
        { id: 'excited', icon: '🤩', label: '兴奋', color: '#FF8A65' },
        { id: 'calm', icon: '😌', label: '平静', color: '#81C784' },
        { id: 'tired', icon: '😴', label: '疲惫', color: '#B0BEC5' },
        { id: 'anxious', icon: '😰', label: '焦虑', color: '#FFB74D' },
        { id: 'sad', icon: '😢', label: '难过', color: '#64B5F6' },
        { id: 'angry', icon: '😠', label: '生气', color: '#E57373' },
        { id: 'confused', icon: '😕', label: '迷茫', color: '#BA68C8' }
    ],
    
    // 标签选项
    tags: [
        '工作', '学习', '人际关系', '家庭', '感情', 
        '健康', '睡眠', '饮食', '运动', '娱乐',
        '旅行', '购物', '社交', '独处', '创造'
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
     * 初始化日记模块
     */
    init() {
        this.loadEntries();
        this.bindEvents();
        this.renderCalendar();
        this.renderMoodSelector();
        this.renderTagSelector();
        this.renderEntriesList();
    },
    
    /**
     * 加载日记数据
     */
    loadEntries() {
        const prefix = this.getUserPrefix();
        const saved = localStorage.getItem(prefix + 'diary_entries');
        if (saved) {
            try {
                this.entries = JSON.parse(saved);
            } catch (e) {
                this.entries = [];
            }
        }
    },
    
    /**
     * 保存日记数据
     */
    saveEntries() {
        const prefix = this.getUserPrefix();
        localStorage.setItem(prefix + 'diary_entries', JSON.stringify(this.entries));
    },
    
    /**
     * 绑定事件
     */
    bindEvents() {
        // 日历导航
        const prevMonthBtn = document.getElementById('diary-prev-month');
        const nextMonthBtn = document.getElementById('diary-next-month');
        const todayBtn = document.getElementById('diary-today');
        
        if (prevMonthBtn) {
            prevMonthBtn.addEventListener('click', () => this.changeMonth(-1));
        }
        if (nextMonthBtn) {
            nextMonthBtn.addEventListener('click', () => this.changeMonth(1));
        }
        if (todayBtn) {
            todayBtn.addEventListener('click', () => this.goToToday());
        }
        
        // 保存日记
        const saveBtn = document.getElementById('diary-save-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveEntry());
        }
        
        // 导出数据
        const exportBtn = document.getElementById('diary-export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }
        
        // 清除当前日记
        const clearBtn = document.getElementById('diary-clear-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearEntry());
        }
    },
    
    /**
     * 渲染心情选择器
     */
    renderMoodSelector() {
        const container = document.getElementById('diary-mood-selector');
        if (!container) return;
        
        container.innerHTML = this.moods.map(mood => `
            <div class="mood-option" data-mood="${mood.id}">
                <span class="mood-icon">${mood.icon}</span>
                <span class="mood-label">${mood.label}</span>
            </div>
        `).join('');
        
        // 绑定点击事件
        container.querySelectorAll('.mood-option').forEach(option => {
            option.addEventListener('click', () => {
                container.querySelectorAll('.mood-option').forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
            });
        });
    },
    
    /**
     * 渲染标签选择器
     */
    renderTagSelector() {
        const container = document.getElementById('diary-tag-selector');
        if (!container) return;
        
        container.innerHTML = this.tags.map(tag => `
            <span class="diary-tag" data-tag="${tag}">${tag}</span>
        `).join('');
        
        // 绑定点击事件
        container.querySelectorAll('.diary-tag').forEach(tagEl => {
            tagEl.addEventListener('click', () => {
                tagEl.classList.toggle('selected');
            });
        });
    },
    
    /**
     * 渲染日历
     */
    renderCalendar() {
        const container = document.getElementById('diary-calendar-grid');
        const titleEl = document.getElementById('diary-calendar-title');
        
        if (!container) return;
        
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // 更新标题
        if (titleEl) {
            titleEl.textContent = `${year}年${month + 1}月`;
        }
        
        // 获取本月第一天和最后一天
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        // 获取上月的最后几天
        const startDayOfWeek = firstDay.getDay();
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        
        // 计算总天数
        const totalDays = startDayOfWeek + lastDay.getDate();
        const rows = Math.ceil(totalDays / 7);
        
        // 生成日历网格
        let html = '<div class="calendar-weekday">日</div>';
        html += '<div class="calendar-weekday">一</div>';
        html += '<div class="calendar-weekday">二</div>';
        html += '<div class="calendar-weekday">三</div>';
        html += '<div class="calendar-weekday">四</div>';
        html += '<div class="calendar-weekday">五</div>';
        html += '<div class="calendar-weekday">六</div>';
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const selectedDateStr = this.selectedDate ? this.formatDateKey(this.selectedDate) : null;
        
        let dayCount = 1;
        let nextMonthDay = 1;
        
        for (let i = 0; i < rows * 7; i++) {
            let dayClass = 'calendar-day';
            let dayContent = '';
            
            if (i < startDayOfWeek) {
                // 上月日期
                const prevDay = prevMonthLastDay - startDayOfWeek + i + 1;
                dayClass += ' other-month';
                dayContent = prevDay;
            } else if (dayCount <= lastDay.getDate()) {
                // 本月日期
                const currentDay = dayCount;
                const dateObj = new Date(year, month, currentDay);
                const dateKey = this.formatDateKey(dateObj);
                
                // 检查是否有日记
                const hasEntry = this.entries.some(e => e.dateKey === dateKey);
                if (hasEntry) {
                    dayClass += ' has-entry';
                }
                
                // 检查是否是今天
                if (dateObj.getTime() === today.getTime()) {
                    dayClass += ' today';
                }
                
                // 检查是否是选中日期
                if (dateKey === selectedDateStr) {
                    dayClass += ' selected';
                }
                
                dayContent = currentDay;
                dayCount++;
            } else {
                // 下月日期
                dayClass += ' other-month';
                dayContent = nextMonthDay;
                nextMonthDay++;
            }
            
            html += `<div class="${dayClass}" data-day="${dayContent}" data-month="${month}" data-year="${year}">${dayContent}</div>`;
        }
        
        container.innerHTML = html;
        
        // 绑定点击事件
        container.querySelectorAll('.calendar-day:not(.other-month)').forEach(dayEl => {
            dayEl.addEventListener('click', () => {
                const year = parseInt(dayEl.dataset.year);
                const month = parseInt(dayEl.dataset.month);
                const day = parseInt(dayEl.dataset.day);
                this.selectDate(new Date(year, month, day));
            });
        });
    },
    
    /**
     * 渲染日记列表
     */
    renderEntriesList() {
        const container = document.getElementById('diary-entries-list');
        if (!container) return;
        
        // 获取当月有日记的日期
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const monthEntries = this.entries.filter(e => {
            const d = new Date(e.dateKey);
            return d.getFullYear() === year && d.getMonth() === month;
        });
        
        if (monthEntries.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📔</div>
                    <div class="empty-state-title">本月暂无日记</div>
                    <div class="empty-state-desc">点击日期开始记录今天的日记吧</div>
                </div>
            `;
            return;
        }
        
        // 按日期倒序
        monthEntries.sort((a, b) => new Date(b.dateKey) - new Date(a.dateKey));
        
        container.innerHTML = monthEntries.map(entry => {
            const mood = this.moods.find(m => m.id === entry.mood);
            const date = new Date(entry.dateKey);
            const dateStr = date.toLocaleDateString('zh-CN', { 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
            });
            
            return `
                <div class="history-item" data-date="${entry.dateKey}">
                    <div class="history-item-title">
                        <span>${mood ? mood.icon : '📝'} ${dateStr}</span>
                    </div>
                    <div class="history-item-preview">${entry.content.substring(0, 100)}...</div>
                </div>
            `;
        }).join('');
        
        // 绑定点击事件
        container.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                const dateKey = item.dataset.date;
                const date = new Date(dateKey);
                this.selectDate(date);
            });
        });
    },
    
    /**
     * 选择日期
     */
    selectDate(date) {
        this.selectedDate = date;
        
        // 查找该日期的日记
        const dateKey = this.formatDateKey(date);
        const entry = this.entries.find(e => e.dateKey === dateKey);
        
        // 更新日历选中状态
        document.querySelectorAll('.calendar-day').forEach(el => el.classList.remove('selected'));
        const todayEl = document.querySelector(`.calendar-day[data-day="${date.getDate()}"]:not(.other-month)`);
        if (todayEl) {
            todayEl.classList.add('selected');
        }
        
        if (entry) {
            // 加载已有日记
            this.loadEntryToEditor(entry);
        } else {
            // 清空编辑器
            this.clearEditor();
        }
        
        // 显示日记编辑器
        this.showEditor();
    },
    
    /**
     * 加载日记到编辑器
     */
    loadEntryToEditor(entry) {
        const contentInput = document.getElementById('diary-content');
        if (contentInput) {
            contentInput.value = entry.content || '';
        }
        
        // 设置心情
        if (entry.mood) {
            document.querySelectorAll('#diary-mood-selector .mood-option').forEach(el => {
                el.classList.toggle('selected', el.dataset.mood === entry.mood);
            });
        }
        
        // 设置标签
        if (entry.tags) {
            document.querySelectorAll('#diary-tag-selector .diary-tag').forEach(el => {
                el.classList.toggle('selected', entry.tags.includes(el.dataset.tag));
            });
        }
        
        // 更新标题
        const titleEl = document.getElementById('diary-editor-title');
        if (titleEl) {
            const date = new Date(entry.dateKey);
            titleEl.textContent = date.toLocaleDateString('zh-CN', { 
                month: 'long', 
                day: 'numeric'
            });
        }
    },
    
    /**
     * 清空编辑器
     */
    clearEditor() {
        const contentInput = document.getElementById('diary-content');
        if (contentInput) {
            contentInput.value = '';
        }
        
        document.querySelectorAll('#diary-mood-selector .mood-option').forEach(el => {
            el.classList.remove('selected');
        });
        
        document.querySelectorAll('#diary-tag-selector .diary-tag').forEach(el => {
            el.classList.remove('selected');
        });
        
        const titleEl = document.getElementById('diary-editor-title');
        if (titleEl && this.selectedDate) {
            titleEl.textContent = this.selectedDate.toLocaleDateString('zh-CN', { 
                month: 'long', 
                day: 'numeric'
            });
        }
    },
    
    /**
     * 显示编辑器
     */
    showEditor() {
        const editor = document.getElementById('diary-editor-section');
        if (editor) {
            editor.style.display = 'block';
        }
    },
    
    /**
     * 保存日记
     */
    saveEntry() {
        if (!this.selectedDate) {
            this.selectedDate = new Date();
        }
        
        const contentInput = document.getElementById('diary-content');
        const content = contentInput ? contentInput.value.trim() : '';
        
        if (!content) {
            App.showToast('请输入日记内容', 'warning');
            return;
        }
        
        // 获取选中的心情
        const selectedMood = document.querySelector('#diary-mood-selector .mood-option.selected');
        const mood = selectedMood ? selectedMood.dataset.mood : null;
        
        // 获取选中的标签
        const selectedTags = Array.from(document.querySelectorAll('#diary-tag-selector .diary-tag.selected'))
            .map(el => el.dataset.tag);
        
        const dateKey = this.formatDateKey(this.selectedDate);
        
        // 查找是否已有日记
        const existingIndex = this.entries.findIndex(e => e.dateKey === dateKey);
        
        const entry = {
            id: existingIndex >= 0 ? this.entries[existingIndex].id : Date.now().toString(),
            dateKey,
            mood,
            tags: selectedTags,
            content,
            updatedAt: new Date().toISOString()
        };
        
        if (existingIndex >= 0) {
            this.entries[existingIndex] = entry;
        } else {
            this.entries.push(entry);
        }
        
        this.saveEntries();
        this.renderCalendar();
        this.renderEntriesList();
        
        App.showToast('日记已保存', 'success');
    },
    
    /**
     * 清除日记
     */
    clearEntry() {
        if (!this.selectedDate) return;
        
        const dateKey = this.formatDateKey(this.selectedDate);
        const existingIndex = this.entries.findIndex(e => e.dateKey === dateKey);
        
        if (existingIndex >= 0) {
            this.entries.splice(existingIndex, 1);
            this.saveEntries();
            this.clearEditor();
            this.renderCalendar();
            this.renderEntriesList();
            App.showToast('日记已删除', 'success');
        }
    },
    
    /**
     * 导出数据
     */
    exportData() {
        if (this.entries.length === 0) {
            App.showToast('暂无日记数据', 'warning');
            return;
        }
        
        // 导出为JSON
        const jsonData = JSON.stringify(this.entries, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `心理日记_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        // 同时导出为文本
        const textContent = this.entries.map(entry => {
            const mood = this.moods.find(m => m.id === entry.mood);
            const date = new Date(entry.dateKey).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
            });
            
            return `【${date}】${mood ? mood.icon : ''}${mood ? mood.label : ''}\n${entry.tags.length > 0 ? '标签: ' + entry.tags.join(', ') + '\n' : ''}\n${entry.content}\n`;
        }).join('\n' + '='.repeat(50) + '\n\n');
        
        const textBlob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
        const textUrl = URL.createObjectURL(textBlob);
        const textA = document.createElement('a');
        textA.href = textUrl;
        textA.download = `心理日记_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.txt`;
        textA.click();
        URL.revokeObjectURL(textUrl);
        
        App.showToast('日记已导出（JSON和TXT格式）', 'success');
    },
    
    /**
     * 更改月份
     */
    changeMonth(delta) {
        this.currentDate.setMonth(this.currentDate.getMonth() + delta);
        this.renderCalendar();
        this.renderEntriesList();
    },
    
    /**
     * 回到今天
     */
    goToToday() {
        this.currentDate = new Date();
        this.selectedDate = new Date();
        this.renderCalendar();
        this.renderEntriesList();
        this.clearEditor();
    },
    
    /**
     * 格式化日期键
     */
    formatDateKey(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },
    
    /**
     * 获取统计数据
     */
    getStats() {
        const totalEntries = this.entries.length;
        const moodCounts = {};
        
        this.entries.forEach(entry => {
            if (entry.mood) {
                moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
            }
        });
        
        // 获取最常用的心情
        let mostCommonMood = null;
        let maxCount = 0;
        Object.entries(moodCounts).forEach(([mood, count]) => {
            if (count > maxCount) {
                maxCount = count;
                mostCommonMood = mood;
            }
        });
        
        return {
            totalEntries,
            moodCounts,
            mostCommonMood: mostCommonMood ? this.moods.find(m => m.id === mostCommonMood) : null
        };
    }
};

// 初始化
if (typeof App !== 'undefined') {
    App.registerModule('diary', DiaryModule);
}