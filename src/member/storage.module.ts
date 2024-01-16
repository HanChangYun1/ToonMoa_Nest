import { Global, Module } from "@nestjs/common";
import { Storage } from "@google-cloud/storage";

@Global()
@Module({
  providers: [
    {
      provide: Storage,
      useValue: new Storage({
        projectId: "toonmoa",
        credentials: {
          client_email: process.env.GCP_CLIENTEMAIL,
          private_key: process.env.GCP_PRIVATEKEY,
        },
      }),
    },
  ],
  exports: [Storage],
})
export class StorageModule {}
