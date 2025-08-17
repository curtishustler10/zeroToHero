#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const SUPABASE_URL = 'https://pholgvdcbktrmqvwxvqy.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBob2xndmRjYmt0cm1xdnd4dnF5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTMxODY5NCwiZXhwIjoyMDcwODk0Njk0fQ.LnroF6Xzq0UIFV6GdroKXGsFClg5AUTFKffTa1c3Rk0';

// Initialize Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Function to parse CSV content
function parseCSV(content) {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        if (inQuotes && line[j + 1] === '"') {
          current += '"';
          j++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    if (values.length === headers.length) {
      const row = {};
      headers.forEach((header, index) => {
        let value = values[index];
        
        // Remove surrounding quotes if present
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
        
        // Convert empty strings to null
        if (value === '') {
          value = null;
        }
        // Convert numeric strings to numbers
        else if (!isNaN(value) && value !== '' && !header.includes('id') && !header.includes('user_id')) {
          value = parseFloat(value);
        }
        // Convert boolean strings
        else if (value === 'true') {
          value = true;
        } else if (value === 'false') {
          value = false;
        }
        
        row[header] = value;
      });
      rows.push(row);
    }
  }
  
  return rows;
}

// Function to import data for a specific table
async function importTable(tableName) {
  const csvPath = path.join(__dirname, '..', 'data', 'csv-templates', `${tableName}.csv`);
  
  if (!fs.existsSync(csvPath)) {
    console.log(`❌ CSV file not found: ${csvPath}`);
    return false;
  }
  
  try {
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const data = parseCSV(csvContent);
    
    if (data.length === 0) {
      console.log(`⚠️  No data found in ${tableName}.csv`);
      return true;
    }
    
    console.log(`📥 Importing ${data.length} records to ${tableName}...`);
    
    // For tables with auto-incrementing IDs, remove the ID field
    const tablesWithAutoId = ['days', 'habits', 'habit_logs', 'content_logs', 'deepwork_logs', 'social_reps', 'workouts', 'sleep_logs', 'leads', 'outreach_logs', 'deals', 'stories', 'events', 'prompts'];
    
    if (tablesWithAutoId.includes(tableName)) {
      data.forEach(row => {
        if ('id' in row) delete row.id;
      });
    }
    
    const { data: insertedData, error } = await supabase
      .from(tableName)
      .insert(data);
    
    if (error) {
      console.error(`❌ Error importing ${tableName}:`, error.message);
      return false;
    }
    
    console.log(`✅ Successfully imported ${data.length} records to ${tableName}`);
    return true;
  } catch (error) {
    console.error(`❌ Error processing ${tableName}:`, error.message);
    return false;
  }
}

// Main import function
async function importAllData() {
  console.log('🚀 Starting CSV data import to Supabase...\n');
  
  // Import order matters due to foreign key constraints
  const importOrder = [
    'profiles',      // Users first
    'prompts',       // No dependencies
    'days',          // Depends on profiles
    'habits',        // Depends on profiles
    'habit_logs',    // Depends on habits
    'content_logs',  // Depends on profiles
    'deepwork_logs', // Depends on profiles
    'social_reps',   // Depends on profiles
    'workouts',      // Depends on profiles
    'sleep_logs',    // Depends on profiles
    'leads',         // Depends on profiles
    'outreach_logs', // Depends on leads
    'deals',         // Depends on leads
    'stories',       // Depends on profiles
    'events'         // Depends on profiles
  ];
  
  let successCount = 0;
  let failCount = 0;
  
  for (const tableName of importOrder) {
    const success = await importTable(tableName);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
    
    // Small delay between imports
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n📊 Import Summary:');
  console.log(`✅ Successful: ${successCount} tables`);
  console.log(`❌ Failed: ${failCount} tables`);
  
  if (failCount === 0) {
    console.log('\n🎉 All data imported successfully!');
    console.log('🔗 Check your Supabase dashboard to verify the data.');
  } else {
    console.log('\n⚠️  Some imports failed. Check the errors above.');
  }
}

// Test connection first
async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Connection test failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    return false;
  }
}

// Run the import
async function run() {
  console.log('🔗 Testing Supabase connection...');
  
  const connected = await testConnection();
  if (!connected) {
    console.log('❌ Cannot connect to Supabase. Please check your credentials.');
    process.exit(1);
  }
  
  console.log('');
  await importAllData();
}

// Execute if called directly
if (require.main === module) {
  run().catch(console.error);
}

module.exports = { importAllData, importTable };
