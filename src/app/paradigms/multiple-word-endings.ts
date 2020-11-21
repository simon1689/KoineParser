export const multipleWordEndings = {
  // Imperfect ον
  'V-IAI-1S': ['V-IAI-3P'],
  'V-IAI-3P': ['V-IAI-1S'],

  // Second Aorist ον
  'V-2AAI-1S': ['V-2AAI-3P'],
  'V-2AAI-3P': ['V-2AAI-1S'],

  // ῇ
  'V-FMI-2S': ['V-PAS-3S', 'V-2APS-3S'],
  'V-PAS-3S': ['V-FMI-2S', 'V-2APS-3S'],
  'V-2APS-3S': ['V-FMI-2S', 'V-PAS-3S'],

  // Future and Subjunctive 1S
  'V-AAS-1S': ['V-FAI-1S'],
  'V-FAI-1S': ['V-AAS-1S'],

  // Subjunctive and Indicative 1S
  'V-PAI-1S': ['V-PAS-1S'],
  'V-PAS-1S': ['V-PAI-1S'],

  // Present Indicative and Imperative 2P
  'V-PAI-2P': ['V-PAS-2P'],
  'V-PAS-2P': ['V-PAI-2P'],

  // Present Middle/Passive Indicative and Present Middle/Passive Imperative
  // DEPONENT
  // Middle
  'V-PMI-2P': ['V-PMM-2P'],
  'V-PMM-2P': ['V-PMI-2P'],
  // Passive
  'V-PPI-2P': ['V-PPM-2P'],
  'V-PPM-2P': ['V-PPI-2P'],

  // Imperative middle/passive 2S
  'V-PMM-2S': ['V-PPM-2S'],
  'V-PPM-2S': ['V-PMM-2S'],

  // PARTICIPLES
  // PAP | masculine and neuter
  'V-PAP-GSM': ['V-PAP-GSN'],
  'V-PAP-GSN': ['V-PAP-GSM'],
  'V-PAP-DSM': ['V-PAP-DSN'],
  'V-PAP-DSN': ['V-PAP-DSM'],
  'V-PAP-DPN': ['V-PAP-DPM'],
  'V-PAP-DPM': ['V-PAP-DPN'],
  'V-PAP-NSN': ['V-PAP-ASN'],
  'V-PAP-ASN': ['V-PAP-NSN'],
  'V-PAP-ASM': ['V-PAP-NPN', 'V-PAP-APN'],
  'V-PAP-NPN': ['V-PAP-ASM', 'V-PAP-APN'],
  'V-PAP-APN': ['V-PAP-NPN', 'V-PAP-ASM'],
  // PAP | PLURAL GENITIVE
  'V-PAP-GPM': ['V-PAP-GPF', 'V-PAP-GPN'],
  'V-PAP-GPF': ['V-PAP-GPM', 'V-PAP-GPN'],
  'V-PAP-GPN': ['V-PAP-GPF', 'V-PAP-GPM'],

  // PMP | MASC & NEUT
  'V-PPP-GSM': ['V-PPP-GSN'],
  'V-PPP-GSN': ['V-PPP-GSM'],
  'V-PPP-DSM': ['V-PPP-DSN'],
  'V-PPP-DSN': ['V-PPP-DSM'],
  'V-PPP-DPM': ['V-PPP-DPN'],
  'V-PPP-NSN': ['V-PPP-ASN', 'V-PPP-ASM'],
  'V-PPP-ASN': ['V-PPP-NSN', 'V-PPP-ASM'],
  'V-PPP-ASM': ['V-PPP-NSN', 'V-PPP-ASN'],
  'V-PPP-NPN': ['V-PPP-APN'],
  'V-PPP-APN': ['V-PPP-NPN'],
  // PPP | PLURAL GENITIVE
  'V-PPP-GPM': ['V-PPP-GPF', 'V-PPP-GPN'],
  'V-PPP-GPF': ['V-PPP-GPM', 'V-PPP-GPN'],
  'V-PPP-GPN': ['V-PPP-GPF', 'V-PPP-GPM'],

  // PPP | MASC & NEUT
  'V-PMP-GSM': ['V-PMP-GSN'],
  'V-PMP-GSN': ['V-PMP-GSM'],
  'V-PMP-DSM': ['V-PMP-DSN'],
  'V-PMP-DSN': ['V-PMP-DSM'],
  'V-PMP-DPM': ['V-PMP-DPN'],
  'V-PMP-NSN': ['V-PMP-ASN', 'V-PMP-ASM'],
  'V-PMP-ASN': ['V-PMP-NSN', 'V-PMP-ASM'],
  'V-PMP-ASM': ['V-PMP-NSN', 'V-PMP-ASN'],
  'V-PMP-NPN': ['V-PMP-APN'],
  'V-PMP-APN': ['V-PMP-NPN'],
  // PMP | PLURAL GENITIVE
  'V-PMP-GPM': ['V-PMP-GPF', 'V-PMP-GPN'],
  'V-PMP-GPF': ['V-PMP-GPM', 'V-PMP-GPN'],
  'V-PMP-GPN': ['V-PMP-GPF', 'V-PMP-GPM'],

  // FIRST AORIST ACTIVE PARTICIPLES
  // AAP | masculine and neuter
  'V-AAP-GSM': ['V-AAP-GSN'],
  'V-AAP-GSN': ['V-AAP-GSM'],
  'V-AAP-DSM': ['V-AAP-DSN'],
  'V-AAP-DSN': ['V-AAP-DSM'],
  'V-AAP-GPM': ['V-AAP-GPN'],
  'V-AAP-GPN': ['V-AAP-GPM'],
  'V-AAP-DPM': ['V-AAP-DPN'],
  'V-AAP-DPN': ['V-AAP-DPM'],
  'V-AAP-NSN': ['V-AAP-ASN'],
  'V-AAP-ASN': ['V-AAP-NSN'],
  'V-AAP-ASM': ['V-AAP-NPN', 'V-AAP-APN'],
  'V-AAP-NPN': ['V-AAP-ASM', 'V-AAP-APN'],
  'V-AAP-APN': ['V-AAP-NPN', 'V-AAP-ASM'],

  // SECOND AORIST ACTIVE PARTICIPLES
  // 2AAP | masculine and neuter
  'V-2AAP-GSM': ['V-2AAP-GSN'],
  'V-2AAP-GSN': ['V-2AAP-GSM'],
  'V-2AAP-DSM': ['V-2AAP-DSN'],
  'V-2AAP-DSN': ['V-2AAP-DSM'],
  'V-2AAP-GPM': ['V-2AAP-GPN'],
  'V-2AAP-GPN': ['V-2AAP-GPM'],
  'V-2AAP-DPM': ['V-2AAP-DPN'],
  'V-2AAP-DPN': ['V-2AAP-DPM'],
  'V-2AAP-NSN': ['V-2AAP-ASN'],
  'V-2AAP-ASN': ['V-2AAP-NSN'],
  'V-2AAP-ASM': ['V-2AAP-NPN', 'V-2AAP-APN'],
  'V-2AAP-NPN': ['V-2AAP-ASM', 'V-2AAP-APN'],
  'V-2AAP-APN': ['V-2AAP-NPN', 'V-2AAP-ASM'],

  // FIRST AORIST MIDDLE PARTICIPLES
  // AMP | masculine and neuter
  'V-AMP-GSM': ['V-AMP-GSN'],
  'V-AMP-GSN': ['V-AMP-GSM'],
  'V-AMP-DSM': ['V-AMP-DSN'],
  'V-AMP-DSN': ['V-AMP-DSM'],
  'V-AMP-DPM': ['V-AMP-DPN'],
  'V-AMP-DPN': ['V-AMP-DPM'],
  'V-AMP-NSN': ['V-AMP-ASN', 'V-AMP-ASM'],
  'V-AMP-ASN': ['V-AMP-NSN', 'V-AMP-ASM'],
  'V-AMP-ASM': ['V-AMP-NSN', 'V-AMP-ASN'],
  'V-AMP-NPN': ['V-AMP-APN'],
  'V-AMP-APN': ['V-AMP-NPN'],
  // GENITIVE PLURAL
  'V-AMP-GPM': ['V-AMP-GPN', 'V-AMP-GPF'],
  'V-AMP-GPN': ['V-AMP-GPM', 'V-AMP-GPF'],
  'V-AMP-GPF': ['V-AMP-GPM', 'V-AMP-GPN'],

  // SECOND AORIST MIDDLE PARTICIPLES
  // 2AMP | masculine and neuter
  'V-2AMP-GSM': ['V-2AMP-GSN'],
  'V-2AMP-GSN': ['V-2AMP-GSM'],
  'V-2AMP-DSM': ['V-2AMP-DSN'],
  'V-2AMP-DSN': ['V-2AMP-DSM'],
  'V-2AMP-DPM': ['V-2AMP-DPN'],
  'V-2AMP-DPN': ['V-2AMP-DPM'],
  'V-2AMP-NSN': ['V-2AMP-ASN', 'V-2AMP-ASM'],
  'V-2AMP-ASN': ['V-2AMP-NSN', 'V-2AMP-ASM'],
  'V-2AMP-ASM': ['V-2AMP-NSN', 'V-2AMP-ASN'],
  'V-2AMP-NPN': ['V-2AMP-APN'],
  'V-2AMP-APN': ['V-2AMP-NPN'],
  // GENITIVE PLURAL
  'V-2AMP-GPM': ['V-2AMP-GPN', 'V-2AMP-GPF'],
  'V-2AMP-GPN': ['V-2AMP-GPM', 'V-2AMP-GPF'],
  'V-2AMP-GPF': ['V-2AMP-GPM', 'V-2AMP-GPN'],

  // FIRST AORIST PASSIVE PARTICIPLES
  // APP | masculine and neuter
  'V-APP-GSM': ['V-APP-GSN'],
  'V-APP-GSN': ['V-APP-GSM'],
  'V-APP-DSM': ['V-APP-DSN'],
  'V-APP-DSN': ['V-APP-DSM'],
  'V-APP-DPM': ['V-APP-DPN'],
  'V-APP-DPN': ['V-APP-DPM'],
  'V-APP-NSN': ['V-APP-ASN', 'V-APP-ASM'],
  'V-APP-ASN': ['V-APP-NSN', 'V-APP-ASM'],
  'V-APP-ASM': ['V-APP-NSN', 'V-APP-ASN'],
  'V-APP-NPN': ['V-APP-ASM', 'V-APP-APN'],
  'V-APP-APN': ['V-APP-NPN', 'V-APP-ASM'],
  // GENITIVE PLURAL
  'V-APP-GPM': ['V-APP-GPN'],
  'V-APP-GPN': ['V-APP-GPM'],

  // SECOND AORIST PASSIVE PARTICIPLES
  // 2APP | masculine and neuter
  'V-2APP-GSM': ['V-2APP-GSN'],
  'V-2APP-GSN': ['V-2APP-GSM'],
  'V-2APP-DSM': ['V-2APP-DSN'],
  'V-2APP-DSN': ['V-2APP-DSM'],
  'V-2APP-DPM': ['V-2APP-DPN'],
  'V-2APP-DPN': ['V-2APP-DPM'],
  'V-2APP-NSN': ['V-2APP-ASN', 'V-2APP-ASM'],
  'V-2APP-ASN': ['V-2APP-NSN', 'V-2APP-ASM'],
  'V-2APP-ASM': ['V-2APP-NSN', 'V-2APP-ASN'],
  'V-2APP-NPN': ['V-2APP-ASM', 'V-2APP-APN'],
  'V-2APP-APN': ['V-2APP-NPN', 'V-2APP-ASM'],
  // GENITIVE PLURAL
  'V-2APP-GPM': ['V-2APP-GPN'],
  'V-2APP-GPN': ['V-2APP-GPM'],

  // Perfect Active Participle
  // RAP | masculine and neuter
  'V-RAP-GSM': ['V-RAP-GSN'],
  'V-RAP-GSN': ['V-RAP-GSM'],
  'V-RAP-DSM': ['V-RAP-DSN'],
  'V-RAP-DSN': ['V-RAP-DSM'],
  'V-RAP-GPM': ['V-RAP-GPN'],
  'V-RAP-GPN': ['V-RAP-GPM'],
  'V-RAP-DPM': ['V-RAP-DPN'],
  'V-RAP-DPN': ['V-RAP-DPM'],
  'V-RAP-NSN': ['V-RAP-ASN'],
  'V-RAP-ASN': ['V-RAP-NSN'],
  'V-RAP-ASM': ['V-RAP-NPN', 'V-RAP-APN'],
  'V-RAP-NPN': ['V-RAP-ASM', 'V-RAP-APN'],
  'V-RAP-APN': ['V-RAP-NPN', 'V-RAP-ASM'],

  // PERFECT MIDDLE PARTICIPLE
  'V-RMP-GSM': ['V-RMP-GSN'],
  'V-RMP-GSN': ['V-RMP-GSM'],
  'V-RMP-DSM': ['V-RMP-DSN'],
  'V-RMP-DSN': ['V-RMP-DSM'],
  'V-RMP-DPM': ['V-RMP-DPN'],
  'V-RMP-NSN': ['V-RMP-ASN', 'V-RMP-ASM'],
  'V-RMP-ASN': ['V-RMP-NSN', 'V-RMP-ASM'],
  'V-RMP-ASM': ['V-RMP-NSN', 'V-RMP-ASN'],
  'V-RMP-NPN': ['V-RMP-APN'],
  'V-RMP-APN': ['V-RMP-NPN'],
  // RMP | PLURAL GENITIVE
  'V-RMP-GPM': ['V-RMP-GPF', 'V-RMP-GPN'],
  'V-RMP-GPF': ['V-RMP-GPM', 'V-RMP-GPN'],
  'V-RMP-GPN': ['V-RMP-GPF', 'V-RMP-GPM'],

  // PERFECT PASSIVE PARTICIPLE
  'V-RPP-GSM': ['V-RPP-GSN'],
  'V-RPP-GSN': ['V-RPP-GSM'],
  'V-RPP-DSM': ['V-RPP-DSN'],
  'V-RPP-DSN': ['V-RPP-DSM'],
  'V-RPP-DPM': ['V-RPP-DPN'],
  'V-RPP-NSN': ['V-RPP-ASN', 'V-RPP-ASM'],
  'V-RPP-ASN': ['V-RPP-NSN', 'V-RPP-ASM'],
  'V-RPP-ASM': ['V-RPP-NSN', 'V-RPP-ASN'],
  'V-RPP-NPN': ['V-RPP-APN'],
  'V-RPP-APN': ['V-RPP-NPN'],
  // RPP | PLURAL GENITIVE
  'V-RPP-GPM': ['V-RPP-GPF', 'V-RPP-GPN'],
  'V-RPP-GPF': ['V-RPP-GPM', 'V-RPP-GPN'],
  'V-RPP-GPN': ['V-RPP-GPF', 'V-RPP-GPM'],

  // 2nd Perfect Active Participle
  // 2RAP | masculine and neuter
  'V-2RAP-GSM': ['V-2RAP-GSN'],
  'V-2RAP-GSN': ['V-2RAP-GSM'],
  'V-2RAP-DSM': ['V-2RAP-DSN'],
  'V-2RAP-DSN': ['V-2RAP-DSM'],
  'V-2RAP-GPM': ['V-2RAP-GPN'],
  'V-2RAP-GPN': ['V-2RAP-GPM'],
  'V-2RAP-DPM': ['V-2RAP-DPN'],
  'V-2RAP-DPN': ['V-2RAP-DPM'],
  'V-2RAP-NSN': ['V-2RAP-ASN'],
  'V-2RAP-ASN': ['V-2RAP-NSN'],
  'V-2RAP-ASM': ['V-2RAP-NPN', 'V-2RAP-APN'],
  'V-2RAP-NPN': ['V-2RAP-ASM', 'V-2RAP-APN'],
  'V-2RAP-APN': ['V-2RAP-NPN', 'V-2RAP-ASM'],

  // NO 2nd PERFECT MIDDLE PARTICIPLE in NT

  // 2nd PERFECT PASSIVE PARTICIPLE
  'V-2RPP-GSM': ['V-2RPP-GSN'],
  'V-2RPP-GSN': ['V-2RPP-GSM'],
  'V-2RPP-DSM': ['V-2RPP-DSN'],
  'V-2RPP-DSN': ['V-2RPP-DSM'],
  'V-2RPP-DPM': ['V-2RPP-DPN'],
  'V-2RPP-NSN': ['V-2RPP-ASN', 'V-2RPP-ASM'],
  'V-2RPP-ASN': ['V-2RPP-NSN', 'V-2RPP-ASM'],
  'V-2RPP-ASM': ['V-2RPP-NSN', 'V-2RPP-ASN'],
  'V-2RPP-NPN': ['V-2RPP-APN'],
  'V-2RPP-APN': ['V-2RPP-NPN'],
  // 2RPP | PLURAL GENITIVE
  'V-2RPP-GPM': ['V-2RPP-GPF', 'V-2RPP-GPN'],
  'V-2RPP-GPF': ['V-2RPP-GPM', 'V-2RPP-GPN'],
  'V-2RPP-GPN': ['V-2RPP-GPF', 'V-2RPP-GPM'],
};
