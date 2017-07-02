![Banner](https://raw.githubusercontent.com/btlorch/alternative-captioning-firefox-addon/master/banner.png)

# Alternative Captioning
Fills empty image alternative tags with life to make screen reading great again for visually impaired people.

Note that this addon was developed at Neue Nähe Hackathon 2.0 Erlangen as a proof of concept for experimental use.
# Temporary installation
To query the [Computer Vision API](https://azure.microsoft.com/en-us/services/cognitive-services/computer-vision/), a subscription key is required. Head over to the Azure website to obtain your subscription key. Once you got your key, follow these steps:
* Clone this repository to your local hard drive.
* Open <about:debugging>, click the `Load Temporary Add-on` button and select `manifest.json` from the cloned repository.
* Open menu, click `Add-ons`. Now you should see the Alternative Captioning add-on alongside a list of all installed add-ons. Click the options button of the Alternative Captioning add-on, insert your subscription key, and click the `save` button.
* (Re-)Load some website and check some image's alt tag.
* In the temporary installation, the add-on is uninstalled automatically as soon as you close the browser.

# Troubleshooting
* Watch the console for any error messages.

# Room for improvement
* Monitor changes to the DOM
* Cache image captions locally
* Set up proxy server as client interface to request image captions. Having its own subscription to the computer vision API, the proxy server would make having individual subscriptions for each client obsolete.
* Smart review of existing alternative tags, only querying a caption for those images without any or with only a meaningless alt tag.