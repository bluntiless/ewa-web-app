// EAL NVQ 1605 units data file
// Contains all units with their Learning Outcomes and Performance Criteria
import { Unit, UnitType, LearningOutcome, PerformanceCriteria } from '../models/Unit';

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

export const ealNVQ1605Units = [
  {
    id: "ELTK3-001",
    code: "ELTK3-001",
    displayCode: "ELTK3/001",
    reference: "ELTK3-001",
    title: "Understanding Health and Safety Legislation and Working Practices",
    description: "Knowledge of health and safety in electrical installation",
    type: UnitType.NVQ,
    creditValue: 6,
    glh: 52,
    progress: 0,
    learningOutcomes: [
      {
        number: "1",
        title: "Health and Safety Legislation",
        performanceCriteria: [
          { code: "1.1", description: "Understand key health and safety legislation" },
          { code: "1.2", description: "Understand employer and employee responsibilities" },
          { code: "1.3", description: "Understand risk assessment requirements" },
          { code: "1.4", description: "Understand safe systems of work" }
        ]
      },
      {
        number: "2",
        title: "Safe Working Practices",
        performanceCriteria: [
          { code: "2.1", description: "Understand safe working procedures" },
          { code: "2.2", description: "Understand use of PPE and safety equipment" },
          { code: "2.3", description: "Understand safe manual handling techniques" },
          { code: "2.4", description: "Understand workplace hazard identification" }
        ]
      },
      {
        number: "3",
        title: "Emergency Procedures",
        performanceCriteria: [
          { code: "3.1", description: "Understand emergency procedures" },
          { code: "3.2", description: "Understand first aid requirements" },
          { code: "3.3", description: "Understand accident reporting procedures" },
          { code: "3.3", description: "Comply with hazard, warning, mandatory instruction and prohibition notices" },
          { code: "3.4", description: "Apply procedures to ensure the safety of the work location through the correct use of guards and notices" },
          { code: "3.5", description: "Use access equipment correctly" }
        ]
      }
    ]
  },
  {
    id: "ELTK3-002",
    code: "ELTK3-002",
    displayCode: "ELTK3/002",
    reference: "ELTK3-002",
    title: "Understanding Environmental Legislation, Working Practices and the Principles of Environmental Technology Systems",
    description: "Knowledge of environmental practices and technology systems",
    type: UnitType.NVQ,
    creditValue: 4,
    glh: 35,
    progress: 0,
    learningOutcomes: [
      {
        number: "1",
        title: "Environmental Legislation and Practice",
        performanceCriteria: [
          { code: "1.1", description: "Understand environmental legislation requirements" },
          { code: "1.2", description: "Understand environmental protection measures" },
          { code: "1.3", description: "Understand waste management procedures" }
        ]
      },
      {
        number: "2",
        title: "Environmental Technology Systems",
        performanceCriteria: [
          { code: "2.1", description: "Understand principles of environmental technology systems:" },
          { code: "2.1a", description: "Solar photovoltaic" },
          { code: "2.1b", description: "Wind energy" },
          { code: "2.1c", description: "Micro hydro" },
          { code: "2.1d", description: "Heat pumps" },
          { code: "2.1e", description: "Grey water recycling" },
          { code: "2.1f", description: "Rainwater harvesting" },
          { code: "2.1g", description: "Biomass heating" }
        ]
      }
    ]
  },
  {
    id: "ELTK3-003",
    code: "ELTK3-003",
    displayCode: "ELTK3/003",
    reference: "ELTK3-003",
    title: "Understanding the Practices and Procedures for Overseeing and Organising the Work Environment",
    description: "Knowledge of managing and organizing electrical work",
    type: UnitType.NVQ,
    creditValue: 5,
    glh: 45,
    progress: 0,
    learningOutcomes: [
      {
        number: "1",
        title: "Information and Communication",
        performanceCriteria: [
          { code: "1.1", description: "Understand procedures for providing technical and functional information" },
          { code: "1.2", description: "Understand methods of liaising with relevant people" },
          { code: "1.3", description: "Understand importance of clear and accurate communication" }
        ]
      },
      {
        number: "2",
        title: "Work Organisation",
        performanceCriteria: [
          { code: "2.1", description: "Understand procedures for organizing work activities" },
          { code: "2.2", description: "Understand methods for coordinating work with others" },
          { code: "2.3", description: "Understand requirements for monitoring work quality" }
        ]
      },
      {
        number: "3",
        title: "Resource Management",
        performanceCriteria: [
          { code: "3.1", description: "Understand procedures for managing resources" },
          { code: "3.2", description: "Understand methods for ensuring resource availability" },
          { code: "3.3", description: "Understand importance of efficient resource utilization" }
        ]
      }
    ]
  },
  {
    id: "ELTK3-004",
    code: "ELTK3-004",
    displayCode: "ELTK3/004",
    reference: "ELTK3-004",
    title: "Understanding the Requirements for Installing Wiring Systems",
    description: "Knowledge of electrical wiring systems installation",
    type: UnitType.NVQ,
    creditValue: 4,
    glh: 35,
    progress: 0,
    learningOutcomes: [
      {
        number: "1",
        title: "Wiring Systems",
        performanceCriteria: [
          { code: "1.1", description: "Understand types and applications of wiring systems" },
          { code: "1.2", description: "Understand installation methods for different wiring systems" },
          { code: "1.3", description: "Understand requirements of BS7671 for wiring systems" }
        ]
      },
      {
        number: "2",
        title: "Installation Methods",
        performanceCriteria: [
          { code: "2.1", description: "Understand cable selection and sizing" },
          { code: "2.2", description: "Understand containment systems" },
          { code: "2.3", description: "Understand fixing and support methods" },
          { code: "2.4", description: "Understand protection requirements" }
        ]
      }
    ]
  },
  {
    id: "ELTK3-005",
    code: "ELTK3-005",
    displayCode: "ELTK3/005",
    reference: "ELTK3-005",
    title: "Understanding the Practices and Procedures for the Termination and Connection of Conductors, Cables and Cords in Electrical Systems",
    description: "Knowledge of electrical terminations and connections",
    type: UnitType.NVQ,
    creditValue: 4,
    glh: 35,
    progress: 0,
    learningOutcomes: [
      {
        number: "1",
        title: "Cable and Conductor Types",
        performanceCriteria: [
          { code: "1.1", description: "Understand different types of cables and conductors" },
          { code: "1.2", description: "Understand cable sizing and selection criteria" },
          { code: "1.3", description: "Understand cable ratings and current carrying capacity" }
        ]
      },
      {
        number: "2",
        title: "Termination Methods",
        performanceCriteria: [
          { code: "2.1", description: "Understand termination techniques for:" },
          { code: "2.1a", description: "Single core cables" },
          { code: "2.1b", description: "Multicore cables" },
          { code: "2.1c", description: "Steel wire armoured cables" },
          { code: "2.1d", description: "Mineral insulated cables" },
          { code: "2.2", description: "Understand gland types and selection" },
          { code: "2.3", description: "Understand earthing requirements" }
        ]
      },
      {
        number: "3",
        title: "Connection Methods",
        performanceCriteria: [
          { code: "3.1", description: "Understand connection methods for:" },
          { code: "3.1a", description: "Distribution boards" },
          { code: "3.1b", description: "Consumer units" },
          { code: "3.1c", description: "Wiring accessories" },
          { code: "3.2", description: "Understand torque settings" },
          { code: "3.3", description: "Understand connection security requirements" }
        ]
      },
      {
        number: "4",
        title: "Testing and Verification",
        performanceCriteria: [
          { code: "4.1", description: "Understand testing requirements for terminations" },
          { code: "4.2", description: "Understand continuity testing procedures" },
          { code: "4.3", description: "Understand polarity testing procedures" },
          { code: "4.4", description: "Understand insulation resistance testing procedures" }
        ]
      }
    ]
  },
  {
    id: "ELTK3-006",
    code: "ELTK3-006",
    displayCode: "ELTK3/006",
    reference: "ELTK3-006",
    title: "Understanding the Inspection, Testing, Commissioning and Certification of Electrical Systems",
    description: "Knowledge of electrical system verification",
    type: UnitType.NVQ,
    creditValue: 5,
    glh: 45,
    progress: 0,
    learningOutcomes: [
      {
        number: "1",
        title: "Inspection Requirements",
        performanceCriteria: [
          { code: "1.1", description: "Understand requirements for initial verification" },
          { code: "1.2", description: "Understand inspection procedures and methods" },
          { code: "1.3", description: "Understand documentation requirements for inspection" }
        ]
      },
      {
        number: "2",
        title: "Testing Procedures",
        performanceCriteria: [
          { code: "2.1", description: "Understand testing requirements and sequences" },
          { code: "2.2", description: "Understand test instrument selection and use" },
          { code: "2.3", description: "Understand interpretation of test results" }
        ]
      },
      {
        number: "3",
        title: "Commissioning and Certification",
        performanceCriteria: [
          { code: "3.1", description: "Understand commissioning procedures" },
          { code: "3.2", description: "Understand certification requirements" },
          { code: "3.3", description: "Understand handover procedures" }
        ]
      }
    ]
  },
  {
    id: "ELTK3-007",
    code: "ELTK3-007",
    displayCode: "ELTK3/007",
    reference: "ELTK3-007",
    title: "Understanding the principles, practices and legislation for diagnosing and correcting electrical faults",
    description: "Knowledge and understanding of electrical fault diagnosis and correction",
    type: UnitType.NVQ,
    creditValue: 6,
    glh: 52,
    progress: 0,
    learningOutcomes: [
      {
        number: "1",
        title: "Understand safe isolation procedures and implications",
        performanceCriteria: [
          { code: "1.1", description: "Specify and undertake correct procedure for safe isolation:" },
          { code: "1.1a", description: "Assessment of safe working practices" },
          { code: "1.1b", description: "Correct identification of circuits to be isolated" },
          { code: "1.1c", description: "Selection of suitable points of isolation" },
          { code: "1.1d", description: "Selection of correct test and proving instruments" },
          { code: "1.1e", description: "Use of correct testing methods" },
          { code: "1.1f", description: "Selection of locking devices for securing isolation" },
          { code: "1.1g", description: "Use of correct warning notices" },
          { code: "1.1h", description: "Correct sequence for isolating circuits" },
          { code: "1.2", description: "State implications of carrying out safe isolations to:" },
          { code: "1.2a", description: "Other personnel" },
          { code: "1.2b", description: "Customers/clients" },
          { code: "1.2c", description: "Public" },
          { code: "1.2d", description: "Building systems (loss of supply)" },
          { code: "1.3", description: "State implications of not carrying out safe isolations to:" },
          { code: "1.3a", description: "Self" },
          { code: "1.3b", description: "Other personnel" },
          { code: "1.3c", description: "Customers/clients" },
          { code: "1.3d", description: "Public" },
          { code: "1.3e", description: "Building systems (Presence of supply)" },
          { code: "1.4", description: "Identify Health and Safety requirements for:" },
          { code: "1.4a", description: "Working in accordance with risk assessments/permits" },
          { code: "1.4b", description: "Safe use of tools and equipment" },
          { code: "1.4c", description: "Safe use of measuring instruments" },
          { code: "1.4d", description: "Provision and use of PPE" }
        ]
      },
      {
        number: "2",
        title: "Understand reporting and recording requirements",
        performanceCriteria: [
          { code: "2.1", description: "State procedures for reporting and recording fault diagnosis work" },
          { code: "2.2", description: "State procedures for informing relevant persons" },
          { code: "2.3", description: "Explain importance of clear and courteous communication" }
        ]
      },
      {
        number: "3",
        title: "Understand fault diagnosis procedures and symptoms",
        performanceCriteria: [
          { code: "3.1", description: "Specify safe working procedures including:" },
          { code: "3.1a", description: "Effective communication with others" },
          { code: "3.1b", description: "Use of barriers" },
          { code: "3.1c", description: "Positioning of notices" },
          { code: "3.1d", description: "Safe isolation" },
          { code: "3.2", description: "Interpret logical stages of fault diagnosis:" },
          { code: "3.2a", description: "Identification of symptoms" },
          { code: "3.2b", description: "Collection and analysis of data" },
          { code: "3.2c", description: "Use of information sources" },
          { code: "3.2d", description: "Maintenance records" },
          { code: "3.2e", description: "Experience (personal and others)" },
          { code: "3.2f", description: "Checking and testing" },
          { code: "3.2g", description: "Interpreting results" },
          { code: "3.2h", description: "Fault correction" },
          { code: "3.2i", description: "Functional testing" },
          { code: "3.2j", description: "Restoration" }
        ]
      },
      {
        number: "4",
        title: "Understand testing procedures and instruments",
        performanceCriteria: [
          { code: "4.1", description: "State dangers of electricity in fault diagnosis" },
          { code: "4.2", description: "Describe how to identify supply voltages" },
          { code: "4.3", description: "Select correct test instruments:" },
          { code: "4.3a", description: "Voltage indicator" },
          { code: "4.3b", description: "Low resistance ohm meter" },
          { code: "4.3c", description: "Insulation resistance testers" },
          { code: "4.3d", description: "EFLI and PFC tester" },
          { code: "4.3e", description: "RCD tester" },
          { code: "4.3f", description: "Tong tester/clamp on ammeter" },
          { code: "4.3g", description: "Phase sequence tester" }
        ]
      },
      {
        number: "5",
        title: "Understand fault correction procedures",
        performanceCriteria: [
          { code: "5.1", description: "Identify factors affecting fault correction:" },
          { code: "5.1a", description: "Cost" },
          { code: "5.1b", description: "Availability of resources" },
          { code: "5.1c", description: "Down time" },
          { code: "5.1d", description: "Legal responsibilities" },
          { code: "5.1e", description: "Access to systems" },
          { code: "5.1f", description: "Emergency supplies" },
          { code: "5.1g", description: "Client demands" },
          { code: "5.2", description: "Specify functional testing procedures:" },
          { code: "5.2a", description: "Continuity" },
          { code: "5.2b", description: "Insulation resistance" },
          { code: "5.2c", description: "Polarity" },
          { code: "5.2d", description: "Earth fault loop impedance" },
          { code: "5.2e", description: "RCD operation" },
          { code: "5.2f", description: "Current and voltage values" },
          { code: "5.2g", description: "Phase sequencing" }
        ]
      }
    ]
  },
  {
    id: "ELTK3-008",
    code: "ELTK3-008",
    displayCode: "ELTK3/008",
    reference: "ELTK3-008",
    title: "Understanding the Electrical Principles Associated with the Design, Building, Installation and Maintenance of Electrical Equipment and Systems",
    description: "Knowledge and understanding of mathematical principles which are appropriate to electrical installation, maintenance and design",
    type: UnitType.NVQ,
    creditValue: 12,
    glh: 106,
    progress: 0,
    learningOutcomes: [
      {
        number: "1",
        title: "Understand mathematical principles which are appropriate to electrical installation, maintenance and design work",
        performanceCriteria: [
          { code: "1.1a", description: "Identify and apply appropriate mathematical principles which are relevant to electrotechnical work tasks including Fractions and percentages" },
          { code: "1.1b", description: "Algebra" },
          { code: "1.1c", description: "Indices" },
          { code: "1.1d", description: "Powers of 10" },
          { code: "1.1e", description: "Transposition" },
          { code: "1.1f", description: "Triangles and trigonometry" },
          { code: "1.1g", description: "Statistics" }
        ]
      },
      {
        number: "2",
        title: "Understand standard units of measurement used in electrical installation, maintenance and design work",
        performanceCriteria: [
          { code: "2.1a", description: "Identify and use internationally recognised (SI) units of measurement for general variables including Length" },
          { code: "2.1b", description: "Area" },
          { code: "2.1c", description: "Volume" },
          { code: "2.1d", description: "Mass" },
          { code: "2.1e", description: "Density" },
          { code: "2.1f", description: "Time" },
          { code: "2.1g", description: "Temperature" },
          { code: "2.1h", description: "Velocity" }
        ]
      }
    ]
  }
];

// Now add the performance units

export const ealNVQ1605PerformanceUnits = [
  {
    id: "ELTP3-001",
    code: "ELTP3-001",
    displayCode: "ELTP3/001",
    reference: "ELTP3-001",
    title: "Apply Health and Safety Legislation and Working Practices",
    description: "Installing and maintaining electrotechnical systems and equipment",
    type: UnitType.NVQ,
    creditValue: 4,
    glh: 35,
    progress: 0,
    learningOutcomes: [
      {
        number: "1",
        title: "Apply relevant health and safety legislation",
        performanceCriteria: [
          { code: "1.1", description: "Identify which workplace health and safety procedures are relevant", status: "not-started" },
          { code: "1.2", description: "Produce risk assessment and method statement in accordance with procedures", status: "not-started" },
          { code: "1.3", description: "Work within the requirements of:", status: "not-started" },
          { code: "1.3a", description: "Risk assessments", status: "not-started" },
          { code: "1.3b", description: "Method statements", status: "not-started" },
          { code: "1.3c", description: "Safe systems of work", status: "not-started" }
        ]
      },
      {
        number: "2",
        title: "Assess the work environment for hazards",
        performanceCriteria: [
          { code: "2.1", description: "Identify unsafe situations and conditions and take remedial actions", status: "not-started" },
          { code: "2.2", description: "Assess work environment & revise practices for hazards from:", status: "not-started" },
          { code: "2.2a", description: "Materials", status: "not-started" },
          { code: "2.2b", description: "Tools", status: "not-started" },
          { code: "2.2c", description: "Equipment", status: "not-started" },
          { code: "2.3", description: "Report high risk hazards to relevant persons", status: "not-started" },
          { code: "2.4", description: "Apply measures to control health and safety hazards", status: "not-started" },
          { code: "2.5", description: "Select and use correct personal protective equipment", status: "not-started" }
        ]
      },
      {
        number: "3",
        title: "Apply methods and procedures for safe work",
        performanceCriteria: [
          { code: "3.1", description: "Demonstrate personal conduct and behaviour around the workplace", status: "not-started" },
          { code: "3.2", description: "Apply procedures for safe use, maintenance & storage as per:", status: "not-started" },
          { code: "3.2a", description: "Workplace policies (company and site)", status: "not-started" },
          { code: "3.2b", description: "Manufacturer's instructions", status: "not-started" },
          { code: "3.2c", description: "Supplier information", status: "not-started" }
        ]
      },
      {
        number: "4",
        title: "Apply procedures for accidents and emergencies",
        performanceCriteria: [
          { code: "4.1", description: "Follow correct procedures in event of injury to self or others:", status: "not-started" },
          { code: "4.1a", description: "Basic first aid procedures", status: "not-started" },
          { code: "4.1b", description: "Notification of emergency services", status: "not-started" },
          { code: "4.1c", description: "Reporting of incidents", status: "not-started" }
        ]
      }
    ]
  },
  {
    id: "ELTP3-002",
    code: "ELTP3-002",
    displayCode: "ELTP3/002",
    reference: "ELTP3-002",
    title: "Applying Environmental Legislation, Working Practices and Principles",
    description: "Environmental technology systems application",
    type: UnitType.NVQ,
    creditValue: 4,
    glh: 35,
    progress: 0,
    learningOutcomes: [
      {
        number: "1",
        title: "Apply Environmental Protection Measures",
        performanceCriteria: [
          { code: "1.1", description: "Apply environmental protection measures in the workplace" },
          { code: "1.2", description: "Implement waste management procedures" },
          { code: "1.3", description: "Follow environmental legislation requirements" }
        ]
      },
      {
        number: "2",
        title: "Handle and Store Materials",
        performanceCriteria: [
          { code: "2.1", description: "Handle and store materials and equipment in accordance with:" },
          { code: "2.1a", description: "Environmental Protection Act" },
          { code: "2.1b", description: "The Hazardous Waste Regulations" },
          { code: "2.1c", description: "Control of Pollution Act" },
          { code: "2.1d", description: "The Control of Noise at Work Regulations" },
          { code: "2.1e", description: "The Waste Electrical and Electronic Equipment Regulations" }
        ]
      },
      {
        number: "3",
        title: "Environmental Technology Systems",
        performanceCriteria: [
          { code: "3.1", description: "Provide information on environmental technology systems:" },
          { code: "3.1a", description: "Solar photovoltaic" },
          { code: "3.1b", description: "Wind energy" },
          { code: "3.1c", description: "Micro hydro" },
          { code: "3.1d", description: "Heat pumps" },
          { code: "3.1e", description: "Grey water recycling" },
          { code: "3.1f", description: "Rainwater harvesting" },
          { code: "3.1g", description: "Biomass heating" },
          { code: "3.1h", description: "Solar thermal hot water heating" },
          { code: "3.1i", description: "Combined heat and power (CHP) including micro CHP" }
        ]
      }
    ]
  },
  {
    id: "ELTP3-003",
    code: "ELTP3-003",
    displayCode: "ELTP3/003",
    reference: "ELTP3-003",
    title: "Overseeing and Organising the Work Environment",
    description: "Electrical installation",
    type: UnitType.NVQ,
    creditValue: 4,
    glh: 35,
    progress: 0,
    learningOutcomes: [
      {
        number: "1",
        title: "Be able to provide technical and functional information",
        performanceCriteria: [
          { code: "1.1", description: "Identify relevant people that need technical/functional information" },
          { code: "1.2", description: "Identify additional information required" },
          { code: "1.2a", description: "Health and safety information" },
          { code: "1.2b", description: "Isolation procedures" },
          { code: "1.2c", description: "Contact details for further advice" },
          { code: "1.3", description: "Liaise with relevant people to determine information needs" },
          { code: "1.4", description: "Identify appropriate technical and functional information" },
          { code: "1.5", description: "Provide information professionally and according to procedures" }
        ]
      }
    ]
  },
  {
    id: "ELTP3-004",
    code: "ELTP3-004",
    displayCode: "ELTP3/004",
    reference: "ELTP3-004",
    title: "Installing wiring systems and enclosures for electrical systems",
    description: "Installation of electrical wiring systems",
    type: UnitType.NVQ,
    creditValue: 4,
    glh: 35,
    progress: 0,
    learningOutcomes: [
      {
        number: "1",
        title: "Preparation and Safety",
        performanceCriteria: [
          { code: "1.1", description: "Ensure the health and safety of themselves and others within the work location" },
          { code: "1.2", description: "Identify and use suitable personal protective equipment throughout the completion of work activities" },
          { code: "1.3", description: "Complete preparatory work for the installation of electrical systems, enclosures and associated equipment, to include:" },
          { code: "1.3a", description: "Interpretation of installation specifications to produce material and equipment requisites" },
          { code: "1.3b", description: "Identification and selection of material, equipment and components which are compatible with the installation specification" },
          { code: "1.3c", description: "Identification of suitable methods, procedures and practices" },
          { code: "1.3d", description: "Confirmation of site readiness for installation work to begin" },
          { code: "1.3e", description: "Confirmation of secure site storage facilities for tools, equipment, materials and components" },
          { code: "1.3f", description: "Confirmation that safe isolation has been carried out (if appropriate) in accordance with regulatory requirements" },
          { code: "1.3g", description: "Completion of a risk assessment" }
        ]
      },
      {
        number: "2",
        title: "Documentation and Materials",
        performanceCriteria: [
          { code: "2.1", description: "Use information and documentation that is current and relevant to the work required, including:" },
          { code: "2.1a", description: "Installation specifications" },
          { code: "2.1b", description: "Work schedules" },
          { code: "2.1c", description: "Work programmes" },
          { code: "2.1d", description: "Method statements" },
          { code: "2.1e", description: "Manufacturer's instructions" },
          { code: "2.1f", description: "Regulatory documents (including current version of BS 7671 and relevant Guidance Notes)" },
          { code: "2.2", description: "Use documentation to confirm that materials and equipment is of the correct quantity and is free from damage, including:" },
          { code: "2.2a", description: "Materials schedules" },
          { code: "2.2b", description: "Plant and equipment schedules" },
          { code: "2.2c", description: "Operating instructions" },
          { code: "2.2d", description: "Tools and instruments" }
        ]
      },
      {
        number: "3",
        title: "Documentation and Authorization",
        performanceCriteria: [
          { code: "3.1", description: "Use appropriate procedures to record:" },
          { code: "3.1a", description: "Contract variations" },
          { code: "3.1b", description: "Site instructions" },
          { code: "3.1c", description: "Site events/diary" },
          { code: "3.2", description: "Demonstrate that authorisation has been obtained from the relevant person(s) prior to commencement of the work, including:" },
          { code: "3.2a", description: "Other workers" },
          { code: "3.2b", description: "Customers/clients" },
          { code: "3.2c", description: "Public (If appropriate)" },
          { code: "3.3", description: "Produce a record of any pre work damage or defects to existing equipment or building features, and report to the relevant person (Customer; Client; Site Manager; Line Manager)" }
        ]
      },
      {
        number: "4",
        title: "Verify Installation Requirements",
        performanceCriteria: [
          { code: "4.1", description: "Verify the compatibility of the electrical supply to the requirements of the installation specification" },
          { code: "4.2", description: "Identify the earthing arrangement for the electrical installation" }
        ]
      },
      {
        number: "5",
        title: "Installation Planning and Layout",
        performanceCriteria: [
          { code: "5.1", description: "Ensure that the planned locations for the wiring system(s) and its associated equipment are compatible with other site services requirements" },
          { code: "5.2", description: "Use different measuring and marking out techniques which are appropriate to the wiring system, wiring enclosure and/or associated equipment that is being installed" }
        ]
      }
    ]
  },
  {
    id: "ELTP3-005",
    code: "ELTP3-005",
    displayCode: "ELTP3/005",
    reference: "ELTP3-005",
    title: "Terminating and connecting conductors, cables and flexible cords in electrical systems",
    description: "Installation of electrical wiring and components",
    type: UnitType.NVQ,
    creditValue: 4,
    glh: 35,
    progress: 0,
    learningOutcomes: [
      {
        number: "1",
        title: "Preparation and Safety",
        performanceCriteria: [
          { code: "1.1", description: "Carry out safe isolation procedures" },
          { code: "1.2", description: "Select appropriate tools and equipment" },
          { code: "1.3", description: "Verify materials are correct and undamaged" },
          { code: "1.4", description: "Confirm work area is safe and ready" }
        ]
      },
      {
        number: "2",
        title: "Cable Termination and Connection",
        performanceCriteria: [
          { code: "2.1", description: "Terminate and connect cables according to specifications" },
          { code: "2.2", description: "Connect to electrical equipment according to specifications" },
          { code: "2.3", description: "Terminate and connect conductors and cables using appropriate techniques" }
        ]
      },
      {
        number: "3",
        title: "Testing and Documentation",
        performanceCriteria: [
          { code: "3.1", description: "Ensure that terminations and connections are electrically and mechanically sound" },
          { code: "3.2", description: "Complete the necessary identification of cables and conductors in accordance with regulatory requirements" },
          { code: "3.3", description: "Dispose of unwanted material and equipment in accordance with site procedures" }
        ]
      }
    ]
  },
  {
    id: "ELTP3-006",
    code: "ELTP3-006",
    displayCode: "ELTP3/006",
    reference: "ELTP3-006",
    title: "Inspecting, testing, commissioning and certifying electrotechnical systems",
    description: "Inspection, testing and commissioning of electrical installations",
    type: UnitType.NVQ,
    creditValue: 4,
    glh: 35,
    progress: 0,
    learningOutcomes: [
      {
        number: "1",
        title: "Preparation for Inspection and Testing",
        performanceCriteria: [
          { code: "1.1", description: "Confirm scope of inspection and testing" },
          { code: "1.2", description: "Risk assess inspection and testing activities" },
          { code: "1.3", description: "Select appropriate test instruments" },
          { code: "1.4", description: "Verify test instruments are calibrated and functioning" }
        ]
      },
      {
        number: "2", 
        title: "Inspection Procedures",
        performanceCriteria: [
          { code: "2.1", description: "Complete visual inspection according to requirements" },
          { code: "2.2", description: "Record inspection results accurately" },
          { code: "2.3", description: "Identify and report non-compliant items" }
        ]
      },
      {
        number: "3",
        title: "Testing Procedures",
        performanceCriteria: [
          { code: "3.1", description: "Perform tests in correct sequence" },
          { code: "3.2", description: "Record test results accurately" },
          { code: "3.3", description: "Compare results with required values" }
        ]
      },
      {
        number: "4",
        title: "Commissioning and Certification",
        performanceCriteria: [
          { code: "4.1", description: "Complete commissioning of installation" },
          { code: "4.2", description: "Complete required certification documentation" },
          { code: "4.3", description: "Provide handover information to client" }
        ]
      }
    ]
  },
  {
    id: "ELTP3-007",
    code: "ELTP3-007",
    displayCode: "ELTP3/007",
    reference: "ELTP3-007",
    title: "Diagnosing and correcting electrical faults",
    description: "Fault diagnosis and correction in electrical installations",
    type: UnitType.NVQ,
    creditValue: 4,
    glh: 35,
    progress: 0,
    learningOutcomes: [
      {
        number: "1",
        title: "Preparation for Fault Diagnosis",
        performanceCriteria: [
          { code: "1.1", description: "Gather information about reported faults" },
          { code: "1.2", description: "Risk assess fault diagnosis activities" },
          { code: "1.3", description: "Select appropriate test instruments" },
          { code: "1.4", description: "Carry out safe isolation procedures" }
        ]
      },
      {
        number: "2",
        title: "Fault Diagnosis",
        performanceCriteria: [
          { code: "2.1", description: "Apply logical fault diagnosis procedures" },
          { code: "2.2", description: "Use appropriate testing methods" },
          { code: "2.3", description: "Interpret test results correctly" },
          { code: "2.4", description: "Identify cause of fault" },
          { code: "2.5", description: "Record findings accurately" }
        ]
      },
      {
        number: "3",
        title: "Fault Correction",
        performanceCriteria: [
          { code: "3.1", description: "Select appropriate repair method" },
          { code: "3.2", description: "Obtain required replacement parts" },
          { code: "3.3", description: "Repair or replace faulty components" },
          { code: "3.4", description: "Test repaired circuit for correct operation" },
          { code: "3.5", description: "Restore supply safely" },
          { code: "3.6", description: "Complete required documentation" }
        ]
      },
      {
        number: "4",
        title: "Communication and Reporting",
        performanceCriteria: [
          { code: "4.1", description: "Communicate effectively with relevant people" },
          { code: "4.2", description: "Provide clear explanation of fault found and work carried out" }
        ]
      }
    ]
  },
  {
    id: "QEOC3-001",
    code: "QEOC3-001",
    displayCode: "QEOC3/001",
    reference: "QEOC3-001",
    title: "Electrotechnical Occupational Competence",
    description: "Assessment of occupational competence in electrical installation",
    type: UnitType.NVQ,
    creditValue: 4,
    glh: 35,
    progress: 0,
    learningOutcomes: [
      {
        number: "A",
        title: "Composite Installation",
        performanceCriteria: [
          { code: "A1", description: "Safe Isolation and Risk Assessment" }
        ]
      },
      {
        number: "B",
        title: "Inspection and Testing",
        performanceCriteria: [
          { code: "B1", description: "Complete inspection and testing of electrical installation" }
        ]
      },
      {
        number: "C",
        title: "Fault Diagnosis",
        performanceCriteria: [
          { code: "C1", description: "Diagnose and correct electrical faults" }
        ]
      },
      {
        number: "D",
        title: "Knowledge Assessment",
        performanceCriteria: [
          { code: "D1", description: "Complete online multiple choice examination" }
        ]
      }
    ]
  }
];

// Apply the status to all units
const updatedKnowledgeUnits = ealNVQ1605Units.map(addStatusToUnit);
const updatedPerformanceUnits = ealNVQ1605PerformanceUnits.map(addStatusToUnit);

// Combine knowledge and performance units
export const allNVQ1605Units = [...updatedKnowledgeUnits, ...updatedPerformanceUnits];

// NVQ 1605 qualification data
export const nvq1605Qualification = {
  id: 'nvq1605',
  title: 'Level 3 NVQ Diploma in Installing Electrotechnical Systems and Equipment',
  subtitle: 'EAL Level 3 NVQ Diploma in Installing Electrotechnical Systems and Equipment (1605)',
  progress: 0,
  units: allNVQ1605Units.length,
  unitsData: allNVQ1605Units
};
