# TSS2STSS

Converts TSS (Titanium Style Sheets) to STSS (Sassy Titanium Style Sheets). That's all it does.

## How to use this tool
You can run it from the command line. The current version has two parameters: input and output.

```
tss2stss index.tss index.stss
```

Or convert whole projects at once:
```
tss2stss app/styles app/styles/stss
```

You can also incorporate this into your own project:
```
var tss2stss = require('tss2stss');
```

## Changelog

### v0.3.0 - 16-06-2015
* Improved support for more complex selectors - by @xavierlacot

### v0.2.0 - 24-10-2014
* Shorthand notations like `left` instead of `Ti.UI.TEXT_ALIGNMENT_LEFT` are now optimised in the compiler
* A simple testsuite has been added

### v0.1.0 - 21-10-2014
* Initial release of this tool

## Contributing
Any help with development is welcome. Please take a look at the issues list if you want to work on something, or discuss
a new feature.

### Running the tests
Currently the TSS to STSS conversion is tested using a Ti Alloy app that compiles the TSS files in the
`tests/tss2stss-test-app/tss-fixtures` directory into STSS files in the `tests/tss2stss-test-app/app/styles` directory.
After that a ti build is triggered and the stss hook compiles the STSS back to TSS, which are then validated by the
ti build. If any errors occur during this process, you will see this in the console.

You can run these tests by executing the `runtest.sh` file in the app's directory.
