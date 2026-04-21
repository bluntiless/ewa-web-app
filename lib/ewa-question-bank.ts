
export type Question = {
  id: string
  category: string
  prompt: string
  options: string[]
  correctIndex: number
  explanation: string
}

function makePowerQuestions(): Question[] {
  const voltages = [110, 120, 230, 240, 400]
  const currents = [2, 4, 6, 8, 10, 12, 16, 20]
  const questions: Question[] = []
  let i = 1

  for (const voltage of voltages) {
    for (const current of currents.slice(0, 4)) {
      const power = voltage * current
      questions.push({
        id: `power-${i++}`,
        category: "Electrical Principles",
        prompt: `A circuit has a voltage of ${voltage} V and a current of ${current} A. What is the power?`,
        options: [`${power / 10} W`, `${power} W`, `${power * 10} W`, `${power + current} W`],
        correctIndex: 1,
        explanation: `Power is calculated using P = V × I. ${voltage} × ${current} = ${power} W.`,
      })
    }
  }
  return questions.slice(0, 20)
}

function makeCurrentQuestions(): Question[] {
  const questions: Question[] = []
  const sets = [
    [230, 2300], [230, 1150], [230, 4600], [240, 2400], [240, 1200],
    [240, 4800], [120, 1200], [120, 600], [120, 1800], [110, 550],
    [110, 1100], [400, 4000], [400, 8000], [230, 690], [230, 920],
    [240, 3600], [240, 960], [120, 960], [110, 880], [400, 2000]
  ]
  for (let i = 0; i < sets.length; i++) {
    const [voltage, power] = sets[i]
    const current = power / voltage
    questions.push({
      id: `current-${i + 1}`,
      category: "Electrical Principles",
      prompt: `An appliance is rated at ${power} W on a ${voltage} V supply. What current will it draw?`,
      options: [`${(current / 2).toFixed(1)} A`, `${current.toFixed(1)} A`, `${(current * 2).toFixed(1)} A`, `${(current + 1).toFixed(1)} A`],
      correctIndex: 1,
      explanation: `Current is calculated using I = P ÷ V. ${power} ÷ ${voltage} = ${current.toFixed(1)} A.`,
    })
  }
  return questions
}

function makeResistanceQuestions(): Question[] {
  const questions: Question[] = []
  const sets = [
    [230, 10], [230, 5], [230, 2], [240, 6], [240, 12],
    [120, 4], [120, 8], [110, 5], [110, 10], [400, 20],
    [400, 10], [24, 2], [24, 4], [48, 6], [48, 12],
    [12, 1], [12, 2], [60, 5], [60, 10], [230, 1]
  ]
  for (let i = 0; i < sets.length; i++) {
    const [voltage, current] = sets[i]
    const resistance = voltage / current
    questions.push({
      id: `resistance-${i + 1}`,
      category: "Electrical Principles",
      prompt: `Using Ohm's Law, what is the resistance of a load supplied at ${voltage} V drawing ${current} A?`,
      options: [`${(resistance / 2).toFixed(1)} Ω`, `${resistance.toFixed(1)} Ω`, `${(resistance * 2).toFixed(1)} Ω`, `${(resistance + current).toFixed(1)} Ω`],
      correctIndex: 1,
      explanation: `Resistance is calculated using R = V ÷ I. ${voltage} ÷ ${current} = ${resistance.toFixed(1)} Ω.`,
    })
  }
  return questions
}

function makeSafetyQuestions(): Question[] {
  const items = [
    {
      prompt: "What is the first step before working on a circuit?",
      options: ["Start removing accessories", "Isolate the supply", "Replace the protective device", "Carry out insulation resistance testing"],
      correctIndex: 1,
      explanation: "Safe isolation begins with isolating the supply."
    },
    {
      prompt: "What is the safest method to verify dead after isolation?",
      options: ["Use a neon screwdriver only", "Use an approved voltage indicator proved before and after use", "Look to see whether lights are off", "Assume the circuit is dead because the switch is off"],
      correctIndex: 1,
      explanation: "A proven voltage indicator checked before and after use is standard good practice."
    },
    {
      prompt: "What best describes safe isolation?",
      options: ["Turning off a wall switch", "Removing a lamp", "A formal procedure to isolate, secure, and prove dead before work", "Disconnecting the neutral conductor only"],
      correctIndex: 2,
      explanation: "Safe isolation is a controlled procedure, not just switching something off."
    },
    {
      prompt: "Why are risk assessments used before electrical work starts?",
      options: ["To increase voltage drop", "To identify hazards and control measures", "To avoid issuing certificates", "To replace supervision"],
      correctIndex: 1,
      explanation: "Risk assessments are used to identify hazards and suitable control measures."
    },
    {
      prompt: "Which item is an example of personal protective equipment?",
      options: ["Circuit chart", "Insulated gloves", "Test certificate", "Consumer unit schedule"],
      correctIndex: 1,
      explanation: "Insulated gloves are PPE."
    },
    {
      prompt: "If you discover damaged insulation on a live circuit during inspection, what should happen first?",
      options: ["Leave it for the next visit", "Isolate or make safe before further work", "Energise it to confirm the fault", "Ignore it if the load still operates"],
      correctIndex: 1,
      explanation: "The immediate priority is to make the situation safe."
    },
    {
      prompt: "What is the purpose of a lock-off device during isolation?",
      options: ["To improve earth fault current", "To secure the isolating device against reconnection", "To replace proving dead", "To increase breaking capacity"],
      correctIndex: 1,
      explanation: "Lock-off devices help prevent inadvertent reconnection."
    },
    {
      prompt: "Why should warning notices be used when isolating equipment?",
      options: ["To identify the cable colour", "To warn others that work is in progress and the supply must not be restored", "To measure current", "To reduce loop impedance"],
      correctIndex: 1,
      explanation: "Warning notices communicate that the equipment is isolated for safety reasons."
    },
    {
      prompt: "Which of the following is the best example of an unsafe assumption?",
      options: ["Using the correct test instrument", "Checking the circuit diagram", "Assuming a circuit is dead because it has stopped working", "Using insulated tools"],
      correctIndex: 2,
      explanation: "A circuit must be proved dead; it must never be assumed."
    },
    {
      prompt: "Why must live working be avoided unless absolutely necessary?",
      options: ["Because certificates take longer to complete", "Because it increases the risk of electric shock and injury", "Because it improves efficiency", "Because it reduces test values"],
      correctIndex: 1,
      explanation: "Live working introduces significantly greater risk."
    },
  ]
  const questions: Question[] = []
  for (let i = 0; i < 20; i++) {
    const item = items[i % items.length]
    questions.push({
      id: `safety-${i + 1}`,
      category: "Safe Isolation and H&S",
      ...item
    })
  }
  return questions
}

function makeEarthingQuestions(): Question[] {
  const items = [
    {
      prompt: "What is the main purpose of protective earthing?",
      options: ["To increase circuit current", "To provide a safe path for fault current", "To reduce supply voltage", "To improve aesthetics"],
      correctIndex: 1,
      explanation: "Protective earthing provides a path for fault current to assist automatic disconnection."
    },
    {
      prompt: "What is the function of main protective bonding?",
      options: ["To replace circuit protection", "To reduce the risk of dangerous potential differences by bonding extraneous conductive parts", "To increase cable capacity", "To meter electricity"],
      correctIndex: 1,
      explanation: "Bonding helps minimise dangerous voltage differences."
    },
    {
      prompt: "Which of the following is most likely to be an extraneous conductive part?",
      options: ["PVC trunking", "A metal water pipe entering the building", "A plastic accessory box", "A laminated worktop"],
      correctIndex: 1,
      explanation: "A metal water pipe entering the building is a classic example."
    },
    {
      prompt: "What does CPC stand for?",
      options: ["Current Power Circuit", "Circuit Protective Conductor", "Combined Protection Cable", "Circuit Phase Connector"],
      correctIndex: 1,
      explanation: "CPC stands for Circuit Protective Conductor."
    },
    {
      prompt: "If a CPC is missing, what is the main concern?",
      options: ["Lower energy bills", "Reduced fault protection and no reliable automatic disconnection", "Higher insulation resistance", "Lower current draw"],
      correctIndex: 1,
      explanation: "Without a CPC, exposed conductive parts may not disconnect safely under fault conditions."
    },
    {
      prompt: "Which conductor colour identifies the CPC under harmonised colours?",
      options: ["Blue", "Brown", "Green/yellow", "Black"],
      correctIndex: 2,
      explanation: "Green/yellow identifies the protective conductor."
    },
    {
      prompt: "What is the difference between earthing and bonding?",
      options: ["There is no difference", "Earthing connects exposed conductive parts to earth; bonding connects extraneous conductive parts to the electrical installation", "Bonding is for voltage drop only", "Earthing is only used outdoors"],
      correctIndex: 1,
      explanation: "Earthing and bonding serve different but related protective functions."
    },
    {
      prompt: "What is the main purpose of supplementary bonding where required?",
      options: ["To increase lighting levels", "To reduce risk from simultaneous contact with conductive parts", "To replace overcurrent protection", "To reduce power factor"],
      correctIndex: 1,
      explanation: "Supplementary bonding reduces the risk of shock from accessible conductive parts."
    },
    {
      prompt: "Which test is commonly used to confirm continuity of a CPC?",
      options: ["Insulation resistance", "R1+R2 continuity", "Polarity only", "Prospective fault current"],
      correctIndex: 1,
      explanation: "R1+R2 continuity testing is commonly used for CPC verification."
    },
    {
      prompt: "Why is bonding important around metal service pipes?",
      options: ["To increase circuit loading", "To reduce dangerous touch voltages", "To change fuse ratings", "To improve Wi-Fi"],
      correctIndex: 1,
      explanation: "Bonding reduces dangerous voltage differences between conductive parts."
    },
  ]
  const questions: Question[] = []
  for (let i = 0; i < 20; i++) {
    const item = items[i % items.length]
    questions.push({
      id: `earthing-${i + 1}`,
      category: "Earthing and Bonding",
      ...item
    })
  }
  return questions
}

function makeProtectionQuestions(): Question[] {
  const items = [
    {
      prompt: "Which device is primarily intended to provide protection against earth leakage current?",
      options: ["MCB", "Fuse", "RCD", "Isolator"],
      correctIndex: 2,
      explanation: "An RCD is designed to detect imbalance between line and neutral currents."
    },
    {
      prompt: "What does an MCB primarily protect against?",
      options: ["Earth leakage only", "Overcurrent", "Low voltage", "Loss of continuity"],
      correctIndex: 1,
      explanation: "An MCB protects against overcurrent."
    },
    {
      prompt: "A 13 A plug-top fuse mainly protects the:",
      options: ["Appliance flex", "Whole installation", "Distribution network", "Consumer unit enclosure"],
      correctIndex: 0,
      explanation: "The fuse in a plug top protects the flexible cord and connected appliance."
    },
    {
      prompt: "What is the main purpose of an isolator?",
      options: ["To measure loop impedance", "To safely disconnect equipment from supply", "To detect earth leakage", "To increase voltage"],
      correctIndex: 1,
      explanation: "An isolator safely disconnects equipment from its supply."
    },
    {
      prompt: "Which statement best describes a Type B MCB in general use?",
      options: ["Used only on DC systems", "Commonly used where lower inrush currents are expected", "Provides earth leakage protection", "Trips at higher multiples than Type C"],
      correctIndex: 1,
      explanation: "Type B devices are commonly used on standard domestic and general final circuits."
    },
    {
      prompt: "Which factor should be checked before selecting a protective device?",
      options: ["Only the faceplate colour", "Design current, fault current, and disconnection requirements", "Only room décor", "Only cable route length"],
      correctIndex: 1,
      explanation: "Protective device selection must consider current demand, fault level, and disconnection performance."
    },
    {
      prompt: "A nuisance tripping RCD may be caused by:",
      options: ["Correct cable sizing", "Accumulated leakage current or an equipment fault", "A perfect insulation value", "Low ambient temperature alone"],
      correctIndex: 1,
      explanation: "Leakage current and equipment defects commonly cause nuisance tripping."
    },
    {
      prompt: "What is one key purpose of automatic disconnection of supply?",
      options: ["To increase load capacity", "To reduce shock risk under fault conditions", "To improve efficiency", "To avoid inspections"],
      correctIndex: 1,
      explanation: "ADS is a key protective measure against electric shock."
    },
    {
      prompt: "Which device is not intended to provide overcurrent protection by itself?",
      options: ["Fuse", "MCB", "RCD", "RCBO"],
      correctIndex: 2,
      explanation: "An RCD alone does not provide overcurrent protection."
    },
    {
      prompt: "What does RCBO stand for in practice?",
      options: ["A device combining overcurrent and residual current protection", "A type of isolator only", "A bonding clamp", "A temporary lock-off accessory"],
      correctIndex: 0,
      explanation: "An RCBO combines MCB and RCD functions."
    },
  ]
  const questions: Question[] = []
  for (let i = 0; i < 20; i++) {
    const item = items[i % items.length]
    questions.push({
      id: `protection-${i + 1}`,
      category: "Protection Devices",
      ...item
    })
  }
  return questions
}

function makeTestingQuestions(): Question[] {
  const items = [
    {
      prompt: "Which instrument is commonly used to measure insulation resistance?",
      options: ["Clamp meter", "Multifunction tester", "Socket tester only", "Phase rotation meter"],
      correctIndex: 1,
      explanation: "A multifunction tester commonly performs insulation resistance tests."
    },
    {
      prompt: "What is polarity testing intended to confirm?",
      options: ["That the circuit is fully loaded", "That devices are connected to the correct conductors", "That insulation is high enough", "That voltage drop is acceptable"],
      correctIndex: 1,
      explanation: "Polarity confirms conductors are connected as intended."
    },
    {
      prompt: "What is the purpose of inspection before testing?",
      options: ["To avoid certificates", "To identify visible defects before testing", "To increase current-carrying capacity", "To replace continuity tests"],
      correctIndex: 1,
      explanation: "Inspection can reveal defects before energised or dead tests are performed."
    },
    {
      prompt: "What does Zs represent?",
      options: ["Source voltage only", "External earth loop impedance only", "Earth fault loop impedance at the point of fault", "Prospective short-circuit current only"],
      correctIndex: 2,
      explanation: "Zs is the earth fault loop impedance measured at the point of fault."
    },
    {
      prompt: "What is likely to cause a low insulation resistance reading?",
      options: ["Correct polarity", "Leakage between conductors or to earth", "A sound CPC", "Low power factor"],
      correctIndex: 1,
      explanation: "Low insulation resistance suggests unwanted leakage paths."
    },
    {
      prompt: "What should often be done with sensitive electronic equipment before insulation resistance testing?",
      options: ["Increase the test voltage", "Disconnect or otherwise protect it as appropriate", "Bond it to gas pipework", "Leave it energised"],
      correctIndex: 1,
      explanation: "Sensitive equipment may be damaged by insulation resistance testing if left connected."
    },
    {
      prompt: "Which result would normally be expected on a sound continuity test of a CPC?",
      options: ["Infinite resistance", "A low resistance reading", "No reading at all", "A high voltage reading"],
      correctIndex: 1,
      explanation: "A sound CPC should show low resistance continuity."
    },
    {
      prompt: "Why are test results recorded?",
      options: ["To increase load current", "To provide evidence that inspection and testing were carried out", "To replace risk assessments", "To avoid using instruments"],
      correctIndex: 1,
      explanation: "Recorded results form part of the evidence that the installation has been inspected and tested."
    },
    {
      prompt: "Which document is typically completed after initial verification of a new installation?",
      options: ["Electrical Installation Certificate", "Utility bill", "Appliance manual", "Material order form"],
      correctIndex: 0,
      explanation: "An Electrical Installation Certificate is commonly issued after initial verification."
    },
    {
      prompt: "Which of the following is a dead test?",
      options: ["Earth fault loop impedance", "Insulation resistance", "RCD trip time", "Prospective fault current on a live board"],
      correctIndex: 1,
      explanation: "Insulation resistance is a dead test."
    },
  ]
  const questions: Question[] = []
  for (let i = 0; i < 20; i++) {
    const item = items[i % items.length]
    questions.push({
      id: `testing-${i + 1}`,
      category: "Inspection and Testing",
      ...item
    })
  }
  return questions
}

function makeInstallationQuestions(): Question[] {
  const items = [
    {
      prompt: "When cables are installed in a high-temperature environment, what must be considered?",
      options: ["Colour coding only", "Mechanical protection only", "Current-carrying capacity adjustment", "Only the brand of cable"],
      correctIndex: 2,
      explanation: "Higher ambient temperature affects cable current-carrying capacity."
    },
    {
      prompt: "Which factor directly affects voltage drop?",
      options: ["Cable length", "Accessory plate finish", "Logo on the enclosure", "Brand of tester used"],
      correctIndex: 0,
      explanation: "Cable length is one of the main factors affecting voltage drop."
    },
    {
      prompt: "A ring final circuit in many domestic installations is commonly wired in what conductor size?",
      options: ["1.0 mm²", "1.5 mm²", "2.5 mm²", "10.0 mm²"],
      correctIndex: 2,
      explanation: "2.5 mm² is the common conductor size used for many ring final circuits."
    },
    {
      prompt: "Which installation method is most likely to reduce a cable's current-carrying capacity significantly?",
      options: ["Clipped direct", "Installed in thermal insulation", "Run in free air", "On open cable tray"],
      correctIndex: 1,
      explanation: "Thermal insulation reduces heat dissipation and therefore current-carrying capacity."
    },
    {
      prompt: "Why is mechanical protection important for cable routes?",
      options: ["To improve aesthetics only", "To reduce the risk of damage during use or maintenance", "To change the supply frequency", "To avoid all testing"],
      correctIndex: 1,
      explanation: "Mechanical protection reduces the chance of physical damage to cables."
    },
    {
      prompt: "What is one main purpose of trunking or conduit?",
      options: ["To meter electricity", "To provide containment and protection for cables", "To replace protective devices", "To improve power factor"],
      correctIndex: 1,
      explanation: "Trunking and conduit contain and protect cables."
    },
    {
      prompt: "Why are manufacturer’s instructions important during installation?",
      options: ["They are optional marketing material only", "They help ensure equipment is installed safely and correctly", "They replace BS 7671 completely", "They only matter after energising"],
      correctIndex: 1,
      explanation: "Manufacturer instructions form part of correct installation practice."
    },
    {
      prompt: "What should be considered when selecting a cable?",
      options: ["Current-carrying capacity, voltage drop, and installation method", "Only the sheath colour", "Only the accessory style", "Only the client's décor"],
      correctIndex: 0,
      explanation: "Cable selection must consider capacity, voltage drop, and installation conditions."
    },
    {
      prompt: "Which of the following is most likely to be a final circuit in a dwelling?",
      options: ["DNO service cable", "Meter tails", "Ring final circuit", "Distributor cut-out fuse"],
      correctIndex: 2,
      explanation: "A ring final circuit is a final circuit."
    },
    {
      prompt: "What is the main purpose of a fused connection unit?",
      options: ["To provide local isolation and fuse protection for fixed equipment", "To measure insulation resistance", "To replace the main switch", "To increase voltage"],
      correctIndex: 0,
      explanation: "FCUs are used to provide local fused protection and isolation for fixed loads."
    },
  ]
  const questions: Question[] = []
  for (let i = 0; i < 20; i++) {
    const item = items[i % items.length]
    questions.push({
      id: `installation-${i + 1}`,
      category: "Installation Practice",
      ...item
    })
  }
  return questions
}

function makeFaultQuestions(): Question[] {
  const items = [
    {
      prompt: "A circuit trips immediately when energised. What is the most likely cause?",
      options: ["Open circuit", "High resistance joint", "Short circuit", "Small voltage drop"],
      correctIndex: 2,
      explanation: "Immediate operation of protection often indicates a short circuit."
    },
    {
      prompt: "During fault finding, what should be done before replacing parts unnecessarily?",
      options: ["Guess the faulty component", "Apply a logical diagnostic process", "Ignore test results", "Replace the consumer unit first"],
      correctIndex: 1,
      explanation: "Fault finding should follow a logical process using evidence."
    },
    {
      prompt: "What is the likely outcome of reversed polarity at a switch?",
      options: ["The line conductor is switched correctly", "The neutral may be switched instead of the line", "The CPC is upgraded", "Voltage drop is eliminated"],
      correctIndex: 1,
      explanation: "Reversed polarity may leave the line conductor unswitched."
    },
    {
      prompt: "What is a likely effect of a loose termination?",
      options: ["Reduced impedance and safer operation", "Possible overheating and arcing", "Automatic RCD calibration", "Improved continuity"],
      correctIndex: 1,
      explanation: "Loose terminations can overheat and arc."
    },
    {
      prompt: "What is the best first response to a repeated fault on the same circuit?",
      options: ["Keep resetting until it stays on", "Investigate cause and test systematically", "Increase fuse size", "Disconnect the CPC"],
      correctIndex: 1,
      explanation: "Repeated faults should be investigated rather than repeatedly reset."
    },
    {
      prompt: "What is the most likely result of an open-circuit CPC during testing?",
      options: ["Very low resistance on continuity", "Loss of continuity of the protective conductor", "Higher supply voltage", "Improved loop impedance"],
      correctIndex: 1,
      explanation: "An open CPC produces loss of continuity."
    },
    {
      prompt: "What is reactive maintenance?",
      options: ["Planned work before failure", "Work carried out in response to a fault or breakdown", "Only decorative replacement", "Testing without a fault present"],
      correctIndex: 1,
      explanation: "Reactive maintenance occurs after a fault or breakdown."
    },
    {
      prompt: "A socket circuit has no power, but adjacent circuits are healthy. Which is the most sensible starting point?",
      options: ["Replace all sockets immediately", "Check protective device status and carry out logical testing", "Assume the DNO supply has failed", "Rewire the whole installation"],
      correctIndex: 1,
      explanation: "Start with simple, logical checks before more invasive work."
    },
    {
      prompt: "Which of the following best describes a systematic fault-finding approach?",
      options: ["Replace likely items until the fault clears", "Gather information, test logically, identify cause, then rectify", "Skip inspection and go straight to energising", "Ignore the client report"],
      correctIndex: 1,
      explanation: "A systematic process is evidence-based and logical."
    },
    {
      prompt: "What should happen after fault rectification is completed?",
      options: ["No further action", "Relevant checks, testing, and confirmation of safe operation", "Leave the circuit isolated permanently", "Remove all labels"],
      correctIndex: 1,
      explanation: "After rectification, suitable checks and testing should confirm the repair."
    },
  ]
  const questions: Question[] = []
  for (let i = 0; i < 20; i++) {
    const item = items[i % items.length]
    questions.push({
      id: `fault-${i + 1}`,
      category: "Fault Diagnosis",
      ...item
    })
  }
  return questions
}

function makeRegsQuestions(): Question[] {
  const items = [
    {
      prompt: "What does BS 7671 primarily set out?",
      options: ["Employment law", "Requirements for electrical installations", "Planning regulations only", "Insurance rules"],
      correctIndex: 1,
      explanation: "BS 7671 contains requirements for electrical installations."
    },
    {
      prompt: "Which publication is commonly used alongside BS 7671 for practical guidance?",
      options: ["On-Site Guide", "Building magazine", "Gas industry code only", "Tool catalogue"],
      correctIndex: 0,
      explanation: "The On-Site Guide is commonly used alongside BS 7671."
    },
    {
      prompt: "For many TN systems, what is the maximum disconnection time for final circuits not exceeding 32 A?",
      options: ["0.1 s", "0.2 s", "0.4 s", "5 s"],
      correctIndex: 2,
      explanation: "For many TN final circuits not exceeding 32 A, the standard disconnection time is 0.4 s."
    },
    {
      prompt: "What does IP in an IP rating stand for?",
      options: ["Internal Performance", "Ingress Protection", "Installation Procedure", "Insulation Principle"],
      correctIndex: 1,
      explanation: "IP stands for Ingress Protection."
    },
    {
      prompt: "What is the main purpose of electrical certification?",
      options: ["To increase power factor", "To provide formal record of inspection, testing, and compliance", "To replace risk assessments", "To remove the need for supervision"],
      correctIndex: 1,
      explanation: "Certification records inspection, testing, and compliance."
    },
    {
      prompt: "Under harmonised colours, what is the line conductor colour in a single-phase circuit?",
      options: ["Blue", "Green/yellow", "Brown", "Black"],
      correctIndex: 2,
      explanation: "Brown identifies line in single-phase harmonised colours."
    },
    {
      prompt: "Which of the following best describes initial verification?",
      options: ["Maintenance after failure", "Inspection and testing before an installation is put into service", "Only visual inspection after energising", "Replacing all accessories"],
      correctIndex: 1,
      explanation: "Initial verification is the inspection and testing of a new installation before service."
    },
    {
      prompt: "Why are schedules of test results important?",
      options: ["They replace design calculations", "They provide a clear record of measured values", "They remove the need for testing", "They are only for decoration"],
      correctIndex: 1,
      explanation: "Schedules of test results provide traceable records of measured values."
    },
    {
      prompt: "What is the most appropriate response if a manufacturer’s instruction conflicts with safe installation practice?",
      options: ["Ignore safety requirements", "Seek clarification and ensure compliance with relevant standards and safe practice", "Always ignore the manufacturer", "Proceed without checking"],
      correctIndex: 1,
      explanation: "Where uncertainty exists, clarification is needed while maintaining safe, compliant installation."
    },
    {
      prompt: "What is one purpose of the Electricity at Work Regulations?",
      options: ["To set electricity prices", "To help ensure electrical systems are constructed and maintained so as to prevent danger", "To choose cable colours only", "To replace BS 7671 completely"],
      correctIndex: 1,
      explanation: "The Electricity at Work Regulations are intended to prevent danger from electricity."
    },
  ]
  const questions: Question[] = []
  for (let i = 0; i < 20; i++) {
    const item = items[i % items.length]
    questions.push({
      id: `regs-${i + 1}`,
      category: "BS 7671 and Industry Knowledge",
      ...item
    })
  }
  return questions
}

export function buildQuestionPool(): Question[] {
  return [
    ...makePowerQuestions(),
    ...makeCurrentQuestions(),
    ...makeResistanceQuestions(),
    ...makeSafetyQuestions(),
    ...makeEarthingQuestions(),
    ...makeProtectionQuestions(),
    ...makeTestingQuestions(),
    ...makeInstallationQuestions(),
    ...makeFaultQuestions(),
    ...makeRegsQuestions(),
  ]
}

export const QUESTION_POOL = buildQuestionPool()

export const QUESTION_POOL_SIZE = QUESTION_POOL.length
export const QUESTIONS_PER_ATTEMPT = 50
export const PASS_MARK_PERCENT = 60
export const TEST_TIME_MINUTES = 100
