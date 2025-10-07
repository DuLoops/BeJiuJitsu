import { BJJNode, ContentItem, ContentSection } from './types';

// Helper function to normalize titles for matching
function normalizeTitle(title: string): string {
  let normalized = title.toLowerCase();
  // Define common prefixes to remove for broader matching
  const prefixes = [
    "john danaher's ", "john danaher's ", "john danaher - ",
    "lachlan giles' ", "lachlan giles' ",
    "stephan kesting - ", "stephan kesting's ", "stephan kesting's ",
    "andre galvao's ", "andre galvao's ",
    "bjj curriculum's ", "bjj curriculum's ",
    "andrew wiltse's ", "andrew wiltse's ", "andrew wiltse's ", // ensure trailing space if original had it
    "jon thomas' ", "jon thomas's ", "jon thomas's ",
    "rob biernacki's ", "rob biernacki's ",
    "rory van vliet's ", "rory van vliet's ",
    "rafael lovato jr.'s ", "rafael lovato jr.'s ",
    "margot ciccarelli's ", "margot ciccarelli's ",
    "st. paul bjj academy's ", "st. paul bjj academy's "
  ];

  for (const prefix of prefixes) {
    if (normalized.startsWith(prefix)) {
      normalized = normalized.substring(prefix.length);
      // It's possible a title might be *only* the prefix, guard against empty string if logic requires it later.
      // For now, simple substring is fine.
      break; 
    }
  }

  normalized = normalized.replace(/['']/g, ""); // remove apostrophes like ' or '
  normalized = normalized.replace(/[^a-z0-9\s]/g, ''); // remove non-alphanumeric (keeps spaces)
  normalized = normalized.replace(/\s+/g, ' ').trim(); // normalize whitespace (multiple spaces to one, trim ends)
  return normalized;
}

// Build a map of normalized user-provided titles to URLs
const userVideoLinks: Record<string, string> = {
  // Pin Escapes
  "Perfect BJJ Side Control Escape": "https://www.youtube.com/watch?v=cuXq-k__9lQ",
  "Perfect BJJ Mount Escape": "https://www.youtube.com/watch?v=EMEueexp9zU",
  "Side Escape Complete Guide": "https://www.youtube.com/watch?v=JiqEETm20Wo",
  "Side Control Escapes SIT-UP": "https://www.youtube.com/watch?v=V7vmzcc3ldA",
  "Side Control Escapes ELBOW PUSH": "https://www.youtube.com/watch?v=bDVO9kXu5Lc",
  "Side Control Escapes HIP ROLL": "https://www.youtube.com/watch?v=78NAEI_Gzzw",
  "Getting Out of Side Control": "https://www.youtube.com/watch?v=WqXwqNlPydY",
  "Getting Out of Knee On Belly": "https://www.youtube.com/watch?v=FlNu8bi54CE",
  "Escaping the Mount": "https://www.youtube.com/watch?v=ch8_pW-G4fM",
  "Escaping Side Control": "https://www.youtube.com/watch?v=g1Pwz4PHeE4",
  "Escaping Knee on Belly, Scarf Hold, and North South Positions": "https://www.youtube.com/watch?v=q1E15WKB_9w",
  "Side Control Escapes": "https://www.youtube.com/watch?v=8F6meOljv-s",
  "Mount Escapes": "https://www.youtube.com/watch?v=sn_OWQexKKg",
  "Back Escapes": "https://www.youtube.com/watch?v=hg4oUIyT4ng", // Last occurrence for "Back Escapes"
  "North-South Escapes": "https://www.youtube.com/watch?v=QL3_w8Td8Ls",
  "Scarf Hold Escapes": "https://www.youtube.com/watch?v=4i0f8kFn60U",
  "Knee On Belly Escapes": "https://www.youtube.com/watch?v=At5h90jKiu8",
  "Side Control Escape Seminar": "https://www.youtube.com/watch?v=Ym83IwrgotA",
  // Guard Retention
  "Perfect BJJ Guard Retention": "https://www.youtube.com/watch?v=ce_0XT1BBQA",
  "Guard Retention: Head Control": "https://www.youtube.com/watch?v=NbpjYdcIkBk",
  "Open Guard Translated": "https://www.youtube.com/watch?v=Pnq9mN2odAg",
  "Defensive Guard Clips": "https://www.youtube.com/watch?v=yo1NUdmaT54",
  "8 Layers of Guard Retention": "https://www.youtube.com/watch?v=UTaZzbHMr-s",
  "12 Guard Retention Concepts": "https://www.youtube.com/watch?v=VgrM1IQGmxc",
  "How to Never Get Your BJJ Guard Passed": "https://www.youtube.com/watch?v=e86MOTgrzgs",
  "5 Tips to Improve Your Guard Retention": "https://www.youtube.com/watch?v=zIsvigk3CZQ",
  "Analysis of High-Level BJJ Guard Retention": "https://www.youtube.com/watch?v=OXGtlW3yj3w",
  "Basics of Around the Legs Retention": "https://www.youtube.com/watch?v=-YjZGB_s5JY",
  // Half Guard
  "Perfect Half Guard Game": "https://www.youtube.com/watch?v=E8x1Cva8hJ8",
  "Perfect Half Guard Game No Gi": "https://www.youtube.com/watch?v=Ze10eulM1xg",
  "Most Important Half Guard Sweep": "https://www.youtube.com/watch?v=65oxIM5llsk",
  "Functional Half Guard": "https://www.youtube.com/watch?v=DfFzALZPhQc",
  "Dog Fight / Coyote Guard Instructional": "https://www.youtube.com/watch?v=BoDgPdXSM94",
  "Half Guard Masterclass": "https://www.youtube.com/watch?v=ERXaDACrE7Q",
  "Half Guard Seminar": "https://www.youtube.com/watch?v=yqUt5LkCxe0", // Last occurrence for "Half Guard Seminar"
  "Bottom Half Guard System": "https://www.youtube.com/watch?v=I6MItk9heAk",
  "Half Guard – The G-Roll Series": "https://www.youtube.com/watch?v=ZY0GGpBCL3M",
  "Half Guard Bottom – Underhook Posture": "https://www.youtube.com/watch?v=pAyV9xg2xSE",
  "Half Guard Bottom – Old School Posture": "https://www.youtube.com/watch?v=H4Wy7vcy8hU",
  "Half Guard Bottom – Overhook Posture": "https://www.youtube.com/watch?v=fD9U-NpvRlg",
  // Closed Guard
  "Perfect BJJ Closed Guard Game": "https://www.youtube.com/watch?v=otskR_OjuBU",
  "Guard Strategy": "https://www.youtube.com/watch?v=xfEFChj35g0",
  "The Best Closed Guard in the World": "https://www.youtube.com/watch?v=P5SeCRensWQ",
  "Developing an Undefeatable Closed Guard": "https://www.youtube.com/watch?v=W3PZaA5uxUU",
  "Invisible Jiu-Jitsu – Closed Guard": "https://www.youtube.com/watch?v=zKXUogHcRqM",
  // Open Guard
  "Understanding the Open Guard in BJJ": "https://www.youtube.com/watch?v=Fcg4mtegux0",
  "X Guard Fundamentals": "https://www.youtube.com/watch?v=Kng3k1eWkyQ",
  // Collar Sleeve Guard
  "Collar & Sleeve Guard Study": "https://www.youtube.com/watch?v=yHdpRMZ1C6A",
  "Ultimate Beginner's Guide to the Collar Sleeve Guard": "https://www.youtube.com/watch?v=sJRPf_OdJBA",
  "Daruish Guard Introduction": "https://www.youtube.com/watch?v=7vCAc7oyG6s",
  "Foot on Hip Guard": "https://www.youtube.com/watch?v=QPBGOXqmp6M",
  "Foot on Hip Guard Curriculum Full": "https://www.youtube.com/watch?v=q4juKMe-tE4",
  // Butterfly Guard
  "BJJ Butterfly Guard – Most Important Principles": "https://www.youtube.com/watch?v=0WG1MYvgXAM",
  "Butterfly Sweeps Seminar": "https://www.youtube.com/watch?v=9d5LDy-vDtA",
  "Complete Butterfly Guard System": "https://www.youtube.com/watch?v=--I_8PD0qxM",
  "Unstoppable Hook Flip": "https://www.youtube.com/watch?v=--I_8PD0qxM",
  "Why No One Can Stop Adam Wardzinski's Butterfly Sweep": "https://www.youtube.com/watch?v=TGBTANrwXlc",
  // Spider Guard
  "Basic Spider Guard": "https://www.youtube.com/watch?v=IJqFY8Pcc4A",
  "Intro to Spider Guard": "https://www.youtube.com/watch?v=ze6I6Vu-UMI",
  // De La Riva Guard
  "De La Riva Guard System": "https://www.youtube.com/watch?v=vgSyv-vBQw4",
  "Advanced De La Riva System": "https://www.youtube.com/watch?v=1eKK5T00Tbo",
  "De La Riva 101": "https://www.youtube.com/watch?v=Qgw3OicuA8c",
  "De La Riva 102": "https://www.youtube.com/watch?v=OF2ktlMlH-Q",
  // Passing
  "John Danaher's 5 Tips to Pass ANY Guard": "https://www.youtube.com/watch?v=ODuQCA88oY4",
  "Lachlan Giles' Understanding Guard Passing: Concepts and Heuristics": "https://www.youtube.com/watch?v=GCWfLiI51ds",
  "St. Paul BJJ Academy's Guard Passing": "https://www.youtube.com/playlist?list=PL_VsCEq3pngwnP3DGbNrWMEcRN_ktcefN",
  "Jon Thomas' Complete Guard Passing Overview": "https://www.youtube.com/watch?v=_BpZPf5RKGY",
  "Jon Thomas' Knee Cut Passing: The Complete Guide": "https://www.youtube.com/watch?v=lOPh9K5kOcE",
  "Jon Thomas' Toreando Pass Comprehensive Guide": "https://www.youtube.com/watch?v=QMaW6TVhh6I",
  "Andrew Wiltse's Wiltse's Ultimate Guide to the Knee Slice": "https://www.youtube.com/watch?v=5jHo6ZBMB3o",
  "Andrew Wiltse's How to do the Perfect Knee Slice Entry: Buzzsaw Style": "https://www.youtube.com/watch?v=O3asdjlhjDA",
  "Andrew Wiltse's 6 hour No Gi Passing Seminar": "https://www.youtube.com/watch?v=WyxE0yr42dQ",
  "Andrew Wiltse's Buzzsaw Guard Passing Seminar": "https://www.youtube.com/watch?v=PKwWy6PEpo4",
  "Margot Ciccarelli's Modern Passing Masterclass": "https://www.youtube.com/watch?v=1NscWfcMo2k",
  // BJJ Curriculum Series
  "BJJ Curriculum's Basic Guard Passing": "https://www.youtube.com/watch?v=DZL7pmQjmyU",
  "BJJ Curriculum's Basic Standing Passes": "https://www.youtube.com/watch?v=4l0tPa3s4Qc",
  "BJJ Curriculum's Smash Pass Guard Passing System": "https://www.youtube.com/watch?v=H0UiYBOByj0",
  "BJJ Curriculum's Toreando Guard Passing System": "https://www.youtube.com/watch?v=gkk_FYrm7ig",
  "BJJ Curriculum's Complete Butterfly Guard Passing System": "https://www.youtube.com/watch?v=YG14zxjIlBU",
  "BJJ Curriculum's Spider Guard Passing System": "https://www.youtube.com/watch?v=6PxnYzoYC8w",
  // Rob Biernacki Series
  "Rob Biernacki's 2014 Guard Passing Seminar": "https://www.youtube.com/playlist?list=PLwFPFagNE2DZtZ67oA6L0muSLCsPE5BtA",
  "Rob Biernacki's 2017 Guard Passing Seminar": "https://www.youtube.com/playlist?list=PLwFPFagNE2DaHXM8WxgLjNsOEzKKgK6RM",
  "Rob Biernacki's Torreando Guard Passing Seminar": "https://www.youtube.com/playlist?list=PLwFPFagNE2DZmLl2IFzUbjLlEo7XXXXXE",
  // Other Studies/Playlists
  "Rory Van Vliet's Gordon Ryan Guard Pass Study": "https://www.youtube.com/playlist?list=PLNbZ1gPk7zqzg_uEY8Jc_k-bKFpsBsosz",
  "Rafael Lovato Jr.'s Ultimate Pressure Passing": "https://www.youtube.com/playlist?list=PL_VsCEq3pngwPXmGmN7JbBZ6EQhVskcsB"
};

const normalizedUserTitleToUrlMap: Record<string, string> = {};
for (const [title, url] of Object.entries(userVideoLinks)) {
  normalizedUserTitleToUrlMap[normalizeTitle(title)] = url;
}

// Recursive function to traverse the BJJ_CONTENT_TREE and update URLs
function updateNodeUrls(nodes: BJJNode[]): void {
  for (const node of nodes) {
    if (node.content) {
      if (node.content.introduction) {
        node.content.introduction.forEach((item: ContentItem) => {
          if (item.type === 'video' && item.title) {
            const normalizedOriginalTitle = normalizeTitle(item.title);
            const newUrl = normalizedUserTitleToUrlMap[normalizedOriginalTitle];
            if (newUrl) {
              item.url = newUrl;
            }
          }
        });
      }
      if (node.content.sections) {
        node.content.sections.forEach((section: ContentSection) => {
          section.items.forEach((item: ContentItem) => {
            if (item.type === 'video' && item.title) {
              const normalizedOriginalTitle = normalizeTitle(item.title);
              const newUrl = normalizedUserTitleToUrlMap[normalizedOriginalTitle];
              if (newUrl) {
                item.url = newUrl;
              }
            }
          });
        });
      }
    }
    if (node.children) {
      updateNodeUrls(node.children);
    }
  }
}


export const BJJ_CONTENT_TREE: BJJNode[] = [
  {
    id: 'root',
    title: 'BJJ Fundamentals: Your Journey Starts Here',
    level: 0,
    content: {
      introduction: [
        { type: 'paragraph', text: "Welcome to your first steps in Brazilian Jiu-Jitsu. Think of this guide as your personal black belt instructor, here to walk you through the most important concepts of the \"gentle art.\" BJJ can seem complex, but it's built on a few simple, powerful ideas. We'll start with the main branches—the core principles—and then explore deeper into the specific techniques. Your goal isn't to memorize everything at once, but to understand the *why* behind the *how*. Let's begin." }
      ],
    },
    children: [
      {
        id: 'core-principles',
        title: 'Level 1: The "Why" - Core Principles & Mindset',
        level: 1,
        content: {
          introduction: [
            { type: 'paragraph', text: "These are the philosophies that make Jiu-Jitsu work. Understand these, and the techniques will make a lot more sense." }
          ],
        },
        children: [
          {
            id: 'leverage-over-strength',
            title: '1. Leverage and Technique Over Strength',
            level: 2,
            content: {
              sections: [
                {
                  title: 'Concept',
                  items: [
                    { type: 'paragraph', text: "Jiu-Jitsu is known as \"the gentle art\" because it's designed to let a smaller person control and submit a larger opponent using biomechanics, leverage, and timing. It's not about who is stronger; it's about who is smarter." }
                  ]
                },
                {
                  title: 'Key Idea',
                  items: [
                    { type: 'paragraph', text: "Think of your body as a system of levers and wedges. We use these tools to disrupt our opponent's structure and balance, applying our full strength to their weakest point." }
                  ]
                },
                {
                  title: 'Common Beginner Mistake',
                  items: [
                    { type: 'paragraph', text: "Trying to muscle through every position. This will exhaust you and make you vulnerable. Relax, breathe, and think about angles and leverage." }
                  ]
                },
                {
                  items: [
                    { type: 'image', src: 'https://picsum.photos/seed/lever_diagram/600/300', alt: 'Diagram of a lever' },
                    { type: 'video', title: 'John Danaher - The Philosophy of Leverage in BJJ', url: '#' }
                  ]
                }
              ]
            }
          },
          {
            id: 'survival-tapping',
            title: '2. Survival is Paramount: Tapping is Learning',
            level: 2,
            content: {
              sections: [
                {
                  title: 'Concept',
                  items: [
                    { type: 'paragraph', text: "As a beginner, your number one job is to survive. Nothing more. This means learning to be comfortable in uncomfortable positions and protecting yourself. Tapping is not losing; it is learning. When caught in a submission, you tap your opponent (or the mat) to signal that you yield." }
                  ]
                },
                {
                  title: 'Key Idea',
                  items: [
                    { type: 'paragraph', text: "Your goal in training is to stay healthy so you can train again tomorrow. The ego is the biggest obstacle to progress. Tap early, tap often, and ask your partner how they did it." }
                  ]
                },
                {
                  title: 'Common Beginner Mistake',
                  items: [
                    { type: 'paragraph', text: "Waiting too long to tap out of pride. This leads to injuries and time off the mats. Tapping is a sign of intelligence, not weakness." }
                  ]
                },
                {
                  items: [
                    { type: 'image', src: 'https://picsum.photos/seed/tapping_learning/600/300', alt: 'Person tapping to signal submission' },
                    { type: 'video', title: 'The Importance of Tapping - A White Belt Guide', url: '#' }
                  ]
                }
              ]
            }
          },
          {
            id: 'gi-as-tool',
            title: '3. The Gi as an Integral Tool (Grips)',
            level: 2,
            content: {
              sections: [
                {
                  title: 'Concept',
                  items: [
                    { type: 'paragraph', text: "In Gi Jiu-Jitsu, your uniform is not just clothing; it's a weapon and a set of handles. We use specific grips on the collar, sleeves, and pants to break our opponent's posture, control their movement, and set up our attacks." }
                  ]
                },
                {
                  title: 'Key Grips',
                  items: [
                    { type: 'list', items: [
                      "Collar Grip: The steering wheel. Used to control your opponent's head and posture. Essential for chokes.",
                      "Sleeve Grip: Disables their arms. Used to prevent them from gripping you and to set up arm attacks.",
                      "Pant Grip: Controls their hips and legs. Crucial for passing the guard and for many sweeps."
                    ]}
                  ]
                },
                {
                  title: 'Key Idea',
                  items: [
                    { type: 'paragraph', text: "The person who controls the grips usually controls the fight." }
                  ]
                },
                {
                  items: [
                    { type: 'image', src: 'https://picsum.photos/seed/gi_grips_collage/600/300', alt: 'Collage of BJJ grips: collar, sleeve, pant' },
                    { type: 'video', title: 'Stephan Kesting - The 4 Most Important Grips in BJJ', url: '#' }
                  ]
                }
              ]
            }
          },
          {
            id: 'hips-not-arms',
            title: '4. Using Your Hips, Not Your Arms',
            level: 2,
            content: {
              sections: [
                {
                  title: 'Concept',
                  items: [
                    { type: 'paragraph', text: "Real power in Jiu-Jitsu comes from your core and hips, not your arms and shoulders. Learning to move your hips effectively is the single most important physical skill you can develop. Pushing with your arms is a beginner's instinct, but it exposes you to armbars and wastes energy." }
                  ]
                },
                {
                  title: 'Key Idea',
                  items: [
                    { type: 'paragraph', text: "Think of your body as a pendulum, swinging from your core. This generates momentum for escapes and sweeps. Your arms are for connecting to your opponent; your hips are for moving them." }
                  ]
                },
                {
                  title: 'Common Beginner Mistake',
                  items: [
                    { type: 'paragraph', text: "Pushing an opponent off of you when you're mounted. Instead, you should bridge with your hips." }
                  ]
                },
                {
                  items: [
                    { type: 'image', src: 'https://picsum.photos/seed/hip_escape_action/600/300', alt: 'Action shot of a hip escape movement' },
                    { type: 'video', title: 'The Power of Hip Movement in Jiu-Jitsu', url: '#' }
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        id: 'positions-movement',
        title: 'Level 2: The "How" - Positions & Movement',
        level: 1,
        content: {
          introduction: [
            { type: 'paragraph', text: "This is your roadmap for navigating a BJJ match. We start with escaping bad spots, then move to controlling the fight." }
          ],
        },
        children: [
          {
            id: 'essential-escapes',
            title: '1. Essential Escapes (Survival First!)',
            level: 2,
            content: {
              introduction: [
                { type: 'paragraph', text: "You will spend a lot of time in bad positions. It's part of the process. Escaping is your most crucial skill. These movements create space and allow you to get back to a neutral or safe position, like the guard." }
              ]
            },
            children: [
              {
                id: 'bridge-upa',
                title: 'The Bridge (Upa)',
                level: 3,
                content: {
                  sections: [
                    {
                      title: 'Conceptual Overview',
                      items: [
                        { type: 'paragraph', text: "This is your primary escape from the Mount position. It's a powerful hip thrust that sends your opponent's weight forward, allowing you to roll them over." }
                      ]
                    },
                    {
                      title: 'Step-by-Step',
                      items: [
                        { type: 'list', items: [
                          "Trap one of your opponent's arms by wrapping it with your own arm.",
                          "Trap their foot on the *same side* by hooking it with your foot.",
                          "Plant your other foot firmly on the mat.",
                          "Bridge your hips up towards the ceiling as high as you can, looking in the direction you want to roll.",
                          "As they become weightless, roll them over and establish a good top position."
                        ]}
                      ]
                    },
                    {
                      title: 'Common Beginner Mistake',
                      items: [
                        { type: 'paragraph', text: "Lifting your head instead of bridging with your hips. Keep your head on the mat and drive your hips to the sky." }
                      ]
                    },
                    {
                      items: [
                        { type: 'image', src: 'https://picsum.photos/seed/upa_escape_sequence/600/300', alt: 'Sequence showing Upa escape setup and bridge' },
                        { type: 'video', title: 'John Danaher\'s Perfect BJJ Mount Escape', url: 'https://www.youtube.com/watch?v=EMEueexp9zU' }
                      ]
                    }
                  ]
                }
              },
              {
                id: 'shrimp-hip-escape',
                title: 'The Shrimp (Hip Escape)',
                level: 3,
                content: {
                  sections: [
                    {
                      title: 'Conceptual Overview',
                      items: [
                        { type: 'paragraph', text: "The Shrimp is your get-out-of-jail-free card. It's the most fundamental movement for creating space from almost any pin, especially Side Control." }
                      ]
                    },
                    {
                      title: 'Step-by-Step',
                      items: [
                        { type: 'list', items: [
                          "Turn onto your side, facing your opponent.",
                          "Create frames with your arms (forearms against their neck/hips) to prevent them from crushing you.",
                          "Plant your feet close to your butt.",
                          "Push off your feet and pull with your upper body to move your hips *away* from your opponent.",
                          "This creates a gap. Bring your knees into that gap to recover your guard."
                        ]}
                      ]
                    },
                    {
                      title: 'Common Beginner Mistake',
                      items: [
                        { type: 'paragraph', text: "Moving your shoulders instead of your hips. The goal is to move your hips out and away." }
                      ]
                    },
                    {
                      items: [
                        { type: 'image', src: 'https://picsum.photos/seed/shrimp_escape_action/600/300', alt: 'Practitioner shrimping hips away' },
                        { type: 'video', title: 'Lachlan Giles\' Positional Escapes', url: '#' }
                      ]
                    }
                  ]
                }
              }
            ]
          },
          {
            id: 'basic-guard-systems',
            title: '2. Basic Guard Systems',
            level: 2,
            content: {
              introduction: [
                { type: 'paragraph', text: "The Guard is BJJ's signature position. You are on your back, but you are not losing. You use your legs as a shield and a weapon to control the opponent, defend, and launch attacks (sweeps and submissions)." }
              ]
            },
            children: [
              {
                id: 'closed-guard',
                title: 'Closed Guard',
                level: 3,
                content: {
                   sections: [
                    {
                      title: 'Conceptual Overview',
                      items: [
                        { type: 'paragraph', text: "Your ankles are crossed behind the opponent's back. This is a very strong, controlling position for a beginner. Your goal here is to break their posture and attack." }
                      ]
                    },
                    {
                      title: 'Key Ideas',
                      items: [
                        { type: 'list', items: [
                          "Use your legs and arms together to pull your opponent's head down towards your chest.",
                          "Control their sleeves or collar to prevent them from posturing up.",
                          "Never let them get two hands on your chest to stand up."
                        ]}
                      ]
                    },
                    {
                      title: 'Common Beginner Mistake',
                      items: [
                        { type: 'paragraph', text: "Lying flat and letting the opponent sit up straight. An opponent with good posture in your guard is a dangerous opponent." }
                      ]
                    },
                    {
                      items: [
                        { type: 'image', src: 'https://picsum.photos/seed/closed_guard_posture_break/600/300', alt: 'Tight closed guard breaking posture' },
                        { type: 'video', title: 'John Danaher\'s Perfect BJJ Closed Guard Game', url: 'https://www.youtube.com/watch?v=otskR_OjuBU' }
                      ]
                    }
                  ]
                }
              },
              {
                id: 'open-guard',
                title: 'Open Guard',
                level: 3,
                 content: {
                   sections: [
                    {
                      title: 'Conceptual Overview',
                      items: [
                        { type: 'paragraph', text: "When your ankles are not locked, you are in Open Guard. This is a huge category of positions, but the core idea is using your feet on your opponent's hips, biceps, or shoulders to manage distance and attack. It's more dynamic but less controlling than Closed Guard." }
                      ]
                    },
                    {
                      title: 'Key Idea for Beginners',
                      items: [
                        { type: 'paragraph', text: "Keep your feet connected to your opponent. Your feet are your first line of defense." }
                      ]
                    },
                    {
                      title: 'Common Beginner Mistake',
                      items: [
                        { type: 'paragraph', text: "Letting your opponent easily push your legs aside and pass. Keep your knees close to your chest and your feet active." }
                      ]
                    },
                    {
                      items: [
                        { type: 'image', src: 'https://picsum.photos/seed/open_guard_control/600/300', alt: 'Open guard with feet on hips' },
                        { type: 'video', title: 'John Danaher\'s Understanding the Open Guard in BJJ', url: 'https://www.youtube.com/watch?v=Fcg4mtegux0' }
                      ]
                    }
                  ]
                }
              },
              {
                id: 'half-guard',
                title: 'Half Guard',
                level: 3,
                content: {
                   sections: [
                    {
                      title: 'Conceptual Overview',
                      items: [
                        { type: 'paragraph', text: "You are controlling one of your opponent's legs between both of your legs. This is a very common position that can be both defensive and offensive." }
                      ]
                    },
                    {
                      title: 'Key Idea for Beginners',
                      items: [
                        { type: 'paragraph', text: "Get the underhook! An underhook on the same side as the trapped leg gives you tremendous control and leverage to sweep or take the back." }
                      ]
                    },
                    {
                      title: 'Common Beginner Mistake',
                      items: [
                        { type: 'paragraph', text: "Lying flat on your back in half guard. You must stay on your side, facing your opponent." }
                      ]
                    },
                    {
                      items: [
                        { type: 'image', src: 'https://picsum.photos/seed/half_guard_underhook/600/300', alt: 'Half guard with deep underhook' },
                        { type: 'video', title: 'Lachlan Giles\' Most Important Half Guard Sweep', url: 'https://www.youtube.com/watch?v=65oxIM5llsk' }
                      ]
                    }
                  ]
                }
              }
            ]
          },
          {
            id: 'guard-passing',
            title: '3. High-Percentage Guard Passing',
            level: 2,
            content: {
              sections: [
                {
                  title: 'Concept',
                  items: [
                     { type: 'paragraph', text: "When you are on top, your opponent will use their guard to stop you. Passing the guard means getting around their legs to achieve a dominant pin like Side Control or Mount. As Saulo Ribeiro says, passing is \"you and the gravity of the world against\" the guard player."}
                  ]
                },
                {
                  title: 'Key Principles',
                  items: [
                    { type: 'list', items: [
                        "Grip Control: Get your grips before they get theirs.",
                        "Posture and Base: Stay low and maintain good balance. Don't let them break your posture.",
                        "Control the Hips: The opponent's power comes from their hips. Control their hips, and you control their guard."
                    ]}
                  ]
                },
                {
                  title: 'Common Beginner Mistake',
                  items: [
                    { type: 'paragraph', text: "Rushing the pass and leaving yourself open for a sweep or submission. Be patient and methodical." }
                  ]
                },
                {
                  items: [
                    { type: 'image', src: 'https://picsum.photos/seed/knee_cut_pass/600/300', alt: 'Knee-cut guard pass' },
                    { type: 'video', title: 'John Danaher\'s 5 Tips to Pass ANY Guard', url: 'https://www.youtube.com/watch?v=ODuQCA88oY4' }
                  ]
                }
              ]
            }
          },
          {
            id: 'takedowns-defense',
            title: '4. Fundamental Takedowns & Defense',
            level: 2,
            content: {
              introduction: [
                { type: 'paragraph', text: "Every match starts on the feet. Having a simple, reliable takedown allows you to dictate where the fight takes place." }
              ]
            },
            children: [
              {
                id: 'double-leg-takedown',
                title: 'Double Leg Takedown',
                level: 3,
                content: {
                  sections: [
                    {
                      title: 'Conceptual Overview',
                      items: [
                        { type: 'paragraph', text: "A classic and powerful takedown from wrestling. You are essentially tackling your opponent's legs."}
                      ]
                    },
                    {
                      title: 'Step-by-Step',
                      items: [
                        { type: 'list', items: [
                            "Change Level: Bend your knees and drop your hips, getting your head below your opponent's head.",
                            "Penetrate: Take a deep step forward with your lead leg, placing it between your opponent's feet.",
                            "Connect: Drive your shoulder into their midsection while wrapping both arms around their legs, above the knees.",
                            "Drive and Finish: Keep your head up and back straight. Drive forward with your legs to run them over."
                        ]}
                      ]
                    },
                     {
                      title: 'Defense (Sprawl)',
                      items: [
                        { type: 'paragraph', text: "When you feel them shoot, kick your legs straight back and drive your hips down to the mat, putting all your weight on their head and shoulders."}
                      ]
                    },
                    {
                      items: [
                        { type: 'image', src: 'https://picsum.photos/seed/double_leg_takedown/600/300', alt: 'Double leg takedown impact' },
                        { type: 'video', title: 'Basic Double Leg Takedown for BJJ', url: '#' }
                      ]
                    }
                  ]
                }
              }
            ]
          },
          {
            id: 'high-percentage-submissions',
            title: '5. High-Percentage Submissions (Exposure)',
            level: 2,
            content: {
              introduction: [
                { type: 'paragraph', text: "These are the fundamental submissions that work at all levels. As a beginner, focus on the control and setup, not just the finish." }
              ]
            },
            children: [
              {
                id: 'rnc',
                title: 'Rear Naked Choke (RNC)',
                level: 3,
                content: {
                  sections: [
                     { title: 'Position', items: [{type: 'paragraph', text: 'Back Mount'}] },
                     { title: 'Overview', items: [{type: 'paragraph', text: "The king of all submissions. One arm goes under the chin, the other supports the head. The choke comes from squeezing your biceps and shoulder muscles, not from pulling."}] },
                     { title: 'Common Mistake', items: [{type: 'paragraph', text: "Squeezing the chin/jaw instead of being under the neck. Be patient and secure the position before squeezing."}] },
                     { items: [
                        { type: 'image', src: 'https://picsum.photos/seed/rnc_grip/600/300', alt: 'Rear Naked Choke hand position' },
                        { type: 'video', title: 'John Danaher\'s 3 Most Important Jiu Jitsu Strangles', url: '#' }
                     ]}
                  ]
                }
              },
              {
                id: 'cross-collar-choke',
                title: 'Cross-Collar Choke',
                level: 3,
                 content: {
                  sections: [
                     { title: 'Position', items: [{type: 'paragraph', text: 'Mount or Guard'}] },
                     { title: 'Overview', items: [{type: 'paragraph', text: "A powerful Gi choke using the opponent's own collar. One hand goes deep into the collar (thumb in), the other goes across and grips the other collar. The finish is like revving a motorcycle."}] },
                     { title: 'Common Mistake', items: [{type: 'paragraph', text: "Not getting the first grip deep enough behind their neck."}] },
                     { items: [
                        { type: 'image', src: 'https://picsum.photos/seed/cross_collar_choke_grip/600/300', alt: 'Cross-collar choke grip from mount' },
                        { type: 'video', title: 'Andre Galvao\'s Ultimate Cross Choke from Knee Cut', url: '#' }
                     ]}
                  ]
                }
              },
              {
                id: 'armbar-from-guard',
                title: 'Armbar from Guard',
                level: 3,
                content: {
                  sections: [
                     { title: 'Position', items: [{type: 'paragraph', text: 'Closed Guard'}] },
                     { title: 'Overview', items: [{type: 'paragraph', text: "Isolating one of your opponent's arms and using your hips as a fulcrum to hyperextend their elbow."}] },
                     { title: 'Common Mistake', items: [{type: 'paragraph', text: "Not controlling their posture before attacking the arm. You must break them down first."}] },
                     { items: [
                        { type: 'image', src: 'https://picsum.photos/seed/armbar_from_guard/600/300', alt: 'Armbar from guard execution' },
                        { type: 'video', title: 'BJJ Curriculum\'s 7 Strangles from the Guard (includes armbar setups)', url: '#' }
                     ]}
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        id: 'training-methodology',
        title: 'Level 3: The "What" - Training Methodology',
        level: 1,
        content: {
          introduction: [
            { type: 'paragraph', text: "How to get the most out of every minute on the mat." }
          ],
        },
        children: [
          {
            id: 'drilling',
            title: '1. Drilling',
            level: 2,
            content: {
              sections: [
                { title: 'Concept', items: [{type: 'paragraph', text: "Drilling is the process of repeating a technique with a compliant partner to build muscle memory and refine your mechanics. This is where you focus on being perfect without the pressure of live resistance."}] },
                { title: 'Key Idea', items: [{type: 'paragraph', text: "Drill with intention. Pay attention to every detail—your grips, your hip position, your head placement. Don't just go through the motions."}] },
                { items: [
                    { type: 'image', src: 'https://picsum.photos/seed/bjj_drilling/600/300', alt: 'Two people drilling a guard pass' },
                    { type: 'video', title: 'How to Drill for Maximum Improvement', url: '#' }
                ]}
              ]
            }
          },
          {
            id: 'live-rolling',
            title: '2. Live Rolling (Sparring)',
            level: 2,
            content: {
              sections: [
                { title: 'Concept', items: [{type: 'paragraph', text: "This is where you test your techniques against a resisting, thinking opponent in a controlled environment. Rolling is the most important part of BJJ training for developing timing, pressure, and adaptability."}] },
                { title: 'Beginner\'s Goal', items: [{type: 'paragraph', text: "Don't try to \"win.\" Your goals are to: 1. Survive. 2. Stay calm and breathe. 3. Try one technique you learned in class. That's it."}] },
                { items: [
                    { type: 'image', src: 'https://picsum.photos/seed/bjj_rolling/600/300', alt: 'Two practitioners in a light technical roll' },
                    { type: 'video', title: 'A Guide to Your First BJJ Sparring Session', url: '#' }
                ]}
              ]
            }
          },
          {
            id: 'solo-drills',
            title: '3. Solo Drills',
            level: 2,
            content: {
              sections: [
                { title: 'Concept', items: [{type: 'paragraph', text: "These are movements you can practice on your own to build the coordination, flexibility, and muscle memory for core BJJ movements. They are your homework."}] },
                { title: 'Essential Solo Drills', items: [
                    {type: 'list', items: [
                        "Shrimping (Hip Escape)",
                        "Bridging (Upa)",
                        "Technical Stand-up",
                        "Forward/Backward Rolls"
                    ]}
                ]},
                { title: 'Key Idea', items: [{type: 'paragraph', text: "Just 10-15 minutes of solo drills a day will dramatically accelerate your progress."}] },
                { items: [
                    { type: 'image', src: 'https://picsum.photos/seed/bjj_solo_drills/600/300', alt: 'Person practicing solo bridging drills' },
                    { type: 'video', title: 'Top 10 Solo Drills You Can Do at Home', url: '#' }
                ]}
              ]
            }
          },
          {
            id: 'training-journaling',
            title: '4. Training Journaling',
            level: 2,
            content: {
              sections: [
                { title: 'Concept', items: [{type: 'paragraph', text: "The simple act of writing down what you learned after each class. What did the instructor teach? What worked in rolling? What did you struggle with? Who tapped you and how?"}] },
                { title: 'Key Idea', items: [{type: 'paragraph', text: "This is one of the biggest \"hacks\" for learning faster. It forces you to reflect on your training, helps you remember techniques, and allows you to track your progress over time."}] },
                { items: [
                    { type: 'image', src: 'https://picsum.photos/seed/bjj_journal/600/300', alt: 'Open notebook with BJJ notes' },
                    { type: 'video', title: 'How to Keep a BJJ Training Journal', url: '#' }
                ]}
              ]
            }
          }
        ]
      }
    ]
  }
];

updateNodeUrls(BJJ_CONTENT_TREE);
