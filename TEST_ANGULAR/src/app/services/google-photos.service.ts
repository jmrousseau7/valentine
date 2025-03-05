import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { map, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GooglePhotosService {
  private API_URL = 'https://photoslibrary.googleapis.com/v1';
  constructor(private http: HttpClient, private authService: AuthService) {}

  getMediaItems() {
    const token = this.authService.getAccessToken();
    console.log('Fetching Photos with Token:', token);

    if (!token) {
      console.error('User is not authenticated! Token is null.');
      //return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(`${this.API_URL}/mediaItems`, { headers });
  }

  getMagicAlbum() {
    const token = this.authService.getAccessToken();
    if (!token) {
      console.error('User is not authenticated! Token is null.');
      return of(null); // Return an observable with null
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    // Function to search in an album list
    const findAlbum = (albums: any[]) =>
      albums.find((album) => album.title === '🐥❤️') || null;

    // First, search in shared albums
    return this.http
      .get('https://photoslibrary.googleapis.com/v1/sharedAlbums', { headers })
      .pipe(
        map((response: any) => findAlbum(response.sharedAlbums || [])), // Check in sharedAlbums
        switchMap((album) => {
          if (album) return of(album); // Found in sharedAlbums, return it

          // If not found, search in albums
          return this.http
            .get('https://photoslibrary.googleapis.com/v1/albums', { headers })
            .pipe(map((response: any) => findAlbum(response.albums || [])));
        })
      );
  }
  getAlbums() {
    const token = this.authService.getAccessToken();
    if (!token) {
      console.error('User is not authenticated! Token is null.');
      //return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get('https://photoslibrary.googleapis.com/v1/albums', {
      headers,
    });
  }

  // getMediaItemsByAlbum() {
  //   const token = this.authService.getAccessToken();
  //   if (!token) {
  //     console.error('User is not authenticated! Token is null.');
  //     //return;
  //   }

  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${token}`,
  //     'Content-Type': 'application/json',
  //   });

  //   const body = {
  //     albumId: ,
  //     pageSize: 100, // Max 100, adjust as needed
  //   };

  //   return this.http.post(
  //     'https://photoslibrary.googleapis.com/v1/mediaItems:search',
  //     body,
  //     { headers }
  //   );
  // }

  getAllPhotosFromAlbum(id: any) {
    const token = this.authService.getAccessToken();
    if (!token) {
      console.error('User is not authenticated! Token is null.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    let allPhotos: any[] = [];

    const fetchPage: any = (pageToken?: string) => {
      const body: any = {
        albumId: id,
        pageSize: 100, // Max limit
      };

      if (pageToken) {
        body.pageToken = pageToken; // Fetch next set of images
      }

      return this.http
        .post(
          'https://photoslibrary.googleapis.com/v1/mediaItems:search',
          body,
          { headers }
        )
        .toPromise()
        .then((response: any) => {
          if (response.mediaItems) {
            allPhotos = [...allPhotos, ...response.mediaItems]; // Merge results
          }

          if (response.nextPageToken) {
            return fetchPage(response.nextPageToken); // Fetch next page
          } else {
            return allPhotos.filter((photo) =>
              photo.mimeType.startsWith('image/')
            ); // Return all results when done
          }
        })
        .catch((error) => {
          console.error('Error fetching album photos:', error);
          return [];
        });
    };

    return fetchPage(); // Start fetching pages
  }
}
