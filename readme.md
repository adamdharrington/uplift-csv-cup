# Uplift CUP (CSV Upload Program)

This app is designed to process csv files from Paypal or Stripe.
It will produce a number of output csv files properly processed for upload to Engaging Networks.
The plan is to wrap it into an electron app so anyone in the company can easily complete the upload process.

## Getting data

For Paypal you can [download from here](https://history.paypal.com/cgi-bin/webscr?cmd=_history-download).
Just make sure you select all transactions in the period since the last upload... If you don't know when that is, you 
need to check or you will end up with duplicates.

For Stripe you should go to [all payments on the dashboard](https://dashboard.stripe.com/payments) and set the filters
to the correct period. Once again, if you're unsure on the period, find out before processing or you will cause 
duplication.

## Using the app

At the moment you need to use the commandline. This will be ported to an Electron app soon so it can be used on any
computer.

## Uploading output

I don't think uploading is within scope of this app, although it wouldn't be much of an extra step to incorporate 
a EN transactional import step.

## Rights

This app was created for Uplift by Adam Harrington. All rights reserved by [Uplift](https://uplift.ie). 