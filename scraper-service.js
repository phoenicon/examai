/**
 * AQA Past Paper Scraper Service
 * This module handles scraping of AQA past papers and mark schemes
 * Includes rate limiting and proper error handling
 */

const ScraperService = {
  // Configuration
  config: {
    baseUrl: 'https://www.aqa.org.uk/subjects/psychology/as-and-a-level/psychology-7181-7182',
    rateLimit: {
      requestsPerMinute: 30,
      delayBetweenRequests: 2000 // 2 seconds
    },
    headers: {
      'User-Agent': 'ExamAI/1.0 (Educational Tool)',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    }
  },

  // Cache for storing scraped data
  cache: new Map(),

  /**
   * Initialize the scraper with configuration
   * @param {Object} options - Configuration options
   */
  init: function(options = {}) {
    this.config = { ...this.config, ...options };
  },

  /**
   * Add delay between requests to respect rate limiting
   * @returns {Promise} - Promise that resolves after delay
   */
  async delay() {
    return new Promise(resolve => setTimeout(resolve, this.config.rateLimit.delayBetweenRequests));
  },

  /**
   * Fetch a URL with proper error handling and retries
   * @param {string} url - URL to fetch
   * @param {number} retries - Number of retry attempts
   * @returns {Promise<string>} - HTML content
   */
  async fetchWithRetry(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        await this.delay();
        const response = await fetch(url, {
          headers: this.config.headers
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.text();
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  },

  /**
   * Parse HTML content to extract past paper links
   * @param {string} html - HTML content
   * @returns {Array<Object>} - Array of paper objects
   */
  parsePastPapers(html) {
    const papers = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Find all past paper links
    const links = doc.querySelectorAll('a[href*="/past-papers"]');
    
    links.forEach(link => {
      const href = link.href;
      const title = link.textContent.trim();
      
      // Extract paper details from title
      const match = title.match(/(\d{4})\s+(Paper\s+\d)\s+(Question\s+Paper|Mark\s+Scheme)/i);
      if (match) {
        papers.push({
          year: match[1],
          paper: match[2],
          type: match[3],
          url: href
        });
      }
    });
    
    return papers;
  },

  /**
   * Download and process a past paper
   * @param {Object} paper - Paper object with URL and details
   * @returns {Promise<Object>} - Processed paper data
   */
  async processPaper(paper) {
    try {
      const html = await this.fetchWithRetry(paper.url);
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Extract questions and answers
      const questions = [];
      const questionElements = doc.querySelectorAll('.question-content');
      
      questionElements.forEach((element, index) => {
        questions.push({
          number: index + 1,
          content: element.textContent.trim(),
          marks: this.extractMarks(element),
          type: this.determineQuestionType(element)
        });
      });
      
      return {
        ...paper,
        questions,
        processedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error processing paper: ${paper.url}`, error);
      return {
        ...paper,
        error: error.message
      };
    }
  },

  /**
   * Extract marks from question element
   * @param {Element} element - Question element
   * @returns {number} - Number of marks
   */
  extractMarks(element) {
    const marksMatch = element.textContent.match(/(\d+)\s+marks?/i);
    return marksMatch ? parseInt(marksMatch[1]) : 0;
  },

  /**
   * Determine question type from content
   * @param {Element} element - Question element
   * @returns {string} - Question type
   */
  determineQuestionType(element) {
    const content = element.textContent.toLowerCase();
    if (content.includes('evaluate')) return 'evaluation';
    if (content.includes('discuss')) return 'discussion';
    if (content.includes('explain')) return 'explanation';
    if (content.includes('describe')) return 'description';
    return 'other';
  },

  /**
   * Main function to scrape past papers
   * @param {Object} options - Scraping options
   * @returns {Promise<Array<Object>>} - Array of processed papers
   */
  async scrapePastPapers(options = {}) {
    try {
      // Fetch main page
      const html = await this.fetchWithRetry(this.config.baseUrl);
      const papers = this.parsePastPapers(html);
      
      // Filter papers based on options
      let filteredPapers = papers;
      if (options.year) {
        filteredPapers = papers.filter(p => p.year === options.year);
      }
      if (options.paper) {
        filteredPapers = papers.filter(p => p.paper === options.paper);
      }
      
      // Process papers
      const processedPapers = [];
      for (const paper of filteredPapers) {
        const processed = await this.processPaper(paper);
        processedPapers.push(processed);
        
        // Cache the result
        this.cache.set(paper.url, processed);
      }
      
      return processedPapers;
    } catch (error) {
      console.error('Error scraping past papers:', error);
      throw error;
    }
  },

  /**
   * Get cached paper data
   * @param {string} url - Paper URL
   * @returns {Object|null} - Cached paper data
   */
  getCachedPaper(url) {
    return this.cache.get(url) || null;
  },

  /**
   * Clear the cache
   */
  clearCache() {
    this.cache.clear();
  }
};

// Export the service
export default ScraperService; 