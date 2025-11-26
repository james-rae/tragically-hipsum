// this drives the testing page. It is not part of the library.

import Hipsum from './index';

const titleTest = document.getElementById('ttest') as HTMLParagraphElement;
titleTest.innerHTML = Hipsum.title(4);

const lineTest = document.getElementById('ltest') as HTMLParagraphElement;
lineTest.innerHTML = Hipsum.lines(2);

const paraTest = document.getElementById('ptest') as HTMLParagraphElement;
paraTest.innerHTML = Hipsum.para(1, 3, 5)[0];

const keysTest = document.getElementById('ktest') as HTMLParagraphElement;
keysTest.innerHTML = Hipsum.albums().join(' ');
