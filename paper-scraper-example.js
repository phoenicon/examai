/**
 * Example usage of the AQA Past Paper Scraper
 */

import ScraperService from './scraper-service.js';
import PaperStorage from './paper-storage.js';

// Example function to scrape and store papers
async function scrapeAndStorePapers() {
  try {
    // Initialize the scraper
    ScraperService.init({
      rateLimit: {
        requestsPerMinute: 20, // Be conservative with rate limiting
        delayBetweenRequests: 3000 // 3 seconds between requests
      }
    });

    // Scrape papers from 2023
    console.log('Starting to scrape 2023 papers...');
    const papers = await ScraperService.scrapePastPapers({
      year: '2023'
    });

    // Store each paper
    for (const paper of papers) {
      console.log(`Storing paper: ${paper.year} ${paper.paper}`);
      await PaperStorage.storePaper(paper);
    }

    console.log('Scraping complete!');
    return papers;
  } catch (error) {
    console.error('Error in scraping process:', error);
    throw error;
  }
}

// Example function to retrieve stored papers
async function getStoredPapers() {
  try {
    // Get all papers
    const allPapers = await PaperStorage.getAllPapers();
    console.log('Total papers stored:', allPapers.length);

    // Get papers by year
    const papers2023 = await PaperStorage.getPapersByYear('2023');
    console.log('2023 papers:', papers2023.length);

    // Get papers by type
    const questionPapers = await PaperStorage.getPapersByType('Question Paper');
    const markSchemes = await PaperStorage.getPapersByType('Mark Scheme');
    console.log('Question papers:', questionPapers.length);
    console.log('Mark schemes:', markSchemes.length);

    return {
      allPapers,
      papers2023,
      questionPapers,
      markSchemes
    };
  } catch (error) {
    console.error('Error retrieving papers:', error);
    throw error;
  }
}

// Example usage
async function main() {
  try {
    // First, scrape and store papers
    await scrapeAndStorePapers();
    
    // Then, retrieve and display stored papers
    const storedPapers = await getStoredPapers();
    
    // Display some statistics
    console.log('\nScraping Statistics:');
    console.log('-------------------');
    console.log(`Total papers stored: ${storedPapers.allPapers.length}`);
    console.log(`2023 papers: ${storedPapers.papers2023.length}`);
    console.log(`Question papers: ${storedPapers.questionPapers.length}`);
    console.log(`Mark schemes: ${storedPapers.markSchemes.length}`);
    
  } catch (error) {
    console.error('Error in main process:', error);
  }
}

// Run the example
main(); 