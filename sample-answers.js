/**
 * Sample Answers Module
 * Provides example 16-mark answers for reference
 */
const SampleAnswers = {
  // Collection of sample answers
  answers: [
    {
      id: 'sa_social_1',
      topic: 'social_influence',
      question: 'Discuss explanations of conformity. [16 marks]',
      answer: `Conformity is a type of social influence where individuals change their behavior or beliefs to match those of others. This essay will discuss informational and normative explanations of conformity, evaluating their strengths and limitations.

Informational social influence explains conformity as occurring because people look to others for guidance in uncertain situations. According to this explanation, people conform because they believe others have more knowledge or information than they do. Deutsch and Gerard (1955) described this as informational influence, where we accept information from others as evidence about reality. This is supported by Sherif's (1935) autokinetic effect study, where participants in an ambiguous situation (judging how far a light moved in a dark room) conformed to group estimates because they lacked a clear frame of reference. Similarly, in real life, we might follow others' actions in unfamiliar situations, such as which cutlery to use at a formal dinner.

A strength of the informational explanation is that it explains private acceptance – people genuinely believe the group is correct and internalize the change. This is supported by Sherif finding that participants maintained their conformity even when tested alone later. However, a limitation is that it doesn't fully explain why people conform in situations where the correct answer is obvious, as demonstrated in Asch's line study where participants conformed despite clear visual evidence.

Normative social influence offers an alternative explanation, suggesting that people conform to be accepted and avoid rejection. Deutsch and Gerard (1955) described this as normative influence, conforming to meet others' expectations and gain social approval. Asch's (1951) line study supports this, as participants gave obviously incorrect answers to match the unanimous majority, likely to avoid social disapproval. When asked why they conformed, many participants cited fear of being ridiculed or standing out.

This explanation is strengthened by research showing that conformity decreases when participants can respond privately. Asch found conformity dropped from 32% to 12.5% when participants wrote their answers rather than announcing them publicly. However, a limitation is that it focuses primarily on social pressure and may underestimate the role of individual differences. For example, Asch found considerable variation in conformity rates, with some participants never conforming.

More recent explanations incorporate social identity theory (Tajfel and Turner, 1979), suggesting that conformity depends on group identification. People are more likely to conform to in-group members because they have internalized group norms as part of their identity. This explains why conformity rates vary across cultures, with collectivist cultures showing higher conformity than individualist ones (Bond and Smith, 1996).

In conclusion, while informational influence explains conformity in ambiguous situations and normative influence accounts for conformity due to social pressure, a comprehensive explanation needs to consider both processes alongside factors such as culture and group identification. The relative importance of each factor likely depends on the specific situation and individual differences in susceptibility to social influence.`,
      marks: 16,
      strengths: [
        'Comprehensive coverage of normative and informational influence',
        'Effective use of studies to support explanations',
        'Good evaluation of each explanation',
        'Clear application to real-life examples',
        'Well-structured with introduction and conclusion'
      ],
      improvements: []
    },
    {
      id: 'sa_memory_1',
      topic: 'memory',
      question: 'Outline and evaluate the multi-store model of memory. [16 marks]',
      answer: `The multi-store model of memory was proposed by Atkinson and Shiffrin (1968) and suggests that memory consists of three separate stores: sensory memory, short-term memory (STM), and long-term memory (LTM). This essay will outline the model and evaluate its strengths and limitations.

According to this model, information first enters sensory memory, which has a large capacity but can only hold information for a very brief period (less than 1 second for visual information). If we pay attention to this information, it passes to the short-term memory, which has a limited capacity of 7±2 items (Miller, 1956) and can hold information for approximately 18-30 seconds without rehearsal. Through rehearsal, information can then be transferred to long-term memory, which has potentially unlimited capacity and duration.

Each store has different encoding characteristics. Sensory memory is thought to be primarily visual (iconic) or auditory (echoic), STM primarily acoustic, and LTM mainly semantic. The model also proposes that information flows in a linear fashion between these stores through processes of attention and rehearsal.

The multi-store model is supported by various studies. For example, Peterson and Peterson (1959) demonstrated the limited duration of STM by asking participants to remember trigrams (three-letter sequences) while counting backward in threes. After just 18 seconds, recall dropped to 10%, supporting the idea of rapid decay in STM without rehearsal. Similarly, case studies of patients with brain damage provide evidence for separate memory stores. Patient HM, who had his hippocampus removed, could no longer form new long-term memories but retained intact STM, suggesting these are indeed separate systems.

A strength of the model is its simplicity, providing a clear framework that has generated extensive research into memory processes. Additionally, it explains common memory phenomena such as the primacy effect (better recall of words at the beginning of a list due to transfer to LTM) and recency effect (better recall of words at the end of a list due to them still being in STM).

However, the model has several limitations. It presents memory as a passive, linear process rather than an active, constructive one. Baddeley and Hitch (1974) challenged the unitary nature of STM, proposing instead a working memory model with multiple components. Their research showed that people could perform two STM tasks simultaneously if they used different components of working memory, something not predicted by the multi-store model.

The model also oversimplifies encoding, as Craik and Lockhart (1972) demonstrated with their levels of processing theory. They found that the depth of processing, rather than rehearsal time, determined whether information transferred to LTM. Semantically processed information (focusing on meaning) was better remembered than phonologically processed information (focusing on sound), even with the same rehearsal time.

Another limitation is that the model focuses primarily on the structure of memory rather than the processes involved. It doesn't adequately explain how information is retrieved from LTM or the role of context and state-dependent memory. Tulving's distinction between episodic and semantic memory also suggests that LTM is more complex than proposed by the multi-store model.

In conclusion, while the multi-store model provides a useful framework for understanding memory and is supported by experimental and case study evidence, it oversimplifies the complexity of human memory. More recent models, such as working memory and levels of processing, have expanded upon and modified Atkinson and Shiffrin's original model to address its limitations.`,
      marks: 15,
      strengths: [
        'Detailed description of the model with all key components',
        'Good use of supporting evidence',
        'Effective evaluation with both strengths and limitations',
        'Well-structured response with clear introduction and conclusion'
      ],
      improvements: [
        'Could include more application to real-life memory situations',
        'Evaluation could be more developed with counterarguments'
      ]
    }
  ],
  
  // Get sample answer by ID
  getAnswer: function(answerId) {
    return this.answers.find(answer => answer.id === answerId) || null;
  },
  
  // Get sample answers by topic
  getAnswersByTopic: function(topicId) {
    return this.answers.filter(answer => answer.topic === topicId);
  },
  
  // Get all sample answers
  getAllAnswers: function() {
    return this.answers;
  }
};