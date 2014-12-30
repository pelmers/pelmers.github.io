---
layout: post
title: Making a checklist app for Android
---

### The idea

"I'll remember that," you tell yourself as your friend tells you his birthday,
or your professor makes note of a theorem that will be on the final exam.
Possibly it's just me, but nine out of ten times I tell myself that I won't
forget something, I will not be able to recall it within a week.

And when I realize that I forget something, I'll tell myself that next time
something I want to remember happens, I will write it down. The problem? I'll
forget my forgetting. Indeed, I think that the main reason forgetfulness is
such a difficult yet universal problem is that **we simply forget the
experience of forgetting.**

So I decided to write a phone app to help me with remember the things I want to
remember. But more on that later. Since I hadn't written any substantial app
before, I decided to start with something basic to understand the process: a
[simple todo app.](https://github.com/pelmers/SimpleTodo)

### Getting started
Recently Google has stopped actively developing the Eclipse ADT, deciding that
[Android Studio](http://developer.android.com/sdk/index.html) is the way to go.
After downloading and installing the package (via the
[AUR](https://aur.archlinux.org/packages/android-studio/) for example), you're
ready to roll. To make a simple checklist todo app, we'll need just a couple of
components to handle different parts of the application:

1. An interface for adding, modifying, and marking items on a particular list.
2. A way to switch from one list to another, or to create a new list.

For this particular example, we'll use a navigation bar to implement the second
functionality, and a regular old
[ListView](http://developer.android.com/reference/android/widget/ListView.html)
to do the first.

Conveniently, Android Studio will do half the work for us if we select to
create a new project with a Navigation Drawer Activity: ![Add an activity to
Mobile](/images/android_todo/create_project.png)
Now, right off the bat, we can run the application on a connected Android
device or emulator. Here's how that looks on my Android 4.4 Moto X. (you can
browse the code
[here](https://github.com/pelmers/SimpleTodo/tree/20f11fa748edde1f5522038cfce5a9b908b97eff)).
<img src="/images/android_todo/running_initial_commit.png" width="35%">
As you can see, a simple structure has been given to us, and all we have to do
is fill out the functionality. First, we'll add a ListView to the main
fragment's layout (`fragment_main_todo.xml`) using the design window in the
IDE: ![Adding ListView](/images/android_todo/adding_listview.png)

### Digression: Activities vs. Fragments
You may be wondering what a _fragment_ layout is, and how it's different from
an activity. If you're not wondering or already know, feel free to skip to the
next part.

An activity was originally, at a high level, a single screen in an application,
meaning that one activity can have focus at a time. However, as tablets entered
the market and more people began using them, Android developers realized that
this idea of discrete activities was restricting. Something that would best
take two screens on a phone may make better use of a tablet by showing them
side by side. The typical example is a news reader, with a list of articles and
a view for the selected article.

This issue is what fragments address.
[Fragments](developer.android.com/guide/components/fragments.html) represent
not an entire screen, but a single behavior in an application. Activities
manage fragments, and fragments can be reused across different activities. For
example, if you set up a pull-out navigation bar as a fragment, all the
activities in your application can easily add it.

### Adapters and Lists

ListViews are very complicated widgets (watch [World of
ListView](http://www.youtube.com/watch?v=wDBM6wVEO70)). They are best at
displaying large amounts of repetitive data. To turn data into Views that can
be displayed, they can take an
[Adapter](http://developer.android.com/reference/android/widget/Adapter.html).
Why call it an adapter? These things _adapt_ a potentially very large set of
data to a small number of views that can be displayed at once on the screen.
ListView is kind enough to handle most of the details, such as measuring views
to fit the screen and recycling views to keep the UI snappy. All we have to do
to make an Adapter is to implement the `getView` method. To keep things simple,
we'll store the todo items in a List and subclass the built-in
[ArrayAdapter](http://developer.android.com/reference/android/widget/ArrayAdapter.html),
which turns an array or list of objects into
[TextView](http://developer.android.com/reference/android/widget/TextView.html)
widgets. We'll still be using TextViews as well, but our items each have two
states: completed and incomplete, which we'll want to reflect in the views.
Here's the code:
{% highlight java %}
public TodoAdapter(Context activity, int layout_id, int text_id, List<TodoItem> todoItems) {
    super(activity, layout_id, text_id, todoItems);
}
@Override
public View getView(int position, View convertView, ViewGroup parent) {
    TextView view = (TextView) super.getView(position, convertView, parent);
    if (getItem(position).isCompleted())
        markComplete(view);
    else
        markIncomplete(view);
    return view;
}
{% endhighlight %}
Nice and simple. Note that `TodoItem` is simply a wrapper for `Tuple<String,
Boolean>` to indicate the item's name and completion status. `markComplete` and
`markIncomplete` are small methods that make changes to the style of the passed
in View to distinguish their status.

Here's the final app: <img src="/images/android_todo/final_running.png" width="35%">

The code's on [Github](https://github.com/pelmers/SimpleTodo), feel free to
look at it and take anything that's useful. I might post a follow-up that goes
into other details, such as the lifecycle graph.

### Recommended reading/viewing
- [Make your Android UI Fast and Efficient](http://www.youtube.com/watch?v=N6YdwzAvwOA)
- [World of ListView](http://www.youtube.com/watch?v=wDBM6wVEO70)
