function getDaysSince(dateString) {
  const start = new Date(dateString)
  const today = new Date()
  start.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)

  return Math.floor((today - start) / (1000 * 60 * 60 * 24))
}

function createPhotoEntries({
  count,
  publicPath,
  hintPath,
  labelPrefix,
  aspectRatio = '',
  placeholderIcon = 'fa-solid fa-image',
}) {
  return Array.from({ length: count }, (_, index) => {
    const number = index + 1
    const resolvedRatio = typeof aspectRatio === 'function' ? aspectRatio(number) : aspectRatio

    return {
      id: `${labelPrefix}-${number}`,
      src: `${publicPath}/${number}.webp`,
      alt: `${labelPrefix} ${number}`,
      hint: `命名为 ${number}.webp 放入 ${hintPath}/`,
      aspectRatio: resolvedRatio,
      placeholderIcon,
    }
  })
}

export const fallbackStats = {
  fitnessDays: getDaysSince('2025-03-07'),
  mountains: 6,
  cities: 21,
  artworks: 6,
}

export const navLinks = [
  { href: '#home', label: '首页' },
  { href: '#about', label: '关于我' },
  { href: '#life', label: '我的生活' },
  { href: '#skills', label: '技能' },
  { href: '#projects', label: '项目' },
  { href: '#contact', label: '联系' },
]

export const heroContent = {
  name: '谢泽锋',
  subtitle: '北京理工大学珠海学院 · 数据科学与大数据技术 · 大四',
  tagline: '自律遇见更好的自己',
  ctaLabel: '了解更多',
  ctaHref: '#about',
}

export const aboutParagraphs = [
  '我是谢泽锋，一个相信"自律遇见更好的自己"的人。来自广东汕头，目前在北京理工大学珠海学院攻读数据科学与大数据技术专业，即将毕业。',
  '在学业上，我系统学习了 Python、Java、MySQL 等技术，在机器学习与数据分析领域有扎实的基础。在生活中，我热爱健身、旅行、摄影和艺术创作，相信技术能力和生活态度同样重要。',
  '这个网站就是我从零学习前端技术独立完成的作品——它不仅是一份简历，更是一个让你认识真实的我的窗口。',
]

export const statsItems = [
  {
    id: 'stat-fitness',
    key: 'fitnessDays',
    iconClass: 'fa-solid fa-dumbbell',
    unit: '天',
    label: '健身坚持天数',
  },
  {
    id: 'stat-mountains',
    key: 'mountains',
    iconClass: 'fa-solid fa-mountain',
    unit: '座',
    label: '爬过的山峰',
  },
  {
    id: 'stat-cities',
    key: 'cities',
    iconClass: 'fa-solid fa-map-location-dot',
    unit: '个',
    label: '走过的城市',
  },
  {
    id: 'stat-artworks',
    key: 'artworks',
    iconClass: 'fa-solid fa-palette',
    unit: '幅',
    label: '油画棒作品',
  },
]

export const lifeTabs = [
  { id: 'fitness', iconClass: 'fa-solid fa-dumbbell', label: '运动生活' },
  { id: 'movies', iconClass: 'fa-solid fa-film', label: '影视世界' },
  { id: 'travel', iconClass: 'fa-solid fa-plane', label: '旅行足迹' },
  { id: 'creative', iconClass: 'fa-solid fa-palette', label: '创意角落' },
]

export const fitnessTimeline = [
  {
    title: '热爱篮球的日子',
    text: '曾经是一个篮球爱好者，球场上挥洒汗水是最畅快的事。',
    iconClass: 'fa-solid fa-basketball',
    iconTone: '',
    photos: createPhotoEntries({
      count: 3,
      publicPath: '/images/basketball',
      hintPath: 'images/basketball',
      labelPrefix: '篮球照片',
      placeholderIcon: 'fa-solid fa-basketball',
    }),
  },
  {
    title: '意外受伤',
    text: '一次腰伤让我不得不告别剧烈运动。那段时间很低落，但我选择了面对而不是放弃。',
    iconClass: 'fa-solid fa-bolt',
    iconTone: 'warning',
  },
  {
    title: '系统健身，重新出发',
    text: '养伤过后开始系统健身，从恢复训练到力量训练，一步步找回节奏，这个习惯已坚持一年。',
    iconClass: 'fa-solid fa-dumbbell',
    iconTone: 'success',
  },
  {
    title: '游泳',
    text: '游泳是我另一项喜爱的运动，对身体恢复和体能保持都很有帮助。',
    iconClass: 'fa-solid fa-person-swimming',
    iconTone: '',
  },
  {
    title: '爱上爬山',
    text: '站在山顶俯瞰的那一刻，所有的疲惫都值得。爬山让我学会了坚持，也学会了享受过程。',
    iconClass: 'fa-solid fa-mountain',
    iconTone: 'success',
  },
]

export const mountainTags = ['红花山', '凤凰山', '狮头山', '鼎湖山', '宝马山', '叠石塘山']

export const fitnessPhotos = createPhotoEntries({
  count: 2,
  publicPath: '/images/fitness',
  hintPath: 'images/fitness',
  labelPrefix: '健身照片',
  aspectRatio: '3 / 4',
})

export const movieSection = {
  intro:
    '我偏爱经典和有深度的作品——那些能让我在看完之后还会反复思考的故事。同时也热爱漫威宇宙的热血与激情，从钢铁侠到复联四，一路追随。赛车题材的电影更是让我血脉偾张，那种肾上腺素飙升的感觉，充满激情和生命力。',
  quote: '我喜欢那些打破常规的作品，它们让我学会用不同的角度看待问题，保持思维的开放性。',
  groups: [
    {
      title: '经典电影',
      iconClass: 'fa-solid fa-star',
      tagClass: 'tag-movie',
      items: [
        '肖申克的救赎',
        '绿皮书',
        '触不可及',
        '盗梦空间',
        '星际穿越',
        '飞驰人生3',
        '白日梦想家',
        '放牛班的春天',
        '死亡诗社',
        '阿甘正传',
        '楚门的世界',
        '海上钢琴师',
        '奥本海默',
        'F1：狂飙飞车',
        '三傻大闹宝莱坞',
        '我不是药神',
        '当幸福来敲门',
        '让子弹飞',
        '无间道',
      ],
    },
    {
      title: '漫威宇宙',
      iconClass: 'fa-solid fa-mask',
      tagClass: 'tag-marvel',
      note:
        '从《钢铁侠》到《复仇者联盟4》，中间的系列电影都看过。最喜欢的是钢铁侠——Tony Stark 的魅力无人能挡。',
      notePosition: 'before',
      items: ['钢铁侠（最爱）', '复仇者联盟', '蜘蛛侠', '漫威全系列'],
    },
    {
      title: '喜欢的演员',
      iconClass: 'fa-solid fa-user-tie',
      tagClass: 'tag-actor',
      note: '帅气、有型、演技在线——非常符合我的审美。',
      notePosition: 'after',
      items: ['布拉德·皮特', '基里安·墨菲'],
    },
    {
      title: '追过的好剧',
      iconClass: 'fa-solid fa-tv',
      tagClassByItem: ['tag-us', 'tag-us', 'tag-us', 'tag-us', 'tag-uk'],
      items: ['怪奇物语', '绝命毒师', '权力的游戏', '豺狼的日子', '浴血黑帮'],
    },
    {
      title: '音乐口味',
      iconClass: 'fa-solid fa-headphones',
      tagClass: 'tag-music',
      note:
        '方大同是一个很温柔、很让人敬佩的歌手，他的离世令人惋惜。他的音乐永远值得被聆听。',
      notePosition: 'after',
      items: ['周杰伦（最爱）', '方大同', 'R&B', '欧美电子', '流行', '说唱'],
    },
  ],
}

export const travelIntro =
  '祖籍广东汕头，读书在珠海，走过了广东的大部分城市，也去过省外和港澳。每到一个地方，我都喜欢用镜头记录下沿途的风景。'

export const travelRegions = [
  {
    name: '广东省',
    cities: [
      { name: '汕头', label: '汕头（故乡）' },
      { name: '潮州', label: '潮州' },
      { name: '揭阳', label: '揭阳' },
      { name: '河源', label: '河源' },
      { name: '深圳', label: '深圳' },
      { name: '东莞', label: '东莞' },
      { name: '惠州', label: '惠州' },
      { name: '广州', label: '广州' },
      { name: '肇庆', label: '肇庆' },
      { name: '江门', label: '江门' },
      { name: '珠海', label: '珠海' },
      { name: '中山', label: '中山' },
      { name: '佛山', label: '佛山' },
    ],
  },
  {
    name: '港澳',
    cities: [
      { name: '香港', label: '香港' },
      { name: '澳门', label: '澳门' },
    ],
  },
  {
    name: '省外',
    cities: [
      { name: '厦门', label: '福建厦门' },
      { name: '漳州', label: '福建漳州' },
      { name: '长沙', label: '湖南长沙' },
      { name: '成都', label: '四川成都' },
      { name: '黄龙', label: '黄龙' },
      { name: '九寨沟', label: '九寨沟' },
    ],
  },
]

export const creativeSection = {
  intro:
    '除了代码和数据，我也喜欢用另一种方式表达自己。油画棒创作需要耐心和对细节的把控，每一笔颜色的叠加都是一次专注的练习。我也喜欢拍风景照，用镜头捕捉旅途中那些打动我的瞬间。',
  quote: '无论是一幅画还是一张照片，创作的过程本身就是一种享受——它让我慢下来，专注于当下。',
  artPhotos: createPhotoEntries({
    count: 6,
    publicPath: '/images/art',
    hintPath: 'images/art',
    labelPrefix: '油画棒作品',
    aspectRatio: '3 / 4',
  }),
  landscapePhotos: createPhotoEntries({
    count: 3,
    publicPath: '/images/photo',
    hintPath: 'images/photo',
    labelPrefix: '风景摄影',
  }),
}

export const skills = [
  {
    title: 'Python',
    iconClass: 'fa-brands fa-python',
    description: 'Pandas、NumPy、Matplotlib 数据分析与可视化',
  },
  {
    title: '机器学习',
    iconClass: 'fa-solid fa-brain',
    description: 'scikit-learn、PyTorch、TensorFlow',
  },
  {
    title: '数据库',
    iconClass: 'fa-solid fa-database',
    description: 'MySQL 数据库设计与查询优化',
  },
  {
    title: 'Java',
    iconClass: 'fa-brands fa-java',
    description: '面向对象编程、基础开发',
  },
  {
    title: 'Linux',
    iconClass: 'fa-brands fa-linux',
    description: '基本命令操作与环境配置',
  },
  {
    title: 'Web 前端',
    iconClass: 'fa-solid fa-code',
    description: 'HTML、CSS、JavaScript',
  },
]

export const projects = [
  {
    title: '个人网站',
    description:
      '从零学习前端技术，独立设计并开发个人作品集网站。包含响应式布局、CSS 动画、Tab 切换交互、滚动动画效果，并通过 GitHub Pages 部署上线。',
    tags: ['HTML', 'CSS', 'JavaScript', 'GitHub Pages'],
  },
  {
    title: '豆瓣电影 Top250 数据挖掘',
    bullets: [
      { label: '数据采集', text: '爬虫采集豆瓣评分前 250 名电影数据' },
      { label: '数据清洗', text: '处理缺失值、重复值与异常值' },
      { label: '决策树', text: '识别影响电影评分与票房收入的关键因素，直观展示决策路径' },
      { label: '聚类分析', text: '揭示电影特征与业务指标的关系，为定向营销提供数据支持' },
      { label: '神经网络', text: '预测电影评分与票房，为投资决策提供量化依据' },
      { label: '可视化', text: 'Tableau 多层次分析，涵盖趋势折线图、地图、条形图、饼图、树状图' },
    ],
    tags: ['Python', '爬虫', '数据清洗', '决策树', '聚类分析', '神经网络', 'Tableau'],
  },
  {
    title: '基于感知机的鸢尾花分类',
    description:
      '以鸢尾花数据集为基础，提出感知机分类模型，通过可视化图表分析三种鸢尾花的特征分布，利用多次迭代训练实现对变色鸢尾花的二分类识别，完成分类与识别任务。',
    tags: ['Python', 'scikit-learn', 'Matplotlib', '二分类'],
  },
]

export const contactLinks = [
  { href: 'mailto:1393084112@qq.com', iconClass: 'fa-solid fa-envelope', label: '邮箱' },
  { href: 'https://github.com/zefeng-xie', iconClass: 'fa-brands fa-github', label: 'GitHub' },
]

export const footerText = '© 2026 谢泽锋 | 自律遇见更好的自己'

export function getCityGallery(city) {
  let photoCount = 3
  if (city === '香港') photoCount = 9
  else if (city === '澳门') photoCount = 12
  else if (city === '厦门' || city === '九寨沟') photoCount = 9
  else if (city === '黄龙' || city === '长沙') photoCount = 6

  return createPhotoEntries({
    count: photoCount,
    publicPath: `/images/travel/${city}`,
    hintPath: `images/travel/${city}`,
    labelPrefix: city,
    aspectRatio(number) {
      if (city === '香港' || city === '澳门') {
        return number <= 3 ? '4 / 3' : '3 / 4'
      }
      if (city === '厦门' || city === '长沙') {
        return number <= 3 ? '4 / 3' : '3 / 4'
      }
      if (city === '漳州') {
        return '4 / 3'
      }
      if (city === '黄龙' || city === '九寨沟') {
        return '3 / 4'
      }
      if (city === '汕头') {
        return '9 / 16'
      }
      if (city === '潮州') {
        return '4 / 3'
      }
      return '3 / 4'
    },
  })
}

export function getMountainGallery(mountain) {
  return createPhotoEntries({
    count: 3,
    publicPath: `/images/hiking/${mountain}`,
    hintPath: `images/hiking/${mountain}`,
    labelPrefix: mountain,
    aspectRatio:
      mountain === '凤凰山' ||
      mountain === '宝马山' ||
      mountain === '狮头山' ||
      mountain === '鼎湖山' ||
      mountain === '叠石塘山'
        ? '3 / 4'
        : '',
  })
}
