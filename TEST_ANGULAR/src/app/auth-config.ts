// src/app/auth-config.ts
import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  redirectUri: window.location.origin,
  clientId: '450312843350-qutvnp8uf5sem92v1iar3kgjomrpe1b1.apps.googleusercontent.com',
  scope: 'https://www.googleapis.com/auth/photoslibrary.readonly profile',
};
