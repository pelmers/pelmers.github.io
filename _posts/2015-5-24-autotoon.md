---
layout: post
title: Edge detection and drawing
---
<script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=default"></script>

This post will serve as a walkthrough of a couple of edge detection methods and
an outline of an implementation in Javascript (see
[demo](http://pelmers.github.io/autotoon/)).

### Basics
Consider an image $$m$$ pixels high by $$n$$ pixels wide. For our purposes, we
will map the image to grayscale values in the range [0, 255] and represent this
data as a matrix $$M$$. Now let's consider how to do a relatively simple
operation such as blurring the image. Intuitively, blurring a pixel means
smearing its neighbors on top of it; mathematically this amounts to taking a
weighted average of the pixel and its neighbors. This leads us to the idea of a
two-dimensional discrete **[matrix
convolution](http://en.wikipedia.org/wiki/Kernel_%28image_processing%29#Convolution)**,
a form of mathematical convolution where two functions are combined to produce
a third function.

The matrix convolution process takes an input matrix and a kernel matrix and
produces an output matrix that applies the kernel to each entry in the input by
computing a weighted sum (where weights are defined by the kernel) of the
entry's neighborhood as the new value for the entry in the output matrix. For
example, to blur an image, we may apply convolution with the kernel
$$\frac{1}{9}\begin{bmatrix}
1 & 1 & 1 \\
1 & 1 & 1 \\
1 & 1 & 1
\end{bmatrix}$$.
This kernel will map each entry to the average of its immediate neighbors,
effectively blurring the image, a method called a [box
blur](http://en.wikipedia.org/wiki/Box_blur). We normalize the kernel by
dividing by 9 to make sure that the output has the same relative magnitude as
the input (i.e. the picture does not become brighter or darker).

Here we delve into the details behind the process. Consider following along
with a [sample
image](http://pelmers.github.io/autotoon/demo/demo.html?src=http://images.nationalgeographic.com/wpf/media-live/photos/000/899/cache/boy-courtyard-playing_89920_990x742.jpg)

### [Sobel Operator](https://github.com/pelmers/autotoon/blob/7b01066e8b4a92c3ae7c9b34c8adc6899b9fbae3/filters.js#L77-L96)
The star of the show in this section is the [Sobel
operator](http://en.wikipedia.org/wiki/Sobel_operator), which is defined as a
pair of convolution kernels that estimate the image's horizontal and vertical
gradients. The kernel for horizontal gradient, $$G_x$$ is defined
$$\begin{bmatrix}
-1 & 0 & 1 \\
-2 & 0 & 2 \\
-1 & 0 & 1
\end{bmatrix}$$.
Note that the entries on the left side are negative, and the entries on the
right are positive, so when we apply this operator to an entry, we are finding
the _difference_ between its left and right neighborhood, which is the
definition of the horizontal gradient. Of course, this approach is only an
approximation: we are attempting to construct a continuous gradient of a
discrete function (the pixel values). We construct an analogous matrix $$G_y$$
to estimate the vertical gradient.

Now we apply matrix convolution to $$M$$ with both $$G_x$$ and $$G_y$$ to
produce $$C_x$$ and $$C_y$$. Since we have gradient values in the horizontal
and vertical direction, we can find the overall direction of the gradient at
each point. We encode these directions as angles, and we compute
$$G_{ij} = \arctan\frac{C_{y_{ij}}}{C_{x_{ij}}}$$,
so each entry in $$G$$ is the angle of the gradient in radians. By adding
together the absolute values of $$C_x$$ and $$C_y$$ we arrive at $$C$$, a
matrix that holds the magnitude of the gradient at each point. We return these
$$G$$ and $$C$$ as the results of applying the Sobel operator.

### [Nonmaximum suppression](https://github.com/pelmers/autotoon/blob/7b01066e8b4a92c3ae7c9b34c8adc6899b9fbae3/filters.js#L111-L128)
If we only apply the Sobel operator, we may find that the edges are not very
fine; we would prefer our edges to be as precise as possible. Nonmaximum
suppression is a technique to thin edges by suppressing pixels which are not
maximal on the edge gradient. Recall the direction of the gradient $$G$$
produced by the Sobel operator corresponds to the direction of greatest change
in pixel value. Remark that this fact implies that it is directed *across*
edges, and that therefore the actual edge direction should be *orthogonal* to
the gradient's orientation.

Armed with this observation, we find it simple to explain the process of
nonmaximum suppression. We visit each entry and decide whether its magnitude is
greater than its two neighbors in the direction of the gradient. If not, we
suppress the entry by setting its value to 0. Because the entry has only eight
neighbors, we can
[interpolate](https://github.com/pelmers/autotoon/blob/7b01066e8b4a92c3ae7c9b34c8adc6899b9fbae3/filters.js#L38-L75)
between neighbors in the gradient direction to obtain a more precise
comparison. Now let $$S$$ be the suppressed matrix.

### [Hysteresis](https://github.com/pelmers/autotoon/blob/7b01066e8b4a92c3ae7c9b34c8adc6899b9fbae3/filters.js#L160-L197)
What follows is a procedure called
[hysteresis](http://en.wikipedia.org/wiki/Canny_edge_detector#Edge_Tracking_by_Hysteresis)
where the results are refined by only allowing what we consider ''real'' edges
and suppressing the rest. As input, the hysteresis function takes an image
matrix and two threshold values $$h$$ and $$l$$, both in the range [0, 255],
where $$h$$ is consider the high threshold and $$l$$ is the low threshold.
Supplied with these inputs, hysteresis visits every pixel and decides whether
to keep it based on a couple of criteria:
1. If the value of the pixel is greater than $$h$$, then it is real and we keep it.
2. If the value of the pixel is greater than $$l$$ and it is connected to a
   real pixel along a path of pixels where each has value greater than $$l$$,
   then we mark it as real and keep it.

To implement these criteria we can iterate over the matrix, and at each pixel
greater than $$h$$, we perform a recursive search along all neighbors greater
than $$l$$, marking all visited pixels as real along the way. At the end of
traversal, we have our set of real pixels and can suppress the rest to obtain
the final output.

### [Canny method](http://en.wikipedia.org/wiki/Canny_edge_detector)
Well, this section will be brief. The Canny method simply applies these steps in order.

1. Gaussian blur
2. Sobel operator
3. Nonmaximum suppression
4. Hysteresis

On the demo page, the `Automate process` button executes precisely this process.
