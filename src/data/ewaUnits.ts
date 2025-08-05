import { Unit, UnitType, LearningOutcome, PerformanceCriteria } from '../models/Unit';
import { allNVQ1605Units } from './ealUnits';

// Enhanced version of the NETP3-01 unit with full learning outcomes and performance criteria
export const ewaUnitNETP301: Unit = {
  id: "NETP3-01",
  code: "NETP3-01",
  displayCode: "NETP3-01",
  reference: "NETP3-01",
  title: "Apply Health and Safety Legislation and Working Practices",
  description: "Understanding and applying health and safety principles in electrical installation",
  type: UnitType.EWA,
  creditValue: 3,
  glh: 26,
  progress: 0,
  learningOutcomes: [
    {
      number: "1",
      title: "Be able to apply relevant health and safety legislation in the workplace",
      performanceCriteria: [
        { code: "1.1", description: "Identify which workplace health and safety procedures are relevant to the working environment and comply with their duties and obligations" },
        { code: "1.2", description: "Produce a risk assessment and method statement in accordance with organisational procedures" },
        { code: "1.3", description: "Work within the requirements of:" },
        { code: "1.3a", description: "Risk assessments" },
        { code: "1.3b", description: "Method statements" },
        { code: "1.3c", description: "Safe systems of work" }
      ]
    },
    {
      number: "2",
      title: "Be able to assess the work environment for hazards",
      performanceCriteria: [
        { code: "2.1", description: "Identify unsafe situations and conditions and take remedial actions" },
        { code: "2.2", description: "Assess work environment & revise practices taking account of hazards:" },
        { code: "2.2a", description: "Materials" },
        { code: "2.2b", description: "Tools" },
        { code: "2.2c", description: "Equipment" },
        { code: "2.3", description: "Identify any hazards which may present a high risk and report their presence to relevant persons" },
        { code: "2.4", description: "Apply measures to control health and safety hazards" },
        { code: "2.5", description: "Select and use correct personal protective equipment" }
      ]
    },
    {
      number: "3",
      title: "Be able to apply methods and procedures to ensure work on site is in accordance with health and safety legislation",
      performanceCriteria: [
        { code: "3.1", description: "Demonstrate personal conduct and behaviour within the workplace" },
        { code: "3.2", description: "Apply procedures to ensure safe use, maintenance & storage of equipment:" },
        { code: "3.2a", description: "Workplace policies (company and site)" },
        { code: "3.2b", description: "Supplier information" },
        { code: "3.2c", description: "Manufacturer's instructions" },
        { code: "3.3", description: "Comply with hazard warning, mandatory instruction and prohibition notices" },
        { code: "3.4", description: "Apply procedures to ensure safety through correct use of guards and notices" },
        { code: "3.5", description: "Use access equipment correctly:" },
        { code: "3.5a", description: "Ladder" },
        { code: "3.5b", description: "Tower scaffold or MEWP" },
        { code: "3.5c", description: "Stepladder" },
        { code: "3.5d", description: "Platform" }
      ]
    },
    {
      number: "4",
      title: "Be able to work in accordance with environmental legislation",
      performanceCriteria: [
        { code: "4.1", description: "Apply procedures for safe handling, storing & disposal of hazardous materials:" },
        { code: "4.1a", description: "Environmental Protection Act" },
        { code: "4.1b", description: "Hazardous Waste Regulations" },
        { code: "4.1c", description: "Pollution Prevention and Control Act" },
        { code: "4.1d", description: "Control of Pollution Act" },
        { code: "4.1e", description: "Control of Noise at Work Regulations" },
        { code: "4.1f", description: "Environment Act" }
      ]
    }
  ]
};

// Real EWA units from the iOS app, with the first unit fully populated with performance criteria
export const ewaUnits: Unit[] = [
  ewaUnitNETP301,
  {
    id: "NETP3-03",
    code: "NETP3-03",
    displayCode: "NETP3-03",
    reference: "NETP3-03",
    title: "Organise and Oversee the Electrical Work Environment",
    description: "Organizing and overseeing electrical work activities",
    type: UnitType.EWA,
    creditValue: 3,
    glh: 26,
    progress: 0,
    learningOutcomes: [
      {
        number: "1",
        title: "Be able to provide technical and functional information",
        performanceCriteria: [
          { code: "1.1", description: "Liaise with relevant people to evaluate the information they require to ensure that systems, equipment or components can be operated safely and effectively" },
          { code: "1.1c", description: "Safety requirements" },
          { code: "1.2", description: "Identify appropriate technical and functional information that is required for the work activity" },
          { code: "1.3", description: "Provide information in a timely, courteous, suitable and professional manner in accordance with organisational procedures and engineering standards" },
          { code: "1.4", description: "Follow organizational procedures" }
        ]
      },
      {
        number: "2",
        title: "Be able to oversee Health and Safety",
        performanceCriteria: [
          { code: "2.1", description: "Produce, or revise generic, risk assessments and method statements, to cover their own work and others working the area (colleagues and other operatives) in accordance with their level of responsibility" },
          { code: "2.2", description: "Implement suitable procedures to confirm that work is being completed in accordance with health and safety legislation and industry standards" },
          { code: "2.3", description: "Ensure compliance with:" },
          { code: "2.3a", description: "Health and Safety legislation" },
          { code: "2.3b", description: "Industry standards" },
          { code: "2.3c", description: "Company procedures" }
        ]
      },
      {
        number: "3",
        title: "Be able to coordinate work activities",
        performanceCriteria: [
          { code: "3.1", description: "Select effective procedures to ensure co-ordination with other workers/contractors, including steps to resolve issues which are outside the scope of their job role" },
          { code: "3.2", description: "Evaluate and apply communication techniques that are clear, accurate and appropriate to the situation" },
          { code: "3.3", description: "Demonstrate working effectively with colleagues to enhance performance" },
          { code: "3.4", description: "Report issues outside scope of responsibility" }
        ]
      },
      {
        number: "4",
        title: "Be able to organise and oversee work activities and operations",
        performanceCriteria: [
          { code: "4.1", description: "Organise operatives by allocating duties and responsibilities to make the best use of their competence and skill" },
          { code: "4.2", description: "Monitor the work of operatives to ensure it is in accordance with:" },
          { code: "4.2a", description: "Industry working practices" },
          { code: "4.2b", description: "The programme of work" },
          { code: "4.2c", description: "Health and safety requirements" },
          { code: "4.2d", description: "Cost effectiveness" },
          { code: "4.2e", description: "Environmental considerations" },
          { code: "4.3", description: "Evaluate and apply appropriate procedures to correct issues that arise during work activities" }
        ]
      },
      {
        number: "5",
        title: "Be able to organise a programme for working on electrical systems and equipment",
        performanceCriteria: [
          { code: "5.1", description: "Produce a simple programme of work from the work specification, including requirements for the following:" },
          { code: "5.1a", description: "An estimation of the amount of time required for completion of the work" },
          { code: "5.1b", description: "Where liaison with other trades may be necessary" },
          { code: "5.2", description: "Communicate with others clearly and concisely" },
          { code: "5.3", description: "Assess situations when it is necessary to liaise with other relevant parties to resolve issues" }
        ]
      },
      {
        number: "6",
        title: "Be able to organize and manage resources",
        performanceCriteria: [
          { code: "6.1", description: "Organise the provision of resources (such as: materials fixings, plant, labour or tools)" },
          { code: "6.2", description: "Confirm that materials available are:" },
          { code: "6.2a", description: "The right type" },
          { code: "6.2b", description: "Fit for purpose" },
          { code: "6.2c", description: "In the correct quantity" },
          { code: "6.2d", description: "Suitable for work to be completed cost efficiently" },
          { code: "6.3", description: "Ensure that resources are undamaged at the point of delivery" },
          { code: "6.4", description: "Demonstrate effective measures which ensure the safe and effective storage of materials, tools and equipment in the work location" }
        ]
      }
    ]
  },
  {
    id: "NETP3-04",
    code: "NETP3-04",
    displayCode: "NETP3-04",
    reference: "NETP3-04",
    title: "Install Electrical Equipment and Systems",
    description: "Installing electrical systems and equipment",
    type: UnitType.EWA,
    creditValue: 4,
    glh: 35,
    progress: 0,
    learningOutcomes: [
      {
        number: "1",
        title: "Prepare to install wiring systems, enclosures and associated equipment",
        performanceCriteria: [
          { code: "1.1", description: "Assess and apply appropriate procedures to include:" },
          { code: "1.1a", description: "Adopting appropriate PPE" },
          { code: "1.1b", description: "Following a safe system of work" },
          { code: "1.1c", description: "Selecting appropriate tools/equipment for the task" },
          { code: "1.2", description: "Prepare to install wiring systems, enclosures & equipment:" },
          { code: "1.2a", description: "Confirm secure site storage facilities for tools, equipment, materials and components" },
          { code: "1.2b", description: "Select materials (equipment and components) in accordance with the installation specification" },
          { code: "1.2c", description: "Report any pre-work damage/defects to existing or building features, to the relevant person" },
          { code: "1.2d", description: "Confirm site readiness for installation work to begin" },
          { code: "1.2e", description: "Confirm authorisation for the installation work to start" },
          { code: "1.3", description: "Use documentation to confirm materials and equipment is correct quantity and free from damage" },
          { code: "1.4", description: "Ensure planned locations are compatible with other building services" },
          { code: "1.5", description: "Check the planned locations for the wiring system in terms of:" },
          { code: "1.5a", description: "Cosmetic appearance" },
          { code: "1.5b", description: "External influences" }
        ]
      },
      {
        number: "2",
        title: "Interpret appropriate information for installation",
        performanceCriteria: [
          { code: "2.1", description: "Use sources of information to enable the installation of wiring systems:" },
          { code: "2.1a", description: "Specifications" },
          { code: "2.1b", description: "Work schedules/programmes" },
          { code: "2.1c", description: "Manufacturer instructions" },
          { code: "2.1d", description: "Layout Drawings" },
          { code: "2.1e", description: "Other appropriate source of information (e.g BS 7671, other plans or diagrams 'approved documents', building regulations)" }
        ]
      },
      {
        number: "3",
        title: "Install wiring systems and equipment",
        performanceCriteria: [
          { code: "3.1", description: "Use appropriate measuring and marking out techniques" },
          { code: "3.2", description: "Install cables in accordance with BS7671:" },
          { code: "3.2a", description: "Single core (singles)" },
          { code: "3.2b", description: "Multicore insulated" },
          { code: "3.2c", description: "PVC - PVC flat profile cable" },
          { code: "3.2d", description: "MICC" },
          { code: "3.2e", description: "Fire performance" },
          { code: "3.2f", description: "SWA cable" },
          { code: "3.2g", description: "GSWB galvanised steel wire braid" },
          { code: "3.2h", description: "Data" },
          { code: "3.3", description: "Install the following in accordance with BS7671:" },
          { code: "3.3a", description: "PVC Conduit" },
          { code: "3.3b", description: "Metallic Conduit" },
          { code: "3.3c", description: "PVC Trunking" },
          { code: "3.3d", description: "Metallic Trunking" },
          { code: "3.3e", description: "Cable Tray" },
          { code: "3.3f", description: "Cable Basket" },
          { code: "3.3g", description: "Ladder systems" },
          { code: "3.3h", description: "Ducting" },
          { code: "3.3i", description: "Modular wiring systems" },
          { code: "3.3j", description: "Busbar systems or Powertrack" },
          { code: "3.4", description: "Install in accordance to installation spec, manufacturers' instructions:" },
          { code: "3.4a", description: "Isolators /switches" },
          { code: "3.4b", description: "Socket-outlets" },
          { code: "3.4c", description: "Distribution-boards / consumer control units" },
          { code: "3.4d", description: "Overcurrent protective devices" },
          { code: "3.4e", description: "Luminaires" },
          { code: "3.4f", description: "Data socket outlets" },
          { code: "3.4g", description: "Other appropriate equipment" },
          { code: "3.5", description: "Communicate with others professionally during installation" },
          { code: "3.6", description: "Dispose of waste materials in accordance with requirements" }
        ]
      },
      {
        number: "4",
        title: "Confirm quality of completed work",
        performanceCriteria: [
          { code: "4.1", description: "Ensure installed wiring system/s & enclosure/s meet specified requirements:" },
          { code: "4.1a", description: "Are the correct type and fit for purpose" },
          { code: "4.1b", description: "Are installed in accordance with BS 7671" },
          { code: "4.1c", description: "Meet the installation specification/other relevant plans/instructions" },
          { code: "4.1d", description: "Are installed in accordance with any relevant manufacturer instructions" }
        ]
      }
    ]
  },
  {
    id: "NETP3-05",
    code: "NETP3-05",
    displayCode: "NETP3-05",
    reference: "NETP3-05",
    title: "Terminate and Connect Conductors",
    description: "Terminating and connecting electrical conductors",
    type: UnitType.EWA,
    creditValue: 3,
    glh: 26,
    progress: 0,
    learningOutcomes: [
      {
        number: "1",
        title: "Preparation and Safety",
        performanceCriteria: [
          { code: "1.1", description: "Evaluate and apply appropriate procedures to include:" },
          { code: "1.1a", description: "Selecting appropriate tools/equipment for termination and connection" },
          { code: "1.1b", description: "Adopting appropriate PPE" },
          { code: "1.1c", description: "Following safe system of work (risk assessment, method statement)" },
          { code: "1.2", description: "Assess/confirm it is safe to complete termination & connection:" },
          { code: "1.2a", description: "Checking for presence of supply/carrying out safe isolation" },
          { code: "1.2b", description: "Mechanical soundness of equipment to be connected to" },
          { code: "1.2c", description: "Checking for unsafe situations" }
        ]
      },
      {
        number: "2",
        title: "Termination and Connection",
        performanceCriteria: [
          { code: "2.1", description: "Terminate/connect cables/conductors according to instructions/BS7671:" },
          { code: "2.1a", description: "Single core cable (singles)" },
          { code: "2.1b", description: "Multicore insulated" },
          { code: "2.1c", description: "PVC/PVC flat profile cable" },
          { code: "2.1d", description: "MICC" },
          { code: "2.1e", description: "Fire performance" },
          { code: "2.1f", description: "SWA cable" },
          { code: "2.1g", description: "Data cables" },
          { code: "2.2", description: "Terminate/connect to electrical equipment according to instructions:" },
          { code: "2.2a", description: "Isolators/switches" },
          { code: "2.2b", description: "Socket-outlets" },
          { code: "2.2c", description: "Distribution boards/consumer units" },
          { code: "2.2d", description: "Luminaires" },
          { code: "2.2e", description: "Control equipment" },
          { code: "2.2f", description: "Data socket outlets" }
        ]
      },
      {
        number: "3",
        title: "Quality Checks",
        performanceCriteria: [
          { code: "3.1", description: "Check terminations/connections meet requirements:" },
          { code: "3.1a", description: "Correct polarity" },
          { code: "3.1b", description: "Correct colour coding" },
          { code: "3.1c", description: "Correct sizing" },
          { code: "3.1d", description: "Secure connections" },
          { code: "3.1e", description: "Signs of damage" },
          { code: "3.2", description: "Ensure terminations/connections are mechanically and electrically sound" }
        ]
      }
    ]
  },
  {
    id: "NETP3-06",
    code: "NETP3-06",
    displayCode: "NETP3-06",
    reference: "NETP3-06",
    title: "Inspect and Test Electrical Installations",
    description: "Inspection, testing and commissioning of electrical installations",
    type: UnitType.EWA,
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
          { code: "3.1", description: "Select the correct test instruments and their accessories for tests" },
          { code: "3.2", description: "Carry out tests in accordance with the installation specification and BS 7671 and manufacturer's instructions:" },
          { code: "3.2a", description: "Continuity" },
          { code: "3.2b", description: "Insulation resistance" },
          { code: "3.2c", description: "Polarity" },
          { code: "3.2d", description: "Earth fault loop impedance/earth electrode" },
          { code: "3.2e", description: "Prospective fault current" },
          { code: "3.2f", description: "RCD operation" },
          { code: "3.2g", description: "Functional testing" },
          { code: "3.3", description: "Analyse and verify test results reporting all findings to relevant persons, as appropriate:" },
          { code: "3.3a", description: "Representatives of other services/colleagues" },
          { code: "3.3b", description: "Customers/clients" },
          { code: "3.4", description: "Complete in accordance with BS 7671 and IET Guidance Note 3:" },
          { code: "3.4a", description: "An electrical installation certificate (+ Schedule of Inspections and Schedule of Test Results)" },
          { code: "3.4b", description: "A minor electrical installation works certificate" },
          { code: "3.5", description: "Complete the handover of electrical systems and equipment to relevant persons including the provision of accurate and complete documentation" },
          { code: "3.6", description: "Demonstrate to the customer/client that the operation of the circuits, equipment and components are in accordance with the installation specification" }
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
    id: "NETP3-07",
    code: "NETP3-07",
    displayCode: "NETP3-07",
    reference: "NETP3-07",
    title: "Diagnose and Correct Electrical Faults",
    description: "Diagnosing and rectifying faults in electrical installations",
    type: UnitType.EWA,
    creditValue: 3,
    glh: 26,
    progress: 0,
    learningOutcomes: [
      {
        number: "1",
        title: "Prepare to carry out fault diagnosis",
        performanceCriteria: [
          { code: "1.1", description: "Check it is safe to carry out fault diagnosis" },
          { code: "1.2", description: "Inform relevant personnel of the fault diagnosis work" },
          { code: "1.3", description: "Carry out the safe isolation procedure" },
          { code: "1.4", description: "Evaluate and apply appropriate methods to ensure safety" }
        ]
      },
      {
        number: "2",
        title: "Carry out fault diagnosis",
        performanceCriteria: [
          { code: "2.1", description: "Communicate effectively with relevant personnel to ascertain fault nature" },
          { code: "2.2", description: "Select and interpret appropriate documents for electrical systems" },
          { code: "2.3", description: "Assess and communicate potential disruption from fault diagnosis" },
          { code: "2.4", description: "Carry out relevant inspections analyzing findings" },
          { code: "2.5", description: "Confirm test instruments are fit for purpose and calibrated" },
          { code: "2.6", description: "Suitable diagnostic test to identify fault:" },
          { code: "2.6a", description: "Loss of supply" },
          { code: "2.6b", description: "Overload" },
          { code: "2.6c", description: "Short-circuit" },
          { code: "2.6d", description: "Earth fault" },
          { code: "2.6e", description: "Incorrect phase rotation" },
          { code: "2.6f", description: "High resistance joints/loose terminations" },
          { code: "2.6g", description: "Component, accessory or equipment faults" },
          { code: "2.6h", description: "Open circuit" },
          { code: "2.6i", description: "Signal faults" },
          { code: "2.7", description: "Use appropriate methods for locating faults:" },
          { code: "2.7a", description: "Using a logical approach" },
          { code: "2.7b", description: "Using safe working practices" },
          { code: "2.7c", description: "Interpretation of test readings" },
          { code: "2.8", description: "Use appropriate instruments for fault diagnosis:" },
          { code: "2.8a", description: "Voltage indicator" },
          { code: "2.8b", description: "Low resistance ohm meter" },
          { code: "2.8c", description: "Insulation resistance tester" },
          { code: "2.8d", description: "EFLI and PFC tester" },
          { code: "2.8e", description: "RCD tester" },
          { code: "2.8f", description: "Ammeter" },
          { code: "2.8g", description: "Phase rotation tester" },
          { code: "2.8h", description: "Other appropriate instrument" }
        ]
      },
      {
        number: "3",
        title: "Carry out fault rectification",
        performanceCriteria: [
          { code: "3.1", description: "Assess repairs/removals/replacements/implications to:" },
          { code: "3.1a", description: "Other workers/colleagues" },
          { code: "3.1b", description: "Customers/clients" },
          { code: "3.2", description: "Perform fault correction procedures correctly and safely" },
          { code: "3.3", description: "Assess & verify replacement components & associated equipment maintain:" },
          { code: "3.3a", description: "Ease of access for future maintenance" },
          { code: "3.3b", description: "Compliance with relevant regulations" },
          { code: "3.3c", description: "Compliance with manufacturer's instructions/procedures" },
          { code: "3.4", description: "Apply appropriate procedures to ensure electrical equipment and components are left safe, in accordance with industry regulations, if the fault cannot be corrected immediately based on technical assessment" },
          { code: "3.5", description: "Establish and perform an appropriate inspection and testing procedure to confirm that circuits/equipment/components are functioning correctly after completion of fault correction work" },
          { code: "3.6", description: "Record test results and other appropriate information regarding the fault correction work clearly and accurately and report it to relevant people:" },
          { code: "3.6a", description: "Other workers/colleagues" },
          { code: "3.6b", description: "Customers/clients" },
          { code: "3.6c", description: "Representatives of other services" }
        ]
      }
    ]
  },
  {
    id: "18ED3-02",
    code: "18ED3-02",
    displayCode: "18ED3-02",
    reference: "18ED3-02",
    title: "Requirements for Electrical Installations - IET Wiring Regulations 18th Edition",
    description: "Understanding and applying the IET Wiring Regulations BS7671:2018",
    type: UnitType.EWA,
    creditValue: 3,
    glh: 30,
    progress: 0,
    learningOutcomes: [
      {
        number: "1",
        title: "BS7671 Requirements",
        performanceCriteria: [
          { code: "1.1", description: "Hold valid BS7671:2018 qualification certificate" },
          { code: "1.2", description: "Certificate must be within current amendment period" }
        ]
      }
    ]
  },
  {
    id: "QIT3-001",
    code: "QIT3-001",
    displayCode: "QIT3-001",
    reference: "QIT3-001",
    title: "Initial Verification and Certification of Electrical Installations",
    description: "Initial verification, testing and certification of electrical installations",
    type: UnitType.EWA,
    creditValue: 4,
    glh: 35,
    progress: 0,
    learningOutcomes: [
      {
        number: "1",
        title: "Initial Verification Requirements",
        performanceCriteria: [
          { code: "1.1", description: "Hold valid 2391-50 or equivalent qualification certificate" },
          { code: "1.2", description: "Certificate must be within current validity period" }
        ]
      }
    ]
  }
];

// Qualifications data (actual data from iOS app)
export const qualifications = [
  {
    id: 'ewa',
    title: 'Experienced Worker Assessment',
    subtitle: 'EAL Level 3 Electrotechnical Experienced Worker Assessment',
    progress: 0,
    units: 8,
    unitsData: ewaUnits
  },
  {
    id: 'nvq1605',
    title: 'Level 3 NVQ Diploma in Installing Electrotechnical Systems and Equipment',
    subtitle: 'EAL Level 3 NVQ Diploma in Installing Electrotechnical Systems and Equipment (1605)',
    progress: 0,
    units: allNVQ1605Units.length,
    unitsData: allNVQ1605Units
  },
  {
    id: 'nvq2357',
    title: 'Level 3 NVQ Diploma in Installing Electrotechnical Systems and Equipment',
    subtitle: 'City & Guilds 2357 Qualification',
    progress: 0,
    units: 17,
    unitsData: [] // To be populated later
  }
];
