import { Injectable } from '@nestjs/common';
import S3 from 'aws-sdk/clients/s3';
import { z } from 'zod';
import { ConfigService } from '../../config/config.service';
import { RequiredEnv } from '../../config/required-env.decorator';

const BUCKET_NAME = 'fleets-verification-documents';

type VerificationUploadForms = {
  selfie: S3.PresignedPost;
  document: S3.PresignedPost;
};

@Injectable()
@RequiredEnv(
  {
    key: 'AWS_SECRET_ACCESS_KEY',
    schema: z.string(),
  },
  {
    key: 'AWS_ACCESS_KEY_ID',
    schema: z.string(),
  },
)
export class VerificationService {
  private s3: S3;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: 'eu-central-1',
    });
  }
  async getVerificationUploadForms(
    userId: string,
  ): Promise<VerificationUploadForms> {
    const documentKey = `documents/${userId}`;
    const selfieKey = `selfies/${userId}`;
    const conditions = [
      ['content-length-range', 0, 10485760], // limite la taille du fichier à 10 Mo
    ];
    const expires = 60 * 5; // formulaire valide pendant 5 minutes

    const fields = {
      acl: 'private',
      'Content-Type': 'image/jpeg',
      key: documentKey,
    };
    const params = {
      Bucket: BUCKET_NAME,
      Fields: fields,
      Conditions: conditions,
      Expires: expires,
    };
    const documentPresignedPost = this.s3.createPresignedPost(params);
    fields.key = selfieKey;
    const selfiePresignedPost = this.s3.createPresignedPost(params);

    return {
      document: documentPresignedPost,
      selfie: selfiePresignedPost,
    };
  }
}
