// Main library exports - these are packaged in your distributable

import { Album, albumKeys, lyrics, swears } from './hip-data';

/*
album keys: string or array.  use number? both?
song keys: by track number? album plus track? string key? both?
result size
  char length
    - specific
    - min / max bound
  line length (i.e. lyric line)
  block length (i.e. a verse or chorus)
number of results
  how many times to iterate on the above

nsfw bool
surprise bool (super-random)

maybe have one() and many() method calls. allows a direct string or array result
*/

/**
 * Random integer generator
 *
 * @param {Integer} min inclusive bottom of the range
 * @param {Integer} max exclusive top of the range
 * @returns {Integer} a random integer in the range
 */
const randInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min)) + min;
};

/**
 * Returns a random integer that falls within an array bound. Array must contain an item
 */
const randIntArr = (array: Array<any>): number => {
    if (array.length === 0) {
        throw new Error('Empty array passed to randIntArr()');
    }
    return randInt(0, array.length);
};

/**
 * Returns a random item from an array. Array must contain an item
 */
const randArr = <T>(array: Array<T>): T => {
    if (array.length === 0) {
        throw new Error('Empty array passed to randArr()');
    }
    return array[randIntArr(array)];
};

/**
 * Adds a period to a line unless it has alternate ending punctuation
 */
const period = (line: string): string => {
    const otherEndings = ['!', '?'];
    if (otherEndings.includes(line.at(-1)!)) {
        return line;
    } else {
        return line + '.';
    }
};

/**
 * Returns a given number, unless that number is less than 1, in which case it will return the fallback number
 */
const numBoost = (testNum: number, fallBack: number): number => (testNum > 0 ? testNum : fallBack);

/**
 * Determines if the last char in a string matches one of the test chars
 */
const lastCharIs = (testText: string, testChars: Array<string>): boolean => {
    const lastchar = testText.at(-1);
    return testChars.some(c => lastchar === c);
};

class HipsumClass {
    /**
     * All album keys
     */
    albums(): Array<Album> {
        return albumKeys;
    }

    /**
     * Global flag for clean lyrics only.
     */
    clean: boolean = true;

    /**
     * Global default for the minimum number of lines in a paragraph.
     */
    pMinLines: number = 3;

    /**
     * Global default for the maximum number of lines in a paragraph.
     */
    pMaxLines: number = 7;

    /**
     * Generate a string consisting of a given number of song lines.
     *
     * @param {Integer} numLines How many lines to return.
     * @returns {String}
     */
    lines(numLines: number): string {
        if (numLines < 1) {
            return '';
        }

        const bucket: Array<string> = new Array(numLines);
        let counter = 0;

        while (counter < numLines) {
            const album = randArr(albumKeys);
            const albumLyrics = lyrics[album];
            const songIndex = randIntArr(albumLyrics);
            const songLyrics = albumLyrics[songIndex];
            const lineIndex = randIntArr(songLyrics);

            if (!this.clean || !swears.some(swearDef => swearDef[0] === album && swearDef[1] === songIndex && swearDef[2] === lineIndex)) {
                bucket[counter] = songLyrics[lineIndex];
                counter++;
            }
        }

        return bucket.map(l => period(l)).join(' ');
    }

    /**
     * Generates a set of paragraphs. Each paragraph will contain a number of song lines varying between the minimum and maximum line vales.
     *
     * @param {Integer} numParagraphs How many paragraphs to return.
     * @param {Integer} minLines Optional. Minimum number of song lines per paragraph.
     * @param {Integer} maxLines Optional. Maximum number of song lines per paragraph.
     * @returns {String[]}
     */
    para(numParagraphs: number, minLines: number = 0, maxLines: number = 0): Array<string> {
        if (numParagraphs < 1) {
            return [];
        }

        minLines = numBoost(minLines, numBoost(this.pMinLines, 1));
        maxLines = numBoost(maxLines, numBoost(this.pMaxLines, 2));

        if (maxLines < minLines) {
            maxLines = minLines;
        }

        const bucket: Array<string> = new Array(numParagraphs);

        for (let i = 0; i < numParagraphs; i++) {
            const pSize = randInt(minLines, maxLines + 1);
            bucket[i] = this.lines(pSize);
        }

        return bucket;
    }

    /**
     * Generates a line that is fitting for a title. Removes quotes, has a specific number of words.
     *
     * @param {Integer} numWords How many words in the title.
     * @param {Boolean} strict Optional. Will attempt to ensure the title doesn't end in a weird sentence fragment. Defaults to true.
     * @returns {String}
     */
    title(numWords: number, strict: boolean = true): string {
        if (numWords < 1) {
            return '';
        }

        /**
         * strip quotes, break into array of words
         */
        const parsedLine = () => this.lines(1).replaceAll('"', '').split(' ');

        let title = '';

        if (strict) {
            // attempt to find a line fragment that fits the length.
            let safety = 0;
            let hunting = true;
            do {
                safety++;
                if (safety > 8000) {
                    // not finding a match. revert to bad format
                    return this.title(numWords, false);
                }

                const freshLine = parsedLine();
                const freshLongth = freshLine.length;
                if (freshLongth >= numWords) {
                    if (freshLongth === numWords) {
                        // perfect fit.
                        title = freshLine.join(' ');
                        hunting = false;
                    } else {
                        // find potential fragments.
                        // either hard end to hard end, or hard end to soft end
                        const starties = [0];
                        const endies = [freshLongth - 1];

                        freshLine.forEach((wordle, wpos) => {
                            // skip last word. its always the end.
                            if (wpos < freshLongth - 1) {
                                if (lastCharIs(wordle, ['.', '!', '?'])) {
                                    // word is a "hard end" to a phrase

                                    endies.push(wpos);
                                    starties.push(wpos + 1);
                                } else if (lastCharIs(wordle, [','])) {
                                    // word is a soft end.
                                    endies.push(wpos);
                                }
                            }
                        });

                        // measure all potentials. collect ones that match desired length
                        const winners: Array<[number, number]> = [];
                        starties.forEach(startTestIdx => {
                            endies.forEach(endTestIdx => {
                                if (endTestIdx - startTestIdx + 1 === numWords) {
                                    winners.push([startTestIdx, endTestIdx]);
                                }
                            });
                        });

                        // pick a winner, if any
                        if (winners.length) {
                            const winIdx = randArr(winners);

                            title = freshLine.slice(winIdx[0], winIdx[1] + 1).join(' ');
                            hunting = false;
                        }
                    }
                }
            } while (hunting);
        } else {
            // Just assemble something of the correct length.

            let wCount = 0;

            while (wCount < numWords) {
                if (title !== '') {
                    // starting another line. Pad after the trailing punctuation
                    title += ' ';
                }

                // strip quotes, break into words
                const freshLine = parsedLine();

                // ignore short lyrics
                if (freshLine.length > 3) {
                    for (let i = 0; i < freshLine.length && wCount < numWords; i++) {
                        title += ' ' + freshLine[i];
                        wCount++;
                    }
                }
            }
        }

        if (lastCharIs(title, [',', '.'])) {
            return title.slice(0, -1);
        } else {
            return title;
        }
    }
}

const Hipsum = new HipsumClass();

export default Hipsum;
