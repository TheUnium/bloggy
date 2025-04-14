<pre>
 ____  __    _____  ___   ___  _  _
(  _ \(  )  (  _  )/ __) / __)( \/ )
 ) _ < )(__  )(_)(( (_-.( (_-. \  /
(____/(____)(_____)\___/ \___/ (__)
</pre>

- [how do i use this thing](#how-do-i-use-this-thing)
   * [how to write the frontmatter](#how-to-write-the-frontmatter)
- [what does it actually do?](#what-does-it-actually-do)
- [template stuff (aka theming)](#template-stuff-aka-theming)
- [how do i install it](#how-do-i-install-it)
- [the config file](#the-config-file)
- [RAQ (rarely asked questions)](#raq-rarely-asked-questions)

bloggy is a little markdown -> html converter.
it turns your `.md` files into little blog posts while also validating your markdown, making sure it isn't borked.

---

## how do i use this thing

1. write a markdown file with some frontmatter at the top
2. run `bloggy [file].md`
3. and boom, it spits out a shiny `.html` file in your output folder

---

### how to write the frontmatter

**like this :**
```md
---
title: hello world!
description: this is the best post you will ever read
color: #72d572
---

here is my post!!! i wrote things!! isnt this so cool!

- and yes
- it supports lists

> and other markdown stuff

`(most of the time)`
```

just slap some `---` around the metadata and give it:
- a `title`
- a `description`
- a `color`

then the rest is just your blog content.

---

## what does it actually do?

behind the scenes it does this:
- reads your markdown file
- extracts the frontmatter at the top
- *validates* your markdown (spits out warns and errors, still makes the html file though)
- parses it with `marked`
- injects it into a template you provide
- replaces tags like `<!-- [BLOGGY::TITLE] -->` in the template with the actual data
- saves the final HTML into the output folder

---

## template stuff (aka theming)

you provide a `template.html` and bloggy will lovingly fill in the blanks for you.
it looks for these magic placeholder tags:

| tag                        | what it does |
|---------------------------|--------------|
| `<!-- [BLOGGY::TITLE] -->`       | gets replaced with the post's title |
| `<!-- [BLOGGY::DESCRIPTION] -->` | the posts description, most useful for seo tags |
| `<!-- [BLOGGY::COLOR] -->`       | the post's accent color (you can use it as the page's theme-color for seo as well) |
| `<!-- [BLOGGY::CONTENT] -->`     | this is where the html-ified markdown goes |
| `<!-- [BLOGGY::DATE] -->` | gets replaced by the current date |
| `<!-- [BLOGGY::TIME] -->` | gets replaced by the current time |

> tip: use the color to theme your post dynamically!

---

## how do i install it

you can clone this repo:

```shell
git clone https://github.com/TheUnium/bloggy.git
```

then simple link it :

```shell
npm link
```

orrr..... you can build it yourself, using [bun](https://bun.sh/):

```shell
bun run build
```

after either method, you can just run it:

```bash
bloggy --init my-blog
```

<details>

<summary>npm method</summary>

it's pretty simple:

```bash
npm install -g bloggy-md
```

then just run:

```bash
bloggy --init my-blog
```

after which you can start writing markdown!
</details>

---

## the config file

bloggy will look for a `config.yaml` for custom settings, here is the default one that is generated with the init flag :
```yaml
post:
  title: "Unnamed Post"
  description: "No description provided... so sad... ⏳⏳⏳"
  color: "#72d572"

paths:
  template: "path/to/template.html"
  output_dir: "path/to/dist/folder"

rules:
  allowRawHtml: false
  maxParagraphLength: 500
  requireImageAlts: true
  allowConsecutiveHeaders: false
  maxHeaderDepth: 4
  requireListSpacing: true
  requireTableSeparators: true

validation:
  enabled: true
  errors: true
  warns: true
```
completely optional. bloggy has defaults, but you can override them here if you're feeling fancy.

---

## RAQ (rarely asked questions)

**Q: why does this exist?**\
A: i wanted to make a blog from my [site](https://unium.in/) and was too lazy to setup a static site generator

**Q: can it make me a sandwich?**\
A: sometimes. depends on your template i guess?

**Q: can i make a blog with this?**\
A: yes, up to you though. it would be better if you use a more well known static site generator, but this might be fun to tinker with :)

---

## attribution

bloggy was created by [unium](https://unium.in/) and is under the MIT license. if you fork, modify, or use this project as the basis for your own work, please include a visible credit to the original author :D

example attribution:
> Based on [bloggy](https://github.com/TheUnium/bloggy) by [unium](https://unium.in/).