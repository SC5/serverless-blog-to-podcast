# Amazon Polly - Blog to Podcast

## Architecture

![architecture](https://raw.githubusercontent.com/SC5/serverless-blog-to-podcast/master/images/architecture.png)

## Installation

With Serverless 1.5 and later use

```
sls install -u https://github.com/SC5/serverless-blog-to-podcast -n my-podcast-service
cd my-podcast-service
npm install
```

## Deployment

Amazon Polly is available in following regions: us-east-1, us-east-2, us-west-2, and eu-west-1.

```
sls deploy --region us-east-1
```

## Structure

`aggregate/aggregate.js` contains the logic which RSS feed is used in service. It loads the feed and saves entries as json files into S3 bucket. It also writes the podcast rss.xml for feed subscription.

`convert/convert.js` is triggered by S3 object create events and it sends text saved in blog bucket to Amazon Polly. The mp3 file which Polly returns is then saved to podcast bucket.
