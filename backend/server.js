import express from 'express';
import cors from 'cors';
import { Client } from '@opensearch-project/opensearch';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const client = new Client({
  node: 'http://localhost:9200',
});

const INDEX_NAME = 'food_items';

app.get('/api/restaurants', async (req, res) => {
  try {
    const { body } = await client.search({
      index: INDEX_NAME,
      body: {
        query: { match: { type: 'restaurant' } },
        sort: [{ popularity: { order: 'desc' } }],
        size: 50
      }
    });
    
    // Support newer and older OpenSearch js client outputs
    const hits = body ? body.hits.hits : req.hits.hits; 
    let results = [];
    if (body) {
        results = body.hits.hits.map(h => h._source);
    } else {
        // if using direct destructuring wait... OpenSearch client `search` returns result directly or in `.body`
        // OpenSearch 2.x JS client returns response in `body`. Let's just use await client.search()
    }
    
    // A safer way for compatibility
    const response = await client.search({
      index: INDEX_NAME,
      body: {
        query: { match: { type: 'restaurant' } },
        sort: [{ popularity: { order: 'desc' } }],
        size: 50
      }
    });
    
    const hitsArray = response.body ? response.body.hits.hits : response.hits.hits;
    res.json(hitsArray.map(hit => hit._source));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/search', async (req, res) => {
  const { q, mode } = req.query;
  if (!q) return res.json([]);

  const useLTR = mode === 'ltr';

  try {
    let queryBody;

    if (!useLTR) {
      // Phase 1: Heuristic Ranking (Baseline)
      // Function score using BM25 text match + popularity and rating boosts
      queryBody = {
        query: {
          function_score: {
            query: {
              multi_match: {
                query: q,
                fields: ['name^3', 'cuisine^2', 'restaurant_name^1'],
                fuzziness: 'AUTO'
              }
            },
            functions: [
              { field_value_factor: { field: "popularity", modifier: "log1p", factor: 1.5 } },
              { field_value_factor: { field: "rating", modifier: "square", factor: 1.2 } }
            ],
            boost_mode: "multiply"
          }
        },
        size: 8
      };
    } else {
      // Phase 2: ML-Based Ranking (LTR)
      // Base query to retrieve candidate documents, then rescore using LTR model
      queryBody = {
        query: {
          multi_match: {
             query: q,
             fields: ['name', 'cuisine', 'restaurant_name'],
             fuzziness: 'AUTO'
          }
        },
        rescore: {
          window_size: 100,
          query: {
            rescore_query: {
              sltr: {
                params: { keywords: q },
                model: "swiggy_ltr_model"
              }
            }
          }
        },
        size: 8
      };
    }

    const response = await client.search({
      index: INDEX_NAME,
      body: queryBody
    });

    const hitsArray = response.body ? response.body.hits.hits : response.hits.hits;
    
    const results = hitsArray.map(hit => ({
      ...hit._source,
      score: hit._score // the score from OpenSearch
    }));

    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
