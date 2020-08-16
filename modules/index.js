import {html, render, useState} from "../node_modules/htm/preact/standalone.module.js";
import {Chain, randomSentence} from "./markov.js";
import {normalizeSentence} from "./text.js";

const corpus = `
Twenty-four hours after entertaining and amplifying a false and racist birther conspiracy aimed at Sen. Kamala Harris, President Trump had an opportunity to correct the record. He didn't. Neither did his son-in-law and top adviser Jared Kushner.
For Trump, this is a return to familiar territory.
"Unfortunately, this might have been inevitable," said Doug Heye, a former Republican National Committee communications director.
He said that when former Vice President Joe Biden first picked Harris as his running mate, he saw tweets from Democrats saying: "Here comes the racism and sexism." Heye says he rolled his eyes recalling Republican vice presidential nominee Sarah Palin being mocked as "Caribou Barbie."
"The problem with that is, the Democrats weren't wrong and they weren't wrong because this is where Trump went and Trump supporters went immediately," Heye said.
Heye argues it's not a good strategy but says Trump is likely returning to it because he's down in the polls and the American public is worried about the coronavirus and overwhelmingly disapproves of the president's handling of the crisis.
"This is an old playbook," said Amanda Renteria, who was political director for Hillary Clinton's presidential campaign.
The official response from the Trump campaign was to criticize Harris as a "radical" and "phony." That's the script campaign surrogates stuck to during a call with reporters earlier this week.
"You know, today we are talking about Joe Biden's new running mate, Kamala Harris, or as we know her, Phony Kamala," said Stacy Washington, a Black Voices for Trump Advisory Board member, mispronouncing the senator's first name.
Washington pointed to Harris' co-sponsorship of Bernie Sanders' "Medicare for All" bill and general support of the Green New Deal.
"It couldn't be clearer that with this VP pick, the extreme liberal takeover of Joe Biden is complete. You don't have to take our word for it," Washington said. "Just look at the record of Joe Biden's new handler."
The language was colorful, but the focus was ostensibly on policy. Trump, though, immediately went more personal, describing Harris as a "mad woman," "disrespectful," "nasty" and "angry," playing into the old racist and sexist trope of the angry black woman.
On Thursday, given the opportunity to reject a birther conspiracy making the rounds on the Internet, Trump threw fuel on it.
"I heard it today, that she doesn't meet the requirements," Trump said when asked at a White House press briefing about a Newsweek opinion piece suggesting Harris' immigrant parents mean she shouldn't qualify to be vice president or president. "And by the way, the lawyer that wrote that piece is a very highly qualified, very talented lawyer."
There is no question. Harris was born in Oakland, Calif. Yes, her father was an immigrant from Jamaica, her mother from India. But Harris is just as much a natural-born American as Trump, whose own mother emigrated from Scotland. And so as he often does, Trump did add a dose of plausible deniability.
"I have no idea if that's right," Trump said. "I would have assumed the Democrats would have checked out before she gets chosen to run for vice president."
This has echoes of language he has used in the past when pushing forward birther conspiracies about Barack Obama.
"I have no idea," Trump said in a 2013 ABC interview of whether Obama was born in the U.S., even after the president had released his birth certificate. "Some people say that was not his birth certificate."
Birtherism is in the DNA of Trump's political rise — from Obama to his 2016 primary opponent Ted Cruz.
"You know based on things that I've learned over the last few days, many lawyers are coming out saying he doesn't even have a right to run," Trump said of Cruz.
During the same campaign, he briefly toyed with the idea that Sen. Marco Rubio, whose parents are Cuban may not be allowed to run, before moving on.
Trump always uses the same arm's-length, "just asking questions" formula to inject conspiracies into the American bloodstream. On CBS this Friday, Kushner, Trump son-in-law and top adviser, went to a defense Trump allies use regularly.
"He just said that he had no idea whether that's right or wrong," said Kushner. "I don't see that as promoting it. But look, at the end of the day, it's something that's out there."
Having it out there, circulating, with an air of suspicion, would seem to be the goal.
"If Republicans and Trump decide to go after Harris instead of Biden and say that she's the Biden whisperer from the left, there is the substance there for them to do so," said Heye, who wrote about the birther conspiracy on CNN's website and said Republicans should condemn it. "And just like there was plenty of substance for Trump to go after Obama, these are the places he goes back to. It almost is his safe space."
The Trump campaign has struggled to settle on a message attacking Harris that really sticks, much as they have toiled unsuccessfully to truly hurt Biden, said Renteria. So, she says, the birther stuff, is a way for Trump to signal to his base that America is changing and that they should be afraid.
"You know the energy that you've seen of women of color of breaking barriers, sons and daughters, a daughter of an immigrant," Renteria said, "he's immediately trying to strip that down and say that's not American."
`;

// really bad splitting into words
const words = corpus
  .toLocaleLowerCase()
  .replace(/[\n\r]+/, "")
  .split(/\s+|(?=\W)/);

// really dumb markov chain building
const chain = new Chain();
for (let i = 0; i < words.length - 1; ++i) {
  chain.add(words[i], words[i + 1]);
}
console.log(chain.toString());


const App = (props) => {
  const generateText = () => normalizeSentence(randomSentence(chain, 100));
  const [text, setText] = useState(generateText());

  return html`
    <div>
      <h1>computer dreams of news</h1>
      <button onClick=${() => setText(generateText())}>aaah</button>
      <div style="max-width: 30em">
        ${text}
      </div>
    </div>
  `;
};

render(html`<${App}/>`, document.body);
