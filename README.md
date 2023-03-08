# Issue Statement

Babel envKey is not set to configuration name. This was the previous behavior in version 15.x sometime before 15.7. I'm not 100% sure when the issue started, as this is a reproduction based on a report from someone else.

## Repro steps

Run `nx serve react-app --configuration production`. Note the output is "Hello test-plugin".

Run `BABEL_ENV=production nx serve react-app`. Note the output is "Hello prod-plugin"