// Duplicate report detection utilities

// Calculate distance between two coordinates in kilometers
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Extract keywords from text (removing common stop words)
export const extractKeywords = (text) => {
  const stopWords = [
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us',
    'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their'
  ];

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word))
    .slice(0, 10); // Limit to top 10 keywords
};

// Calculate keyword similarity percentage
export const calculateKeywordSimilarity = (keywords1, keywords2) => {
  if (keywords1.length === 0 || keywords2.length === 0) return 0;
  
  const commonKeywords = keywords1.filter(keyword => keywords2.includes(keyword));
  const totalUniqueKeywords = new Set([...keywords1, ...keywords2]).size;
  
  return (commonKeywords.length * 2) / (keywords1.length + keywords2.length);
};

// Check if two reports are potentially duplicates
export const checkPotentialDuplicate = (newReport, existingReport, options = {}) => {
  const {
    maxDistance = 0.5, // 500 meters
    minKeywordSimilarity = 0.3, // 30% similarity
    maxAgeHours = 72, // 3 days
  } = options;

  // Check if reports are in the same category
  if (newReport.category !== existingReport.category) {
    return { isDuplicate: false, confidence: 0, reasons: [] };
  }

  // Check distance
  const distance = calculateDistance(
    newReport.lat,
    newReport.lng,
    existingReport.lat,
    existingReport.lng
  );

  if (distance > maxDistance) {
    return { isDuplicate: false, confidence: 0, reasons: [] };
  }

  // Check age of existing report
  const reportAge = Date.now() - new Date(existingReport.created_at).getTime();
  const ageInHours = reportAge / (1000 * 60 * 60);

  if (ageInHours > maxAgeHours) {
    return { isDuplicate: false, confidence: 0, reasons: [] };
  }

  // Extract and compare keywords
  const newKeywords = extractKeywords(newReport.title + ' ' + newReport.description);
  const existingKeywords = extractKeywords(existingReport.title + ' ' + existingReport.description);
  const keywordSimilarity = calculateKeywordSimilarity(newKeywords, existingKeywords);

  // Calculate confidence score
  let confidence = 0;
  const reasons = [];

  // Same category (base score)
  confidence += 0.2;
  reasons.push('Same category');

  // Distance factor (closer = higher confidence)
  const distanceFactor = Math.max(0, 1 - (distance / maxDistance));
  confidence += distanceFactor * 0.4;
  reasons.push(`${Math.round(distance * 1000)}m away`);

  // Keyword similarity factor
  confidence += keywordSimilarity * 0.4;
  if (keywordSimilarity > 0) {
    reasons.push(`${Math.round(keywordSimilarity * 100)}% keyword similarity`);
  }

  const isDuplicate = confidence >= 0.6 || keywordSimilarity >= minKeywordSimilarity;

  return {
    isDuplicate,
    confidence: Math.min(confidence, 1),
    reasons,
    distance: Math.round(distance * 1000), // in meters
    keywordSimilarity: Math.round(keywordSimilarity * 100), // as percentage
    existingReport,
  };
};

// Find all potential duplicates from a list of existing reports
export const findPotentialDuplicates = (newReport, existingReports, options = {}) => {
  const duplicates = existingReports
    .map(report => checkPotentialDuplicate(newReport, report, options))
    .filter(result => result.isDuplicate)
    .sort((a, b) => b.confidence - a.confidence); // Sort by confidence descending

  return duplicates;
};

// Generate user-friendly duplicate message
export const generateDuplicateMessage = (duplicates) => {
  if (duplicates.length === 0) return null;

  const topDuplicate = duplicates[0];
  const { existingReport, distance, keywordSimilarity } = topDuplicate;

  let message = `We found a similar report nearby:\n\n`;
  message += `"${existingReport.title}"\n`;
  message += `📍 ${distance}m away\n`;
  message += `📅 ${new Date(existingReport.created_at).toLocaleDateString()}\n`;
  
  if (keywordSimilarity > 0) {
    message += `🔍 ${keywordSimilarity}% similar content\n`;
  }
  
  if (existingReport.upvote_count > 0) {
    message += `👍 ${existingReport.upvote_count} upvotes\n`;
  }

  message += `\nWould you like to upvote the existing report instead, or continue with your new report?`;

  return message;
};