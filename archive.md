---
layout: page
title: From time to time I write on this site. Not very often.
---

I used to write some posts (remember blogs?). Took me some time, so I decided to keep them here instead of deleting.

You can find some technical posts, and lately some posts about soft skills.

<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>


You can also add to your [atom feed](/atom.xml).
