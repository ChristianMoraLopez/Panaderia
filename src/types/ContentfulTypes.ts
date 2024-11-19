import {ContentfulProductEntry } from './ProductTypes';

// Interfaz base general para las entradas de Contentful
export interface ContentfulEntryBase<TFields> {
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
      locale: string;
      contentType: {
        sys: {
          type: 'Link';
          linkType: 'ContentType';
          id: string;
        };
      };
    };
    fields: TFields; // Tipo genérico para los campos específicos



  }

  // Interfaz para los campos de las imágenes de la página "Sobre nosotros"

  
  export interface AboutUsPicturesFields {
    title: string;
    color: string; // Agregamos el campo color
    imageAboutUs: {
      fields: {
        file: {
          url: string;
        };
      };
      sys: {
        type: 'Link';
        linkType: 'Asset';
        id: string;
      };
    };
  }
// Entry type for About Us Pictures
export interface AboutUsPicturesEntry {
  sys: ContentfulEntryBase<AboutUsPicturesFields>['sys'];
  fields: AboutUsPicturesFields;
  contentTypeId: string;
}
// Interfaz para los campos del menú semanal
export interface WeeklyMenuFields {
    title: string; // Ajustado para coincidir con el campo del JSON
    SemanalProduct : ContentfulProductEntry; // Producto semanal
    PriceDiscount : number; // Precio
    dateWeeklyMenu: string; // Fecha del menú semanal
}

// Tipo de entrada para el menú semanal
export interface WeeklyMenuEntry {
   sys: ContentfulEntryBase<WeeklyMenuFields>['sys'];
    fields: WeeklyMenuFields;
    contentTypeId: string;          // ID del tipo de contenido
    
}