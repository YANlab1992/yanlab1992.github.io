/**
 * 心理测评模块 - modules/measure.js
 * 标准化心理量表测评、数据可视化、AI解读
 */

const MeasureModule = {
    // 模块状态
    isOpen: false,
    currentScale: null,
    currentQuestionIndex: 0,
    answers: {},
    results: [],
    
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
     * 初始化测评模块
     */
    init() {
        this.loadResults();
        this.bindEvents();
        this.renderScaleList();
        this.renderHistory();
    },
    
    /**
     * 加载测评历史
     */
    loadResults() {
        const prefix = this.getUserPrefix();
        const saved = localStorage.getItem(prefix + 'measure_results');
        if (saved) {
            try {
                this.results = JSON.parse(saved);
            } catch (e) {
                this.results = [];
            }
        }
    },
    
    /**
     * 保存测评历史
     */
    saveResults() {
        const prefix = this.getUserPrefix();
        localStorage.setItem(prefix + 'measure_results', JSON.stringify(this.results));
    },
    
    /**
     * 绑定事件
     */
    bindEvents() {
        // 返回按钮
        const backBtn = document.getElementById('measure-back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.showScaleList());
        }
        
        // 导出历史
        const exportBtn = document.getElementById('measure-export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportResults());
        }
    },
    
    /**
     * 渲染量表列表
     */
    renderScaleList() {
        const container = document.getElementById('measure-scale-list');
        if (!container) return;
        
        const scales = getScaleList();
        
        // 按类别分组
        const categories = {};
        scales.forEach(scale => {
            if (!categories[scale.category]) {
                categories[scale.category] = [];
            }
            categories[scale.category].push(scale);
        });
        
        const categoryIcons = {
            '情绪状态': 'emotion',
            '主观幸福感': 'wellbeing',
            '心理弹性': 'resilience',
            '社会认知': 'social',
            '睡眠质量': 'sleep',
            '压力应对': 'stress'
        };
        
        container.innerHTML = Object.entries(categories).map(([category, scaleList]) => `
            <div class="measure-category">
                <h3 class="measure-category-title">${category}</h3>
                <div class="measure-container">
                    ${scaleList.map(scale => `
                        <div class="scale-card" data-scale-id="${scale.id}">
                            <div class="scale-card-header">
                                <div class="scale-icon ${categoryIcons[category] || 'emotion'}">
                                    ${this.getCategoryIcon(category)}
                                </div>
                                <div class="scale-info">
                                    <div class="scale-name">${scale.name}</div>
                                    <span class="scale-category">${scale.shortName}</span>
                                </div>
                            </div>
                            <p class="scale-description">${scale.description}</p>
                            <div class="scale-meta">
                                <div class="scale-meta-item">
                                    <span>📋</span>
                                    <span>${scale.itemCount}题</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
        
        // 绑定点击事件
        container.querySelectorAll('.scale-card').forEach(card => {
            card.addEventListener('click', () => {
                const scaleId = card.dataset.scaleId;
                this.startScale(scaleId);
            });
        });
    },
    
    /**
     * 获取类别图标
     */
    getCategoryIcon(category) {
        const icons = {
            '情绪状态': '😔',
            '主观幸福感': '😊',
            '心理弹性': '💪',
            '社会认知': '🤝',
            '睡眠质量': '😴',
            '压力应对': '🎯'
        };
        return icons[category] || '📊';
    },
    
    /**
     * 开始测评
     */
    startScale(scaleId) {
        const scale = getScale(scaleId);
        if (!scale) {
            console.error('Scale not found:', scaleId);
            App.showToast('量表加载失败', 'error');
            return;
        }
        
        this.currentScale = scale;
        this.currentQuestionIndex = 0;
        this.answers = {};
        
        this.showQuestion();
    },
    
    /**
     * 显示题目
     */
    showQuestion() {
        const container = document.getElementById('measure-question');
        const progressContainer = document.getElementById('measure-progress');
        const listContainer = document.getElementById('measure-scale-list');
        const historyContainer = document.getElementById('measure-history');
        
        if (!container) return;
        
        // 隐藏列表和历史，显示题目
        if (listContainer) listContainer.style.display = 'none';
        if (historyContainer) historyContainer.style.display = 'none';
        if (progressContainer) progressContainer.style.display = 'flex';
        container.style.display = 'block';
        
        const item = this.currentScale.items[this.currentQuestionIndex];
        const totalItems = this.currentScale.items.length;
        const progress = ((this.currentQuestionIndex) / totalItems) * 100;
        
        // 更新进度
        const progressFill = document.getElementById('measure-progress-fill');
        const progressText = document.getElementById('measure-progress-text');
        if (progressFill) progressFill.style.width = `${progress}%`;
        if (progressText) progressText.textContent = `${this.currentQuestionIndex + 1}/${totalItems}`;
        
        // 渲染题目
        if (item.subItems) {
            // 包含子题目的题目（如PSQI）
            container.innerHTML = `
                <div class="scale-item">
                    <div class="scale-item-header">
                        <div class="scale-item-number">题目 ${this.currentQuestionIndex + 1}</div>
                        <div class="scale-item-text">${item.text}</div>
                    </div>
                    <div class="scale-options">
                        ${item.subItems.map(subItem => `
                            <div class="scale-item" style="margin-bottom: 16px;">
                                <div class="scale-item-header">
                                    <div class="scale-item-text" style="font-size: var(--font-size-md); margin-bottom: var(--spacing-md);">${subItem.text}</div>
                                </div>
                                <div class="scale-options">
                                    ${subItem.options.map((opt, optIndex) => `
                                        <div class="scale-option" data-item="${subItem.id}" data-value="${opt.value}">
                                            <div class="scale-option-radio"></div>
                                            <span class="scale-option-label">${opt.label}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="scale-option-nav">
                        ${this.currentQuestionIndex > 0 ? `
                            <button class="btn btn-secondary" onclick="MeasureModule.prevQuestion()">上一题</button>
                        ` : '<div></div>'}
                        <button class="btn btn-primary" onclick="MeasureModule.nextQuestion()">下一题</button>
                    </div>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="scale-item">
                    <div class="scale-item-header">
                        <div class="scale-item-number">题目 ${this.currentQuestionIndex + 1}</div>
                        <div class="scale-item-text">${item.text}</div>
                    </div>
                    <div class="scale-options">
                        ${item.options.map((opt, optIndex) => `
                            <div class="scale-option ${this.answers[item.id] === opt.value ? 'selected' : ''}" 
                                 data-item="${item.id}" 
                                 data-value="${opt.value}">
                                <div class="scale-option-radio"></div>
                                <span class="scale-option-label">${opt.label}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="scale-option-nav">
                        ${this.currentQuestionIndex > 0 ? `
                            <button class="btn btn-secondary" onclick="MeasureModule.prevQuestion()">上一题</button>
                        ` : '<div></div>'}
                        <button class="btn btn-primary" onclick="MeasureModule.nextQuestion()">
                            ${this.currentQuestionIndex === totalItems - 1 ? '查看结果' : '下一题'}
                        </button>
                    </div>
                </div>
            `;
        }
        
        // 绑定选项点击事件
        this.bindOptionEvents();
    },
    
    /**
     * 绑定选项点击事件
     */
    bindOptionEvents() {
        const container = document.getElementById('measure-question');
        const item = this.currentScale.items[this.currentQuestionIndex];
        
        container.querySelectorAll('.scale-option').forEach(option => {
            option.addEventListener('click', () => {
                const itemId = option.dataset.item;
                const value = parseInt(option.dataset.value);
                
                // 如果是子题
                if (item.subItems) {
                    // 清除同题目的其他选项
                    const parentScaleItem = option.closest('.scale-item');
                    if (parentScaleItem) {
                        parentScaleItem.querySelectorAll('.scale-option').forEach(opt => {
                            opt.classList.remove('selected');
                        });
                        option.classList.add('selected');
                        this.answers[itemId] = value;
                    }
                } else {
                    // 单选题：清除同题目的其他选项
                    container.querySelectorAll(`.scale-option[data-item="${itemId}"]`).forEach(opt => {
                        opt.classList.remove('selected');
                    });
                    option.classList.add('selected');
                    this.answers[itemId] = value;
                }
            });
        });
    },
    
    /**
     * 下一题
     */
    nextQuestion() {
        const item = this.currentScale.items[this.currentQuestionIndex];
        
        // 检查是否已作答
        if (!item.subItems && this.answers[item.id] === undefined) {
            App.showToast('请选择一个选项', 'warning');
            return;
        }
        
        // 如果是子题，检查是否所有子题都已作答
        if (item.subItems) {
            const unanswered = item.subItems.filter(sub => this.answers[sub.id] === undefined);
            if (unanswered.length > 0) {
                App.showToast('请回答所有子问题', 'warning');
                return;
            }
        }
        
        if (this.currentQuestionIndex < this.currentScale.items.length - 1) {
            this.currentQuestionIndex++;
            this.showQuestion();
        } else {
            this.submitScale();
        }
    },
    
    /**
     * 上一题
     */
    prevQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.showQuestion();
        }
    },
    
    /**
     * 提交测评
     */
    submitScale() {
        // 计算结果
        const result = calculateScaleResult(this.currentScale.id, this.answers);
        
        if (!result) {
            App.showToast('结果计算失败', 'error');
            return;
        }
        
        // 保存结果
        const resultEntry = {
            id: Date.now().toString(),
            scaleId: this.currentScale.id,
            scaleName: this.currentScale.name,
            answers: { ...this.answers },
            result,
            completedAt: new Date().toISOString()
        };
        
        this.results.unshift(resultEntry);
        this.saveResults();
        
        // 显示结果
        this.showResult(resultEntry);
    },
    
    /**
     * 显示结果
     */
    showResult(resultEntry) {
        const container = document.getElementById('measure-question');
        const progressContainer = document.getElementById('measure-progress');
        const scaleList = document.getElementById('measure-scale-list');
        const historyContainer = document.getElementById('measure-history');
        
        if (!container) return;
        
        if (progressContainer) progressContainer.style.display = 'none';
        if (scaleList) scaleList.style.display = 'none';
        if (historyContainer) historyContainer.style.display = 'none';
        container.style.display = 'block';
        
        const result = resultEntry.result;
        const interpretation = result.interpretation;
        
        // 构建结果HTML
        let resultHTML = `
            <div class="result-container">
                <div class="result-card">
                    <div class="result-header">
                        <div class="result-score">${result.totalScore !== undefined ? result.totalScore : (result.positiveScore + ' / ' + result.negativeScore)}</div>
                        <div class="result-label" style="color: ${interpretation ? interpretation.color : '#666'}">
                            ${interpretation ? interpretation.label : (result.positiveInterpretation?.label + ' / ' + result.negativeInterpretation?.label)}
                        </div>
                    </div>
                    <div class="result-advice">
                        ${interpretation ? interpretation.advice : (result.positiveInterpretation?.advice + '<br><br>' + result.negativeInterpretation?.advice)}
                    </div>
                    ${result.crisis ? `
                        <div class="result-warning">
                            <div class="result-warning-icon">⚠️</div>
                            <div class="result-warning-text">
                                <div class="result-warning-title">注意</div>
                                <div class="result-warning-content">${result.crisis}</div>
                            </div>
                        </div>
                    ` : ''}
                </div>
                <div class="result-card">
                    <div class="card-title mb-md">
                        <span>📊</span> 测评信息
                    </div>
                    <div class="result-advice">
                        <p><strong>量表名称：</strong>${result.scaleName}</p>
                        <p><strong>测评时间：</strong>${new Date(resultEntry.completedAt).toLocaleString('zh-CN')}</p>
                        ${result.totalScore !== undefined ? `
                            <p><strong>您的得分：</strong>${result.totalScore}分</p>
                            <p><strong>满分：</strong>${result.maxScore}分</p>
                        ` : ''}
                    </div>
                    <div class="mt-lg">
                        <div class="card-title mb-md">
                            <span>💡</span> 如何提升
                        </div>
                        <div class="result-advice">
                            ${result.resources || result.advice}
                        </div>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-between mt-lg">
                <button class="btn btn-secondary" onclick="MeasureModule.showScaleList()">返回量表列表</button>
                <button class="btn btn-primary" onclick="MeasureModule.startScale('${resultEntry.scaleId}')">再次测评</button>
            </div>
            <div class="mt-md text-center">
                <p class="text-secondary" style="font-size: var(--font-size-sm);">
                    ⚠️ 本测评为自评工具，结果仅供参考。如有困扰，请咨询专业心理工作者。
                </p>
            </div>
        `;
        
        container.innerHTML = resultHTML;
        
        // 渲染图表
        this.renderResultChart(resultEntry);
    },
    
    /**
     * 渲染结果图表
     */
    renderResultChart(resultEntry) {
        const chartContainer = document.getElementById('result-chart-container');
        if (chartContainer) {
            chartContainer.style.display = 'block';
        }
        
        const canvas = document.getElementById('result-radar-chart');
        if (!canvas) return;
        
        const result = resultEntry.result;
        
        // 如果是PANAS，渲染双柱状图
        if (result.positiveScore !== undefined) {
            const ctx = canvas.getContext('2d');
            
            // 清除旧图表
            if (window.resultChartInstance) {
                window.resultChartInstance.destroy();
            }
            
            window.resultChartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['积极情感', '消极情感'],
                    datasets: [{
                        label: '您的得分',
                        data: [result.positiveScore, result.negativeScore],
                        backgroundColor: [
                            'rgba(76, 175, 80, 0.7)',
                            'rgba(244, 67, 54, 0.7)'
                        ],
                        borderColor: [
                            'rgba(76, 175, 80, 1)',
                            'rgba(244, 67, 54, 1)'
                        ],
                        borderWidth: 2,
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 25,
                            ticks: {
                                stepSize: 5
                            }
                        }
                    }
                }
            });
        }
    },
    
    /**
     * 返回量表列表
     */
    showScaleList() {
        const container = document.getElementById('measure-question');
        const progressContainer = document.getElementById('measure-progress');
        const listContainer = document.getElementById('measure-scale-list');
        const historyContainer = document.getElementById('measure-history');
        const chartContainer = document.getElementById('result-chart-container');
        
        if (container) container.style.display = 'none';
        if (progressContainer) progressContainer.style.display = 'none';
        if (listContainer) listContainer.style.display = 'block';
        if (historyContainer) historyContainer.style.display = 'none';
        if (chartContainer) chartContainer.style.display = 'none';
        
        this.renderScaleList();
    },
    
    /**
     * 显示测评历史
     */
    showHistory() {
        const container = document.getElementById('measure-question');
        const progressContainer = document.getElementById('measure-progress');
        const listContainer = document.getElementById('measure-scale-list');
        const historyContainer = document.getElementById('measure-history');
        
        if (container) container.style.display = 'none';
        if (progressContainer) progressContainer.style.display = 'none';
        if (listContainer) listContainer.style.display = 'none';
        if (historyContainer) historyContainer.style.display = 'block';
        
        this.renderHistory();
    },
    
    /**
     * 渲染测评历史
     */
    renderHistory() {
        const container = document.getElementById('measure-history-list');
        if (!container) return;
        
        if (this.results.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📋</div>
                    <div class="empty-state-title">暂无测评记录</div>
                    <div class="empty-state-desc">完成测评后，结果会显示在这里</div>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.results.slice(0, 10).map(result => {
            const date = new Date(result.completedAt).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            const interpretation = result.result.interpretation;
            
            return `
                <div class="history-item" onclick="MeasureModule.viewResult('${result.id}')">
                    <div class="history-item-title">
                        <span>${result.scaleName}</span>
                        <span class="scale-category" style="background: ${interpretation ? interpretation.color : '#666'}20; color: ${interpretation ? interpretation.color : '#666'};">
                            ${interpretation ? interpretation.label : '已完成'}
                        </span>
                    </div>
                    <div class="history-item-date">${date}</div>
                    <div class="history-item-preview">
                        得分：${result.result.totalScore !== undefined ? result.result.totalScore : (result.result.positiveScore + '/' + result.result.negativeScore)}
                    </div>
                </div>
            `;
        }).join('');
    },
    
    /**
     * 查看历史结果
     */
    viewResult(resultId) {
        const result = this.results.find(r => r.id === resultId);
        if (result) {
            this.showResult(result);
        }
    },
    
    /**
     * 导出结果
     */
    exportResults() {
        if (this.results.length === 0) {
            App.showToast('暂无测评数据', 'warning');
            return;
        }
        
        const data = this.results.map(r => ({
            scaleName: r.scaleName,
            completedAt: r.completedAt,
            result: r.result.totalScore !== undefined 
                ? { score: r.result.totalScore, maxScore: r.result.maxScore, interpretation: r.result.interpretation?.label }
                : { positiveScore: r.result.positiveScore, negativeScore: r.result.negativeScore }
        }));
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `心理测评结果_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        App.showToast('测评结果已导出', 'success');
    }
};

// 初始化
if (typeof App !== 'undefined') {
    App.registerModule('measure', MeasureModule);
}