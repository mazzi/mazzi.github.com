---
layout: page
title: Archive
---

If you are tired of pagination, you can find here all the posts on this blog.

<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>