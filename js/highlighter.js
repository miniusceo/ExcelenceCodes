// Syntax Highlighting Module for ExcelenceAI
class SyntaxHighlighter {
    /**
     * Highlight code syntax
     * @param {string} code - Code to highlight
     * @param {string} language - Programming language
     * @returns {string} HTML with syntax highlighting
     */
    static highlight(code, language) {
        if (!code || typeof code !== 'string') return '';

        const langInfo = window.LANGUAGE_MAP && window.LANGUAGE_MAP[language];
        if (!langInfo) return Utils.escapeHtml(code);

        switch (language) {
            case 'javascript':
                return this.highlightJavaScript(code, langInfo);
            case 'css':
                return this.highlightCSS(code, langInfo);
            case 'html':
                return this.highlightHTML(code, langInfo);
            case 'json':
                return this.highlightJSON(code);
            case 'sql':
                return this.highlightSQL(code, langInfo);
            case 'php':
                return this.highlightPHP(code, langInfo);
            case 'c':
            case 'cpp':
            case 'csharp':
            case 'objc':
                return this.highlightCFamily(code, langInfo, language);
            default:
                return this.highlightGeneric(code, langInfo);
        }
    }

    /**
     * Highlight JavaScript code
     * @param {string} code - JavaScript code
     * @param {Object} langInfo - Language information
     * @returns {string} Highlighted HTML
     */
    static highlightJavaScript(code, langInfo) {
        let highlighted = Utils.escapeHtml(code);

        // Highlight regex literals
        highlighted = highlighted.replace(/\/(?![*/])([^\/\\\r\n]|\\.|\/(?![*/]))*\/[gimsuyx]*/g, 
            '<span class="syntax-regex">$&</span>');

        // Highlight template literals
        highlighted = highlighted.replace(/`([^`\\]|\\[\s\S])*`/g, 
            '<span class="syntax-template">$&</span>');

        // Highlight string literals
        highlighted = highlighted.replace(/(["'])([^\\]|\\[\s\S])*?\1/g, 
            '<span class="syntax-string">$&</span>');

        // Highlight numbers (including hex, binary, octal)
        highlighted = highlighted.replace(/\b(0[xX][0-9a-fA-F]+|0[bB][01]+|0[oO][0-7]+|\d+\.?\d*([eE][+-]?\d+)?)\b/g,
            '<span class="syntax-number">$&</span>');

        // Highlight keywords
        const keywords = langInfo.keywords.sort((a, b) => b.length - a.length);
        keywords.forEach(keyword => {
            if (['true', 'false', 'null', 'undefined'].includes(keyword)) {
                const regex = new RegExp(`\\b${this.escapeRegex(keyword)}\\b`, 'g');
                highlighted = highlighted.replace(regex, `<span class="syntax-literal">${keyword}</span>`);
            } else {
                const regex = new RegExp(`\\b${this.escapeRegex(keyword)}\\b`, 'g');
                highlighted = highlighted.replace(regex, `<span class="syntax-keyword">${keyword}</span>`);
            }
        });

        // Highlight function names
        highlighted = highlighted.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g, 
            '<span class="syntax-function">$1</span>');

        // Highlight operators
        highlighted = highlighted.replace(/([+\-*/%=<>!&|^~?:;,])/g, 
            '<span class="syntax-operator">$1</span>');

        // Highlight comments (must be last to avoid breaking other patterns)
        highlighted = highlighted.replace(/\/\/.*$/gm, '<span class="syntax-comment">$&</span>');
        highlighted = highlighted.replace(/\/\*[\s\S]*?\*\//g, '<span class="syntax-comment">$&</span>');

        return highlighted;
    }

    /**
     * Highlight CSS code
     * @param {string} code - CSS code
     * @param {Object} langInfo - Language information
     * @returns {string} Highlighted HTML
     */
    static highlightCSS(code, langInfo) {
        let highlighted = Utils.escapeHtml(code);

        // Highlight selectors
        highlighted = highlighted.replace(/^([^{]+)(?=\s*\{)/gm, 
            '<span class="syntax-selector">$1</span>');

        // Highlight property names
        highlighted = highlighted.replace(/\b([a-z-]+)\s*:/g, 
            '<span class="syntax-property">$1</span>:');

        // Highlight values
        highlighted = highlighted.replace(/:([^;{}]+);/g, 
            ':<span class="syntax-value">$1</span>;');

        // Highlight strings
        highlighted = highlighted.replace(/(["'])([^\\]|\\[\s\S])*?\1/g, 
            '<span class="syntax-string">$&</span>');

        // Highlight units and numbers
        highlighted = highlighted.replace(/\b(\d+(?:\.\d+)?)(px|em|rem|%|vh|vw|ex|ch|cm|mm|in|pt|pc|vmin|vmax)?\b/g,
            '<span class="syntax-number">$1</span><span class="syntax-unit">$2</span>');

        // Highlight colors
        highlighted = highlighted.replace(/#([0-9a-fA-F]{3,6})\b/g, 
            '<span class="syntax-color">#$1</span>');
        highlighted = highlighted.replace(/\b(rgb|rgba|hsl|hsla)\([^)]+\)/g, 
            '<span class="syntax-color">$&</span>');

        // Highlight at-rules
        highlighted = highlighted.replace(/@[a-z-]+/g, 
            '<span class="syntax-at-rule">$&</span>');

        // Highlight pseudo-classes and pseudo-elements
        highlighted = highlighted.replace(/:([a-z-]+(?:\([^)]*\))?)/g, 
            '<span class="syntax-pseudo">:$1</span>');

        // Highlight comments
        highlighted = highlighted.replace(/\/\*[\s\S]*?\*\//g, 
            '<span class="syntax-comment">$&</span>');

        return highlighted;
    }

    /**
     * Highlight HTML code
     * @param {string} code - HTML code
     * @param {Object} langInfo - Language information
     * @returns {string} Highlighted HTML
     */
    static highlightHTML(code, langInfo) {
        let highlighted = Utils.escapeHtml(code);

        // Highlight doctype
        highlighted = highlighted.replace(/<!DOCTYPE[^>]*>/gi, 
            '<span class="syntax-doctype">$&</span>');

        // Highlight comments
        highlighted = highlighted.replace(/<!--[\s\S]*?-->/g, 
            '<span class="syntax-comment">$&</span>');

        // Highlight CDATA
        highlighted = highlighted.replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, 
            '<span class="syntax-cdata">$&</span>');

        // Highlight tag names
        highlighted = highlighted.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)/g, 
            '&lt;<span class="syntax-keyword">$1</span>');

        // Highlight attribute names
        highlighted = highlighted.replace(/\s([a-zA-Z][a-zA-Z0-9-]*)\s*=/g, 
            ' <span class="syntax-attribute">$1</span>=');

        // Highlight attribute values
        highlighted = highlighted.replace(/=\s*(["'])([^"']*)\1/g, 
            '=<span class="syntax-string">$1$2$1</span>');

        // Highlight tag brackets
        highlighted = highlighted.replace(/&gt;/g, 
            '<span class="syntax-bracket">&gt;</span>');

        return highlighted;
    }

    /**
     * Highlight JSON code
     * @param {string} code - JSON code
     * @returns {string} Highlighted HTML
     */
    static highlightJSON(code) {
        let highlighted = Utils.escapeHtml(code);

        // Highlight strings (keys and values)
        highlighted = highlighted.replace(/(["'])([^\\]|\\[\s\S])*?\1/g, 
            '<span class="syntax-string">$&</span>');

        // Highlight numbers
        highlighted = highlighted.replace(/\b-?\d+\.?\d*([eE][+-]?\d+)?\b/g,
            '<span class="syntax-number">$&</span>');

        // Highlight boolean and null literals
        highlighted = highlighted.replace(/\b(true|false|null)\b/g, 
            '<span class="syntax-literal">$1</span>');

        // Highlight punctuation
        highlighted = highlighted.replace(/([{}[\]:,])/g, 
            '<span class="syntax-punctuation">$1</span>');

        return highlighted;
    }

    /**
     * Highlight SQL code
     * @param {string} code - SQL code
     * @param {Object} langInfo - Language information
     * @returns {string} Highlighted HTML
     */
    static highlightSQL(code, langInfo) {
        let highlighted = Utils.escapeHtml(code);

        // Highlight string literals
        highlighted = highlighted.replace(/(["'])([^\\]|\\[\s\S])*?\1/g, 
            '<span class="syntax-string">$&</span>');

        // Highlight numbers
        highlighted = highlighted.replace(/\b\d+\.?\d*\b/g, 
            '<span class="syntax-number">$&</span>');

        // Highlight keywords (case insensitive)
        const keywords = langInfo.keywords.sort((a, b) => b.length - a.length);
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${this.escapeRegex(keyword)}\\b`, 'gi');
            highlighted = highlighted.replace(regex, `<span class="syntax-keyword">${keyword}</span>`);
        });

        // Highlight operators
        highlighted = highlighted.replace(/([=<>!]+|AND|OR|NOT|IN|LIKE|BETWEEN)/gi, 
            '<span class="syntax-operator">$&</span>');

        // Highlight functions
        highlighted = highlighted.replace(/\b([A-Z_][A-Z0-9_]*)\s*(?=\()/gi, 
            '<span class="syntax-function">$1</span>');

        // Highlight comments
        highlighted = highlighted.replace(/--.*$/gm, '<span class="syntax-comment">$&</span>');
        highlighted = highlighted.replace(/\/\*[\s\S]*?\*\//g, '<span class="syntax-comment">$&</span>');

        return highlighted;
    }

    /**
     * Highlight PHP code
     * @param {string} code - PHP code
     * @param {Object} langInfo - Language information
     * @returns {string} Highlighted HTML
     */
    static highlightPHP(code, langInfo) {
        let highlighted = Utils.escapeHtml(code);

        // Highlight PHP tags
        highlighted = highlighted.replace(/(&lt;\?php|\?&gt;|&lt;\?=)/g, 
            '<span class="syntax-php-tag">$1</span>');

        // Highlight variables
        highlighted = highlighted.replace(/\$[a-zA-Z_][a-zA-Z0-9_]*/g, 
            '<span class="syntax-variable">$&</span>');

        // Highlight superglobals
        highlighted = highlighted.replace(/\$_(GET|POST|REQUEST|SESSION|COOKIE|SERVER|FILES|ENV|GLOBALS)\b/g, 
            '<span class="syntax-superglobal">$&</span>');

        // Highlight string literals
        highlighted = highlighted.replace(/(["'])([^\\]|\\[\s\S])*?\1/g, 
            '<span class="syntax-string">$&</span>');

        // Highlight numbers
        highlighted = highlighted.replace(/\b\d+\.?\d*\b/g, 
            '<span class="syntax-number">$&</span>');

        // Highlight keywords
        const keywords = langInfo.keywords.sort((a, b) => b.length - a.length);
        keywords.forEach(keyword => {
            if (keyword.startsWith('$_') || keyword === 'php') return;
            const regex = new RegExp(`\\b${this.escapeRegex(keyword)}\\b`, 'g');
            highlighted = highlighted.replace(regex, `<span class="syntax-keyword">${keyword}</span>`);
        });

        // Highlight functions
        highlighted = highlighted.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, 
            '<span class="syntax-function">$1</span>');

        // Highlight operators
        highlighted = highlighted.replace(/([+\-*/%=<>!&|^~?:;,.@])/g, 
            '<span class="syntax-operator">$1</span>');

        // Highlight comments
        highlighted = highlighted.replace(/\/\/.*$/gm, '<span class="syntax-comment">$&</span>');
        highlighted = highlighted.replace(/#.*$/gm, '<span class="syntax-comment">$&</span>');
        highlighted = highlighted.replace(/\/\*[\s\S]*?\*\//g, '<span class="syntax-comment">$&</span>');

        return highlighted;
    }

    /**
     * Highlight C-family languages
     * @param {string} code - Source code
     * @param {Object} langInfo - Language information
     * @param {string} language - Specific language
     * @returns {string} Highlighted HTML
     */
    static highlightCFamily(code, langInfo, language) {
        let highlighted = Utils.escapeHtml(code);

        // Highlight preprocessor directives (C/C++)
        if (language === 'c' || language === 'cpp') {
            highlighted = highlighted.replace(/^#.*$/gm, 
                '<span class="syntax-preprocessor">$&</span>');
        }

        // Highlight string literals
        highlighted = highlighted.replace(/(["'])([^\\]|\\[\s\S])*?\1/g, 
            '<span class="syntax-string">$&</span>');

        // Highlight character literals
        highlighted = highlighted.replace(/'([^'\\]|\\.)'/g, 
            '<span class="syntax-char">$&</span>');

        // Highlight numbers
        highlighted = highlighted.replace(/\b(0[xX][0-9a-fA-F]+|0[bB][01]+|0[0-7]+|\d+\.?\d*([eE][+-]?\d+)?)[fFlLuU]*\b/g,
            '<span class="syntax-number">$&</span>');

        // Language-specific highlighting
        switch (language) {
            case 'cpp':
                // Highlight C++ template syntax
                highlighted = highlighted.replace(/template\s*&lt;[^&gt;]*&gt;/g, 
                    '<span class="syntax-template">$&</span>');
                // Highlight namespace usage
                highlighted = highlighted.replace(/\b\w+::\w+/g, 
                    '<span class="syntax-namespace">$&</span>');
                break;
            case 'csharp':
                // Highlight C# attributes
                highlighted = highlighted.replace(/\[[\s\S]*?\]/g, 
                    '<span class="syntax-attribute">$&</span>');
                // Highlight LINQ keywords
                highlighted = highlighted.replace(/\b(from|where|select|join|group|into|orderby|let)\b/g, 
                    '<span class="syntax-linq">$1</span>');
                break;
            case 'objc':
                // Highlight Objective-C directives
                highlighted = highlighted.replace(/@\w+/g, 
                    '<span class="syntax-directive">$&</span>');
                // Highlight Objective-C types
                highlighted = highlighted.replace(/\b(id|SEL|IMP|Class|BOOL|YES|NO)\b/g, 
                    '<span class="syntax-objc-type">$1</span>');
                break;
        }

        // Highlight keywords
        const keywords = langInfo.keywords.sort((a, b) => b.length - a.length);
        keywords.forEach(keyword => {
            if (keyword.startsWith('@') || keyword.includes('::')) return;
            const regex = new RegExp(`\\b${this.escapeRegex(keyword)}\\b`, 'g');
            highlighted = highlighted.replace(regex, `<span class="syntax-keyword">${keyword}</span>`);
        });

        // Highlight function names
        highlighted = highlighted.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, 
            '<span class="syntax-function">$1</span>');

        // Highlight operators
        highlighted = highlighted.replace(/([+\-*/%=<>!&|^~?:;,])/g, 
            '<span class="syntax-operator">$1</span>');

        // Highlight comments (must be last)
        highlighted = highlighted.replace(/\/\/.*$/gm, '<span class="syntax-comment">$&</span>');
        highlighted = highlighted.replace(/\/\*[\s\S]*?\*\//g, '<span class="syntax-comment">$&</span>');

        return highlighted;
    }

    /**
     * Generic syntax highlighting
     * @param {string} code - Source code
     * @param {Object} langInfo - Language information
     * @returns {string} Highlighted HTML
     */
    static highlightGeneric(code, langInfo) {
        let highlighted = Utils.escapeHtml(code);

        // Highlight string literals
        highlighted = highlighted.replace(/(["'])([^\\]|\\[\s\S])*?\1/g, 
            '<span class="syntax-string">$&</span>');

        // Highlight numbers
        highlighted = highlighted.replace(/\b\d+\.?\d*\b/g, 
            '<span class="syntax-number">$&</span>');

        // Highlight keywords
        if (langInfo && langInfo.keywords) {
            const keywords = langInfo.keywords.sort((a, b) => b.length - a.length);
            keywords.forEach(keyword => {
                const regex = new RegExp(`\\b${this.escapeRegex(keyword)}\\b`, 'g');
                highlighted = highlighted.replace(regex, `<span class="syntax-keyword">${keyword}</span>`);
            });
        }

        // Highlight common comment patterns
        highlighted = highlighted.replace(/\/\/.*$/gm, '<span class="syntax-comment">$&</span>');
        highlighted = highlighted.replace(/\/\*[\s\S]*?\*\//g, '<span class="syntax-comment">$&</span>');
        highlighted = highlighted.replace(/#.*$/gm, '<span class="syntax-comment">$&</span>');
        highlighted = highlighted.replace(/--.*$/gm, '<span class="syntax-comment">$&</span>');

        return highlighted;
    }

    /**
     * Add line numbers to highlighted code
     * @param {string} highlightedCode - Code with syntax highlighting
     * @param {number} startLine - Starting line number
     * @returns {string} Code with line numbers
     */
    static addLineNumbers(highlightedCode, startLine = 1) {
        const lines = highlightedCode.split('\n');
        const lineNumberWidth = (startLine + lines.length - 1).toString().length;
        
        return lines.map((line, index) => {
            const lineNumber = startLine + index;
            const paddedNumber = lineNumber.toString().padStart(lineNumberWidth, ' ');
            return `<span class="line-number">${paddedNumber}</span>${line}`;
        }).join('\n');
    }

    /**
     * Create highlighted code block with wrapper
     * @param {string} code - Source code
     * @param {string} language - Programming language
     * @param {Object} options - Highlighting options
     * @returns {string} Complete highlighted code block
     */
    static createCodeBlock(code, language, options = {}) {
        const {
            lineNumbers = false,
            startLine = 1,
            wrapLines = false,
            theme = 'default'
        } = options;

        let highlighted = this.highlight(code, language);
        
        if (lineNumbers) {
            highlighted = this.addLineNumbers(highlighted, startLine);
        }

        const wrapClass = wrapLines ? ' wrap-lines' : '';
        const lineNumClass = lineNumbers ? ' with-line-numbers' : '';
        
        return `<pre class="code-block theme-${theme}${wrapClass}${lineNumClass}"><code class="language-${language}">${highlighted}</code></pre>`;
    }

    /**
     * Escape special regex characters
     * @param {string} string - String to escape
     * @returns {string} Escaped string
     */
    static escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Extract tokens for advanced highlighting
     * @param {string} code - Source code
     * @param {string} language - Programming language
     * @returns {Array} Array of tokens
     */
    static tokenize(code, language) {
        // Basic tokenization for future enhancements
        const tokens = [];
        const patterns = this.getTokenPatterns(language);
        
        let position = 0;
        while (position < code.length) {
            let matched = false;
            
            for (const pattern of patterns) {
                const regex = new RegExp(pattern.regex, 'g');
                regex.lastIndex = position;
                const match = regex.exec(code);
                
                if (match && match.index === position) {
                    tokens.push({
                        type: pattern.type,
                        value: match[0],
                        start: position,
                        end: position + match[0].length
                    });
                    position += match[0].length;
                    matched = true;
                    break;
                }
            }
            
            if (!matched) {
                tokens.push({
                    type: 'text',
                    value: code[position],
                    start: position,
                    end: position + 1
                });
                position++;
            }
        }
        
        return tokens;
    }

    /**
     * Get token patterns for a language
     * @param {string} language - Programming language
     * @returns {Array} Array of token patterns
     */
    static getTokenPatterns(language) {
        const common = [
            { type: 'string', regex: '(["\'`])([^\\\\]|\\\\[\\s\\S])*?\\1' },
            { type: 'number', regex: '\\b\\d+\\.?\\d*([eE][+-]?\\d+)?\\b' },
            { type: 'comment', regex: '\\/\\/.*$' },
            { type: 'comment', regex: '\\/\\*[\\s\\S]*?\\*\\/' },
            { type: 'whitespace', regex: '\\s+' },
            { type: 'operator', regex: '[+\\-*/%=<>!&|^~?:;,(){}\\[\\]]' },
            { type: 'identifier', regex: '[a-zA-Z_$][a-zA-Z0-9_$]*' }
        ];

        // Language-specific patterns can be added here
        return common;
    }
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SyntaxHighlighter;
} else if (typeof window !== 'undefined') {
    window.SyntaxHighlighter = SyntaxHighlighter;
}