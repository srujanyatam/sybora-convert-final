
/**
 * Calculates performance metrics for code conversion
 * 
 * @param originalCode The original Sybase code
 * @param convertedCode The converted Oracle code
 * @returns Performance metrics object
 */
export const calculatePerformanceMetrics = (originalCode: string, convertedCode: string) => {
  // Calculate complexity based on different factors
  // This is a simplified example - in a real application, more sophisticated metrics would be used
  
  // Original code complexity (based on length, statements, and keywords)
  const originalLength = originalCode.length;
  const originalStatements = (originalCode.match(/;/g) || []).length;
  const originalKeywords = (originalCode.match(/\b(SELECT|FROM|WHERE|JOIN|GROUP BY|ORDER BY|HAVING)\b/gi) || []).length;
  
  // Converted code complexity
  const convertedLength = convertedCode.length;
  const convertedStatements = (convertedCode.match(/;/g) || []).length;
  const convertedKeywords = (convertedCode.match(/\b(SELECT|FROM|WHERE|JOIN|GROUP BY|ORDER BY|HAVING)\b/gi) || []).length;
  
  // Calculate complexity scores (weighted sum)
  const lengthWeight = 0.2;
  const statementWeight = 0.5;
  const keywordWeight = 0.3;
  
  const originalComplexity = Math.round(
    (originalLength * lengthWeight) + 
    (originalStatements * statementWeight * 10) + 
    (originalKeywords * keywordWeight * 5)
  );
  
  const convertedComplexity = Math.round(
    (convertedLength * lengthWeight) + 
    (convertedStatements * statementWeight * 10) + 
    (convertedKeywords * keywordWeight * 5)
  );
  
  // Calculate performance improvement
  // For simplicity, we'll assume that Oracle's procedural syntax is more efficient
  // and that explicit type conversions improve performance
  
  // Check for Oracle-specific optimizations
  const hasOracleOptimizations = 
    convertedCode.includes('INTO') || 
    convertedCode.includes('NUMBER') || 
    convertedCode.includes('VARCHAR2');
  
  // Check for improved syntax (removing GO statements, adding proper END syntax)
  const hasImprovedSyntax = 
    !convertedCode.includes('GO') && 
    convertedCode.includes('END;');
  
  // Estimate performance improvement
  let perfImprovement = 0;
  
  if (hasOracleOptimizations) perfImprovement += 15;
  if (hasImprovedSyntax) perfImprovement += 10;
  
  // Adjust based on complexity difference
  const complexityDifference = originalComplexity - convertedComplexity;
  if (complexityDifference > 0) {
    perfImprovement += 5;
  }
  
  // Cap improvement between 0-30% for realistic estimates
  perfImprovement = Math.max(0, Math.min(30, perfImprovement));
  
  return {
    originalComplexity,
    convertedComplexity,
    performanceImprovement: `+${perfImprovement}%`
  };
};
