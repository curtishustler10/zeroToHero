# CSV Database Templates for Sprint Coach

This directory contains CSV template files for all database tables in the Sprint Coach application. These templates can be used for:

- **Data Import**: Import sample data into your Supabase database
- **Testing**: Populate your development environment with realistic test data
- **Data Migration**: Transfer data between environments
- **Backup/Restore**: Create data backups in CSV format

## File Structure

### Core User Data
- `profiles.csv` - User profiles and basic information
- `days.csv` - Daily log entries with mood and notes

### Habit Tracking
- `habits.csv` - User-defined habits and targets
- `habit_logs.csv` - Daily habit completion records

### Content & Productivity
- `content_logs.csv` - Social media posts, videos, articles created
- `deepwork_logs.csv` - Deep work sessions with time tracking
- `social_reps.csv` - Daily social interactions and networking

### Health & Wellness
- `workouts.csv` - Exercise sessions and fitness activities
- `sleep_logs.csv` - Sleep duration and quality tracking

### Business & Sales
- `leads.csv` - Potential clients and business contacts
- `outreach_logs.csv` - Communication attempts and outcomes
- `deals.csv` - Closed sales and revenue tracking

### Storytelling & Content
- `stories.csv` - Story drafts using different archetypes
- `prompts.csv` - Motivational prompts and AI system messages

### Analytics
- `events.csv` - User action tracking for analytics

## Data Types & Formats

### Date Formats
- **Dates**: Use `YYYY-MM-DD` format (e.g., `2024-01-01`)
- **Timestamps**: Use ISO 8601 format with timezone (e.g., `2024-01-01T10:00:00Z`)

### UUID Format
- **User IDs**: Use UUID format (e.g., `550e8400-e29b-41d4-a716-446655440000`)

### Numeric Values
- **Decimals**: Use standard decimal notation (e.g., `5000.00`)
- **Integers**: Use whole numbers (e.g., `120`)

### Text Fields
- **Quotes**: Escape quotes in CSV using double quotes (`""`)
- **Commas**: Values with commas should be wrapped in quotes
- **Line breaks**: Use `\n` for line breaks within fields

## Sample Data Overview

The template files include realistic sample data for two users:
- **John Doe** (`550e8400-e29b-41d4-a716-446655440000`): Productivity-focused user
- **Jane Smith** (`550e8400-e29b-41d4-a716-446655440001`): Business growth-focused user

## Importing Data

### Using Supabase Dashboard
1. Navigate to your Supabase project dashboard
2. Go to Table Editor
3. Select the target table
4. Click "Insert" → "Import data from CSV"
5. Upload the corresponding CSV file

### Using SQL
```sql
-- Example for importing habits
COPY habits(user_id, name, target, unit, is_active, sort_order, created_at)
FROM '/path/to/habits.csv'
DELIMITER ','
CSV HEADER;
```

### Using Supabase CLI
```bash
# Import all tables (modify paths as needed)
for table in profiles days habits habit_logs content_logs deepwork_logs social_reps workouts sleep_logs leads outreach_logs deals stories events prompts; do
  supabase db import --table $table --file ./data/csv-templates/$table.csv
done
```

## Data Relationships

### Key Relationships
- `profiles.id` → `auth.users.id` (1:1)
- `habits.user_id` → `profiles.id` (many:1)
- `habit_logs.habit_id` → `habits.id` (many:1)
- `leads.user_id` → `profiles.id` (many:1)
- `outreach_logs.lead_id` → `leads.id` (many:1)
- `deals.lead_id` → `leads.id` (many:1)

### Important Notes
- Ensure user IDs exist in the `profiles` table before importing related data
- Habit IDs must exist before importing `habit_logs`
- Lead IDs must exist before importing `outreach_logs` and `deals`

## Customization

To customize the templates for your needs:

1. **Modify User Data**: Update the sample user IDs and information
2. **Add More Records**: Extend the CSV files with additional sample data
3. **Adjust Dates**: Update dates to match your testing timeline
4. **Change Values**: Modify numeric values to match your business context

## Validation Rules

### Required Fields
- All `user_id` fields must reference existing users
- Dates must be in valid format
- Numeric constraints (e.g., mood: 1-5, priority: 1-5)

### Constraints
- `mood`: Must be between 1 and 5
- `priority`: Must be between 1 and 5
- `quality`: Must be between 1 and 5 (sleep quality)
- `status`: Must be valid status for leads ('New', 'Contacted', 'Booked', 'Won', 'Lost')

## Common Issues

### Import Errors
- **Foreign Key Violations**: Ensure referenced records exist
- **Date Format**: Use ISO 8601 format for timestamps
- **CSV Format**: Check for proper escaping of special characters
- **File Encoding**: Use UTF-8 encoding for all CSV files

### Performance Tips
- Import data in the correct order (profiles first, then dependent tables)
- Consider using batch imports for large datasets
- Disable RLS temporarily during bulk imports if needed

## Support

For questions about the data structure or import process:
1. Check the database schema in `supabase/schema.sql`
2. Review the TypeScript types in `src/lib/database.types.ts`
3. Consult the Supabase documentation for CSV import procedures
