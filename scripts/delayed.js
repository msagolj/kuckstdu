/* eslint-disable no-lonely-if */
// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './scripts.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here

/* Toc Block: Observers for highlighting what content is visible currently */
// list of all headings in the content
const headings = Array.from(document.querySelectorAll('main > div.section h2,h3,h4,h5,h6'));

// observer callback function
function observerCallBack(entries) {
  entries.forEach((entry) => {
    // get the toc entry for the heading
    const tocTarget = document.getElementById(`toc_${entry.target.id}`);
    const index = headings.indexOf(entry.target);
    // if it has become completely visible
    if (entry.isIntersecting) {
      // set the toc entry active
      tocTarget.classList.add('active');
      // if there is a previous heading and the current heading has scrolled down
      if (index > 0 && entry.target.getBoundingClientRect().top > 70) {
        // also activate the previous heading as is content is visible
        document.getElementById(`toc_${headings[index - 1].id}`).classList.add('active');
      }
    } else { // outside or intersecting
      // if intersecting at the bottom
      if (entry.target.getBoundingClientRect().top > 64) {
        // deactivate the toc entry
        tocTarget.classList.remove('active');
      } else if (index > 0) { // if intersecting at the top
        // also deactivate the previous heading but keep current heading active
        document.getElementById(`toc_${headings[index - 1].id}`).classList.remove('active');
      }
    }
  });
}
// create observer
const observer = new IntersectionObserver(observerCallBack, { root: null, threshold: 1, rootMargin: '-64px 0px 0px 0px' });

// add observers for each heading on the page
headings.forEach((h) => {
  observer.observe(h);
});
