#!/bin/bash

../../bin/tss2stss tss-fixtures app/styles
ti build -p ios --build-only --log-level error 2>&1 >/dev/null
