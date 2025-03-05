import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { PhotoGalleryComponent } from './components/photo-gallery/photo-gallery.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [PhotoGalleryComponent, CommonModule]
})
export class AppComponent implements OnInit {
  isSignedIn = false;

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    this.startMoving();
    // await this.authService.loadGoogleAuth();
    //   if (this.authService.getAccessToken()) {
    //   console.log('User is signed in');
    //   this.isSignedIn = true;
    // }
  }

  positionX = 100;
  positionY = 100;
  speedX = 1.5; // Speed in pixels
  speedY = 1.5;
  interval: any;

  startMoving() {
    this.interval = setInterval(() => {
      // Update position slowly
      this.positionX += this.speedX;
      this.positionY += this.speedY;

      // Reverse direction if hitting screen edges
      if (this.positionX >= window.innerWidth - 120 || this.positionX <= 0) {
        this.speedX *= -1;
      }
      if (this.positionY >= window.innerHeight - 50 || this.positionY <= 0) {
        this.speedY *= -1;
      }
    }, 20); // Lower interval for smooth movement
  }

  stopMoving() {
    clearInterval(this.interval);
  }

  click(){

  }
}
