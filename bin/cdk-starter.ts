#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkStarterStack } from '../lib/cdk-starter-stack';
import { PhotosStack } from '../lib/PhotosStack';
import { PhotosHandlerStack } from '../lib/PhotosHandlerStack';
import { BucketTagger } from './Tagger';

// a simple cdk application needed to run all the stacks
const app = new cdk.App();

// a simple stack that belongs our cdk application
new CdkStarterStack(app, 'CdkStarterStack', {
 
});

// another simple stack that belongs to our cdk application
const photosStack = new PhotosStack(app, 'PhotosStack');

// new PhotosHandlerStack(app, 'PhotosHandlerStack')

new PhotosHandlerStack(app, 'PhotosHandlerStack', {
    targetBucketArn: photosStack.photosBucketArn
});

const tagger = new BucketTagger('level', 'test');
cdk.Aspects.of(app).add(tagger);