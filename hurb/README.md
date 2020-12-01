## Git history
This forks previous developent history is in the my [code challenge repos branch](https://github.com/ozzono/code-challenge/tree/hurb-challenge/hurb)

## Known Issues
- This code depends of the used api endpoints to work properly, so this test automatically inherit its dependencies limitations. The most problematic limitation is described below.
- Unable to stress test: Although the `currconv` api enpoint works perfectly for few requests with an acceptable interval between them, it's far from allowing any kind of stress test and it even probably blocked my ip and surelly will be an obstacle for any currency conversion here on.
    - Right now the code has a valid default api key. If a new one is needed, follow the steps below.
    - I added a roundabout to get a fresh key from [currconv api key page](https://free.currencyconverterapi.com/free-api-key) for challenge validation; To do so, follow the steps below:
        - Once the [currconv api key page](https://free.currencyconverterapi.com/free-api-key) loaded, insert a valid email on the input; (create a [fake email here](https://emailfake.com/))
        - In the email, open the `Click here to verify` link;
        - Within the email, copy the key sampled as:
            - `Here's your free API key: <20characterkeyhere>`
        - When editing the url for challenge test, add the argument _&key=\<keystringyoujustgot\>_
    - Done as suggested, there should be no issues, at least for single requests.
    - I coded the stress test and kept it in the internal test file but limited to a single request.

## MongoDB setup and http-handler setup
Run `setup/setup` to boot start the challenge settings. This command starts the local server for the challenge after clearing the MongoDB database and refilling it with default data.