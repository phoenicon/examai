/**
 * Psychology Topics Module
 * Defines AQA A-Level Psychology topics and relevant content
 */
const PsychologyTopics = {
  // Main AQA A-Level topics
  topics: [
    {
      id: 'social_influence',
      name: 'Social Influence',
      description: 'How people are affected by others, including conformity, obedience, and social change',
      keyStudies: [
        'Asch (1951) - Conformity to majority influence',
        'Milgram (1963) - Obedience to authority',
        'Zimbardo (1973) - Stanford Prison Experiment',
        'Moscovici (1969) - Minority influence'
      ],
      keyTheories: [
        'Social Impact Theory',
        'Dual Process Model of Conformity',
        'Agency Theory',
        'Social Identity Theory'
      ],
      examTips: 'Link studies to real-world examples. Compare different explanations for conformity and obedience.'
    },
    {
      id: 'memory',
      name: 'Memory',
      description: 'Processes involved in memory, including models, factors affecting accuracy, and eyewitness testimony',
      keyStudies: [
        'Miller (1956) - The magical number seven',
        'Baddeley & Hitch (1974) - Working memory model',
        'Loftus & Palmer (1974) - Eyewitness testimony',
        'Bartlett (1932) - Reconstructive memory'
      ],
      keyTheories: [
        'Multi-store Model of Memory',
        'Working Memory Model',
        'Levels of Processing Model',
        'Reconstructive Memory Theory'
      ],
      examTips: 'Use real-life applications of memory research. Evaluate methodological issues in memory studies.'
    },
    {
      id: 'attachment',
      name: 'Attachment',
      description: 'Formation, types, and effects of early attachment relationships on later development',
      keyStudies: [
        'Ainsworth (1969) - Strange Situation',
        'Bowlby (1944) - 44 Juvenile Thieves',
        'Harlow (1958) - Monkeys with surrogate mothers',
        'Romanian orphan studies'
      ],
      keyTheories: [
        'Bowlby\'s Theory of Attachment',
        'Learning Theory of Attachment',
        'Ainsworth\'s Classification of Attachment Types',
        'Internal Working Model'
      ],
      examTips: 'Discuss cultural variations in attachment. Critically evaluate the methodology of key studies.'
    },
    {
      id: 'psychopathology',
      name: 'Psychopathology',
      description: 'Definitions, explanations, and treatments for mental disorders',
      keyStudies: [
        'Beck (1979) - Cognitive therapy for depression',
        'Rosenhan (1973) - On being sane in insane places',
        'Butler et al. (2006) - Effectiveness of CBT',
        'Wolpe (1958) - Systematic desensitization'
      ],
      keyTheories: [
        'Biological approach to abnormality',
        'Cognitive approach to abnormality',
        'Behavioural approach to abnormality',
        'Medical model vs. psychological models'
      ],
      examTips: 'Compare effectiveness of different treatments. Consider ethical implications of diagnosis and treatment.'
    },
    {
      id: 'research_methods',
      name: 'Research Methods',
      description: 'Scientific processes, data handling, and research design in psychology',
      keyStudies: [
        'Various studies representing different methodologies',
        'Classic experiments illustrating research design',
        'Case studies and their limitations',
        'Meta-analyses of psychological research'
      ],
      keyTheories: [
        'Scientific method in psychology',
        'Quantitative vs. qualitative approaches',
        'Experimental designs',
        'Ethics in psychological research'
      ],
      examTips: 'Be able to identify strengths and weaknesses of research methods. Practice calculating statistical tests.'
    }
  ],
  
  // Get topic by ID
  getTopic: function(topicId) {
    return this.topics.find(topic => topic.id === topicId) || null;
  },
  
  // Get all topics
  getAllTopics: function() {
    return this.topics.map(topic => ({
      id: topic.id,
      name: topic.name,
      description: topic.description
    }));
  },
  
  // Get essential studies for a topic
  getKeyStudies: function(topicId) {
    const topic = this.getTopic(topicId);
    return topic ? topic.keyStudies : [];
  },
  
  // Get key theories for a topic
  getKeyTheories: function(topicId) {
    const topic = this.getTopic(topicId);
    return topic ? topic.keyTheories : [];
  }
};