// stateUtils.ts

// Definir tipo para el mapeo de estados
export type StateCode = 
  | 'AL' | 'AK' | 'AZ' | 'AR' | 'CA' | 'CO' | 'CT' | 'DE' | 'FL' | 'GA' 
  | 'HI' | 'ID' | 'IL' | 'IN' | 'IA' | 'KS' | 'KY' | 'LA' | 'ME' | 'MD' 
  | 'MA' | 'MI' | 'MN' | 'MS' | 'MO' | 'MT' | 'NE' | 'NV' | 'NH' | 'NJ' 
  | 'NM' | 'NY' | 'NC' | 'ND' | 'OH' | 'OK' | 'OR' | 'PA' | 'RI' | 'SC' 
  | 'SD' | 'TN' | 'TX' | 'UT' | 'VT' | 'VA' | 'WA' | 'WV' | 'WI' | 'WY' 
  | 'AS' | 'DC' | 'GU' | 'PR' | 'VI' | 'AA' | 'AE' | 'AP';

export type StateName = keyof typeof STATE_MAPPING;

export const STATE_MAPPING = {
  'alabama': 'AL',
  'alaska': 'AK',
  'arizona': 'AZ',
  'arkansas': 'AR',
  'california': 'CA',
  'colorado': 'CO',
  'connecticut': 'CT',
  'delaware': 'DE',
  'florida': 'FL',
  'georgia': 'GA',
  'hawaii': 'HI',
  'idaho': 'ID',
  'illinois': 'IL',
  'indiana': 'IN',
  'iowa': 'IA',
  'kansas': 'KS',
  'kentucky': 'KY',
  'louisiana': 'LA',
  'maine': 'ME',
  'maryland': 'MD',
  'massachusetts': 'MA',
  'michigan': 'MI',
  'minnesota': 'MN',
  'mississippi': 'MS',
  'missouri': 'MO',
  'montana': 'MT',
  'nebraska': 'NE',
  'nevada': 'NV',
  'new hampshire': 'NH',
  'new jersey': 'NJ',
  'new mexico': 'NM',
  'new york': 'NY',
  'north carolina': 'NC',
  'north dakota': 'ND',
  'ohio': 'OH',
  'oklahoma': 'OK',
  'oregon': 'OR',
  'pennsylvania': 'PA',
  'rhode island': 'RI',
  'south carolina': 'SC',
  'south dakota': 'SD',
  'tennessee': 'TN',
  'texas': 'TX',
  'utah': 'UT',
  'vermont': 'VT',
  'virginia': 'VA',
  'washington': 'WA',
  'west virginia': 'WV',
  'wisconsin': 'WI',
  'wyoming': 'WY',
  'american samoa': 'AS',
  'district of columbia': 'DC',
  'guam': 'GU',
  'puerto rico': 'PR',
  'virgin islands': 'VI',
  'armed forces americas': 'AA',
  'armed forces europe': 'AE',
  'armed forces pacific': 'AP',
} as const;

interface StateMatch {
  name: string;
  code: StateCode;
}

export const findStateMatches = (input: string): StateMatch[] => {
  const searchTerm = input.toLowerCase().trim();
  
  if (!searchTerm) return [];

  // Si es exactamente un código de estado válido de 2 letras
  const upperInput = searchTerm.toUpperCase();
  if (/^[A-Z]{2}$/.test(upperInput) && isValidStateCode(upperInput)) {
    const stateName = Object.entries(STATE_MAPPING).find(([_, code]) =>
      _ === upperInput || 
      code === upperInput
    )?.[0] || '';
    
    return [{
      name: stateName,
      code: upperInput as StateCode
    }];
  }

  // Buscar coincidencias en nombres de estados
  return Object.entries(STATE_MAPPING)
    .filter(([stateName]) => 
      stateName.includes(searchTerm)
    )
    .map(([name, code]) => ({
      name,
      code: code as StateCode
    }))
    .slice(0, 5); // Limitar a 5 resultados
};

export const getStateCode = (input: string): StateCode | '' => {
  const searchTerm = input.toLowerCase().trim();
  
  // Si ya es un código de estado válido, retornarlo
  if (/^[A-Z]{2}$/.test(input) && isValidStateCode(input)) {
    return input as StateCode;
  }

  // Buscar en el mapping
  return (STATE_MAPPING[searchTerm as StateName] as StateCode) || '';
};

// Type guard para validar códigos de estado
function isValidStateCode(code: string): code is StateCode {
  return Object.values(STATE_MAPPING).includes(code as StateCode);
}