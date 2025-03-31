/**
 * Session Tracking Module
 * Monitors study session activity and generates summaries
 */
const SessionTracker = {
  startTime: null,
  activities: [],
  
  // Start a new session
  startSession: function() {
    this.startTime = new Date();
    this.activities = [];
    // Store in localStorage to recover from accidental closes
    localStorage.setItem('currentSession', JSON.stringify({
      startTime: this.startTime,
      activities: this.activities
    }));
    console.log('Session started at', this.startTime);
  },
  
  // Record an activity
  logActivity: function(activityType, details) {
    const activity = {
      timestamp: new Date(),
      type: activityType, // "question", "review", "notes", etc.
      details: details
    };
    this.activities.push(activity);
    // Update in localStorage
    localStorage.setItem('currentSession', JSON.stringify({
      startTime: this.startTime,
      activities: this.activities
    }));
    console.log('Activity logged:', activityType);
  },
  
  // End the session and generate summary
  endSession: function() {
    if (!this.startTime) return null;
    
    // Generate summary
    const summary = this.generateSummary();
    
    // Clear current session
    this.startTime = null;
    this.activities = [];
    localStorage.removeItem('currentSession');
    
    return summary;
  },
  
  // Create session summary
  generateSummary: function() {
    if (!this.startTime || this.activities.length === 0) {
      return null;
    }
    
    // Calculate session duration
    const endTime = new Date();
    const duration = (endTime - this.startTime) / (1000 * 60); // in minutes
    
    // Count activity types
    const activityCounts = this.activities.reduce((counts, activity) => {
      counts[activity.type] = (counts[activity.type] || 0) + 1;
      return counts;
    }, {});
    
    // Get topics covered
    const topicsCovered = [...new Set(
      this.activities
        .filter(a => a.details && a.details.topic)
        .map(a => a.details.topic)
    )];
    
    // Return summary object
    return {
      date: new Date().toLocaleDateString(),
      startTime: new Date(this.startTime).toLocaleTimeString(),
      endTime: endTime.toLocaleTimeString(),
      duration: Math.round(duration),
      activityCounts,
      topicsCovered,
      activities: this.activities
    };
  },
  
  // Send session summary via email
  emailSummary: function(summary, emailAddress) {
    if (!summary) return false;
    
    // Format summary into readable text
    const emailBody = this.formatSummaryForEmail(summary);
    
    // For V1: Use mailto link (opens email client)
    const subject = `Psychology Revision Summary - ${summary.date}`;
    const mailtoLink = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Open email client
    window.open(mailtoLink);
    
    // Store that we offered to send summary
    localStorage.setItem('lastSummaryDate', summary.date);
    
    return true;
  },
  
  // Format summary for email body
  formatSummaryForEmail: function(summary) {
    return `
Psychology Revision Session Summary
-----------------------------------
Date: ${summary.date}
Time: ${summary.startTime} to ${summary.endTime} (${summary.duration} minutes)

Topics Covered:
${summary.topicsCovered.map(topic => `- ${topic}`).join('\n')}

Activities Completed:
${Object.entries(summary.activityCounts)
  .map(([type, count]) => `- ${count} ${type}${count !== 1 ? 's' : ''}`)
  .join('\n')}

Detailed Activity Log:
${summary.activities.map(a => 
  `- [${new Date(a.timestamp).toLocaleTimeString()}] ${a.type}: ${this.formatActivityDetails(a.details)}`
).join('\n')}

Keep up the great work, Charlie!
Your next recommended focus areas:
${this.getRecommendedFocusAreas(summary).map(area => `- ${area}`).join('\n')}
`;
  },
  
  // Format activity details for readability
  formatActivityDetails: function(details) {
    if (!details) return 'No details';
    
    // Format based on activity type
    if (details.questionId) {
      return `Question on ${details.topic || 'unknown topic'} (${details.score ? details.score + '/16' : 'unscored'})`;
    }
    if (details.topic && details.action) {
      return `${details.action} on ${details.topic}`;
    }
    
    // Default to simple string representation
    return JSON.stringify(details);
  },
  
  // Generate study recommendations
  getRecommendedFocusAreas: function(summary) {
    // Get topics from user data
    const userData = Storage.getData();
    const topicStrengths = userData.progress.topicStrength || {};
    
    // All AQA Psychology topics
    const allTopics = [
      "Social Influence", "Memory", "Attachment", 
      "Psychopathology", "Research Methods"
    ];
    
    // Get session topics
    const sessionTopics = summary.topicsCovered || [];
    
    // Find topics not covered in this session
    const uncoveredTopics = allTopics.filter(topic => 
      !sessionTopics.includes(topic)
    );
    
    // Sort by strength (weakest first)
    uncoveredTopics.sort((a, b) => 
      (topicStrengths[a] || 0) - (topicStrengths[b] || 0)
    );
    
    // Return top 3 recommendations
    return uncoveredTopics.slice(0, 3);
  },
  
  // Recover a session if it was interrupted
  recoverSession: function() {
    const sessionData = localStorage.getItem('currentSession');
    if (sessionData) {
      try {
        const parsedData = JSON.parse(sessionData);
        this.startTime = new Date(parsedData.startTime);
        this.activities = parsedData.activities || [];
        return true;
      } catch (e) {
        console.error('Error recovering session', e);
        localStorage.removeItem('currentSession');
        return false;
      }
    }
    return false;
  }
};