// Comprehensive CPT code database for medical procedure lookup
const cptCodes = [
  // Evaluation and Management
  { code: "99201", description: "Office/Outpatient Visit, New Patient, Level 1" },
  { code: "99202", description: "Office/Outpatient Visit, New Patient, Level 2" },
  { code: "99203", description: "Office/Outpatient Visit, New Patient, Level 3" },
  { code: "99204", description: "Office/Outpatient Visit, New Patient, Level 4" },
  { code: "99205", description: "Office/Outpatient Visit, New Patient, Level 5" },
  { code: "99211", description: "Office/Outpatient Visit, Established Patient, Level 1" },
  { code: "99212", description: "Office/Outpatient Visit, Established Patient, Level 2" },
  { code: "99213", description: "Office/Outpatient Visit, Established Patient, Level 3" },
  { code: "99214", description: "Office/Outpatient Visit, Established Patient, Level 4" },
  { code: "99215", description: "Office/Outpatient Visit, Established Patient, Level 5" },

  // Emergency Department
  { code: "99281", description: "Emergency Department Visit, Level 1" },
  { code: "99282", description: "Emergency Department Visit, Level 2" },
  { code: "99283", description: "Emergency Department Visit, Level 3" },
  { code: "99284", description: "Emergency Department Visit, Level 4" },
  { code: "99285", description: "Emergency Department Visit, Level 5" },

  // Hospital Services
  { code: "99221", description: "Initial Hospital Care, Level 1" },
  { code: "99222", description: "Initial Hospital Care, Level 2" },
  { code: "99223", description: "Initial Hospital Care, Level 3" },
  { code: "99231", description: "Subsequent Hospital Care, Level 1" },
  { code: "99232", description: "Subsequent Hospital Care, Level 2" },
  { code: "99233", description: "Subsequent Hospital Care, Level 3" },
  { code: "99238", description: "Hospital Discharge Management, 30 minutes or less" },
  { code: "99239", description: "Hospital Discharge Management, more than 30 minutes" },

  // Laboratory
  { code: "80047", description: "Basic Metabolic Panel" },
  { code: "80053", description: "Comprehensive Metabolic Panel" },
  { code: "80061", description: "Lipid Panel" },
  { code: "85025", description: "Complete Blood Count with differential" },
  { code: "85027", description: "Complete Blood Count, automated" },
  { code: "86900", description: "Blood typing, ABO" },
  { code: "86901", description: "Blood typing, Rh(D)" },
  { code: "87040", description: "Blood culture for bacteria" },
  { code: "87070", description: "Culture, bacterial; any other source except urine, blood or stool" },
  { code: "87086", description: "Urine culture, bacterial" },

  // Radiology
  { code: "70450", description: "CT Head/Brain without contrast" },
  { code: "70460", description: "CT Head/Brain with contrast" },
  { code: "70470", description: "CT Head/Brain without and with contrast" },
  { code: "71020", description: "Chest X-ray, 2 views" },
  { code: "71045", description: "Chest X-ray, single view" },
  { code: "71250", description: "CT Chest without contrast" },
  { code: "71260", description: "CT Chest with contrast" },
  { code: "72148", description: "MRI Lumbar Spine without contrast" },
  { code: "72158", description: "MRI Lumbar Spine without and with contrast" },
  { code: "73721", description: "MRI any joint of lower extremity without contrast" },
  { code: "74160", description: "CT Abdomen with contrast" },
  { code: "74170", description: "CT Abdomen without and with contrast" },

  // Cardiology
  { code: "93000", description: "Electrocardiogram, routine ECG with at least 12 leads" },
  { code: "93005", description: "Electrocardiogram, tracing only, without interpretation" },
  { code: "93010", description: "Electrocardiogram, interpretation and report only" },
  { code: "93306", description: "Echocardiography, transthoracic, real-time" },
  { code: "93307", description: "Echocardiography, transthoracic, real-time with image documentation" },
  { code: "93320", description: "Doppler echocardiography, pulsed wave and/or continuous wave" },
  { code: "93325", description: "Doppler echocardiography color flow velocity mapping" },

  // Surgery - General
  { code: "10060", description: "Incision and drainage of abscess; simple or single" },
  { code: "10061", description: "Incision and drainage of abscess; complicated or multiple" },
  { code: "11042", description: "Debridement, subcutaneous tissue; first 20 sq cm or less" },
  { code: "11043", description: "Debridement, muscle and/or fascia; first 20 sq cm or less" },
  { code: "12001", description: "Simple repair of superficial wounds of scalp, neck, axillae, external genitalia, trunk and/or extremities; 2.5 cm or less" },
  { code: "12002", description: "Simple repair of superficial wounds; 2.6 cm to 7.5 cm" },
  { code: "12011", description: "Simple repair of superficial wounds of face, ears, eyelids, nose, lips and/or mucous membranes; 2.5 cm or less" },

  // Orthopedic
  { code: "27447", description: "Total knee arthroplasty" },
  { code: "27130", description: "Total hip arthroplasty" },
  { code: "29881", description: "Arthroscopy, knee, surgical; with meniscectomy" },
  { code: "64483", description: "Injection, anesthetic agent and/or steroid, transforaminal epidural" },

  // Anesthesia
  { code: "00100", description: "Anesthesia for procedures on salivary glands" },
  { code: "00300", description: "Anesthesia for all procedures on the integumentary system, muscles and nerves of head, neck, and posterior trunk" },
  { code: "00400", description: "Anesthesia for procedures on the integumentary system on the extremities, anterior trunk and perineum" },

  // Pathology
  { code: "88142", description: "Cytopathology, cervical or vaginal; requiring interpretation by physician" },
  { code: "88305", description: "Level IV - Surgical pathology, gross and microscopic examination" },
  { code: "88307", description: "Level V - Surgical pathology, gross and microscopic examination" },

  // Preventive Medicine
  { code: "99381", description: "Initial comprehensive preventive medicine evaluation and management; infant (age younger than 1 year)" },
  { code: "99382", description: "Initial comprehensive preventive medicine evaluation and management; early childhood (age 1 through 4 years)" },
  { code: "99383", description: "Initial comprehensive preventive medicine evaluation and management; late childhood (age 5 through 11 years)" },
  { code: "99384", description: "Initial comprehensive preventive medicine evaluation and management; adolescent (age 12 through 17 years)" },
  { code: "99385", description: "Initial comprehensive preventive medicine evaluation and management; 18-39 years" },
  { code: "99386", description: "Initial comprehensive preventive medicine evaluation and management; 40-64 years" },
  { code: "99387", description: "Initial comprehensive preventive medicine evaluation and management; 65 years and older" },

  // Vaccines
  { code: "90471", description: "Immunization administration; 1 vaccine (single or combination vaccine/toxoid)" },
  { code: "90472", description: "Immunization administration; each additional vaccine" },
  { code: "90630", description: "Influenza virus vaccine, quadrivalent" },
  { code: "90732", description: "Pneumococcal polysaccharide vaccine, 23-valent" },

  // Physical Therapy
  { code: "97110", description: "Therapeutic procedure, 1 or more areas, each 15 minutes; therapeutic exercises" },
  { code: "97112", description: "Therapeutic procedure, 1 or more areas, each 15 minutes; neuromuscular reeducation" },
  { code: "97140", description: "Manual therapy techniques, 1 or more regions, each 15 minutes" },

  // Mental Health
  { code: "90834", description: "Psychotherapy, 45 minutes" },
  { code: "90837", description: "Psychotherapy, 60 minutes" },
  { code: "90901", description: "Biofeedback training by any modality" },

  // Ophthalmology
  { code: "92002", description: "Ophthalmological services: medical examination and evaluation, new patient" },
  { code: "92004", description: "Ophthalmological services: medical examination and evaluation, new patient, comprehensive" },
  { code: "92012", description: "Ophthalmological services: medical examination and evaluation, established patient" },

  // Dermatology
  { code: "11100", description: "Biopsy of skin, subcutaneous tissue and/or mucous membrane; single lesion" },
  { code: "11101", description: "Biopsy of skin, subcutaneous tissue and/or mucous membrane; each separate/additional lesion" },
  { code: "17000", description: "Destruction (eg, laser surgery, electrosurgery, cryosurgery, chemosurgery, surgical curettement), premalignant lesions" }
]

class CPTService {
  constructor() {
    this.codes = cptCodes
  }

  search(query) {
    if (!query || query.length < 2) {
      return []
    }

    const searchTerm = query.toLowerCase()
    
    // Search both code and description
    const results = this.codes.filter(item => 
      item.code.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm)
    )

    // Sort results: exact code matches first, then by relevance
    return results.sort((a, b) => {
      const aCodeExact = a.code.toLowerCase() === searchTerm
      const bCodeExact = b.code.toLowerCase() === searchTerm
      
      if (aCodeExact && !bCodeExact) return -1
      if (!aCodeExact && bCodeExact) return 1
      
      const aCodeStarts = a.code.toLowerCase().startsWith(searchTerm)
      const bCodeStarts = b.code.toLowerCase().startsWith(searchTerm)
      
      if (aCodeStarts && !bCodeStarts) return -1
      if (!aCodeStarts && bCodeStarts) return 1
      
      const aDescStarts = a.description.toLowerCase().startsWith(searchTerm)
      const bDescStarts = b.description.toLowerCase().startsWith(searchTerm)
      
      if (aDescStarts && !bDescStarts) return -1
      if (!aDescStarts && bDescStarts) return 1
      
      return a.description.localeCompare(b.description)
    })
  }

  getByCode(code) {
    return this.codes.find(item => item.code === code)
  }

  getAll() {
    return [...this.codes]
  }

  getByCategory(category) {
    // Category matching based on code ranges
    const categoryRanges = {
      'evaluation': ['99201-99215', '99221-99239', '99281-99285'],
      'laboratory': ['80047-80061', '85025-85027', '86900-86901', '87040-87086'],
      'radiology': ['70450-70470', '71020-71045', '71250-71260', '72148-72158', '73721', '74160-74170'],
      'cardiology': ['93000-93010', '93306-93307', '93320-93325'],
      'surgery': ['10060-10061', '11042-11043', '12001-12002', '12011', '27447', '27130', '29881'],
      'anesthesia': ['00100', '00300', '00400'],
      'pathology': ['88142', '88305', '88307'],
      'preventive': ['99381-99387'],
      'vaccines': ['90471-90472', '90630', '90732'],
      'therapy': ['97110', '97112', '97140'],
      'mental': ['90834', '90837', '90901'],
      'ophthalmology': ['92002', '92004', '92012'],
      'dermatology': ['11100-11101', '17000']
    }

    const ranges = categoryRanges[category.toLowerCase()] || []
    
    return this.codes.filter(item => {
      return ranges.some(range => {
        if (range.includes('-')) {
          const [start, end] = range.split('-')
          const code = parseInt(item.code)
          return code >= parseInt(start) && code <= parseInt(end)
        } else {
          return item.code === range
        }
      })
    })
  }

  // Get suggested CPT codes based on ICD-10 diagnosis
  getSuggestedCPTCodes(icd10Code) {
    // Mock mapping of ICD-10 to commonly associated CPT codes
    const icdToCptMapping = {
      'E10.9': ['99213', '99214', '80053', '85025'], // Type 1 diabetes
      'E11.9': ['99213', '99214', '80053', '85025'], // Type 2 diabetes
      'I10': ['99213', '93000', '80061'], // Hypertension
      'J18.9': ['99214', '71020', '87040'], // Pneumonia
      'J06.9': ['99212', '99213'], // Upper respiratory infection
      'Z00.00': ['99385', '99386', '99387', '85025', '80053'], // Annual physical
      'M54.5': ['99213', '72148', '97110'], // Low back pain
      'F32.9': ['90834', '90837'], // Depression
      'F41.1': ['90834', '90837'] // Anxiety
    }

    const suggestedCodes = icdToCptMapping[icd10Code] || []
    
    return suggestedCodes.map(code => this.getByCode(code)).filter(Boolean)
  }

  // Get RVU (Relative Value Unit) information for CPT code
  getRVUInfo(cptCode) {
    // Mock RVU data - in real implementation, this would come from CMS database
    const mockRVUs = {
      '99213': { work: 1.3, pe: 1.05, mp: 0.07, total: 2.42 },
      '99214': { work: 2.0, pe: 1.5, mp: 0.1, total: 3.6 },
      '71020': { work: 0.22, pe: 6.33, mp: 0.36, total: 6.91 },
      '85025': { work: 0.0, pe: 0.28, mp: 0.01, total: 0.29 },
      '93000': { work: 0.17, pe: 0.16, mp: 0.01, total: 0.34 }
    }

    const rvu = mockRVUs[cptCode]
    if (!rvu) return null

    return {
      code: cptCode,
      workRVU: rvu.work,
      practiceExpenseRVU: rvu.pe,
      malpracticeRVU: rvu.mp,
      totalRVU: rvu.total,
      year: 2024
    }
  }

  // Check if CPT code requires modifier
  requiresModifier(cptCode) {
    // Codes that commonly require modifiers
    const modifierCodes = ['99213', '99214', '99215', '12001', '12002', '27447', '27130']
    
    return modifierCodes.includes(cptCode)
  }

  // Get common modifiers for CPT code
  getCommonModifiers(cptCode) {
    const modifierMap = {
      '99213': ['-25', '-57'], // Significant E/M service, Decision for surgery
      '99214': ['-25', '-57'],
      '12001': ['-51', '-59'], // Multiple procedures, Distinct procedural service
      '27447': ['-RT', '-LT'], // Right side, Left side
      '27130': ['-RT', '-LT']
    }

    return modifierMap[cptCode] || []
  }

  // Validate CPT code format
  validateCode(code) {
    // CPT codes are 5 digits
    const cptPattern = /^\d{5}$/
    return cptPattern.test(code)
  }

  // Get billing frequency recommendations
  getBillingFrequency(cptCode) {
    const frequencyMap = {
      '99213': 'Per visit',
      '99214': 'Per visit',
      '85025': 'As ordered',
      '71020': 'As ordered',
      '93000': 'As ordered',
      '97110': 'Per 15-minute unit',
      '90834': 'Per session',
      '99385': 'Annual'
    }

    return frequencyMap[cptCode] || 'As appropriate'
  }
}

export default new CPTService()