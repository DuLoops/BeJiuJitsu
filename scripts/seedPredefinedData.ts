import { predefinedCategories, predefinedSkills } from '../src/constants/predefinedSkillsAndCategories';
import { supabase } from '../src/lib/supabase'; // Adjust path if your supabase client is elsewhere
import { TablesInsert } from '../src/supabase/types';

// --- IMPORTANT PRE-REQUISITE ---
// Before running this script, ensure you have:
// 1. Replaced all placeholder UUIDs (e.g., 'c_uuid_...') in 'src/constants/predefinedSkillsAndCategories.ts'
//    with *actual, unique* UUIDs.
// 2. Replaced all placeholder timestamps (e.g., '[CURRENT_ISO_TIMESTAMP]') in that file
//    with *actual* ISO 8601 timestamp strings (e.g., new Date().toISOString()).
//
// FAILURE TO DO SO WILL LIKELY RESULT IN ERRORS OR INCORRECT DATA.

async function seedData() {
  console.log('Starting to seed predefined data...');

  // Validate that placeholders are replaced (basic check)
  if (predefinedCategories.some(c => c.id?.startsWith('c_uuid_') || c.createdAt === '[CURRENT_ISO_TIMESTAMP]')) {
    console.error('ERROR: Placeholder UUIDs or timestamps found in predefinedCategories.');
    console.error('Please edit src/constants/predefinedSkillsAndCategories.ts and replace them before seeding.');
    return;
  }
  if (predefinedSkills.some(s => s.id?.startsWith('s_uuid_') || s.createdAt === '[CURRENT_ISO_TIMESTAMP]')) {
    console.error('ERROR: Placeholder UUIDs or timestamps found in predefinedSkills.');
    console.error('Please edit src/constants/predefinedSkillsAndCategories.ts and replace them before seeding.');
    return;
  }

  // Seed Categories
  console.log('\nSeeding Categories...');
  const categoriesToInsert: TablesInsert<'Category'>[] = predefinedCategories.map(cat => ({
    ...cat,
    // Ensure id is not undefined if your type expects it to be always present for insert
    // and it's coming from a source where it might be optional.
    // However, for this predefined data, we assume `id` is set.
  }));

  const { data: categoryData, error: categoryError } = await supabase
    .from('Category')
    .insert(categoriesToInsert)
    .select();

  if (categoryError) {
    console.error('Error seeding categories:', categoryError.message);
    if (categoryError.details) console.error('Details:', categoryError.details);
    if (categoryError.hint) console.error('Hint:', categoryError.hint);
  } else {
    console.log('Successfully seeded categories:');
    categoryData?.forEach(c => console.log(`  - ${c.name} (ID: ${c.id})`));
  }

  // Seed Skills
  // Ensure categories were seeded successfully or have the correct IDs available for skills
  if (categoryError || !categoryData || categoryData.length === 0) {
     console.error('\nSkipping skill seeding due to category seeding errors or no category data.');
     return;
  }

  console.log('\nSeeding Skills...');
  // Note: The predefinedSkills already use the placeholder IDs from predefinedCategories.
  // If you generated new UUIDs for categories, ensure predefinedSkills reflects those *actual* new UUIDs for categoryId.
  // The current script assumes you replaced the placeholder UUIDs in predefinedSkillsAndCategories.ts directly.

  const skillsToInsert: TablesInsert<'Skill'>[] = predefinedSkills.map(skill => ({
    ...skill,
    // Similar to categories, ensure `id` and `categoryId` are correctly set.
  }));


  const { data: skillData, error: skillError } = await supabase
    .from('Skill')
    .insert(skillsToInsert)
    .select();

  if (skillError) {
    console.error('Error seeding skills:', skillError.message);
    if (skillError.details) console.error('Details:', skillError.details);
    if (skillError.hint) console.error('Hint:', skillError.hint);
  } else {
    console.log('Successfully seeded skills:');
    skillData?.forEach(s => console.log(`  - ${s.name} (ID: ${s.id}, CategoryID: ${s.categoryId})`));
  }

  console.log('\nData seeding process completed.');
}

seedData().catch(error => {
  console.error('Unhandled error during seeding process:', error);
});

// To run this script:
// 1. Make sure you have `ts-node` or a similar TypeScript execution environment installed (e.g., `npm install -g ts-node`)
// 2. Navigate to your project root in the terminal.
// 3. Execute: `ts-node scripts/seedPredefinedData.ts`
//    (Adjust the path if you place the script or run it from a different directory)
//
// Ensure your Supabase URL and anon key are correctly configured for the Supabase client,
// typically via environment variables that your `../src/lib/supabase.ts` setup would use. 