// Define el tipo para los campos del usuario
export interface ProductFields {
    name: string; // Nombre del usuario
    description: string; // Apellido del usuario
    units: number;
    price: number;
    giftBoxPrice?: number;
    
    image: {
      fields: {
        file: {
          url: string;
        };
      };
      category: string;
      sys: {
      type: 'Link';         // Tipo de enlace
        linkType: 'Entry';    // Tipo de enlace específico para la entrada
        id: string;           // ID del historial
      };
    };
    anotherImages?: AssetLink[];
    category: string; // Fecha de registro
    nutrutionalTable?: NutritionalTableEntry;
    allergenInfo : string;
  }

  // Interface para imágenes/assets
interface AssetLink {
  sys: {
    type: 'Link';
    linkType: 'Asset';
    id: string;
  };
  fields: {
    file: {
      url: string;
    };
  };
}


  
  // Define el tipo para el sistema del usuario
  export interface ProductSys {
    space: {
      sys: {
        type: 'Link';
        linkType: 'Space';
        id: string;
      };
    };
    id: string;
    type: 'Entry';
    createdAt: string;
    updatedAt: string;
    environment: {
      sys: {
        id: string;
        type: 'Link';
        linkType: 'Environment';
      };
    };
    publishedVersion?: number;
    revision: number;
    contentType: {
      sys: {
        type: 'Link';
        linkType: 'ContentType';
        id: string;
      };
    };
    locale: string;
  }


  // Define el tipo para los metadatos
export interface ContentfulMetadata {
  tags: Array<string>;
  concepts: Array<string>;
}

  
  // Define el tipo para la entrada del usuario en Contentful
  export interface ContentfulProductEntry {
    metadata?: ContentfulMetadata;
    sys: ProductSys;
    fields: ProductFields;
    contentTypeId: string;
  }
  

  export interface NutritionalTableFields {
    // Entry information
    title: string;
    
    // Serving information
    servingSize: string;
    
    // Nutritional values (all in integer format)
    calories: number;
    fatCalories: number;
    totalFat: number;
    cholesterol: number;
    sodium: number;
    totalCarbohydrates: number;
    protein: number;
    vitaminA: number;
    vitaminC: number;
    calcium: number;
    iron: number;
    
    // Dietary characteristics (boolean flags)
    sugarFree: boolean;
    glutenFree: boolean;
    keto: boolean;
    milkFree: boolean;
  }
  
  export interface NutritionalTableEntry {
    sys: {
      space: {
        sys: {
          type: 'Link';
          linkType: 'Space';
          id: string;
        };
      };
      id: string;
      type: 'Entry';
      createdAt: string;
      updatedAt: string;
      environment: {
        sys: {
          id: string;
          type: 'Link';
          linkType: 'Environment';
        };
      };
      publishedVersion?: number;
      revision: number;
      contentType: {
        sys: {
          type: 'Link';
          linkType: 'ContentType';
          id: string;
        };
      };
      locale: string;
    };
    fields: NutritionalTableFields;
    contentTypeId: string;
  }
  
