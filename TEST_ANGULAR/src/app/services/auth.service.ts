// import { gapi } from 'gapi-script';
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private clientId = '450312843350-qutvnp8uf5sem92v1iar3kgjomrpe1b1.apps.googleusercontent.com';
//   private accessToken: string | null = null;

//   constructor(private http: HttpClient) {}

//   async loadGoogleAuth(): Promise<void> {
//     return new Promise((resolve) => {
//       gapi.load('auth2', async () => {
//         const auth2 = await gapi.auth2.init({
//           client_id: this.clientId,
//           scope: 'https://www.googleapis.com/auth/photoslibrary.readonly'
//         });

//         console.log("Google Auth Initialized");

//         Check if the user is already signed in
//         if (auth2.isSignedIn.get()) {
//           const user = auth2.currentUser.get();
//           if (user && user.isSignedIn()) {
//             this.accessToken = user.getAuthResponse().access_token;
//             console.log("User is already signed in. Token:", this.accessToken);
//           } else {
//             console.log("User is signed in but token is missing.");
//           }
//         }

//         resolve();
//       });
//     });
//   }

//   async signIn(): Promise<void> {
//     const auth2 = gapi.auth2.getAuthInstance();

//     try {
//       const user = await auth2.signIn();
//       if (user && user.isSignedIn()) {
//         this.accessToken = user.getAuthResponse().access_token;
//         console.log("User Signed In. Token:", this.accessToken);
//       } else {
//         console.error("Sign-in failed: No token received.");
//       }
//     } catch (error) {
//       console.error("Sign-in Error:", error);
//     }
//   }

//   getAccessToken(): string | null {
//     console.log("Access Token Retrieved:", this.accessToken);
//     return this.accessToken;
//   }
// }


import { gapi } from 'gapi-script';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private clientId = '450312843350-qutvnp8uf5sem92v1iar3kgjomrpe1b1.apps.googleusercontent.com';
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor(private http: HttpClient) {}

  async loadGoogleAuth(): Promise<void> {
    return new Promise((resolve) => {
      gapi.load('auth2', async () => {
        const auth2 = await gapi.auth2.init({
          client_id: this.clientId,
          scope: 'https://www.googleapis.com/auth/photoslibrary.readonly' // Your desired scopes
        });

        console.log("Google Auth Initialized");

        // Check if the user is signed in
        if (auth2.isSignedIn.get()) {
          const user = auth2.currentUser.get();
          if (user && user.isSignedIn()) {
            this.accessToken = user.getAuthResponse().access_token;
            this.refreshToken = user.getAuthResponse().refresh_token; // Store the refresh token if available
            console.log("User is already signed in. Token:", this.accessToken);
          } else {
            console.log("User is signed in but token is missing.");
          }
        } else {
          console.log("User is not signed in. Signing in...");
          // If not signed in, sign them in directly
          await this.signIn(); // Sign in the user automatically
        }

        // Listen for changes in the sign-in state
        auth2.isSignedIn.listen((isSignedIn :any) => {
          if (isSignedIn) {
            const user = auth2.currentUser.get();
            this.accessToken = user.getAuthResponse().access_token;
            this.refreshToken = user.getAuthResponse().refresh_token; // Store the refresh token
            console.log("User signed in. Token:", this.accessToken);
          } else {
            console.log("User signed out.");
            this.accessToken = null;
            this.refreshToken = null;
          }
        });

        resolve();
      });
    });
  }

  async signIn(): Promise<void> {
    const auth2 = gapi.auth2.getAuthInstance();

    try {
      const user = await auth2.signIn();
      if (user && user.isSignedIn()) {
        this.accessToken = user.getAuthResponse().access_token;
        this.refreshToken = user.getAuthResponse().refresh_token; // Get refresh token
        console.log("User Signed In. Token:", this.accessToken);
      } else {
        console.error("Sign-in failed: No token received.");
      }
    } catch (error) {
      console.error("Sign-in Error:", error);
    }
  }

  getAccessToken(): string | null {
    console.log("Access Token Retrieved:", this.accessToken);
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    console.log("Refresh Token Retrieved:", this.refreshToken);
    return this.refreshToken;
  }
}
