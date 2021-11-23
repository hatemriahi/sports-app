import { Component } from '@angular/core';
import { CameraSource } from '@capacitor/camera';
import { AlertController } from '@ionic/angular';
import { Comment } from '../comment';
import { PhotoService } from '../services/photo.service';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams, HttpRequest } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
//import { Filesystem, Directory } from '@capacitor/filesystem';

const apiUrl = 'http://localhost:3000/comments';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})




export class HomePage {

  constructor(private alertCtrl: AlertController,private photoService: PhotoService,private http: HttpClient) {

  }
  
  inputValue: string = "";

  imageSrc = "";

  comments : Comment[] = [
    {
      text : "Good",
      imagePath : null
    }
    
  ]



  addElement()  : void {
    if(this.inputValue.length || this.imageSrc.length) {
      this.addComment({
        text : this.inputValue,
        imagePath : this.imageSrc
      },this.imageSrc).subscribe(res => console.log(res));
      


      this.comments.push({
        text : this.inputValue,
        imagePath : this.imageSrc
      });

    } 
    this.imageSrc ="";
    this.inputValue = "";
  }

  async presentAlert() {
    await this.alertCtrl.create({
      header : "Ajouter photo",
      buttons : [
        {text: 'Camera', handler : () => {
          this.photoService.addNewImage(CameraSource.Camera).then(res => {
          this.imageSrc = res[1];
        }
          );

        }},
        {text: 'Gallerie', handler : () => {
          this.photoService.addNewImage(CameraSource.Photos).then(res => {
            //this.comments.push({text : res[0]+"** **"+res[1]+"** **"+res[2],imagePath : ""});
            this.imageSrc = res[1];
        }
          );
        }},
      ]
    }).then( res => res.present());
  }


  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }

  addComment(comment: Comment, file: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('text', comment.text);
    const header = new HttpHeaders();
    const params = new HttpParams();

    const options = {
      params,
      reportProgress: true,
      headers: header
    };
    const req = new HttpRequest('POST', apiUrl, formData, options);
    return this.http.request(req);
  }
 
}
