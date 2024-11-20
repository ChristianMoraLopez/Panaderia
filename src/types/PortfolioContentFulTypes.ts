import { Asset as ContentfulAsset } from 'contentful';


// Define el tipo para los campos del usuario
export interface UserFields {
  name: string; // Nombre del usuario
  l: string; // Apellido del usuario
  email: string; // Correo electrónico del usuario
  history: {
    sys: {
      type: 'Link';
      linkType: 'Entry';
      id: string; // ID del historial (si corresponde)
    };
  };
  registry: string; // Fecha de registro
}

// Define el tipo para el sistema del usuario
export interface UserSys {
  space: {
    sys: {
      type: 'Link';
      linkType: 'Space';
      id: string; // ID del espacio
    };
  };
  id: string; // ID del usuario
  type: 'Entry'; // Tipo del contenido
  createdAt: string; // Fecha de creación
  updatedAt: string; // Fecha de actualización
  environment: {
    sys: {
      id: string; // ID del entorno
      type: 'Link';
      linkType: 'Environment';
    };
  };
  revision: number; // Número de revisión
  locale: string; // Idioma del contenido
  contentType: {
    sys: {
      type: 'Link';
      linkType: 'ContentType';
      id: string; // ID del tipo de contenido
    };
  };
}

// Define el tipo para la entrada del usuario en Contentful
export interface ContentfulUserEntry {
  sys: UserSys; // Sistema del usuario
  fields: UserFields; // Campos del usuario
}


// Define el tipo para TagLink
interface TagLink {
  sys: {
    type: 'Link';
    linkType: 'Tag';
    id: string;
  };
}

// Define AssetSys tipo
export interface AssetSys {
  space: {
    sys: {
      type: 'Link';
      linkType: 'Space';
      id: string;
    };
  };
  id: string;
  type: 'Asset';
  createdAt: string;
  updatedAt: string;
  environment: {
    sys: {
      id: string;
      type: 'Link';
      linkType: 'Environment';
    };
  };
  revision: number;
  locale: string;
}

// Define el tipo para los campos combinados
export type CombinedFields = {
  title: string; // Asegúrate de que sea un string, no undefined
  description?: string;
  technic?: string; // Solo para AssetFields
  file: {
    url: string;
    contentType: string;
    details: {
      size: number;
      duration?: number; // Esto es opcional para VideoFields
    };
  };
};

// Define ContentItem interface
export interface ContentItem {
  category: string;
  type: 'image' | 'video';
  metadata: {
    tags: TagLink[];
  };
  sys: AssetSys;
  fields: CombinedFields; // Usar el nuevo tipo
}

// Extiende el tipo ContentfulAsset para incluir metadata
export interface ExtendedAsset extends ContentfulAsset {
  metadata: {
    tags: TagLink[];
  };
}

// Define VideoFields tipo
export type VideoFields = {
  title: string;
  description?: string;
  file: {
    url: string;
    contentType: string;
    details: {
      size: number;
      duration?: number;
    };
  };
};

// Define AssetFields tipo
export type AssetFields = {
  title: string;
  description?: string;
  technic?: string;
  file: {
    url: string;
    contentType: string;
    details: {
      size: number;
    };
  };
};

// Define ParagraphContent tipo
export type ParagraphContent = {
  data: { /* Specific type for data */ };
  content: Array<{
    data: { /* Specific type for data */ };
    marks: Array<{ /* Specific type for marks */ }>;
    value: string;
    nodeType: 'text';
  }>;
  nodeType: 'paragraph';
};

// Define ContentfulData tipo
export type ContentfulData = {
  metadata: {
    tags: string[];
  };
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
  fields: {
    title: string;
    images: ExtendedAsset[];
    description: {
      data: unknown;
      content: ParagraphContent[];
      nodeType: 'document';
    };
    date: string;
    client: string;
    servicesProvided: string;
    video: ExtendedAsset;
    location: string;
    technic: string;
  };
};


