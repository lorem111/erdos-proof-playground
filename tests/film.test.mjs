import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const source = readFileSync(new URL('../lib/source/Erdos728b.lean', import.meta.url), 'utf8').split('\n');
for (const folder of ['movie', 'movie/quick']) {
  const movie = JSON.parse(readFileSync(new URL(`../public/${folder}/chapters.json`, import.meta.url), 'utf8'));
  const captions = readFileSync(new URL(`../public/${folder}/captions.vtt`, import.meta.url), 'utf8');
  test(`${folder}: film code references point to the checked Lean source`, () => {
    for (const chapter of movie.chapters) assert.ok(source[chapter.line - 1].includes(chapter.code.replace('...', '').trim()), `Wrong source reference: ${chapter.title}`);
  });
  test(`${folder}: narration, animation cues and captions share one continuous timeline`, () => {
    assert.equal(movie.chapters[0].start, 0);
    movie.chapters.forEach((chapter, i) => {
      assert.ok(chapter.end > chapter.start);
      if (i) assert.equal(chapter.start, movie.chapters[i - 1].end);
      assert.equal(chapter.cues.length, chapter.sentences.length);
      assert.equal(chapter.cues[0].start, chapter.start);
      assert.equal(chapter.cues.at(-1).end, chapter.end);
      chapter.cues.forEach((cue, j) => {
        assert.equal(cue.text, chapter.sentences[j]); assert.ok(captions.includes(cue.text));
        assert.ok(cue.end > cue.start); if (j) assert.equal(cue.start, chapter.cues[j - 1].end);
      });
    });
    assert.equal(movie.chapters.at(-1).end, movie.duration);
    assert.equal((captions.match(/ --> /g) ?? []).length, movie.chapters.flatMap(chapter => chapter.sentences).length);
  });
}
