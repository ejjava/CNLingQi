document.addEventListener('DOMContentLoaded', function() {
    const commandInput = document.getElementById('command-input');
    const historyElement = document.getElementById('history');
   
   
   
   
    // 保存书签到本地存储
    function saveBookmarks() {
        localStorage.setItem('terminalBookmarks', JSON.stringify(bookmarks));
    }
    
    // 从本地存储加载书签
    function loadBookmarks() {
        const saved = localStorage.getItem('terminalBookmarks');
        if (saved) {
            bookmarks = JSON.parse(saved);
        }
    }
    
    // 初始加载书签
    loadBookmarks();
    
    // 背景设置功能
    // 应用透明度设置
    function applyOpacity(opacity) {
        document.querySelector('.terminal').style.backgroundColor = `rgba(45, 45, 45, ${opacity})`;
        document.querySelector('.terminal-header').style.backgroundColor = `rgba(60, 60, 60, ${opacity})`;
    }
    
    // 初始化背景设置
    function initBackgroundSettings() {
        const savedBg = localStorage.getItem('terminalBackground');
        const savedOpacity = localStorage.getItem('terminalOpacity');
        
        if (savedBg) {
            document.body.style.backgroundImage = `url('${savedBg}')`;
        }
        
        if (savedOpacity) {
            applyOpacity(savedOpacity);
        }
    }
    
    // 初始化背景
    initBackgroundSettings();

    // 命令列表
    const commands = {
        帮助: {
            description: "显示可用命令",
            execute: function() {
                let output = '<div class="command-output">可用命令:</div>';
                for (const cmd in commands) {
                    output += `<div><span class="help-command">${cmd}</span><span class="help-description">- ${commands[cmd].description}</span></div>`;
                }
                return output;
            }
        },
         
        重置: {
    description: "恢复初始状态",
    execute: function() {
        // 清除所有本地存储
        localStorage.clear();
        
        // 重新加载页面以应用重置
        setTimeout(() => {
            location.reload();
        }, 1000);
        
        return '<div class="success">已清除所有本地数据，页面即将刷新...</div>';
    }
},
        
          清屏: {
        description: "清屏所有内容",
        execute: function() {
            historyElement.innerHTML = ''; // 清空历史记录
            return ''; // 返回空字符串表示不显示任何输出
        }
    },
    
        
        天气: {
    description: "查询天气",
    execute: function(args) {
        if (args.length === 0) {
            return `<div class="error">请输入城市名称，例如: 天气 北京（这个是做着玩）</div>`;
        }

        const city = args.join(' ');
        const weatherData = {
            "北京": "🌞 晴 25°C/15°C 西北风2级",
            "上海": "☁️ 多云 22°C/18°C 东南风3级",
            "广州": "🌧️ 小雨 28°C/23°C 南风4级",
            "深圳": "⛅ 阴转多云 27°C/22°C 西南风3级",
            "成都": "🌥️ 多云 20°C/16°C 微风1级"
        };

        if (weatherData[city]) {
            return `<div class="command-output">
                <strong>${city}天气:</strong><br>
                ${weatherData[city]}<br>
                <small>数据更新时间: ${new Date().toLocaleString()}</small>
            </div>`;
        } else {
            return `<div class="error">未找到城市: ${city}<br>
                支持的城市: ${Object.keys(weatherData).join('、')}</div>`;
        }
    }
},

       计算: {
    description: "简易计算器",
    execute: function(args) {
        if (args.length === 0) {
            return `<div class="command-output">
                <strong>简易计算器使用说明:</strong><br>
                仅支持基本运算: + - × ÷ 或 * /<br>
                示例:<br>
                <span class="help-command">计算器 3+5×2</span> → 13<br>
                <span class="help-command">计算器 (4+5)×6</span> → 54<br>
                <span class="help-command">计算器 20÷4-3</span> → 2
            </div>`;
        }

        try {
            // 纯数字和运算符验证
            const expr = args.join('')
                .replace(/×/g, '*')
                .replace(/÷/g, '/');
            
            if (!/^[\d+\-*/(). ]+$/.test(expr)) {
                throw new Error("只能包含数字和+-×÷*/()");
            }

            // 安全计算
            const result = Function('"use strict";return (' + expr + ')')();
            
            // 处理除零错误
            if (!isFinite(result)) {
                throw new Error("除零错误或无效计算");
            }

            return `<div class="command-output">
                <div class="calculator-result">
                    <span>${expr} = ${result}</span>
                </div>
            </div>`;
            
        } catch (error) {
            return `<div class="error">计算错误: ${error.message || "无效表达式"}</div>`;
        }
    }
}, 
        
        时间: {
            description: "显示当前日期和时间",
            execute: function() {
                const now = new Date();
                return `<div class="command-output">当前时间: ${now.toLocaleString()}</div>`;
            }
        },
        主题: {
            description: "切换主题",
            execute: function(args) {
                if (args.length === 0) {
                    return '<div class="error">请指定主题: 白天 或 晚上</div>';
                }
                const theme = args[0].toLowerCase();
                if (theme === '白天') {
                    document.body.style.backgroundColor = '#f0f0f0';
                    document.querySelector('.terminal').style.backgroundColor = '#ffffff';
                    document.querySelector('.terminal-header').style.backgroundColor = '#e0e0e0';
                    document.querySelector('.terminal-title').style.color = '#505050';
                    document.querySelectorAll('.command, .help-description').forEach(el => {
                        el.style.color = '#333333';
                    });
                    document.querySelector('#command-input').style.color = '#333333';
                    document.querySelector('#command-input').style.caretColor = '#333333';
                    return '<div class="success">已切换至浅色主题</div>';
                } else if (theme === '晚上') {
                    document.body.style.backgroundColor = '#1e1e1e';
                    document.querySelector('.terminal').style.backgroundColor = '#2d2d2d';
                    document.querySelector('.terminal-header').style.backgroundColor = '#3c3c3c';
                    document.querySelector('.terminal-title').style.color = '#a0a0a0';
                    document.querySelectorAll('.command, .help-description').forEach(el => {
                        el.style.color = '#f0f0f0';
                    });
                    document.querySelector('#command-input').style.color = '#f0f0f0';
                    document.querySelector('#command-input').style.caretColor = '#f0f0f0';
                    return '<div class="success">已切换至深色主题</div>';
                } else {
                    return '<div class="error">无效主题，请输入 白天 或 晚上</div>';
                }
            }
        },
        
        必应: {
            description: "在Bing中搜索",
            execute: function(args) {
                if (args.length === 0) {
                    return '<div class="error">请输入搜索内容，例如: bing JavaScript教程</div>';
                }
                const query = args.join(' ');
                setTimeout(() => {
                    window.open(`https://www.bing.com/search?q=${encodeURIComponent(query)}`, '_blank');
                }, 500);
                return `<div class="success">正在Bing中搜索: ${query}</div>`;
            }
        },
        百度: {
            description: "在百度中搜索",
            execute: function(args) {
                if (args.length === 0) {
                    return '<div class="error">请输入搜索内容，例如: baidu 编程学习</div>';
                }
                const query = args.join(' ');
                setTimeout(() => {
                    window.open(`https://www.baidu.com/s?wd=${encodeURIComponent(query)}`, '_blank');
                }, 500);
                return `<div class="success">正在百度中搜索: ${query}</div>`;
            }
        },

音乐: {
    description: "搜索音乐",
    execute: function(args) {
        if (args.length === 0) {
            return '<div class="error">请输入要搜索的歌曲名，例如: 音乐 周杰伦</div>';
        }
        
        const songName = args.join(' ');
        const searchUrl = `http://mc.alger.fun/#/search?keyword=${encodeURIComponent(songName)}&type=1`;
        
        setTimeout(() => {
            window.open(searchUrl, '_blank');
        }, 500);
        
        return `<div class="success">正在搜索音乐: ${songName}</div>`;
    }
},
        
        

   翻译: {
            description: "翻译一下吧！",
            execute: function(args) {
                if (args.length === 0) {
                    return '<div class="error">请输入翻译内容，例如: 翻译 我是大宝宝</div>';
                }
                const query = args.join(' ');
                setTimeout(() => {
                    window.open(`https://fanyi.baidu.com/?aldtype=38319#zh/en/${encodeURIComponent(query)}`, '_blank');
                }, 500);
                return `<div class="success">正在百度中搜索: ${query}</div>`;
            }
        },
        
        
        密码: {
    description: "生成随机密码",
    execute: function(args) {
        // 默认生成12位密码
        let length = 12;
        
        // 解析用户输入的位数
        if (args.length > 0) {
            const num = parseInt(args[0]);
            if (!isNaN(num) && num > 0) {
                length = Math.min(num, 64); // 限制最大64位
            } else {
                return `<div class="error">请输入有效的密码位数 (1-64)</div>`;
            }
        }

        // 密码字符集
        const chars = {
            upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lower: 'abcdefghijklmnopqrstuvwxyz',
            number: '0123456789',
            symbol: '!@#$%^&*()_+-=[]{}|;:,.<>?'
        };

        // 生成密码
        let password = '';
        const allChars = Object.values(chars).join('');
        
        // 确保包含每种类型字符
        password += chars.upper.charAt(Math.floor(Math.random() * chars.upper.length));
        password += chars.lower.charAt(Math.floor(Math.random() * chars.lower.length));
        password += chars.number.charAt(Math.floor(Math.random() * chars.number.length));
        password += chars.symbol.charAt(Math.floor(Math.random() * chars.symbol.length));
        
        // 填充剩余位数
        for (let i = 4; i < length; i++) {
            password += allChars.charAt(Math.floor(Math.random() * allChars.length));
        }
        
        // 打乱密码顺序
        password = password.split('').sort(() => 0.5 - Math.random()).join('');

        // 显示结果
        return `<div class="password-output">
            <strong>生成的${length}位密码:</strong>
            <div class="password-box">${password}</div>
            <butto     n class="copy-btn" onclick="copyToClipboard('${password}')"> </button>
            <small>包含大小写字母、数字和特殊符号</small>
        </div>`;
    }
},



画画: {
    description: "生成随机字符画",
    execute: function(args) {
        // 字符画数据库
        const asciiArtDB = {
            animals: [
                `
  /\_/\\  
 ( o.o ) 
  > ^ <
                `,
                `
   /\\_/\\
  ( -.- )
   (")(")
                `,
                `
    (\\_/)
   (='.'=)
   (")_(")
                `
            ],
            holidays: [
                `
   *   *   *
  * * * * *
   *  |  *
  ~*~ | ~*~
                `,
                `
  .-"-.
 /|\\ /|\\
'/ | | \\`
            ],
            faces: [
                `
  (•_•)
  <) )╯
   / \\
                `,
                `
  (⌐■_■)
  (••)>⌐■-■
  (⌐■_■)
                `,
                `
  (╯°□°）╯︵ ┻━┻
                `
            ],
            random: [
                `
  +-----+

  |     |
  |     |
  +-----+
                `,
                `
  /\\_/\\
 (| o.o |)
  |  ^  |
  \\_~_/
                `
            ]
        };

        // 确定类别
        let category = 'random';
        if (args.length > 0) {
            const arg = args[0].toLowerCase();
            if (asciiArtDB[arg]) {
                category = arg;
            }
        }

        // 随机选择字符画
        const arts = asciiArtDB[category];
        const randomArt = arts[Math.floor(Math.random() * arts.length)];

        // 创建显示容器
        return `<div class="ascii-art">${randomArt}</div>`;
    }
},




   网络: {
    description: "显示本机网络信息",
    execute: function() {
        try {
            // 获取浏览器提供的本地网络信息
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            const isOnline = navigator.onLine;
            
            let output = '<div class="network-info">';
            
            // 基本网络状态
            output += `<div class="network-section">
                <h3>网络状态</h3>
                <div class="network-row">
                    <span class="network-label">在线状态:</span>
                    <span class="network-value">${isOnline ? '<span class="online">在线</span>' : '<span class="offline">离线</span>'}</span>
                </div>`;
            
            // 详细连接信息（部分浏览器支持）
            if (connection) {
                output += `
                <div class="network-row">
                    <span class="network-label">连接类型:</span>
                    <span class="network-value">${connection.type || '未知'}</span>
                </div>
                <div class="network-row">
                    <span class="network-label">有效类型:</span>
                    <span class="network-value">${connection.effectiveType || '未知'}</span>
                </div>
                <div class="network-row">
                    <span class="network-label">下行速度:</span>
                    <span class="network-value">${connection.downlink ? connection.downlink + ' Mbps' : '未知'}</span>
                </div>
                <div class="network-row">
                    <span class="network-label">往返时延:</span>
                    <span class="network-value">${connection.rtt ? connection.rtt + ' ms' : '未知'}</span>
                </div>
                <div class="network-row">
                    <span class="network-label">数据节省:</span>
                    <span class="network-value">${connection.saveData ? '开启' : '关闭'}</span>
                </div>`;
            } else {
                output += `
                <div class="network-notice">
                    当前浏览器不支持Network Information API
                </div>`;
            }
            
            // 添加本地IP显示（通过WebRTC获取局域网IP）
            output += `</div><div class="network-section">
                <h3>本地网络</h3>
                <button class="network-test-btn" onclick="getLocalIP()">获取本地IP</button>
                <div id="local-ip-result"></div>
            </div>`;
            
            // 网速测试功能
            output += `<div class="network-section">
                <h3>速度测试</h3>
                <button class="network-test-btn" onclick="testLocalNetworkSpeed()">测试网速</button>
                <div id="speed-test-result"></div>
            </div>`;
            
            output += '</div>';
            return output;
            
        } catch (e) {
            return `<div class="error">获取网络信息失败: ${e.message}</div>`;
        }
    }
},
   
   
   检测: {
    description: "密码强度检测",
    execute: function(args) {
        if (args.length < 2 || args[0] !== '密码') {
            return `<div class="error">请按格式输入: 检测 密码 您的密码</div>`;
        }

        const password = args.slice(1).join(' ');
        if (password.length === 0) {
            return `<div class="error">密码不能为空</div>`;
        }

        // 评估密码强度
        const strength = checkPasswordStrength(password);
        
        // 生成可视化强度条
        const strengthBar = `<div class="strength-bar">
            <div class="strength-level" style="width: ${strength.score * 25}%; 
                background: ${getStrengthColor(strength.score)}"></div>
        </div>`;
        
        // 构建输出结果
        return `<div class="password-check">
            <h3>密码安全检测</h3>
            ${strengthBar}
            <div class="strength-label">强度: ${getStrengthText(strength.score)}</div>
            
            <div class="password-details">
                <div class="detail-row">
                    <span class="detail-label">密码长度:</span>
                    <span class="detail-value ${password.length >= 8 ? 'good' : 'bad'}">
                        ${password.length} 位 ${password.length >= 8 ? '✓' : '✗'}
                    </span>
                </div>
                
                ${strength.checks.map(check => `
                <div class="detail-row">
                    <span class="detail-label">${check.label}:</span>
                    <span class="detail-value ${check.passed ? 'good' : 'bad'}">
                        ${check.passed ? '✓' : '✗'} ${check.message}
                    </span>
                </div>
                `).join('')}
            </div>
            
            <div class="password-suggestions">
                <strong>安全建议:</strong>
                <ul>
                    ${getSuggestions(strength).map(s => `<li>${s}</li>`).join('')}
                </ul>
            </div>
        </div>`;
    }
},

   
   
   语录: {
    description: "随机显示一句名言/语录",
    execute: function() {
        const quotes = [
            "代码如诗，写的是逻辑之美",
            "Stay hungry, stay foolish. - Steve Jobs",
            "简单是可靠的先决条件。 - Edsger W. Dijkstra",
            "你今天的努力，是幸运的伏笔",
            "编程是理解问题的艺术",
            "不是所有流浪者都迷失了方向",
            "代码写得好，bug少得早",
            "生活就像一盒巧克力，你永远不知道下一块是什么味道",
            "简单即是美，少即是多",
            "Talk is cheap. Show me the code. - Linus Torvalds",
            "万物皆有裂缝，那是光照进来的地方",
            "代码千万行，注释第一行",
            "保持冷静，继续前进",
            "最好的错误信息是那些永远不会出现的错误信息",
            "仰望星空，脚踏实地"
        ];
        
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        return `<div class="quote-box">${randomQuote}</div>`;
    }
},
   
        
常用: {
    description: "常用网站管理",
    execute: function(args) {
        // 从本地存储加载常用网站或使用默认
        let commonLinks = JSON.parse(localStorage.getItem('commonLinks')) || [
            { name: "Google", url: "https://www.google.com" },
            { name: "GitHub", url: "https://github.com" },
            { name: "YouTube", url: "https://www.youtube.com" }
        ];

        // 保存到本地存储
        const saveLinks = () => {
            localStorage.setItem('commonLinks', JSON.stringify(commonLinks));
        };

        // 无参数时显示所有常用网站
        if (args.length === 0) {
            let output = '<div class="command-output">常用网站 (直接输入"常用 名称"快速访问):</div>';
            commonLinks.forEach(link => {
                output += `
                <div class="common-link-item">
                    <a href="${link.url}" target="_blank" class="link">${link.name}</a>
                    <span class="help-description">${link.url}</span>
                    <button class="bookmark-delete" onclick="
                        document.getElementById('command-input').value='常用 删除 ${link.name}';
                        document.getElementById('command-input').dispatchEvent(new KeyboardEvent('keydown', {key:'Enter'}));
                    ">删除</button>
                </div>`;
            });
            return output;
        }

        // 添加网站
        if (args[0] === '添加' && args.length >= 3) {
            const name = args[1];
            const url = args[2];
            
            if (!url.startsWith('http')) {
                return '<div class="error">URL必须以http://或https://开头</div>';
            }
            
            commonLinks.push({ name, url });
            saveLinks();
            return `<div class="success">已添加: ${name} (${url})</div>`;
        }

        // 删除网站
        if (args[0] === '删除' && args.length >= 2) {
            const name = args[1];
            const index = commonLinks.findIndex(link => link.name === name);
            
            if (index === -1) {
                return `<div class="error">未找到: ${name}</div>`;
            }
            
            commonLinks.splice(index, 1);
            saveLinks();
            return `<div class="success">已删除: ${name}</div>`;
        }

        // 直接访问
        const site = commonLinks.find(link => link.name === args[0]);
        if (site) {
            setTimeout(() => {
                window.open(site.url, '_blank');
            }, 300);
            return `<div class="success">正在打开: ${site.name}</div>`;
        }

        return `<div class="error">未找到命令或网站: ${args[0]}</div>`;
    }
},
       
        

       
        
        
       
       
       书签: {
    description: "书签管理",
    execute: function(args) {
        // 从本地存储加载书签或使用默认
        let bookmarks = JSON.parse(localStorage.getItem('terminalBookmarks')) || {
                   "常用": [
          
            { name: "GitHub", url: "https://github.com" }
        ],
        "教程": [
            { name: "书签教程", url: "书签.png" },
          
        ]
    };
    

        // 保存书签
        const saveBookmarks = () => {
            localStorage.setItem('terminalBookmarks', JSON.stringify(bookmarks));
        };

        // 无参数时显示所有目录
        if (args.length === 0) {
            let output = '<div class="command-output">书签目录 (直接输入"书签 名称"快速访问):</div>';
            for (const category in bookmarks) {
                output += `<div class="link" onclick="document.getElementById('command-input').value='书签 ${category}';document.getElementById('command-input').dispatchEvent(new KeyboardEvent('keydown', {key:'Enter'}));">📁 ${category} (${bookmarks[category].length}个)</div>`;
            }
            return output;
        }

        // 尝试查找匹配的书签名称（在所有目录中搜索）
        if (args.length === 1) {
            const searchName = args[0];
            
            // 先检查是否是目录名
            if (bookmarks[searchName]) {
                let output = `<div class="command-output">书签目录 "${searchName}":</div>`;
                bookmarks[searchName].forEach(bookmark => {
                    output += `<div class="bookmark-item">
                        <a href="${bookmark.url}" target="_blank" class="link">🔖 ${bookmark.name}</a>
                        <span class="help-description">${bookmark.url}</span>
                        <button class="bookmark-delete" onclick="document.getElementById('command-input').value='书签 删除 ${bookmark.name} ${searchName}';document.getElementById('command-input').dispatchEvent(new KeyboardEvent('keydown', {key:'Enter'}));">删除</button>
                    </div>`;
                });
                return output;
            }
            
            // 搜索所有目录中的书签
            let foundBookmark = null;
            let foundCategory = null;
            
            for (const category in bookmarks) {
                const bookmark = bookmarks[category].find(b => b.name === searchName);
                if (bookmark) {
                    foundBookmark = bookmark;
                    foundCategory = category;
                    break;
                }
            }
            
            if (foundBookmark) {
                setTimeout(() => {
                    window.open(foundBookmark.url, '_blank');
                }, 300);
                return `<div class="success">正在打开书签: ${foundBookmark.name} (来自目录: ${foundCategory})</div>`;
            }
        }

        // 添加书签
        if (args[0] === '添加' && args.length >= 3) {
            const name = args[1];
            const url = args[2];
            let category = args[3] || '常用';
            
            if (!url.match(/^https?:\/\//)) {
                return '<div class="error">URL必须以http://或https://开头</div>';
            }
            
            if (!bookmarks[category]) {
                bookmarks[category] = [];
            }
            
            for (const cat in bookmarks) {
                const existing = bookmarks[cat].find(b => b.name === name);
                if (existing) {
                    return `<div class="error">书签 "${name}" 已存在于目录 "${cat}" 中</div>`;
                }
            }
            
            bookmarks[category].push({ name, url });
            saveBookmarks();
            return `<div class="success">书签 "${name}" 已添加到目录 "${category}"</div>`;
        }
        
        // 移动书签
        if (args[0] === '移动' && args.length >= 3) {
            const name = args[1];
            const oldCategory = args[2];
            const newCategory = args[3] || '常用';
            
            if (!bookmarks[oldCategory]) {
                return `<div class="error">目录 "${oldCategory}" 不存在</div>`;
            }
            
            const bookmarkIndex = bookmarks[oldCategory].findIndex(b => b.name === name);
            if (bookmarkIndex === -1) {
                return `<div class="error">书签 "${name}" 在目录 "${oldCategory}" 中不存在</div>`;
            }
            
            const bookmark = bookmarks[oldCategory][bookmarkIndex];
            
            if (!bookmarks[newCategory]) {
                bookmarks[newCategory] = [];
            }
            
            const existing = bookmarks[newCategory].find(b => b.name === name);
            if (existing) {
                return `<div class="error">书签 "${name}" 已存在于目录 "${newCategory}" 中</div>`;
            }
            
            bookmarks[oldCategory].splice(bookmarkIndex, 1);
            bookmarks[newCategory].push(bookmark);
            saveBookmarks();
            return `<div class="success">书签 "${name}" 已从目录 "${oldCategory}" 移动到 "${newCategory}"</div>`;
        }
        
        // 删除书签
        if (args[0] === '删除' && args.length >= 2) {
            const name = args[1];
            const category = args[2] || Object.keys(bookmarks).find(cat => 
                bookmarks[cat].some(b => b.name === name)
            );
            
            if (!category || !bookmarks[category]) {
                return `<div class="error">找不到书签 "${name}"</div>`;
            }
            
            const bookmarkIndex = bookmarks[category].findIndex(b => b.name === name);
            if (bookmarkIndex === -1) {
                return `<div class="error">书签 "${name}" 在目录 "${category}" 中不存在</div>`;
            }
            
            bookmarks[category].splice(bookmarkIndex, 1);
            saveBookmarks();
            return `<div class="success">书签 "${name}" 已从目录 "${category}" 删除</div>`;
        }
        
        // 删除目录
        if (args[0] === '删除目录' && args.length >= 2) {
            const category = args[1];
            
            if (!bookmarks[category]) {
                return `<div class="error">目录 "${category}" 不存在</div>`;
            }
            
            if (bookmarks[category].length > 0) {
                return `<div class="error">目录 "${category}" 不为空，无法删除</div>`;
            }
            
            delete bookmarks[category];
            saveBookmarks();
            return `<div class="success">目录 "${category}" 已删除</div>`;
        }
        
        return '<div class="error">无效的书签命令或未找到匹配的书签，使用"书签"查看帮助</div>';
    }
},
       
        背景: {
            description: "设置背景图片和透明度",
            execute: function(args) {
                if (args.length < 2) {
                    const currentBg = localStorage.getItem('terminalBackground');
                    const currentOpacity = localStorage.getItem('terminalOpacity');
                    if (currentBg) {
                        return `<div class="command-output">当前背景: ${currentBg}<br>透明度: ${currentOpacity || 0.8}</div>`;
                    }
                    return '<div class="error">请提供图片URL和透明度值 (0-1), 例如: 背景 图片链接 0.8</div>';
                }
                
                const imageUrl = args[0];
                const opacity = parseFloat(args[1]);
                
                if (isNaN(opacity) || opacity < 0 || opacity > 1) {
                    return '<div class="error">透明度值必须在0到1之间</div>';
                }
                
                // 设置背景图片和透明度
                document.body.style.backgroundImage = `url('${imageUrl}')`;
                applyOpacity(opacity);
                
                // 保存到本地存储
                localStorage.setItem('terminalBackground', imageUrl);
                localStorage.setItem('terminalOpacity', opacity);
                
                return `<div class="success">背景图片已设置为: ${imageUrl}, 透明度: ${opacity}</div>`;
            }
        },
        默认: {
            description: "恢复默认背景设置",
            execute: function() {
                // 清除保存的背景设置
                localStorage.removeItem('terminalBackground');
                localStorage.removeItem('terminalOpacity');
                
                // 恢复默认背景
                document.body.style.backgroundImage = '';
                document.body.style.backgroundColor = '#1e1e1e';
                document.querySelector('.terminal').style.backgroundColor = '#2d2d2d';
                document.querySelector('.terminal-header').style.backgroundColor = '#3c3c3c';
                
                return '<div class="success">已恢复默认背景设置</div>';
            }
        },
        
        
        信息: {
    description: "显示当前终端版本信息",
    execute: function() {
        const versionInfo = `
            <div class="command-output">
                <strong>CNLingQi</strong><br>
                版本:V20250420 <br>
                最后更新: 2025-4-20<br>
                GitHub: <a href="https://github.com/yourname/terminal" target="_blank" class="link">项目地址</a>
            </div>
        `;
        return versionInfo;
    }
}
    };

    // 处理命令输入
    function handleCommand() {
        const input = commandInput.value.trim();
        if (input === '') return;
        
        // 添加命令到历史记录
        const commandLine = document.createElement('div');
        commandLine.className = 'command-line';
        commandLine.innerHTML = `<span class="prompt">用户:~$</span><span class="command">${input}</span>`;
        historyElement.appendChild(commandLine);
        
        // 解析命令
        const parts = input.split(' ');
        const commandName = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        // 执行命令
        let output = '';
        if (commands[commandName]) {
            output = commands[commandName].execute(args);
        } else {
            output = `<div class="error">命令未找到: ${commandName}. 输入 "帮助" 获取可用命令</div>`;
        }
        
        // 添加输出到历史记录
        if (output) {
            const outputElement = document.createElement('div');
            outputElement.innerHTML = output;
            historyElement.appendChild(outputElement);
        }
        
        // 清空输入框并滚动到底部
        commandInput.value = '';
        historyElement.scrollTop = historyElement.scrollHeight;
    }

    // 监听回车键
    commandInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            handleCommand();
        }
    });

    // 初始焦点
    commandInput.focus();
});

// 获取本地IP地址
function getLocalIP() {
    const resultDiv = document.getElementById('local-ip-result');
    resultDiv.innerHTML = '<div class="testing">检测中...</div>';
    
    // 使用WebRTC获取本地IP
    const pc = new RTCPeerConnection({iceServers:[]});
    pc.createDataChannel('');
    pc.createOffer().then(offer => pc.setLocalDescription(offer)).catch(err => {});
    
    pc.onicecandidate = ice => {
        if (!ice.candidate) return;
        const ip = ice.candidate.candidate.split(' ')[4];
        if (ip && ip.match(/([0-9]{1,3}\.){3}[0-9]{1,3}/)) {
            resultDiv.innerHTML = `
                <div class="speed-test">
                    <div class="speed-result">本地IP: <strong>${ip}</strong></div>
                    <div class="speed-details">(局域网地址)</div>
                </div>
            `;
            pc.close();
        }
    };
}

// 本地网速测试（基于下载计算）
async function testLocalNetworkSpeed() {
    const resultDiv = document.getElementById('speed-test-result');
    resultDiv.innerHTML = '<div class="testing">测试中... (约10秒)</div>';
    
    try {
        const testDataSize = 5 * 1024 * 1024; // 5MB测试数据
        const startTime = performance.now();
        
        // 使用Blob对象创建测试数据
        const blob = new Blob([new Uint8Array(testDataSize)]);
        const url = URL.createObjectURL(blob);
        
        await fetch(url).then(res => res.blob());
        const duration = (performance.now() - startTime) / 1000;
        const speed = ((testDataSize * 8) / (duration * 1000000)).toFixed(2);
        
        resultDiv.innerHTML = `
            <div class="speed-test">
                <div class="speed-result">本地速度: <strong>${speed} Mbps</strong></div>
                <div class="speed-details">
                    用时: ${duration.toFixed(2)}秒 | 
                    测试数据: 5MB
                </div>
            </div>
        `;
        
        URL.revokeObjectURL(url);
    } catch (e) {
        resultDiv.innerHTML = '<div class="error">测试失败: ' + e.message + '</div>';
    }
}




// 密码强度评估函数
function checkPasswordStrength(password) {
    const checks = [
        {
            label: "大写字母",
            regex: /[A-Z]/,
            message: "至少包含1个大写字母",
            weight: 1
        },
        {
            label: "小写字母",
            regex: /[a-z]/,
            message: "至少包含1个小写字母",
            weight: 1
        },
        {
            label: "数字",
            regex: /[0-9]/,
            message: "至少包含1个数字",
            weight: 1
        },
        {
            label: "特殊符号",
            regex: /[^A-Za-z0-9]/,
            message: "至少包含1个特殊符号",
            weight: 1.5
        },
        {
            label: "重复字符",
            regex: /(.)\1{2,}/,
            message: "无3个以上重复字符",
            weight: -1,
            invert: true
        },
        {
            label: "常见密码",
            regex: new RegExp(['123456','password','qwerty','111111'].join('|'), 'i'),
            message: "不是常见弱密码",
            weight: -2,
            invert: true
        }
    ];

    // 执行检查
    const results = checks.map(check => {
        const passed = check.invert ? !check.regex.test(password) : check.regex.test(password);
        return { ...check, passed };
    });

    // 计算分数 (0-4)
    let score = Math.min(
        Math.floor(password.length / 4) + 
        results.reduce((sum, check) => sum + (check.passed ? check.weight : 0), 0),
        4
    );
    score = Math.max(score, 0);

    return {
        score,
        checks: results,
        length: password.length
    };
}

// 获取强度颜色
function getStrengthColor(score) {
    const colors = ['#ff3e36', '#ff691f', '#ffda36', '#8bc34a', '#4caf50'];
    return colors[score];
}

// 获取强度文本
function getStrengthText(score) {
    const texts = ['极弱', '弱', '中等', '强', '极强'];
    return texts[score];
}

// 获取改进建议
function getSuggestions(strength) {
    const suggestions = [];
    const { score, checks, length } = strength;

    if (length < 8) {
        suggestions.push("密码长度至少8位");
    }

    if (score < 2) {
        suggestions.push("混合使用大小写字母、数字和特殊符号");
    }

    checks.filter(c => !c.passed).forEach(check => {
        if (!check.invert) {
            suggestions.push(check.message);
        }
    });

    if (suggestions.length === 0) {
        suggestions.push("这是一个安全性很好的密码");
    }

    return suggestions;
}