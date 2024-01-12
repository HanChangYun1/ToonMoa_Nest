import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { GalleryService } from "./gallery.service";
import { FilesInterceptor } from "@nestjs/platform-express";

@Controller("gallery")
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Post("createGallery")
  @UseInterceptors(FilesInterceptor("files", 6))
  async createGallery(
    @Req() req,
    @Res() res,
    @UploadedFiles() files: Express.Multer.File | Express.Multer.File[],
    @Body("email") email
  ) {
    try {
      console.log(email);

      const result = await this.galleryService.createGallery(email, files);
      res.status(200).send(result);
    } catch (e) {
      throw new Error(e);
    }
  }
}
