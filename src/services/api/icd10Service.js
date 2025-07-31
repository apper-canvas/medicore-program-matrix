// Comprehensive ICD-10 code database for medical diagnosis lookup
const icd10Codes = [
  // Diabetes
  { code: "E10.9", description: "Type 1 diabetes mellitus without complications" },
  { code: "E11.9", description: "Type 2 diabetes mellitus without complications" },
  { code: "E11.65", description: "Type 2 diabetes mellitus with hyperglycemia" },
  { code: "E11.40", description: "Type 2 diabetes mellitus with diabetic neuropathy, unspecified" },
  { code: "E11.319", description: "Type 2 diabetes mellitus with unspecified diabetic retinopathy without macular edema" },
  
  // Hypertension
  { code: "I10", description: "Essential hypertension" },
  { code: "I15.0", description: "Renovascular hypertension" },
  { code: "I15.1", description: "Hypertension secondary to other renal disorders" },
  { code: "I15.2", description: "Hypertension secondary to endocrine disorders" },
  
  // Heart Disease
  { code: "I25.10", description: "Atherosclerotic heart disease of native coronary artery without angina pectoris" },
  { code: "I25.119", description: "Atherosclerotic heart disease of native coronary artery with unspecified angina pectoris" },
  { code: "I50.9", description: "Heart failure, unspecified" },
  { code: "I48.91", description: "Unspecified atrial fibrillation" },
  
  // Respiratory
  { code: "J44.1", description: "Chronic obstructive pulmonary disease with acute exacerbation" },
  { code: "J45.9", description: "Asthma, unspecified" },
  { code: "J18.9", description: "Pneumonia, unspecified organism" },
  { code: "J06.9", description: "Acute upper respiratory infection, unspecified" },
  
  // Mental Health
  { code: "F32.9", description: "Major depressive disorder, single episode, unspecified" },
  { code: "F41.1", description: "Generalized anxiety disorder" },
  { code: "F43.10", description: "Post-traumatic stress disorder, unspecified" },
  { code: "F90.9", description: "Attention-deficit hyperactivity disorder, unspecified type" },
  
  // Infections
  { code: "A09", description: "Infectious gastroenteritis and colitis, unspecified" },
  { code: "J02.9", description: "Acute pharyngitis, unspecified" },
  { code: "N39.0", description: "Urinary tract infection, site not specified" },
  { code: "L03.90", description: "Cellulitis, unspecified" },
  
  // Musculoskeletal
  { code: "M54.5", description: "Low back pain" },
  { code: "M25.511", description: "Pain in right shoulder" },
  { code: "M79.1", description: "Myalgia" },
  { code: "M06.9", description: "Rheumatoid arthritis, unspecified" },
  
  // Preventive Care
  { code: "Z00.00", description: "Encounter for general adult medical examination without abnormal findings" },
  { code: "Z00.01", description: "Encounter for general adult medical examination with abnormal findings" },
  { code: "Z12.11", description: "Encounter for screening for malignant neoplasm of colon" },
  { code: "Z12.31", description: "Encounter for screening mammography for malignant neoplasm of breast" },
  
  // Allergies
  { code: "T78.40XA", description: "Allergy, unspecified, initial encounter" },
  { code: "Z88.0", description: "Allergy status to penicillin" },
  { code: "Z88.1", description: "Allergy status to other antibiotic agents" },
  { code: "Z88.7", description: "Allergy status to serum and vaccine" },
  
  // Gastrointestinal
  { code: "K21.9", description: "Gastro-esophageal reflux disease without esophagitis" },
  { code: "K59.00", description: "Constipation, unspecified" },
  { code: "K58.9", description: "Irritable bowel syndrome without diarrhea" },
  { code: "K25.9", description: "Peptic ulcer, site unspecified, unspecified as acute or chronic, without hemorrhage or perforation" },
  
  // Skin Conditions
  { code: "L20.9", description: "Atopic dermatitis, unspecified" },
  { code: "L40.9", description: "Psoriasis, unspecified" },
  { code: "L30.9", description: "Dermatitis, unspecified" },
  { code: "L70.0", description: "Acne vulgaris" },
  
  // Endocrine
  { code: "E03.9", description: "Hypothyroidism, unspecified" },
  { code: "E05.90", description: "Thyrotoxicosis, unspecified without thyrotoxic crisis or storm" },
  { code: "E78.5", description: "Hyperlipidemia, unspecified" },
  { code: "E66.9", description: "Obesity, unspecified" },
  
  // Neurological
  { code: "G43.909", description: "Migraine, unspecified, not intractable, without status migrainosus" },
  { code: "G47.00", description: "Insomnia, unspecified" },
  { code: "R51", description: "Headache" },
  { code: "R42", description: "Dizziness and giddiness" },
  
  // History/Status Codes
  { code: "Z87.891", description: "Personal history of nicotine dependence" },
  { code: "Z87.19", description: "Personal history of other diseases of the digestive system" },
  { code: "Z85.3", description: "Personal history of malignant neoplasm of breast" },
  { code: "Z51.11", description: "Encounter for antineoplastic chemotherapy" },
  
  // Injuries
  { code: "S72.001A", description: "Fracture of unspecified part of neck of right femur, initial encounter for closed fracture" },
  { code: "S06.0X0A", description: "Concussion without loss of consciousness, initial encounter" },
  { code: "T14.90XA", description: "Injury, unspecified, initial encounter" },
  { code: "S83.511A", description: "Sprain of anterior cruciate ligament of right knee, initial encounter" },
  
  // Pregnancy Related
  { code: "O80", description: "Encounter for full-term uncomplicated delivery" },
  { code: "Z34.00", description: "Encounter for supervision of normal first pregnancy, unspecified trimester" },
  { code: "O21.9", description: "Vomiting of pregnancy, unspecified" },
  { code: "Z39.1", description: "Encounter for care and examination of lactating mother" },
  
  // Pediatric
  { code: "Z00.110", description: "Health examination for newborn under 8 days old" },
  { code: "Z00.111", description: "Health examination for newborn 8 to 28 days old" },
  { code: "J06.9", description: "Acute upper respiratory infection, unspecified" },
  { code: "A08.19", description: "Acute gastroenteropathy due to other small round viruses" }
]

class ICD10Service {
  constructor() {
    this.codes = icd10Codes
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
    // Simple category matching based on code prefixes
    const categoryPrefixes = {
      'diabetes': ['E10', 'E11'],
      'hypertension': ['I10', 'I15'],
      'heart': ['I25', 'I50', 'I48'],
      'respiratory': ['J44', 'J45', 'J18', 'J06'],
      'mental': ['F32', 'F41', 'F43', 'F90'],
      'infection': ['A09', 'J02', 'N39', 'L03'],
      'musculoskeletal': ['M54', 'M25', 'M79', 'M06'],
      'preventive': ['Z00', 'Z12'],
      'allergy': ['T78', 'Z88'],
      'gastrointestinal': ['K21', 'K59', 'K58', 'K25'],
      'skin': ['L20', 'L40', 'L30', 'L70'],
      'endocrine': ['E03', 'E05', 'E78', 'E66'],
      'neurological': ['G43', 'G47', 'R51', 'R42']
    }

    const prefixes = categoryPrefixes[category.toLowerCase()] || []
    return this.codes.filter(item => 
      prefixes.some(prefix => item.code.startsWith(prefix))
    )
  }
}

export default new ICD10Service()