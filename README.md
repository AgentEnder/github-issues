# Issue Description

Outputs that contain glob patterns are significantly slower when there are a large amount of files in the directory.

Link: https://github.com/nrwl/nx/issues/11176

## Steps to reproduce

Run `npm run benchmark` and observe the results

## Details

The benchmark runs each of the following commands multiple times and outputs the total time time it took to run each command.

- nx longTask
- nx shortTask

`shortTask` and `longTask` are the same task, but `longTask` has a glob pattern in the output.

## Results

```
longTask: 16.521s
shortTask: 4.485s
```
