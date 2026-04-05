# Create gameData.js - All game data
game_data_js = '''// ============================================
// NEURO HACK: Mind Invasion - Game Data
// ============================================

const GameData = {
    // Player Stats
    player: {
        integrity: 100,
        stability: 100,
        corruption: 0,
        mindsCompleted: [],
        resolutions: 0,
        corruptionEncounters: 0,
        startTime: null,
        achievements: []
    },

    // Minds Data
    minds: [
        {
            id: 'anxious',
            name: 'THE ANXIOUS MIND',
            icon: '🌀',
            desc: 'An endless shifting maze where hesitation breeds shadows. Confidence is your only compass.',
            status: 'available',
            color: '#ff00ff',
            scenes: [
                {
                    id: 'anxious_1',
                    title: 'The Whispering Maze',
                    visual: '🌀',
                    narrative: `You materialize in an endless corridor of shifting walls. The architecture breathes, expanding and contracting with an irregular rhythm. Whispers echo from everywhere and nowhere, each voice suggesting a different path."Left is safe," one murmurs. "Right is truth," another insists. The shadows at the edges of your vision seem to grow thicker when you hesitate.`,
                    emotion: 'fear',
                    choices: [
                        {
                            text: 'Take the left path confidently',
                            effect: { stability: 5, confidence: true },
                            next: 'anxious_2'
                        },
                        {
                            text: 'Take the right path carefully',
                            effect: { stability: -5, fear: true },
                            next: 'anxious_3'
                        },
                        {
                            text: 'Stop and analyze both paths',
                            effect: { stability: -10, fear: true },
                            next: 'anxious_4'
                        }
                    ]
                },
                {
                    id: 'anxious_2',
                    title: 'The Stabilizing Path',
                    visual: '🛤️',
                    narrative: `Your confidence acts as an anchor. The corridor stabilizes, walls solidifying into crystalline structures that pulse with soft cyan light. The whispers fade, replaced by a single clear tone. Ahead, you see a node of corruption—a writhing mass of dark code attempting to overwrite the mind's anxiety protocols.`,
                    emotion: 'confidence',
                    combat: {
                        enemy: 'Anxiety Manifestation',
                        enemyIcon: '👤',
                        enemyDesc: 'A shadowy figure that feeds on hesitation and doubt',
                        health: 100,
                        weakness: 'confidence'
                    }
                },
                {
                    id: 'anxious_3',
                    title: 'The Doubt Corridor',
                    visual: '🌑',
                    narrative: `Caution turns to doubt. The walls close in, shadows detach from corners and merge into humanoid forms that mirror your hesitation. Each step feels heavier. You reach a chamber where the corruption has taken root—a Shadow of Doubt that grows larger as you watch.`,
                    emotion: 'fear',
                    combat: {
                        enemy: 'Shadow of Doubt',
                        enemyIcon: '👥',
                        enemyDesc: 'Manifestation of paranoia that grows when you second-guess',
                        health: 120,
                        weakness: 'override'
                    }
                },
                {
                    id: 'anxious_4',
                    title: 'The Analysis Paralysis',
                    visual: '⚠️',
                    narrative: `Analysis becomes paralysis. The corridor loops back on itself infinitely. You realize you've triggered a recursive thought pattern—the mind's anxiety response to overthinking. The environment glitches, and you face a Logic Paradox that must be resolved.`,
                    emotion: 'confusion',
                    puzzle: {
                        type: 'circuit',
                        difficulty: 2,
                        reward: 'Break the loop and restore forward momentum'
                    }
                }
            ],
            resolution: {
                success: `The anxiety protocols have been restored. The mind's owner will find their thoughts clearer, their fears more manageable. The shadows retreat to their proper place—as warnings, not monsters.`,
                reward: { integrity: 10, stability: 15 }
            }
        },
        {
            id: 'ego',
            name: 'THE EGO MIND',
            icon: '👑',
            desc: 'A beautiful but unstable floating world. Truth is your only anchor in a sea of illusions.',
            status: 'locked',
            color: '#ffd700',
            scenes: [
                {
                    id: 'ego_1',
                    title: 'The Golden Spire',
                    visual: '🏰',
                    narrative: `You emerge on a floating island of impossible architecture—spires of gold and crystal that defy gravity. Everything is beautiful, perfect, and somehow wrong. Mirrors line every surface, each reflection showing you slightly differently. A figure approaches, wearing your face but with eyes too confident, too certain.`,
                    emotion: 'confusion',
                    dialogue: {
                        speaker: 'Mirror Self',
                        text: "Welcome to perfection. Here, we are everything we were meant to be. No flaws, no doubts, no limitations. Why would you ever want to leave?",
                        responses: [
                            {
                                text: 'This is an illusion. I need to find the truth.',
                                effect: { stability: 10, truth: true },
                                next: 'ego_2'
                            },
                            {
                                text: 'Perfection is seductive. Let me explore more.',
                                effect: { corruption: 10, illusion: true },
                                next: 'ego_3'
                            }
                        ]
                    }
                },
                {
                    id: 'ego_2',
                    title: 'The Cracking Facade',
                    visual: '🔍',
                    narrative: `Your commitment to truth causes hairline fractures to appear in the golden structures. The Mirror Self snarls, its perfect features distorting. "You would choose ugly reality over beautiful fiction?" The ground becomes unstable—platforms that only hold if you see them truly.`,
                    emotion: 'determination',
                    puzzle: {
                        type: 'truth',
                        difficulty: 3,
                        reward: 'Navigate the collapsing ego structures'
                    }
                },
                {
                    id: 'ego_3',
                    title: 'The Narcissus Pool',
                    visual: '🌊',
                    narrative: `You wade deeper into the illusion. The world becomes more beautiful, more flattering, but the corruption grows visible—dark veins pulsing beneath the golden skin. You find yourself in an endless hall of mirrors, each reflection more idealized than the last. The Narcissus Warden blocks your path.`,
                    emotion: 'confusion',
                    corruption: true,
                    combat: {
                        enemy: 'Narcissus Warden',
                        enemyIcon: '🎭',
                        enemyDesc: 'Guardian of infinite self-admiration, vulnerable to truth',
                        health: 150,
                        weakness: 'truth'
                    }
                }
            ],
            resolution: {
                success: `The ego structures have been rebalanced. The mind's owner will retain their confidence but gain the ability to see themselves clearly—flaws and all. Truth becomes their foundation rather than their enemy.`,
                reward: { integrity: 15, stability: 10 }
            }
        },
        {
            id: 'procrastinator',
            name: 'THE PROCRASTINATOR MIND',
            icon: '⏰',
            desc: 'Time loops constantly. Tasks appear but fade away. Commitment is the key to breaking free.',
            status: 'locked',
            color: '#ff8800',
            scenes: [
                {
                    id: 'proc_1',
                    title: 'The Infinite Tomorrow',
                    visual: '⏰',
                    narrative: `You enter a comfortable study filled with unfinished projects. A digital clock on the wall reads 11:59 PM. As you watch, it clicks to 12:00 AM, then immediately back to 11:59 PM. "I'll do it tomorrow," echoes through the room, spoken by a voice that sounds like the mind's owner but stretched across infinite loops.`,
                    emotion: 'confusion',
                    choices: [
                        {
                            text: 'Pick up the nearest task and commit to completing it now',
                            effect: { stability: 10, determination: true },
                            next: 'proc_2'
                        },
                        {
                            text: 'Explore more to understand the loop better',
                            effect: { stability: -5, confusion: true },
                            next: 'proc_3'
                        }
                    ]
                },
                {
                    id: 'proc_2',
                    title: 'The Breaking Point',
                    visual: '💥',
                    narrative: `Your commitment sends ripples through the timestream. Tasks that were fading stabilize, becoming solid and achievable. The clock begins ticking forward—slowly, then faster. But the Temporal Guardian appears, a manifestation of the comfort zone that resists change.`,
                    emotion: 'determination',
                    combat: {
                        enemy: 'Temporal Guardian',
                        enemyIcon: '🕰️',
                        enemyDesc: 'Protector of the comfort zone, fears completion',
                        health: 130,
                        weakness: 'commitment'
                    }
                },
                {
                    id: 'proc_3',
                    title: 'The Analysis Loop',
                    visual: '🔄',
                    narrative: `Understanding becomes another form of delay. The loop tightens, showing you the same moment from slightly different angles. You realize that knowledge without action is just another trap. A puzzle forms before you—actions that must be taken in the correct order to break free.`,
                    emotion: 'confusion',
                    puzzle: {
                        type: 'sequence',
                        difficulty: 3,
                        reward: 'Break the temporal recursion'
                    }
                }
            ],
            resolution: {
                success: `The temporal loops have been broken. The mind's owner will find that starting tasks becomes easier than continuing to delay. The weight of unfinished business lifts, replaced by the satisfaction of completion.`,
                reward: { integrity: 10, stability: 20 }
            }
        },
        {
            id: 'traumatized',
            name: 'THE TRAUMATIZED MIND',
            icon: '💔',
            desc: 'Fragmented memories and emotional storms. No enemies, only triggers to navigate with care.',
            status: 'locked',
            color: '#9d00ff',
            scenes: [
                {
                    id: 'trauma_1',
                    title: 'The Memory Storm',
                    visual: '🌩️',
                    narrative: `You arrive in fragments. The environment shifts unpredictably—a childhood home dissolves into a hospital corridor, which becomes a darkened street. Emotional storms rage, distorting reality with waves of fear, grief, and anger. There are no enemies here, only environmental hazards that trigger painful memories.`,
                    emotion: 'fear',
                    memoryGame: {
                        fragments: [
                            { id: 'childhood', icon: '🧸', label: 'Innocence' },
                            { id: 'loss', icon: '💔', label: 'Loss' },
                            { id: 'survival', icon: '🛡️', label: 'Survival' },
                            { id: 'hope', icon: '🌱', label: 'Hope' }
                        ],
                        correctOrder: ['childhood', 'loss', 'survival', 'hope']
                    }
                }
            ],
            resolution: {
                success: `The memory fragments have been reintegrated. The trauma hasn't been erased—that would be impossible and cruel—but it has been contextualized, placed in its proper place as part of a larger narrative of survival and growth.`,
                reward: { integrity: 20, stability: 15 }
            }
        }
    ],

    // Abilities Data
    abilities: {
        focus: {
            name: 'FOCUS PULSE',
            icon: '🧠',
            cooldown: 15000,
            duration: 5000,
            description: 'Clears illusions and reveals true paths',
            effect: 'revealTruth'
        },
        freeze: {
            name: 'TIME FREEZE',
            icon: '⏳',
            cooldown: 20000,
            duration: 8000,
            description: 'Pauses unstable systems temporarily',
            effect: 'pauseTime'
        },
        rewind: {
            name: 'MEMORY REWIND',
            icon: '🔄',
            cooldown: 30000,
            description: 'Undo your last critical mistake',
            effect: 'undoLastAction'
        },
        link: {
            name: 'NEURAL LINK',
            icon: '🔌',
            cooldown: 10000,
            description: 'Connect with and control environment nodes',
            effect: 'controlNode'
        },
        truth: {
            name: 'TRUTH VISION',
            icon: '👁',
            cooldown: 25000,
            duration: 6000,
            description: 'Reveals hidden reality and secrets',
            effect: 'trueSight'
        }
    },

    // Achievements
    achievements: [
        { id: 'first_dive', name: 'First Dive', desc: 'Complete your first mind', icon: '🧠', unlocked: false },
        { id: 'null_hunter', name: 'Null Hunter', desc: 'Defeat 3 corruption manifestations', icon: '⚔️', unlocked: false },
        { id: 'truth_seeker', name: 'Truth Seeker', desc: 'Use Truth Vision 5 times', icon: '👁', unlocked: false },
        { id: 'mind_master', name: 'Mind Master', desc: 'Stabilize all 4 minds', icon: '🏆', unlocked: false },
        { id: 'pure_diver', name: 'Pure Diver', desc: 'Complete a mind with 0 corruption', icon: '✨', unlocked: false },
        { id: 'emotional_sync', name: 'Emotional Sync', desc: 'Match all emotional states in one session', icon: '💫', unlocked: false }
    ],

    // Loading Messages
    loadingMessages: [
        'Calibrating synaptic pathways...',
        'Establishing neural handshake...',
        'Synchronizing emotional frequencies...',
        'Mapping cognitive architecture...',
        'Initializing memory buffers...',
        'Loading personality matrix...',
        'Bypassing firewall protocols...',
        'Optimizing thought resolution...',
        'Connecting to subconscious layers...',
        'Preparing reality anchors...'
    ],

    // Narrative Flavor
    flavor: {
        enterMind: (mindName) => `Initializing dive into ${mindName}...`,
        combatStart: (enemy) => `CORRUPTION DETECTED: ${enemy} manifesting...`,
        puzzleStart: 'COGNITIVE REPAIR REQUIRED: Neural pathway damaged.',
        stabilityLow: 'WARNING: Mind stability critical. Extract recommended.',
        corruptionRising: 'ALERT: Null corruption spreading to your neural patterns.',
        abilityReady: (ability) => `${ability} online and ready for deployment.`,
        memoryFragment: 'Memory fragment recovered. Integration possible.'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameData;
}
'''

with open(f"{project_dir}/js/gameData.js", "w") as f:
    f.write(game_data_js)

print("✓ gameData.js created")
