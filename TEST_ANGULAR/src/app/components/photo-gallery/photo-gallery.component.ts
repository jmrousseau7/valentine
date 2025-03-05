import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { GooglePhotosService } from '../../services/google-photos.service';
import { CommonModule } from '@angular/common';
import { CdkDrag } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-photo-gallery',
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.scss'],
  imports: [CommonModule, CdkDrag],
})
export class PhotoGalleryComponent implements OnInit {
  photos: any[] = [];

  constructor(
    private googlePhotosService: GooglePhotosService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    await this.authService.loadGoogleAuth();

    this.googlePhotosService.getMagicAlbum().subscribe((album: any) => {
      console.log('Album found :', album);
      if(album){
        this.loadAllPhotos(album.id);
      }
    }
    );
  }

  displayed: any[] = [];

  ALLPHOTOS: any[] = [];

  loadAllPhotos(id : any) {
    this.googlePhotosService
      .getAllPhotosFromAlbum(id)
      .then((photos: any[]) => {
        this.ALLPHOTOS = photos;
        this.setNewDisplayedPhotos();
      })
      .catch((error: any) => {
        console.error('Error loading all photos:', error);
      });
  }

  public setNewDisplayedPhotos() {
    this.displayed=[];
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const photos = this.ALLPHOTOS;

    if (photos.length === 0) {
      return;
    }

    const numPhotos =
      Math.floor((screenWidth * screenHeight) / (100 * 120)) * 1.5;

    const ids = this.generateUniqueRandomNumbers(numPhotos, photos.length - 1);

    const photosToDisplay = ids.map((id) => photos[id]);
    photosToDisplay.forEach((item: any) => {
      const randomLeft = (Math.random() * 90) ;
      const randomTop = (Math.random() * 90) ;
      const randomRotation = (Math.random() - 0.5) * 120;

      item['styles'] = {
        left: `${randomLeft}%`,
        top: `${randomTop}%`,
        transform: `rotate(${randomRotation}deg)`,
      };
    });

    this.displayed = photosToDisplay;
  }

  generateUniqueRandomNumbers(count: number, max: number): number[] {
    if (count > max + 1) {
      throw new Error('Count cannot be greater than the range size.');
    }

    const numbers = new Set<number>();

    while (numbers.size < count) {
      numbers.add(Math.floor(Math.random() * (max + 1))); // Ensures numbers are within [0, x]
    }

    return Array.from(numbers);
  }

  // onDragStart(event: DragEvent, photo: any): void {
  //   // Set a custom data attribute that can be used during the drop
  //   event.dataTransfer?.setData('photo', JSON.stringify(photo));
  // }

  //   onDrop(event: DragEvent, targetPhoto: any): void {
  //   // Get the dragged photo's data
  //   const draggedPhoto = JSON.parse(event.dataTransfer?.getData('photo') || '{}');

  //   // Implement your logic here to update the position of the dragged photo
  //   console.log('Dropped photo:', draggedPhoto);
  //   console.log('Target photo:', targetPhoto);
  //   // Example: Swap the photos in the array
  // }

  // onDragOver(event: DragEvent): void {
  //   event.preventDefault();
  // }
}
