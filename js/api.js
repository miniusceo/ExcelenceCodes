// ExcelenceAI API - Main interface for language detection and code processing
class ExcelenceAPI {
    constructor() {
        this.languageMap = window.LANGUAGE_MAP || {};
        this.cache = new Map();
        this.settings = this.loadSettings();
    }

    /**
     * Detect programming language from code and filename
     * @param {string} code - Code content
     * @param {string} filename - Optional filename
     * @returns {Object} Detection result with name, score, and matched keywords
     */
    detectLanguage(code, filename = '') {
        if (!code || typeof code !== 'string') {
            return { name: 'Unknown', score: 0, matchedKeywords: [] };
        }

        const cacheKey = `${code.substring(0, 100)}_${filename}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        const results = [];
        const extension = Utils.getFileExtension(filename);

        // Analyze each language
        for (const [langKey, langInfo] of Object.entries(this.languageMap)) {
            let score = 0;
            const matchedKeywords = [];

            // Extension matching (weight: +5 points)
            if (extension && langInfo.extensions.includes(extension)) {
                score += 5;
            }

            // Keyword matching (weight: +1 point each)
            const codeLines = code.split('\n');
            const codeWords = code.toLowerCase().match(/\b\w+\b/g) || [];
            
            for (const keyword of langInfo.keywords) {
                const keywordLower = keyword.toLowerCase();
                
                // Count occurrences in words
                const wordCount = codeWords.filter(word => word === keywordLower).length;
                if (wordCount > 0) {
                    matchedKeywords.push(keyword);
                    score += wordCount;
                }

                // Additional scoring for language-specific patterns
                if (this.checkLanguageSpecificPatterns(langKey, code, keyword)) {
                    score += 2; // Bonus for specific patterns
                }
            }

            // Language-specific adjustments
            score = this.applyLanguageSpecificRules(langKey, code, filename, score);

            results.push({
                name: langInfo.name,
                key: langKey,
                score,
                matchedKeywords: [...new Set(matchedKeywords)] // Remove duplicates
            });
        }

        // Sort by score and apply tie-breaking rules
        results.sort((a, b) => {
            if (b.score === a.score) {
                return this.resolveTie(a, b, extension, code);
            }
            return b.score - a.score;
        });

        const bestMatch = results[0] || { name: 'Unknown', score: 0, matchedKeywords: [] };
        
        // Cache the result
        this.cache.set(cacheKey, bestMatch);
        
        // Clear cache if it gets too large
        if (this.cache.size > 100) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }

        return bestMatch;
    }

    /**
     * Check for language-specific patterns
     * @param {string} langKey - Language key
     * @param {string} code - Code content
     * @param {string} keyword - Keyword to check
     * @returns {boolean} Whether pattern matches
     */
    checkLanguageSpecificPatterns(langKey, code, keyword) {
        switch (langKey) {
            case 'cpp':
                // C++ specific patterns
                if (keyword === 'namespace' && /namespace\s+\w+\s*{/.test(code)) return true;
                if (keyword === 'class' && /class\s+\w+\s*[:{]/.test(code)) return true;
                if (keyword === 'std' && /std::\w+/.test(code)) return true;
                break;

            case 'csharp':
                // C# specific patterns
                if (keyword === 'using' && /using\s+System/.test(code)) return true;
                if (keyword === 'namespace' && /namespace\s+\w+(\.\w+)*\s*{/.test(code)) return true;
                if (keyword === 'public' && /public\s+(class|interface|struct)/.test(code)) return true;
                break;

            case 'objc':
                // Objective-C specific patterns
                if (keyword === '@interface' && /@interface\s+\w+/.test(code)) return true;
                if (keyword === '@implementation' && /@implementation\s+\w+/.test(code)) return true;
                if (keyword === 'NSString' && /NSString\s*\*/.test(code)) return true;
                break;

            case 'javascript':
                // JavaScript specific patterns
                if (keyword === 'function' && /function\s+\w+\s*\(/.test(code)) return true;
                if (keyword === 'var' && /var\s+\w+\s*=/.test(code)) return true;
                if (keyword === 'console' && /console\.(log|error|warn)/.test(code)) return true;
                break;

            case 'php':
                // PHP specific patterns
                if (keyword === 'php' && /<\?php/.test(code)) return true;
                if (keyword === 'echo' && /echo\s+/.test(code)) return true;
                if (keyword === '$_GET' && /\$_GET\[/.test(code)) return true;
                break;

            case 'html':
                // HTML specific patterns
                if (keyword === 'html' && /<html[^>]*>/.test(code)) return true;
                if (keyword === 'div' && /<div[^>]*>/.test(code)) return true;
                if (keyword === 'doctype' && /<!DOCTYPE/i.test(code)) return true;
                break;

            case 'css':
                // CSS specific patterns
                if (keyword === 'color' && /color\s*:\s*[^;]+;/.test(code)) return true;
                if (keyword === '@media' && /@media\s*\([^)]+\)/.test(code)) return true;
                if (keyword === 'hover' && /:hover\s*{/.test(code)) return true;
                break;

            case 'sql':
                // SQL specific patterns
                if (keyword === 'SELECT' && /SELECT\s+.*\s+FROM/i.test(code)) return true;
                if (keyword === 'CREATE' && /CREATE\s+(TABLE|DATABASE|INDEX)/i.test(code)) return true;
                if (keyword === 'WHERE' && /WHERE\s+\w+\s*[=<>]/i.test(code)) return true;
                break;

            case 'json':
                // JSON specific patterns
                if (code.trim().startsWith('{') || code.trim().startsWith('[')) return true;
                break;
        }
        return false;
    }

    /**
     * Apply language-specific scoring rules
     * @param {string} langKey - Language key
     * @param {string} code - Code content
     * @param {string} filename - Filename
     * @param {number} score - Current score
     * @returns {number} Adjusted score
     */
    applyLanguageSpecificRules(langKey, code, filename, score) {
        switch (langKey) {
            case 'c':
                // Reduce C score if C++ or C# indicators are present
                if (code.includes('namespace') || code.includes('class')) score -= 3;
                if (code.includes('using System') || code.includes('Console.')) score -= 5;
                break;

            case 'cpp':
                // Boost C++ score for strong indicators
                if (code.includes('#include <iostream>')) score += 3;
                if (code.includes('std::') && code.includes('namespace')) score += 4;
                break;

            case 'objc':
                // Strong boost for .m and .mm files
                const ext = Utils.getFileExtension(filename);
                if (ext === '.m' || ext === '.mm') score += 8;
                break;

            case 'html':
                // Boost for DOCTYPE and HTML structure
                if (/<!DOCTYPE html>/i.test(code)) score += 3;
                if (/<html[^>]*>.*<\/html>/s.test(code)) score += 2;
                break;

            case 'json':
                // Strong indicators for JSON
                if (Utils.isValidJSON(code.trim())) score += 5;
                break;

            case 'php':
                // Strong PHP indicators
                if (code.includes('<?php')) score += 5;
                if (code.includes('<?=')) score += 3;
                break;
        }

        return Math.max(0, score);
    }

    /**
     * Resolve tie between languages with same score
     * @param {Object} a - First language result
     * @param {Object} b - Second language result
     * @param {string} extension - File extension
     * @param {string} code - Code content
     * @returns {number} Comparison result
     */
    resolveTie(a, b, extension, code) {
        // Prefer more specific language based on extension
        if (extension) {
            if (extension === '.m' && a.key === 'objc') return -1;
            if (extension === '.m' && b.key === 'objc') return 1;
            if (extension === '.cpp' && a.key === 'cpp') return -1;
            if (extension === '.cpp' && b.key === 'cpp') return 1;
            if (extension === '.cs' && a.key === 'csharp') return -1;
            if (extension === '.cs' && b.key === 'csharp') return 1;
        }

        // Prefer language with more specific keywords matched
        const aSpecificKeywords = this.countSpecificKeywords(a.key, a.matchedKeywords);
        const bSpecificKeywords = this.countSpecificKeywords(b.key, b.matchedKeywords);
        
        if (aSpecificKeywords !== bSpecificKeywords) {
            return bSpecificKeywords - aSpecificKeywords;
        }

        // Default to alphabetical order
        return a.name.localeCompare(b.name);
    }

    /**
     * Count language-specific keywords
     * @param {string} langKey - Language key
     * @param {Array} matchedKeywords - Matched keywords
     * @returns {number} Count of specific keywords
     */
    countSpecificKeywords(langKey, matchedKeywords) {
        const specificKeywords = {
            'cpp': ['namespace', 'class', 'template', 'std'],
            'csharp': ['using', 'namespace', 'public', 'private', 'Console'],
            'objc': ['@interface', '@implementation', '@property', 'NSString'],
            'javascript': ['function', 'var', 'let', 'const', 'console'],
            'php': ['<?php', 'echo', '$_GET', '$_POST'],
            'html': ['<!DOCTYPE', '<html>', '<div>', '<head>'],
            'css': ['@media', ':hover', 'color:', 'background:'],
            'sql': ['SELECT', 'FROM', 'WHERE', 'CREATE TABLE']
        };

        const specific = specificKeywords[langKey] || [];
        return matchedKeywords.filter(keyword => specific.includes(keyword)).length;
    }

    /**
     * Minify code based on detected language
     * @param {string} code - Code to minify
     * @param {string} lang - Language key (optional, will detect if not provided)
     * @returns {string} Minified code
     */
    minify(code, lang) {
        if (!code || typeof code !== 'string') return '';

        const language = lang || this.detectLanguage(code).key;
        
        if (window.CodeMinifier) {
            return window.CodeMinifier.minify(code, language);
        }

        // Fallback basic minification
        return this.basicMinify(code, language);
    }

    /**
     * Clean code (remove excess whitespace, normalize formatting)
     * @param {string} code - Code to clean
     * @param {string} lang - Language key (optional)
     * @returns {string} Cleaned code
     */
    cleanCode(code, lang) {
        if (!code || typeof code !== 'string') return '';

        const language = lang || this.detectLanguage(code).key;
        
        if (window.CodeFormatter) {
            return window.CodeFormatter.clean(code, language);
        }

        // Fallback basic cleaning
        return this.basicClean(code);
    }

    /**
     * Deminify/prettify code
     * @param {string} code - Code to deminify
     * @param {string} lang - Language key (optional)
     * @returns {string} Prettified code
     */
    deminify(code, lang) {
        if (!code || typeof code !== 'string') return '';

        const language = lang || this.detectLanguage(code).key;
        
        if (window.CodeFormatter) {
            return window.CodeFormatter.prettify(code, language);
        }

        // Fallback basic prettification
        return this.basicPrettify(code, language);
    }

    /**
     * Format code with custom options
     * @param {string} code - Code to format
     * @param {string} lang - Language key (optional)
     * @param {Object} options - Formatting options
     * @returns {string} Formatted code
     */
    formatCode(code, lang, options = {}) {
        if (!code || typeof code !== 'string') return '';

        const language = lang || this.detectLanguage(code).key;
        const opts = { ...this.settings.formatting, ...options };
        
        if (window.CodeFormatter) {
            return window.CodeFormatter.format(code, language, opts);
        }

        // Fallback basic formatting
        return this.basicFormat(code, opts);
    }

    /**
     * Highlight syntax
     * @param {string} code - Code to highlight
     * @param {string} lang - Language key (optional)
     * @returns {string} HTML with syntax highlighting
     */
    highlightSyntax(code, lang) {
        if (!code || typeof code !== 'string') return '';

        const language = lang || this.detectLanguage(code).key;
        
        if (window.SyntaxHighlighter) {
            return window.SyntaxHighlighter.highlight(code, language);
        }

        // Fallback basic highlighting
        return this.basicHighlight(code, language);
    }

    /**
     * Basic minification fallback
     * @param {string} code - Code to minify
     * @param {string} language - Language
     * @returns {string} Minified code
     */
    basicMinify(code, language) {
        let result = code;

        // Remove comments
        switch (language) {
            case 'javascript':
            case 'css':
            case 'c':
            case 'cpp':
            case 'csharp':
            case 'objc':
                result = result.replace(/\/\*[\s\S]*?\*\//g, '');
                result = result.replace(/\/\/.*$/gm, '');
                break;
            case 'html':
                result = result.replace(/<!--[\s\S]*?-->/g, '');
                break;
            case 'sql':
                result = result.replace(/--.*$/gm, '');
                break;
        }

        // Remove extra whitespace
        result = result.replace(/\s+/g, ' ');
        result = result.replace(/;\s*}/g, ';}');
        result = result.replace(/\{\s+/g, '{');
        result = result.replace(/\s+\}/g, '}');
        
        return result.trim();
    }

    /**
     * Basic code cleaning
     * @param {string} code - Code to clean
     * @returns {string} Cleaned code
     */
    basicClean(code) {
        return code
            .replace(/\t/g, '    ') // Convert tabs to spaces
            .replace(/\r\n/g, '\n') // Normalize line endings
            .replace(/[ \t]+$/gm, '') // Remove trailing whitespace
            .replace(/\n{3,}/g, '\n\n') // Limit consecutive empty lines
            .trim();
    }

    /**
     * Basic prettification
     * @param {string} code - Code to prettify
     * @param {string} language - Language
     * @returns {string} Prettified code
     */
    basicPrettify(code, language) {
        let result = code;
        const indent = '    ';
        let level = 0;

        const lines = result.split('\n');
        const formatted = [];

        for (let line of lines) {
            line = line.trim();
            if (!line) continue;

            if (line.includes('}')) level = Math.max(0, level - 1);
            
            formatted.push(indent.repeat(level) + line);
            
            if (line.includes('{')) level++;
        }

        return formatted.join('\n');
    }

    /**
     * Basic formatting with options
     * @param {string} code - Code to format
     * @param {Object} options - Formatting options
     * @returns {string} Formatted code
     */
    basicFormat(code, options) {
        const {
            tabWidth = 4,
            braceStyle = 'allman',
            insertSpaces = true
        } = options;

        let result = this.basicClean(code);
        const indentChar = insertSpaces ? ' '.repeat(tabWidth) : '\t';
        
        // Apply brace style
        if (braceStyle === 'allman') {
            result = result.replace(/\s*{\s*/g, '\n{\n');
        } else if (braceStyle === 'k&r') {
            result = result.replace(/\s*{\s*/g, ' {\n');
        }

        // Apply indentation
        const lines = result.split('\n');
        const formatted = [];
        let level = 0;

        for (let line of lines) {
            line = line.trim();
            if (!line) continue;

            if (line.includes('}')) level = Math.max(0, level - 1);
            
            formatted.push(indentChar.repeat(level) + line);
            
            if (line.includes('{')) level++;
        }

        return formatted.join('\n');
    }

    /**
     * Basic syntax highlighting
     * @param {string} code - Code to highlight
     * @param {string} language - Language
     * @returns {string} Highlighted HTML
     */
    basicHighlight(code, language) {
        const langInfo = this.languageMap[language];
        if (!langInfo) return Utils.escapeHtml(code);

        let highlighted = Utils.escapeHtml(code);

        // Highlight keywords
        for (const keyword of langInfo.keywords) {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            highlighted = highlighted.replace(regex, `<span class="syntax-keyword">${keyword}</span>`);
        }

        // Highlight strings
        highlighted = highlighted.replace(/(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g, 
            '<span class="syntax-string">$1$2$1</span>');

        // Highlight comments
        if (['javascript', 'c', 'cpp', 'csharp', 'objc'].includes(language)) {
            highlighted = highlighted.replace(/\/\/.*$/gm, '<span class="syntax-comment">$&</span>');
            highlighted = highlighted.replace(/\/\*[\s\S]*?\*\//g, '<span class="syntax-comment">$&</span>');
        }

        // Highlight numbers
        highlighted = highlighted.replace(/\b\d+\.?\d*\b/g, '<span class="syntax-number">$&</span>');

        return highlighted;
    }

    /**
     * Load settings from localStorage
     * @returns {Object} Settings object
     */
    loadSettings() {
        return Utils.storage.get('excellenceai-settings', {
            theme: 'light',
            fontSize: 14,
            tabWidth: 4,
            showLineNumbers: true,
            syntaxHighlight: true,
            braceStyle: 'allman',
            formatting: {
                tabWidth: 4,
                braceStyle: 'allman',
                insertSpaces: true
            }
        });
    }

    /**
     * Save settings to localStorage
     * @param {Object} settings - Settings to save
     */
    saveSettings(settings) {
        this.settings = { ...this.settings, ...settings };
        Utils.storage.set('excellenceai-settings', this.settings);
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Get cache size
     * @returns {number} Cache size
     */
    getCacheSize() {
        return this.cache.size;
    }
}

// Create global API instance
const api = new ExcelenceAPI();

// Export API functions
const detectLanguage = (code, filename) => api.detectLanguage(code, filename);
const minify = (code, lang) => api.minify(code, lang);
const cleanCode = (code, lang) => api.cleanCode(code, lang);
const deminify = (code, lang) => api.deminify(code, lang);
const formatCode = (code, lang, options) => api.formatCode(code, lang, options);
const highlightSyntax = (code, lang) => api.highlightSyntax(code, lang);

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ExcelenceAPI,
        detectLanguage,
        minify,
        cleanCode,
        deminify,
        formatCode,
        highlightSyntax
    };
} else if (typeof window !== 'undefined') {
    window.ExcelenceAPI = ExcelenceAPI;
    window.api = api;
    window.detectLanguage = detectLanguage;
    window.minify = minify;
    window.cleanCode = cleanCode;
    window.deminify = deminify;
    window.formatCode = formatCode;
    window.highlightSyntax = highlightSyntax;
}