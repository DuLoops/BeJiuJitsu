import { TablesInsert } from '../supabase/types';

// --- IMPORTANT NOTES FOR USAGE ---
// 1. UUIDs: Replace all placeholder strings like 'c_uuid_...' or 's_uuid_...' with actual, unique UUIDs.
//    You can use a UUID generation library or function for this.
// 2. Timestamps: Replace '[CURRENT_ISO_TIMESTAMP]' with actual ISO 8601 timestamp strings
//    (e.g., new Date().toISOString()) at the time of seeding.
// 3. Path to types: Adjust the import path '../supabase/types' if this file is placed elsewhere.

const GENERATED_TIMESTAMP = '[CURRENT_ISO_TIMESTAMP]';

// --- Predefined Categories ---
// Each object conforms to TablesInsert<'Category'>

const tempCategoryMap: { [key: string]: string } = {};

export const predefinedCategories: TablesInsert<'Category'>[] = [
  { id: 'c_uuid_takedown_01', name: 'Takedown', isPredefined: true, userId: null, createdAt: GENERATED_TIMESTAMP, updatedAt: GENERATED_TIMESTAMP },
  { id: 'c_uuid_pass_02', name: 'Pass', isPredefined: true, userId: null, createdAt: GENERATED_TIMESTAMP, updatedAt: GENERATED_TIMESTAMP },
  { id: 'c_uuid_control_03', name: 'Control', isPredefined: true, userId: null, createdAt: GENERATED_TIMESTAMP, updatedAt: GENERATED_TIMESTAMP },
  { id: 'c_uuid_submission_04', name: 'Submission', isPredefined: true, userId: null, createdAt: GENERATED_TIMESTAMP, updatedAt: GENERATED_TIMESTAMP },
  { id: 'c_uuid_escape_05', name: 'Escape', isPredefined: true, userId: null, createdAt: GENERATED_TIMESTAMP, updatedAt: GENERATED_TIMESTAMP },
  { id: 'c_uuid_guard_06', name: 'Guard', isPredefined: true, userId: null, createdAt: GENERATED_TIMESTAMP, updatedAt: GENERATED_TIMESTAMP },
  { id: 'c_uuid_sweep_07', name: 'Sweep', isPredefined: true, userId: null, createdAt: GENERATED_TIMESTAMP, updatedAt: GENERATED_TIMESTAMP },
  { id: 'c_uuid_system_08', name: 'System', isPredefined: true, userId: null, createdAt: GENERATED_TIMESTAMP, updatedAt: GENERATED_TIMESTAMP },
];

// Populate the temporary map for skill generation
predefinedCategories.forEach(cat => {
  tempCategoryMap[cat.name] = cat.id!;
});


// --- Predefined Skills ---
// Each object conforms to TablesInsert<'Skill'>

export const predefinedSkills: TablesInsert<'Skill'>[] = [
  // Takedown Skills
  { id: 's_uuid_single_leg_001', name: 'Single Leg', categoryId: tempCategoryMap['Takedown'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_double_leg_002', name: 'Double Leg', categoryId: tempCategoryMap['Takedown'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_body_lock_takedown_003', name: 'Body Lock', categoryId: tempCategoryMap['Takedown'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP }, // Renamed to avoid clash with Pass
  { id: 's_uuid_foot_sweep_004', name: 'Foot Sweep', categoryId: tempCategoryMap['Takedown'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_ankle_pick_005', name: 'Ankle Pick', categoryId: tempCategoryMap['Takedown'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_arm_drag_006', name: 'Arm Drag', categoryId: tempCategoryMap['Takedown'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_firemans_carry_007', name: 'Fireman\'s Carry', categoryId: tempCategoryMap['Takedown'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_tomoe_nage_008', name: 'Tomoe Nage', categoryId: tempCategoryMap['Takedown'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },

  // Pass Skills
  { id: 's_uuid_knee_cut_009', name: 'Knee Cut', categoryId: tempCategoryMap['Pass'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_leg_drag_010', name: 'Leg Drag', categoryId: tempCategoryMap['Pass'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_torreando_011', name: 'Torreando', categoryId: tempCategoryMap['Pass'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_over_under_012', name: 'Over Under', categoryId: tempCategoryMap['Pass'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_tripod_013', name: 'Tripod', categoryId: tempCategoryMap['Pass'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_body_lock_pass_014', name: 'Body Lock Pass', categoryId: tempCategoryMap['Pass'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP }, // Differentiated from Takedown's Body Lock
  { id: 's_uuid_stack_pass_015', name: 'Stack Pass', categoryId: tempCategoryMap['Pass'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_x_pass_016', name: 'X Pass', categoryId: tempCategoryMap['Pass'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_smash_pass_017', name: 'Smash Pass', categoryId: tempCategoryMap['Pass'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_back_step_018', name: 'Back Step', categoryId: tempCategoryMap['Pass'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_leg_weave_019', name: 'Leg Weave', categoryId: tempCategoryMap['Pass'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_berimbolo_020', name: 'Berimbolo', categoryId: tempCategoryMap['Pass'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },

  // Control Skills
  { id: 's_uuid_side_control_021', name: 'Side Control', categoryId: tempCategoryMap['Control'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_mount_022', name: 'Mount', categoryId: tempCategoryMap['Control'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_back_control_023', name: 'Back Control', categoryId: tempCategoryMap['Control'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_knee_on_belly_024', name: 'Knee on Belly', categoryId: tempCategoryMap['Control'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_north_south_025', name: 'North South', categoryId: tempCategoryMap['Control'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_ashi_garami_026', name: 'AShi Garami', categoryId: tempCategoryMap['Control'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_crucifix_027', name: 'Crucifix', categoryId: tempCategoryMap['Control'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_leg_ride_028', name: 'Leg Ride', categoryId: tempCategoryMap['Control'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_wrestling_pin_029', name: 'Wrestling Pin', categoryId: tempCategoryMap['Control'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },

  // Submission Skills
  { id: 's_uuid_choke_030', name: 'Choke', categoryId: tempCategoryMap['Submission'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_armbar_031', name: 'Armbar', categoryId: tempCategoryMap['Submission'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_kimura_032', name: 'Kimura', categoryId: tempCategoryMap['Submission'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_triangle_033', name: 'Triangle', categoryId: tempCategoryMap['Submission'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_rear_naked_choke_034', name: 'Rear Naked Choke', categoryId: tempCategoryMap['Submission'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_guillotine_035', name: 'Guillotine', categoryId: tempCategoryMap['Submission'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_americana_036', name: 'Americana', categoryId: tempCategoryMap['Submission'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_omoplata_037', name: 'Omoplata', categoryId: tempCategoryMap['Submission'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_heel_hook_038', name: 'Heel Hook', categoryId: tempCategoryMap['Submission'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_knee_bar_039', name: 'Knee Bar', categoryId: tempCategoryMap['Submission'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_toe_hold_040', name: 'Toe Hold', categoryId: tempCategoryMap['Submission'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_ezekiel_041', name: 'Ezekiel', categoryId: tempCategoryMap['Submission'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_wrist_lock_042', name: 'Wrist Lock', categoryId: tempCategoryMap['Submission'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_neck_crank_043', name: 'Neck Crank', categoryId: tempCategoryMap['Submission'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_calf_slicer_044', name: 'Calf Slicer', categoryId: tempCategoryMap['Submission'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_shoulder_lock_045', name: 'Shoulder Lock', categoryId: tempCategoryMap['Submission'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_leg_lock_046', name: 'Leg Lock', categoryId: tempCategoryMap['Submission'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },

  // Escape Skills
  { id: 's_uuid_side_control_escape_047', name: 'Side Control Escape', categoryId: tempCategoryMap['Escape'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_mount_escape_048', name: 'Mount Escape', categoryId: tempCategoryMap['Escape'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_back_escape_049', name: 'Back Escape', categoryId: tempCategoryMap['Escape'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_knee_on_belly_escape_050', name: 'Knee on Belly Escape', categoryId: tempCategoryMap['Escape'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_north_south_escape_051', name: 'North South Escape', categoryId: tempCategoryMap['Escape'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },

  // Guard Skills
  { id: 's_uuid_closed_guard_052', name: 'Closed Guard', categoryId: tempCategoryMap['Guard'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_open_guard_053', name: 'Open Guard', categoryId: tempCategoryMap['Guard'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_half_guard_054', name: 'Half Guard', categoryId: tempCategoryMap['Guard'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_butterfly_guard_055', name: 'Butterfly Guard', categoryId: tempCategoryMap['Guard'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_spider_guard_056', name: 'Spider Guard', categoryId: tempCategoryMap['Guard'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_de_la_riva_057', name: 'De La Riva', categoryId: tempCategoryMap['Guard'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_reverse_de_la_riva_058', name: 'Reverse De La Riva', categoryId: tempCategoryMap['Guard'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_lasso_guard_059', name: 'Lasso Guard', categoryId: tempCategoryMap['Guard'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_x_guard_060', name: 'X Guard', categoryId: tempCategoryMap['Guard'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_rubber_guard_061', name: 'Rubber Guard', categoryId: tempCategoryMap['Guard'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_50_50_062', name: '50/50', categoryId: tempCategoryMap['Guard'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_deep_half_guard_063', name: 'Deep Half Guard', categoryId: tempCategoryMap['Guard'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },

  // Sweep Skills
  { id: 's_uuid_scissor_sweep_064', name: 'Scissor Sweep', categoryId: tempCategoryMap['Sweep'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_butterfly_sweep_065', name: 'Butterfly Sweep', categoryId: tempCategoryMap['Sweep'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },

  // System Skills
  { id: 's_uuid_game_plan_066', name: 'Game Plan', categoryId: tempCategoryMap['System'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_concept_067', name: 'Concept', categoryId: tempCategoryMap['System'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_strategy_068', name: 'Strategy', categoryId: tempCategoryMap['System'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
  { id: 's_uuid_principle_069', name: 'Principle', categoryId: tempCategoryMap['System'], isPublic: true, creatorId: null, createdAt: GENERATED_TIMESTAMP },
];

// Cleanup temporary map if not needed elsewhere
// delete tempCategoryMap; // Or simply don't export it if it's only for generation logic within this file. 