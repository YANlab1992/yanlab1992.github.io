/**
 * 心理量表数据文件
 * 包含标准化的心理测量量表
 * 
 * 符合心理学研究伦理要求：
 * - 仅供自评参考，不作为临床诊断依据
 * - 结果仅存储在用户本地设备
 * - 提供专业帮助资源提示
 */

// ==================== PHQ-9 抑郁量表 ====================
const PHQ9 = {
    id: 'phq9',
    name: 'PHQ-9抑郁筛查量表',
    shortName: '抑郁筛查',
    description: '用于评估过去两周内的抑郁症状严重程度',
    category: '情绪状态',
    developer: 'Kroenke, Spitzer & Williams (2001)',
    items: [
        {
            id: 'phq9_1',
            text: '做事时提不起劲或没有兴趣',
            options: [
                { value: 0, label: '完全不会' },
                { value: 1, label: '好几天' },
                { value: 2, label: '一半以上天数' },
                { value: 3, label: '几乎每天' }
            ]
        },
        {
            id: 'phq9_2',
            text: '感到心情低落、沮丧或绝望',
            options: [
                { value: 0, label: '完全不会' },
                { value: 1, label: '好几天' },
                { value: 2, label: '一半以上天数' },
                { value: 3, label: '几乎每天' }
            ]
        },
        {
            id: 'phq9_3',
            text: '入睡困难、睡不安稳或睡眠过多',
            options: [
                { value: 0, label: '完全不会' },
                { value: 1, label: '好几天' },
                { value: 2, label: '一半以上天数' },
                { value: 3, label: '几乎每天' }
            ]
        },
        {
            id: 'phq9_4',
            text: '感觉疲倦或没有活力',
            options: [
                { value: 0, label: '完全不会' },
                { value: 1, label: '好几天' },
                { value: 2, label: '一半以上天数' },
                { value: 3, label: '几乎每天' }
            ]
        },
        {
            id: 'phq9_5',
            text: '食欲不振或吃太多',
            options: [
                { value: 0, label: '完全不会' },
                { value: 1, label: '好几天' },
                { value: 2, label: '一半以上天数' },
                { value: 3, label: '几乎每天' }
            ]
        },
        {
            id: 'phq9_6',
            text: '觉得自己很糟或觉得自己很失败，或让自己或家人失望',
            options: [
                { value: 0, label: '完全不会' },
                { value: 1, label: '好几天' },
                { value: 2, label: '一半以上天数' },
                { value: 3, label: '几乎每天' }
            ]
        },
        {
            id: 'phq9_7',
            text: '对事物专注有困难，例如阅读报纸或看电视时',
            options: [
                { value: 0, label: '完全不会' },
                { value: 1, label: '好几天' },
                { value: 2, label: '一半以上天数' },
                { value: 3, label: '几乎每天' }
            ]
        },
        {
            id: 'phq9_8',
            text: '动作或说话速度缓慢，或正好相反——烦躁不安、坐立不安，比平时更动得多',
            options: [
                { value: 0, label: '完全不会' },
                { value: 1, label: '好几天' },
                { value: 2, label: '一半以上天数' },
                { value: 3, label: '几乎每天' }
            ]
        },
        {
            id: 'phq9_9',
            text: '有不如死掉或用某种方式伤害自己的念头',
            options: [
                { value: 0, label: '完全不会' },
                { value: 1, label: '好几天' },
                { value: 2, label: '一半以上天数' },
                { value: 3, label: '几乎每天' }
            ]
        }
    ],
    scoring: {
        ranges: [
            { min: 0, max: 4, label: '无或极轻微抑郁', color: '#4CAF50', advice: '继续保持良好的生活习惯和积极心态。' },
            { min: 5, max: 9, label: '轻度抑郁', color: '#FFC107', advice: '建议多进行户外活动，保持规律作息。如症状持续，建议咨询心理专业人员。' },
            { min: 10, max: 14, label: '中度抑郁', color: '#FF9800', advice: '建议考虑咨询心理专业人员，进行进一步评估和支持。' },
            { min: 15, max: 19, label: '中重度抑郁', color: '#FF5722', advice: '强烈建议寻求专业心理帮助，可联系心理咨询师或精神科医生。' },
            { min: 20, max: 27, label: '重度抑郁', color: '#F44336', advice: '请尽快寻求专业帮助。拨打心理援助热线或预约精神科医生。' }
        ]
    },
    resources: {
        crisis: '如果感到绝望或有自伤想法，请立即寻求帮助：全国心理援助热线 400-161-9995'
    }
};

// ==================== GAD-7 焦虑量表 ====================
const GAD7 = {
    id: 'gad7',
    name: 'GAD-7焦虑筛查量表',
    shortName: '焦虑筛查',
    description: '用于评估过去两周内的焦虑症状严重程度',
    category: '情绪状态',
    developer: 'Spitzer et al. (2006)',
    items: [
        {
            id: 'gad7_1',
            text: '感到紧张、焦虑或不安',
            options: [
                { value: 0, label: '完全不会' },
                { value: 1, label: '好几天' },
                { value: 2, label: '一半以上天数' },
                { value: 3, label: '几乎每天' }
            ]
        },
        {
            id: 'gad7_2',
            text: '不能停止或控制担忧',
            options: [
                { value: 0, label: '完全不会' },
                { value: 1, label: '好几天' },
                { value: 2, label: '一半以上天数' },
                { value: 3, label: '几乎每天' }
            ]
        },
        {
            id: 'gad7_3',
            text: '对各种各样的事情担忧过多',
            options: [
                { value: 0, label: '完全不会' },
                { value: 1, label: '好几天' },
                { value: 2, label: '一半以上天数' },
                { value: 3, label: '几乎每天' }
            ]
        },
        {
            id: 'gad7_4',
            text: '很难放松下来',
            options: [
                { value: 0, label: '完全不会' },
                { value: 1, label: '好几天' },
                { value: 2, label: '一半以上天数' },
                { value: 3, label: '几乎每天' }
            ]
        },
        {
            id: 'gad7_5',
            text: '由于不安而无法静坐',
            options: [
                { value: 0, label: '完全不会' },
                { value: 1, label: '好几天' },
                { value: 2, label: '一半以上天数' },
                { value: 3, label: '几乎每天' }
            ]
        },
        {
            id: 'gad7_6',
            text: '变得容易烦恼或急躁',
            options: [
                { value: 0, label: '完全不会' },
                { value: 1, label: '好几天' },
                { value: 2, label: '一半以上天数' },
                { value: 3, label: '几乎每天' }
            ]
        },
        {
            id: 'gad7_7',
            text: '感到似乎将有可怕的事情发生而害怕',
            options: [
                { value: 0, label: '完全不会' },
                { value: 1, label: '好几天' },
                { value: 2, label: '一半以上天数' },
                { value: 3, label: '几乎每天' }
            ]
        }
    ],
    scoring: {
        ranges: [
            { min: 0, max: 4, label: '无或极轻微焦虑', color: '#4CAF50', advice: '焦虑水平在正常范围内，继续保持。' },
            { min: 5, max: 9, label: '轻度焦虑', color: '#FFC107', advice: '轻度焦虑可以通过深呼吸、正念冥想等方式缓解。' },
            { min: 10, max: 14, label: '中度焦虑', color: '#FF9800', advice: '建议学习一些焦虑管理技巧，如持续存在可寻求专业帮助。' },
            { min: 15, max: 21, label: '重度焦虑', color: '#FF5722', advice: '建议寻求专业心理帮助，学习系统性的焦虑管理方法。' }
        ]
    },
    resources: {
        crisis: '如果焦虑严重影响日常生活，请寻求专业帮助'
    }
};

// ==================== SWLS 主观幸福感量表 ====================
const SWLS = {
    id: 'swls',
    name: '主观幸福感量表',
    shortName: '幸福感',
    description: '评估个体对生活满意度的整体感受',
    category: '主观幸福感',
    developer: 'Diener et al. (1985)',
    items: [
        {
            id: 'swls_1',
            text: '我的生活大致符合我的理想',
            options: [
                { value: 1, label: '非常不同意' },
                { value: 2, label: '不同意' },
                { value: 3, label: '有点不同意' },
                { value: 4, label: '中立' },
                { value: 5, label: '有点同意' },
                { value: 6, label: '同意' },
                { value: 7, label: '非常同意' }
            ]
        },
        {
            id: 'swls_2',
            text: '我的生活条件很好',
            options: [
                { value: 1, label: '非常不同意' },
                { value: 2, label: '不同意' },
                { value: 3, label: '有点不同意' },
                { value: 4, label: '中立' },
                { value: 5, label: '有点同意' },
                { value: 6, label: '同意' },
                { value: 7, label: '非常同意' }
            ]
        },
        {
            id: 'swls_3',
            text: '我对我的生活感到满意',
            options: [
                { value: 1, label: '非常不同意' },
                { value: 2, label: '不同意' },
                { value: 3, label: '有点不同意' },
                { value: 4, label: '中立' },
                { value: 5, label: '有点同意' },
                { value: 6, label: '同意' },
                { value: 7, label: '非常同意' }
            ]
        },
        {
            id: 'swls_4',
            text: '到目前为止，我能够得到我生活中想要的东西',
            options: [
                { value: 1, label: '非常不同意' },
                { value: 2, label: '不同意' },
                { value: 3, label: '有点不同意' },
                { value: 4, label: '中立' },
                { value: 5, label: '有点同意' },
                { value: 6, label: '同意' },
                { value: 7, label: '非常同意' }
            ]
        },
        {
            id: 'swls_5',
            text: '如果可以重新活过，我几乎不会有什么改变',
            options: [
                { value: 1, label: '非常不同意' },
                { value: 2, label: '不同意' },
                { value: 3, label: '有点不同意' },
                { value: 4, label: '中立' },
                { value: 5, label: '有点同意' },
                { value: 6, label: '同意' },
                { value: 7, label: '非常同意' }
            ]
        }
    ],
    scoring: {
        ranges: [
            { min: 5, max: 9, label: '非常不满意', color: '#F44336', advice: '您对生活满意度较低，建议思考生活中需要改变的方面。' },
            { min: 10, max: 14, label: '不满意', color: '#FF9800', advice: '您对生活的某些方面感到不满，可以尝试设定小目标来改善。' },
            { min: 15, max: 19, label: '略低于中立', color: '#FFC107', advice: '您对生活满意度一般，建议关注生活中的积极面。' },
            { min: 20, max: 26, label: '中立偏满意', color: '#8BC34A', advice: '您对生活基本满意，继续保持并寻找更多意义。' },
            { min: 27, max: 31, label: '满意', color: '#4CAF50', advice: '您对生活比较满意，保持积极心态和生活方式。' },
            { min: 32, max: 35, label: '非常满意', color: '#2E7D32', advice: '您对生活非常满意，继续珍惜并维护您的好状态！' }
        ]
    },
    resources: {
        general: '幸福感可以通过感恩练习、正念冥想和建立积极人际关系来提升'
    }
};

// ==================== PANAS 情感量表 ====================
const PANAS = {
    id: 'panas',
    name: '正负性情感量表',
    shortName: '情感状态',
    description: '评估积极情感和消极情感的体验频率',
    category: '主观幸福感',
    developer: 'Watson et al. (1988)',
    items: [
        {
            id: 'panas_1',
            text: '感兴趣的',
            options: [
                { value: 1, label: '几乎没有' },
                { value: 2, label: '比较少' },
                { value: 3, label: '中等程度' },
                { value: 4, label: '比较多' },
                { value: 5, label: '极其多' }
            ]
        },
        {
            id: 'panas_2',
            text: '兴奋的',
            options: [
                { value: 1, label: '几乎没有' },
                { value: 2, label: '比较少' },
                { value: 3, label: '中等程度' },
                { value: 4, label: '比较多' },
                { value: 5, label: '极其多' }
            ]
        },
        {
            id: 'panas_3',
            text: '兴奋的',
            options: [
                { value: 1, label: '几乎没有' },
                { value: 2, label: '比较少' },
                { value: 3, label: '中等程度' },
                { value: 4, label: '比较多' },
                { value: 5, label: '极其多' }
            ]
        },
        {
            id: 'panas_4',
            text: '自豪的',
            options: [
                { value: 1, label: '几乎没有' },
                { value: 2, label: '比较少' },
                { value: 3, label: '中等程度' },
                { value: 4, label: '比较多' },
                { value: 5, label: '极其多' }
            ]
        },
        {
            id: 'panas_5',
            text: '欣喜的',
            options: [
                { value: 1, label: '几乎没有' },
                { value: 2, label: '比较少' },
                { value: 3, label: '中等程度' },
                { value: 4, label: '比较多' },
                { value: 5, label: '极其多' }
            ]
        },
        {
            id: 'panas_6',
            text: '愤怒的',
            options: [
                { value: 1, label: '几乎没有' },
                { value: 2, label: '比较少' },
                { value: 3, label: '中等程度' },
                { value: 4, label: '比较多' },
                { value: 5, label: '极其多' }
            ]
        },
        {
            id: 'panas_7',
            text: '惊恐的',
            options: [
                { value: 1, label: '几乎没有' },
                { value: 2, label: '比较少' },
                { value: 3, label: '中等程度' },
                { value: 4, label: '比较多' },
                { value: 5, label: '极其多' }
            ]
        },
        {
            id: 'panas_8',
            text: '羞愧的',
            options: [
                { value: 1, label: '几乎没有' },
                { value: 2, label: '比较少' },
                { value: 3, label: '中等程度' },
                { value: 4, label: '比较多' },
                { value: 5, label: '极其多' }
            ]
        },
        {
            id: 'panas_9',
            text: '难过的',
            options: [
                { value: 1, label: '几乎没有' },
                { value: 2, label: '比较少' },
                { value: 3, label: '中等程度' },
                { value: 4, label: '比较多' },
                { value: 5, label: '极其多' }
            ]
        },
        {
            id: 'panas_10',
            text: '害怕的',
            options: [
                { value: 1, label: '几乎没有' },
                { value: 2, label: '比较少' },
                { value: 3, label: '中等程度' },
                { value: 4, label: '比较多' },
                { value: 5, label: '极其多' }
            ]
        }
    ],
    scoring: {
        positiveScore: [1, 2, 3, 4, 5], // PA items
        negativeScore: [6, 7, 8, 9, 10], // NA items
        ranges: {
            positive: [
                { min: 5, max: 17, label: '低积极情感', color: '#FF9800', advice: '您体验到的积极情感较少，建议增加让您愉悦的活动。' },
                { min: 18, max: 23, label: '中等积极情感', color: '#FFC107', advice: '您体验到适度的积极情感，可以尝试新活动来提升。' },
                { min: 24, max: 25, label: '高积极情感', color: '#4CAF50', advice: '您体验到较高的积极情感，继续保持！' }
            ],
            negative: [
                { min: 5, max: 17, label: '低消极情感', color: '#4CAF50', advice: '您体验到的消极情感较少，情绪状态良好。' },
                { min: 18, max: 23, label: '中等消极情感', color: '#FFC107', advice: '您体验到一定程度的消极情感，注意调节情绪。' },
                { min: 24, max: 25, label: '高消极情感', color: '#FF5722', advice: '您体验到较高的消极情感，建议寻求支持或专业帮助。' }
            ]
        }
    },
    resources: {
        general: '平衡积极与消极情感是心理健康的重要指标'
    }
};

// ==================== CD-RISC 心理弹性量表简版 ====================
const CDRISCC = {
    id: 'cdriscc',
    name: '心理弹性量表简版',
    shortName: '心理弹性',
    description: '评估个体在面对压力和困难时的心理韧性',
    category: '心理弹性',
    developer: 'Connor & Davidson (2003) 简化版',
    items: [
        {
            id: 'cdrisc_1',
            text: '我能适应变化',
            options: [
                { value: 0, label: '从来不会' },
                { value: 1, label: '很少会' },
                { value: 2, label: '有时会' },
                { value: 3, label: '经常会' },
                { value: 4, label: '总是会' }
            ]
        },
        {
            id: 'cdrisc_2',
            text: '我有亲密、牢固的关系',
            options: [
                { value: 0, label: '从来不会' },
                { value: 1, label: '很少会' },
                { value: 2, label: '有时会' },
                { value: 3, label: '经常会' },
                { value: 4, label: '总是会' }
            ]
        },
        {
            id: 'cdrisc_3',
            text: '有时命运会帮助我',
            options: [
                { value: 0, label: '从来不会' },
                { value: 1, label: '很少会' },
                { value: 2, label: '有时会' },
                { value: 3, label: '经常会' },
                { value: 4, label: '总是会' }
            ]
        },
        {
            id: 'cdrisc_4',
            text: '无论发生什么，我都能应付',
            options: [
                { value: 0, label: '从来不会' },
                { value: 1, label: '很少会' },
                { value: 2, label: '有时会' },
                { value: 3, label: '经常会' },
                { value: 4, label: '总是会' }
            ]
        },
        {
            id: 'cdrisc_5',
            text: '过去的成功让我有信心面对新挑战',
            options: [
                { value: 0, label: '从来不会' },
                { value: 1, label: '很少会' },
                { value: 2, label: '有时会' },
                { value: 3, label: '经常会' },
                { value: 4, label: '总是会' }
            ]
        },
        {
            id: 'cdrisc_6',
            text: '我能看到事物积极的一面',
            options: [
                { value: 0, label: '从来不会' },
                { value: 1, label: '很少会' },
                { value: 2, label: '有时会' },
                { value: 3, label: '经常会' },
                { value: 4, label: '总是会' }
            ]
        },
        {
            id: 'cdrisc_7',
            text: '我能应对压力',
            options: [
                { value: 0, label: '从来不会' },
                { value: 1, label: '很少会' },
                { value: 2, label: '有时会' },
                { value: 3, label: '经常会' },
                { value: 4, label: '总是会' }
            ]
        },
        {
            id: 'cdrisc_8',
            text: '我的生活很有意义',
            options: [
                { value: 0, label: '从来不会' },
                { value: 1, label: '很少会' },
                { value: 2, label: '有时会' },
                { value: 3, label: '经常会' },
                { value: 4, label: '总是会' }
            ]
        },
        {
            id: 'cdrisc_9',
            text: '我有信心理清生活中发生的事情',
            options: [
                { value: 0, label: '从来不会' },
                { value: 1, label: '很少会' },
                { value: 2, label: '有时会' },
                { value: 3, label: '经常会' },
                { value: 4, label: '总是会' }
            ]
        },
        {
            id: 'cdrisc_10',
            text: '我喜欢挑战',
            options: [
                { value: 0, label: '从来不会' },
                { value: 1, label: '很少会' },
                { value: 2, label: '有时会' },
                { value: 3, label: '经常会' },
                { value: 4, label: '总是会' }
            ]
        }
    ],
    scoring: {
        ranges: [
            { min: 0, max: 15, label: '低心理弹性', color: '#FF5722', advice: '您可能需要更多支持来面对生活中的挑战，建议寻求帮助。' },
            { min: 16, max: 25, label: '中等心理弹性', color: '#FFC107', advice: '您有一定的心理弹性，可以继续培养应对能力。' },
            { min: 26, max: 35, label: '较高心理弹性', color: '#8BC34A', advice: '您有较好的心理弹性，能够有效应对压力。' },
            { min: 36, max: 50, label: '高心理弹性', color: '#4CAF50', advice: '您有很高的心理弹性，面对困难时能保持坚韧！' }
        ]
    },
    resources: {
        general: '心理弹性可以通过正念练习、社交支持和积极思维训练来提升'
    }
};

// ==================== 简版共情量表 ====================
const BES = {
    id: 'bes',
    name: '简版共情量表',
    shortName: '共情能力',
    description: '评估个体理解和分享他人情感的能力',
    category: '社会认知',
    developer: 'Spreng et al. (2009) 简化版',
    items: [
        {
            id: 'bes_1',
            text: '我能感受到他人在某些情况下可能体验到的感受',
            options: [
                { value: 1, label: '完全不符合' },
                { value: 2, label: '不太符合' },
                { value: 3, label: '有点符合' },
                { value: 4, label: '比较符合' },
                { value: 5, label: '完全符合' }
            ]
        },
        {
            id: 'bes_2',
            text: '在做出决定之前，我会考虑他人的感受',
            options: [
                { value: 1, label: '完全不符合' },
                { value: 2, label: '不太符合' },
                { value: 3, label: '有点符合' },
                { value: 4, label: '比较符合' },
                { value: 5, label: '完全符合' }
            ]
        },
        {
            id: 'bes_3',
            text: '我善于理解他人的感受',
            options: [
                { value: 1, label: '完全不符合' },
                { value: 2, label: '不太符合' },
                { value: 3, label: '有点符合' },
                { value: 4, label: '比较符合' },
                { value: 5, label: '完全符合' }
            ]
        },
        {
            id: 'bes_4',
            text: '当他人感到不安时，我能感受到同情',
            options: [
                { value: 1, label: '完全不符合' },
                { value: 2, label: '不太符合' },
                { value: 3, label: '有点符合' },
                { value: 4, label: '比较符合' },
                { value: 5, label: '完全符合' }
            ]
        },
        {
            id: 'bes_5',
            text: '我能从朋友的表情或语气中读出他们的感受',
            options: [
                { value: 1, label: '完全不符合' },
                { value: 2, label: '不太符合' },
                { value: 3, label: '有点符合' },
                { value: 4, label: '比较符合' },
                { value: 5, label: '完全符合' }
            ]
        },
        {
            id: 'bes_6',
            text: '我善于倾听和理解他人的烦恼',
            options: [
                { value: 1, label: '完全不符合' },
                { value: 2, label: '不太符合' },
                { value: 3, label: '有点符合' },
                { value: 4, label: '比较符合' },
                { value: 5, label: '完全符合' }
            ]
        },
        {
            id: 'bes_7',
            text: '当朋友遇到好事时，我会为他们感到高兴',
            options: [
                { value: 1, label: '完全不符合' },
                { value: 2, label: '不太符合' },
                { value: 3, label: '有点符合' },
                { value: 4, label: '比较符合' },
                { value: 5, label: '完全符合' }
            ]
        },
        {
            id: 'bes_8',
            text: '我能够设身处地为他人着想',
            options: [
                { value: 1, label: '完全不符合' },
                { value: 2, label: '不太符合' },
                { value: 3, label: '有点符合' },
                { value: 4, label: '比较符合' },
                { value: 5, label: '完全符合' }
            ]
        }
    ],
    scoring: {
        ranges: [
            { min: 8, max: 16, label: '低共情', color: '#FF9800', advice: '您的共情能力相对较低，但这不影响您建立良好的人际关系。' },
            { min: 17, max: 24, label: '中等共情', color: '#FFC107', advice: '您有适度的共情能力，可以继续发展和提升。' },
            { min: 25, max: 32, label: '较高共情', color: '#8BC34A', advice: '您有较好的共情能力，能够理解和支持他人。' },
            { min: 33, max: 40, label: '高共情', color: '#4CAF50', advice: '您有很高的共情能力，是很好的倾听者和支持者！' }
        ]
    },
    resources: {
        general: '共情能力可以通过积极倾听和换位思考练习来提升'
    }
};

// ==================== 简版匹兹堡睡眠质量指数 ====================
const PSQI = {
    id: 'psqi',
    name: '简版睡眠质量量表',
    shortName: '睡眠质量',
    description: '评估最近一个月的睡眠质量',
    category: '睡眠质量',
    developer: 'Buysse et al. (1989) 简化版',
    items: [
        {
            id: 'psqi_1',
            text: '最近一个月，您通常什么时候上床睡觉？',
            type: 'time',
            options: []
        },
        {
            id: 'psqi_2',
            text: '最近一个月，您通常什么时候起床？',
            type: 'time',
            options: []
        },
        {
            id: 'psqi_3',
            text: '最近一个月，您上床后通常需要多久才能入睡？',
            options: [
                { value: 0, label: '≤15分钟' },
                { value: 1, label: '16-30分钟' },
                { value: 2, label: '31-60分钟' },
                { value: 3, label: '>60分钟' }
            ]
        },
        {
            id: 'psqi_4',
            text: '最近一个月，您是否因为以下情况而影响睡眠？',
            subItems: [
                { id: 'psqi_4a', text: 'a. 入睡困难（30分钟内不能入睡）', options: [{value:0,label:'无'},{value:1,label:'<1次/周'},{value:2,label:'1-2次/周'},{value:3,label:'≥3次/周'}] },
                { id: 'psqi_4b', text: 'b. 夜间易醒或早醒', options: [{value:0,label:'无'},{value:1,label:'<1次/周'},{value:2,label:'1-2次/周'},{value:3,label:'≥3次/周'}] },
                { id: 'psqi_4c', text: 'c. 夜间起床上厕所', options: [{value:0,label:'无'},{value:1,label:'<1次/周'},{value:2,label:'1-2次/周'},{value:3,label:'≥3次/周'}] },
                { id: 'psqi_4d', text: 'd. 呼吸不畅', options: [{value:0,label:'无'},{value:1,label:'<1次/周'},{value:2,label:'1-2次/周'},{value:3,label:'≥3次/周'}] },
                { id: 'psqi_4e', text: 'e. 咳嗽或打鼾', options: [{value:0,label:'无'},{value:1,label:'<1次/周'},{value:2,label:'1-2次/周'},{value:3,label:'≥3次/周'}] },
                { id: 'psqi_4f', text: 'f. 感觉冷', options: [{value:0,label:'无'},{value:1,label:'<1次/周'},{value:2,label:'1-2次/周'},{value:3,label:'≥3次/周'}] },
                { id: 'psqi_4g', text: 'g. 感觉热', options: [{value:0,label:'无'},{value:1,label:'<1次/周'},{value:2,label:'1-2次/周'},{value:3,label:'≥3次/周'}] },
                { id: 'psqi_4h', text: 'h. 做噩梦', options: [{value:0,label:'无'},{value:1,label:'<1次/周'},{value:2,label:'1-2次/周'},{value:3,label:'≥3次/周'}] }
            ]
        },
        {
            id: 'psqi_5',
            text: '最近一个月，您总体觉得睡眠质量如何？',
            options: [
                { value: 0, label: '很好' },
                { value: 1, label: '较好' },
                { value: 2, label: '较差' },
                { value: 3, label: '很差' }
            ]
        },
        {
            id: 'psqi_6',
            text: '最近一个月，您使用安眠药的情况？',
            options: [
                { value: 0, label: '无' },
                { value: 1, label: '<1次/周' },
                { value: 2, label: '1-2次/周' },
                { value: 3, label: '≥3次/周' }
            ]
        },
        {
            id: 'psqi_7',
            text: '最近一个月，您在白天是否因为困倦而影响工作/学习？',
            options: [
                { value: 0, label: '没有' },
                { value: 1, label: '偶尔有' },
                { value: 2, label: '有时有' },
                { value: 3, label: '经常有' }
            ]
        }
    ],
    scoring: {
        ranges: [
            { min: 0, max: 5, label: '睡眠质量很好', color: '#4CAF50', advice: '您的睡眠质量很好，继续保持良好的睡眠习惯。' },
            { min: 6, max: 10, label: '睡眠质量一般', color: '#FFC107', advice: '您的睡眠质量有些问题，建议改善睡眠习惯。' },
            { min: 11, max: 15, label: '睡眠质量较差', color: '#FF9800', advice: '您的睡眠质量较差，建议关注睡眠卫生，必要时寻求专业帮助。' },
            { min: 16, max: 21, label: '睡眠质量很差', color: '#F44336', advice: '您的睡眠质量很差，建议咨询睡眠专科或心理医生。' }
        ]
    },
    resources: {
        general: '良好的睡眠习惯包括：固定作息时间、睡前避免电子设备、营造舒适的睡眠环境'
    }
};

// ==================== 简版知觉压力量表 ====================
const PSS = {
    id: 'pss',
    name: '知觉压力量表',
    shortName: '压力感知',
    description: '评估个体对生活中压力事件的感知程度',
    category: '压力应对',
    developer: 'Cohen et al. (1983) 简化版',
    items: [
        {
            id: 'pss_1',
            text: '在过去一个月内，有多少事情让您感到无法控制？',
            options: [
                { value: 0, label: '从来没有' },
                { value: 1, label: '几乎没有' },
                { value: 2, label: '偶尔' },
                { value: 3, label: '经常' },
                { value: 4, label: '非常频繁' }
            ]
        },
        {
            id: 'pss_2',
            text: '在过去一个月内，有多少事情让您感到自信心不足？',
            options: [
                { value: 0, label: '从来没有' },
                { value: 1, label: '几乎没有' },
                { value: 2, label: '偶尔' },
                { value: 3, label: '经常' },
                { value: 4, label: '非常频繁' }
            ]
        },
        {
            id: 'pss_3',
            text: '在过去一个月内，您感到烦恼的事情是否很多？',
            options: [
                { value: 0, label: '从来没有' },
                { value: 1, label: '几乎没有' },
                { value: 2, label: '偶尔' },
                { value: 3, label: '经常' },
                { value: 4, label: '非常频繁' }
            ]
        },
        {
            id: 'pss_4',
            text: '在过去一个月内，您是否能处理恼人的事情？',
            options: [
                { value: 0, label: '从来没有' },
                { value: 1, label: '几乎没有' },
                { value: 2, label: '偶尔' },
                { value: 3, label: '经常' },
                { value: 4, label: '非常频繁' }
            ]
        },
        {
            id: 'pss_5',
            text: '在过去一个月内，您是否感到事情按计划进行？',
            options: [
                { value: 0, label: '从来没有' },
                { value: 1, label: '几乎没有' },
                { value: 2, label: '偶尔' },
                { value: 3, label: '经常' },
                { value: 4, label: '非常频繁' }
            ]
        },
        {
            id: 'pss_6',
            text: '在过去一个月内，您是否发现自己无法完成想要完成的事情？',
            options: [
                { value: 0, label: '从来没有' },
                { value: 1, label: '几乎没有' },
                { value: 2, label: '偶尔' },
                { value: 3, label: '经常' },
                { value: 4, label: '非常频繁' }
            ]
        },
        {
            id: 'pss_7',
            text: '在过去一个月内，您是否能够控制自己的愤怒和情绪？',
            options: [
                { value: 0, label: '从来没有' },
                { value: 1, label: '几乎没有' },
                { value: 2, label: '偶尔' },
                { value: 3, label: '经常' },
                { value: 4, label: '非常频繁' }
            ]
        },
        {
            id: 'pss_8',
            text: '在过去一个月内，您是否感到事情发展过于迅速？',
            options: [
                { value: 0, label: '从来没有' },
                { value: 1, label: '几乎没有' },
                { value: 2, label: '偶尔' },
                { value: 3, label: '经常' },
                { value: 4, label: '非常频繁' }
            ]
        },
        {
            id: 'pss_9',
            text: '在过去一个月内，您是否因为无法完成想要完成的事情而感到不安？',
            options: [
                { value: 0, label: '从来没有' },
                { value: 1, label: '几乎没有' },
                { value: 2, label: '偶尔' },
                { value: 3, label: '经常' },
                { value: 4, label: '非常频繁' }
            ]
        },
        {
            id: 'pss_10',
            text: '在过去一个月内，您是否能够应对意外发生的事件？',
            options: [
                { value: 0, label: '从来没有' },
                { value: 1, label: '几乎没有' },
                { value: 2, label: '偶尔' },
                { value: 3, label: '经常' },
                { value: 4, label: '非常频繁' }
            ]
        }
    ],
    scoring: {
        reverseItems: [4, 5, 7, 8, 10], // 需要反向计分的题目
        ranges: [
            { min: 0, max: 13, label: '低压力', color: '#4CAF50', advice: '您的压力水平在可接受范围内。' },
            { min: 14, max: 26, label: '中等压力', color: '#FFC107', advice: '您感受到一定的压力，建议尝试放松技巧和压力管理。' },
            { min: 27, max: 40, label: '高压力', color: '#FF5722', advice: '您的压力水平较高，建议学习压力管理技巧，必要时寻求专业帮助。' }
        ]
    },
    resources: {
        general: '压力管理技巧包括：深呼吸、正念冥想、规律运动、时间管理'
    }
};

// ==================== 导出所有量表 ====================
const SCALES = {
    PHQ9,
    GAD7,
    SWLS,
    PANAS,
    CDRISCC,
    BES,
    PSQI,
    PSS
};

// 获取量表列表（用于选择界面）
function getScaleList() {
    return Object.values(SCALES).map(scale => ({
        id: scale.id,
        name: scale.name,
        shortName: scale.shortName,
        description: scale.description,
        category: scale.category,
        itemCount: scale.items.length
    }));
}

// 获取单个量表
function getScale(scaleId) {
    return SCALES[scaleId] || null;
}

// 计算量表分数并返回解读
function calculateScaleResult(scaleId, answers) {
    const scale = SCALES[scaleId];
    if (!scale) return null;
    
    let totalScore = 0;
    let validItems = 0;
    
    // 处理反向计分题目
    const reverseItems = scale.scoring.reverseItems || [];
    
    scale.items.forEach((item, index) => {
        const answer = answers[item.id];
        if (answer !== undefined && answer !== null) {
            let value = parseInt(answer);
            // 如果是反向计分题
            if (reverseItems.includes(index + 1)) {
                const maxOption = item.options.length - 1;
                value = maxOption - value;
            }
            totalScore += value;
            validItems++;
        }
    });
    
    // 计算平均分或总分
    const averageScore = validItems > 0 ? totalScore / validItems : 0;
    
    // 根据量表类型确定分数范围
    let interpretation = null;
    
    if (scaleId === 'panas') {
        // PANAS需要分别计算积极和消极情感
        let positiveScore = 0;
        let negativeScore = 0;
        
        scale.items.forEach((item, index) => {
            const answer = answers[item.id];
            if (answer !== undefined) {
                if (scale.scoring.positiveScore.includes(index + 1)) {
                    positiveScore += parseInt(answer);
                } else {
                    negativeScore += parseInt(answer);
                }
            }
        });
        
        const positiveRange = scale.scoring.ranges.positive.find(r => positiveScore >= r.min && positiveScore <= r.max);
        const negativeRange = scale.scoring.ranges.negative.find(r => negativeScore >= r.min && negativeScore <= r.max);
        
        return {
            scaleId,
            scaleName: scale.name,
            positiveScore,
            negativeScore,
            positiveInterpretation: positiveRange,
            negativeInterpretation: negativeRange,
            advice: scale.resources.general,
            crisis: scale.resources.crisis
        };
    } else {
        // 其他量表使用总分
        interpretation = scale.scoring.ranges.find(r => totalScore >= r.min && totalScore <= r.max);
        
        return {
            scaleId,
            scaleName: scale.name,
            totalScore,
            maxScore: scale.items.reduce((sum, item) => sum + (item.options.length - 1), 0),
            interpretation,
            advice: interpretation ? interpretation.advice : '',
            crisis: scale.resources.crisis,
            resources: scale.resources.general
        };
    }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SCALES, getScaleList, getScale, calculateScaleResult };
}
