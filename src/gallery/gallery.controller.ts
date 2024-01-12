import { Controller, Post, Req, Res } from '@nestjs/common';
import { GalleryService } from './gallery.service';

@Controller('gallery')
export class GalleryController {
    constructor(private readonly galleryService: GalleryService) {}

    @Post()
    async createBoard(@Req() req, @Res() res) {
        
        
    }
}
