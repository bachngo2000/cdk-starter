import * as cdk from 'aws-cdk-lib';
import { Bucket, CfnBucket } from 'aws-cdk-lib/aws-s3';
import { Duration, Fn } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Code, Function as LambdaFunction, Runtime } from 'aws-cdk-lib/aws-lambda';

// Examples of how to cross reference stacks

// Example 2: use interface
interface PhotosHandlerStackProps extends cdk.StackProps {
  targetBucketArn: string
}

// We have 2 stacks: PhotosStack and PhotosHandlerStack:
// The PhotosStack initializes the bucket where we will use to hold our photos. We have a different stack, the PhotosHandlerStack, which contains some logic that puts photos 
// into that resource. We will need a reference to this bucket outside the PhotosStack stack.

// This stack contains a Lambda Function, a basic AWS resource
// Example 1: use instrinsic function Fn 
export class PhotosHandlerStack extends cdk.Stack {

    constructor(scope: Construct, id: string, props: PhotosHandlerStackProps) {
      super(scope, id, props);

      // cross reference two stacks using instrinsic function importValue
      // const targetBucket = Fn.importValue('photos-bucket')

      new LambdaFunction(this, 'PhotosHandler', {
        runtime: Runtime.NODEJS_16_X,
        handler: 'index.handler',
        code: Code.fromInline(`
        exports.handler = async (event) => {
          console.log("hello!zxzxc: " + process.env.TARGET_BUCKET)
        };
      `),
        environment: {
          // Example 1
            // TARGET_BUCKET: targetBucket,
          // Example 2
            TARGET_BUCKET: props.targetBucketArn
        },

    });


    }
}