import AWS from "aws-sdk";
import config from "../config";

const s3 = new AWS.S3({
  accessKeyId: config.aws_access_key_id,
  secretAccessKey: config.aws_secret_access_key,
  region: config.aws_region
});

export default s3;