import * as cdk from 'aws-cdk-lib';
import { Bucket, CfnBucket } from 'aws-cdk-lib/aws-s3';
import { Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';

// Construct an s3 Bucket using the 3rd level construct
class L3Bucket extends Construct {
  constructor(scope: Construct, id: string, expiration: number) {
    super(scope, id);

    // create a new bucket
    new Bucket(this, 'MyL3Bucket', {
      lifecycleRules: [{
        expiration: Duration.days(expiration)
      }]
    });
  }
}

// a simple CloudFormation stack
// class CdkStarterStack 
export class CdkStarterStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    ///  Use different CDK constructs to create a AWS resource - s3 bucket

    // create an s3 bucket in 3 ways:

    // create an s3 bucket using the L1 construct
    // We're directly working with CloudFormation code
    // Differences between L1 and L2 constructs: the L2 constructs also provide some defaults. So this, if I'm specifying a rule logic dictates that this should be enabled. The CDK L2 construct already implies this, and since we are talking about constructs in this lecture,
    new CfnBucket(this, 'MyL1Bucket', {
      lifecycleConfiguration: {
        rules: [{
          expirationInDays: 1,
          status: 'Enabled'
        }]
      }
    })

    // using a CfnParameter for the expiration in days, for example, for our L2 bucket to provide epxiration in days data to our L2 bucket at the time of deployment
    // So when we run "cdk deploy" in the console without specifying any parametner, the lifecycle rule for our L2 bucket will be automatically updated to 6 days for the expiration of the bucket, using the default value given in 'duration'
    // Otherwise, if we run "cdk deploy --parameters duration=11", we'll get a deployment error because parameter durations must be a number not greater than 10 (maxValue). This means that these constraints in 'duration work very well and CDK has a correct error messages at least for this use case.
    // If we're to deploy with a valid duration parameter such as "cdk deploy --parameters duration=9", the deployment succeeds and now, the bucket has nine days as we deployed it to be to expire.
    const duration = new cdk.CfnParameter(this, 'duration', {
      default: 6,
      minValue: 1,
      maxValue: 10,
      type: 'Number'
    })

    // create an s3 bucket using the L2 construct
    // Pass 'this' to define the scope: this bucket belongs to 'this' stack
    // pass 'MyL2Bucket' as the id for the bucket
    // Since this is an L2 construct, we have the option to define additional properties. Let's pass some properties to this bucket and let's just say that we want files in this bucket to expire after a certain amount of days. So when a file is put in this bucket after a period passes, this file can expire and it can be deleted by default.
    const myL2Bucket = new Bucket(this, 'MyL2Bucket', {
      lifecycleRules: [{
        // expiration: Duration.days(2)
        expiration: Duration.days(duration.valueAsNumber)
      }]
    });

    console.log('bucket name: ' + myL2Bucket.bucketName)

    // CFN Output to extract data and information related to our resources that are available only after deployment, and are not locally available
    // In this case, we're accessing the name
    new cdk.CfnOutput(this, 'MyL2BucketName', {
      value: myL2Bucket.bucketName
    })

    // create a new L3Bucket using th 3rd level construct
    new L3Bucket(this, 'MyL3Bucket', 3);

    new L3Bucket(this, 'MyL3Bucket2', 5);
  }
}
