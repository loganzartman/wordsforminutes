import {html, render, useState} from "../node_modules/htm/preact/standalone.module.js";
import {Chain, randomSentence} from "./markov.js";
import {normalizeSentence} from "./text.js";

const corpus = `
I just returned from the greatest summer vacation! It was so fantastic, I never wanted it to end. I spent eight days in Paris, France. My best friends, Henry and Steve, went with me. We had a beautiful hotel room in the Latin Quarter, and it wasn't even expensive. We had a balcony with a wonderful view.
We visited many famous tourist places. My favorite was the Louvre, a well-known museum. I was always interested in art, so that was a special treat for me. The museum is so huge, you could spend weeks there. Henry got tired walking around the museum and said "Enough! I need to take a break and rest."
We took lots of breaks and sat in cafes along the river Seine. The French food we ate was delicious. The wines were tasty, too. Steve's favorite part of the vacation was the hotel breakfast. He said he would be happy if he could eat croissants like those forever. We had so much fun that we're already talking about our next vacation!

Yellowstone National Park, located in Idaho, Montana, and Wyoming, was established as the first national park in the United States. The park is a popular destination for visitors who enjoy ecological tourism as it offers forests, mountains, and abundant ecosystems to explore. Some of Yellowstone's most well-known landmarks are its geothermal hot springs and geysers, the most famous of which is named Old Faithful.
Last fall, Lisa and her friends decided to take a camping trip to Yellowstone National Park. They arranged to stay at one of the park's many convenient campsites. For their camping trip, they brought their backpacks, sleeping bags, and a cooler of food and drinks. They pitched their tents immediately upon arriving to their campsite.
During their trip, Lisa and her friends hiked the many trails of the park, exploring its natural surroundings. In the forest, they saw a lot of local wildlife. Lisa was surprised to see a family of grizzly bears, some gray wolves, and even bald eagles flying overhead. Outside of the woods, they admired the beauty of some of Yellowstone's natural cascades.
Since Yellowstone contains many hot springs and the world's largest area of active geysers, Lisa and her friends visited many different geyser sites. They even spent an afternoon swimming in Yellowstone's Boiling River. Of all of the sites, Lisa and her friends agreed that Old Faithful was the most impressive. Lisa and her friends waited patiently for the geyser to erupt. After about 40 minutes, a stream of boiling water over 100 feet tall sprayed from the ground and up into the air. Fortunately, no one got wet!

My name is Bob. Each day I drive my kids to school. My daughter goes to a school that's far from our house. It takes 30 minutes to get there. Then I drive my son to his school. It's close to my job. My daughter is in the sixth grade and my son is in the second. They are both good students. My daughter usually sings her favorite songs while I drive. My son usually sleeps.
I arrive at the office at 8:30 AM. I say good morning to all my workmates then I get a big cup of hot coffee. I turn on my computer and read my email. Some days I have a lot to read. Soon I need another cup of coffee.

My name is Clark, and I will tell you about my city.
I live in an apartment. In my city, there is a post office where people mail letters. On Monday, I go to work. I work at the post office. Everyone shops for food at the grocery store. They also eat at the restaurant. The restaurant serves pizza and ice cream.
My friends and I go to the park. We like to play soccer at the park. On Fridays, we go to the cinema to see a movie. Children don't go to school on the weekend. Each day, people go to the hospital when they are sick. The doctors and nurses take care of them. The police keep everyone safe. I am happy to live in my city.

The Grand Canyon, one of the Seven Wonders of the Natural World, is located in the state of Arizona. It is also a UNESCO World Heritage Site. Formed by over 70 million years of erosion from the Colorado River, the Grand Canyon offers a spectacular view. The canyon spans 277 miles in length, up to 18 miles in width, and it measures over a mile in depth at its deepest points. Carlos always wanted to visit the Grand Canyon, and recently he received the chance to hike some of the trails and take several panoramic photographs during his visit.
When Carlos arrived at the visitor center, he watched a brief movie that taught tourists about the Grand Canyon National Park and the geological history of the canyon's formation. Later, Carlos followed a hiking trail to become even further acquainted with the canyon. While walking through the trails, Carlos saw some tourists riding donkeys to traverse the canyon's ridges. Throughout his hiking expedition, Carlos used a map to find some of the best hot spots for photographs within the canyon. He revisited some areas at different points in the day because sun angles and lighting can make a big difference in the quality of a photo.
Carlos was very pleased that he got to travel to the Grand Canyon. He loves hiking and photography, so this was the perfect outdoor experience for him. He posted all of his best pictures on social media, and his friends were amazed by his breathtaking, panoramic shots.

The most expensive Taco in the world costs more than $25,000. You can buy it at a resort in Mexico. Chefs have special beef from Japan flown in for this food.
They also use a special ingredient called caviar. Fish eggs are used to make caviar. The fish eggs come from a special white fish.
The taco also has a unique cheese made with wild mushrooms and milk. This very expensive taco even has gold in its salsa. The chefs also use the best peppers, alcohol and coffee from Asia to make the salsa.
Chefs sprinkle more gold on the top. Then, they serve it to hungry guests. Diners say this taco is delicious. Many, however, say it is not worth the price. They say that there needs to be more than one taco to make them full. They are glad the restaurant offers more choices.
The cost of the taco does not include a stay at the resort. Guests spending the night must pay $990 to spend a night at the resort
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
  const generateText = () => normalizeSentence(randomSentence(chain, 48));
  const [text, setText] = useState(generateText());

  return html`
    <div>
      <h1>computer dreams of essays</h1>
      <button onClick=${() => setText(generateText())}>aaah</button>
      <div style="max-width: 30em">
        ${text}
      </div>
    </div>
  `;
};

render(html`<${App}/>`, document.body);
