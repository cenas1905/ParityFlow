import { NextResponse } from 'next/server';
import { ApifyClient } from 'apify-client';

// Initialize the ApifyClient with API token
// process.env.APIFY_API_TOKEN should be set in .env.local
const client = new ApifyClient({
  token: process.env.APIFY_API_TOKEN || 'dummy-token-for-build',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { targetUrl } = body;

    if (!targetUrl) {
      return NextResponse.json({ error: 'targetUrl is required' }, { status: 400 });
    }

    if (!process.env.APIFY_API_TOKEN) {
      return NextResponse.json({ 
        error: 'Apify integration is not fully configured yet. Missing APIFY_API_TOKEN.' 
      }, { status: 501 });
    }

    // Prepare Actor input
    // We are using the standard Web Scraper actor (apify/web-scraper)
    const input = {
        startUrls: [{ url: targetUrl }],
        pageFunction: `async function pageFunction(context) {
            const $ = context.jQuery;
            // A basic heuristic to find price tags
            // In a real scenario, this would be tailored to the competitor's DOM structure
            const priceText = $('span:contains("$"), div:contains("$")').text();
            const numbers = priceText.match(/\\$?[0-9]+(?:\\.[0-9]{2})?/);
            return {
                url: context.request.url,
                title: $('title').text(),
                price: numbers ? numbers[0] : 'Not found'
            };
        }`
    };

    // Run the Actor and wait for it to finish
    const run = await client.actor('apify/web-scraper').call(input);

    // Fetch and print Actor results from the run's dataset
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error('Error running Apify scraper:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
