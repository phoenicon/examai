/**
 * Main Application
 * Initializes and coordinates the Psychology Revision System
 */
document.addEventListener('DOMContentLoaded', function() {
  // Initialize components
  Storage.init();
  if (SessionTracker.recoverSession()) {
    console.log('Recovered previous session');
    updateSessionUI();
  }
  
  // Load user preferences
  loadUserPreferences();
  
  // Set up UI
  setupEventListeners();
  renderTopics();
  
  // Check for API keys
  checkAPISetup();
});

// Load and apply user preferences
function loadUserPreferences() {
  const settings = Storage.getSection('settings');
  
  // Apply dark mode if enabled
  if (settings.darkMode) {
    document.body.classList.add('dark-mode');
    document.getElementById('darkModeToggle').checked = true;
  }
  
  // Apply text size
  if (settings.textSize) {
    document.body.classList.add(`text-${settings.textSize}`);
    document.querySelector(`input[name="textSize"][value="${settings.textSize}"]`).checked = true;
  }
  
  // Set email if available
  if (settings.email) {
    document.getElementById('userEmail').value = settings.email;
  }
}

// Set up event listeners for UI interactions
function setupEventListeners() {
  // Start new session button
  document.getElementById('startSessionBtn').addEventListener('click', function() {
    if (SessionTracker.activities.length > 0) {
      if (confirm('This will end your current session. Continue?')) {
        endCurrentSession();
        startNewSession();
      }
    } else {
      startNewSession();
    }
  });
  
  // End session button
  document.getElementById('endSessionBtn').addEventListener('click', function() {
    endCurrentSession();
  });
  
  // Settings toggles
  document.getElementById('darkModeToggle').addEventListener('change', function(e) {
    document.body.classList.toggle('dark-mode', e.target.checked);
    Storage.updateSection('settings', {darkMode: e.target.checked});
  });
  
  // Text size radio buttons
  document.querySelectorAll('input[name="textSize"]').forEach(radio => {
    radio.addEventListener('change', function(e) {
      // Remove all text size classes
      document.body.classList.remove('text-small', 'text-medium', 'text-large');
      // Add selected class
      document.body.classList.add(`text-${e.target.value}`);
      Storage.updateSection('settings', {textSize: e.target.value});
    });
  });
  
  // Save email
  document.getElementById('saveEmailBtn').addEventListener('click', function() {
    const email = document.getElementById('userEmail').value;
    Storage.updateSection('settings', {email: email});
    alert('Email saved successfully!');
  });
  
  // API key setup
  document.getElementById('saveAPIKeysBtn').addEventListener('click', async function() {
    const claudeKey = document.getElementById('claudeAPIKey').value;
    const openaiKey = document.getElementById('openaiAPIKey').value;
    
    // Test connections
    if (claudeKey) {
      const claudeStatus = await AIService.setApiKey('claude', claudeKey);
      updateAPIStatus('claude', claudeStatus.success, claudeStatus.message);
    }
    
    if (openaiKey) {
      const openaiStatus = await AIService.setApiKey('openai', openaiKey);
      updateAPIStatus('openai', openaiStatus.success, openaiStatus.message);
    }
  });
  
  // Topic selection
  document.getElementById('topicSelector').addEventListener('change', function(e) {
    const topicId = e.target.value;
    if (topicId) {
      renderTopicContent(topicId);
      // Log activity
      SessionTracker.logActivity('topic_selection', {
        topic: topicId,
        action: 'select'
      });
      // Update user data
      Storage.updateSection('progress', {lastViewed: topicId});
    }
  });
  
  // Generate question button
  document.getElementById('generateQuestionBtn').addEventListener('click', async function() {
    const topicId = document.getElementById('topicSelector').value;
    const difficulty = document.querySelector('input[name="difficulty"]:checked').value;
    
    if (!topicId) {
      alert('Please select a topic first');
      return;
    }
    
    // Show loading state
    const btn = this;
    btn.disabled = true;
    btn.textContent = 'Generating...';
    
    const result = await AIService.generateQuestion(topicId, difficulty);
    
    // Reset button
    btn.disabled = false;
    btn.textContent = 'Generate Question';
    
    if (result.success) {
      renderQuestion(result);
      // Log activity
      SessionTracker.logActivity('question_generation', {
        topic: topicId,
        difficulty: difficulty,
        questionId: result.id
      });
    } else {
      alert(`Error: ${result.message}`);
    }
  });
  
  // Answer template selection
  document.getElementById('templateSelector').addEventListener('change