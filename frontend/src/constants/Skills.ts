export interface SkillType {
  id: string;
  title: string;
  category: CategoryType
}

export interface CategoryType {
  id: string;
  name: string;
}

// Define categories with IDs
export const Categories: CategoryType[] = [
  {id: 'category-takedown', name: 'Takedown'},
  {id: 'category-pass', name: 'Pass'},
  {id: 'category-control', name: 'Control'},
  {id: 'category-submission', name: 'Submission'},
  {id: 'category-escape', name: 'Escape'},
  {id: 'category-guard', name: 'Guard'},
  {id: 'category-sweep', name: 'Sweep'},
  {id: 'category-system', name: 'System'}
];

// For backward compatibility
export const CategoryNames: string[] = Categories.map(cat => cat.name);

export const CategorySkillMap: { [key: string]: string[] } = {
    Takedown: ['Single Leg', 'Double Leg', 'Body Lock', 'Foot Sweep', 'Ankle Pick', 'Arm Drag', 'Fireman\'s Carry', 'Tomoe Nage'],
    Pass: ['Knee Cut', 'Leg Drag', 'Torreando', 'Over Under', 'Tripod', 'Body Lock','Stack Pass', 'X Pass', 'Smash Pass', 'Back Step', 'Leg Weave', 'Berimbolo'],
    Control: ['Side Control', 'Mount', 'Back Control', 'Knee on Belly', 'North South', ' AShi Grami', 'Crucifix','Leg Ride', 'Wrestling Pin'],
    Submission: ['Choke', 'Armbar', 'Kimura', 'Triangle', 'Rear Naked Choke', 'Guillotine', 'Americana', 'Omoplata', 'Heel Hook', 'Knee Bar', 'Toe Hold', 'Ezekiel', 'Wrist Lock', 'Neck Crank', 'Calf Slicer', 'Shoulder Lock', 'Leg Lock'],
    Escape: ['Side Control Escape', 'Mount Escape', 'Back Escape', 'Knee on Belly Escape', 'North South Escape'],
    Guard: ['Closed Guard', 'Open Guard', 'Half Guard', 'Butterfly Guard', 'Spider Guard', 'De La Riva', 'Reverse De La Riva', 'Lasso Guard', 'X Guard', 'Rubber Guard', '50/50', 'Deep Half Guard'],
    Sweep: ['Scissor Sweep', 'Butterfly Sweep'],
    System: ['Game Plan', 'Concept', 'Strategy', 'Principle'],
};

// Helper function to convert title to kebab-case
const toKebabCase = (text: string): string => {
  return text.toLowerCase().replace(/[^\w]+/g, '-');
};

// Helper function to get category object by name
const getCategoryByName = (name: string): CategoryType => {
  return Categories.find(cat => cat.name === name) || Categories[0];
};

export const Skills: SkillType[] = [
    { id: 'takedown-single-leg', title: 'Single Leg', category: getCategoryByName('Takedown') },
    { id: 'takedown-double-leg', title: 'Double Leg', category: getCategoryByName('Takedown') },
    { id: 'takedown-body-lock', title: 'Body Lock', category: getCategoryByName('Takedown') },
    { id: 'takedown-foot-sweep', title: 'Foot Sweep', category: getCategoryByName('Takedown') },
    { id: 'takedown-ankle-pick', title: 'Ankle Pick', category: getCategoryByName('Takedown') },
    { id: 'takedown-arm-drag', title: 'Arm Drag', category: getCategoryByName('Takedown') },
    { id: 'takedown-firemans-carry', title: 'Fireman\'s Carry', category: getCategoryByName('Takedown') },
    { id: 'takedown-tomoe-nage', title: 'Tomoe Nage', category: getCategoryByName('Takedown') },
    { id: 'pass-knee-cut', title: 'Knee Cut', category: getCategoryByName('Pass') },
    { id: 'pass-leg-drag', title: 'Leg Drag', category: getCategoryByName('Pass') },
    { id: 'pass-torreando', title: 'Torreando', category: getCategoryByName('Pass') },
    { id: 'pass-over-under', title: 'Over Under', category: getCategoryByName('Pass') },
    { id: 'pass-tripod', title: 'Tripod', category: getCategoryByName('Pass') },
    { id: 'pass-body-lock', title: 'Body Lock', category: getCategoryByName('Pass') },
    { id: 'pass-stack-pass', title: 'Stack Pass', category: getCategoryByName('Pass') },
    { id: 'pass-x-pass', title: 'X Pass', category: getCategoryByName('Pass') },
    { id: 'pass-smash-pass', title: 'Smash Pass', category: getCategoryByName('Pass') },
    { id: 'pass-back-step', title: 'Back Step', category: getCategoryByName('Pass') },
    { id: 'pass-leg-weave', title: 'Leg Weave', category: getCategoryByName('Pass') },
    { id: 'pass-berimbolo', title: 'Berimbolo', category: getCategoryByName('Pass') },
    { id: 'control-side-control', title: 'Side Control', category: getCategoryByName('Control') },
    { id: 'control-mount', title: 'Mount', category: getCategoryByName('Control') },
    { id: 'control-back-control', title: 'Back Control', category: getCategoryByName('Control') },
    { id: 'control-knee-on-belly', title: 'Knee on Belly', category: getCategoryByName('Control') },
    { id: 'control-north-south', title: 'North South', category: getCategoryByName('Control') },
    { id: 'control-ashi-garami', title: 'AShi Garami', category: getCategoryByName('Control') },
    { id: 'control-crucifix', title: 'Crucifix', category: getCategoryByName('Control') },
    { id: 'control-leg-ride', title: 'Leg Ride', category: getCategoryByName('Control') },
    { id: 'control-wrestling-pin', title: 'Wrestling Pin', category: getCategoryByName('Control') },
    { id: 'submission-choke', title: 'Choke', category: getCategoryByName('Submission') },
    { id: 'submission-armbar', title: 'Armbar', category: getCategoryByName('Submission') },
    { id: 'submission-kimura', title: 'Kimura', category: getCategoryByName('Submission') },
    { id: 'submission-triangle', title: 'Triangle', category: getCategoryByName('Submission') },
    { id: 'submission-rear-naked-choke', title: 'Rear Naked Choke', category: getCategoryByName('Submission') },
    { id: 'submission-guillotine', title: 'Guillotine', category: getCategoryByName('Submission') },
    { id: 'submission-americana', title: 'Americana', category: getCategoryByName('Submission') },
    { id: 'submission-omoplata', title: 'Omoplata', category: getCategoryByName('Submission') },
    { id: 'submission-heel-hook', title: 'Heel Hook', category: getCategoryByName('Submission') },
    { id: 'submission-knee-bar', title: 'Knee Bar', category: getCategoryByName('Submission') },
    { id: 'submission-toe-hold', title: 'Toe Hold', category: getCategoryByName('Submission') },
    { id: 'submission-ezekiel', title: 'Ezekiel', category: getCategoryByName('Submission') },
    { id: 'submission-wrist-lock', title: 'Wrist Lock', category: getCategoryByName('Submission') },
    { id: 'submission-neck-crank', title: 'Neck Crank', category: getCategoryByName('Submission') },
    { id: 'submission-calf-slicer', title: 'Calf Slicer', category: getCategoryByName('Submission') },
    { id: 'submission-shoulder-lock', title: 'Shoulder Lock', category: getCategoryByName('Submission') },
    { id: 'submission-leg-lock', title: 'Leg Lock', category: getCategoryByName('Submission') },
    { id: 'escape-side-control-escape', title: 'Side Control Escape', category: getCategoryByName('Escape') },
    { id: 'escape-mount-escape', title: 'Mount Escape', category: getCategoryByName('Escape') },
    { id: 'escape-back-escape', title: 'Back Escape', category: getCategoryByName('Escape') },
    { id: 'escape-knee-on-belly-escape', title: 'Knee on Belly Escape', category: getCategoryByName('Escape') },
    { id: 'escape-north-south-escape', title: 'North South Escape', category: getCategoryByName('Escape') },
    { id: 'guard-closed-guard', title: 'Closed Guard', category: getCategoryByName('Guard') },
    { id: 'guard-open-guard', title: 'Open Guard', category: getCategoryByName('Guard') },
    { id: 'guard-half-guard', title: 'Half Guard', category: getCategoryByName('Guard') },
    { id: 'guard-butterfly-guard', title: 'Butterfly Guard', category: getCategoryByName('Guard') },
    { id: 'guard-spider-guard', title: 'Spider Guard', category: getCategoryByName('Guard') },
    { id: 'guard-de-la-riva', title: 'De La Riva', category: getCategoryByName('Guard') },
    { id: 'guard-reverse-de-la-riva', title: 'Reverse De La Riva', category: getCategoryByName('Guard') },
    { id: 'guard-lasso-guard', title: 'Lasso Guard', category: getCategoryByName('Guard') },
    { id: 'guard-x-guard', title: 'X Guard', category: getCategoryByName('Guard') },
    { id: 'guard-rubber-guard', title: 'Rubber Guard', category: getCategoryByName('Guard') },
    { id: 'guard-50-50', title: '50/50', category: getCategoryByName('Guard') },
    { id: 'guard-deep-half-guard', title: 'Deep Half Guard', category: getCategoryByName('Guard') },
    { id: 'sweep-scissor-sweep', title: 'Scissor Sweep', category: getCategoryByName('Sweep') },
    { id: 'sweep-butterfly-sweep', title: 'Butterfly Sweep', category: getCategoryByName('Sweep') },
    { id: 'system-game-plan', title: 'Game Plan', category: getCategoryByName('System') },
    { id: 'system-concept', title: 'Concept', category: getCategoryByName('System') },
    { id: 'system-strategy', title: 'Strategy', category: getCategoryByName('System') },
    { id: 'system-principle', title: 'Principle', category: getCategoryByName('System') },
];