/**
 * Answer Templates Module
 * Provides structure templates for 16-mark answers
 */
const AnswerTemplates = {
  // Standard 16-mark answer template
  standard: {
    id: 'standard',
    name: 'Standard 16-Mark Structure',
    description: 'Balanced approach with introduction, main body, and conclusion',
    sections: [
      {
        name: 'Introduction',
        instructions: 'Define key terms and outline your approach (1-2 sentences)',
        example: 'This essay will discuss [topic] by examining [theory/study] and evaluating its strengths and limitations in relation to [context].',
        wordCount: '40-60'
      },
      {
        name: 'AO1: Knowledge',
        instructions: 'Describe relevant theories and studies in detail',
        example: 'According to [researcher], [theory] suggests that... This is supported by [study], which found that...',
        wordCount: '200-250'
      },
      {
        name: 'AO2: Application',
        instructions: 'Apply the theories to real-world scenarios or the specific question context',
        example: 'This theory can be applied to [scenario] because... For instance, when [example situation], the principles of [theory] explain why...',
        wordCount: '200-250'
      },
      {
        name: 'AO3: Evaluation',
        instructions: 'Critically evaluate the theories and evidence, considering methodological issues, alternative explanations, etc.',
        example: 'A strength of this explanation is... However, [theory/study] has been criticized for... An alternative explanation is provided by...',
        wordCount: '250-300'
      },
      {
        name: 'Conclusion',
        instructions: 'Summarize your main points and provide a balanced judgment',
        example: 'In conclusion, while [theory] offers valuable insights into [topic], the evidence suggests that... Overall, the most convincing explanation appears to be...',
        wordCount: '60-90'
      }
    ]
  },
  
  // Evaluation-focused template
  evaluative: {
    id: 'evaluative',
    name: 'Evaluation-Focused Structure',
    description: 'Places greater emphasis on critical analysis',
    sections: [
      {
        name: 'Introduction',
        instructions: 'Define key terms and state your evaluative approach',
        example: 'This essay will critically evaluate [topic] by examining the strengths and limitations of [theories/approaches].',
        wordCount: '40-60'
      },
      {
        name: 'Theory 1 + Immediate Evaluation',
        instructions: 'Present first theory/study and immediately evaluate it',
        example: '[Theory 1] proposes that... A strength of this theory is... However, it has been criticized for...',
        wordCount: '200-250'
      },
      {
        name: 'Theory 2 + Immediate Evaluation',
        instructions: 'Present second theory/study and immediately evaluate it',
        example: 'In contrast, [Theory 2] suggests that... This is supported by... Nevertheless, limitations include...',
        wordCount: '200-250'
      },
      {
        name: 'Comparative Evaluation',
        instructions: 'Compare and contrast the theories/studies directly',
        example: 'When comparing these explanations, [Theory 1] is more effective at explaining [aspect], while [Theory 2] better accounts for [different aspect]...',
        wordCount: '150-200'
      },
      {
        name: 'Real-World Application',
        instructions: 'Apply the theories to practical contexts or scenarios',
        example: 'These theories have important implications for [real-world context]. For example...',
        wordCount: '150-200'
      },
      {
        name: 'Conclusion',
        instructions: 'Provide a nuanced judgment based on your evaluation',
        example: 'In conclusion, the evidence suggests that [balanced judgment]. Future research should focus on...',
        wordCount: '60-90'
      }
    ]
  },
  
  // Debate-style template
  debate: {
    id: 'debate',
    name: 'Debate-Style Structure',
    description: 'Presents arguments for and against a position',
    sections: [
      {
        name: 'Introduction',
        instructions: 'Define key terms and outline the debate',
        example: 'This essay will examine the debate surrounding [topic], considering arguments both for and against [position/claim].',
        wordCount: '40-60'
      },
      {
        name: 'Arguments For',
        instructions: 'Present evidence and theories supporting the position',
        example: 'Several theories and studies support the view that... For example, [researcher] found that... Furthermore, [theory] suggests that...',
        wordCount: '200-250'
      },
      {
        name: 'Arguments Against',
        instructions: 'Present evidence and theories challenging the position',
        example: 'However, there is substantial evidence challenging this view. [Contradictory study] demonstrated that... Additionally, [alternative theory] proposes that...',
        wordCount: '200-250'
      },
      {
        name: 'Methodological Considerations',
        instructions: 'Evaluate the quality of evidence on both sides',
        example: 'When assessing the methodological quality of these studies, it\'s important to note that... Issues of validity include...',
        wordCount: '150-200'
      },
      {
        name: 'Synthesis and Integration',
        instructions: 'Explore how these perspectives might be reconciled',
        example: 'A more nuanced view might integrate aspects of both perspectives by... This is consistent with [integrative theory], which suggests...',
        wordCount: '150-200'
      },
      {
        name: 'Conclusion',
        instructions: 'Provide a balanced judgment on the debate',
        example: 'In conclusion, while there is evidence on both sides of this debate, the stronger case appears to be... Nevertheless, important questions remain about...',
        wordCount: '60-90'
      }
    ]
  },
  
  // Get a template by ID
  getTemplate: function(templateId) {
    if (!templateId) {
      throw new Error('Template ID is required');
    }
    
    switch(templateId) {
      case 'evaluative': return this.evaluative;
      case 'debate': return this.debate;
      case 'standard':
      default: return this.standard;
    }
  },
  
  // Get all available templates
  getAllTemplates: function() {
    return [
      {
        id: this.standard.id,
        name: this.standard.name,
        description: this.standard.description
      },
      {
        id: this.evaluative.id,
        name: this.evaluative.name,
        description: this.evaluative.description
      },
      {
        id: this.debate.id,
        name: this.debate.name,
        description: this.debate.description
      }
    ];
  },
  
  // Generate a template-based answer structure
  generateAnswerStructure: function(templateId, question, topic) {
    if (!templateId || !question || !topic) {
      throw new Error('Template ID, question, and topic are required');
    }
    
    try {
      const template = this.getTemplate(templateId);
      
      return {
        templateId: templateId,
        question: question,
        topic: topic,
        created: new Date(),
        lastModified: new Date(),
        sections: template.sections.map(section => ({
          name: section.name,
          instructions: section.instructions,
          wordCount: section.wordCount,
          content: '' // Empty content for user to fill
        }))
      };
    } catch (error) {
      console.error('Error generating answer structure:', error);
      throw new Error('Failed to generate answer structure: ' + error.message);
    }
  }
};

// Export the templates module
export default AnswerTemplates;