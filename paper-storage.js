/**
 * Past Paper Storage Service
 * Handles storage and retrieval of scraped past papers
 */

const PaperStorage = {
  /**
   * Store a past paper
   * @param {Object} paper - Paper data to store
   * @returns {Promise<void>}
   */
  async storePaper(paper) {
    try {
      // Store in IndexedDB for offline access
      const db = await this.getDB();
      await db.put('papers', paper);
      
      // Also store in localStorage for quick access
      const papers = this.getLocalPapers();
      papers[paper.url] = paper;
      localStorage.setItem('papers', JSON.stringify(papers));
    } catch (error) {
      console.error('Error storing paper:', error);
      throw error;
    }
  },

  /**
   * Get a paper by URL
   * @param {string} url - Paper URL
   * @returns {Promise<Object|null>}
   */
  async getPaper(url) {
    try {
      // Check localStorage first
      const papers = this.getLocalPapers();
      if (papers[url]) {
        return papers[url];
      }
      
      // Then check IndexedDB
      const db = await this.getDB();
      return await db.get('papers', url);
    } catch (error) {
      console.error('Error getting paper:', error);
      return null;
    }
  },

  /**
   * Get all stored papers
   * @returns {Promise<Array<Object>>}
   */
  async getAllPapers() {
    try {
      const db = await this.getDB();
      return await db.getAll('papers');
    } catch (error) {
      console.error('Error getting all papers:', error);
      return [];
    }
  },

  /**
   * Get papers by year
   * @param {string} year - Year to filter by
   * @returns {Promise<Array<Object>>}
   */
  async getPapersByYear(year) {
    const papers = await this.getAllPapers();
    return papers.filter(p => p.year === year);
  },

  /**
   * Get papers by type (Question Paper or Mark Scheme)
   * @param {string} type - Type to filter by
   * @returns {Promise<Array<Object>>}
   */
  async getPapersByType(type) {
    const papers = await this.getAllPapers();
    return papers.filter(p => p.type === type);
  },

  /**
   * Delete a paper
   * @param {string} url - Paper URL to delete
   * @returns {Promise<void>}
   */
  async deletePaper(url) {
    try {
      // Delete from IndexedDB
      const db = await this.getDB();
      await db.delete('papers', url);
      
      // Delete from localStorage
      const papers = this.getLocalPapers();
      delete papers[url];
      localStorage.setItem('papers', JSON.stringify(papers));
    } catch (error) {
      console.error('Error deleting paper:', error);
      throw error;
    }
  },

  /**
   * Get papers from localStorage
   * @returns {Object}
   */
  getLocalPapers() {
    try {
      return JSON.parse(localStorage.getItem('papers') || '{}');
    } catch (error) {
      console.error('Error getting local papers:', error);
      return {};
    }
  },

  /**
   * Initialize IndexedDB
   * @returns {Promise<IDBDatabase>}
   */
  async getDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('ExamAI', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('papers')) {
          db.createObjectStore('papers', { keyPath: 'url' });
        }
      };
    });
  }
};

// Export the service
export default PaperStorage; 