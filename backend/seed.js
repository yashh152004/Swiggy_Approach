import { Client } from '@opensearch-project/opensearch';
import fs from 'fs';

// 🔥 IMPORTANT: Use HTTPS + auth for OpenSearch 3.x
const client = new Client({
  node: 'https://localhost:9200',
  auth: {
    username: 'admin',
    password: 'Zx9#Kp!72LmQ' // 👈 replace this
  },
  ssl: {
    rejectUnauthorized: false
  }
});

const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
const INDEX_NAME = 'food_items';

async function seed() {
  try {
    console.log('Connecting to OpenSearch...');
    await client.ping();
    console.log('Connected ✅');

    // 1. Delete index safely (idempotent)
    try {
      await client.indices.delete({ index: INDEX_NAME });
      console.log('Old index deleted');
    } catch (err) {
      console.log('Index not found, continuing...');
    }

    // 2. Create index
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

    // 3. Index Data
    console.log('Indexing data...');
    const items = [...data.restaurants, ...data.dishes];
    const body = items.flatMap(doc => [
      { index: { _index: INDEX_NAME, _id: doc.id } },
      doc
    ]);

    const bulkResponse = await client.bulk({ refresh: true, body });

    if (bulkResponse.errors || (bulkResponse.body && bulkResponse.body.errors)) {
      console.log('Bulk errors:', bulkResponse.items || bulkResponse.body.items);
    } else {
      console.log('Data indexed successfully ✅');
    }

    // 4. Setup LTR Plugin
    console.log('Setting up OpenSearch LTR Plugin...');

    // Create LTR store
    try {
      await client.transport.request({
        method: 'PUT',
        path: '/_ltr'
      });
      console.log('LTR store created.');
    } catch (err) {
      console.log('LTR store already exists or skipped.');
    }

    // Feature Set
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
    } catch (err) {
      console.log('Feature set already exists or skipped.');
    }

    // 5. Upload Linear Model
    const linearModelStr = JSON.stringify({
      "title_match": 10.0,
      "cuisine_match": 5.0,
      "rating_score": 0.5,
      "popularity_score": 0.01
    });

    const modelConfig = {
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
        body: modelConfig
      });
      console.log('LTR model uploaded successfully.');
    } catch (err) {
      console.log('Model already exists or skipped.');
    }

    console.log('🎉 Seed completed successfully!');

  } catch (error) {
    console.error('Seed error:', error);
  }
}

seed();