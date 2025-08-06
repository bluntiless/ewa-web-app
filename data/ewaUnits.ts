import { Unit } from '../models/Unit'

export const allEWAUnits: Unit[] = [
  {
    id: 'netp3-01',
    code: 'NETP3-01',
    title: 'Health and Safety in Building Services Engineering',
    description: 'Understanding health and safety requirements, risk assessment, and safe working practices in electrical installation work.',
    level: 3,
    credits: 6,
    qualification: 'EWA',
    category: 'core',
    type: 'knowledge',
    status: 'completed',
    overallProgress: 100,
    learningOutcomes: [
      {
        id: 'LO1',
        title: 'Understand health and safety legislation',
        description: 'Know the key health and safety legislation applicable to building services engineering',
        performanceCriteria: [
          {
            id: '1.1',
            description: 'Identify relevant health and safety legislation',
            status: 'completed'
          },
          {
            id: '1.2', 
            description: 'Explain the responsibilities under health and safety law',
            status: 'completed'
          }
        ]
      },
      {
        id: 'LO2',
        title: 'Understand risk assessment procedures',
        description: 'Know how to conduct and document risk assessments',
        performanceCriteria: [
          {
            id: '2.1',
            description: 'Conduct risk assessments for electrical work',
            status: 'completed'
          },
          {
            id: '2.2',
            description: 'Document risk assessment findings',
            status: 'completed'
          }
        ]
      }
    ]
  },
  {
    id: 'netp3-02',
    code: 'NETP3-02',
    title: 'Electrical Science and Technology',
    description: 'Fundamental electrical principles, circuit analysis, and electrical technology applications.',
    level: 3,
    credits: 8,
    qualification: 'EWA',
    category: 'core',
    type: 'knowledge',
    status: 'in_progress',
    overallProgress: 65,
    learningOutcomes: [
      {
        id: 'LO1',
        title: 'Understand electrical principles',
        description: 'Know fundamental electrical principles and laws',
        performanceCriteria: [
          {
            id: '1.1',
            description: 'Apply Ohms law to electrical circuits',
            status: 'completed'
          },
          {
            id: '1.2',
            description: 'Calculate power in electrical circuits',
            status: 'in_progress'
          }
        ]
      }
    ]
  },
  {
    id: 'netp3-03',
    code: 'NETP3-03',
    title: 'Electrical Installation Technology',
    description: 'Installation methods, cable selection, protection devices, and electrical systems design.',
    level: 3,
    credits: 10,
    qualification: 'EWA',
    category: 'core',
    type: 'knowledge',
    status: 'not_started',
    overallProgress: 0,
    learningOutcomes: [
      {
        id: 'LO1',
        title: 'Understand installation methods',
        description: 'Know different electrical installation methods and techniques',
        performanceCriteria: [
          {
            id: '1.1',
            description: 'Select appropriate installation methods',
            status: 'not_started'
          },
          {
            id: '1.2',
            description: 'Identify cable types and applications',
            status: 'not_started'
          }
        ]
      }
    ]
  },
  {
    id: 'netp3-04',
    code: 'NETP3-04',
    title: 'Electrical Installation Design',
    description: 'Design principles for electrical installations, load calculations, and circuit design.',
    level: 3,
    credits: 8,
    qualification: 'EWA',
    category: 'specialist',
    type: 'knowledge',
    status: 'not_started',
    overallProgress: 0,
    learningOutcomes: [
      {
        id: 'LO1',
        title: 'Understand design principles',
        description: 'Know electrical installation design principles',
        performanceCriteria: [
          {
            id: '1.1',
            description: 'Calculate electrical loads',
            status: 'not_started'
          }
        ]
      }
    ]
  },
  {
    id: 'netp3-05',
    code: 'NETP3-05',
    title: 'Electrical Testing and Commissioning',
    description: 'Testing procedures, commissioning processes, and certification requirements.',
    level: 3,
    credits: 6,
    qualification: 'EWA',
    category: 'specialist',
    type: 'knowledge',
    status: 'not_started',
    overallProgress: 0,
    learningOutcomes: [
      {
        id: 'LO1',
        title: 'Understand testing procedures',
        description: 'Know electrical testing and verification procedures',
        performanceCriteria: [
          {
            id: '1.1',
            description: 'Perform electrical tests',
            status: 'not_started'
          }
        ]
      }
    ]
  },
  {
    id: 'netp3-06',
    code: 'NETP3-06',
    title: 'Project Management in Electrical Installation',
    description: 'Project planning, resource management, and quality assurance in electrical projects.',
    level: 3,
    credits: 4,
    qualification: 'EWA',
    category: 'project',
    type: 'knowledge',
    status: 'not_started',
    overallProgress: 0,
    learningOutcomes: [
      {
        id: 'LO1',
        title: 'Understand project management',
        description: 'Know project management principles for electrical work',
        performanceCriteria: [
          {
            id: '1.1',
            description: 'Plan electrical installation projects',
            status: 'not_started'
          }
        ]
      }
    ]
  },
  {
    id: '18ed3-02',
    code: '18ED3-02',
    title: 'Electrical Installation Work (RPL)',
    description: 'Recognition of Prior Learning for practical electrical installation experience.',
    level: 3,
    credits: 15,
    qualification: 'EWA',
    category: 'core',
    type: 'rpl',
    status: 'completed',
    overallProgress: 100,
    learningOutcomes: [
      {
        id: 'LO1',
        title: 'Demonstrate practical electrical skills',
        description: 'Evidence of competent electrical installation work',
        performanceCriteria: [
          {
            id: '1.1',
            description: 'Install electrical systems safely',
            status: 'completed'
          }
        ]
      }
    ]
  },
  {
    id: 'qit3-001',
    code: 'QIT3-001',
    title: 'Quality and Inspection Techniques (RPL)',
    description: 'Recognition of Prior Learning for quality assurance and inspection experience.',
    level: 3,
    credits: 5,
    qualification: 'EWA',
    category: 'specialist',
    type: 'rpl',
    status: 'completed',
    overallProgress: 100,
    learningOutcomes: [
      {
        id: 'LO1',
        title: 'Apply quality assurance techniques',
        description: 'Evidence of quality inspection and assurance skills',
        performanceCriteria: [
          {
            id: '1.1',
            description: 'Conduct quality inspections',
            status: 'completed'
          }
        ]
      }
    ]
  }
]

export const ewaUnits = allEWAUnits
export default allEWAUnits
