// This is a mock implementation of the conversion logic
// In a real application, this would interact with backend Python services

export interface ConversionOptions {
  sourceType: string;
  targetType: string;
  optimizationLevel?: 'standard' | 'aggressive' | 'conservative';
}

export interface ConversionResult {
  success: boolean;
  tables: {
    total: number;
    converted: number;
    failed: number;
    details: any[];
  };
  storedProcedures: {
    total: number;
    converted: number;
    failed: number;
    details: any[];
  };
  triggers: {
    total: number;
    converted: number;
    failed: number;
    details: any[];
  };
  performance: {
    startTime: string;
    endTime: string;
    duration: string;
    rowsProcessed: number;
    memoryUsage: string;
  };
  issues: any[];
}

// Enhanced regular expression patterns for highly optimized Sybase to Oracle conversion
const sybasePatterns = {
  // Data types with optimized Oracle equivalents
  datatypePatterns: [
    { pattern: /\bint\b/gi, replacement: "NUMBER(10)" },
    { pattern: /\bsmallint\b/gi, replacement: "NUMBER(5)" },
    { pattern: /\btinyint\b/gi, replacement: "NUMBER(3)" },
    { pattern: /\bbigint\b/gi, replacement: "NUMBER(19)" },
    { pattern: /\bdecimal\s*\((\d+),\s*(\d+)\)/gi, replacement: "NUMBER($1,$2)" },
    { pattern: /\bnumeric\s*\((\d+),\s*(\d+)\)/gi, replacement: "NUMBER($1,$2)" },
    { pattern: /\bfloat\b/gi, replacement: "BINARY_FLOAT" }, // More efficient than FLOAT for modern Oracle
    { pattern: /\breal\b/gi, replacement: "BINARY_FLOAT" }, // More efficient than FLOAT
    { pattern: /\bdouble precision\b/gi, replacement: "BINARY_DOUBLE" }, // More efficient than FLOAT
    { pattern: /\bdatetime\b/gi, replacement: "TIMESTAMP" }, // TIMESTAMP includes date and time with timezone
    { pattern: /\bsmalltime\b/gi, replacement: "TIMESTAMP" },
    { pattern: /\btimestamp\b/gi, replacement: "TIMESTAMP" },
    { pattern: /\bchar\s*\((\d+)\)/gi, replacement: "CHAR($1)" },
    { pattern: /\bvarchar\s*\((\d+)\)/gi, replacement: "VARCHAR2($1)" },
    { pattern: /\bnvarchar\s*\((\d+)\)/gi, replacement: "NVARCHAR2($1)" },
    { pattern: /\btext\b/gi, replacement: "CLOB" },
    { pattern: /\bimage\b/gi, replacement: "BLOB" },
    { pattern: /\bmoney\b/gi, replacement: "NUMBER(19,4)" },
    { pattern: /\bbit\b/gi, replacement: "NUMBER(1)" }
  ],
  
  // Identity columns
  identityPattern: /identity\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)/gi,
  
  // Procedures and functions
  procedurePattern: /CREATE\s+PROC(EDURE)?\s+(\w+)/gi,
  
  // Delimiters and batch separators
  goPattern: /\bGO\b/g,
  
  // Cursor syntax
  cursorPattern: /DECLARE\s+(\w+)\s+CURSOR\s+FOR\s+(.*?)\s+FOR\s+UPDATE/gi,
  openCursorPattern: /OPEN\s+(\w+)/gi,
  fetchCursorPattern: /FETCH\s+(\w+)\s+INTO\s+(.*)/gi,
  closeCursorPattern: /CLOSE\s+(\w+)/gi,
  deallocateCursorPattern: /DEALLOCATE\s+(\w+)/gi,
  
  // Transaction management
  beginTransPattern: /BEGIN\s+TRAN(SACTION)?/gi,
  commitTransPattern: /COMMIT\s+TRAN(SACTION)?/gi,
  rollbackTransPattern: /ROLLBACK\s+TRAN(SACTION)?/gi,
  
  // Joins
  joinsPattern: /(\w+)\s+=\s+(\w+)\.(\w+)/gi,
  
  // New optimized patterns
  // Replace Sybase temp tables with global temporary tables
  tempTablePattern: /#(\w+)/g,
  
  // Optimize NOLOCK hints
  nolockPattern: /WITH\s*\(\s*NOLOCK\s*\)/gi,
  
  // Replace TOP with ROWNUM
  topPattern: /TOP\s+(\d+)/gi,
  
  // Handle ISNULL function
  isnullPattern: /ISNULL\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/gi,
  
  // Handle date functions
  getdatePattern: /GETDATE\s*\(\s*\)/gi,
  dateaddPattern: /DATEADD\s*\(\s*(\w+)\s*,\s*([^,]+)\s*,\s*([^)]+)\s*\)/gi,
  datediffPattern: /DATEDIFF\s*\(\s*(\w+)\s*,\s*([^,]+)\s*,\s*([^)]+)\s*\)/gi,
  
  // Handle string functions
  strPattern: /STR\s*\(\s*([^)]+)\s*\)/gi,
  
  // Indexes and constraints with more efficient naming conventions
  primaryKeyPattern: /PRIMARY KEY\s+(\w+)/gi,
  foreignKeyPattern: /FOREIGN KEY\s+(\w+)/gi,
  
  // Optimize transaction isolation level
  transactionIsolationPattern: /SET TRANSACTION ISOLATION LEVEL\s+(\w+)/gi,
  
  // Fix for var, print, and select statements (Enhanced patterns)
  varPattern: /DECLARE\s+@(\w+)\s+(\w+)(?:\s*\((\d+)(?:,\s*(\d+))?\))?(?:\s*=\s*([^;]+))?/gi,
  printPattern: /PRINT\s+([^;]+)/gi,
  selectAssignmentPattern: /SELECT\s+@(\w+)\s*=\s*([^;]+)/gi,
  
  // Added patterns for improved Oracle conversion
  setPattern: /SET\s+@(\w+)\s*=\s*([^;]+)/gi,
  ifExistsPattern: /IF\s+EXISTS\s*\(\s*SELECT\s+\*\s+FROM\s+(.*?)\s+WHERE\s+(.*?)\)/gi,
  ifNotExistsPattern: /IF\s+NOT\s+EXISTS\s*\(\s*SELECT\s+\*\s+FROM\s+(.*?)\s+WHERE\s+(.*?)\)/gi,
  commentPattern: /--\s*(.*?)$/gm,
  spHelpTextPattern: /EXEC\s+sp_helptext\s+([^;]+)/gi,
  raiserrorPattern: /RAISERROR\s*\(\s*([^,]+)(?:,\s*(\d+)(?:,\s*(\d+))?)?\s*(?:,\s*([^)]+))?\)/gi,
  xpCmdShellPattern: /EXEC\s+xp_cmdshell\s+([^;]+)/gi,
  sysColumnsPattern: /sys\.columns/gi,
  sysObjectsPattern: /sys\.objects/gi,
  dbNamePattern: /\[(\w+)\]/g,
  execPattern: /EXEC(?:UTE)?\s+(\w+)(?:\s+(.*))?/gi
};

/**
 * Highly optimized Sybase to Oracle converter with advanced pattern matching
 * and Oracle best practices implementation
 * @param sybaseCode The original Sybase code to convert
 * @returns Optimized Oracle code with performance enhancements
 */
export const convertSybaseToOracle = (sybaseCode: string): string => {
  let oracleCode = sybaseCode;
  
  // Fix common syntax issues before processing
  oracleCode = fixCommonSyntaxIssues(oracleCode);
  
  // Apply preprocessing optimizations
  oracleCode = preprocessForOracle(oracleCode);
  
  // Convert data types to most efficient Oracle types
  sybasePatterns.datatypePatterns.forEach(({ pattern, replacement }) => {
    oracleCode = oracleCode.replace(pattern, replacement);
  });
  
  // Handle identity columns - convert to Oracle sequence and trigger pattern
  // with high-performance caching and efficient sequence definitions
  oracleCode = oracleCode.replace(/CREATE\s+TABLE\s+(\w+)\s*\(([\s\S]*?)identity\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)([\s\S]*?)\)/gi, (match, tableName, beforeIdentity, seed, increment, afterIdentity) => {
    // Extract the column name that has the identity property
    const identityColMatch = beforeIdentity.match(/(\w+)[\s\n]+[^,]*?$/);
    const identityColumn = identityColMatch ? identityColMatch[1] : 'id';
    
    // Create the table without identity
    const tableDefinition = `CREATE TABLE ${tableName} (${beforeIdentity}${afterIdentity})`;
    
    // Create sequence with performance optimization options
    const sequenceName = `${tableName}_seq`;
    const triggerName = `${tableName}_bir`;
    
    return `${tableDefinition}\n\n` +
           `-- Create high-performance sequence for identity column\n` +
           `CREATE SEQUENCE ${sequenceName} START WITH ${seed} INCREMENT BY ${increment} CACHE 20 NOCYCLE;\n\n` +
           `-- Create optimized before insert trigger\n` +
           `CREATE OR REPLACE TRIGGER ${triggerName}\n` +
           `BEFORE INSERT ON ${tableName}\n` +
           `FOR EACH ROW\n` +
           `BEGIN\n` +
           `  IF :new.${identityColumn} IS NULL THEN\n` +
           `    SELECT ${sequenceName}.NEXTVAL INTO :new.${identityColumn} FROM dual;\n` +
           `  END IF;\n` +
           `END;\n` +
           `/`;
  });
  
  // Convert procedures with optimized Oracle syntax and fix syntax errors
  oracleCode = oracleCode.replace(/CREATE\s+PROC(EDURE)?\s+(\w+)\s*(\([\s\S]*?\))?\s*AS([\s\S]*?)(?:GO|$)/gi, (match, _, procName, params, body) => {
    // Parse and convert parameters
    let oracleParams = '';
    if (params) {
      oracleParams = params
        .replace(/@(\w+)\s+(\w+)(?:\s*\((\d+)(?:,\s*(\d+))?\))?/g, (paramMatch, paramName, paramType, paramSize, paramScale) => {
          let oracleType = 'VARCHAR2';
          
          switch (paramType.toLowerCase()) {
            case 'int':
              oracleType = 'NUMBER';
              break;
            case 'varchar':
              oracleType = 'VARCHAR2';
              break;
            case 'datetime':
              oracleType = 'TIMESTAMP';
              break;
            case 'float':
            case 'real':
              oracleType = 'BINARY_FLOAT';
              break;
            case 'double':
              oracleType = 'BINARY_DOUBLE';
              break;
            // More optimized type mappings
          }
          
          if (paramSize) {
            if (paramScale) {
              oracleType += `(${paramSize},${paramScale})`;
            } else {
              oracleType += `(${paramSize})`;
            }
          }
          
          return `p_${paramName} IN ${oracleType}`;
        });
    }
    
    // Convert procedure body with performance optimizations
    let oracleBody = body
      // Replace Sybase variable declarations with Oracle
      .replace(/@(\w+)\s+(\w+)(?:\s*\((\d+)(?:,\s*(\d+))?\))?/g, (varMatch, varName, varType, varSize, varScale) => {
        let oracleType = 'VARCHAR2';
        
        switch (varType.toLowerCase()) {
          case 'int':
            oracleType = 'NUMBER';
            break;
          case 'varchar':
            oracleType = 'VARCHAR2';
            break;
          case 'datetime':
            oracleType = 'TIMESTAMP';
            break;
          case 'float':
          case 'real':
            oracleType = 'BINARY_FLOAT';
            break;
          case 'double':
            oracleType = 'BINARY_DOUBLE';
            break;
          // More optimized type mappings
        }
        
        if (varSize) {
          if (varScale) {
            oracleType += `(${varSize},${varScale})`;
          } else {
            oracleType += `(${varSize})`;
          }
        }
        
        return `v_${varName} ${oracleType}`;
      })
      
      // Convert DECLARE @var statements (enhanced)
      .replace(sybasePatterns.varPattern, (match, varName, varType, varSize, varScale, initialValue) => {
        let oracleType = 'VARCHAR2(4000)'; // Default to larger size for VARCHAR2
        
        switch (varType.toLowerCase()) {
          case 'int': 
            oracleType = 'NUMBER';
            break;
          case 'bigint':
            oracleType = 'NUMBER(19)';
            break;
          case 'smallint':
            oracleType = 'NUMBER(5)';
            break;
          case 'tinyint':
            oracleType = 'NUMBER(3)';
            break;
          case 'numeric':
          case 'decimal':
            if (varSize && varScale) {
              oracleType = `NUMBER(${varSize},${varScale})`;
            } else if (varSize) {
              oracleType = `NUMBER(${varSize})`;
            } else {
              oracleType = 'NUMBER';
            }
            break;
          case 'varchar':
            if (varSize) {
              oracleType = `VARCHAR2(${varSize})`;
            }
            break;
          case 'nvarchar':
            if (varSize) {
              oracleType = `NVARCHAR2(${varSize})`;
            } else {
              oracleType = 'NVARCHAR2(4000)';
            }
            break;
          case 'char':
            if (varSize) {
              oracleType = `CHAR(${varSize})`;
            } else {
              oracleType = 'CHAR(1)';
            }
            break;
          case 'nchar':
            if (varSize) {
              oracleType = `NCHAR(${varSize})`;
            } else {
              oracleType = 'NCHAR(1)';
            }
            break;
          case 'datetime':
          case 'smalldatetime':
            oracleType = 'TIMESTAMP';
            break;
          case 'float':
          case 'real':
            oracleType = 'BINARY_FLOAT';
            break;
          case 'money':
          case 'smallmoney':
            oracleType = 'NUMBER(19,4)';
            break;
          case 'bit':
            oracleType = 'NUMBER(1)';
            break;
          case 'text':
            oracleType = 'CLOB';
            break;
          case 'image':
            oracleType = 'BLOB';
            break;
        }
        
        let declaration = `v_${varName} ${oracleType}`;
        if (initialValue) {
          declaration += ` := ${initialValue.replace(/@/g, 'v_')}`;
        }
        
        return declaration;
      })
      
      // Convert SET variable assignments
      .replace(sybasePatterns.setPattern, (match, varName, value) => {
        return `v_${varName} := ${value.replace(/@/g, 'v_')}`;
      })
      
      // Convert PRINT statements to DBMS_OUTPUT.PUT_LINE
      .replace(sybasePatterns.printPattern, (match, content) => {
        // Replace any variable references in the print statement
        content = content.replace(/@(\w+)/g, 'v_$1');
        return `DBMS_OUTPUT.PUT_LINE(${content})`;
      })
      
      // Convert SELECT @var = value to variable assignment
      .replace(sybasePatterns.selectAssignmentPattern, (match, varName, value) => {
        // Clean up the value by replacing any Sybase variable references
        value = value.replace(/@(\w+)/g, 'v_$1');
        // For simple values, use direct assignment
        if (!value.includes('SELECT') && !value.includes('FROM')) {
          return `v_${varName} := ${value}`;
        }
        // Otherwise use SELECT INTO
        return `SELECT ${value} INTO v_${varName} FROM dual`;
      })
      
      // Convert IF EXISTS to Oracle's EXISTS clause
      .replace(sybasePatterns.ifExistsPattern, (match, table, condition) => {
        condition = condition.replace(/@(\w+)/g, 'v_$1');
        return `IF EXISTS (SELECT 1 FROM ${table} WHERE ${condition}) THEN`;
      })
      
      // Convert IF NOT EXISTS to Oracle's NOT EXISTS clause
      .replace(sybasePatterns.ifNotExistsPattern, (match, table, condition) => {
        condition = condition.replace(/@(\w+)/g, 'v_$1');
        return `IF NOT EXISTS (SELECT 1 FROM ${table} WHERE ${condition}) THEN`;
      })
      
      // Convert RAISERROR to RAISE_APPLICATION_ERROR
      .replace(sybasePatterns.raiserrorPattern, (match, message, severity, state, args) => {
        let errorCode = severity ? parseInt(severity) * 1000 + (state ? parseInt(state) : 0) : 20000;
        message = message.replace(/@(\w+)/g, 'v_$1');
        
        if (errorCode < 20000 || errorCode > 20999) {
          errorCode = 20000; // Oracle user-defined errors must be between 20000 and 20999
        }
        
        if (args) {
          args = args.replace(/@(\w+)/g, 'v_$1');
          return `RAISE_APPLICATION_ERROR(-${errorCode}, ${message} || ' ' || ${args})`;
        } else {
          return `RAISE_APPLICATION_ERROR(-${errorCode}, ${message})`;
        }
      })
      
      // Convert system table references
      .replace(sybasePatterns.sysColumnsPattern, 'ALL_TAB_COLUMNS')
      .replace(sybasePatterns.sysObjectsPattern, 'ALL_OBJECTS')
      
      // Convert EXEC to direct function calls or BEGIN...END blocks
      .replace(sybasePatterns.execPattern, (match, procName, params) => {
        if (!params) {
          return `BEGIN\n  ${procName};\nEND;`;
        }
        
        // Clean up parameters by replacing @ with v_
        params = params.replace(/@(\w+)/g, 'v_$1');
        
        return `BEGIN\n  ${procName}(${params});\nEND;`;
      })
      
      // Optimize SELECT into variables with bulk collect when possible
      .replace(/SELECT\s+(.*?)\s*=\s*(.*?)(?:;|$)/g, 'SELECT $2 INTO $1 FROM dual;')
      
      // Optimize cursor processing with BULK COLLECT and FORALL
      .replace(/DECLARE\s+(\w+)\s+CURSOR\s+FOR\s+(SELECT\s+[\s\S]*?);\s*OPEN\s+\1;\s*FETCH\s+\1\s+INTO([\s\S]*?)WHILE\s+@@FETCH_STATUS\s*=\s*0\s*BEGIN([\s\S]*?)FETCH\s+\1\s+INTO\s*([\s\S]*?)END/gi, 
        (match, cursorName, selectStmt, fetchVars, loopBody, nextFetch) => {
          // Convert to efficient bulk processing
          return `DECLARE
  TYPE t_${cursorName}_rec IS TABLE OF ${fetchVars.trim()} INDEX BY PLS_INTEGER;
  v_${cursorName}_data t_${cursorName}_rec;
BEGIN
  -- Optimized bulk collect
  SELECT ${selectStmt.replace(/SELECT\s+/i, '')} 
  BULK COLLECT INTO v_${cursorName}_data;
  
  -- Process efficiently with FORALL when possible
  FOR i IN 1..v_${cursorName}_data.COUNT LOOP
    ${loopBody.trim().replace(/FETCH\s+\w+\s+INTO[\s\S]*?;/gi, '')}
  END LOOP;`;
      })
      
      // Convert procedure flow control
      .replace(/IF\s+(.*?)\s+BEGIN/gi, 'IF $1 THEN')
      .replace(/ELSE\s+BEGIN/gi, 'ELSE')
      
      // Replace temp tables with Global Temporary Tables
      .replace(sybasePatterns.tempTablePattern, 'TEMP_$1')
      
      // Replace NOLOCK hints with /*+ RESULT_CACHE */ for read-only queries
      .replace(sybasePatterns.nolockPattern, '/*+ RESULT_CACHE */')
      
      // Replace TOP with ROWNUM or ROW_NUMBER() analytic function
      .replace(/(SELECT\s+)TOP\s+(\d+)(.*FROM\s+.*)/gi, '$1$3 WHERE ROWNUM <= $2')
      
      // Replace ISNULL with NVL
      .replace(sybasePatterns.isnullPattern, 'NVL($1, $2)')
      
      // Replace GETDATE with SYSDATE or SYSTIMESTAMP
      .replace(sybasePatterns.getdatePattern, 'SYSTIMESTAMP')
      
      // Optimize date functions
      .replace(sybasePatterns.dateaddPattern, (match, unit, amount, date) => {
        switch (unit.toLowerCase()) {
          case 'day':
          case 'd':
            return `${date} + NUMTODSINTERVAL(${amount}, 'DAY')`;
          case 'month':
          case 'm':
            return `ADD_MONTHS(${date}, ${amount})`;
          case 'year':
          case 'yy':
          case 'yyyy':
            return `ADD_MONTHS(${date}, ${amount} * 12)`;
          case 'hour':
          case 'hh':
            return `${date} + NUMTODSINTERVAL(${amount}, 'HOUR')`;
          case 'minute':
          case 'mi':
          case 'n':
            return `${date} + NUMTODSINTERVAL(${amount}, 'MINUTE')`;
          case 'second':
          case 'ss':
          case 's':
            return `${date} + NUMTODSINTERVAL(${amount}, 'SECOND')`;
          default:
            return `${date} + NUMTODSINTERVAL(${amount}, '${unit}')`;
        }
      })
      
      // Convert DATEDIFF function to Oracle equivalent
      .replace(sybasePatterns.datediffPattern, (match, unit, startDate, endDate) => {
        switch (unit.toLowerCase()) {
          case 'day':
          case 'd':
            return `ROUND(${endDate} - ${startDate})`;
          case 'month':
          case 'm':
            return `MONTHS_BETWEEN(${endDate}, ${startDate})`;
          case 'year':
          case 'yy':
          case 'yyyy':
            return `ROUND(MONTHS_BETWEEN(${endDate}, ${startDate}) / 12)`;
          case 'hour':
          case 'hh':
            return `ROUND((${endDate} - ${startDate}) * 24)`;
          case 'minute':
          case 'mi':
          case 'n':
            return `ROUND((${endDate} - ${startDate}) * 24 * 60)`;
          case 'second':
          case 'ss':
          case 's':
            return `ROUND((${endDate} - ${startDate}) * 24 * 60 * 60)`;
          default:
            return `ROUND((${endDate} - ${startDate}) * 24 * 60 * 60)`;
        }
      })
      
      // Convert string functions for better performance
      .replace(sybasePatterns.strPattern, 'TO_CHAR($1)')
      
      // Ensure END statements have semicolons for PL/SQL
      .replace(/END\s*(?!;)/g, 'END;')
      
      // Fix common syntax errors in procedure bodies
      .replace(/--\s*(.*)$/gm, '/* $1 */')  // Convert -- comments to /* */ style
      .replace(/\$\$\w+/g, 'v_$&')  // Fix $$ variables
      .replace(/goto\s+(\w+)/gi, 'GOTO lbl_$1')  // Fix goto labels
      .replace(/^\s*(\w+):/gm, 'lbl_$1:')  // Fix label definitions
      .replace(/\[\s*(\w+)\s*\]/g, "$1")   // Remove square brackets around identifiers
      .replace(/@@ERROR/gi, 'SQLCODE')      // Replace @@ERROR with SQLCODE
      .replace(/@@ROWCOUNT/gi, 'SQL%ROWCOUNT'); // Replace @@ROWCOUNT with SQL%ROWCOUNT
    
    // Format the final Oracle procedure with optimization hints
    return `CREATE OR REPLACE PROCEDURE ${procName}(${oracleParams})
AS
BEGIN
${oracleBody}
END ${procName};
/`;
  });
  
  // Convert batch separators
  oracleCode = oracleCode.replace(/\bGO\b/g, '/');
  
  // Fix missing semicolons at the end of statements
  oracleCode = fixMissingSemicolons(oracleCode);
  
  // Convert old-style joins to ANSI joins for better optimizer usage
  oracleCode = oracleCode.replace(/FROM\s+(\w+),\s*(\w+)\s+WHERE\s+(\w+)\.(\w+)\s*=\s*(\w+)\.(\w+)/gi, 'FROM $1 JOIN $2 ON $3.$4 = $5.$6');
    
  // Add explicit optimizer hints for large tables
  oracleCode = oracleCode.replace(/SELECT\b(?!\s+\/\*\+)/gi, 'SELECT /*+ PARALLEL(4) */');
  
  // Optimize index creation
  oracleCode = oracleCode.replace(/CREATE\s+INDEX\s+(\w+)\s+ON\s+(\w+)\s*\(([^)]+)\)/gi,
    'CREATE INDEX $1 ON $2($3) NOLOGGING COMPUTE STATISTICS');
  
  // Convert transaction isolation levels
  oracleCode = oracleCode.replace(/SET\s+TRANSACTION\s+ISOLATION\s+LEVEL\s+READ\s+UNCOMMITTED/gi, 
    'SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
  
  // Fix malformed ALTER statements
  oracleCode = oracleCode.replace(/ALTER\s+TABLE\s+(\w+)\s+MODIFY\s+(\w+)\s+NOT\s+NULL\s*(?!;)/gi, 
    'ALTER TABLE $1 MODIFY $2 NOT NULL;');
  
  // Fix standalone variable declarations (enhanced)
  oracleCode = oracleCode.replace(/DECLARE\s+@(\w+)\s+(\w+)(?:\s*\((\d+)(?:,\s*(\d+))?\))?(?:\s*=\s*([^;]+))?/gi, (match, varName, varType, varSize, varScale, initialValue) => {
    let oracleType = 'VARCHAR2(4000)';
    
    switch (varType.toLowerCase()) {
      case 'int': 
        oracleType = 'NUMBER';
        break;
      case 'bigint':
        oracleType = 'NUMBER(19)';
        break;
      case 'smallint':
        oracleType = 'NUMBER(5)';
        break;
      case 'tinyint':
        oracleType = 'NUMBER(3)';
        break;
      case 'numeric':
      case 'decimal':
        if (varSize && varScale) {
          oracleType = `NUMBER(${varSize},${varScale})`;
        } else if (varSize) {
          oracleType = `NUMBER(${varSize})`;
        } else {
          oracleType = 'NUMBER';
        }
        break;
      case 'varchar':
        if (varSize) {
          oracleType = `VARCHAR2(${varSize})`;
        }
        break;
      case 'nvarchar':
        if (varSize) {
          oracleType = `NVARCHAR2(${varSize})`;
        } else {
          oracleType = 'NVARCHAR2(4000)';
        }
        break;
      case 'datetime':
      case 'smalldatetime':
        oracleType = 'TIMESTAMP';
        break;
      case 'float':
      case 'real':
        oracleType = 'BINARY_FLOAT';
        break;
      case 'bit':
        oracleType = 'NUMBER(1)';
        break;
    }
    
    let declaration = `DECLARE\n  v_${varName} ${oracleType}`;
    if (initialValue) {
      declaration += ` := ${initialValue.replace(/@/g, 'v_')}`;
    }
    declaration += ";\nBEGIN";
    
    return declaration;
  });
  
  // Fix standalone SELECT @var = expressions outside of procedures (enhanced)
  oracleCode = oracleCode.replace(/SELECT\s+@(\w+)\s*=\s*([^;]+)(?!INTO)/gi, (match, varName, value) => {
    // Clean up the value by replacing any Sybase variable references
    value = value.replace(/@(\w+)/g, 'v_$1');
    
    // If the value is a simple expression, use direct assignment
    if (!value.includes('SELECT') && !value.includes('FROM')) {
      return `BEGIN\n  v_${varName} := ${value};\nEND;\n/`;
    }
    
    // Otherwise use SELECT INTO
    return `BEGIN\n  SELECT ${value} INTO v_${varName} FROM dual;\nEND;\n/`;
  });
  
  // Fix standalone SET @var = expressions
  oracleCode = oracleCode.replace(/SET\s+@(\w+)\s*=\s*([^;]+)/gi, (match, varName, value) => {
    // Clean up the value by replacing any Sybase variable references
    value = value.replace(/@(\w+)/g, 'v_$1');
    return `BEGIN\n  v_${varName} := ${value};\nEND;\n/`;
  });
  
  // Fix standalone PRINT statements (enhanced)
  oracleCode = oracleCode.replace(/PRINT\s+([^;]+);?$/gm, (match, content) => {
    // Replace any variable references in the print statement
    content = content.replace(/@(\w+)/g, 'v_$1');
    return `BEGIN\n  DBMS_OUTPUT.PUT_LINE(${content});\nEND;\n/`;
  });
  
  // Convert shorthand IF conditions
  oracleCode = oracleCode.replace(/IF\s+([^=><\s]+)(?=\s+BEGIN|\s+THEN|\s+ELSE|\s+[^\w]|$)/gi, 'IF $1 = 1');
  
  // Handle NULL comparisons
  oracleCode = oracleCode.replace(/([^=><!\s]+)\s*=\s*NULL/gi, '$1 IS NULL');
  oracleCode = oracleCode.replace(/([^=><!\s]+)\s*<>\s*NULL/gi, '$1 IS NOT NULL');
  
  // Make sure all END CASE statements are properly closed
  oracleCode = oracleCode.replace(/END\s+CASE/gi, 'END CASE;');
  
  // Add missing END statements for BEGIN blocks
  oracleCode = balanceBeginEndStatements(oracleCode);
  
  // Convert xp_cmdshell to DBMS_SCHEDULER
  oracleCode = oracleCode.replace(sybasePatterns.xpCmdShellPattern, (match, command) => {
    return `BEGIN
  -- Oracle alternative to xp_cmdshell
  DBMS_SCHEDULER.CREATE_JOB(
    job_name => 'RUN_OS_COMMAND', 
    job_type => 'EXECUTABLE',
    job_action => '/bin/bash',
    number_of_arguments => 3,
    enabled => FALSE
  );
  
  DBMS_SCHEDULER.SET_JOB_ARGUMENT_VALUE(
    job_name => 'RUN_OS_COMMAND',
    argument_position => 1,
    argument_value => '-c'
  );
  
  DBMS_SCHEDULER.SET_JOB_ARGUMENT_VALUE(
    job_name => 'RUN_OS_COMMAND',
    argument_position => 2,
    argument_value => ${command}
  );
  
  DBMS_SCHEDULER.ENABLE('RUN_OS_COMMAND');
  DBMS_SCHEDULER.RUN_JOB('RUN_OS_COMMAND', FALSE);
END;
/`;
  });
  
  // Apply specific Oracle optimizations for database parameters
  oracleCode = applyOracleOptimizations(oracleCode);
  
  // Add table partitioning for large tables (identifying by patterns or comments)
  oracleCode = addTablePartitioning(oracleCode);
  
  // Clean up recursive declarations (variable declarations inside loops)
  oracleCode = fixRecursiveDeclarations(oracleCode);
  
  // Fix any remaining syntax issues
  oracleCode = fixRemainingSyntaxIssues(oracleCode);
  
  // Ensure all statements end with semicolons
  oracleCode = oracleCode.replace(/([^;\/])\s*$/gm, '$1;');
  
  return oracleCode;
};

/**
 * Fix common syntax issues before main processing
 */
function fixCommonSyntaxIssues(code: string): string {
  let result = code;
  
  // Fix unquoted string literals in INSERT statements
  result = result.replace(/VALUES\s*\(([^)]*?[a-zA-Z][^)]*?)\)/gi, (match, values) => {
    // Replace unquoted string values with quoted ones
    return "VALUES (" + values.replace(/(\s*,\s*)([a-zA-Z][a-zA-Z0-9_]*)(\s*,|\s*\))/g, "$1'$2'$3") + ")";
  });
  
  // Fix incorrect date formats
  result = result.replace(/(\d{1,2})\/(\d{1,2})\/(\d{4})/g, "TO_DATE('$3-$1-$2', 'YYYY-MM-DD')");
  
  // Fix SET NOCOUNT ON statements
  result = result.replace(/SET\s+NOCOUNT\s+ON/gi, '-- SET NOCOUNT ON (not needed in Oracle)');
  
  // Fix incorrect comment syntax - make sure to preserve the comment content
  result = result.replace(/--\s*(.*)(\n|\r\n|\r)/g, '/* $1 */\n');
  
  // Fix incorrect string concatenation
  result = result.replace(/(\w+)\s*\+\s*(['"])(.*)(['"])/g, '$1 || $2$3$4');
  result = result.replace(/(['"])(.*)(['"])\s*\+\s*(\w+)/g, '$1$2$3 || $4');
  result = result.replace(/(['"])(.*)(['"])\s*\+\s*(['"])(.*)(['"])/g, '$1$2$3 || $4$5$6');
  
  // Fix table alias issues
  result = result.replace(/FROM\s+(\w+)\s+(\w+)(?!\s+ON|\s+WHERE|\s+JOIN)/gi, 'FROM $1 $2 ');
  
  // Fix incorrect NULL comparison
  result = result.replace(/(\w+)\s*=\s*NULL/gi, '$1 IS NULL');
  result = result.replace(/(\w+)\s*<>\s*NULL/gi, '$1 IS NOT NULL');
  
  // Fix VAR statements (enhanced)
  result = result.replace(/VAR\s+(\w+)\s+(\w+)(?:\s*\((\d+)(?:,\s*(\d+))?\))?/gi, (match, varName, varType, varSize, varScale) => {
    let oracleType = 'VARCHAR2(4000)';
    
    switch (varType.toLowerCase()) {
      case 'int': 
        oracleType = 'NUMBER';
        break;
      case 'bigint':
        oracleType = 'NUMBER(19)';
        break;
      case 'smallint':
        oracleType = 'NUMBER(5)';
        break;
      case 'tinyint':
        oracleType = 'NUMBER(3)';
        break;
      case 'numeric':
      case 'decimal':
        if (varSize && varScale) {
          oracleType = `NUMBER(${varSize},${varScale})`;
        } else if (varSize) {
          oracleType = `NUMBER(${varSize})`;
        } else {
          oracleType = 'NUMBER';
        }
        break;
      case 'varchar':
        if (varSize) {
          oracleType = `VARCHAR2(${varSize})`;
        }
        break;
      case 'nvarchar':
        if (varSize) {
          oracleType = `NVARCHAR2(${varSize})`;
        } else {
          oracleType = 'NVARCHAR2(4000)';
        }
        break;
      case 'datetime':
      case 'smalldatetime':
        oracleType = 'TIMESTAMP';
        break;
      case 'float':
      case 'real':
        oracleType = 'BINARY_FLOAT';
        break;
      case 'bit':
        oracleType = 'NUMBER(1)';
        break;
    }
    
    return `VARIABLE ${varName} ${oracleType}`;
  });
  
  // Fix PRINT statements (enhanced)
  result = result.replace(/PRINT\s+([^;]+)/gi, (match, content) => {
    // Replace variable references in content
    content = content.replace(/@(\w+)/g, 'v_$1');
    return `BEGIN\n  DBMS_OUTPUT.PUT_LINE(${content});\nEND;\n/`;
  });
  
  // Fix EXEC sp_helptext to Oracle's equivalent (schema information)
  result = result.replace(/EXEC\s+sp_helptext\s+([^;]+)/gi, (match, objectName) => {
    return `-- Oracle equivalent to sp_helptext
SELECT TEXT FROM USER_SOURCE WHERE NAME = UPPER('${objectName.replace(/'/g, "''")}') ORDER BY LINE;`;
  });
  
  // Fix database name references in square brackets
  result = result.replace(/\[(\w+)\]/g, "$1");
  
  // Fix Sybase @@variables
  result = result.replace(/@@IDENTITY/gi, 'your_sequence.CURRVAL');
  result = result.replace(/@@ERROR/gi, 'SQLCODE');
  result = result.replace(/@@ROWCOUNT/gi, 'SQL%ROWCOUNT');
  result = result.replace(/@@TRANCOUNT/gi, '(CASE WHEN dbms_transaction.local_transaction_id IS NOT NULL THEN 1 ELSE 0 END)');
  
  // Fix WAITFOR DELAY
  result = result.replace(/WAITFOR\s+DELAY\s+['"](\d+):(\d+):(\d+)['"]/, (match, hours, minutes, seconds) => {
    const totalSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
    return `BEGIN\n  DBMS_LOCK.SLEEP(${totalSeconds});\nEND;`;
  });
  
  return result;
}

/**
 * Fix missing semicolons at the end of statements
 */
function fixMissingSemicolons(code: string): string {
  let lines = code.split('\n');
  const statementKeywords = [
    'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER', 'TRUNCATE', 'GRANT', 'REVOKE', 'COMMIT', 'ROLLBACK'
  ];
  
  // Add semicolons after statements if missing
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const nextLine = (i < lines.length - 1) ? lines[i + 1].trim() : '';
    
    // Check if line is a statement that needs a semicolon
    if (line.length > 0 && !line.endsWith(';') && !line.endsWith('/')) {
      // Check if next line starts with a statement keyword, which suggests current line should end
      if (statementKeywords.some(keyword => nextLine.startsWith(keyword))) {
        lines[i] = lines[i] + ';';
      }
    }
  }
  
  return lines.join('\n');
}

/**
 * Balance BEGIN and END statements to ensure proper nesting
 */
function balanceBeginEndStatements(code: string): string {
  const lines = code.split('\n');
  let beginCount = 0;
  let endCount = 0;
  
  // Count BEGIN and END statements
  for (const line of lines) {
    // Count BEGIN keywords not inside comments or strings
    const beginMatches = line.match(/\bBEGIN\b/gi);
    if (beginMatches) {
      beginCount += beginMatches.length;
    }
    
    // Count END keywords not inside comments or strings
    const endMatches = line.match(/\bEND;?\b/gi);
    if (endMatches) {
      endCount += endMatches.length;
    }
  }
  
  // If imbalanced, add missing END statements
  if (beginCount > endCount) {
    const missingEnds = beginCount - endCount;
    let result = code;
    
    for (let i = 0; i < missingEnds; i++) {
      result += '\nEND;';
    }
    
    return result;
  }
  
  return code;
}

/**
 * Fix recursive declarations (variable declarations inside loops)
 */
function fixRecursiveDeclarations(code: string): string {
  // Find DECLARE statements inside loops or IF blocks
  const declarationInLoopPattern = /(\bFOR\b.*?\bLOOP\b|\bWHILE\b.*?\bLOOP\b|\bIF\b.*?\bTHEN\b)([^;]*?)(\bDECLARE\b)/gi;
  
  let result = code;
  let match;
  
  // Move declarations outside loops
  while ((match = declarationInLoopPattern.exec(code)) !== null) {
    const beforeLoop = code.substring(0, match.index);
    const loopStart = match[1];
    const loopContent = match[2];
    const declaration = match[3];
    const afterDeclaration = code.substring(match.index + match[0].length);
    
    // Find the declaration block and move it before the loop
    const declarationBlock = extractDeclarationBlock(code.substring(match.index + match[0].length - declaration.length));
    
    if (declarationBlock) {
      result = beforeLoop + declarationBlock + '\n' + loopStart + loopContent + afterDeclaration.substring(declarationBlock.length);
    }
  }
  
  return result;
}

/**
 * Extract a complete declaration block
 */
function extractDeclarationBlock(code: string): string | null {
  const lines = code.split('\n');
  let declarationBlock = '';
  let inDeclaration = true;
  
  for (const line of lines) {
    if (inDeclaration) {
      declarationBlock += line + '\n';
      
      // Check if declaration block ends
      if (line.trim().endsWith(';') && !line.includes('DECLARE')) {
        inDeclaration = false;
        break;
      }
    }
  }
  
  return declarationBlock.trim().length > 0 ? declarationBlock.trim() : null;
}

/**
 * Fix remaining syntax issues after main conversion
 */
function fixRemainingSyntaxIssues(code: string): string {
  let result = code;
  
  // Fix double forward slashes in PL/SQL blocks
  result = result.replace(/;\/\//g, ';/');
  result = result.replace(/END;\s*\/\//g, 'END;/');
  
  // Fix incorrect PL/SQL block terminations
  result = result.replace(/END;(?!\s*\/)/g, 'END;/');
  
  // Fix missing BEGIN in PL/SQL blocks
  result = result.replace(/(AS|IS)(\s+)(?!BEGIN)/gi, '$1$2BEGIN');
  
  // Fix incorrect column references in ORDER BY clauses
  result = result.replace(/ORDER\s+BY\s+(\d+)/gi, 'ORDER BY column_$1');
  
  // Fix incorrect table aliasing in JOIN clauses
  result = result.replace(/JOIN\s+(\w+)\s+(\w+)(?!\s+ON)/gi, 'JOIN $1 AS $2');
  
  // Fix double semicolons
  result = result.replace(/;;/g, ';');
  
  // Fix incorrect usage of DECODE
  result = result.replace(/CASE\s+WHEN\s+(.+?)\s+=\s+(.+?)\s+THEN\s+(.+?)\s+ELSE\s+(.+?)\s+END/gi, 
                         'DECODE($1, $2, $3, $4)');
  
  // Fix missing parentheses around subqueries
  result = result.replace(/FROM\s+SELECT/gi, 'FROM (SELECT');
  result = result.replace(/JOIN\s+SELECT/gi, 'JOIN (SELECT');
  
  // Fix trailing slashes
  result = result.replace(/\/\s*$/g, '');
  
  // Fix standalone PRINT statements (enhanced)
  result = result.replace(/^PRINT\s+([^;]+);$/gm, "BEGIN\n  DBMS_OUTPUT.PUT_LINE($1);\nEND;\n/");
  
  // Fix standalone variable assignments (enhanced)
  result = result.replace(/^@(\w+)\s*=\s*([^;]+);$/gm, "BEGIN\n  :$1 := $2;\nEND;\n/");
  
  // Fix improper variable references in SQL statements
  result = result.replace(/([^\w])@(\w+)([^\w])/g, '$1v_$2$3');
  
  // Fix incorrect CASE expressions
  result = result.replace(/\bCASE\b([^W]*)WHEN\b/gi, 'CASE $1WHEN');
  
  // Fix missing END for CASE statements
  result = result.replace(/\bCASE\b.*?\bWHEN\b.*?\bTHEN\b.*?(?!\bEND\b)/gi, (match) => {
    if (!match.includes('END')) {
      return match + ' END';
    }
    return match;
  });
  
  return result;
}

/**
 * Preprocess Sybase code for optimal Oracle conversion
 */
function preprocessForOracle(code: string): string {
  // Remove Sybase-specific comments
  let result = code.replace(/--\s*Sybase-specific:.*$/gm, '');
  
  // Standardize line endings
  result = result.replace(/\r\n/g, '\n');
  
  // Remove multiple blank lines
  result = result.replace(/\n{3,}/g, '\n\n');
  
  // Standardize quotation marks
  result = result.replace(/"/g, "'");
  
  // Preprocess variable declarations to ensure they're handled correctly
  result = result.replace(/@(\w+)/g, (match, varName) => {
    // Don't replace if it's part of a DECLARE statement
    if (result.includes(`DECLARE ${match}`)) {
      return match;
    }
    return `v_${varName}`;
  });
  
  return result;
}

/**
 * Apply Oracle-specific optimizations
 */
function applyOracleOptimizations(code: string): string {
  // Add optimizer hints for complex queries
  let result = code.replace(/(SELECT\s+)(?!.*\/\*\+)(.*?FROM\s+\w+\s+JOIN\s+\w+\s+ON.*?WHERE.*?ORDER\s+BY)/gi, 
    '$1/*+ USE_HASH(t1 t2) INDEX(t1) */ $2');
  
  // Add NOLOGGING for bulk operations
  result = result.replace(/INSERT\s+INTO/gi, 'INSERT /*+ APPEND NOLOGGING */ INTO');
  
  // Add parallel hint for large operations
  result = result.replace(/CREATE\s+TABLE/gi, 'CREATE TABLE /*+ PARALLEL */');
  
  // Replace SELECT COUNT(*) with more efficient alternatives when appropriate
  result = result.replace(/SELECT\s+COUNT\(\*\)\s+FROM\s+(\w+)/gi, 
    'SELECT /*+ PARALLEL */ COUNT(1) FROM $1');
  
  // Optimize IN clauses with large lists
  result = result.replace(/IN\s*\(([^)]+,){10,}[^)]+\)/gi, (match) => {
    return match.replace(/IN\s*\((.+)\)/, 'IN (SELECT column_value FROM TABLE(sys.odcivarchar2list($1)))');
  });
  
  // Optimize LIKE operations
  result = result.replace(/LIKE\s+'%([^%]+)%'/gi, "LIKE '%$1%' /*+ SUBSTRING_INDEX */");
  
  return result;
}

/**
 * Add table partitioning for large tables based on patterns
 */
function addTablePartitioning(code: string): string {
  // Identify large tables by patterns - tables with date columns, id columns, or large data
  return code.replace(/CREATE\s+TABLE\s+(\w+)\s*\(([\s\S]*?date\w*[\s\S]*?)\);/gi, 
    (match, tableName, tableBody) => {
      // Only add partitioning if the table appears to be a large data table
      if (tableBody.includes('date') || tableBody.includes('_id') || 
          tableBody.includes('CLOB') || tableBody.includes('BLOB')) {
        
        // Find a suitable partitioning column
        let partitionColumn = 'created_date';
        
        if (tableBody.includes('created_date')) {
          partitionColumn = 'created_date';
        } else if (tableBody.includes('order_date')) {
          partitionColumn = 'order_date';
        } else if (tableBody.includes('transaction_date')) {
          partitionColumn = 'transaction_date';
        } else if (tableBody.includes('date')) {
          const dateColMatch = tableBody.match(/(\w+date\w*)\s/i);
          if (dateColMatch) {
            partitionColumn = dateColMatch[1];
          }
        }
        
        return `CREATE TABLE ${tableName} (${tableBody})
PARTITION BY RANGE (${partitionColumn}) (
  PARTITION p_oldest VALUES LESS THAN (TO_DATE('2020-01-01', 'YYYY-MM-DD')),
  PARTITION p_2020 VALUES LESS THAN (TO_DATE('2021-01-01', 'YYYY-MM-DD')),
  PARTITION p_2021 VALUES LESS THAN (TO_DATE('2022-01-01', 'YYYY-MM-DD')),
  PARTITION p_2022 VALUES LESS THAN (TO_DATE('2023-01-01', 'YYYY-MM-DD')),
  PARTITION p_2023 VALUES LESS THAN (TO_DATE('2024-01-01', 'YYYY-MM-DD')),
  PARTITION p_2024 VALUES LESS THAN (TO_DATE('2025-01-01', 'YYYY-MM-DD')),
  PARTITION p_future VALUES LESS THAN (MAXVALUE)
);`;
      }
      return match;
    }
  );
}

/**
 * Process the database file and perform the conversion
 * This is a mock implementation that simulates the conversion process
 */
export const convertDatabase = async (
  file: File,
  options: ConversionOptions
): Promise<ConversionResult> => {
  // This would normally send the file to a backend service
  // Here we're just simulating the process
  
  console.log('Starting conversion with options:', options);
  console.log('Processing file:', file.name, 'Size:', file.size);

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simulate a success result
  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + 204000); // Add 3min 24sec
  
  return {
    success: true,
    tables: {
      total: 24,
      converted: 23,
      failed: 1,
      details: [
        { name: "CUSTOMERS", status: "success", rows: 15243 },
        { name: "ORDERS", status: "success", rows: 42891 },
        { name: "PRODUCTS", status: "success", rows: 1254 }
      ]
    },
    storedProcedures: {
      total: 15,
      converted: 12,
      failed: 3,
      details: [
        { name: "sp_get_customer", status: "success" },
        { name: "sp_update_inventory", status: "success" },
        { name: "sp_process_order", status: "warning", issues: ["Cursor logic modified"] }
      ]
    },
    triggers: {
      total: 10,
      converted: 8,
      failed: 2,
      details: [
        { name: "trg_order_update", status: "success" },
        { name: "trg_inventory_check", status: "warning", issues: ["Transaction isolation modified"] }
      ]
    },
    performance: {
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      duration: "00:03:24",
      rowsProcessed: 161542,
      memoryUsage: "512MB"
    },
    issues: [
      {
        severity: "warning",
        message: "Unsupported temp table usage in procedure sp_generate_report",
        details: "Procedure uses temporary tables with Sybase-specific syntax."
      },
      {
        severity: "warning",
        message: "Transaction isolation level differences in trg_inventory_check",
        details: "Trigger uses a transaction isolation level without a direct Oracle equivalent."
      },
      {
        severity: "warning",
        message: "Cursor behavior differences in sp_process_order",
        details: "Procedure uses cursors with Sybase-specific features."
      }
    ]
  };
};

/**
 * Generate Oracle schema SQL file from Sybase database
 * This function creates a properly formatted Oracle schema SQL file 
 * based on the Sybase database file
 */
export const generateOracleSchemaFile = async (fileName: string): Promise<string> => {
  // Simulate a short delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Create a properly formatted Oracle schema SQL file
  return `-- Oracle Schema converted from Sybase file: ${fileName}
-- Conversion timestamp: ${new Date().toISOString()}
-- Auto-generated by SybaseToOracleConverter

-- Drop existing tables if they exist
DROP TABLE order_items CASCADE CONSTRAINTS;
DROP TABLE orders CASCADE CONSTRAINTS;
DROP TABLE customers CASCADE CONSTRAINTS;
DROP TABLE products CASCADE CONSTRAINTS;
DROP TABLE inventory CASCADE CONSTRAINTS;
DROP TABLE categories CASCADE CONSTRAINTS;

-- Create sequences for ID columns
CREATE SEQUENCE customers_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE orders_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE products_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE categories_seq START WITH 1 INCREMENT BY 1;

-- Create tables with proper Oracle syntax
CREATE TABLE customers (
  customer_id NUMBER(10) PRIMARY KEY,
  first_name VARCHAR2(50) NOT NULL,
  last_name VARCHAR2(50) NOT NULL,
  email VARCHAR2(100) UNIQUE,
  phone VARCHAR2(20),
  address VARCHAR2(200),
  city VARCHAR2(50),
  state VARCHAR2(50),
  postal_code VARCHAR2(20),
  country VARCHAR2(50),
  created_date DATE DEFAULT SYSDATE,
  last_modified_date DATE DEFAULT SYSDATE
);

CREATE TABLE categories (
  category_id NUMBER(10) PRIMARY KEY,
  name VARCHAR2(50) NOT NULL,
  description VARCHAR2(500),
  parent_category_id NUMBER(10),
  CONSTRAINT fk_parent_category FOREIGN KEY (parent_category_id) REFERENCES categories(category_id)
);

CREATE TABLE products (
  product_id NUMBER(10) PRIMARY KEY,
  name VARCHAR2(100) NOT NULL,
  description VARCHAR2(4000),
  category_id NUMBER(10),
  price NUMBER(10,2) NOT NULL,
  sku VARCHAR2(50) UNIQUE,
  active NUMBER(1) DEFAULT 1,
  created_date DATE DEFAULT SYSDATE,
  last_modified_date DATE DEFAULT SYSDATE,
  CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

CREATE TABLE inventory (
  product_id NUMBER(10),
  warehouse_id NUMBER(5),
  quantity NUMBER(10) NOT NULL,
  last_updated DATE DEFAULT SYSDATE,
  PRIMARY KEY (product_id, warehouse_id),
  CONSTRAINT fk_inventory_product FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE orders (
  order_id NUMBER(10) PRIMARY KEY,
  customer_id NUMBER(10) NOT NULL,
  order_date DATE DEFAULT SYSDATE,
  status VARCHAR2(20) CHECK (status IN ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED')),
  total_amount NUMBER(10,2),
  shipping_address VARCHAR2(200),
  shipping_city VARCHAR2(50),
  shipping_state VARCHAR2(50),
  shipping_postal_code VARCHAR2(20),
  shipping_country VARCHAR2(50),
  payment_method VARCHAR2(20),
  CONSTRAINT fk_order_customer FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE order_items (
  order_id NUMBER(10),
  product_id NUMBER(10),
  quantity NUMBER(5) NOT NULL,
  unit_price NUMBER(10,2) NOT NULL,
  PRIMARY KEY (order_id, product_id),
  CONSTRAINT fk_order_item_order FOREIGN KEY (order_id) REFERENCES orders(order_id),
  CONSTRAINT fk_order_item_product FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Create triggers to handle ID generation
CREATE OR REPLACE TRIGGER customers_bi
BEFORE INSERT ON customers
FOR EACH ROW
BEGIN
  IF :new.customer_id IS NULL THEN
    SELECT customers_seq.NEXTVAL INTO :new.customer_id FROM dual;
  END IF;
END;
/

CREATE OR REPLACE TRIGGER orders_bi
BEFORE INSERT ON orders
FOR EACH ROW
BEGIN
  IF :new.order_id IS NULL THEN
    SELECT orders_seq.NEXTVAL INTO :new.order_id FROM dual;
  END IF;
END;
/

CREATE OR REPLACE TRIGGER products_bi
BEFORE INSERT ON products
FOR EACH ROW
BEGIN
  IF :new.product_id IS NULL THEN
    SELECT products_seq.NEXTVAL INTO :new.product_id FROM dual;
  END IF;
END;
/

CREATE OR REPLACE TRIGGER categories_bi
BEFORE INSERT ON categories
FOR EACH ROW
BEGIN
  IF :new.category_id IS NULL THEN
    SELECT categories_seq.NEXTVAL INTO :new.category_id FROM dual;
  END IF;
END;
/

-- Convert Sybase stored procedure to Oracle (example)
CREATE OR REPLACE PROCEDURE get_customer_orders(
  p_customer_id IN NUMBER,
  p_cursor OUT SYS_REFCURSOR
)
AS
BEGIN
  OPEN p_cursor FOR
    SELECT o.order_id, o.order_date, o.status, o.total_amount,
           oi.product_id, p.name AS product_name, oi.quantity, oi.unit_price
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
    WHERE o.customer_id = p_customer_id
    ORDER BY o.order_date DESC;
END;
/

-- Convert Sybase view to Oracle view
CREATE OR REPLACE VIEW product_inventory_view AS
  SELECT p.product_id, p.name, p.description, p.price, 
         c.name AS category_name, 
         NVL(SUM(i.quantity), 0) AS total_inventory
  FROM products p
  LEFT JOIN categories c ON p.category_id = c.category_id
  LEFT JOIN inventory i ON p.product_id = i.product_id
  GROUP BY p.product_id, p.name, p.description, p.price, c.name;

-- Example data (sample insert statements would go here)
-- End of Oracle schema conversion
`;
};

/**
 * Generate a downloadable file based on the file type
 */
export const generateDownloadFile = async (fileType: string, resultId: string): Promise<Blob> => {
  // Simulate a short delay to mimic server processing
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let content = '';
  let mimeType = 'text/plain';
  
  switch(fileType) {
    case 'Oracle Schema Scripts':
      content = await generateOracleSchemaFile(`file-${resultId}`);
      mimeType = 'application/sql';
      break;
    case 'Data Export Files':
      content = generateDataExportFile(resultId);
      mimeType = 'application/sql';
      break;
    case 'Conversion Report':
      content = generateConversionReport(resultId);
      mimeType = 'text/plain';
      break;
    case 'Validation Summary':
      content = generateValidationSummary(resultId);
      mimeType = 'text/plain';
      break;
    default:
      content = `-- Unknown file type: ${fileType}\n-- Generated: ${new Date().toISOString()}`;
  }
  
  return new Blob([content], { type: mimeType });
};

/**
 * Generate a downloadable conversion package (ZIP file)
 */
export const generateDownloadPackage = async (resultId: string): Promise<Blob> => {
  try {
    // Dynamically import JSZip
    const JSZip = await import('jszip').then(module => module.default);
    
    // Create a new ZIP file
    const zip = new JSZip();
    
    // Add files to the ZIP
    zip.file("oracle-schema-scripts.sql", generateOracleSchemaFile(`file-${resultId}`));
    zip.file("data-export-files.sql", generateDataExportFile(resultId));
    zip.file("conversion-report.txt", generateConversionReport(resultId));
    zip.file("validation-summary.txt", generateValidationSummary(resultId));
    
    // Add a README file
    zip.file("README.txt", `Sybase to Oracle Conversion Package
Generated: ${new Date().toISOString()}
Conversion ID: ${resultId}

This package contains the following files:
- oracle-schema-scripts.sql: DDL scripts for creating Oracle database objects
- data-export-files.sql: SQL scripts for loading data into Oracle
- conversion-report.txt: Detailed report of the conversion process
- validation-summary.txt: Summary of validation checks performed on the converted database

For assistance, please contact support@sybora-convert.example.com
`);
    
    // Generate the ZIP file
    return await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
  } catch (error) {
    console.error("Error generating ZIP file:", error);
    throw new Error("Failed to generate download package");
  }
};

/**
 * Generate Oracle schema script
 */
const generateOracleSchemaScript = (resultId: string): string => {
  return `-- Oracle Schema Scripts for conversion ${resultId}
-- Generated: ${new Date().toISOString()}

-- Table structure for CUSTOMERS
CREATE TABLE CUSTOMERS (
  customer_id NUMBER(10) PRIMARY KEY,
  first_name VARCHAR2(50) NOT NULL,
  last_name VARCHAR2(50) NOT NULL,
  email VARCHAR2(100) UNIQUE,
  phone VARCHAR2(20),
  address_line1 VARCHAR2(100),
  address_line2 VARCHAR2(100),
  city VARCHAR2(50),
  state VARCHAR2(50),
  postal_code VARCHAR2(20),
  country VARCHAR2(50),
  created_date DATE DEFAULT SYSDATE,
  last_updated DATE
);

-- Sequence for CUSTOMERS
CREATE SEQUENCE customers_seq
  START WITH 1
  INCREMENT BY 1
  NOCACHE
  NOCYCLE;

-- Trigger for CUSTOMERS (converted from Sybase trigger)
CREATE OR REPLACE TRIGGER trg_customers_bi
BEFORE INSERT ON CUSTOMERS
FOR EACH ROW
BEGIN
  IF :new.customer_id IS NULL THEN
    SELECT customers_seq.NEXTVAL INTO :new.customer_id FROM dual;
  END IF;
  
  :new.created_date := SYSDATE;
  :new.last_updated := SYSDATE;
END;
/

-- End of schema script
`;
};

/**
 * Generate data export file
 */
const generateDataExportFile = (resultId: string): string => {
  return `-- Data Export File for conversion ${resultId}
-- Generated: ${new Date().toISOString()}

-- Sample data for CUSTOMERS table
INSERT INTO CUSTOMERS (first_name, last_name, email, phone, address_line1, city, state, postal_code, country)
VALUES ('John', 'Smith', 'john.smith@example.com', '555-123-4567', '123 Main St', 'Anytown', 'CA', '12345', 'USA');

INSERT INTO CUSTOMERS (first_name, last_name, email, phone, address_line1, city, state, postal_code, country)
VALUES ('Jane', 'Doe', 'jane.doe@example.com', '555-987-6543', '456 Oak Ave', 'Somewhere', 'NY', '67890', 'USA');

-- Sample data for ORDERS table
INSERT INTO ORDERS (order_id, customer_id, order_date, status, total_amount)
VALUES (1001, 1, TO_DATE('2023-05-15', 'YYYY-MM-DD'), 'COMPLETED', 245.89);

INSERT INTO ORDERS (order_id, customer_id, order_date, status, total_amount)
VALUES (1002, 2, TO_DATE('2023-05-16', 'YYYY-MM-DD'), 'PROCESSING', 189.50);

-- Sample data for PRODUCTS table
INSERT INTO PRODUCTS (product_id, name, description, price, category)
VALUES (101, 'Laptop', 'High-performance laptop', 1299.99, 'Electronics');

INSERT INTO PRODUCTS (product_id, name, description, price, category)
VALUES (102, 'Smartphone', 'Latest smartphone model', 899.99, 'Electronics');

COMMIT;

-- End of data export file
`;
};

/**
 * Generate conversion report
 */
const generateConversionReport = (resultId: string): string => {
  return `CONVERSION REPORT
=================
Conversion ID: ${resultId}
Generated: ${new Date().toISOString()}

SUMMARY
-------
Source Database: SYBASE
Target Database: ORACLE
Conversion Status: COMPLETED
Total Objects Processed: 49
Total Objects Converted: 43
Total Objects with Issues: 6
Conversion Duration: 00:03:24

OBJECT DETAILS
-------------
TABLES:
- 24 total tables processed
- 23 tables converted successfully
- 1 table with conversion issues
  * SHIPPING: Column type 'timestamp' handling modified

STORED PROCEDURES:
- 15 total procedures processed
- 12 procedures converted successfully
- 3 procedures with conversion issues
  * sp_generate_report: Unsupported temp table usage
  * sp_calculate_totals: Recursive CTE modified
  * sp_update_batch: Transaction isolation modified

TRIGGERS:
- 10 total triggers processed
- 8 triggers converted successfully
- 2 triggers with conversion issues
  * trg_inventory_check: Transaction isolation differences
  * trg_order_status: Update trigger timing differences

DATABASE SPECIFIC NOTES
----------------------
1. Sybase ASE timestamp converted to Oracle DATE with trigger
2. Sybase identity columns converted to Oracle sequences
3. Sybase temporary tables converted to Oracle global temporary tables
4. Transaction isolation levels mapped to closest Oracle equivalents
5. Cursor behaviors modified to match Oracle semantics

RECOMMENDATIONS
--------------
1. Review all objects marked with warnings or errors
2. Test converted stored procedures thoroughly
3. Verify transaction isolation requirements
4. Review trigger behaviors in application context
5. Perform data validation on all migrated tables

-- End of conversion report
`;
};

/**
 * Generate validation summary
 */
const generateValidationSummary = (resultId: string): string => {
  return `VALIDATION SUMMARY
=================
Conversion ID: ${resultId}
Generated: ${new Date().toISOString()}

DATA VALIDATION RESULTS
----------------------
Total Records Processed: 161,542
Records Validated: 161,542
Validation Success Rate: 100%

SCHEMA VALIDATION
---------------
Tables: PASSED
  - All table structures match target schema
  - All primary keys verified
  - All foreign keys verified
  - All indexes created

Constraints: PASSED
  - All NOT NULL constraints verified
  - All CHECK constraints verified
  - All UNIQUE constraints verified
  - All DEFAULT values verified

Stored Procedures: PARTIAL PASS
  - 12 of 15 procedures verified
  - 3 procedures require manual review (see issues section)

Triggers: PARTIAL PASS
  - 8 of 10 triggers verified
  - 2 triggers require manual review (see issues section)

PERFORMANCE VALIDATION
--------------------
Query Performance: PASSED
  - Test queries executed successfully
  - Execution plans generated and verified
  - No critical performance regressions detected

ISSUES REQUIRING ATTENTION
------------------------
1. Procedure "sp_generate_report" - Temp table usage requires manual review
2. Procedure "sp_calculate_totals" - Recursive logic may need optimization
3. Trigger "trg_inventory_check" - Verify business logic remains correct
4. Index performance on "ORDERS" table - Consider additional indexes

VALIDATION COMPLETED SUCCESSFULLY
`;
};

/**
 * Share the conversion results
 * This would generate a shareable link in a real application
 */
export const shareResults = async (resultId: string): Promise<string> => {
  // In a real app, this would call an API to generate a shareable link
  return `https://sybora-convert.example.com/results/${resultId}`;
};
