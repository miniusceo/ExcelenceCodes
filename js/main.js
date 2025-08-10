// ExcelenceAI Main Application Controller
class ExcelenceAI {
    constructor() {
        this.settings = this.loadSettings();
        this.currentFile = null;
        this.lastDetection = null;
        this.commands = this.initializeCommands();
        this.isProcessing = false;
        
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.initializeElements();
        this.attachEventListeners();
        this.initializeKeyboardShortcuts();
        this.initializeTheme();
        this.initializeDragAndDrop();
        this.initializeResizer();
        this.applySettings();
        
        // Show welcome message
        this.showWelcomeMessage();
        
        console.log('ExcelenceAI initialized successfully');
    }

    /**
     * Initialize DOM elements
     */
    initializeElements() {
        // Main elements
        this.inputEditor = document.getElementById('inputEditor');
        this.outputEditor = document.getElementById('outputEditor');
        this.outputHighlight = document.getElementById('outputHighlight');
        this.dropZone = document.getElementById('dropZone');
        this.fileInput = document.getElementById('fileInput');
        
        // Toolbar buttons
        this.uploadBtn = document.getElementById('uploadBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.formatBtn = document.getElementById('formatBtn');
        this.minifyBtn = document.getElementById('minifyBtn');
        this.cleanBtn = document.getElementById('cleanBtn');
        this.deminifyBtn = document.getElementById('deminifyBtn');
        this.commandPaletteBtn = document.getElementById('commandPaletteBtn');
        this.diffToggle = document.getElementById('diffToggle');
        
        // Navigation buttons
        this.themeToggle = document.getElementById('themeToggle');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.helpBtn = document.getElementById('helpBtn');
        
        // Status elements
        this.languageStatus = document.getElementById('languageStatus');
        this.fileStatus = document.getElementById('fileStatus');
        this.timeStatus = document.getElementById('timeStatus');
        this.savingsStatus = document.getElementById('savingsStatus');
        
        // Modals
        this.settingsModal = document.getElementById('settingsModal');
        this.helpModal = document.getElementById('helpModal');
        this.commandPalette = document.getElementById('commandPalette');
        this.commandInput = document.getElementById('commandInput');
        this.commandList = document.getElementById('commandList');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        
        // Panel controls
        this.lineNumbersToggle = document.getElementById('lineNumbersToggle');
        this.syntaxHighlightToggle = document.getElementById('syntaxHighlightToggle');
        
        // Settings controls
        this.themeSelect = document.getElementById('themeSelect');
        this.fontSizeRange = document.getElementById('fontSizeRange');
        this.fontSizeValue = document.getElementById('fontSizeValue');
        this.tabWidthRange = document.getElementById('tabWidthRange');
        this.tabWidthValue = document.getElementById('tabWidthValue');
        this.lineNumbersCheck = document.getElementById('lineNumbersCheck');
        this.braceStyleSelect = document.getElementById('braceStyleSelect');
        
        // Resize handle
        this.resizeHandle = document.getElementById('resizeHandle');
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Input editor
        this.inputEditor.addEventListener('input', 
            Utils.debounce(this.onInputChange.bind(this), 300));
        this.inputEditor.addEventListener('paste', this.onPaste.bind(this));
        
        // Toolbar buttons
        this.uploadBtn.addEventListener('click', () => this.fileInput.click());
        this.downloadBtn.addEventListener('click', this.downloadFile.bind(this));
        this.copyBtn.addEventListener('click', this.copyToClipboard.bind(this));
        this.formatBtn.addEventListener('click', () => this.processCode('format'));
        this.minifyBtn.addEventListener('click', () => this.processCode('minify'));
        this.cleanBtn.addEventListener('click', () => this.processCode('clean'));
        this.deminifyBtn.addEventListener('click', () => this.processCode('deminify'));
        this.commandPaletteBtn.addEventListener('click', this.showCommandPalette.bind(this));
        this.diffToggle.addEventListener('click', this.toggleDiffMode.bind(this));
        
        // Navigation buttons
        this.themeToggle.addEventListener('click', this.cycleTheme.bind(this));
        this.settingsBtn.addEventListener('click', () => this.showModal('settings'));
        this.helpBtn.addEventListener('click', () => this.showModal('help'));
        
        // File input
        this.fileInput.addEventListener('change', this.onFileSelect.bind(this));
        
        // Panel controls
        this.lineNumbersToggle.addEventListener('click', this.toggleLineNumbers.bind(this));
        this.syntaxHighlightToggle.addEventListener('click', this.toggleSyntaxHighlighting.bind(this));
        
        // Settings controls
        this.themeSelect.addEventListener('change', this.onThemeChange.bind(this));
        this.fontSizeRange.addEventListener('input', this.onFontSizeChange.bind(this));
        this.tabWidthRange.addEventListener('input', this.onTabWidthChange.bind(this));
        this.lineNumbersCheck.addEventListener('change', this.onLineNumbersToggle.bind(this));
        this.braceStyleSelect.addEventListener('change', this.onBraceStyleChange.bind(this));
        
        // Modal close handlers
        this.attachModalHandlers();
        
        // Command palette
        this.commandInput.addEventListener('input', this.onCommandInput.bind(this));
        this.commandInput.addEventListener('keydown', this.onCommandKeydown.bind(this));
        this.commandList.addEventListener('click', this.onCommandClick.bind(this));
        
        // Tab handlers
        this.attachTabHandlers();
    }

    /**
     * Initialize keyboard shortcuts
     */
    initializeKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey || event.metaKey) {
                switch (event.key) {
                    case 'o':
                        event.preventDefault();
                        this.fileInput.click();
                        break;
                    case 's':
                        event.preventDefault();
                        this.downloadFile();
                        break;
                    case 'c':
                        if (!this.isInEditor(event.target)) {
                            event.preventDefault();
                            this.copyToClipboard();
                        }
                        break;
                    case 'm':
                        event.preventDefault();
                        this.processCode('minify');
                        break;
                    case 'l':
                        event.preventDefault();
                        this.processCode('clean');
                        break;
                    case 'd':
                        event.preventDefault();
                        this.processCode('deminify');
                        break;
                    case 'p':
                        if (event.shiftKey) {
                            event.preventDefault();
                            this.showCommandPalette();
                        }
                        break;
                    case 'f':
                        if (event.shiftKey) {
                            event.preventDefault();
                            this.processCode('format');
                        }
                        break;
                }
            }
            
            if (event.key === 'Escape') {
                this.closeModals();
            }
        });
    }

    /**
     * Initialize theme system
     */
    initializeTheme() {
        document.body.setAttribute('data-theme', this.settings.theme);
        this.updateThemeIcon();
        this.themeSelect.value = this.settings.theme;
    }

    /**
     * Initialize drag and drop
     */
    initializeDragAndDrop() {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            document.addEventListener(eventName, this.preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            document.addEventListener(eventName, this.highlight.bind(this), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            document.addEventListener(eventName, this.unhighlight.bind(this), false);
        });

        document.addEventListener('drop', this.handleDrop.bind(this), false);
        this.dropZone.addEventListener('click', () => this.fileInput.click());
    }

    /**
     * Initialize panel resizer
     */
    initializeResizer() {
        let isResizing = false;
        
        this.resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            
            const container = document.querySelector('.editor-container');
            const containerRect = container.getBoundingClientRect();
            const percentage = ((e.clientX - containerRect.left) / containerRect.width) * 100;
            
            if (percentage > 20 && percentage < 80) {
                container.style.gridTemplateColumns = `${percentage}% 4px 1fr`;
            }
        });

        document.addEventListener('mouseup', () => {
            isResizing = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        });
    }

    /**
     * Show welcome message
     */
    showWelcomeMessage() {
        this.inputEditor.placeholder = `Welcome to ExcelenceAI! 

🚀 Features:
• Drag & drop files or paste code
• Real-time language detection
• Format, minify, clean, and deminify code
• Multiple themes and customization options
• Keyboard shortcuts (Ctrl+Shift+P for commands)

Supported languages: C, C++, C#, Objective-C, JavaScript, HTML, CSS, PHP, SQL, JSON

Start by pasting code or uploading a file!`;
    }

    /**
     * Handle input change
     */
    async onInputChange() {
        const code = this.inputEditor.value;
        
        if (code.trim()) {
            // Detect language
            const detection = await this.measureTime(() => 
                api.detectLanguage(code, this.currentFile?.name)
            );
            
            this.lastDetection = detection.result;
            this.updateLanguageStatus(detection.result);
            this.updateProcessingTime(detection.time);
            
            // Auto-format if enabled and small code
            if (this.settings.autoFormat && code.length < 10000) {
                this.processCode('format', false);
            }
        } else {
            this.updateLanguageStatus({ name: 'Unknown', score: 0 });
            this.outputEditor.value = '';
            this.updateSyntaxHighlighting();
        }
    }

    /**
     * Handle paste event
     */
    async onPaste(event) {
        // Small delay to let paste complete
        setTimeout(() => this.onInputChange(), 10);
    }

    /**
     * Handle file selection
     */
    async onFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        this.showLoading(true);
        
        try {
            const content = await this.readFile(file);
            this.currentFile = file;
            this.inputEditor.value = content;
            this.updateFileStatus(file);
            await this.onInputChange();
            Utils.showNotification(`File "${file.name}" loaded successfully`, 'success');
        } catch (error) {
            console.error('Error reading file:', error);
            Utils.showNotification('Error reading file', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    /**
     * Process code with specified operation
     */
    async processCode(operation, showNotification = true) {
        if (this.isProcessing) return;
        
        const code = this.inputEditor.value.trim();
        if (!code) {
            Utils.showNotification('Please enter some code first', 'warning');
            return;
        }

        this.isProcessing = true;
        this.showLoading(true);

        try {
            const originalSize = code.length;
            const lang = this.lastDetection?.key || 'javascript';
            
            const result = await this.measureTime(async () => {
                switch (operation) {
                    case 'format':
                        return api.formatCode(code, lang, this.settings.formatting);
                    case 'minify':
                        return api.minify(code, lang);
                    case 'clean':
                        return api.cleanCode(code, lang);
                    case 'deminify':
                        return api.deminify(code, lang);
                    default:
                        return code;
                }
            });

            this.outputEditor.value = result.result;
            this.updateSyntaxHighlighting();
            this.updateProcessingTime(result.time);
            
            // Calculate savings
            const newSize = result.result.length;
            const savings = Utils.calculatePercentageChange(originalSize, newSize);
            this.updateSavingsStatus(savings, originalSize, newSize);
            
            if (showNotification) {
                const action = operation.charAt(0).toUpperCase() + operation.slice(1);
                Utils.showNotification(`Code ${action.toLowerCase()}ed successfully`, 'success');
            }
            
        } catch (error) {
            console.error(`Error during ${operation}:`, error);
            Utils.showNotification(`Error during ${operation}`, 'error');
        } finally {
            this.isProcessing = false;
            this.showLoading(false);
        }
    }

    /**
     * Download output as file
     */
    downloadFile() {
        const content = this.outputEditor.value || this.inputEditor.value;
        if (!content.trim()) {
            Utils.showNotification('No content to download', 'warning');
            return;
        }

        const detection = this.lastDetection;
        const extension = this.getFileExtension(detection?.key);
        const fileName = this.currentFile?.name || 
            `excellenceai-output${extension}`;
        
        Utils.downloadFile(content, fileName);
        Utils.showNotification('File downloaded successfully', 'success');
    }

    /**
     * Copy output to clipboard
     */
    async copyToClipboard() {
        const content = this.outputEditor.value || this.inputEditor.value;
        if (!content.trim()) {
            Utils.showNotification('No content to copy', 'warning');
            return;
        }

        const success = await Utils.copyToClipboard(content);
        if (success) {
            Utils.showNotification('Copied to clipboard', 'success');
        } else {
            Utils.showNotification('Failed to copy to clipboard', 'error');
        }
    }

    /**
     * Show command palette
     */
    showCommandPalette() {
        this.commandPalette.classList.add('active');
        this.commandInput.value = '';
        this.commandInput.focus();
        this.renderCommandList(this.commands);
    }

    /**
     * Toggle diff mode
     */
    toggleDiffMode() {
        this.diffToggle.classList.toggle('active');
        const isActive = this.diffToggle.classList.contains('active');
        
        if (isActive) {
            // Implement diff view
            this.enableDiffMode();
            Utils.showNotification('Diff mode enabled', 'info');
        } else {
            this.disableDiffMode();
            Utils.showNotification('Diff mode disabled', 'info');
        }
    }

    /**
     * Cycle through themes
     */
    cycleTheme() {
        const themes = ['light', 'dark', 'high-contrast', 'solarized', 'dracula'];
        const currentIndex = themes.indexOf(this.settings.theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        const newTheme = themes[nextIndex];
        
        this.setTheme(newTheme);
    }

    /**
     * Set theme
     */
    setTheme(theme) {
        this.settings.theme = theme;
        document.body.setAttribute('data-theme', theme);
        this.themeSelect.value = theme;
        this.updateThemeIcon();
        this.saveSettings();
        
        // Animate theme transition
        document.body.style.transition = 'background-color 0.3s, color 0.3s';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    /**
     * Show modal
     */
    showModal(type) {
        const modal = type === 'settings' ? this.settingsModal : this.helpModal;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
    }

    /**
     * Close modals
     */
    closeModals() {
        document.querySelectorAll('.modal, .command-palette').forEach(modal => {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
        });
    }

    /**
     * Toggle line numbers
     */
    toggleLineNumbers() {
        this.settings.showLineNumbers = !this.settings.showLineNumbers;
        this.lineNumbersCheck.checked = this.settings.showLineNumbers;
        this.lineNumbersToggle.classList.toggle('active', this.settings.showLineNumbers);
        this.updateSyntaxHighlighting();
        this.saveSettings();
    }

    /**
     * Toggle syntax highlighting
     */
    toggleSyntaxHighlighting() {
        this.settings.syntaxHighlight = !this.settings.syntaxHighlight;
        this.syntaxHighlightToggle.classList.toggle('active', this.settings.syntaxHighlight);
        this.updateSyntaxHighlighting();
        this.saveSettings();
    }

    /**
     * Update syntax highlighting
     */
    updateSyntaxHighlighting() {
        if (!this.settings.syntaxHighlight) {
            this.outputHighlight.innerHTML = '';
            this.outputHighlight.style.display = 'none';
            return;
        }

        const code = this.outputEditor.value;
        const lang = this.lastDetection?.key;
        
        if (code && lang) {
            const highlighted = api.highlightSyntax(code, lang);
            this.outputHighlight.innerHTML = highlighted;
            this.outputHighlight.style.display = 'block';
        } else {
            this.outputHighlight.innerHTML = '';
            this.outputHighlight.style.display = 'none';
        }
    }

    /**
     * Update status displays
     */
    updateLanguageStatus(detection) {
        const span = this.languageStatus.querySelector('span');
        span.textContent = detection.score > 0 ? 
            `${detection.name} (${detection.score}pts)` : 'No language detected';
    }

    updateFileStatus(file) {
        const span = this.fileStatus.querySelector('span');
        if (file) {
            span.textContent = `${file.name} (${Utils.formatFileSize(file.size)})`;
        } else {
            span.textContent = 'No file';
        }
    }

    updateProcessingTime(time) {
        const span = this.timeStatus.querySelector('span');
        span.textContent = `${Math.round(time)}ms`;
    }

    updateSavingsStatus(percentage, originalSize, newSize) {
        const span = this.savingsStatus.querySelector('span');
        const savings = Math.abs(percentage);
        const direction = percentage < 0 ? 'saved' : 'increased';
        span.textContent = `${savings.toFixed(1)}% ${direction}`;
    }

    updateThemeIcon() {
        const icon = this.themeToggle.querySelector('i');
        const themeIcons = {
            light: 'fa-sun',
            dark: 'fa-moon',
            'high-contrast': 'fa-adjust',
            solarized: 'fa-eye',
            dracula: 'fa-bat'
        };
        
        icon.className = `fas ${themeIcons[this.settings.theme] || 'fa-palette'}`;
    }

    /**
     * Event handlers
     */
    onThemeChange() {
        this.setTheme(this.themeSelect.value);
    }

    onFontSizeChange() {
        const fontSize = parseInt(this.fontSizeRange.value);
        this.settings.fontSize = fontSize;
        this.fontSizeValue.textContent = `${fontSize}px`;
        this.applyFontSize();
        this.saveSettings();
    }

    onTabWidthChange() {
        const tabWidth = parseInt(this.tabWidthRange.value);
        this.settings.tabWidth = tabWidth;
        this.settings.formatting.tabWidth = tabWidth;
        this.tabWidthValue.textContent = tabWidth;
        this.applyTabWidth();
        this.saveSettings();
    }

    onLineNumbersToggle() {
        this.toggleLineNumbers();
    }

    onBraceStyleChange() {
        const braceStyle = this.braceStyleSelect.value;
        this.settings.formatting.braceStyle = braceStyle;
        this.saveSettings();
    }

    onCommandInput() {
        const query = this.commandInput.value.toLowerCase();
        const filtered = this.commands.filter(cmd => 
            cmd.name.toLowerCase().includes(query) ||
            cmd.description.toLowerCase().includes(query)
        );
        this.renderCommandList(filtered);
    }

    onCommandKeydown(event) {
        const items = this.commandList.querySelectorAll('.command-item');
        const selected = this.commandList.querySelector('.command-item.selected');
        let selectedIndex = Array.from(items).indexOf(selected);

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                selectedIndex = (selectedIndex + 1) % items.length;
                this.selectCommandItem(selectedIndex);
                break;
            case 'ArrowUp':
                event.preventDefault();
                selectedIndex = selectedIndex <= 0 ? items.length - 1 : selectedIndex - 1;
                this.selectCommandItem(selectedIndex);
                break;
            case 'Enter':
                event.preventDefault();
                if (selected) {
                    this.executeCommand(selected.dataset.command);
                }
                break;
            case 'Escape':
                this.closeModals();
                break;
        }
    }

    onCommandClick(event) {
        const item = event.target.closest('.command-item');
        if (item) {
            this.executeCommand(item.dataset.command);
        }
    }

    /**
     * Utility methods
     */
    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    highlight() {
        this.dropZone.classList.add('active');
    }

    unhighlight() {
        this.dropZone.classList.remove('active');
    }

    async handleDrop(e) {
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            const file = files[0];
            this.currentFile = file;
            
            try {
                const content = await this.readFile(file);
                this.inputEditor.value = content;
                this.updateFileStatus(file);
                await this.onInputChange();
                Utils.showNotification(`File "${file.name}" loaded successfully`, 'success');
            } catch (error) {
                console.error('Error reading dropped file:', error);
                Utils.showNotification('Error reading file', 'error');
            }
        }
    }

    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    isInEditor(element) {
        return element === this.inputEditor || element === this.outputEditor;
    }

    showLoading(show) {
        this.loadingOverlay.classList.toggle('active', show);
        this.loadingOverlay.setAttribute('aria-hidden', !show);
    }

    async measureTime(func) {
        return Utils.measureExecutionTime(func);
    }

    getFileExtension(langKey) {
        const extensions = {
            javascript: '.js',
            html: '.html',
            css: '.css',
            json: '.json',
            php: '.php',
            sql: '.sql',
            c: '.c',
            cpp: '.cpp',
            csharp: '.cs',
            objc: '.m'
        };
        return extensions[langKey] || '.txt';
    }

    /**
     * Command system
     */
    initializeCommands() {
        return [
            {
                name: 'Format Code',
                description: 'Format and prettify code',
                icon: 'fa-magic',
                shortcut: 'Ctrl+Shift+F',
                action: () => this.processCode('format')
            },
            {
                name: 'Minify Code',
                description: 'Compress and minify code',
                icon: 'fa-compress-alt',
                shortcut: 'Ctrl+M',
                action: () => this.processCode('minify')
            },
            {
                name: 'Clean Code',
                description: 'Remove excess whitespace',
                icon: 'fa-broom',
                shortcut: 'Ctrl+L',
                action: () => this.processCode('clean')
            },
            {
                name: 'Deminify Code',
                description: 'Expand minified code',
                icon: 'fa-expand-alt',
                shortcut: 'Ctrl+D',
                action: () => this.processCode('deminify')
            },
            {
                name: 'Upload File',
                description: 'Upload a code file',
                icon: 'fa-upload',
                shortcut: 'Ctrl+O',
                action: () => this.fileInput.click()
            },
            {
                name: 'Download File',
                description: 'Download processed code',
                icon: 'fa-download',
                shortcut: 'Ctrl+S',
                action: () => this.downloadFile()
            },
            {
                name: 'Copy to Clipboard',
                description: 'Copy output to clipboard',
                icon: 'fa-copy',
                shortcut: 'Ctrl+C',
                action: () => this.copyToClipboard()
            },
            {
                name: 'Toggle Theme',
                description: 'Cycle through themes',
                icon: 'fa-palette',
                shortcut: '',
                action: () => this.cycleTheme()
            },
            {
                name: 'Toggle Line Numbers',
                description: 'Show/hide line numbers',
                icon: 'fa-list-ol',
                shortcut: '',
                action: () => this.toggleLineNumbers()
            },
            {
                name: 'Toggle Syntax Highlighting',
                description: 'Enable/disable syntax highlighting',
                icon: 'fa-paint-brush',
                shortcut: '',
                action: () => this.toggleSyntaxHighlighting()
            }
        ];
    }

    renderCommandList(commands) {
        this.commandList.innerHTML = commands.map((cmd, index) => `
            <div class="command-item ${index === 0 ? 'selected' : ''}" data-command="${index}">
                <i class="fas ${cmd.icon}"></i>
                <div class="command-item-text">
                    <div>${cmd.name}</div>
                    <small>${cmd.description}</small>
                </div>
                <div class="command-item-shortcut">${cmd.shortcut}</div>
            </div>
        `).join('');
    }

    selectCommandItem(index) {
        const items = this.commandList.querySelectorAll('.command-item');
        items.forEach(item => item.classList.remove('selected'));
        if (items[index]) {
            items[index].classList.add('selected');
            items[index].scrollIntoView({ block: 'nearest' });
        }
    }

    executeCommand(commandIndex) {
        const command = this.commands[parseInt(commandIndex)];
        if (command) {
            command.action();
            this.closeModals();
        }
    }

    enableDiffMode() {
        // Placeholder for diff mode implementation
        document.body.classList.add('diff-mode');
    }

    disableDiffMode() {
        document.body.classList.remove('diff-mode');
    }

    /**
     * Modal and tab handlers
     */
    attachModalHandlers() {
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', this.closeModals.bind(this));
        });

        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModals();
            });
        });

        document.querySelectorAll('.command-close').forEach(btn => {
            btn.addEventListener('click', this.closeModals.bind(this));
        });
    }

    attachTabHandlers() {
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const container = e.target.closest('.modal-body, .command-content');
                const targetTab = e.target.dataset.tab;
                
                // Update tab states
                container.querySelectorAll('.tab').forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                });
                e.target.classList.add('active');
                e.target.setAttribute('aria-selected', 'true');
                
                // Update panel states
                container.querySelectorAll('.tab-panel').forEach(panel => {
                    panel.classList.remove('active');
                });
                const targetPanel = container.querySelector(`#${targetTab}`);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            });
        });
    }

    /**
     * Settings management
     */
    applySettings() {
        this.applyFontSize();
        this.applyTabWidth();
        this.fontSizeRange.value = this.settings.fontSize;
        this.fontSizeValue.textContent = `${this.settings.fontSize}px`;
        this.tabWidthRange.value = this.settings.tabWidth;
        this.tabWidthValue.textContent = this.settings.tabWidth;
        this.lineNumbersCheck.checked = this.settings.showLineNumbers;
        this.braceStyleSelect.value = this.settings.formatting.braceStyle;
        this.lineNumbersToggle.classList.toggle('active', this.settings.showLineNumbers);
        this.syntaxHighlightToggle.classList.toggle('active', this.settings.syntaxHighlight);
    }

    applyFontSize() {
        const fontSize = `${this.settings.fontSize}px`;
        this.inputEditor.style.fontSize = fontSize;
        this.outputEditor.style.fontSize = fontSize;
        this.outputHighlight.style.fontSize = fontSize;
    }

    applyTabWidth() {
        const tabSize = this.settings.tabWidth;
        this.inputEditor.style.tabSize = tabSize;
        this.outputEditor.style.tabSize = tabSize;
    }

    loadSettings() {
        return Utils.storage.get('excellenceai-settings', {
            theme: 'light',
            fontSize: 14,
            tabWidth: 4,
            showLineNumbers: true,
            syntaxHighlight: true,
            autoFormat: false,
            formatting: {
                tabWidth: 4,
                braceStyle: 'allman',
                insertSpaces: true,
                maxLineLength: 120
            }
        });
    }

    saveSettings() {
        Utils.storage.set('excellenceai-settings', this.settings);
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.excellenceAI = new ExcelenceAI();
});