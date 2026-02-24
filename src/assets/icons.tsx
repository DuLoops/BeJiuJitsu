import { Ionicons, MaterialCommunityIcons, Foundation } from '@expo/vector-icons';
import React from 'react';

/**
 * Universal icon definitions for the application to ensure consistency.
 *
 * Usage example:
 * <Icons.Tree size={24} color="green" />
 */

export const ICON_SIZE = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
};

// Define icon mappings here. You can change the library source easily.
export const Icons = {
    // Navigation / Actions
    Back: (props: any) => <Ionicons name="chevron-back" {...props} />,
    Close: (props: any) => <Ionicons name="close" {...props} />,
    Add: (props: any) => <Ionicons name="add" {...props} />,
    Delete: (props: any) => <MaterialCommunityIcons name="delete" {...props} />,
    Edit: (props: any) => <Ionicons name="pencil" {...props} />,
    Save: (props: any) => <Ionicons name="save-outline" {...props} />,
    Search: (props: any) => <Ionicons name="search" {...props} />,
    Filter: (props: any) => <Ionicons name="filter" {...props} />,

    // Domain specific
    Skill: (props: any) => <MaterialCommunityIcons name="pine-tree" {...props} />,
    Trees: (props: any) => <Foundation name="trees" {...props} />, // As seen in SkillStatsCard
    Video: (props: any) => <Ionicons name="videocam" {...props} />,
    Note: (props: any) => <Ionicons name="document-text" {...props} />,
    Training: (props: any) => <MaterialCommunityIcons name="karate" {...props} />, // Or similar
    Competition: (props: any) => <MaterialCommunityIcons name="trophy-outline" {...props} />,

    // UI Elements
    ChevronDown: (props: any) => <Ionicons name="chevron-down" {...props} />,
    ChevronUp: (props: any) => <Ionicons name="chevron-up" {...props} />,
    Check: (props: any) => <Ionicons name="checkmark" {...props} />,
    Settings: (props: any) => <Ionicons name="settings-outline" {...props} />,
    Medal: (props: any) => <MaterialCommunityIcons name="medal" {...props} />,
    Practice: (props: any) => <MaterialCommunityIcons name="water-outline" {...props} />,
    Trophy: (props: any) => <MaterialCommunityIcons name="trophy" {...props} />,
};
