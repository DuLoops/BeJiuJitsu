export interface SkillType {
  id: string;
  title: string;
  category: CategoryType;
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

export const Skills: SkillType[] = [
    { id: 'takedown-single-leg', title: 'Single Leg', category: 'Takedown' },
    { id: 'takedown-double-leg', title: 'Double Leg', category: 'Takedown' },
    { id: 'takedown-body-lock', title: 'Body Lock', category: 'Takedown' },
    { id: 'takedown-foot-sweep', title: 'Foot Sweep', category: 'Takedown' },
    { id: 'takedown-ankle-pick', title: 'Ankle Pick', category: 'Takedown' },
    { id: 'takedown-arm-drag', title: 'Arm Drag', category: 'Takedown' },
    { id: 'takedown-firemans-carry', title: 'Fireman\'s Carry', category: 'Takedown' },
    { id: 'takedown-tomoe-nage', title: 'Tomoe Nage', category: 'Takedown' },
    { id: 'pass-knee-cut', title: 'Knee Cut', category: 'Pass' },
    { id: 'pass-leg-drag', title: 'Leg Drag', category: 'Pass' },
    { id: 'pass-torreando', title: 'Torreando', category: 'Pass' },
    { id: 'pass-over-under', title: 'Over Under', category: 'Pass' },
    { id: 'pass-tripod', title: 'Tripod', category: 'Pass' },
    { id: 'pass-body-lock', title: 'Body Lock', category: 'Pass' },
    { id: 'pass-stack-pass', title: 'Stack Pass', category: 'Pass' },
    { id: 'pass-x-pass', title: 'X Pass', category: 'Pass' },
    { id: 'pass-smash-pass', title: 'Smash Pass', category: 'Pass' },
    { id: 'pass-back-step', title: 'Back Step', category: 'Pass' },
    { id: 'pass-leg-weave', title: 'Leg Weave', category: 'Pass' },
    { id: 'pass-berimbolo', title: 'Berimbolo', category: 'Pass' },
    { id: 'control-side-control', title: 'Side Control', category: 'Control' },
    { id: 'control-mount', title: 'Mount', category: 'Control' },
    { id: 'control-back-control', title: 'Back Control', category: 'Control' },
    { id: 'control-knee-on-belly', title: 'Knee on Belly', category: 'Control' },
    { id: 'control-north-south', title: 'North South', category: 'Control' },
    { id: 'control-ashi-garami', title: 'AShi Garami', category: 'Control' },
    { id: 'control-crucifix', title: 'Crucifix', category: 'Control' },
    { id: 'control-leg-ride', title: 'Leg Ride', category: 'Control' },
    { id: 'control-wrestling-pin', title: 'Wrestling Pin', category: 'Control' },
    { id: 'submission-choke', title: 'Choke', category: 'Submission' },
    { id: 'submission-armbar', title: 'Armbar', category: 'Submission' },
    { id: 'submission-kimura', title: 'Kimura', category: 'Submission' },
    { id: 'submission-triangle', title: 'Triangle', category: 'Submission' },
    { id: 'submission-rear-naked-choke', title: 'Rear Naked Choke', category: 'Submission' },
    { id: 'submission-guillotine', title: 'Guillotine', category: 'Submission' },
    { id: 'submission-americana', title: 'Americana', category: 'Submission' },
    { id: 'submission-omoplata', title: 'Omoplata', category: 'Submission' },
    { id: 'submission-heel-hook', title: 'Heel Hook', category: 'Submission' },
    { id: 'submission-knee-bar', title: 'Knee Bar', category: 'Submission' },
    { id: 'submission-toe-hold', title: 'Toe Hold', category: 'Submission' },
    { id: 'submission-ezekiel', title: 'Ezekiel', category: 'Submission' },
    { id: 'submission-wrist-lock', title: 'Wrist Lock', category: 'Submission' },
    { id: 'submission-neck-crank', title: 'Neck Crank', category: 'Submission' },
    { id: 'submission-calf-slicer', title: 'Calf Slicer', category: 'Submission' },
    { id: 'submission-shoulder-lock', title: 'Shoulder Lock', category: 'Submission' },
    { id: 'submission-leg-lock', title: 'Leg Lock', category: 'Submission' },
    { id: 'escape-side-control-escape', title: 'Side Control Escape', category: 'Escape' },
    { id: 'escape-mount-escape', title: 'Mount Escape', category: 'Escape' },
    { id: 'escape-back-escape', title: 'Back Escape', category: 'Escape' },
    { id: 'escape-knee-on-belly-escape', title: 'Knee on Belly Escape', category: 'Escape' },
    { id: 'escape-north-south-escape', title: 'North South Escape', category: 'Escape' },
    { id: 'guard-closed-guard', title: 'Closed Guard', category: 'Guard' },
    { id: 'guard-open-guard', title: 'Open Guard', category: 'Guard' },
    { id: 'guard-half-guard', title: 'Half Guard', category: 'Guard' },
    { id: 'guard-butterfly-guard', title: 'Butterfly Guard', category: 'Guard' },
    { id: 'guard-spider-guard', title: 'Spider Guard', category: 'Guard' },
    { id: 'guard-de-la-riva', title: 'De La Riva', category: 'Guard' },
    { id: 'guard-reverse-de-la-riva', title: 'Reverse De La Riva', category: 'Guard' },
    { id: 'guard-lasso-guard', title: 'Lasso Guard', category: 'Guard' },
    { id: 'guard-x-guard', title: 'X Guard', category: 'Guard' },
    { id: 'guard-rubber-guard', title: 'Rubber Guard', category: 'Guard' },
    { id: 'guard-50-50', title: '50/50', category: 'Guard' },
    { id: 'guard-deep-half-guard', title: 'Deep Half Guard', category: 'Guard' },
    { id: 'sweep-scissor-sweep', title: 'Scissor Sweep', category: 'Sweep' },
    { id: 'sweep-butterfly-sweep', title: 'Butterfly Sweep', category: 'Sweep' },
    { id: 'system-game-plan', title: 'Game Plan', category: 'System' },
    { id: 'system-concept', title: 'Concept', category: 'System' },
    { id: 'system-strategy', title: 'Strategy', category: 'System' },
    { id: 'system-principle', title: 'Principle', category: 'System' },
];