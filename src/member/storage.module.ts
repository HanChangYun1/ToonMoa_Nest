import { Global, Module } from "@nestjs/common";
import { Storage } from "@google-cloud/storage";

@Global()
@Module({
  providers: [
    {
      provide: Storage,
      useValue: new Storage({
        projectId: "toonmoa",
        keyFilename: "./toonmoa-3bbc9ada2044.json",
      }),
    },
  ],
  exports: [Storage],
})
export class StorageModule {}
