// Define el tipo para los campos del usuario
export interface UserFields {
    name: string;           // Nombre del usuario
    LastName: string;      // Apellido del usuario
    email: string;         // Correo electrónico del usuario
    history: {             // Historial de enlaces del usuario
      sys: {               
        type: 'Link';      // Tipo de enlace
        linkType: 'Entry'; // Tipo de enlace específico para la entrada
        id: string;        // ID del historial
      };
    };
    registry: string;      // Fecha de registro
    UserUID: string;       // UID del usuario
  }
  
  // Define el tipo para el sistema del usuario
  export interface UserSys {
    space: {               // Espacio al que pertenece el usuario
      sys: {
        type: 'Link';      // Tipo de enlace
        linkType: 'Space'; // Tipo de enlace específico para espacio
        id: string;        // ID del espacio
      };
    };
    id: string;            // ID del usuario
    type: 'Entry';         // Tipo del contenido
    createdAt: string;     // Fecha de creación
    updatedAt: string;     // Fecha de actualización
    environment: {         // Entorno donde se encuentra el contenido
      sys: {
        id: string;        // ID del entorno
        type: 'Link';     // Tipo de enlace
        linkType: 'Environment'; // Tipo de enlace específico para entorno
      };
    };
    revision: number;      // Número de revisión
    locale: string;        // Idioma del contenido
    contentType: {        // Tipo de contenido
      sys: {
        type: 'Link';      // Tipo de enlace
        linkType: 'ContentType'; // Tipo de enlace específico para tipo de contenido
        id: string;        // ID del tipo de contenido
      };
    };
  }
  
  // Define el tipo para la entrada del usuario en Contentful
  export interface ContentfulUserEntry {
    sys: UserSys;         // Sistema del usuario
    fields: UserFields;   // Campos del usuario
  }
  