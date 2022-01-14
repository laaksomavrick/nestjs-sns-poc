import * as convict from 'convict'
import * as dotenv from 'dotenv'
import { join } from 'path'


dotenv.config()
const defaultEnv = 'production'
const env = process.env.NODE_ENV || defaultEnv
const envPath = join(__dirname, '..', `.env.${env}`)
dotenv.config({ path: envPath })

convict.addFormat({
  name: 'string-array',
  validate: (val) => {},
  coerce: (val) => val.split(',').map(item => item.trim())
})

const config = convict({
  sqs: {
    region: {
      default: "",
      env: "SQS_REGION",
    },
    accessKeyId: {
      default: "",
      env: "AWS_ACCESS_KEY_ID",
    },
    secretAccessKey: {
      default: "",
      env: "AWS_SECRET_ACCESS_KEY",
    },
    queueUrl: {
      default: "",
      env: "AWS_SQS_QUEUE_URL",
    },
  },
});

export default config;