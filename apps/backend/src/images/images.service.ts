import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ImagesService {
  async uploadImage(
    file: Express.Multer.File,
    prefix: string,
  ): Promise<string> {
    const uploadPath = path.join(__dirname, '..', '..', 'uploads');

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }

    const imageName = `${Date.now()}-${prefix}-${file.originalname}`;
    const filePath = path.join(uploadPath, imageName);

    console.log('loging the path');
    console.log(filePath);

    fs.writeFileSync(filePath, file.buffer);

    return `http://localhost:5000/api/v1/uploads/${imageName}`;
  }
}
