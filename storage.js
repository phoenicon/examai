/**
 * Browser Storage Module
 * Handles persistence of user data in localStorage
 */
const Storage = {
  // Base structure for user data
  defaultData: {
    progress: {
      completedQuestions: [],
      topicStrength: {}, 
      lastViewed: ""
    },
    content: {
      savedAnswers: {},
      notes: {},
      bookmarks: []
    },
    settings: {
      darkMode: false,
      textSize: "medium",
      aiHelp: true,
      email: ""
    }
  },
  
  // Initialize storage
  init: function() {
    if (!localStorage.getItem('userData')) {
      this.saveData(this.defaultData);
    }
    
    // Recovery check for interrupted sessions
    if (localStorage.getItem('currentSession')) {
      console.log('Recovering previous session');
      // Could implement recovery logic here
    }
  },
  
  // Save all user data
  saveData: function(data) {
    try {
      localStorage.setItem('userData', JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Error saving user data', e);
      return false;
    }
  },
  
  // Get all user data
  getData: function() {
    try {
      const data = localStorage.getItem('userData');
      return data ? JSON.parse(data) : this.defaultData;
    } catch (e) {
      console.error('Error retrieving user data', e);
      return this.defaultData;
    }
  },
  
  // Update a specific section of user data
  updateSection: function(section, data) {
    const userData = this.getData();
    userData[section] = {...userData[section], ...data};
    return this.saveData(userData);
  },
  
  // Get a specific section of user data
  getSection: function(section) {
    const userData = this.getData();
    return userData[section] || {};
  },
  
  // Clear all user data (reset)
  clearData: function() {
    localStorage.removeItem('userData');
    localStorage.removeItem('currentSession');
    return true;
  },
  
  // Export user data as JSON file
  exportData: function() {
    const userData = this.getData();
    const dataStr = JSON.stringify(userData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportLink = document.createElement('a');
    exportLink.setAttribute('href', dataUri);
    exportLink.setAttribute('download', 'psychology-revision-data.json');
    exportLink.click();
  },
  
  // Import user data from JSON file
  importData: function(jsonData) {
    try {
      const userData = JSON.parse(jsonData);
      return this.saveData(userData);
    } catch (e) {
      console.error('Error importing user data', e);
      return false;
    }
  }
};