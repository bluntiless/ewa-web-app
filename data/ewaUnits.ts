import { Unit } from "@/models/Unit"

export const ewaUnits: Unit[] = [
  {
    code: "EWA_U1",
    title: "Health and Safety in the Workplace",
    description: "Understand and apply health and safety regulations relevant to the electrical industry.",
    qualification: "EWA",
    learningOutcomes: [
      {
        code: "EWA_U1_LO1",
        description: "Identify and assess workplace hazards.",
        performanceCriteria: [
          { code: "EWA_U1_PC1.1", description: "Identify common electrical hazards." },
          { code: "EWA_U1_PC1.2", description: "Assess risks associated with working at height." },
          { code: "EWA_U1_PC1.3", description: "Recognize risks from hazardous substances." },
        ],
      },
      {
        code: "EWA_U1_LO2",
        description: "Implement safe working practices.",
        performanceCriteria: [
          { code: "EWA_U1_PC2.1", description: "Apply lockout/tagout procedures." },
          { code: "EWA_U1_PC2.2", description: "Use appropriate personal protective equipment (PPE)." },
          { code: "EWA_U1_PC2.3", description: "Follow emergency procedures." },
        ],
      },
    ],
  },
  {
    code: "EWA_U2",
    title: "Electrical Principles",
    description: "Demonstrate understanding of fundamental electrical principles.",
    qualification: "EWA",
    learningOutcomes: [
      {
        code: "EWA_U2_LO1",
        description: "Explain Ohm's Law and its applications.",
        performanceCriteria: [
          { code: "EWA_U2_PC1.1", description: "Calculate voltage, current, and resistance in DC circuits." },
          { code: "EWA_U2_PC1.2", description: "Apply Ohm's Law to series and parallel circuits." },
        ],
      },
      {
        code: "EWA_U2_LO2",
        description: "Describe AC circuit characteristics.",
        performanceCriteria: [
          { code: "EWA_U2_PC2.1", description: "Explain concepts of frequency, phase, and RMS values." },
          { code: "EWA_U2_PC2.2", description: "Differentiate between reactive and resistive loads." },
        ],
      },
    ],
  },
  {
    code: "EWA_U3",
    title: "Installation and Maintenance",
    description: "Perform electrical installation and maintenance tasks.",
    qualification: "EWA",
    learningOutcomes: [
      {
        code: "EWA_U3_LO1",
        description: "Install wiring systems.",
        performanceCriteria: [
          { code: "EWA_U3_PC1.1", description: "Select appropriate cables and conduits." },
          { code: "EWA_U3_PC1.2", description: "Terminate cables correctly." },
        ],
      },
      {
        code: "EWA_U3_LO2",
        description: "Conduct routine maintenance.",
        performanceCriteria: [
          { code: "EWA_U3_PC2.1", description: "Perform visual inspections of electrical systems." },
          { code: "EWA_U3_PC2.2", description: "Test circuit continuity and insulation resistance." },
        ],
      },
    ],
  },
  {
    code: "EWA_U4",
    title: "Testing and Inspection",
    description: "Carry out electrical testing and inspection procedures.",
    qualification: "EWA",
    learningOutcomes: [
      {
        code: "EWA_U4_LO1",
        description: "Perform initial verification.",
        performanceCriteria: [
          { code: "EWA_U4_PC1.1", description: "Conduct dead tests (continuity, insulation resistance)." },
          { code: "EWA_U4_PC1.2", description: "Perform live tests (earth fault loop impedance, RCD)." },
        ],
      },
      {
        code: "EWA_U4_LO2",
        description: "Complete electrical installation certificates.",
        performanceCriteria: [
          { code: "EWA_U4_PC2.1", description: "Record test results accurately." },
          { code: "EWA_U4_PC2.2", description: "Issue relevant certification." },
        ],
      },
    ],
  },
  {
    code: "EWA_U5",
    title: "Fault Diagnosis and Rectification",
    description: "Diagnose and rectify electrical faults.",
    qualification: "EWA",
    learningOutcomes: [
      {
        code: "EWA_U5_LO1",
        description: "Identify common electrical faults.",
        performanceCriteria: [
          { code: "EWA_U5_PC1.1", description: "Troubleshoot open circuits and short circuits." },
          { code: "EWA_U5_PC1.2", description: "Diagnose earth faults." },
        ],
      },
      {
        code: "EWA_U5_LO2",
        description: "Implement fault rectification procedures.",
        performanceCriteria: [
          { code: "EWA_U5_PC2.1", description: "Repair faulty wiring and components." },
          { code: "EWA_U5_PC2.2", description: "Verify repairs meet safety standards." },
        ],
      },
    ],
  },
  {
    code: "EWA_U6",
    title: "Environmental Best Practices",
    description: "Apply environmental best practices in electrical work.",
    qualification: "EWA",
    learningOutcomes: [
      {
        code: "EWA_U6_LO1",
        description: "Manage waste materials.",
        performanceCriteria: [
          { code: "EWA_U6_PC1.1", description: "Dispose of electrical waste according to regulations." },
          { code: "EWA_U6_PC1.2", description: "Recycle materials where possible." },
        ],
      },
      {
        code: "EWA_U6_LO2",
        description: "Promote energy efficiency.",
        performanceCriteria: [
          { code: "EWA_U6_PC2.1", description: "Advise on energy-saving electrical solutions." },
          { code: "EWA_U6_PC2.2", description: "Install energy-efficient lighting and appliances." },
        ],
      },
    ],
  },
  {
    code: "EWA_U7",
    title: "Customer Service and Communication",
    description: "Communicate effectively with clients and colleagues.",
    qualification: "EWA",
    learningOutcomes: [
      {
        code: "EWA_U7_LO1",
        description: "Interact professionally with customers.",
        performanceCriteria: [
          { code: "EWA_U7_PC1.1", description: "Explain technical information clearly to non-technical clients." },
          { code: "EWA_U7_PC1.2", description: "Address customer concerns and complaints effectively." },
        ],
      },
      {
        code: "EWA_U7_LO2",
        description: "Collaborate with team members.",
        performanceCriteria: [
          { code: "EWA_U7_PC2.1", description: "Share information and best practices with colleagues." },
          { code: "EWA_U7_PC2.2", description: "Participate in team meetings and discussions." },
        ],
      },
    ],
  },
  {
    code: "EWA_U8",
    title: "Professional Development",
    description: "Engage in continuous professional development.",
    qualification: "EWA",
    learningOutcomes: [
      {
        code: "EWA_U8_LO1",
        description: "Identify personal development needs.",
        performanceCriteria: [
          { code: "EWA_U8_PC1.1", description: "Review performance and identify areas for improvement." },
          { code: "EWA_U8_PC1.2", description: "Stay updated with industry standards and technologies." },
        ],
      },
      {
        code: "EWA_U8_LO2",
        description: "Participate in training and learning activities.",
        performanceCriteria: [
          { code: "EWA_U8_PC2.1", description: "Attend workshops and seminars." },
          { code: "EWA_U8_PC2.2", description: "Complete online courses or certifications." },
        ],
      },
    ],
  },
]

export const allEWAUnits = ewaUnits
