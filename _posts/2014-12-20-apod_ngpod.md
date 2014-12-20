---
layout: post
title: apodjs and ngpodjs
---

[NASA's Astronomy Picture of the Day
(APOD)](http://apod.nasa.gov/apod/astropix.html) and [National Geographic's
Photo of the
Day](http://photography.nationalgeographic.com/photography/photo-of-the-day/)
each provide a stunning photo each day. I present a couple of
[node.js](http://nodejs.org/) scripts to interface with these sites,
[apodjs](https://www.npmjs.com/package/apodjs) and
[ngpodjs](https://www.npmjs.com/package/ngpodjs), to make it easy to find or
download pictures from these sources. I personally use these tools to set my
wallpaper background each day to something different, and I'd like to share
them in case anyone else is looking for something similar. `apodjs` is slightly
more featureful, providing access to the entire APOD catalog since [June 16,
1995](http://apod.nasa.gov/apod/ap950616.html), and allowing display of picture
explanations. National Geographic does not appear to provide simple access to
past pictures, so `ngpodjs` is limited to the picture of today. Otherwise,
these programs share the same simple interface.

### What I do
In my `openbox/autostart` file, I keep the following line:

```
ngpodjs --download=$HOME/Desktop/ | xargs nitrogen --set-zoom-fill &
```

Each time I log in to my computer, the script will check the National
Geographic Photo of the Day. If there's a new picture, it will download that to
my Desktop folder and print out the full path to its location, which I send
along to [nitrogen](http://projects.l3ib.org/nitrogen/) to set my desktop
background (however this method would work with any program that can set the
desktop background).

When I want something different, I have an alias stored which will set the
desktop to a random APOD from this decade:

```
alias nasa-desktop="apodjs --type random --date=020101 --download=$HOME/Desktop/ | xargs nitrogen --set-zoom-fill"
```

