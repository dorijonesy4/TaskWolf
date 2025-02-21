// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");

  // Get first 100 articles
  const articles = [];
  let currentPage = 1;
  
  while (articles.length < 100) {
    // Get all article rows on current page
    const rows = await page.locator('tr.athing').all();
    
    for (const row of rows) {
      if (articles.length >= 100) break;
      
      // Get timestamp from the following sibling row
      const timestamp = await row.locator('xpath=./following-sibling::tr[1]').locator('.age').getAttribute('title');
      const date = new Date(timestamp);
      
      articles.push({
        id: await row.getAttribute('id'),
        timestamp: date
      });
    }

    if (articles.length < 100) {
      currentPage++;
      await page.click('a.morelink');
      await page.waitForLoadState('networkidle');
    }
  }

  // Validate articles are sorted newest to oldest
  for (let i = 1; i < articles.length; i++) {
    const current = articles[i].timestamp;
    const previous = articles[i-1].timestamp;
    
    if (current > previous) {
      throw new Error(`Articles not properly sorted at index ${i}. Article ${articles[i].id} is newer than ${articles[i-1].id}`);
    }
  }

  console.log("Successfully validated first 100 articles are sorted from newest to oldest");
  
  // await browser.close();
}

(async () => {
  await sortHackerNewsArticles();
})();
