/**
 * Mark Schemes Module
 * Provides AQA marking criteria for 16-mark questions
 */
const MarkSchemes = {
  // Standard AQA 16-mark question mark scheme
  standard: {
    name: 'Standard 16-Mark Question',
    totalMarks: 16,
    assessmentObjectives: {
      AO1: 'Knowledge and understanding',
      AO2: 'Application to scenarios/contexts',
      AO3: 'Analysis and evaluation'
    },
    levels: [
      {
        level: 1,
        marks: '1-4',
        description: 'Basic knowledge of psychological concepts, theories or research. Superficial or limited application to the question. Limited analysis and evaluation. Response lacks coherence and structure.'
      },
      {
        level: 2,
        marks: '5-8',
        description: 'Reasonable knowledge of psychological concepts, theories or research. Some appropriate application to the question. Some appropriate analysis and evaluation. Response shows some coherence and structure.'
      },
      {
        level: 3,
        marks: '9-12',
        description: 'Detailed knowledge of psychological concepts, theories or research. Appropriate application to the question. Effective analysis and evaluation. Response is coherent and well structured.'
      },
      {
        level: 4,
        marks: '13-16',
        description: 'Accurate and comprehensive knowledge of psychological concepts, theories or research. Thorough application to the question. Effective analysis and evaluation with well-developed arguments. Response is coherent, well-structured, and uses specialist terminology appropriately.'
      }
    ],
    examinerTips: [
      'Ensure balance between AO1 (description), AO2 (application), and AO3 (evaluation)',
      'Use psychological terminology appropriately',
      'Include relevant studies and theories with specific details',
      'Develop evaluation points with clear arguments',
      'Structure your answer logically with a clear introduction and conclusion'
    ]
  },
  
  // Get detailed mark scheme for a specific level
  getLevelDetails: function(level) {
    return this.standard.levels.find(l => l.level === level) || null;
  },
  
  // Generate topic-specific marking guidance
  getTopicGuidance: function(topicId) {
    // Generic guidance that applies to most topics
    const genericGuidance = {
      highMarks: [
        'Accurate and detailed description of at least two theories/explanations',
        'Clear application to relevant scenarios or contexts',
        'Balanced evaluation with elaborated strengths and limitations',
        'Effective use of studies to support points',
        'Consideration of methodological, ethical, and practical issues',
        'Logical structure with clear conclusion'
      ],
      commonErrors: [
        'Descriptive rather than evaluative response',
        'Lack of specific studies or research evidence',
        'Superficial evaluation points without development',
        'Imbalanced answer focusing too heavily on one theory',
        'Lack of specialist terminology',
        'Weak conclusion that introduces new points'
      ]
    };
    
    // Topic-specific additions (could be expanded)
    const topicAdditions = {
      social_influence: {
        highMarks: [
          'Compare and contrast different types of social influence',
          'Discuss both individual and situational factors',
          'Include recent applications or real-world examples'
        ],
        commonErrors: [
          'Confusing compliance, conformity, and obedience',
          'Describing studies without linking to explanations',
          'Failing to consider cultural or historical contexts'
        ]
      },
      memory: {
        highMarks: [
          'Clear distinction between different memory models',
          'Discussion of practical applications (e.g., education, eyewitness testimony)',
          'Evaluation of research methods used to study memory'
        ],
        commonErrors: [
          'Describing memory models without comparison',
          'Focusing on studies rather than explanations',
          'Limited discussion of real-world implications'
        ]
      }
      // Additional topics could be added here
    };
    
    // Merge generic guidance with topic-specific guidance if available
    if (topicAdditions[topicId]) {
      return {
        highMarks: [...genericGuidance.highMarks, ...topicAdditions[topicId].highMarks],
        commonErrors: [...genericGuidance.commonErrors, ...topicAdditions[topicId].commonErrors]
      };
    }
    
    return genericGuidance;
  }
};