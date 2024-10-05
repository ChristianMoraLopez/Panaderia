// Define el tipo para los campos del usuario
export interface ProductFields {
    name: string; // Nombre del usuario
    description: string; // Apellido del usuario
    price: number;
    image: {
        fields: {
            file: {
            url: string;
            };
        };
      sys: {
        type: 'Link';         // Tipo de enlace
        linkType: 'Entry';    // Tipo de enlace específico para la entrada
        id: string;           // ID del historial
      };
    };
    category: string; // Fecha de registro
  }
  
  // Define el tipo para el sistema del usuario
  export interface ProductSys {
    space: {
      sys: {
        type: 'Link';         // Tipo de enlace
        linkType: 'Space';    // Tipo de enlace específico para espacio
        id: string;           // ID del espacio
      };
    };
    id: string;                  // ID del usuario
    type: 'Entry';               // Tipo del contenido
    createdAt: string;           // Fecha de creación
    updatedAt: string;           // Fecha de actualización
    environment: {
      sys: {
        id: string;              // ID del entorno
        type: 'Link';           // Tipo de enlace
        linkType: 'Environment'; // Tipo de enlace específico para entorno
      };
    };
    revision: number;            // Número de revisión
    locale: string;              // Idioma del contenido
    contentType: {
      sys: {
        type: 'Link';            // Tipo de enlace
        linkType: 'ContentType'; // Tipo de enlace específico para tipo de contenido
        id: string;             // ID del tipo de contenido
      };
    };
  }
  
  // Define el tipo para la entrada del usuario en Contentful
  export interface ContentfulProductEntry {
    sys: ProductSys;                // Sistema del usuario
    fields: ProductFields;          // Campos del usuario
    contentTypeId: string;          // ID del tipo de contenido
  }
  