# Tragically Hipsum

> [!WARNING]
> This is still in beta. Needs a bit more mucking about.

A javascript lorem ipsum library that generates text using song lyrics by [The Tragically Hip](https://thehip.com/).

[Demo Page](http://google.ca)

### Contents

- [Credits](#credits)
- [Notes](#notes)
- [Adding the Library to a Project](#adding-the-library-to-a-project)
- [Using the Library](#using-the-library)
- [Developer Stuff](#developer-stuff)

## Credits

- All lyrics are by The Tragically Hip, and are copyrighted.
- Special thanks to [A Museum After Dark](https://www.hipmuseum.com/) for providing the lyrics.
- Library package template based off the work of [Jason Sturges](https://github.com/jasonsturges/vite-typescript-npm-package).
- Demo Page newspaper layout by [Silke V](https://codepen.io/silkine/pen/QWBxVX).

## Notes

- Currently only has lyrics for the classic studio releases. Bonus tracks may be added later.
- Similar lyrics with minor variations may be omitted.
- Find a type-o? Feel free to log an issue.
- Some funny punctuation may appear around quoted text, typicially a period after the quote. E.g. `You just said, "Oh, wow.".`

## Adding the Library to a Project

TODO list ways to add it.  Via npm. Via cdn. Via release files.  Outline different dist types and what they do.

## Using the Library

### Sentences

This will return a string consisting of a given number of song lines (selected randomly). A song line may contain more than one sentence.

```ts
lines(numLines: number): string 
```

Example: generate sentences using two song lines.

```ts
hip.lines(2);

// "It could put the dog out of a job. Coffee-coloured ice and peeling birch bark. The sound of rushing water in the dark."
```

### Paragraphs

This will return an array of strings. Each string will contain a number of song lines (selected randomly) ranging between an upper and lower bound. If the upper or lower bounds are not provided (or set to 0), the global setting will be used (3 and 7 by default). See the `Options` section for changing the global upper and lower bounds.

```ts
para(numParagraphs: number, minLines: number = 0, maxLines: number = 0): Array<string> 
```

Example: generate two paragraphs ranging between 1 and 4 song lines.

```ts
hip.para(2, 1, 4);

// [ "The Golden Rim Motor Inn. Soft water and colour TV. I'll be the antlers and I'll be the elk.",
//   "You're a complex dune, I'm a cloud of octopus ink. Want to be your roaring floorboard. The curtain climbs over me every morning." ]
```

### Titles

This will return a string of a given number of words. It will attempt to have the words read as a coherent unit and not stop mid-sentence. As an example, a three word result could give `I don't understand`, but will try to avoid `I am the`. Setting the `strict` parameter to `false` will allow mid-sentence fragments; this will result in a more performant method call.

```ts
title(numWords: number, strict: boolean = true): string 
```

Example: generate a five word title, and avoid sentence fragments.

```ts
hip.title(5);

// "Sharks don't attack the Irish"
```

### Options

To allow lyrics that contain filthy cuss-words, set the `clean` option to `false`.

```ts
hip.clean = false;
hip.lines(1);

// "When you said don't wipe your asses with your sleeve."
```

To change the system default value for minimum and/or maximum lines in paragraph calls, set the `pMinLines` and `pMaxLines` options. This can save you from having to provide the same numbers as parameters on every call to `para()`.

```ts
hip.pMinLines = 5;
hip.pMaxLines = 12;
hip.para(3); // this is now the equivalent of .para(3, 5, 12)
```



## Developer Stuff

The following tasks are available:

- `npm run build` - Build production distributable (JS + types)
- `npm run dev` - Watch mode to detect changes (rebuilds dist/ and types)
- `npm start` - Vite dev server with HMR for local development
- `npm run build:types` - Build only TypeScript declarations

### Output Formats

This template builds multiple distribution formats:

- **ESM** (`dist/index.es.js`) - Modern ES modules
- **CommonJS** (`dist/index.cjs.js`) - Node.js compatibility
- **UMD** (`dist/index.umd.js`) - Universal module definition
- **IIFE** (`dist/index.iife.js`) - Browser global variable
- **Types** (`dist/index.d.ts`) - Bundled TypeScript declaration file

