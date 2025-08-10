// Language Detection Mapping for ExcelenceAI
// Weighted scoring system: Extensions = +5, Keywords = +1

const LANGUAGE_MAP = {
    'c': {
        name: 'C',
        extensions: ['.c', '.h'],
        keywords: [
            'int', 'char', 'float', 'double', 'void', 'long', 'short', 'unsigned', 'signed',
            'struct', 'union', 'enum', 'typedef', 'static', 'extern', 'auto', 'register',
            'const', 'volatile', 'sizeof', 'if', 'else', 'while', 'for', 'do', 'switch',
            'case', 'default', 'break', 'continue', 'return', 'goto', 'malloc', 'free',
            'printf', 'scanf', 'include', 'define', 'ifdef', 'ifndef', 'endif', 'pragma'
        ],
        mimeTypes: ['text/x-c', 'text/x-csrc']
    },
    
    'cpp': {
        name: 'C++',
        extensions: ['.cpp', '.cxx', '.cc', '.C', '.c++', '.hpp', '.hxx', '.hh', '.H', '.h++'],
        keywords: [
            'class', 'private', 'public', 'protected', 'virtual', 'friend', 'inline',
            'namespace', 'using', 'template', 'typename', 'operator', 'new', 'delete',
            'this', 'try', 'catch', 'throw', 'bool', 'true', 'false', 'std', 'cout',
            'cin', 'endl', 'vector', 'string', 'map', 'set', 'list', 'queue', 'stack',
            'iterator', 'const_cast', 'dynamic_cast', 'static_cast', 'reinterpret_cast',
            'explicit', 'mutable', 'constexpr', 'nullptr', 'auto', 'decltype', 'override',
            'final', 'noexcept', 'thread_local', 'alignas', 'alignof'
        ],
        mimeTypes: ['text/x-c++src', 'text/x-cpp']
    },
    
    'csharp': {
        name: 'C#',
        extensions: ['.cs'],
        keywords: [
            'abstract', 'as', 'base', 'bool', 'break', 'byte', 'case', 'catch', 'char',
            'checked', 'class', 'const', 'continue', 'decimal', 'default', 'delegate',
            'do', 'double', 'else', 'enum', 'event', 'explicit', 'extern', 'false',
            'finally', 'fixed', 'float', 'for', 'foreach', 'goto', 'if', 'implicit',
            'in', 'int', 'interface', 'internal', 'is', 'lock', 'long', 'namespace',
            'new', 'null', 'object', 'operator', 'out', 'override', 'params', 'private',
            'protected', 'public', 'readonly', 'ref', 'return', 'sbyte', 'sealed',
            'short', 'sizeof', 'stackalloc', 'static', 'string', 'struct', 'switch',
            'this', 'throw', 'true', 'try', 'typeof', 'uint', 'ulong', 'unchecked',
            'unsafe', 'ushort', 'using', 'virtual', 'void', 'volatile', 'while',
            'var', 'dynamic', 'await', 'async', 'yield', 'partial', 'where', 'select',
            'from', 'linq', 'System', 'Console', 'WriteLine', 'ReadLine'
        ],
        mimeTypes: ['text/x-csharp']
    },
    
    'objc': {
        name: 'Objective-C',
        extensions: ['.m', '.mm', '.h'],
        keywords: [
            '@interface', '@implementation', '@end', '@class', '@protocol', '@property',
            '@synthesize', '@dynamic', '@selector', '@encode', '@defs', '@synchronized',
            '@autoreleasepool', '@try', '@catch', '@finally', '@throw', '@public',
            '@private', '@protected', '@package', '@optional', '@required', 'id', 'nil',
            'YES', 'NO', 'BOOL', 'NSString', 'NSArray', 'NSDictionary', 'NSObject',
            'NSInteger', 'NSUInteger', 'CGFloat', 'alloc', 'init', 'dealloc', 'retain',
            'release', 'autorelease', 'copy', 'mutableCopy', 'self', 'super', 'SEL',
            'IMP', 'Class', 'Method', 'Ivar', 'objc_msgSend', 'NSLog', 'IBOutlet',
            'IBAction', 'nonatomic', 'atomic', 'strong', 'weak', 'assign', 'copy',
            'readonly', 'readwrite', 'getter', 'setter'
        ],
        mimeTypes: ['text/x-objectivec']
    },
    
    'html': {
        name: 'HTML',
        extensions: ['.html', '.htm', '.xhtml'],
        keywords: [
            'html', 'head', 'title', 'body', 'div', 'span', 'p', 'a', 'img', 'ul',
            'ol', 'li', 'table', 'tr', 'td', 'th', 'form', 'input', 'button', 'select',
            'option', 'textarea', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'nav',
            'main', 'section', 'article', 'aside', 'footer', 'script', 'style', 'link',
            'meta', 'doctype', 'href', 'src', 'alt', 'class', 'id', 'onclick', 'onload',
            'type', 'value', 'name', 'placeholder', 'required', 'disabled', 'checked',
            'selected', 'multiple', 'readonly', 'hidden', 'autofocus', 'autoplay',
            'controls', 'loop', 'muted', 'preload', 'poster', 'download', 'target',
            'rel', 'charset', 'lang', 'dir', 'contenteditable', 'draggable', 'dropzone'
        ],
        mimeTypes: ['text/html']
    },
    
    'css': {
        name: 'CSS',
        extensions: ['.css'],
        keywords: [
            'color', 'background', 'font', 'margin', 'padding', 'border', 'width', 'height',
            'display', 'position', 'top', 'bottom', 'left', 'right', 'float', 'clear',
            'overflow', 'visibility', 'z-index', 'opacity', 'cursor', 'text-align',
            'text-decoration', 'text-transform', 'line-height', 'letter-spacing',
            'word-spacing', 'white-space', 'vertical-align', 'list-style', 'table-layout',
            'border-collapse', 'border-spacing', 'caption-side', 'empty-cells',
            'content', 'quotes', 'counter-reset', 'counter-increment', 'outline',
            'clip', 'filter', 'zoom', 'transform', 'transition', 'animation',
            'flex', 'grid', 'align', 'justify', 'order', 'flex-grow', 'flex-shrink',
            'flex-basis', 'grid-template', 'grid-area', 'gap', 'place-items',
            'place-content', 'place-self', '@media', '@import', '@font-face',
            '@keyframes', '@supports', '@charset', 'hover', 'active', 'focus',
            'visited', 'link', 'first-child', 'last-child', 'nth-child', 'not',
            'before', 'after', 'selection', 'placeholder', 'root', 'important',
            'inherit', 'initial', 'unset', 'auto', 'none', 'normal', 'bold',
            'italic', 'underline', 'overline', 'line-through', 'uppercase',
            'lowercase', 'capitalize', 'center', 'justify', 'absolute', 'relative',
            'fixed', 'static', 'sticky', 'block', 'inline', 'inline-block',
            'flex', 'grid', 'table', 'table-cell', 'table-row', 'hidden', 'visible'
        ],
        mimeTypes: ['text/css']
    },
    
    'javascript': {
        name: 'JavaScript',
        extensions: ['.js', '.jsx', '.mjs', '.es6'],
        keywords: [
            'var', 'let', 'const', 'function', 'return', 'if', 'else', 'for', 'while',
            'do', 'switch', 'case', 'default', 'break', 'continue', 'try', 'catch',
            'finally', 'throw', 'new', 'this', 'super', 'class', 'extends', 'static',
            'get', 'set', 'async', 'await', 'yield', 'import', 'export', 'from',
            'default', 'as', 'typeof', 'instanceof', 'in', 'of', 'delete', 'void',
            'null', 'undefined', 'true', 'false', 'NaN', 'Infinity', 'global',
            'window', 'document', 'console', 'log', 'error', 'warn', 'info',
            'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval', 'Promise',
            'then', 'catch', 'finally', 'resolve', 'reject', 'Array', 'Object',
            'String', 'Number', 'Boolean', 'Date', 'RegExp', 'Math', 'JSON',
            'parseInt', 'parseFloat', 'isNaN', 'isFinite', 'encodeURIComponent',
            'decodeURIComponent', 'eval', 'apply', 'call', 'bind', 'prototype',
            'constructor', 'hasOwnProperty', 'toString', 'valueOf', 'length',
            'push', 'pop', 'shift', 'unshift', 'slice', 'splice', 'concat',
            'join', 'reverse', 'sort', 'indexOf', 'lastIndexOf', 'forEach',
            'map', 'filter', 'reduce', 'find', 'findIndex', 'some', 'every',
            'includes', 'startsWith', 'endsWith', 'replace', 'match', 'search',
            'split', 'substring', 'substr', 'charAt', 'charCodeAt', 'toLowerCase',
            'toUpperCase', 'trim', 'padStart', 'padEnd'
        ],
        mimeTypes: ['text/javascript', 'application/javascript']
    },
    
    'json': {
        name: 'JSON',
        extensions: ['.json', '.jsonc', '.json5'],
        keywords: [
            'true', 'false', 'null'
        ],
        mimeTypes: ['application/json', 'text/json']
    },
    
    'php': {
        name: 'PHP',
        extensions: ['.php', '.phtml', '.php3', '.php4', '.php5', '.phps'],
        keywords: [
            'php', 'echo', 'print', 'var_dump', 'print_r', 'die', 'exit', 'include',
            'require', 'include_once', 'require_once', 'function', 'class', 'interface',
            'trait', 'namespace', 'use', 'as', 'public', 'private', 'protected',
            'static', 'abstract', 'final', 'const', 'var', 'global', 'if', 'else',
            'elseif', 'endif', 'switch', 'case', 'default', 'endswitch', 'while',
            'endwhile', 'for', 'endfor', 'foreach', 'endforeach', 'do', 'break',
            'continue', 'try', 'catch', 'finally', 'throw', 'return', 'yield',
            'new', 'clone', 'instanceof', 'extends', 'implements', 'parent', 'self',
            'this', 'true', 'false', 'null', 'array', 'object', 'string', 'int',
            'integer', 'float', 'double', 'bool', 'boolean', 'resource', 'mixed',
            'numeric', 'scalar', 'callable', 'iterable', 'void', 'unset', 'isset',
            'empty', 'list', 'eval', 'isset', 'unset', '$_GET', '$_POST', '$_REQUEST',
            '$_SESSION', '$_COOKIE', '$_SERVER', '$_FILES', '$_ENV', '$GLOBALS',
            'htmlspecialchars', 'htmlentities', 'strip_tags', 'addslashes',
            'stripslashes', 'trim', 'ltrim', 'rtrim', 'strlen', 'substr', 'strpos',
            'strtolower', 'strtoupper', 'ucfirst', 'ucwords', 'str_replace',
            'preg_match', 'preg_replace', 'explode', 'implode', 'array_merge',
            'array_push', 'array_pop', 'array_shift', 'array_unshift', 'count',
            'sizeof', 'is_array', 'in_array', 'array_key_exists', 'array_keys',
            'array_values', 'sort', 'arsort', 'ksort', 'krsort', 'usort',
            'mysql_connect', 'mysql_query', 'mysql_fetch_array', 'mysqli_connect',
            'mysqli_query', 'PDO', 'prepare', 'execute', 'fetch', 'fetchAll'
        ],
        mimeTypes: ['text/x-php', 'application/x-php']
    },
    
    'sql': {
        name: 'SQL',
        extensions: ['.sql', '.ddl', '.dml'],
        keywords: [
            'SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP',
            'ALTER', 'TABLE', 'DATABASE', 'INDEX', 'VIEW', 'TRIGGER', 'PROCEDURE',
            'FUNCTION', 'SCHEMA', 'CONSTRAINT', 'PRIMARY', 'FOREIGN', 'KEY', 'UNIQUE',
            'NOT', 'NULL', 'DEFAULT', 'AUTO_INCREMENT', 'IDENTITY', 'CHECK', 'REFERENCES',
            'ON', 'CASCADE', 'RESTRICT', 'SET', 'NO', 'ACTION', 'MATCH', 'FULL',
            'PARTIAL', 'SIMPLE', 'DEFERRABLE', 'INITIALLY', 'DEFERRED', 'IMMEDIATE',
            'AND', 'OR', 'IN', 'EXISTS', 'BETWEEN', 'LIKE', 'ILIKE', 'SIMILAR',
            'REGEXP', 'RLIKE', 'IS', 'ANY', 'ALL', 'SOME', 'JOIN', 'INNER', 'LEFT',
            'RIGHT', 'FULL', 'OUTER', 'CROSS', 'NATURAL', 'UNION', 'INTERSECT',
            'EXCEPT', 'MINUS', 'ORDER', 'BY', 'ASC', 'DESC', 'GROUP', 'HAVING',
            'LIMIT', 'OFFSET', 'TOP', 'DISTINCT', 'DISTINCTROW', 'AS', 'ALIAS',
            'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'IF', 'IFNULL', 'ISNULL',
            'COALESCE', 'NULLIF', 'CAST', 'CONVERT', 'EXTRACT', 'SUBSTRING',
            'CONCAT', 'LENGTH', 'CHAR_LENGTH', 'UPPER', 'LOWER', 'TRIM', 'LTRIM',
            'RTRIM', 'REPLACE', 'REVERSE', 'LEFT', 'RIGHT', 'REPEAT', 'SPACE',
            'LOCATE', 'POSITION', 'INSTR', 'FIND_IN_SET', 'FIELD', 'ELT', 'MAKE_SET',
            'EXPORT_SET', 'LPAD', 'RPAD', 'SOUNDEX', 'DIFFERENCE', 'STRCMP',
            'LOAD_FILE', 'HEX', 'UNHEX', 'BIN', 'OCT', 'CONV', 'INET_ATON',
            'INET_NTOA', 'INET6_ATON', 'INET6_NTOA', 'IS_IPV4', 'IS_IPV6',
            'IS_IPV4_COMPAT', 'IS_IPV4_MAPPED', 'ABS', 'ACOS', 'ASIN', 'ATAN',
            'ATAN2', 'CEIL', 'CEILING', 'COS', 'COT', 'DEGREES', 'EXP', 'FLOOR',
            'LN', 'LOG', 'LOG10', 'LOG2', 'MOD', 'PI', 'POW', 'POWER', 'RADIANS',
            'RAND', 'ROUND', 'SIGN', 'SIN', 'SQRT', 'TAN', 'TRUNCATE', 'DIV',
            'ADDDATE', 'ADDTIME', 'CONVERT_TZ', 'CURDATE', 'CURRENT_DATE',
            'CURRENT_TIME', 'CURRENT_TIMESTAMP', 'CURTIME', 'DATE', 'DATE_ADD',
            'DATE_FORMAT', 'DATE_SUB', 'DATEDIFF', 'DATETIME', 'DAY', 'DAYNAME',
            'DAYOFMONTH', 'DAYOFWEEK', 'DAYOFYEAR', 'EXTRACT', 'FROM_DAYS',
            'FROM_UNIXTIME', 'HOUR', 'LAST_DAY', 'MAKEDATE', 'MAKETIME',
            'MICROSECOND', 'MINUTE', 'MONTH', 'MONTHNAME', 'NOW', 'PERIOD_ADD',
            'PERIOD_DIFF', 'QUARTER', 'SEC_TO_TIME', 'SECOND', 'STR_TO_DATE',
            'SUBDATE', 'SUBTIME', 'SYSDATE', 'TIME', 'TIME_FORMAT', 'TIME_TO_SEC',
            'TIMEDIFF', 'TIMESTAMP', 'TIMESTAMPADD', 'TIMESTAMPDIFF', 'TO_DAYS',
            'TO_SECONDS', 'UNIX_TIMESTAMP', 'UTC_DATE', 'UTC_TIME', 'UTC_TIMESTAMP',
            'WEEK', 'WEEKDAY', 'WEEKOFYEAR', 'YEAR', 'YEARWEEK', 'AVG', 'BIT_AND',
            'BIT_OR', 'BIT_XOR', 'COUNT', 'GROUP_CONCAT', 'MAX', 'MIN', 'STD',
            'STDDEV', 'STDDEV_POP', 'STDDEV_SAMP', 'SUM', 'VAR_POP', 'VAR_SAMP',
            'VARIANCE', 'BEGIN', 'COMMIT', 'ROLLBACK', 'SAVEPOINT', 'TRANSACTION',
            'LOCK', 'UNLOCK', 'TABLES', 'READ', 'WRITE', 'LOW_PRIORITY',
            'HIGH_PRIORITY', 'DELAYED', 'QUICK', 'IGNORE', 'FORCE', 'USE',
            'STRAIGHT_JOIN', 'SQL_SMALL_RESULT', 'SQL_BIG_RESULT', 'SQL_BUFFER_RESULT',
            'SQL_CACHE', 'SQL_NO_CACHE', 'SQL_CALC_FOUND_ROWS', 'FOUND_ROWS',
            'ROW_COUNT', 'LAST_INSERT_ID', 'CONNECTION_ID', 'USER', 'CURRENT_USER',
            'SESSION_USER', 'SYSTEM_USER', 'VERSION', 'BENCHMARK', 'CHARSET',
            'COERCIBILITY', 'COLLATION', 'ROW_NUMBER', 'RANK', 'DENSE_RANK',
            'PERCENT_RANK', 'CUME_DIST', 'NTILE', 'LAG', 'LEAD', 'FIRST_VALUE',
            'LAST_VALUE', 'NTH_VALUE', 'OVER', 'PARTITION', 'ROWS', 'RANGE',
            'UNBOUNDED', 'PRECEDING', 'FOLLOWING', 'CURRENT', 'ROW', 'RECURSIVE',
            'WITH', 'MATERIALIZED', 'SEARCH', 'BREADTH', 'DEPTH', 'CYCLE'
        ],
        mimeTypes: ['text/x-sql', 'application/sql']
    }
};

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LANGUAGE_MAP };
} else if (typeof window !== 'undefined') {
    window.LANGUAGE_MAP = LANGUAGE_MAP;
}