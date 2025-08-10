// Code Formatting Module for ExcelenceAI
class CodeFormatter {
    /**
     * Format code based on language and options
     * @param {string} code - Code to format
     * @param {string} language - Programming language
     * @param {Object} options - Formatting options
     * @returns {string} Formatted code
     */
    static format(code, language, options = {}) {
        if (!code || typeof code !== 'string') return '';

        const opts = {
            tabWidth: 4,
            braceStyle: 'allman',
            insertSpaces: true,
            maxLineLength: 120,
            ...options
        };

        switch (language) {
            case 'javascript':
                return this.formatJavaScript(code, opts);
            case 'css':
                return this.formatCSS(code, opts);
            case 'html':
                return this.formatHTML(code, opts);
            case 'json':
                return this.formatJSON(code, opts);
            case 'sql':
                return this.formatSQL(code, opts);
            case 'php':
                return this.formatPHP(code, opts);
            case 'c':
            case 'cpp':
            case 'csharp':
            case 'objc':
                return this.formatCFamily(code, language, opts);
            default:
                return this.formatGeneric(code, opts);
        }
    }

    /**
     * Clean code by removing excess whitespace and normalizing
     * @param {string} code - Code to clean
     * @param {string} language - Programming language
     * @returns {string} Cleaned code
     */
    static clean(code, language) {
        if (!code || typeof code !== 'string') return '';

        let result = code;

        // Normalize line endings
        result = result.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

        // Remove trailing whitespace
        result = result.replace(/[ \t]+$/gm, '');

        // Convert tabs to spaces
        result = result.replace(/\t/g, '    ');

        // Remove excessive empty lines
        result = result.replace(/\n{3,}/g, '\n\n');

        // Language-specific cleaning
        switch (language) {
            case 'javascript':
            case 'c':
            case 'cpp':
            case 'csharp':
            case 'objc':
            case 'php':
                result = this.cleanCStyleLanguage(result);
                break;
            case 'html':
                result = this.cleanHTML(result);
                break;
            case 'css':
                result = this.cleanCSS(result);
                break;
            case 'sql':
                result = this.cleanSQL(result);
                break;
        }

        return result.trim();
    }

    /**
     * Prettify/deminify code
     * @param {string} code - Minified code
     * @param {string} language - Programming language
     * @returns {string} Prettified code
     */
    static prettify(code, language) {
        return this.format(code, language, {
            tabWidth: 4,
            braceStyle: 'allman',
            insertSpaces: true,
            maxLineLength: 80
        });
    }

    /**
     * Format JavaScript code
     * @param {string} code - JavaScript code
     * @param {Object} options - Formatting options
     * @returns {string} Formatted code
     */
    static formatJavaScript(code, options) {
        let result = this.cleanCStyleLanguage(code);
        const indent = this.getIndentString(options);
        
        const lines = result.split('\n');
        const formatted = [];
        let indentLevel = 0;
        let inString = false;
        let stringChar = '';

        for (let line of lines) {
            line = line.trim();
            if (!line) continue;

            // Track string state
            for (let char of line) {
                if ((char === '"' || char === "'" || char === '`') && !inString) {
                    inString = true;
                    stringChar = char;
                } else if (char === stringChar && inString) {
                    inString = false;
                    stringChar = '';
                }
            }

            if (!inString) {
                // Adjust indentation for closing braces
                if (line.startsWith('}') || line.startsWith(']') || line.startsWith(')')){
                    indentLevel = Math.max(0, indentLevel - 1);
                }

                // Apply brace style
                if (options.braceStyle === 'allman' && line.endsWith('{')) {
                    const codePart = line.slice(0, -1).trim();
                    if (codePart) {
                        formatted.push(indent.repeat(indentLevel) + codePart);
                        formatted.push(indent.repeat(indentLevel) + '{');
                    } else {
                        formatted.push(indent.repeat(indentLevel) + '{');
                    }
                } else {
                    formatted.push(indent.repeat(indentLevel) + line);
                }

                // Adjust indentation for opening braces
                if (line.includes('{') || line.includes('[') || line.includes('(')){
                    indentLevel++;
                }
            } else {
                formatted.push(indent.repeat(indentLevel) + line);
            }
        }

        return formatted.join('\n');
    }

    /**
     * Format CSS code
     * @param {string} code - CSS code
     * @param {Object} options - Formatting options
     * @returns {string} Formatted code
     */
    static formatCSS(code, options) {
        let result = this.cleanCSS(code);
        const indent = this.getIndentString(options);
        
        // Add line breaks after selectors and before closing braces
        result = result.replace(/([^{]+){/g, '$1 {\n');
        result = result.replace(/;/g, ';\n');
        result = result.replace(/}/g, '\n}\n');
        
        // Clean up extra line breaks
        result = result.replace(/\n\s*\n/g, '\n');
        
        const lines = result.split('\n');
        const formatted = [];
        let indentLevel = 0;

        for (let line of lines) {
            line = line.trim();
            if (!line) continue;

            if (line === '}') {
                indentLevel = Math.max(0, indentLevel - 1);
                formatted.push(indent.repeat(indentLevel) + line);
            } else if (line.includes('{')) {
                formatted.push(indent.repeat(indentLevel) + line);
                indentLevel++;
            } else {
                formatted.push(indent.repeat(indentLevel) + line);
            }
        }

        return formatted.join('\n');
    }

    /**
     * Format HTML code
     * @param {string} code - HTML code
     * @param {Object} options - Formatting options
     * @returns {string} Formatted code
     */
    static formatHTML(code, options) {
        let result = this.cleanHTML(code);
        const indent = this.getIndentString(options);
        
        // Self-closing tags
        const selfClosingTags = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
        
        // Block-level elements
        const blockElements = ['address', 'article', 'aside', 'blockquote', 'details', 'dialog', 'dd', 'div', 'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'li', 'main', 'nav', 'ol', 'p', 'pre', 'section', 'table', 'ul'];
        
        const lines = result.split('\n');
        const formatted = [];
        let indentLevel = 0;
        let inPreformatted = false;

        for (let line of lines) {
            line = line.trim();
            if (!line) continue;

            // Check for preformatted content
            if (line.includes('<pre') || line.includes('<script') || line.includes('<style')) {
                inPreformatted = true;
            } else if (line.includes('</pre>') || line.includes('</script>') || line.includes('</style>')) {
                inPreformatted = false;
            }

            if (inPreformatted) {
                formatted.push(indent.repeat(indentLevel) + line);
                continue;
            }

            // Handle closing tags
            if (line.startsWith('</')) {
                indentLevel = Math.max(0, indentLevel - 1);
            }

            formatted.push(indent.repeat(indentLevel) + line);

            // Handle opening tags
            const tagMatch = line.match(/<([a-zA-Z][^>\s]*)/);
            if (tagMatch) {
                const tagName = tagMatch[1].toLowerCase();
                if (!selfClosingTags.includes(tagName) && !line.includes('</')) {
                    indentLevel++;
                }
            }
        }

        return formatted.join('\n');
    }

    /**
     * Format JSON code
     * @param {string} code - JSON code
     * @param {Object} options - Formatting options
     * @returns {string} Formatted code
     */
    static formatJSON(code, options) {
        try {
            const parsed = JSON.parse(code);
            const indentSize = options.insertSpaces ? options.tabWidth : 1;
            const indentChar = options.insertSpaces ? ' ' : '\t';
            return JSON.stringify(parsed, null, indentChar.repeat(indentSize));
        } catch (error) {
            // If JSON is invalid, do basic formatting
            return this.formatGeneric(code, options);
        }
    }

    /**
     * Format SQL code
     * @param {string} code - SQL code
     * @param {Object} options - Formatting options
     * @returns {string} Formatted code
     */
    static formatSQL(code, options) {
        let result = this.cleanSQL(code);
        const indent = this.getIndentString(options);
        
        // SQL keywords to format
        const keywords = ['SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'ORDER BY', 'GROUP BY', 'HAVING', 'UNION', 'INTERSECT', 'EXCEPT'];
        
        // Convert keywords to uppercase and add proper formatting
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            result = result.replace(regex, `\n${keyword}`);
        });
        
        // Format commas in SELECT statements
        result = result.replace(/,\s*(?=\w)/g, ',\n' + indent);
        
        // Clean up extra whitespace
        result = result.replace(/\n\s*\n/g, '\n');
        
        const lines = result.split('\n');
        const formatted = [];
        let indentLevel = 0;

        for (let line of lines) {
            line = line.trim();
            if (!line) continue;

            // Adjust indentation based on SQL structure
            if (line.match(/^(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)/i)) {
                indentLevel = 0;
            } else if (line.match(/^(FROM|WHERE|JOIN|ORDER BY|GROUP BY|HAVING|UNION)/i)) {
                indentLevel = 0;
            } else if (line.startsWith(',')) {
                // Keep comma lines at increased indent
                formatted.push(indent.repeat(Math.max(1, indentLevel)) + line);
                continue;
            }

            formatted.push(indent.repeat(indentLevel) + line);
        }

        return formatted.join('\n');
    }

    /**
     * Format PHP code
     * @param {string} code - PHP code
     * @param {Object} options - Formatting options
     * @returns {string} Formatted code
     */
    static formatPHP(code, options) {
        let result = this.cleanCStyleLanguage(code);
        const indent = this.getIndentString(options);
        
        // Handle PHP tags
        result = result.replace(/<\?php/g, '<?php\n');
        result = result.replace(/\?>/g, '\n?>');
        
        const lines = result.split('\n');
        const formatted = [];
        let indentLevel = 0;
        let inPHP = false;

        for (let line of lines) {
            line = line.trim();
            if (!line) continue;

            // Track PHP context
            if (line.includes('<?php')) inPHP = true;
            if (line.includes('?>')) inPHP = false;

            if (inPHP) {
                // Apply C-style formatting within PHP blocks
                if (line.startsWith('}')) {
                    indentLevel = Math.max(0, indentLevel - 1);
                }

                formatted.push(indent.repeat(indentLevel) + line);

                if (line.includes('{')) {
                    indentLevel++;
                }
            } else {
                formatted.push(line);
            }
        }

        return formatted.join('\n');
    }

    /**
     * Format C-family languages
     * @param {string} code - Source code
     * @param {string} language - Specific language
     * @param {Object} options - Formatting options
     * @returns {string} Formatted code
     */
    static formatCFamily(code, language, options) {
        let result = this.cleanCStyleLanguage(code);
        const indent = this.getIndentString(options);
        
        const lines = result.split('\n');
        const formatted = [];
        let indentLevel = 0;
        let inString = false;
        let inComment = false;

        for (let line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine) continue;

            // Handle preprocessor directives (C/C++)
            if ((language === 'c' || language === 'cpp') && trimmedLine.startsWith('#')) {
                formatted.push(trimmedLine);
                continue;
            }

            // Handle multi-line comments
            if (trimmedLine.includes('/*')) inComment = true;
            if (trimmedLine.includes('*/')) inComment = false;
            
            if (inComment) {
                formatted.push(indent.repeat(indentLevel) + trimmedLine);
                continue;
            }

            // Adjust indentation for closing braces
            if (trimmedLine.startsWith('}')) {
                indentLevel = Math.max(0, indentLevel - 1);
            }

            // Apply brace style
            if (options.braceStyle === 'allman' && trimmedLine.endsWith('{')) {
                const codePart = trimmedLine.slice(0, -1).trim();
                if (codePart) {
                    formatted.push(indent.repeat(indentLevel) + codePart);
                    formatted.push(indent.repeat(indentLevel) + '{');
                } else {
                    formatted.push(indent.repeat(indentLevel) + '{');
                }
            } else {
                formatted.push(indent.repeat(indentLevel) + trimmedLine);
            }

            // Adjust indentation for opening braces
            if (trimmedLine.includes('{')) {
                indentLevel++;
            }

            // Language-specific formatting
            this.applyLanguageSpecificFormatting(formatted, language, indentLevel);
        }

        return formatted.join('\n');
    }

    /**
     * Apply language-specific formatting rules
     * @param {Array} formatted - Array of formatted lines
     * @param {string} language - Programming language
     * @param {number} indentLevel - Current indent level
     */
    static applyLanguageSpecificFormatting(formatted, language, indentLevel) {
        const lastLine = formatted[formatted.length - 1];
        
        switch (language) {
            case 'csharp':
                // Format C# using statements and namespaces
                if (lastLine && lastLine.trim().startsWith('using ')) {
                    // Group using statements at the top
                }
                break;
            case 'objc':
                // Format Objective-C interface and implementation blocks
                if (lastLine && (lastLine.includes('@interface') || lastLine.includes('@implementation'))) {
                    // Special handling for Objective-C declarations
                }
                break;
        }
    }

    /**
     * Format generic code
     * @param {string} code - Source code
     * @param {Object} options - Formatting options
     * @returns {string} Formatted code
     */
    static formatGeneric(code, options) {
        let result = code;
        const indent = this.getIndentString(options);

        // Basic cleaning
        result = result.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        result = result.replace(/[ \t]+$/gm, '');
        result = result.replace(/\n{3,}/g, '\n\n');

        const lines = result.split('\n');
        const formatted = [];
        let indentLevel = 0;

        for (let line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine) continue;

            // Simple brace-based indentation
            if (trimmedLine.includes('}') || trimmedLine.includes(']') || trimmedLine.includes(')')){
                indentLevel = Math.max(0, indentLevel - 1);
            }

            formatted.push(indent.repeat(indentLevel) + trimmedLine);

            if (trimmedLine.includes('{') || trimmedLine.includes('[') || trimmedLine.includes('(')){
                indentLevel++;
            }
        }

        return formatted.join('\n');
    }

    /**
     * Clean C-style languages
     * @param {string} code - Source code
     * @returns {string} Cleaned code
     */
    static cleanCStyleLanguage(code) {
        let result = code;
        
        // Normalize line endings
        result = result.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        
        // Remove trailing whitespace
        result = result.replace(/[ \t]+$/gm, '');
        
        // Convert tabs to spaces
        result = result.replace(/\t/g, '    ');
        
        // Normalize spacing around operators
        result = result.replace(/([+\-*/%=<>!&|^~])\s*([+\-*/%=<>!&|^~])/g, '$1$2');
        result = result.replace(/\s*([+\-*/%=<>!&|^~])\s*/g, ' $1 ');
        result = result.replace(/\s*([,;:])\s*/g, '$1 ');
        
        // Remove excessive empty lines
        result = result.replace(/\n{3,}/g, '\n\n');
        
        return result;
    }

    /**
     * Clean HTML code
     * @param {string} code - HTML code
     * @returns {string} Cleaned code
     */
    static cleanHTML(code) {
        let result = code;
        
        // Normalize line endings
        result = result.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        
        // Remove trailing whitespace
        result = result.replace(/[ \t]+$/gm, '');
        
        // Normalize spacing in tags
        result = result.replace(/\s+/g, ' ');
        result = result.replace(/>\s+</g, '><');
        
        // Add line breaks after block elements
        const blockElements = ['div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'section', 'article', 'header', 'footer', 'nav', 'main', 'aside'];
        blockElements.forEach(element => {
            const regex = new RegExp(`</${element}>`, 'gi');
            result = result.replace(regex, `</${element}>\n`);
        });
        
        return result;
    }

    /**
     * Clean CSS code
     * @param {string} code - CSS code
     * @returns {string} Cleaned code
     */
    static cleanCSS(code) {
        let result = code;
        
        // Normalize line endings
        result = result.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        
        // Remove trailing whitespace
        result = result.replace(/[ \t]+$/gm, '');
        
        // Normalize spacing around colons and semicolons
        result = result.replace(/:\s*/g, ': ');
        result = result.replace(/;\s*/g, '; ');
        
        // Remove excessive empty lines
        result = result.replace(/\n{3,}/g, '\n\n');
        
        return result;
    }

    /**
     * Clean SQL code
     * @param {string} code - SQL code
     * @returns {string} Cleaned code
     */
    static cleanSQL(code) {
        let result = code;
        
        // Normalize line endings
        result = result.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        
        // Remove trailing whitespace
        result = result.replace(/[ \t]+$/gm, '');
        
        // Normalize keyword casing
        const keywords = ['SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER', 'TABLE', 'INDEX', 'VIEW', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'ON', 'ORDER', 'BY', 'GROUP', 'HAVING', 'UNION', 'INTERSECT', 'EXCEPT', 'AS', 'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'BETWEEN', 'LIKE', 'IS', 'NULL'];
        
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            result = result.replace(regex, keyword);
        });
        
        return result;
    }

    /**
     * Get indent string based on options
     * @param {Object} options - Formatting options
     * @returns {string} Indent string
     */
    static getIndentString(options) {
        if (options.insertSpaces) {
            return ' '.repeat(options.tabWidth);
        } else {
            return '\t';
        }
    }

    /**
     * Calculate formatting statistics
     * @param {string} original - Original code
     * @param {string} formatted - Formatted code
     * @returns {Object} Statistics object
     */
    static getFormattingStats(original, formatted) {
        return {
            originalLines: original.split('\n').length,
            formattedLines: formatted.split('\n').length,
            originalSize: original.length,
            formattedSize: formatted.length,
            changeRatio: Math.round(((formatted.length - original.length) / original.length) * 100 * 100) / 100
        };
    }
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CodeFormatter;
} else if (typeof window !== 'undefined') {
    window.CodeFormatter = CodeFormatter;
}