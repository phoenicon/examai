/**
 * AI Service Module
 * This module handles all interactions with AI services (Claude and ChatGPT)
 * It provides functionality for generating questions and evaluating answers
 * 
 * Key features:
 * - API key management
 * - Connection testing
 * - Question generation
 * - Answer evaluation
 */
const AIService = {
  /**
   * Stores API keys for different AI services
   * Note: In a production environment, these should be stored securely on the backend
   * and never exposed to the frontend
   */
  apiKeys: {
    claude: '',
    openai: ''
  },
  
  /**
   * Sets an API key for a specific service
   * @param {string} service - The AI service ('claude' or 'openai')
   * @param {string} key - The API key to set
   * @returns {Promise} - Result of testing the connection with the new key
   */
  setApiKey: function(service, key) {
    this.apiKeys[service] = key;
    // Store in session storage for persistence across page refreshes
    // Note: This is not secure for production use
    sessionStorage.setItem(`${service}_api_key`, key);
    return this.testConnection(service);
  },
  
  /**
   * Retrieves the API key for a service
   * Checks both memory and session storage
   * @param {string} service - The AI service to get the key for
   * @returns {string} - The API key or empty string if not found
   */
  getApiKey: function(service) {
    return this.apiKeys[service] || sessionStorage.getItem(`${service}_api_key`) || '';
  },
  
  /**
   * Tests the connection to an AI service
   * Makes a simple API call to verify the key works
   * @param {string} service - The AI service to test
   * @returns {Promise<Object>} - Connection test result
   */
  testConnection: async function(service) {
    const key = this.getApiKey(service);
    if (!key) return { success: false, message: 'No API key set' };
    
    try {
      if (service === 'claude') {
        // Claude API test - sends a simple "Hello" message
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': key,
            'anthropic-version': '2023-06-01'  // Claude API version
          },
          body: JSON.stringify({
            model: "claude-3-opus-20240229",  // Latest Claude model
            max_tokens: 20,  // Limit response length for test
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
        // OpenAI API test - similar simple test
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`  // OpenAI uses Bearer token auth
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
  
  /**
   * Generates a new A-Level Psychology question using AI
   * @param {string} topic - The psychology topic to generate a question for
   * @param {string} difficulty - Question difficulty level (default: 'medium')
   * @returns {Promise<Object>} - Generated question or error
   */
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
      // Construct the prompt for question generation
      let prompt = `Generate a 16-mark A-Level Psychology question for the topic "${topic}". 
The question should be at ${difficulty} difficulty level and follow AQA exam format.
Only return the question itself, no additional text.`;
      
      if (service === 'claude') {
        // Call Claude API for question generation
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': key,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: "claude-3-opus-20240229",
            max_tokens: 300,  // Allow for longer question generation
            messages: [{ role: "user", content: prompt }]
          })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error?.message || 'Failed to generate question');
        }
        
        // Return structured question data
        return {
          success: true,
          question: data.content[0].text,
          topic: topic,
          difficulty: difficulty,
          id: 'q_' + new Date().getTime()  // Unique identifier for the question
        };
      } 
      else if (service === 'openai') {
        // Similar process for OpenAI
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
  
  /**
   * Evaluates a student's answer using AI
   * @param {string} question - The original question
   * @param {string} answer - The student's answer to evaluate
   * @param {string} markScheme - The marking criteria
   * @returns {Promise<Object>} - Evaluation results or error
   */
  evaluateAnswer: async function(question, answer, markScheme) {
    const service = Storage.getSection('settings').preferredAI || 'claude';
    const key = this.getApiKey(service);
    
    if (!key) {
      return { 
        success: false, 
        message: `No API key set for ${service}. Please add your API key in settings.` 
      };
    }
    
    try {
      // Construct a detailed prompt for answer evaluation
      let prompt = `Evaluate this A-Level Psychology answer to the following 16-mark question:
      
Question: ${question}

Student Answer:
${answer}

Mark Scheme Criteria:
${markScheme}

Please provide:
1. Total mark out of 16
2. Breakdown of marks for AO1 (knowledge), AO2 (application), and AO3 (evaluation)
3. 2-3 strengths of the answer
4. 2-3 suggestions for improvement
5. A brief model paragraph showing how one part could be improved`;
      
      if (service === 'claude') {
        // Call Claude API for answer evaluation
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': key,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: "claude-3-opus-20240229",
            max_tokens: 1000,  // Allow for detailed evaluation
            messages: [{ role: "user", content: prompt }]
          })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error?.message || 'Failed to evaluate answer');
        }
        
        return {
          success: true,
          evaluation: data.content[0].text,
        };
      } 
      else if (service === 'openai') {
        // Similar process for OpenAI
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`
          },
          body: JSON.stringify({
            model: "gpt-4o",
            max_tokens: 1000,
            messages: [{ role: "user", content: prompt }]
          })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error?.message || 'Failed to evaluate answer');
        }
        
        return {
          success: true,
          evaluation: data.choices[0].message.content,
        };
      }
      
      return { success: false, message: 'Unknown AI service' };
    } catch (e) {
      console.error('Error evaluating answer', e);
      return { success: false, message: e.message };
    }
  }
};