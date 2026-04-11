import { Client } from '@opensearch-project/opensearch';
import fs from 'fs';

const client = new Client({
  node: 'http://localhost:9200',
});

const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
const INDEX_NAME = 'food_items';

async function seed() {
  try {
    console.log('Connecting to OpenSearch...');
    const ping = await client.ping();
    if (!ping) throw new Error('OpenSearch not reachable');
    
    // 1. Create index
    const exists = await client.indices.exists({ index: INDEX_NAME });
    if (exists.body || exists) {
      console.log('Deleting existing index...');
      await client.indices.delete({ index: INDEX_NAME });
    }

    console.log('Creating index...');
    await client.indices.create({
      index: INDEX_NAME,
      body: {
        settings: {
          number_of_shards: 1,
          number_of_replicas: 0
        },
        mappings: {
          properties: {
            id: { type: 'keyword' },
            type: { type: 'keyword' },
            name: { type: 'text' },
            cuisine: { type: 'text' },
            restaurant_name: { type: 'text' },
            rating: { type: 'float' },
            popularity: { type: 'integer' },
            restaurant_id: { type: 'keyword' }
          }
        }
      }
    });

    // 2. Index Data
    console.log('Indexing data...');
    const items = [...data.restaurants, ...data.dishes];
    const body = items.flatMap(doc => [{ index: { _index: INDEX_NAME, _id: doc.id } }, doc]);
    const bulkResponse = await client.bulk({ refresh: true, body });
    if (bulkResponse.body && bulkResponse.body.errors) {
       console.log('Bulk errors:', bulkResponse.body.items);
    }

    // 3. Setup LTR Plugin
    console.log('Setting up OpenSearch LTR Plugin...');
    
    // Initialize LTR store
    try {
      await client.transport.request({
        method: 'PUT',
        path: '/_ltr',
      });
      console.log('LTR store created.');
    } catch (err) {
      if (err.meta && err.meta.statusCode === 400 && err.message.includes('already exists')) {
        console.log('LTR store already exists.');
      } else {
        console.warn('LTR store creation warning (maybe exists):', err.message);
      }
    }

    // Define Feature Set
    const featureSet = {
      featureset: {
        features: [
          {
            name: "title_match",
            params: ["keywords"],
            template: {
              match: { name: "{{keywords}}" }
            }
          },
          {
            name: "cuisine_match",
            params: ["keywords"],
            template: {
              match: { cuisine: "{{keywords}}" }
            }
          },
          {
            name: "rating_score",
            params: [],
            template: {
              function_score: {
                query: { match_all: {} },
                field_value_factor: { field: "rating", missing: 0 }
              }
            }
          },
          {
            name: "popularity_score",
            params: [],
            template: {
              function_score: {
                query: { match_all: {} },
                field_value_factor: { field: "popularity", missing: 0 }
              }
            }
          }
        ]
      }
    };

    // Upload Feature Set
    try {
      await client.transport.request({
        method: 'POST',
        path: '/_ltr/_featureset/food_features',
        body: featureSet
      });
      console.log('Feature set uploaded.');
    } catch(err) {
      console.log('Feature set already exists or error:', err.message);
    }

    // Mock Training Data: Usually you extract features using _sltr on your judgments and then train an XGBoost or RankLib model.
    // For this demo, we'll assign a custom linear model!
    const linearModelStr = JSON.stringify({
      "title_match": 10.0,
      "cuisine_match": 5.0,
      "rating_score": 0.5,
      "popularity_score": 0.01
    });

    const linearModelConfig = {
      model: {
        name: "swiggy_ltr_model",
        model: {
          type: "model/linear",
          definition: linearModelStr
        }
      }
    };

    try {
      await client.transport.request({
        method: 'POST',
        path: '/_ltr/_featureset/food_features/_createmodel',
        body: linearModelConfig
      });
      console.log('LTR model uploaded successfully.');
    } catch(err) {
      console.log('Model already exists or error:', err.message);
      if(err.meta && err.meta.body && err.meta.body.error) {
         console.log(err.meta.body.error);
      }
    }

    console.log('Seed completed successfully!');

  } catch (error) {
    console.error('Seed error:', error);
  }
}

seed();
