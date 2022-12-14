import { BadRequestException, NestInterceptor, Type } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";

export const MultipleImageUploadInterceptor = (
  maxFileSize: number,
  totalFiles: number,
): Type<NestInterceptor<any, any>> => {
  return FilesInterceptor("images", totalFiles, {
    fileFilter: function (_, file, cb) {
      const { mimetype } = file;

      if (!["image/jpeg", "image/jpg", "image/png"].includes(mimetype)) {
        return cb(
          new BadRequestException("Only jpg/jpeg/png files allowed!"),
          false,
        );
      }

      return cb(null, true);
    },
    limits: {
      fileSize: maxFileSize,
    },
  });
};
