// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");

  // Get first 60 articles across 2 pages
  const articles = [];
  let currentPage = 1;
  
  while (articles.length < 60 && currentPage <= 2) {
    // Get all article rows on current page
    const rows = await page.locator('tr.athing').all();
    
    for (const row of rows) {
      if (articles.length >= 60) break;
      
      // Get timestamp from the following sibling row
      const timestamp = await row.locator('xpath=./following-sibling::tr[1]').locator('.age').getAttribute('title');
      const title = await row.locator('.titleline > a:first-child').textContent();
      const date = new Date(timestamp);
      
      articles.push({
        title: title,
        timestamp: date
      });
    }

    if (articles.length < 60 && currentPage < 2) {
      currentPage++;
      await page.click('a.morelink');
      await page.waitForLoadState('networkidle');
    }
  }

  // Check if articles are sorted newest to oldest
  let isSorted = true;
  for (let i = 1; i < articles.length; i++) {
    const current = articles[i].timestamp;
    const previous = articles[i-1].timestamp;
    
    if (current > previous) {
      isSorted = false;
      break;
    }
  }

  if (isSorted) {
    console.log("Success: Articles are correctly sorted from newest to oldest!");
  } else {
    console.log("Error: Articles are not properly sorted. Here is the correct order:");
  }

  // Sort and display all articles regardless of sort status
  console.log("\nList of 60 newest articles:");
  console.log("----------------------------");
  const sortedArticles = [...articles].sort((a, b) => b.timestamp - a.timestamp);
  sortedArticles.forEach((article, index) => {
    console.log(`${index + 1}. ${article.title}`);
  });

  await browser.close();
}

(async () => {
  await sortHackerNewsArticles();
})();