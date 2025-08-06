import { Unit } from "@/models/Unit"

export const ealUnits: Unit[] = [
  {
    code: "NVQ_U1",
    title: "Working Safely in an Engineering Environment",
    description: "Understand and apply safe working practices in engineering.",
    qualification: "NVQ",
    learningOutcomes: [
      {
        code: "NVQ_U1_LO1",
        description: "Comply with health and safety legislation.",
        performanceCriteria: [
          { code: "NVQ_U1_PC1.1", description: "Identify relevant health and safety regulations." },
          { code: "NVQ_U1_PC1.2", description: "Follow company safety procedures." },
        ],
      },
      {
        code: "NVQ_U1_LO2",
        description: "Use personal protective equipment (PPE) correctly.",
        performanceCriteria: [
          { code: "NVQ_U1_PC2.1", description: "Select appropriate PPE for tasks." },
          { code: "NVQ_U1_PC2.2", description: "Inspect and maintain PPE." },
        ],
      },
    ],
  },
  {
    code: "NVQ_U2",
    title: "Carrying Out Fault Diagnosis on Electrical Equipment",
    description: "Diagnose and rectify faults in electrical systems.",
    qualification: "NVQ",
    learningOutcomes: [
      {
        code: "NVQ_U2_LO1",
        description: "Identify symptoms of electrical faults.",
        performanceCriteria: [
          { code: "NVQ_U2_PC1.1", description: "Interpret fault codes and indicators." },
          { code: "NVQ_U2_PC1.2", description: "Conduct visual inspections for damage." },
        ],
      },
      {
        code: "NVQ_U2_LO2",
        description: "Apply diagnostic techniques.",
        performanceCriteria: [
          { code: "NVQ_U2_PC2.1", description: "Use test equipment to locate faults." },
          { code: "NVQ_U2_PC2.2", description: "Analyze circuit diagrams to pinpoint issues." },
        ],
      },
    ],
  },
  {
    code: "NVQ_U3",
    title: "Maintaining Electrical Equipment",
    description: "Perform routine maintenance on electrical equipment.",
    qualification: "NVQ",
    learningOutcomes: [
      {
        code: "NVQ_U3_LO1",
        description: "Plan maintenance activities.",
        performanceCriteria: [
          { code: "NVQ_U3_PC1.1", description: "Schedule preventative maintenance tasks." },
          { code: "NVQ_U3_PC1.2", description: "Obtain necessary permits and isolations." },
        ],
      },
      {
        code: "NVQ_U3_LO2",
        description: "Execute maintenance procedures.",
        performanceCriteria: [
          { code: "NVQ_U3_PC2.1", description: "Clean and lubricate components." },
          { code: "NVQ_U3_PC2.2", description: "Replace worn or faulty parts." },
        ],
      },
    ],
  },
  {
    code: "NVQ_U4",
    title: "Installing Electrical Equipment",
    description: "Install electrical equipment and systems.",
    qualification: "NVQ",
    learningOutcomes: [
      {
        code: "NVQ_U4_LO1",
        description: "Prepare for installation.",
        performanceCriteria: [
          { code: "NVQ_U4_PC1.1", description: "Read and interpret installation drawings." },
          { code: "NVQ_U4_PC1.2", description: "Prepare mounting surfaces and cable routes." },
        ],
      },
      {
        code: "NVQ_U4_LO2",
        description: "Connect electrical equipment.",
        performanceCriteria: [
          { code: "NVQ_U4_PC2.1", description: "Wire components according to specifications." },
          { code: "NVQ_U4_PC2.2", description: "Ensure proper earthing and bonding." },
        ],
      },
    ],
  },
  {
    code: "NVQ_U5",
    title: "Testing and Commissioning Electrical Equipment",
    description: "Test and commission electrical equipment.",
    qualification: "NVQ",
    learningOutcomes: [
      {
        code: "NVQ_U5_LO1",
        description: "Perform pre-commissioning checks.",
        performanceCriteria: [
          { code: "NVQ_U5_PC1.1", description: "Verify correct installation." },
          { code: "NVQ_U5_PC1.2", description: "Conduct insulation resistance tests." },
        ],
      },
      {
        code: "NVQ_U5_LO2",
        description: "Execute commissioning procedures.",
        performanceCriteria: [
          { code: "NVQ_U5_PC2.1", description: "Perform functional tests." },
          { code: "NVQ_U5_PC2.2", description: "Record commissioning data." },
        ],
      },
    ],
  },
  {
    code: "NVQ_U6",
    title: "Working Effectively and Efficiently in Engineering",
    description: "Work effectively and efficiently in an engineering environment.",
    qualification: "NVQ",
    learningOutcomes: [
      {
        code: "NVQ_U6_LO1",
        description: "Plan and organize work activities.",
        performanceCriteria: [
          { code: "NVQ_U6_PC1.1", description: "Prioritize tasks effectively." },
          { code: "NVQ_U6_PC1.2", description: "Manage time and resources efficiently." },
        ],
      },
      {
        code: "NVQ_U6_LO2",
        description: "Communicate effectively.",
        performanceCriteria: [
          { code: "NVQ_U6_PC2.1", description: "Convey information clearly to colleagues." },
          { code: "NVQ_U6_PC2.2", description: "Listen actively to instructions and feedback." },
        ],
      },
    ],
  },
  {
    code: "NVQ_U7",
    title: "Using and Communicating Technical Information",
    description: "Use and communicate technical information.",
    qualification: "NVQ",
    learningOutcomes: [
      {
        code: "NVQ_U7_LO1",
        description: "Interpret technical documents.",
        performanceCriteria: [
          { code: "NVQ_U7_PC1.1", description: "Read and understand engineering drawings." },
          { code: "NVQ_U7_PC1.2", description: "Interpret technical specifications." },
        ],
      },
      {
        code: "NVQ_U7_LO2",
        description: "Communicate technical information.",
        performanceCriteria: [
          { code: "NVQ_U7_PC2.1", description: "Prepare technical reports." },
          { code: "NVQ_U7_PC2.2", description: "Present technical data clearly." },
        ],
      },
    ],
  },
  {
    code: "NVQ_U8",
    title: "Carrying Out Wiring and Connection of Electrical Equipment and Components",
    description: "Perform wiring and connection tasks.",
    qualification: "NVQ",
    learningOutcomes: [
      {
        code: "NVQ_U8_LO1",
        description: "Prepare cables and conductors.",
        performanceCriteria: [
          { code: "NVQ_U8_PC1.1", description: "Strip insulation without damaging conductors." },
          { code: "NVQ_U8_PC1.2", description: "Crimp and solder terminals correctly." },
        ],
      },
      {
        code: "NVQ_U8_LO2",
        description: "Connect electrical components.",
        performanceCriteria: [
          { code: "NVQ_U8_PC2.1", description: "Follow wiring diagrams accurately." },
          { code: "NVQ_U8_PC2.2", description: "Ensure secure and safe connections." },
        ],
      },
    ],
  },
  {
    code: "NVQ_U9",
    title: "Inspecting and Testing Electrical Installations",
    description: "Inspect and test electrical installations.",
    qualification: "NVQ",
    learningOutcomes: [
      {
        code: "NVQ_U9_LO1",
        description: "Conduct visual inspections.",
        performanceCriteria: [
          { code: "NVQ_U9_PC1.1", description: "Check for physical damage and correct installation." },
          { code: "NVQ_U9_PC1.2", description: "Verify compliance with regulations." },
        ],
      },
      {
        code: "NVQ_U9_LO2",
        description: "Perform electrical tests.",
        performanceCriteria: [
          { code: "NVQ_U9_PC2.1", description: "Measure earth electrode resistance." },
          { code: "NVQ_U9_PC2.2", description: "Test RCD operation." },
        ],
      },
    ],
  },
  {
    code: "NVQ_U10",
    title: "Maintaining and Repairing Electrical Systems",
    description: "Maintain and repair electrical systems.",
    qualification: "NVQ",
    learningOutcomes: [
      {
        code: "NVQ_U10_LO1",
        description: "Perform preventative maintenance.",
        performanceCriteria: [
          { code: "NVQ_U10_PC1.1", description: "Clean and inspect system components." },
          { code: "NVQ_U10_PC1.2", description: "Replace worn parts before failure." },
        ],
      },
      {
        code: "NVQ_U10_LO2",
        description: "Rectify system faults.",
        performanceCriteria: [
          { code: "NVQ_U10_PC2.1", description: "Isolate faulty sections safely." },
          { code: "NVQ_U10_PC2.2", description: "Repair or replace defective components." },
        ],
      },
    ],
  },
  {
    code: "NVQ_U11",
    title: "Installing and Connecting Wiring Systems",
    description: "Install and connect wiring systems.",
    qualification: "NVQ",
    learningOutcomes: [
      {
        code: "NVQ_U11_LO1",
        description: "Prepare wiring routes.",
        performanceCriteria: [
          { code: "NVQ_U11_PC1.1", description: "Select appropriate containment systems." },
          { code: "NVQ_U11_PC1.2", description: "Install conduits and trunking." },
        ],
      },
      {
        code: "NVQ_U11_LO2",
        description: "Install and terminate cables.",
        performanceCriteria: [
          { code: "NVQ_U11_PC2.1", description: "Pull cables through containment." },
          { code: "NVQ_U11_PC2.2", description: "Terminate cables at accessories and equipment." },
        ],
      },
    ],
  },
  {
    code: "NVQ_U12",
    title: "Maintaining and Servicing Electrical Control Systems",
    description: "Maintain and service electrical control systems.",
    qualification: "NVQ",
    learningOutcomes: [
      {
        code: "NVQ_U12_LO1",
        description: "Diagnose faults in control systems.",
        performanceCriteria: [
          { code: "NVQ_U12_PC1.1", description: "Interpret control circuit diagrams." },
          { code: "NVQ_U12_PC1.2", description: "Use diagnostic tools to identify component failures." },
        ],
      },
      {
        code: "NVQ_U12_LO2",
        description: "Perform maintenance on control systems.",
        performanceCriteria: [
          { code: "NVQ_U12_PC2.1", description: "Calibrate sensors and actuators." },
          { code: "NVQ_U12_PC2.2", description: "Replace faulty relays and contactors." },
        ],
      },
    ],
  },
  {
    code: "NVQ_U13",
    title: "Installing and Commissioning Electrical Control Systems",
    description: "Install and commission electrical control systems.",
    qualification: "NVQ",
    learningOutcomes: [
      {
        code: "NVQ_U13_LO1",
        description: "Install control panels and components.",
        performanceCriteria: [
          { code: "NVQ_U13_PC1.1", description: "Mount control panel enclosures." },
          { code: "NVQ_U13_PC1.2", description: "Wire internal components of control panels." },
        ],
      },
      {
        code: "NVQ_U13_LO2",
        description: "Commission control systems.",
        performanceCriteria: [
          { code: "NVQ_U13_PC2.1", description: "Perform power-up tests." },
          { code: "NVQ_U13_PC2.2", description: "Verify system functionality and safety interlocks." },
        ],
      },
    ],
  },
  {
    code: "NVQ_U14",
    title: "Working with Programmable Logic Controllers (PLCs)",
    description: "Work with Programmable Logic Controllers (PLCs).",
    qualification: "NVQ",
    learningOutcomes: [
      {
        code: "NVQ_U14_LO1",
        description: "Understand PLC hardware and software.",
        performanceCriteria: [
          { code: "NVQ_U14_PC1.1", description: "Identify different types of PLC modules." },
          { code: "NVQ_U14_PC1.2", description: "Explain basic PLC programming languages." },
        ],
      },
      {
        code: "NVQ_U14_LO2",
        description: "Program and troubleshoot PLCs.",
        performanceCriteria: [
          { code: "NVQ_U14_PC2.1", description: "Write simple ladder logic programs." },
          { code: "NVQ_U14_PC2.2", description: "Diagnose and resolve PLC program errors." },
        ],
      },
    ],
  },
  {
    code: "NVQ_U15",
    title: "Maintaining and Repairing Rotating Electrical Machines",
    description: "Maintain and repair rotating electrical machines.",
    qualification: "NVQ",
    learningOutcomes: [
      {
        code: "NVQ_U15_LO1",
        description: "Perform preventative maintenance on motors.",
        performanceCriteria: [
          { code: "NVQ_U15_PC1.1", description: "Inspect motor windings and bearings." },
          { code: "NVQ_U15_PC1.2", description: "Lubricate motor components." },
        ],
      },
      {
        code: "NVQ_U15_LO2",
        description: "Diagnose and repair motor faults.",
        performanceCriteria: [
          { code: "NVQ_U15_PC2.1", description: "Test motor insulation and continuity." },
          { code: "NVQ_U15_PC2.2", description: "Replace faulty motor components." },
        ],
      },
    ],
  },
  {
    code: "NVQ_U16",
    title: "Working with Electrical Drawings and Schematics",
    description: "Work with electrical drawings and schematics.",
    qualification: "NVQ",
    learningOutcomes: [
      {
        code: "NVQ_U16_LO1",
        description: "Interpret electrical symbols and conventions.",
        performanceCriteria: [
          { code: "NVQ_U16_PC1.1", description: "Identify common electrical symbols." },
          { code: "NVQ_U16_PC1.2", description: "Understand line diagrams and wiring diagrams." },
        ],
      },
      {
        code: "NVQ_U16_LO2",
        description: "Create simple electrical drawings.",
        performanceCriteria: [
          { code: "NVQ_U16_PC2.1", description: "Draw basic circuit diagrams." },
          { code: "NVQ_U16_PC2.2", description: "Annotate drawings with relevant information." },
        ],
      },
    ],
  },
  {
    code: "NVQ_U17",
    title: "Applying Environmental Regulations in Electrical Work",
    description: "Apply environmental regulations in electrical work.",
    qualification: "NVQ",
    learningOutcomes: [
      {
        code: "NVQ_U17_LO1",
        description: "Comply with environmental legislation.",
        performanceCriteria: [
          { code: "NVQ_U17_PC1.1", description: "Identify environmental regulations relevant to electrical waste." },
          { code: "NVQ_U17_PC1.2", description: "Follow procedures for hazardous waste disposal." },
        ],
      },
      {
        code: "NVQ_U17_LO2",
        description: "Implement sustainable practices.",
        performanceCriteria: [
          { code: "NVQ_U17_PC2.1", description: "Minimize energy consumption in electrical installations." },
          { code: "NVQ_U17_PC2.2", description: "Promote the use of renewable energy sources." },
        ],
      },
    ],
  },
]

export const allEALUnits = ealUnits
