// Code Minification Module for ExcelenceAI
class CodeMinifier {
    /**
     * Minify code based on language
     * @param {string} code - Code to minify
     * @param {string} language - Programming language
     * @returns {string} Minified code
     */
    static minify(code, language) {
        if (!code || typeof code !== 'string') return '';

        switch (language) {
            case 'javascript':
                return this.minifyJavaScript(code);
            case 'css':
                return this.minifyCSS(code);
            case 'html':
                return this.minifyHTML(code);
            case 'json':
                return this.minifyJSON(code);
            case 'sql':
                return this.minifySQL(code);
            case 'php':
                return this.minifyPHP(code);
            case 'c':
            case 'cpp':
            case 'csharp':
            case 'objc':
                return this.minifyCFamily(code, language);
            default:
                return this.minifyGeneric(code);
        }
    }

    /**
     * Minify JavaScript code
     * @param {string} code - JavaScript code
     * @returns {string} Minified code
     */
    static minifyJavaScript(code) {
        let result = code;

        // Remove single-line comments (but preserve URLs and regex)
        result = result.replace(/(?:^|[^\\])\/\/.*$/gm, '');
        
        // Remove multi-line comments
        result = result.replace(/\/\*[\s\S]*?\*\//g, '');
        
        // Remove unnecessary whitespace around operators
        result = result.replace(/\s*([+\-*/%=<>!&|^~?:;,{}()\[\]])\s*/g, '$1');
        
        // Remove line breaks and excessive whitespace
        result = result.replace(/\s+/g, ' ');
        
        // Remove spaces around braces and brackets
        result = result.replace(/\s*{\s*/g, '{');
        result = result.replace(/\s*}\s*/g, '}');
        result = result.replace(/\s*\[\s*/g, '[');
        result = result.replace(/\s*\]\s*/g, ']');
        result = result.replace(/\s*\(\s*/g, '(');
        result = result.replace(/\s*\)\s*/g, ')');
        
        // Remove semicolons before closing braces
        result = result.replace(/;\s*}/g, '}');
        
        // Compress function declarations
        result = result.replace(/function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g, 'function $1(');
        
        return result.trim();
    }

    /**
     * Minify CSS code
     * @param {string} code - CSS code
     * @returns {string} Minified code
     */
    static minifyCSS(code) {
        let result = code;

        // Remove comments
        result = result.replace(/\/\*[\s\S]*?\*\//g, '');
        
        // Remove unnecessary whitespace
        result = result.replace(/\s+/g, ' ');
        
        // Remove spaces around punctuation
        result = result.replace(/\s*([{}:;,>+~])\s*/g, '$1');
        
        // Remove trailing semicolons before closing braces
        result = result.replace(/;\s*}/g, '}');
        
        // Remove spaces around parentheses
        result = result.replace(/\s*\(\s*/g, '(');
        result = result.replace(/\s*\)\s*/g, ')');
        
        // Compress color values
        result = result.replace(/#([a-f0-9])\1([a-f0-9])\2([a-f0-9])\3/gi, '#$1$2$3');
        
        // Remove unnecessary zeros
        result = result.replace(/\b0+(\d+)/g, '$1');
        result = result.replace(/(\d)\.0+\b/g, '$1');
        result = result.replace(/0\.(\d)/g, '.$1');
        
        // Remove unit from zero values
        result = result.replace(/\b0(px|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|%)/g, '0');
        
        return result.trim();
    }

    /**
     * Minify HTML code
     * @param {string} code - HTML code
     * @returns {string} Minified code
     */
    static minifyHTML(code) {
        let result = code;

        // Remove HTML comments (but preserve conditional comments)
        result = result.replace(/<!--(?!\[if)[\s\S]*?(?<!\[endif\])-->/g, '');
        
        // Remove unnecessary whitespace between tags
        result = result.replace(/>\s+</g, '><');
        
        // Remove whitespace at the beginning and end of lines
        result = result.replace(/^\s+|\s+$/gm, '');
        
        // Collapse multiple whitespace characters
        result = result.replace(/\s{2,}/g, ' ');
        
        // Remove optional closing tags for certain elements
        const optionalClosingTags = ['</li>', '</dt>', '</dd>', '</p>', '</rt>', '</rp>', '</optgroup>', '</option>', '</colgroup>', '</thead>', '</tbody>', '</tfoot>', '</tr>', '</td>', '</th>'];
        optionalClosingTags.forEach(tag => {
            const regex = new RegExp(tag + '\\s*(?=<(?:li|dt|dd|p|rt|rp|optgroup|option|colgroup|thead|tbody|tfoot|tr|td|th|\/ul|\/ol|\/dl|\/select|\/table))', 'gi');
            result = result.replace(regex, '');
        });
        
        // Remove quotes from attributes when safe
        result = result.replace(/\s([a-z-]+)="([a-zA-Z0-9\-_]+)"/g, ' $1=$2');
        
        // Remove unnecessary type attributes
        result = result.replace(/\s+type=["']?text\/(css|javascript)["']?/g, '');
        
        return result.trim();
    }

    /**
     * Minify JSON code
     * @param {string} code - JSON code
     * @returns {string} Minified code
     */
    static minifyJSON(code) {
        try {
            const parsed = JSON.parse(code);
            return JSON.stringify(parsed);
        } catch (error) {
            // If parsing fails, do basic minification
            let result = code;
            result = result.replace(/\s+/g, ' ');
            result = result.replace(/\s*([{}[\]:,])\s*/g, '$1');
            return result.trim();
        }
    }

    /**
     * Minify SQL code
     * @param {string} code - SQL code
     * @returns {string} Minified code
     */
    static minifySQL(code) {
        let result = code;

        // Remove single-line comments
        result = result.replace(/--.*$/gm, '');
        
        // Remove multi-line comments
        result = result.replace(/\/\*[\s\S]*?\*\//g, '');
        
        // Remove unnecessary whitespace
        result = result.replace(/\s+/g, ' ');
        
        // Remove spaces around punctuation
        result = result.replace(/\s*([(),;])\s*/g, '$1');
        
        // Convert to uppercase for keywords (optional, for consistency)
        const sqlKeywords = ['SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER', 'TABLE', 'INDEX', 'VIEW', 'TRIGGER', 'PROCEDURE', 'FUNCTION', 'DATABASE', 'SCHEMA'];
        sqlKeywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            result = result.replace(regex, keyword);
        });
        
        return result.trim();
    }

    /**
     * Minify PHP code
     * @param {string} code - PHP code
     * @returns {string} Minified code
     */
    static minifyPHP(code) {
        let result = code;

        // Remove single-line comments
        result = result.replace(/\/\/.*$/gm, '');
        result = result.replace(/#.*$/gm, '');
        
        // Remove multi-line comments
        result = result.replace(/\/\*[\s\S]*?\*\//g, '');
        
        // Remove unnecessary whitespace
        result = result.replace(/\s+/g, ' ');
        
        // Remove spaces around operators and punctuation
        result = result.replace(/\s*([+\-*/%=<>!&|^~?:;,{}()\[\]])\s*/g, '$1');
        
        // Remove spaces around PHP tags
        result = result.replace(/\s*<\?php\s*/g, '<?php ');
        result = result.replace(/\s*\?>\s*/g, '?>');
        
        // Remove semicolons before closing braces
        result = result.replace(/;\s*}/g, '}');
        
        return result.trim();
    }

    /**
     * Minify C-family languages (C, C++, C#, Objective-C)
     * @param {string} code - Source code
     * @param {string} language - Specific language
     * @returns {string} Minified code
     */
    static minifyCFamily(code, language) {
        let result = code;

        // Remove single-line comments
        result = result.replace(/\/\/.*$/gm, '');
        
        // Remove multi-line comments
        result = result.replace(/\/\*[\s\S]*?\*\//g, '');
        
        // Remove preprocessor directives spacing (for C/C++)
        if (language === 'c' || language === 'cpp') {
            result = result.replace(/^\s*#\s*/gm, '#');
        }
        
        // Remove unnecessary whitespace
        result = result.replace(/\s+/g, ' ');
        
        // Remove spaces around operators and punctuation
        result = result.replace(/\s*([+\-*/%=<>!&|^~?:;,{}()\[\]])\s*/g, '$1');
        
        // Remove spaces around template brackets (C++)
        if (language === 'cpp') {
            result = result.replace(/\s*<\s*/g, '<');
            result = result.replace(/\s*>\s*/g, '>');
        }
        
        // Remove semicolons before closing braces
        result = result.replace(/;\s*}/g, '}');
        
        // Language-specific optimizations
        switch (language) {
            case 'csharp':
                // Remove spaces around namespace and using declarations
                result = result.replace(/using\s+/g, 'using ');
                result = result.replace(/namespace\s+/g, 'namespace ');
                break;
            case 'objc':
                // Remove spaces around Objective-C directives
                result = result.replace(/@interface\s+/g, '@interface ');
                result = result.replace(/@implementation\s+/g, '@implementation ');
                result = result.replace(/@property\s*\(/g, '@property(');
                break;
        }
        
        return result.trim();
    }

    /**
     * Generic minification for unsupported languages
     * @param {string} code - Source code
     * @returns {string} Minified code
     */
    static minifyGeneric(code) {
        let result = code;

        // Remove excessive whitespace
        result = result.replace(/\s+/g, ' ');
        
        // Remove leading and trailing whitespace from lines
        result = result.replace(/^\s+|\s+$/gm, '');
        
        // Remove empty lines
        result = result.replace(/\n\s*\n/g, '\n');
        
        return result.trim();
    }

    /**
     * Calculate compression statistics
     * @param {string} original - Original code
     * @param {string} minified - Minified code
     * @returns {Object} Statistics object
     */
    static getCompressionStats(original, minified) {
        const originalSize = original.length;
        const minifiedSize = minified.length;
        const savedBytes = originalSize - minifiedSize;
        const compressionRatio = originalSize > 0 ? (savedBytes / originalSize) * 100 : 0;

        return {
            originalSize,
            minifiedSize,
            savedBytes,
            compressionRatio: Math.round(compressionRatio * 100) / 100,
            originalLines: original.split('\n').length,
            minifiedLines: minified.split('\n').length
        };
    }

    /**
     * Validate minified code (basic syntax check)
     * @param {string} code - Minified code
     * @param {string} language - Programming language
     * @returns {Object} Validation result
     */
    static validateMinified(code, language) {
        const result = { valid: true, errors: [], warnings: [] };

        try {
            switch (language) {
                case 'json':
                    JSON.parse(code);
                    break;
                case 'javascript':
                    // Basic syntax validation
                    if (!this.validateJSBraces(code)) {
                        result.errors.push('Mismatched braces');
                        result.valid = false;
                    }
                    break;
                case 'css':
                    if (!this.validateCSSBraces(code)) {
                        result.errors.push('Mismatched CSS braces');
                        result.valid = false;
                    }
                    break;
            }
        } catch (error) {
            result.valid = false;
            result.errors.push(error.message);
        }

        return result;
    }

    /**
     * Validate JavaScript brace matching
     * @param {string} code - JavaScript code
     * @returns {boolean} Whether braces are balanced
     */
    static validateJSBraces(code) {
        let braceCount = 0;
        let parenCount = 0;
        let bracketCount = 0;
        let inString = false;
        let stringChar = '';

        for (let i = 0; i < code.length; i++) {
            const char = code[i];
            const prevChar = i > 0 ? code[i - 1] : '';

            // Handle string literals
            if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
                if (!inString) {
                    inString = true;
                    stringChar = char;
                } else if (char === stringChar) {
                    inString = false;
                    stringChar = '';
                }
                continue;
            }

            if (inString) continue;

            // Count braces, parentheses, and brackets
            switch (char) {
                case '{': braceCount++; break;
                case '}': braceCount--; break;
                case '(': parenCount++; break;
                case ')': parenCount--; break;
                case '[': bracketCount++; break;
                case ']': bracketCount--; break;
            }
        }

        return braceCount === 0 && parenCount === 0 && bracketCount === 0;
    }

    /**
     * Validate CSS brace matching
     * @param {string} code - CSS code
     * @returns {boolean} Whether braces are balanced
     */
    static validateCSSBraces(code) {
        let braceCount = 0;
        let inString = false;
        let stringChar = '';

        for (let i = 0; i < code.length; i++) {
            const char = code[i];
            const prevChar = i > 0 ? code[i - 1] : '';

            // Handle string literals
            if ((char === '"' || char === "'") && prevChar !== '\\') {
                if (!inString) {
                    inString = true;
                    stringChar = char;
                } else if (char === stringChar) {
                    inString = false;
                    stringChar = '';
                }
                continue;
            }

            if (inString) continue;

            // Count braces
            if (char === '{') braceCount++;
            else if (char === '}') braceCount--;
        }

        return braceCount === 0;
    }
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CodeMinifier;
} else if (typeof window !== 'undefined') {
    window.CodeMinifier = CodeMinifier;
}