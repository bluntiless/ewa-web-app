// City & Guilds unit interface
import { LearningOutcome, PerformanceCriteria, UnitType } from '../models/Unit';

export interface CityAndGuildsUnit {
  id: string;
  code: string;        // Internal code (e.g., "311")
  displayCode: string; // Display code (e.g., "Unit 311")
  title: string;
  isPerformanceUnit: boolean;
  progress?: number;
  creditValue?: number;
  glh?: number;        // Guided learning hours
  description?: string;
  learningOutcomes?: LearningOutcome[];
}

// Helper function to add status to all performance criteria
const addStatusToUnit = (unit: any): any => {
  if (!unit.learningOutcomes) return unit;
  
  const updatedLearningOutcomes = unit.learningOutcomes.map((lo: any) => {
    const updatedPerformanceCriteria = lo.performanceCriteria.map((pc: any) => ({
      ...pc,
      status: pc.status || "not-started"
    }));
    
    return {
      ...lo,
      performanceCriteria: updatedPerformanceCriteria
    };
  });
  
  return {
    ...unit,
    learningOutcomes: updatedLearningOutcomes
  };
};

// Performance Units for 2357
export const performanceUnits: CityAndGuildsUnit[] = [
  {
    id: "cg-311",
    code: "311",
    displayCode: "Unit 311",
    title: "Understanding and Applying Electrical Installation Design",
    isPerformanceUnit: true,
    progress: 0,
    creditValue: 12,
    glh: 105,
    description: "Application of the design and selection of appropriate systems and equipment",
    learningOutcomes: [
      {
        number: "1",
        title: "Understand requirements for design calculations for electrical installations",
        performanceCriteria: [
          { code: "1.1", description: "Determine the total connected load for electrical installations", status: "not-started" },
          { code: "1.2", description: "Calculate the current demand of electrical installations", status: "not-started" },
          { code: "1.3", description: "Determine the maximum demand of electrical installations", status: "not-started" },
          { code: "1.4", description: "Calculate the size of cables for electrical installations", status: "not-started" },
          { code: "1.5", description: "Calculate the earth fault loop impedance for electrical installations", status: "not-started" },
          { code: "1.6", description: "Calculate voltage drop in electrical installations", status: "not-started" }
        ]
      },
      {
        number: "2",
        title: "Understand the selection of appropriate wiring systems and equipment",
        performanceCriteria: [
          { code: "2.1", description: "Define the general characteristics of an electrical installation", status: "not-started" },
          { code: "2.2", description: "Select appropriate methods of overcurrent protection", status: "not-started" },
          { code: "2.3", description: "Select appropriate methods of protection against electric shock", status: "not-started" },
          { code: "2.4", description: "Select appropriate isolation and switching devices", status: "not-started" },
          { code: "2.5", description: "Select appropriate wiring systems for specific applications", status: "not-started" }
        ]
      },
      {
        number: "3",
        title: "Apply design procedures for electrical installations",
        performanceCriteria: [
          { code: "3.1", description: "Apply methodology for the design of electrical installations", status: "not-started" },
          { code: "3.2", description: "Verify that designs for electrical installations comply with all relevant requirements", status: "not-started" },
          { code: "3.3", description: "Prepare design documentation for electrical installations", status: "not-started" }
        ]
      }
    ]
  },
  {
    id: "cg-312",
    code: "312",
    displayCode: "Unit 312",
    title: "Installation of Electrical Equipment",
    isPerformanceUnit: true,
    progress: 0,
    creditValue: 5,
    glh: 40,
    description: "Installation of wiring systems and electrical equipment in accordance with regulations",
    learningOutcomes: [
      {
        number: "1",
        title: "Prepare to install electrical wiring systems and equipment",
        performanceCriteria: [
          { code: "1.1", description: "Inspect work location and identify risks and hazards prior to work", status: "not-started" },
          { code: "1.2", description: "Carry out safe isolation procedures as required", status: "not-started" },
          { code: "1.3", description: "Select appropriate tools and equipment for the installation", status: "not-started" },
          { code: "1.4", description: "Verify materials are in accordance with specification", status: "not-started" }
        ]
      },
      {
        number: "2",
        title: "Install electrical wiring systems and equipment",
        performanceCriteria: [
          { code: "2.1", description: "Install wiring systems in accordance with industry standards", status: "not-started" },
          { code: "2.2", description: "Install electrical equipment in accordance with specifications", status: "not-started" },
          { code: "2.3", description: "Position equipment and accessories in accordance with specifications", status: "not-started" },
          { code: "2.4", description: "Ensure installations meet all relevant regulations", status: "not-started" }
        ]
      },
      {
        number: "3",
        title: "Complete installation work",
        performanceCriteria: [
          { code: "3.1", description: "Check completed installation complies with specifications", status: "not-started" },
          { code: "3.2", description: "Reinstate work area to client satisfaction", status: "not-started" },
          { code: "3.3", description: "Complete required documentation for installation", status: "not-started" }
        ]
      }
    ]
  },
  {
    id: "cg-313",
    code: "313",
    displayCode: "Unit 313",
    title: "Electrical Cable Installation",
    isPerformanceUnit: true,
    progress: 0,
    creditValue: 5,
    glh: 40,
    description: "Installation of cables and wiring for electrical systems",
    learningOutcomes: [
      {
        number: "1",
        title: "Prepare for cable installation work",
        performanceCriteria: [
          { code: "1.1", description: "Carry out risk assessment for cable installation activities", status: "not-started" },
          { code: "1.2", description: "Select appropriate tools and equipment for cable installation", status: "not-started" },
          { code: "1.3", description: "Identify cable routes from specifications and drawings", status: "not-started" },
          { code: "1.4", description: "Verify cables are correct type and quantity for installation", status: "not-started" }
        ]
      },
      {
        number: "2",
        title: "Install electrical cables",
        performanceCriteria: [
          { code: "2.1", description: "Install containment systems for electrical cables", status: "not-started" },
          { code: "2.2", description: "Install cables of various types within containment systems", status: "not-started" },
          { code: "2.3", description: "Apply cable support methods in accordance with regulations", status: "not-started" },
          { code: "2.4", description: "Position and fix cables in accordance with specifications", status: "not-started" },
          { code: "2.5", description: "Maintain the integrity of cables during installation", status: "not-started" }
        ]
      },
      {
        number: "3",
        title: "Connect electrical cables and conductors",
        performanceCriteria: [
          { code: "3.1", description: "Prepare cables and conductors for termination", status: "not-started" },
          { code: "3.2", description: "Terminate cables using appropriate methods", status: "not-started" },
          { code: "3.3", description: "Connect conductors to equipment terminals", status: "not-started" },
          { code: "3.4", description: "Check connections for security and correct polarity", status: "not-started" }
        ]
      }
    ]
  },
  {
    id: "cg-315",
    code: "315",
    displayCode: "Unit 315",
    title: "Inspection, Testing and Commissioning",
    isPerformanceUnit: true,
    progress: 0,
    creditValue: 6,
    glh: 50,
    description: "Inspection, testing, commissioning and certification of electrical installations",
    learningOutcomes: [
      {
        number: "1",
        title: "Prepare for inspection and testing",
        performanceCriteria: [
          { code: "1.1", description: "Select appropriate test instruments for the installation", status: "not-started" },
          { code: "1.2", description: "Verify test instruments are fit for purpose and within calibration", status: "not-started" },
          { code: "1.3", description: "Carry out risk assessment for testing activities", status: "not-started" },
          { code: "1.4", description: "Apply safe isolation procedures", status: "not-started" }
        ]
      },
      {
        number: "2",
        title: "Carry out inspection of electrical installations",
        performanceCriteria: [
          { code: "2.1", description: "Perform visual inspection in accordance with IET Wiring Regulations", status: "not-started" },
          { code: "2.2", description: "Complete inspection schedule documentation accurately", status: "not-started" },
          { code: "2.3", description: "Identify non-compliances in the installation", status: "not-started" }
        ]
      },
      {
        number: "3",
        title: "Carry out testing of electrical installations",
        performanceCriteria: [
          { code: "3.1", description: "Apply appropriate sequence of tests in accordance with regulations", status: "not-started" },
          { code: "3.2", description: "Conduct continuity tests on protective conductors", status: "not-started" },
          { code: "3.3", description: "Conduct insulation resistance tests", status: "not-started" },
          { code: "3.4", description: "Verify polarity throughout the installation", status: "not-started" },
          { code: "3.5", description: "Measure earth fault loop impedance", status: "not-started" },
          { code: "3.6", description: "Test operation of residual current devices", status: "not-started" },
          { code: "3.7", description: "Complete test results schedule documentation", status: "not-started" }
        ]
      },
      {
        number: "4",
        title: "Commission electrical installations",
        performanceCriteria: [
          { code: "4.1", description: "Carry out functional testing of electrical systems", status: "not-started" },
          { code: "4.2", description: "Verify the installation meets client specifications", status: "not-started" },
          { code: "4.3", description: "Complete required certification documentation", status: "not-started" },
          { code: "4.4", description: "Provide user instructions and information for the installation", status: "not-started" }
        ]
      }
    ]
  },
  {
    id: "cg-316",
    code: "316",
    displayCode: "Unit 316",
    title: "Diagnosing and Correcting Electrical Faults",
    isPerformanceUnit: true,
    progress: 0,
    creditValue: 5,
    glh: 40,
    description: "Diagnosing and correcting electrical faults in electrical installations",
    learningOutcomes: [
      {
        number: "1",
        title: "Prepare to diagnose and correct electrical faults",
        performanceCriteria: [
          { code: "1.1", description: "Gather information about reported faults from appropriate sources", status: "not-started" },
          { code: "1.2", description: "Carry out risk assessment for fault diagnosis activities", status: "not-started" },
          { code: "1.3", description: "Select appropriate tools and test equipment", status: "not-started" },
          { code: "1.4", description: "Apply safe isolation procedures as required", status: "not-started" }
        ]
      },
      {
        number: "2",
        title: "Diagnose electrical faults",
        performanceCriteria: [
          { code: "2.1", description: "Apply logical fault-finding techniques and procedures", status: "not-started" },
          { code: "2.2", description: "Use appropriate test instruments to locate faults", status: "not-started" },
          { code: "2.3", description: "Interpret test results correctly to identify faults", status: "not-started" },
          { code: "2.4", description: "Determine the cause of faults in electrical installations", status: "not-started" }
        ]
      },
      {
        number: "3",
        title: "Correct electrical faults",
        performanceCriteria: [
          { code: "3.1", description: "Select appropriate methods to rectify identified faults", status: "not-started" },
          { code: "3.2", description: "Repair or replace faulty equipment and components", status: "not-started" },
          { code: "3.3", description: "Verify the installation is safe following fault correction", status: "not-started" },
          { code: "3.4", description: "Carry out appropriate testing after fault correction", status: "not-started" },
          { code: "3.5", description: "Complete required documentation for fault diagnosis and repair", status: "not-started" }
        ]
      }
    ]
  },
  // Add remaining performance units with learning outcomes
  {
    id: "cg-317",
    code: "317",
    displayCode: "Unit 317",
    title: "Electrical Systems Design",
    isPerformanceUnit: true,
    progress: 0,
    creditValue: 7,
    glh: 60,
    description: "Advanced electrical systems design for complex installations",
    learningOutcomes: [
      {
        number: "1",
        title: "Understand client requirements for electrical system design",
        performanceCriteria: [
          { code: "1.1", description: "Interpret client specifications for electrical systems", status: "not-started" },
          { code: "1.2", description: "Perform site surveys for electrical system design", status: "not-started" },
          { code: "1.3", description: "Identify constraints affecting electrical system design", status: "not-started" }
        ]
      },
      {
        number: "2",
        title: "Design electrical systems for complex installations",
        performanceCriteria: [
          { code: "2.1", description: "Calculate load requirements for complex electrical systems", status: "not-started" },
          { code: "2.2", description: "Determine protection requirements for electrical systems", status: "not-started" },
          { code: "2.3", description: "Select appropriate equipment and components", status: "not-started" },
          { code: "2.4", description: "Produce electrical schematic diagrams", status: "not-started" },
          { code: "2.5", description: "Ensure designs comply with current regulations", status: "not-started" }
        ]
      },
      {
        number: "3",
        title: "Produce electrical system design documentation",
        performanceCriteria: [
          { code: "3.1", description: "Prepare detailed specifications for electrical systems", status: "not-started" },
          { code: "3.2", description: "Create installation drawings and schedules", status: "not-started" },
          { code: "3.3", description: "Develop testing and commissioning procedures", status: "not-started" },
          { code: "3.4", description: "Produce operation and maintenance documentation", status: "not-started" }
        ]
      }
    ]
  },
  {
    id: "cg-318",
    code: "318",
    displayCode: "Unit 318",
    title: "Electric Vehicle Charging Equipment",
    isPerformanceUnit: true,
    progress: 0,
    creditValue: 5,
    glh: 40,
    description: "Installation and commissioning of electric vehicle charging equipment",
    learningOutcomes: [
      {
        number: "1",
        title: "Understand electric vehicle charging equipment",
        performanceCriteria: [
          { code: "1.1", description: "Identify different types of electric vehicle charging equipment", status: "not-started" },
          { code: "1.2", description: "Explain regulatory requirements for EV charging installations", status: "not-started" },
          { code: "1.3", description: "Interpret manufacturer specifications for charging equipment", status: "not-started" }
        ]
      },
      {
        number: "2",
        title: "Install electric vehicle charging equipment",
        performanceCriteria: [
          { code: "2.1", description: "Assess installation location requirements", status: "not-started" },
          { code: "2.2", description: "Select appropriate circuit protection devices", status: "not-started" },
          { code: "2.3", description: "Install EV charging equipment according to regulations", status: "not-started" },
          { code: "2.4", description: "Connect EV charging equipment to electrical supply", status: "not-started" }
        ]
      },
      {
        number: "3",
        title: "Commission and test EV charging equipment",
        performanceCriteria: [
          { code: "3.1", description: "Conduct pre-commissioning checks of installation", status: "not-started" },
          { code: "3.2", description: "Perform electrical tests on charging installation", status: "not-started" },
          { code: "3.3", description: "Verify correct operation of charging equipment", status: "not-started" },
          { code: "3.4", description: "Complete installation and testing documentation", status: "not-started" },
          { code: "3.5", description: "Provide client instruction on equipment operation", status: "not-started" }
        ]
      }
    ]
  },
  {
    id: "cg-399",
    code: "399",
    displayCode: "Unit 399",
    title: "Electrotechnical Occupational Competence (RPL)",
    isPerformanceUnit: true,
    progress: 0,
    creditValue: 15,
    glh: 120,
    description: "Recognition of Prior Learning for electrical installation competence",
    learningOutcomes: [
      {
        number: "1",
        title: "Demonstrate competence in electrical installation practices",
        performanceCriteria: [
          { code: "1.1", description: "Provide evidence of practical electrical installation work", status: "not-started" },
          { code: "1.2", description: "Demonstrate compliance with health and safety requirements", status: "not-started" },
          { code: "1.3", description: "Show evidence of adherence to current regulations", status: "not-started" }
        ]
      },
      {
        number: "2",
        title: "Present evidence of technical knowledge",
        performanceCriteria: [
          { code: "2.1", description: "Demonstrate understanding of electrical principles", status: "not-started" },
          { code: "2.2", description: "Show knowledge of installation design requirements", status: "not-started" },
          { code: "2.3", description: "Present evidence of inspection and testing competence", status: "not-started" }
        ]
      },
      {
        number: "3",
        title: "Verify professional competence through assessment",
        performanceCriteria: [
          { code: "3.1", description: "Complete professional discussion with assessor", status: "not-started" },
          { code: "3.2", description: "Pass practical assessment activities", status: "not-started" },
          { code: "3.3", description: "Satisfy knowledge assessment requirements", status: "not-started" }
        ]
      }
    ]
  }
];

// Knowledge Units for 2357 with detailed learning outcomes added
export const knowledgeUnits: CityAndGuildsUnit[] = [
  {
    id: "cg-601",
    code: "601",
    displayCode: "Unit 601",
    title: "Health and Safety in Building Services Engineering",
    isPerformanceUnit: false,
    progress: 0,
    creditValue: 12,
    glh: 100,
    description: "Understanding health and safety legislation and practices in electrical installation work",
    learningOutcomes: [
      {
        number: "1",
        title: "Understand health and safety legislation",
        performanceCriteria: [
          { code: "1.1", description: "Describe key health and safety legislation relevant to electrical work", status: "not-started" },
          { code: "1.2", description: "Explain employer responsibilities under health and safety legislation", status: "not-started" },
          { code: "1.3", description: "Explain employee responsibilities under health and safety legislation", status: "not-started" },
          { code: "1.4", description: "Describe enforcement of health and safety legislation", status: "not-started" }
        ]
      },
      {
        number: "2",
        title: "Understand risk assessment processes",
        performanceCriteria: [
          { code: "2.1", description: "Explain the purpose of risk assessments", status: "not-started" },
          { code: "2.2", description: "Describe the process of conducting a risk assessment", status: "not-started" },
          { code: "2.3", description: "Identify common hazards in electrical installation work", status: "not-started" },
          { code: "2.4", description: "Describe appropriate control measures for identified hazards", status: "not-started" }
        ]
      },
      {
        number: "3",
        title: "Understand safe working practices",
        performanceCriteria: [
          { code: "3.1", description: "Explain safe isolation procedures for electrical installations", status: "not-started" },
          { code: "3.2", description: "Describe correct use of personal protective equipment (PPE)", status: "not-started" },
          { code: "3.3", description: "Outline procedures for working at height", status: "not-started" },
          { code: "3.4", description: "Describe safe manual handling techniques", status: "not-started" },
          { code: "3.5", description: "Explain emergency procedures for electrical incidents", status: "not-started" }
        ]
      }
    ]
  },
  {
    id: "cg-602",
    code: "602",
    displayCode: "Unit 602",
    title: "Understanding Environmental Protection Methods",
    isPerformanceUnit: false,
    progress: 0,
    creditValue: 10,
    glh: 80,
    description: "Understanding environmental legislation, waste management, and renewable technologies",
    learningOutcomes: [
      {
        number: "1",
        title: "Understand environmental legislation",
        performanceCriteria: [
          { code: "1.1", description: "Outline key environmental legislation relevant to electrical work", status: "not-started" },
          { code: "1.2", description: "Explain requirements of the Waste Electrical and Electronic Equipment (WEEE) regulations", status: "not-started" },
          { code: "1.3", description: "Describe responsibilities under environmental protection legislation", status: "not-started" }
        ]
      },
      {
        number: "2",
        title: "Understand waste management in electrical work",
        performanceCriteria: [
          { code: "2.1", description: "Identify different categories of waste in electrical work", status: "not-started" },
          { code: "2.2", description: "Describe correct waste disposal methods for electrical materials", status: "not-started" },
          { code: "2.3", description: "Explain procedures for handling and disposing of hazardous waste", status: "not-started" },
          { code: "2.4", description: "Outline waste reduction and recycling methods", status: "not-started" }
        ]
      },
      {
        number: "3",
        title: "Understand renewable energy technologies",
        performanceCriteria: [
          { code: "3.1", description: "Identify different types of renewable energy systems", status: "not-started" },
          { code: "3.2", description: "Explain basic principles of photovoltaic systems", status: "not-started" },
          { code: "3.3", description: "Describe basic principles of wind energy systems", status: "not-started" },
          { code: "3.4", description: "Outline principles of heat pump technology", status: "not-started" },
          { code: "3.5", description: "Explain benefits of renewable energy technologies", status: "not-started" }
        ]
      }
    ]
  },
  // Add remaining knowledge units
  {
    id: "cg-603",
    code: "603",
    displayCode: "Unit 603",
    title: "Understanding Scientific Principles",
    isPerformanceUnit: false,
    progress: 0,
    creditValue: 12,
    glh: 100,
    description: "Understanding mathematical and scientific principles for electrical installation",
    learningOutcomes: [
      {
        number: "1",
        title: "Understand mathematical principles in electrical work",
        performanceCriteria: [
          { code: "1.1", description: "Apply mathematical calculations to electrical problems", status: "not-started" },
          { code: "1.2", description: "Perform calculations involving electrical formulae", status: "not-started" },
          { code: "1.3", description: "Calculate values using Ohm's Law", status: "not-started" },
          { code: "1.4", description: "Perform power calculations for electrical circuits", status: "not-started" }
        ]
      },
      {
        number: "2",
        title: "Understand principles of electricity",
        performanceCriteria: [
          { code: "2.1", description: "Explain the nature of electric current", status: "not-started" },
          { code: "2.2", description: "Describe the principles of electrical circuits", status: "not-started" },
          { code: "2.3", description: "Explain the differences between AC and DC systems", status: "not-started" },
          { code: "2.4", description: "Describe the relationship between magnetism and electricity", status: "not-started" }
        ]
      },
      {
        number: "3",
        title: "Understand electrical components and their properties",
        performanceCriteria: [
          { code: "3.1", description: "Explain the function of resistors in electrical circuits", status: "not-started" },
          { code: "3.2", description: "Describe the properties of capacitors", status: "not-started" },
          { code: "3.3", description: "Explain the principles of inductors", status: "not-started" },
          { code: "3.4", description: "Describe the operation of transformers", status: "not-started" },
          { code: "3.5", description: "Explain semiconductor principles", status: "not-started" }
        ]
      }
    ]
  },
  {
    id: "cg-604",
    code: "604",
    displayCode: "Unit 604",
    title: "Understanding Planning Methods",
    isPerformanceUnit: false,
    progress: 0,
    creditValue: 8,
    glh: 70,
    description: "Planning and organization of electrical installation work",
    learningOutcomes: [
      {
        number: "1",
        title: "Understand planning requirements for electrical work",
        performanceCriteria: [
          { code: "1.1", description: "Interpret specifications and drawings for electrical installations", status: "not-started" },
          { code: "1.2", description: "Identify resource requirements for installation work", status: "not-started" },
          { code: "1.3", description: "Estimate time requirements for installation tasks", status: "not-started" },
          { code: "1.4", description: "Describe coordination with other trades", status: "not-started" }
        ]
      },
      {
        number: "2",
        title: "Understand documentation requirements",
        performanceCriteria: [
          { code: "2.1", description: "Identify documentation needed for electrical installation work", status: "not-started" },
          { code: "2.2", description: "Explain content requirements for method statements", status: "not-started" },
          { code: "2.3", description: "Describe documentation for material requisitions", status: "not-started" },
          { code: "2.4", description: "Outline requirements for work schedules", status: "not-started" }
        ]
      },
      {
        number: "3",
        title: "Understand work quality assurance",
        performanceCriteria: [
          { code: "3.1", description: "Explain quality control procedures for electrical work", status: "not-started" },
          { code: "3.2", description: "Identify key stages for quality checks", status: "not-started" },
          { code: "3.3", description: "Describe procedures for dealing with defects", status: "not-started" },
          { code: "3.4", description: "Explain importance of continuous improvement", status: "not-started" }
        ]
      }
    ]
  },
  // Knowledge units continued
  {
    id: "cg-605",
    code: "605",
    displayCode: "Unit 605",
    title: "Understanding Maintenance Methods",
    isPerformanceUnit: false,
    progress: 0,
    creditValue: 8,
    glh: 70,
    description: "Maintenance of electrical systems and equipment",
    learningOutcomes: [
      {
        number: "1",
        title: "Understand maintenance requirements",
        performanceCriteria: [
          { code: "1.1", description: "Explain different types of maintenance strategies", status: "not-started" },
          { code: "1.2", description: "Describe planned preventative maintenance procedures", status: "not-started" },
          { code: "1.3", description: "Explain reactive maintenance procedures", status: "not-started" },
          { code: "1.4", description: "Identify maintenance schedules for electrical systems", status: "not-started" }
        ]
      },
      {
        number: "2",
        title: "Understand maintenance procedures",
        performanceCriteria: [
          { code: "2.1", description: "Describe safe isolation procedures for maintenance work", status: "not-started" },
          { code: "2.2", description: "Explain maintenance requirements for distribution equipment", status: "not-started" },
          { code: "2.3", description: "Describe maintenance of protective devices", status: "not-started" },
          { code: "2.4", description: "Outline maintenance procedures for electrical machines", status: "not-started" }
        ]
      },
      {
        number: "3",
        title: "Understand maintenance documentation",
        performanceCriteria: [
          { code: "3.1", description: "Identify documentation required for maintenance activities", status: "not-started" },
          { code: "3.2", description: "Explain the importance of maintenance records", status: "not-started" },
          { code: "3.3", description: "Describe procedures for reporting maintenance issues", status: "not-started" },
          { code: "3.4", description: "Outline requirements for maintenance certification", status: "not-started" }
        ]
      }
    ]
  },
  {
    id: "cg-606",
    code: "606",
    displayCode: "Unit 606",
    title: "Understanding Installation Methods",
    isPerformanceUnit: false,
    progress: 0,
    creditValue: 9,
    glh: 80,
    description: "Understanding methods for electrical installation work",
    learningOutcomes: [
      {
        number: "1",
        title: "Understand installation planning",
        performanceCriteria: [
          { code: "1.1", description: "Explain the importance of installation planning", status: "not-started" },
          { code: "1.2", description: "Describe the interpretation of installation specifications", status: "not-started" },
          { code: "1.3", description: "Identify resource requirements for installation work", status: "not-started" },
          { code: "1.4", description: "Explain coordination with other trades", status: "not-started" }
        ]
      },
      {
        number: "2",
        title: "Understand wiring systems",
        performanceCriteria: [
          { code: "2.1", description: "Describe different types of wiring systems", status: "not-started" },
          { code: "2.2", description: "Explain selection criteria for wiring systems", status: "not-started" },
          { code: "2.3", description: "Describe installation methods for various wiring systems", status: "not-started" },
          { code: "2.4", description: "Outline requirements for different installation environments", status: "not-started" }
        ]
      },
      {
        number: "3",
        title: "Understand equipment installation",
        performanceCriteria: [
          { code: "3.1", description: "Describe installation methods for distribution equipment", status: "not-started" },
          { code: "3.2", description: "Explain installation requirements for control equipment", status: "not-started" },
          { code: "3.3", description: "Outline installation procedures for protective devices", status: "not-started" },
          { code: "3.4", description: "Describe special installation requirements for specific locations", status: "not-started" }
        ]
      }
    ]
  },
  {
    id: "cg-607",
    code: "607",
    displayCode: "Unit 607",
    title: "Understanding Termination Methods",
    isPerformanceUnit: false,
    progress: 0,
    creditValue: 7,
    glh: 60,
    description: "Understanding methods for termination and connection of conductors",
    learningOutcomes: [
      {
        number: "1",
        title: "Understand conductor types and properties",
        performanceCriteria: [
          { code: "1.1", description: "Identify different types of conductors and cables", status: "not-started" },
          { code: "1.2", description: "Explain properties of different conductor materials", status: "not-started" },
          { code: "1.3", description: "Describe cable construction and components", status: "not-started" },
          { code: "1.4", description: "Outline conductor sizing principles", status: "not-started" }
        ]
      },
      {
        number: "2",
        title: "Understand termination methods",
        performanceCriteria: [
          { code: "2.1", description: "Describe different types of termination methods", status: "not-started" },
          { code: "2.2", description: "Explain selection criteria for termination methods", status: "not-started" },
          { code: "2.3", description: "Outline tools and equipment for terminations", status: "not-started" },
          { code: "2.4", description: "Describe preparation requirements for conductors", status: "not-started" }
        ]
      },
      {
        number: "3",
        title: "Understand connection requirements",
        performanceCriteria: [
          { code: "3.1", description: "Explain requirements for secure connections", status: "not-started" },
          { code: "3.2", description: "Describe polarity requirements for connections", status: "not-started" },
          { code: "3.3", description: "Outline testing procedures for terminations", status: "not-started" },
          { code: "3.4", description: "Explain documentation requirements for connections", status: "not-started" }
        ]
      }
    ]
  },
  {
    id: "cg-608",
    code: "608",
    displayCode: "Unit 608",
    title: "Understanding Inspection and Testing",
    isPerformanceUnit: false,
    progress: 0,
    creditValue: 9,
    glh: 80,
    description: "Understanding principles of inspection, testing and commissioning",
    learningOutcomes: [
      {
        number: "1",
        title: "Understand inspection requirements",
        performanceCriteria: [
          { code: "1.1", description: "Explain the purpose of inspection", status: "not-started" },
          { code: "1.2", description: "Describe the inspection process", status: "not-started" },
          { code: "1.3", description: "Identify items to be inspected", status: "not-started" },
          { code: "1.4", description: "Explain documentation for inspection", status: "not-started" }
        ]
      },
      {
        number: "2",
        title: "Understand testing principles",
        performanceCriteria: [
          { code: "2.1", description: "Describe test sequence requirements", status: "not-started" },
          { code: "2.2", description: "Explain principles of continuity testing", status: "not-started" },
          { code: "2.3", description: "Describe insulation resistance testing", status: "not-started" },
          { code: "2.4", description: "Explain earth fault loop impedance testing", status: "not-started" },
          { code: "2.5", description: "Describe RCD testing principles", status: "not-started" },
          { code: "2.6", description: "Outline polarity testing requirements", status: "not-started" }
        ]
      },
      {
        number: "3",
        title: "Understand commissioning and certification",
        performanceCriteria: [
          { code: "3.1", description: "Explain commissioning procedures", status: "not-started" },
          { code: "3.2", description: "Describe certification requirements", status: "not-started" },
          { code: "3.3", description: "Outline documentation for certification", status: "not-started" },
          { code: "3.4", description: "Explain handover procedures", status: "not-started" }
        ]
      }
    ]
  },
  {
    id: "cg-609",
    code: "609",
    displayCode: "Unit 609",
    title: "Understanding Fault Diagnosis and Rectification",
    isPerformanceUnit: false,
    progress: 0,
    creditValue: 8,
    glh: 70,
    description: "Understanding methods for diagnosing and correcting electrical faults",
    learningOutcomes: [
      {
        number: "1",
        title: "Understand fault types and characteristics",
        performanceCriteria: [
          { code: "1.1", description: "Identify common types of electrical faults", status: "not-started" },
          { code: "1.2", description: "Explain characteristics of different fault types", status: "not-started" },
          { code: "1.3", description: "Describe causes of electrical faults", status: "not-started" },
          { code: "1.4", description: "Outline effects of electrical faults", status: "not-started" }
        ]
      },
      {
        number: "2",
        title: "Understand fault diagnosis methods",
        performanceCriteria: [
          { code: "2.1", description: "Describe systematic fault diagnosis procedures", status: "not-started" },
          { code: "2.2", description: "Explain test instrument selection for fault diagnosis", status: "not-started" },
          { code: "2.3", description: "Outline safe working procedures during diagnosis", status: "not-started" },
          { code: "2.4", description: "Describe information gathering for fault diagnosis", status: "not-started" }
        ]
      },
      {
        number: "3",
        title: "Understand fault rectification",
        performanceCriteria: [
          { code: "3.1", description: "Explain repair methods for different fault types", status: "not-started" },
          { code: "3.2", description: "Describe component replacement procedures", status: "not-started" },
          { code: "3.3", description: "Outline testing after fault rectification", status: "not-started" },
          { code: "3.4", description: "Explain documentation requirements for fault repairs", status: "not-started" }
        ]
      }
    ]
  }
];

// Apply the status to all units
const updatedPerformanceUnits = performanceUnits.map(addStatusToUnit);
const updatedKnowledgeUnits = knowledgeUnits.map(addStatusToUnit);

// Combined units for UI display
export const units2357: CityAndGuildsUnit[] = [
  ...updatedPerformanceUnits,
  ...updatedKnowledgeUnits
];

// Helper function to get a unit by code
export function getUnitByCode(code: string): CityAndGuildsUnit | undefined {
  // Handle both formats: "311" and "Unit 311"
  const searchCode = code.replace("Unit ", "");
  return units2357.find(unit => 
    unit.code === searchCode || 
    unit.displayCode === code
  );
} 