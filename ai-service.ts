/**
 * AI Service Module
 * Handles integration with Claude and ChatGPT APIs
 */
const AIService = {
  // Current API key (for front-end demo only - move to backend in production)
  apiKeys: {
    claude: '',
    openai: ''
  },
  
  // Set API keys
  setApiKey: function(service, key) {
    this.apiKeys[service] = key;
    // Store encrypted or in session storage only
    sessionStorage.setItem(`${service}_api_key`, key);
    return this.testConnection(service);
  },
  
  // Get stored API key
  getApiKey: function(service) {
    return this.apiKeys[service] || sessionStorage.getItem(`${service}_api_key`) || '';
  },
  
  // Test API connection
  testConnection: async function(service) {
    const key = this.getApiKey(service);
    if (!key) return { success: false, message: 'No API key set' };
    
    try {
      if (service === 'claude') {
        // Simple Claude API test
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': key,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: "claude-3-opus-20240229",
            max_tokens: 20,
            messages: [
              { role: "user", content: "Hello, are you connected?" }
            ]
          })
        });
        
        const data = await response.json();
        return { 
          success: response.ok, 
          message: response.ok ? 'Connected to Claude' : data.error?.message || 'Connection failed'
        };
      } 
      else if (service === 'openai') {
        // Simple OpenAI API test
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`
          },
          body: JSON.stringify({
            model: "gpt-4o",
            max_tokens: 20,
            messages: [
              { role: "user", content: "Hello, are you connected?" }
            ]
          })
        });
        
        const data = await response.json();
        return { 
          success: response.ok, 
          message: response.ok ? 'Connected to OpenAI' : data.error?.message || 'Connection failed'
        };
      }
      
      return { success: false, message: 'Unknown service' };
    } catch (e) {
      console.error(`Error testing ${service} connection`, e);
      return { success: false, message: e.message };
    }
  },
  
  // Generate a new question using AI
  generateQuestion: async function(topic, difficulty = 'medium') {
    const service = Storage.getSection('settings').preferredAI || 'claude';
    const key = this.getApiKey(service);
    
    if (!key) {
      return { 
        success: false, 
        message: `No API key set for ${service}. Please add your API key in settings.` 
      };
    }
    
    try {
      let prompt = `Generate a 16-mark A-Level Psychology question for the topic "${topic}". 
The question should be at ${difficulty} difficulty level and follow AQA exam format.
Only return the question itself, no additional text.`;
      
      if (service === 'claude') {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': key,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: "claude-3-opus-20240229",
            max_tokens: 300,
            messages: [{ role: "user", content: prompt }]
          })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error?.message || 'Failed to generate question');
        }
        
        return {
          success: true,
          question: data.content[0].text,
          topic: topic,
          difficulty: difficulty,
          id: 'q_' + new Date().getTime()
        };
      } 
      else if (service === 'openai') {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`
          },
          body: JSON.stringify({
            model: "gpt-4o",
            max_tokens: 300,
            messages: [{ role: "user", content: prompt }]
          })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error?.message || 'Failed to generate question');
        }
        
        return {
          success: true,
          question: data.choices[0].message.content,
          topic: topic,
          difficulty: difficulty,
          id: 'q_' + new Date().getTime()
        };
      }
      
      return { success: false, message: 'Unknown AI service' };
    } catch (e) {
      console.error('Error generating question', e);
      return { success: false, message: e.message };
    }
  },
  
  // Evaluate a student answer using AI
  evaluateAnswer: async function(question, answer, markScheme) {
    const service = Storage.getSection('settings').preferredAI || 'claude';
    const key = this.getApiKey(service);
    
    if (!key) {