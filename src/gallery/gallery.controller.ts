import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { GalleryService } from "./gallery.service";
import { FilesInterceptor } from "@nestjs/platform-express";

@Controller("gallery")
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Post("create")
  @UseInterceptors(FilesInterceptor("files", 6))
  async createGallery(
    @Res() res,
    @UploadedFiles() files: Express.Multer.File | Express.Multer.File[],
    @Body("email") email
  ) {
    try {
      console.log(files, email);

      const result = await this.galleryService.createGallery(email, files);
      res.status(200).send(result);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get(":id")
  async getGalleryOne(@Param("id") id: number, @Res() res) {
    try {
      const result = await this.galleryService.getGalleryOne(id);
      res.status(200).send(result);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Post("all")
  async getAllGallery(@Res() res, @Body("page") page) {
    try {
      const result = await this.galleryService.getAllGallery(page);
      res.status(200).send(result);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Post("my")
  async getMyGallery(@Res() res, @Body("email") email, @Body("page") page) {
    try {
      const result = await this.galleryService.getMyGallery(email, page);
      res.status(200).send(result);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Post("update")
  @UseInterceptors(FilesInterceptor("files", 6))
  async updateGallery(
    @Res() res,
    @UploadedFiles() files: Express.Multer.File | Express.Multer.File[],
    @Body("email") email,
    @Body("galleryId") galleryId
  ) {
    try {
      const result = await this.galleryService.updateGallery(
        email,
        files,
        galleryId
      );
      res.status(200).send(result);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Post("delete")
  async deleteGallery(
    @Res() res,
    @Body("email") email,
    @Body("galleryId") galleryId
  ) {
    try {
      const result = await this.galleryService.deleteGallery(email, galleryId);
      res.status(200).send(result);
    } catch (e) {
      throw new Error(e);
    }
  }
}
