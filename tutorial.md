# Deciding which release you need

OCP version vs SDK Version
4.16.x @openshift-console/dynamic-plugin-sdk Latest
@openshift-console/dynamic-plugin-sdk-webpack Latest
4.15.x @openshift-console/dynamic-plugin-sdk 1.0.0
@openshift-console/dynamic-plugin-sdk-webpack 1.0.0
4.14.x @openshift-console/dynamic-plugin-sdk 0.0.21
@openshift-console/dynamic-plugin-sdk-webpack 0.0.11
4.13.x @openshift-console/dynamic-plugin-sdk 0.0.19
@openshift-console/dynamic-plugin-sdk-webpack 0.0.9
4.12.x @openshift-console/dynamic-plugin-sdk 0.0.18
@openshift-console/dynamic-plugin-sdk-webpack 0.0.9

The branches in this repo are linked to that version.

Here I decided to use 4.14 which is the version of my cluster.

git clone <repository-url>
cd <repository-directory>

I decided to move a release code into main as of this writing main was for ocp 4.16.x which i can't provision anyway.

git fetch --all
git checkout release-4.14
git checkout -b new-main-from-4.14
git checkout main
git reset --hard release-4.14

git push origin main --force

The above made 4.14 code in main.

# Before we continue some reference material

https://www.npmjs.com/package/@openshift-console/dynamic-plugin-sdk

Should read this before continuing lots of similar steps at the beginning

https://www.redhat.com/en/blog/developing-an-openshift-dynamic-console-plugin-1
