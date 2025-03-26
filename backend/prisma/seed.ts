import { PrismaClient, UserRole, Belt, PredefinedCategory } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('password', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'dujink2@gmail.com' },
    update: {},
    create: {
      email: 'dujink2@gmail.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
      isVerified: true,
      profile: {
        create: {
          userName: "AdminUser",
          belt: Belt.BLACK,
          stripes: 0
        }
      }
    },
  });

  console.log('Admin user created:', admin.email);

  // Define category mapping to PredefinedCategory enum with IDs
  const categoryMapping: Record<string, {id: string, type: PredefinedCategory}> = {
    'Takedown': {id: 'category-takedown', type: PredefinedCategory.TAKEDOWN},
    'Pass': {id: 'category-pass', type: PredefinedCategory.PASS},
    'Control': {id: 'category-control', type: PredefinedCategory.CONTROL},
    'Submission': {id: 'category-submission', type: PredefinedCategory.SUBMISSION},
    'Escape': {id: 'category-escape', type: PredefinedCategory.ESCAPE},
    'Guard': {id: 'category-guard', type: PredefinedCategory.GUARD},
    'Sweep': {id: 'category-sweep', type: PredefinedCategory.SWEEP},
    'System': {id: 'category-system', type: PredefinedCategory.SYSTEM},
  };

  // Define skills by category with proper type and kebab-case IDs
  const skillsByCategory: Record<string, Array<{id: string, name: string}>> = {
    'Takedown': [
      {id: 'takedown-single-leg', name: 'Single Leg'}, 
      {id: 'takedown-double-leg', name: 'Double Leg'}, 
      {id: 'takedown-body-lock', name: 'Body Lock'}, 
      {id: 'takedown-foot-sweep', name: 'Foot Sweep'}, 
      {id: 'takedown-ankle-pick', name: 'Ankle Pick'}, 
      {id: 'takedown-arm-drag', name: 'Arm Drag'}, 
      {id: 'takedown-firemans-carry', name: 'Fireman\'s Carry'}, 
      {id: 'takedown-tomoe-nage', name: 'Tomoe Nage'}
    ],
    'Pass': [
      {id: 'pass-knee-cut', name: 'Knee Cut'}, 
      {id: 'pass-leg-drag', name: 'Leg Drag'}, 
      {id: 'pass-torreando', name: 'Torreando'}, 
      {id: 'pass-over-under', name: 'Over Under'}, 
      {id: 'pass-tripod', name: 'Tripod'}, 
      {id: 'pass-body-lock', name: 'Body Lock'}, 
      {id: 'pass-stack-pass', name: 'Stack Pass'}, 
      {id: 'pass-x-pass', name: 'X Pass'}, 
      {id: 'pass-smash-pass', name: 'Smash Pass'}, 
      {id: 'pass-back-step', name: 'Back Step'}, 
      {id: 'pass-leg-weave', name: 'Leg Weave'}, 
      {id: 'pass-berimbolo', name: 'Berimbolo'}
    ],
    'Control': [
      {id: 'control-side-control', name: 'Side Control'}, 
      {id: 'control-mount', name: 'Mount'}, 
      {id: 'control-back-control', name: 'Back Control'}, 
      {id: 'control-knee-on-belly', name: 'Knee on Belly'}, 
      {id: 'control-north-south', name: 'North South'}, 
      {id: 'control-ashi-garami', name: 'Ashi Garami'}, 
      {id: 'control-crucifix', name: 'Crucifix'}, 
      {id: 'control-leg-ride', name: 'Leg Ride'}, 
      {id: 'control-wrestling-pin', name: 'Wrestling Pin'}
    ],
    'Submission': [
      {id: 'submission-choke', name: 'Choke'}, 
      {id: 'submission-armbar', name: 'Armbar'}, 
      {id: 'submission-kimura', name: 'Kimura'}, 
      {id: 'submission-triangle', name: 'Triangle'}, 
      {id: 'submission-rear-naked-choke', name: 'Rear Naked Choke'}, 
      {id: 'submission-guillotine', name: 'Guillotine'}, 
      {id: 'submission-americana', name: 'Americana'}, 
      {id: 'submission-omoplata', name: 'Omoplata'}, 
      {id: 'submission-heel-hook', name: 'Heel Hook'}, 
      {id: 'submission-knee-bar', name: 'Knee Bar'}, 
      {id: 'submission-toe-hold', name: 'Toe Hold'}, 
      {id: 'submission-ezekiel', name: 'Ezekiel'}, 
      {id: 'submission-wrist-lock', name: 'Wrist Lock'}, 
      {id: 'submission-neck-crank', name: 'Neck Crank'}, 
      {id: 'submission-calf-slicer', name: 'Calf Slicer'}, 
      {id: 'submission-shoulder-lock', name: 'Shoulder Lock'}, 
      {id: 'submission-leg-lock', name: 'Leg Lock'}
    ],
    'Escape': [
      {id: 'escape-side-control-escape', name: 'Side Control Escape'}, 
      {id: 'escape-mount-escape', name: 'Mount Escape'}, 
      {id: 'escape-back-escape', name: 'Back Escape'}, 
      {id: 'escape-knee-on-belly-escape', name: 'Knee on Belly Escape'}, 
      {id: 'escape-north-south-escape', name: 'North South Escape'}
    ],
    'Guard': [
      {id: 'guard-closed-guard', name: 'Closed Guard'}, 
      {id: 'guard-open-guard', name: 'Open Guard'}, 
      {id: 'guard-half-guard', name: 'Half Guard'}, 
      {id: 'guard-butterfly-guard', name: 'Butterfly Guard'}, 
      {id: 'guard-spider-guard', name: 'Spider Guard'}, 
      {id: 'guard-de-la-riva', name: 'De La Riva'}, 
      {id: 'guard-reverse-de-la-riva', name: 'Reverse De La Riva'}, 
      {id: 'guard-lasso-guard', name: 'Lasso Guard'}, 
      {id: 'guard-x-guard', name: 'X Guard'}, 
      {id: 'guard-rubber-guard', name: 'Rubber Guard'}, 
      {id: 'guard-50-50', name: '50/50'}, 
      {id: 'guard-deep-half-guard', name: 'Deep Half Guard'}
    ],
    'Sweep': [
      {id: 'sweep-scissor-sweep', name: 'Scissor Sweep'}, 
      {id: 'sweep-butterfly-sweep', name: 'Butterfly Sweep'}
    ],
    'System': [
      {id: 'system-game-plan', name: 'Game Plan'}, 
      {id: 'system-concept', name: 'Concept'}, 
      {id: 'system-strategy', name: 'Strategy'}, 
      {id: 'system-principle', name: 'Principle'}
    ],
  };

  // Create categories
  for (const [categoryName, categoryData] of Object.entries(categoryMapping)) {
    const category = await prisma.category.upsert({
      where: {
        // Using the name and userId as a unique compound identifier
        userId_name: {
          userId: admin.id,
          name: categoryName
        }
      },
      update: {},
      create: {
        id: categoryData.id, // Use the custom category ID
        name: categoryName,
        userId: admin.id,
        isPredefined: true,
        predefined: true
      },
    });
    
    console.log(`Category created: ${category.name} with ID: ${category.id}`);
    
    // Create skills for this category with IDs directly from frontend
    const skills = skillsByCategory[categoryName] || [];
    for (const skill of skills) {
      await prisma.skill.upsert({
        where: {
          name: skill.name
        },
        update: {},
        create: {
          id: skill.id, // Use the frontend ID directly as the Skill.id
          name: skill.name,
          creatorId: admin.id,
          isPublic: true,
          categoryId: category.id,
          createdAt: new Date(),
        }
      });
      console.log(`Skill created: ${skill.name} (${categoryName}) with ID: ${skill.id}`);
    }
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
