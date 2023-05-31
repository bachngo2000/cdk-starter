import * as cdk from 'aws-cdk-lib';
import { Bucket, CfnBucket } from 'aws-cdk-lib/aws-s3';
import { Duration, Fn } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class PhotosStack extends cdk.Stack {

    private stackSuffix: string;

    public readonly photosBucketArn: string;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
      super(scope, id, props);

      this.initializeSuffix();
    
    // new L2 S3 Bucket
    // If we want to customize the name of this bucket to our own liking, we can override the default generated Physical ID (name) of the bucket given by AWS by defining a string
    // value for the property "bucketName".  Then, the Physical ID of the resource will be the value that we define.  For example, the Physical ID of this bucket here
    // will be 'photosbucket-1932000' after re-deployments, not whatever the generated Physical ID that AWS gave to the bucket after its first deployment

    //  But what happens if, for example, we're to change the construct id 'PhotosBucket' to some other value, such as 'PhotosBucket2', that means we're also changing the
    // Logical ID of that resource.  What will happen? Well, when a logical ID of a resource changes, AWS will create and replace it. What this means is that AWS first will:
    // 1. Create a new resource
    // 2. AWS will delete the old one. This is an important point because in case of buckets, which hold data or databases, if we are not careful and we change this logical or construct ID, then we then we might lose data, but we might also get into other trouble when we are doing this.
    // But if we're to do this, and try to deploy, we'll fail and encounter error.  This is because first, AWS tries to create a new resource, or a new s3 bucket, but because the original buck that we created has the name 'photosbucket-1932000', AWS cannot create another resource or bucket
    // with this same name.  Since step 1 cannot be successful, step 2 will fail as well. 
    const photosBucket = new Bucket(this, 'PhotosBucket', {
        bucketName: `photos-bucket-${this.stackSuffix}`
    });
    this.photosBucketArn = photosBucket.bucketArn;

    // To override the logical ID, we can do this:
    // (myBucket.node.defaultChild as CfnBucket).overrideLogicalId('PhotosBucket2023')

    // import using the CloudFormation Output
    // new cdk.CfnOutput(this, 'photo-bucket', {
    //     value: photosBucket.bucketArn,
    //     exportName: 'photos-bucket'
    // })

    }

    // using Fn intrinsic functions "split" and "select" to form a unique name for the L2 bucket using the last part of the Stack ID of our current stack after the slash('/') and appends it to 'photos-bucket'
    private initializeSuffix() {
        const shortStackId = Fn.select(2, Fn.split('/', this.stackId))
        this.stackSuffix = Fn.select(4, Fn.split('-', shortStackId))

    }
}