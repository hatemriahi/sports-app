import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { Platform } from '@ionic/angular';

const IMAGE_DIR = 'stored-images';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor(private plt:Platform) { }

  public async addNewImage(source : CameraSource) {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: source,
      quality: 80,
    });

    var table = []
    table.push(capturedPhoto.path)
    table.push(capturedPhoto.webPath)
    table.push(capturedPhoto.base64String)

    this.saveImage(capturedPhoto)
    return(table);


    
  }

  async saveImage (photo :Photo) {
    const base64Data= await this.readAsBase64(photo);
    console.log(base64Data);
    
    const fileName = new Date().getTime()+'.jpeg';
    const saveFile = await Filesystem.writeFile({
      directory : Directory.Data,
      path : `${IMAGE_DIR}/${fileName}`,
      data : base64Data
    })
  }

  private async readAsBase64(photo: Photo) {
    if (this.plt.is('hybrid')) {
        const file = await Filesystem.readFile({
            path: photo.path
        });
 
        return file.data;
    }
    else {
        // Fetch the photo, read as a blob, then convert to base64 format
        const response = await fetch(photo.webPath);
        const blob = await response.blob();
 
        return await this.convertBlobToBase64(blob) as string;
    }
}
 
// Helper function
convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
});
}
