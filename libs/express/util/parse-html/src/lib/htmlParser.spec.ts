import { range } from 'lodash';

import { parsePuzzle, parseStarCounts } from './htmlParser';

const starCounts = [2, 2, 1, 0, 1].concat(Array<number>(20).fill(0));

const calendarPage = `
<!DOCTYPE html>
<html>
  <head />
  <body>
    ${range(1, 26)
      .map(
        (day: number) =>
          `<a class="calendar-day${day}${
            starCounts[day - 1] > 0 ? ` calendar-${starCounts[day - 1] == 2 ? 'very' : ''}complete` : ''
          }">_</a>`,
      )
      .join('\n')}
  </body>
</html> 
`;

describe('star count parser', () => {
  it('should work', () => {
    expect(parseStarCounts(calendarPage)).toMatchObject(starCounts);
  });
});

const getPuzzleHtml = () => puzzleHtml;

describe('puzzle parser', () => {
  it('should work', () => {
    expect(parsePuzzle(getPuzzleHtml(), { year: 2022, day: 21 })).toBeTruthy();
  });
});

const puzzleHtml = `
<!DOCTYPE html>
<html lang="en-us">
  <head>
    <meta charset="utf-8" />
    <title>Day 21 - Advent of Code 2022</title>
    <link rel="stylesheet" type="text/css" href="/static/style.css?31" />
    <link rel="stylesheet alternate" type="text/css" href="/static/highcontrast.css?1" title="High Contrast" />
    <link rel="shortcut icon" href="/favicon.png" />
    <script>
      window.addEventListener('click', function (e, s, r) {
        if (e.target.nodeName === 'CODE' && e.detail === 3) {
          s = window.getSelection();
          s.removeAllRanges();
          r = document.createRange();
          r.selectNodeContents(e.target);
          s.addRange(r);
        }
      });
    </script>
  </head>
  <body>
    <header>
      <div>
        <h1 class="title-global"><a href="/">Advent of Code</a></h1>
        <nav>
          <ul>
            <li><a href="/2022/about">[About]</a></li>
            <li><a href="/2022/events">[Events]</a></li>
            <li><a href="https://teespring.com/stores/advent-of-code" target="_blank">[Shop]</a></li>
            <li><a href="/2022/settings">[Settings]</a></li>
            <li><a href="/2022/auth/logout">[Log Out]</a></li>
          </ul>
        </nav>
        <div class="user">username <span class="star-count">50*</span></div>
      </div>
      <div>
        <h1 class="title-event">
          &nbsp;&nbsp;&nbsp;<span class="title-event-wrap">&lt;y&gt;</span><a href="/2022">2022</a
          ><span class="title-event-wrap">&lt;/y&gt;</span>
        </h1>
        <nav>
          <ul>
            <li><a href="/2022">[Calendar]</a></li>
            <li><a href="/2022/support">[AoC++]</a></li>
            <li><a href="/2022/sponsors">[Sponsors]</a></li>
            <li><a href="/2022/leaderboard">[Leaderboard]</a></li>
            <li><a href="/2022/stats">[Stats]</a></li>
          </ul>
        </nav>
      </div>
    </header>

    <div id="sidebar">
      <div id="sponsor">
        <div class="quiet">Our <a href="/2022/sponsors">sponsors</a> help make Advent of Code possible:</div>
        <div class="sponsor">
          <a
            href="https://jobs.teradyne.com/?utm_source=adventofcode&amp;utm_medium=ad&amp;utm_campaign=2022"
            target="_blank"
            onclick="if(ga)ga('send','event','sponsor','sidebar',this.href);"
            rel="noopener"
            >Teradyne</a
          >
          - Do you like coding algorithms where milliseconds matter? What about nanoseconds?
        </div>
      </div>
    </div>
    <!--/sidebar-->

    <main>
      <style>
        article *[title] {
          border-bottom: 1px dotted #ffff66;
        }
      </style>
      <article class="day-desc">
        <h2>--- Day 21: Monkey Math ---</h2>
        <p>
          The <a href="11">monkeys</a> are back! You're worried they're going to try to steal your stuff again, but it seems like they're
          just holding their ground and making various monkey noises at you.
        </p>
        <p>
          Eventually, one of the elephants realizes you don't speak monkey and comes over to interpret. As it turns out, they overheard you
          talking about trying to find the grove; they can show you a shortcut if you answer their <em>riddle</em>.
        </p>
        <p>
          Each monkey is given a <em>job</em>: either to <em>yell a specific number</em> or to <em>yell the result of a math operation</em>.
          All of the number-yelling monkeys know their number from the start; however, the math operation monkeys need to wait for two other
          monkeys to yell a number, and those two other monkeys might <em>also</em> be waiting on other monkeys.
        </p>
        <p>
          Your job is to <em>work out the number the monkey named <code>root</code> will yell</em> before the monkeys figure it out
          themselves.
        </p>
        <p>For example:</p>
        <pre><code>root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32
</code></pre>
        <p>Each line contains the name of a monkey, a colon, and then the job of that monkey:</p>
        <ul>
          <li>A lone number means the monkey's job is simply to yell that number.</li>
          <li>
            A job like <code>aaaa + bbbb</code> means the monkey waits for monkeys <code>aaaa</code> and <code>bbbb</code> to yell each of
            their numbers; the monkey then yells the sum of those two numbers.
          </li>
          <li><code>aaaa - bbbb</code> means the monkey yells <code>aaaa</code>'s number minus <code>bbbb</code>'s number.</li>
          <li>Job <code>aaaa * bbbb</code> will yell <code>aaaa</code>'s number multiplied by <code>bbbb</code>'s number.</li>
          <li>Job <code>aaaa / bbbb</code> will yell <code>aaaa</code>'s number divided by <code>bbbb</code>'s number.</li>
        </ul>
        <p>
          So, in the above example, monkey <code>drzm</code> has to wait for monkeys <code>hmdt</code> and <code>zczc</code> to yell their
          numbers. Fortunately, both <code>hmdt</code> and <code>zczc</code> have jobs that involve simply yelling a single number, so they
          do this immediately: <code>32</code> and <code>2</code>. Monkey <code>drzm</code> can then yell its number by finding
          <code>32</code> minus <code>2</code>: <code><em>30</em></code
          >.
        </p>
        <p>
          Then, monkey <code>sjmn</code> has one of its numbers (<code>30</code>, from monkey <code>drzm</code>), and already has its other
          number, <code>5</code>, from <code>dbpl</code>. This allows it to yell its own number by finding <code>30</code> multiplied by
          <code>5</code>: <code><em>150</em></code
          >.
        </p>
        <p>
          This process continues until <code>root</code> yells a number: <code><em>152</em></code
          >.
        </p>
        <p>
          However, your actual situation involves
          <span title="Advent of Code 2022: Now With Considerably More Monkeys">considerably more monkeys</span>.
          <em>What number will the monkey named <code>root</code> yell?</em>
        </p>
      </article>
      <p>Your puzzle answer was <code>49288254556480</code>.</p>
      <article class="day-desc">
        <h2 id="part2">--- Part Two ---</h2>
        <p>Due to some kind of monkey-elephant-human mistranslation, you seem to have misunderstood a few key details about the riddle.</p>
        <p>
          First, you got the wrong job for the monkey named <code>root</code>; specifically, you got the wrong math operation. The correct
          operation for monkey <code>root</code> should be <code>=</code>, which means that it still listens for two numbers (from the same
          two monkeys as before), but now checks that the two numbers <em>match</em>.
        </p>
        <p>
          Second, you got the wrong monkey for the job starting with <code>humn:</code>. It isn't a monkey - it's <em>you</em>. Actually,
          you got the job wrong, too: you need to figure out <em>what number you need to yell</em> so that <code>root</code>'s equality
          check passes. (The number that appears after <code>humn:</code> in your input is now irrelevant.)
        </p>
        <p>
          In the above example, the number you need to yell to pass <code>root</code>'s equality test is <code><em>301</em></code
          >. (This causes <code>root</code> to get the same number, <code>150</code>, from both of its monkeys.)
        </p>
        <p>
          <em>What number do you yell to pass <code>root</code>'s equality test?</em>
        </p>
      </article>
      <p>Your puzzle answer was <code>3558714869436</code>.</p>
      <p class="day-success">Both parts of this puzzle are complete! They provide two gold stars: **</p>
      <p>At this point, all that is left is for you to <a href="/2022">admire your Advent calendar</a>.</p>
      <p>If you still want to see it, you can <a href="21/input" target="_blank">get your puzzle input</a>.</p>
      <p>
        You can also
        <span class="share"
          >[Share<span class="share-content"
            >on
            <a
              href="https://twitter.com/intent/tweet?text=I%27ve+completed+%22Monkey+Math%22+%2D+Day+21+%2D+Advent+of+Code+2022&amp;url=https%3A%2F%2Fadventofcode%2Ecom%2F2022%2Fday%2F21&amp;related=ericwastl&amp;hashtags=AdventOfCode"
              target="_blank"
              >Twitter</a
            >
            <a
              href="javascript:void(0);"
              onclick="var ms; try{ms=localStorage.getItem('mastodon.server')}finally{} if(typeof ms!=='string')ms=''; ms=prompt('Mastodon Server?',ms); if(typeof ms==='string' && ms.length){this.href='https://'+ms+'/share?text=I%27ve+completed+%22Monkey+Math%22+%2D+Day+21+%2D+Advent+of+Code+2022+%23AdventOfCode+https%3A%2F%2Fadventofcode%2Ecom%2F2022%2Fday%2F21';try{localStorage.setItem('mastodon.server',ms);}finally{}}else{return false;}"
              target="_blank"
              >Mastodon</a
            ></span
          >]</span
        >
        this puzzle.
      </p>
    </main>

    <!-- ga -->
    <script>
      (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        (i[r] =
          i[r] ||
          function () {
            (i[r].q = i[r].q || []).push(arguments);
          }),
          (i[r].l = 1 * new Date());
        (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m);
      })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
      ga('create', 'UA-69522494-1', 'auto');
      ga('set', 'anonymizeIp', true);
      ga('send', 'pageview');
    </script>
    <!-- /ga -->
  </body>
</html>

`;
