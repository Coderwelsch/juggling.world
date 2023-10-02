import type { Schema, Attribute } from '@strapi/strapi';

export interface BaseContact extends Schema.Component {
  collectionName: 'components_base_contacts';
  info: {
    displayName: 'Contact';
    icon: 'phone';
    description: '';
  };
  attributes: {
    email: Attribute.Email;
    instagram: Attribute.String;
    facebook: Attribute.String;
    whatsapp: Attribute.String;
    telegram: Attribute.String;
    reddit: Attribute.String;
    signal: Attribute.String;
  };
}

export interface BaseLocation extends Schema.Component {
  collectionName: 'components_base_locations';
  info: {
    displayName: 'Location';
    icon: 'pinMap';
    description: '';
  };
  attributes: {
    latitude: Attribute.Float & Attribute.Required;
    longitude: Attribute.Float & Attribute.Required;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'base.contact': BaseContact;
      'base.location': BaseLocation;
    }
  }
}
