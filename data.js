/* Mind Atlas — content & shapes */

const REGIONS = [
  {
    id: "frontal", name: "Frontal Lobe", short: "Frontal", cat: "Lobes & cortical areas", kind: "cortex", color: "#e8a87c",
    group: "Cerebral cortex", where: "Front of the brain, behind your forehead",
    children: ["prefrontal", "motor", "broca"],
    summary: "The largest lobe and the brain's “executive suite.” It plans, decides, controls movement, produces speech, and keeps your behavior in line with your goals.",
    functions: ["Planning, reasoning and problem-solving", "Voluntary movement (via the motor cortex)", "Speech production (Broca's area)", "Personality, judgment and social behavior", "Working memory and attention control"],
    psych: "The frontal lobe is the last region to fully mature — its wiring keeps refining into the mid-20s, which helps explain why teenagers are more impulsive and reward-seeking. The famous case of Phineas Gage (1848), whose personality changed after an iron rod passed through his frontal lobe, was one of the first clues that personality has a biological home.",
    damage: "Personality changes, impulsivity, poor planning, difficulty starting or switching tasks, weakness on the opposite side of the body, or trouble producing speech.",
    tips: ["Write tomorrow's top 3 priorities each evening — planning is a frontal-lobe workout.", "Learn complex skills (an instrument, a language, chess) that demand strategy.", "Protect your sleep — sleep loss hits judgment and self-control first."],
    fact: "The frontal lobes make up roughly a third of the human cerebral cortex.",
    q: "The largest lobe, home to planning, voluntary movement and personality"
  },
  {
    id: "prefrontal", name: "Prefrontal Cortex", short: "Prefrontal", cat: "Lobes & cortical areas", kind: "cortex", color: "#f2c57c",
    group: "Frontal lobe", where: "The very front of the frontal lobe",
    summary: "The brain's CEO. It holds information in mind, weighs options, delays gratification, and regulates emotions coming from deeper structures like the amygdala.",
    functions: ["Executive functions: working memory, flexible thinking, self-control", "Decision-making and weighing long-term consequences", "Regulating emotions and impulses", "Understanding other people's intentions", "Setting and pursuing goals"],
    psych: "Under acute stress, a surge of stress chemicals impairs prefrontal function while habit and threat systems take over — one reason we “can't think straight” when anxious. Techniques from cognitive-behavioral therapy, like reappraisal, are thought to work partly by strengthening prefrontal control over emotion.",
    damage: "Difficulty concentrating, impulsive or socially inappropriate behavior, poor planning, apathy, and trouble adapting when rules change.",
    tips: ["Reduce decision fatigue: automate small choices so your energy goes to what matters.", "“Name it to tame it” — putting a feeling into words engages prefrontal areas and can dampen its intensity.", "Single-task. Switching between tasks taxes working memory and costs time."],
    fact: "Working memory typically holds only about 4 chunks of information at once.",
    q: "Your inner “CEO”: working memory, self-control and long-term decisions"
  },
  {
    id: "motor", name: "Primary Motor Cortex", short: "Motor", cat: "Lobes & cortical areas", kind: "cortex", color: "#e57373",
    group: "Frontal lobe", where: "A strip just in front of the central sulcus",
    summary: "A strip of cortex that sends commands down the spinal cord to move your muscles. Each part of the strip controls a specific body part — the “motor homunculus.”",
    functions: ["Initiating voluntary movements", "Fine control of hands, fingers, lips and tongue", "Executing movement plans made by premotor areas", "Each hemisphere controls the opposite side of the body"],
    psych: "The motor homunculus is distorted: hands and face get huge areas because they need precise control. With practice, the area devoted to a skill can expand — string players show enlarged representation for their fingering hand.",
    damage: "Weakness or paralysis on the opposite side of the body, as often seen after a stroke.",
    tips: ["Learn new movement skills — dance, juggling, a sport — to challenge your motor maps.", "Practice in your head too: imagining a movement activates overlapping motor networks.", "Regular aerobic exercise supports blood flow to the brain."],
    fact: "Mentally rehearsing piano exercises has been shown to produce motor-cortex changes similar to physical practice.",
    q: "Sends commands to your muscles; organized as a body map called a homunculus"
  },
  {
    id: "broca", name: "Broca's Area", short: "Broca's", cat: "Lobes & cortical areas", kind: "cortex", color: "#ba68c8",
    group: "Frontal lobe (usually left)", where: "Lower part of the left frontal lobe",
    summary: "A region, usually in the left hemisphere, that is key for producing speech and building grammatical sentences.",
    functions: ["Speech production and articulation planning", "Grammar and sentence structure", "Understanding complex sentences", "Producing sign language in signers"],
    psych: "Named after Paul Broca, who in 1861 studied a patient nicknamed “Tan” — the only syllable he could say — even though he understood language. It was among the first evidence that specific functions live in specific places.",
    damage: "Broca's (expressive) aphasia: slow, effortful, telegraphic speech while comprehension is largely intact.",
    tips: ["Read aloud and explain ideas out loud — producing language exercises speech networks.", "Learn a second language.", "Write regularly: building sentences uses the same production systems."],
    fact: "For about 95% of right-handed people, language is dominant in the left hemisphere.",
    q: "Lets you produce speech and form grammatical sentences"
  },
  {
    id: "parietal", name: "Parietal Lobe", short: "Parietal", cat: "Lobes & cortical areas", kind: "cortex", color: "#81c784",
    group: "Cerebral cortex", where: "Top and back of the head",
    children: ["somato"],
    summary: "Integrates touch, body position and spatial information so you know where you are and where things are around you.",
    functions: ["Processing touch, temperature and pain (somatosensory cortex)", "Spatial awareness and navigation", "Coordinating hand–eye movements", "Numbers and math", "Directing attention in space"],
    psych: "Damage to the right parietal lobe can cause “hemispatial neglect” — people ignore the left side of the world, sometimes eating only the food on the right side of their plate or shaving half their face.",
    damage: "Problems with spatial orientation, neglect of one side of space, difficulty with math or writing, or recognizing objects by touch.",
    tips: ["Navigate without GPS sometimes — build your own mental maps.", "Puzzles, drawing and 3D games train spatial reasoning.", "Practice mental arithmetic."],
    fact: "Einstein's brain was reported to have unusually shaped parietal lobes — regions tied to math and spatial thinking (though single-brain studies are hard to interpret).",
    q: "Integrates touch and spatial awareness so you know where your body is in space"
  },
  {
    id: "somato", name: "Somatosensory Cortex", short: "Sensory", cat: "Lobes & cortical areas", kind: "cortex", color: "#4db6ac",
    group: "Parietal lobe", where: "A strip just behind the central sulcus",
    summary: "Receives touch, pressure, temperature, pain and body-position signals from the opposite side of the body, mapped as a “sensory homunculus.”",
    functions: ["Feeling touch, pressure, vibration and texture", "Sensing temperature and pain", "Proprioception — knowing where your limbs are", "Mapping sensations to body locations"],
    psych: "After an amputation, neighboring areas of the map can take over the missing limb's territory — one explanation for phantom-limb sensations, studied famously by V.S. Ramachandran with mirror boxes.",
    damage: "Numbness, inability to recognize objects by touch, or poor sense of limb position.",
    tips: ["Try a mindful body scan — slowly notice sensations from head to toe.", "Explore fine-touch hobbies (pottery, knitting, playing an instrument).", "Touch and massage also help regulate stress."],
    fact: "Lips and fingertips have some of the largest areas in the sensory map — that's why they're so sensitive.",
    q: "Receives touch, temperature and pain from the body, mapped like a homunculus"
  },
  {
    id: "temporal", name: "Temporal Lobe", short: "Temporal", cat: "Lobes & cortical areas", kind: "cortex", color: "#64b5f6",
    group: "Cerebral cortex", where: "Sides of the head, above the ears",
    children: ["wernicke"],
    summary: "Processes sound and language, recognizes faces and objects, and — together with the hippocampus and amygdala tucked inside — is crucial for memory and emotion.",
    functions: ["Hearing (auditory cortex)", "Understanding language (Wernicke's area)", "Recognizing faces, objects and voices", "Forming and storing long-term memories", "Linking memories with emotion"],
    psych: "The fusiform face area on the underside of the temporal lobe responds strongly to faces. Damage here can cause prosopagnosia (“face blindness”), where even close family are recognized only by voice or clothing.",
    damage: "Memory problems, trouble understanding speech, difficulty recognizing faces or objects, and sometimes seizures (temporal lobe epilepsy).",
    tips: ["Listen to and play music — it engages auditory and memory systems.", "Learn names actively: repeat a name and link it to a feature.", "Have rich conversations; careful listening is a workout."],
    fact: "When Wilder Penfield stimulated the temporal lobe during surgery, some patients reported vivid, dreamlike memories and music.",
    q: "Handles hearing, face recognition and, with deeper structures, memory"
  },
  {
    id: "wernicke", name: "Wernicke's Area", short: "Wernicke's", cat: "Lobes & cortical areas", kind: "cortex", color: "#7986cb",
    group: "Temporal lobe (usually left)", where: "Back of the upper temporal lobe",
    summary: "Classically linked to understanding spoken and written language — turning sounds into meaning.",
    functions: ["Comprehension of spoken language", "Understanding written words", "Selecting the right words when speaking", "Connected to Broca's area by the arcuate fasciculus"],
    psych: "In Wernicke's aphasia people speak fluently, with normal rhythm, but their words can be jumbled or meaningless (“word salad”) — and they often don't notice, because their comprehension is impaired.",
    damage: "Wernicke's (receptive) aphasia: fluent but nonsensical speech and poor comprehension.",
    tips: ["Read challenging texts and summarize them in your own words.", "Listen to podcasts or audiobooks on new topics.", "Play word games (crosswords, word association)."],
    fact: "Carl Wernicke described this region in 1874, when he was just 26 years old.",
    q: "Turns sounds and written words into meaning (language comprehension)"
  },
  {
    id: "occipital", name: "Occipital Lobe", short: "Occipital", cat: "Lobes & cortical areas", kind: "cortex", color: "#ffb74d",
    group: "Cerebral cortex", where: "Back of the head",
    summary: "The brain's visual center. It receives signals from the eyes and starts analyzing shape, color, motion and depth.",
    functions: ["Primary visual processing (V1)", "Detecting edges, color and motion", "Depth perception", "Feeding “what” and “where” visual pathways"],
    psych: "Some people with damage to primary visual cortex show “blindsight” — they report seeing nothing, yet can point to or avoid objects they can't consciously see. A lot of processing happens outside awareness.",
    damage: "Loss of part of the visual field, visual hallucinations, or trouble perceiving color or motion.",
    tips: ["Look at distant scenes outdoors to rest your eyes from screens.", "Draw from observation — it trains careful visual attention.", "Get regular eye check-ups; healthy input matters for the visual brain."],
    fact: "Each half of your visual field is processed by the opposite occipital lobe.",
    q: "The brain's visual center at the back of the head"
  },
  {
    id: "cerebellum", name: "Cerebellum", short: "Cerebellum", cat: "Brainstem & cerebellum", kind: "cbl", color: "#a1887f",
    group: "Hindbrain", where: "Tucked under the back of the cerebrum",
    summary: "The “little brain.” It fine-tunes movement, balance and timing, and contributes to skill learning and even to thinking and emotion.",
    functions: ["Balance and posture", "Coordinating smooth, accurate movements", "Motor learning (riding a bike, typing)", "Timing and rhythm", "Contributes to attention, language and emotion"],
    psych: "It's only about 10% of brain volume but holds roughly 80% of its neurons. It's also why you can't tickle yourself: it predicts the sensation of your own movement and dampens it.",
    damage: "Clumsy, unsteady movements (ataxia), tremor when reaching, slurred speech, poor balance.",
    tips: ["Practice balance: stand on one leg while brushing your teeth.", "Learn rhythmic skills like dance or drumming.", "Go easy on alcohol — the cerebellum is especially sensitive to it, which is why drunk people stagger."],
    fact: "About 69 of the brain's ~86 billion neurons are in the cerebellum, mostly tiny granule cells.",
    q: "Holds most of your neurons; coordinates balance, timing and motor learning"
  },
  {
    id: "midbrain", name: "Midbrain", short: "Midbrain", cat: "Brainstem & cerebellum", kind: "stem", color: "#f06292",
    group: "Brainstem", where: "Top of the brainstem",
    summary: "A small but busy area for eye movements, reflexes to sights and sounds, and alertness. Its dopamine neurons drive movement and reward.",
    functions: ["Visual and auditory reflexes (turning toward a sudden sound)", "Eye movement control", "Producing dopamine (substantia nigra, ventral tegmental area)", "Arousal and pain modulation"],
    psych: "The ventral tegmental area sends dopamine to the reward system. It fires not just for rewards but for cues that predict them — a key mechanism behind motivation, habits and addiction.",
    damage: "Problems with eye movement, consciousness or movement. Loss of dopamine neurons in the substantia nigra causes Parkinson's disease.",
    tips: ["Celebrate small wins to reinforce good habits.", "Notice how constant notifications hijack reward-driven attention.", "Exercise regularly — it's linked with healthy dopamine function."],
    fact: "“Substantia nigra” means “black substance” — it's darkened by a pigment visible to the naked eye.",
    q: "Top of the brainstem; its dopamine neurons drive reward and movement"
  },
  {
    id: "pons", name: "Pons", short: "Pons", cat: "Brainstem & cerebellum", kind: "stem", color: "#9575cd",
    group: "Brainstem", where: "Middle of the brainstem",
    summary: "A “bridge” (Latin: pons) of fibers connecting the cerebrum with the cerebellum, and a control center for breathing rhythm, sleep and facial sensation.",
    functions: ["Relaying signals between cerebrum and cerebellum", "Regulating breathing rhythm", "Controlling REM sleep and dreaming", "Nerves for facial sensation, chewing, eye movement and hearing"],
    psych: "During REM sleep, circuits in the pons paralyze most muscles so you don't act out your dreams. When this paralysis lingers as you wake up, you get sleep paralysis.",
    damage: "Problems with breathing, sleep, facial movement or sensation. Severe damage can cause “locked-in syndrome” — fully conscious but able to move only the eyes.",
    tips: ["Keep a regular sleep schedule to protect REM cycles.", "Avoid alcohol close to bedtime — it suppresses REM sleep.", "Practice slow breathing (inhale 4 seconds, exhale 6)."],
    fact: "Jean-Dominique Bauby wrote “The Diving Bell and the Butterfly” after a pontine stroke, dictating it letter by letter by blinking one eye.",
    q: "A bridge in the brainstem that controls breathing rhythm and REM sleep"
  },
  {
    id: "medulla", name: "Medulla Oblongata", short: "Medulla", cat: "Brainstem & cerebellum", kind: "stem", color: "#4fc3f7",
    group: "Brainstem", where: "Bottom of the brainstem, joining the spinal cord",
    summary: "Keeps you alive on autopilot: heart rate, blood pressure, breathing, and reflexes like swallowing, coughing and vomiting.",
    functions: ["Regulating heart rate and blood pressure", "Controlling breathing", "Reflexes: swallowing, coughing, sneezing, vomiting", "Where motor pathways cross to the other side"],
    psych: "Because motor pathways cross in the medulla (the “pyramidal decussation”), the left side of your brain controls the right side of your body.",
    damage: "Can be life-threatening: problems with breathing, heart rate, swallowing and blood pressure.",
    tips: ["Slow, deep breathing stimulates the vagus nerve, which can lower heart rate.", "Stay hydrated and keep blood pressure in check.", "Protect your head and neck in sports — wear a helmet."],
    fact: "It's one of the oldest parts of the brain in evolutionary terms — all vertebrates have one.",
    q: "Lowest part of the brainstem; runs heart rate, blood pressure and breathing"
  },
  {
    id: "corpusCallosum", name: "Corpus Callosum", short: "Corpus callosum", cat: "Deep brain", kind: "wm", color: "#fff3e0",
    group: "White matter", where: "Deep in the middle, joining both hemispheres",
    summary: "A thick band of about 200 million nerve fibers that lets the left and right hemispheres share information.",
    functions: ["Communication between the hemispheres", "Integrating senses and movement from both sides", "Coordinating two-handed tasks"],
    psych: "In “split-brain” patients (whose corpus callosum was cut to treat epilepsy), Roger Sperry and Michael Gazzaniga showed each hemisphere can hold different information. The left hemisphere even invented explanations for actions started by the right — the “interpreter.”",
    damage: "Trouble coordinating the hands or sharing information between visual fields; often subtle in daily life.",
    tips: ["Two-handed activities (piano, juggling, typing) coordinate both hemispheres.", "Remember: “left-brained vs right-brained” personalities are a myth — the hemispheres work as a team.", "Aerobic exercise supports white-matter health."],
    fact: "It's the largest white-matter structure in the brain.",
    q: "A thick bundle of fibers connecting the left and right hemispheres"
  },
  {
    id: "cingulate", name: "Cingulate Cortex", short: "Cingulate", cat: "Limbic system", kind: "deep", color: "#ffd54f",
    group: "Limbic system", where: "Curved around the corpus callosum",
    summary: "A belt of cortex linking emotion, attention and action — it notices errors and conflicts and helps you adjust your behavior.",
    functions: ["Detecting errors and conflicts", "Emotional processing and the felt unpleasantness of pain", "Motivation and effort", "Connecting emotions to decisions"],
    psych: "In studies of social exclusion (the “Cyberball” game), being left out activated parts of the anterior cingulate that overlap with those involved in the distress of physical pain.",
    damage: "Apathy, low motivation, difficulty noticing mistakes. Over-activity has been linked to anxiety and OCD.",
    tips: ["Treat mistakes as data — review them calmly to learn.", "Mindfulness practice is associated with changes in attention-control networks that include the cingulate.", "Stay socially connected — social pain is real pain."],
    fact: "“Cingulate” comes from the Latin for “belt.”",
    q: "A belt-shaped cortex that detects errors and links emotion to action"
  },
  {
    id: "thalamus", name: "Thalamus", short: "Thalamus", cat: "Deep brain", kind: "deep", color: "#ff8a65",
    group: "Diencephalon", where: "Center of the brain, above the brainstem",
    summary: "The brain's relay station. Almost all sensory information (except smell) passes through the thalamus before reaching the cortex.",
    functions: ["Relaying sensory signals to the cortex", "Regulating sleep, wakefulness and consciousness", "Filtering what gets attention", "Relaying motor signals from the basal ganglia and cerebellum"],
    psych: "The thalamus acts like a gatekeeper: in deep sleep it helps block sensory signals from reaching awareness. Thalamus–cortex loops are a major focus of research on consciousness.",
    damage: "Sensory loss, chronic pain syndromes, sleep disruption, memory problems, or reduced consciousness.",
    tips: ["Give your senses breaks from noise and screens.", "Keep your bedroom dark and quiet.", "Practice focused attention, like following your breath."],
    fact: "Smell is the only sense that reaches the cortex without stopping at the thalamus first.",
    q: "The relay station: almost all senses pass through it on the way to the cortex"
  },
  {
    id: "hypothalamus", name: "Hypothalamus", short: "Hypothalamus", cat: "Deep brain", kind: "deep", color: "#e57373",
    group: "Diencephalon", where: "Just below the thalamus",
    summary: "An almond-sized control center for survival: hunger, thirst, body temperature, sleep cycles, sex drive and the stress response. It directs the pituitary gland.",
    functions: ["Homeostasis: temperature, hunger, thirst", "The body clock (suprachiasmatic nucleus)", "Hormone control via the pituitary", "Starting the stress response (HPA axis)", "Producing oxytocin and vasopressin"],
    psych: "The HPA axis (hypothalamus → pituitary → adrenal glands) releases cortisol under stress. Short bursts help you cope; chronic activation is linked with anxiety, depression and memory problems.",
    damage: "Disrupted appetite, sleep, temperature or hormone balance.",
    tips: ["Get morning daylight — it sets the body clock in the hypothalamus.", "Eat at fairly regular times to support hunger and fullness signals.", "Manage chronic stress with exercise, social support and relaxation."],
    fact: "It weighs only about 4 grams yet steers much of the body's hormone system.",
    q: "Controls hunger, thirst, body temperature, body clock and the stress response"
  },
  {
    id: "pituitary", name: "Pituitary Gland", short: "Pituitary", cat: "Deep brain", kind: "gland", color: "#f48fb1",
    group: "Endocrine gland", where: "Hanging just below the hypothalamus",
    summary: "The “master gland.” Directed by the hypothalamus, it releases hormones that control growth, metabolism, stress, reproduction and more.",
    functions: ["Growth hormone", "Signaling the adrenal glands under stress (ACTH)", "Thyroid control (TSH)", "Reproductive hormones", "Releasing oxytocin and vasopressin"],
    psych: "The pituitary is the middle link in the stress chain: when the hypothalamus senses a threat, the pituitary releases ACTH, which tells the adrenal glands to make cortisol.",
    damage: "Hormone imbalances affecting growth, energy, mood, fertility or fluid balance.",
    tips: ["Sleep well — much growth hormone is released in deep sleep.", "Eat a balanced diet to support hormone production.", "See a doctor about persistent unexplained fatigue or hormonal changes."],
    fact: "It's only about the size of a pea.",
    q: "Pea-sized “master gland” that releases hormones on orders from the hypothalamus"
  },
  {
    id: "pineal", name: "Pineal Gland", short: "Pineal", cat: "Deep brain", kind: "gland", color: "#ce93d8",
    group: "Endocrine gland", where: "Deep in the center, behind the thalamus",
    summary: "A tiny gland that releases melatonin when it gets dark, helping regulate your sleep–wake cycle.",
    functions: ["Producing melatonin at night", "Signaling “biological night” to the body", "Supporting daily and seasonal rhythms"],
    psych: "Bright light at night — including screens — can suppress melatonin and shift your body clock later, making it harder to fall asleep.",
    damage: "Disrupted sleep rhythms; tumors here can affect eye movements or hormone timing.",
    tips: ["Dim the lights 1–2 hours before bed.", "Bright light in the morning, darkness at night.", "Keep a consistent wake-up time, even on weekends."],
    fact: "René Descartes called the pineal gland the “seat of the soul.”",
    q: "Tiny gland that releases melatonin when it gets dark"
  },
  {
    id: "amygdala", name: "Amygdala", short: "Amygdala", cat: "Limbic system", kind: "deep", color: "#ef5350",
    group: "Limbic system", where: "Deep inside the front of each temporal lobe",
    summary: "An almond-shaped alarm system that detects threats and emotionally important events, triggering fear and strengthening emotional memories.",
    functions: ["Detecting threats and triggering fear", "Emotional learning (fear conditioning)", "Making emotional memories stronger", "Reading emotions in faces", "Flagging what's important (salience)"],
    psych: "The amygdala can react to a threat before you consciously recognize it. Exposure therapy for phobias works by building new “safety learning” that the prefrontal cortex uses to calm amygdala fear responses.",
    damage: "Reduced fear and difficulty recognizing fear in others (as in patient S.M., who felt almost no fear). Over-activity is associated with anxiety and PTSD.",
    tips: ["Label your emotions (“I feel anxious”) — affect labeling has been shown to reduce amygdala responses.", "Face fears gradually and repeatedly instead of avoiding them.", "Slow your breathing to calm the body's alarm response."],
    fact: "“Amygdala” comes from the Greek word for almond.",
    q: "Almond-shaped alarm system for threats, fear and emotional memories"
  },
  {
    id: "hippocampus", name: "Hippocampus", short: "Hippocampus", cat: "Limbic system", kind: "deep", color: "#ffca28",
    group: "Limbic system", where: "Deep in the temporal lobe",
    summary: "A seahorse-shaped structure essential for forming new long-term memories and for finding your way around.",
    functions: ["Forming new episodic memories", "Consolidating memories, especially during sleep", "Spatial memory and navigation (“place cells”)", "Linking memories to their context"],
    psych: "After surgery removed most of his hippocampi in 1953, patient H.M. (Henry Molaison) could no longer form new long-term memories — yet he could still learn new motor skills. This showed there are separate memory systems.",
    damage: "Inability to form new memories (anterograde amnesia) and disorientation. It's one of the first regions affected by Alzheimer's disease.",
    tips: ["Test yourself (retrieval practice) and space out your study sessions.", "Sleep after learning — memories are replayed and consolidated at night.", "Aerobic exercise has been linked to a larger hippocampus in older adults."],
    fact: "London taxi drivers who memorized the city's ~25,000 streets had larger posterior hippocampi.",
    q: "Seahorse-shaped structure that forms new memories and maps space"
  },
  {
    id: "basalGanglia", name: "Basal Ganglia", short: "Basal ganglia", cat: "Deep brain", kind: "deep", color: "#aed581",
    group: "Deep nuclei", where: "Deep within each hemisphere, beside the thalamus (shown dashed)",
    summary: "A group of deep nuclei that help select actions, start and stop movements, and form habits based on reward.",
    functions: ["Selecting and starting movements", "Habit formation and procedural learning", "Reward learning (striatum and nucleus accumbens)", "Suppressing unwanted actions"],
    psych: "As a behavior is repeated, control shifts from goal-directed prefrontal circuits toward the basal ganglia — the behavior becomes a habit triggered by cues. That's why changing your cues or environment helps break habits.",
    damage: "Movement disorders like Parkinson's (too little movement) or Huntington's disease (too much); also linked to OCD and Tourette syndrome.",
    tips: ["Build habits with a cue → routine → reward loop.", "Make good habits easy and bad habits hard by changing your environment.", "Stack new habits onto old ones: “After I pour coffee, I'll stretch.”"],
    fact: "One study found habits took about 66 days on average to become automatic — with huge variation between people.",
    q: "Deep nuclei that select actions and turn repeated behaviors into habits"
  }
];

/* ---------- Shapes (SVG paths in a 800x600 space, brain facing left) ---------- */

const OUTLINE = "M140 290 C120 200 180 115 290 92 C400 68 540 78 625 135 C695 185 715 270 690 330 C678 362 650 378 610 382 C585 384 565 380 550 378 C530 410 480 438 410 438 C345 437 300 418 280 385 C262 362 238 358 210 360 C170 360 145 330 140 290 Z";

const circ = (cx, cy, r) => `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z`;
const ell = (cx, cy, rx, ry) => `M${cx - rx} ${cy} a${rx} ${ry} 0 1 0 ${2 * rx} 0 a${rx} ${ry} 0 1 0 ${-2 * rx} 0 Z`;
const S = (layer, id, d, lx, ly, extra = {}) => ({ layer, id, d, lx, ly, ...extra });
const D = (layer, d, cls = "") => ({ layer, deco: true, d, cls });

const SHAPES = {
  lateral: [
    S("under", "pons", "M450 405 L530 405 C545 425 540 460 520 470 L465 472 C450 455 445 425 450 405 Z", 482, 455),
    S("under", "medulla", "M466 470 L520 470 C518 500 515 525 512 552 L480 554 C478 525 472 495 466 470 Z", 495, 520),
    S("under", "cerebellum", "M515 405 C555 378 645 372 685 395 C712 418 700 462 655 475 C605 488 548 472 522 450 C512 437 510 418 515 405 Z", 620, 445),
    D("under", "M528 412 C575 392 640 388 690 405", "folia"),
    D("under", "M520 428 C575 412 650 410 702 425", "folia"),
    D("under", "M525 445 C580 433 650 430 698 445", "folia"),
    D("under", "M548 463 C595 458 645 456 680 462", "folia"),

    S("cortex", "frontal", "M0 0 L450 0 L445 60 L420 170 L395 260 L375 338 L260 372 L0 460 Z", 338, 150),
    S("cortex", "prefrontal", "M0 0 L310 0 L295 110 L270 230 L250 300 L240 368 L0 460 Z", 210, 225),
    S("cortex", "motor", "M400 0 L450 0 L445 60 L420 170 L395 260 L375 338 L332 350 L350 260 L375 170 L400 60 Z", 404, 142),
    S("cortex", "somato", "M445 0 L495 0 L490 60 L465 170 L440 260 L420 325 L375 338 L395 260 L420 170 L445 60 Z", 452, 152),
    S("cortex", "parietal", "M490 0 L615 0 L610 60 L625 200 L600 300 L560 310 L520 302 L420 325 L440 260 L465 170 L490 60 Z", 548, 200),
    S("cortex", "temporal", "M0 460 L260 372 L380 335 L520 302 L560 310 L600 300 L630 385 L640 800 L0 800 Z", 420, 402),
    S("cortex", "occipital", "M615 0 L800 0 L800 800 L640 800 L630 385 L600 300 L625 200 L610 60 Z", 658, 275),
    S("cortex", "broca", "M262 318 C280 295 330 288 350 305 C360 322 350 345 320 352 C295 358 268 350 262 318 Z", 307, 327),
    S("cortex", "wernicke", "M495 330 C515 312 560 310 585 324 C598 340 585 362 555 368 C525 372 498 357 495 330 Z", 542, 344),
    D("cortex", "M445 68 C432 150 410 225 378 336", "major"),
    D("cortex", "M262 370 C330 346 430 322 560 310", "major"),
    D("cortex", "M402 72 C385 160 365 240 338 345", "thin"),
    D("cortex", "M490 78 C470 160 448 240 425 322", "thin"),
    D("cortex", "M175 205 C215 178 255 165 300 155 C330 148 360 140 392 120"),
    D("cortex", "M165 262 C205 250 255 240 298 230 C325 224 345 214 368 198"),
    D("cortex", "M195 140 C215 158 238 148 250 172"),
    D("cortex", "M300 110 C315 125 335 112 352 128", "thin"),
    D("cortex", "M470 205 C510 192 552 182 592 176 C612 174 632 182 650 200"),
    D("cortex", "M520 120 C540 140 560 130 580 150", "thin"),
    D("cortex", "M310 398 C360 382 420 372 480 362 C520 355 560 348 600 342"),
    D("cortex", "M335 422 C385 414 440 406 500 396", "thin"),
    D("cortex", "M640 220 C660 250 670 282 664 320"),
    D("cortex", "M618 300 C638 318 650 338 662 360", "thin"),
    D("cortex", "M680 255 C690 275 692 298 686 318", "thin"),
    D("cortex", "M200 320 C215 305 232 316 245 300", "thin"),
    D("cortex", "M160 230 C175 215 190 228 205 212", "thin"),
    D("cortex", "M240 120 C255 135 270 125 285 140", "thin"),
    D("cortex", "M230 190 C250 205 265 195 280 210", "thin"),
    D("cortex", "M545 100 C560 118 585 112 600 128", "thin"),
    D("cortex", "M560 230 C580 245 600 238 618 255", "thin"),
    D("cortex", "M520 255 C540 265 560 258 575 272", "thin"),
    D("cortex", "M650 150 C668 175 688 190 700 220", "thin"),
    D("cortex", "M380 400 C400 392 420 404 440 396", "thin"),
    D("cortex", "M470 420 C490 410 505 418 525 405", "thin"),
    D("cortex", "M330 260 C345 250 360 262 372 250", "thin")
  ],
  medial: [
    S("under", "cerebellum", "M525 375 C560 352 640 352 680 380 C708 405 695 455 650 468 C600 480 548 462 528 438 C516 420 515 395 525 375 Z", 625, 432),
    D("under", "M548 418 C575 405 600 392 630 380", "arbor"),
    D("under", "M548 420 C590 418 630 414 670 405", "arbor"),
    D("under", "M548 423 C585 435 620 448 655 455", "arbor"),
    D("under", "M548 426 C570 442 590 456 605 466", "arbor"),

    S("cortex", "frontal", "M0 0 L440 0 L435 150 L430 335 L240 380 L0 460 Z", 368, 135),
    S("cortex", "prefrontal", "M0 0 L300 0 L270 180 L230 380 L0 460 Z", 212, 225),
    S("cortex", "parietal", "M440 0 L640 0 L590 230 L560 270 L600 330 L430 335 L435 150 Z", 530, 132),
    S("cortex", "temporal", "M0 460 L240 380 L430 335 L600 330 L620 800 L0 800 Z", 322, 412),
    S("cortex", "occipital", "M640 0 L800 0 L800 800 L620 800 L600 330 L560 270 L590 230 Z", 652, 282),
    D("cortex", "M190 190 C215 170 240 185 262 160"),
    D("cortex", "M180 262 C205 250 225 262 250 245", "thin"),
    D("cortex", "M320 112 C345 130 372 112 400 126"),
    D("cortex", "M470 100 C480 120 500 110 520 125", "thin"),
    D("cortex", "M640 112 C622 190 605 250 592 300", "major"),
    D("cortex", "M600 330 C635 318 668 332 702 318", "major"),

    S("over", "cingulate", "M280 250 C290 170 420 140 540 180 C590 200 610 240 590 280 L565 272 C580 245 565 215 525 200 C430 168 320 190 310 255 Z", 430, 176),
    S("over", "corpusCallosum", "M305 255 C315 200 420 180 520 205 C560 218 578 250 562 272 C548 262 535 255 515 250 C470 226 400 222 360 234 C338 244 332 270 320 272 C306 270 302 264 305 255 Z", 440, 216),
    S("over", "basalGanglia", ell(398, 266, 32, 18), 388, 262, { dashed: true }),
    S("over", "thalamus", ell(462, 282, 42, 24), 466, 286),
    S("over", "pineal", circ(522, 292, 8), 548, 304),
    S("over", "hypothalamus", "M385 300 C400 292 425 300 430 315 C425 330 405 338 390 330 C380 322 378 308 385 300 Z", 400, 320),
    S("over", "pituitary", "M392 334 L398 336 L394 350 C406 352 406 372 390 374 C376 374 374 356 386 350 Z", 372, 392),
    S("over", "midbrain", "M440 306 L505 300 L512 345 L450 347 Z", 476, 330),
    S("over", "pons", "M450 347 L512 345 C522 362 522 395 512 412 L462 414 C442 400 437 362 450 347 Z", 482, 405),
    S("over", "medulla", "M462 414 L512 412 C514 450 517 500 522 545 L487 548 C482 500 470 455 462 414 Z", 494, 480),
    S("over", "amygdala", circ(428, 370, 15), 438, 398),
    S("over", "hippocampus", "M444 376 C470 366 510 362 540 352 C562 344 578 325 582 300 C596 312 595 340 578 356 C550 378 505 388 462 392 C448 393 440 384 444 376 Z", 552, 384)
  ]
};

/* ---------- Psychology topics ---------- */

const TOPICS = [
  { title: "Memory", regions: ["hippocampus", "temporal", "prefrontal", "amygdala", "cerebellum", "basalGanglia"],
    text: "Memory isn't one thing. The hippocampus forms new episodic memories, the cortex stores them long-term, the amygdala tags emotional ones, and the cerebellum and basal ganglia handle skills and habits.",
    insight: "Each time you recall a memory, it becomes changeable again (reconsolidation). Memory is reconstructive, not a recording." },
  { title: "Emotion & Fear", regions: ["amygdala", "hypothalamus", "cingulate", "prefrontal"],
    text: "The amygdala flags threats, the hypothalamus turns that into a body response (racing heart, cortisol), and the prefrontal cortex can reinterpret the situation and calm it down.",
    insight: "Emotions are embodied: the brain constantly reads signals from your heart, gut and breathing — which is why slow breathing can change how you feel." },
  { title: "Attention & Focus", regions: ["prefrontal", "parietal", "thalamus", "cingulate"],
    text: "The prefrontal and parietal cortex steer attention toward goals, the thalamus filters incoming signals, and the cingulate notices conflicts that need more effort.",
    insight: "“Multitasking” is mostly rapid task-switching, and each switch has a cost in time and errors." },
  { title: "Decisions & Self-control", regions: ["prefrontal", "basalGanglia", "amygdala", "midbrain"],
    text: "Choices come from a tug-of-war between fast, reward-driven systems (basal ganglia, dopamine) and slower, goal-driven control (prefrontal cortex).",
    insight: "Self-control works better as environment design than as raw willpower — remove the temptation instead of resisting it." },
  { title: "Language", regions: ["broca", "wernicke", "temporal", "corpusCallosum"],
    text: "Wernicke's area helps you understand words, Broca's area helps you produce them, and a fiber tract (the arcuate fasciculus) connects the two.",
    insight: "Sign languages use largely the same left-hemisphere language areas as spoken languages." },
  { title: "Sleep & Body Clock", regions: ["hypothalamus", "pineal", "pons", "thalamus", "hippocampus"],
    text: "The hypothalamus keeps the 24-hour clock, the pineal gland releases melatonin at night, the pons switches on REM sleep, and the hippocampus replays the day's memories.",
    insight: "During deep sleep, the brain clears waste products more efficiently through the “glymphatic” system." },
  { title: "Stress", regions: ["hypothalamus", "pituitary", "amygdala", "hippocampus", "prefrontal"],
    text: "Stress activates the HPA axis: hypothalamus → pituitary → adrenal glands → cortisol. Short-term this sharpens you; long-term it wears systems down.",
    insight: "In animal studies, chronic stress shrinks neuron branches in the hippocampus and prefrontal cortex — and much of this reverses when the stress ends." },
  { title: "Habits & Reward", regions: ["basalGanglia", "midbrain", "prefrontal"],
    text: "Dopamine from the midbrain teaches the basal ganglia which actions pay off. Repeat an action in the same context and it becomes automatic.",
    insight: "Dopamine signals prediction errors — when things are better or worse than expected — more than pleasure itself." },
  { title: "Senses & Perception", regions: ["occipital", "temporal", "somato", "thalamus", "parietal"],
    text: "Senses are relayed through the thalamus to specialized cortex: vision (occipital), hearing (temporal), touch (somatosensory). The parietal lobe stitches it all into one scene.",
    insight: "Perception is prediction: the brain constantly guesses what's out there, which is why optical illusions work." },
  { title: "Movement", regions: ["motor", "cerebellum", "basalGanglia", "somato"],
    text: "The motor cortex sends commands, the basal ganglia choose which movement to release, the cerebellum fine-tunes timing, and sensory feedback corrects errors.",
    insight: "Your brain often starts preparing a movement before you're aware of deciding to move (the “readiness potential”)." },
  { title: "Neuroplasticity", regions: ["hippocampus", "motor", "somato", "cerebellum"],
    text: "The brain rewires with experience: connections strengthen with use and weaken with disuse — “neurons that fire together wire together” (Donald Hebb).",
    insight: "Plasticity continues throughout life. Learning, exercise, sleep and social contact all support it." },
  { title: "The Social Brain", regions: ["prefrontal", "amygdala", "cingulate", "temporal"],
    text: "Reading faces, guessing what others think (theory of mind), and feeling social pain all rely on a network spanning the prefrontal, temporal and limbic regions.",
    insight: "Children usually begin passing “false-belief” tests — understanding that others can believe something untrue — around age 4." }
];

const CHEMS = [
  { name: "Dopamine", role: "Motivation, reward prediction, learning and movement.", note: "It's less a “pleasure chemical” than a “wanting” and learning signal." },
  { name: "Serotonin", role: "Mood, sleep, appetite, patience and impulse control.", note: "About 90% of the body's serotonin is made in the gut." },
  { name: "Norepinephrine", role: "Alertness, arousal and the fight-or-flight response.", note: "Peaks when you're stressed or excited; low at night." },
  { name: "GABA", role: "The main “brake” — calms neural activity.", note: "Anti-anxiety drugs like benzodiazepines boost GABA's effects." },
  { name: "Glutamate", role: "The main “accelerator” — excites neurons, essential for learning.", note: "It's the most abundant neurotransmitter in the brain." },
  { name: "Acetylcholine", role: "Attention, memory, and muscle contraction.", note: "Its loss is a hallmark of Alzheimer's disease." },
  { name: "Endorphins", role: "The body's natural painkillers.", note: "Linked to the “runner's high,” along with endocannabinoids." },
  { name: "Oxytocin", role: "Bonding, trust and social connection.", note: "Made in the hypothalamus, released by the pituitary." }
];

const MYTHS = [
  { myth: "We only use 10% of our brain.", fact: "Brain imaging shows activity across virtually the whole brain over a day. Even simple tasks recruit many areas." },
  { myth: "People are “left-brained” or “right-brained.”", fact: "Some functions are lateralized (like language), but large studies find no evidence that people have a dominant hemisphere shaping personality." },
  { myth: "You learn best in your “learning style.”", fact: "Matching teaching to visual/auditory/kinesthetic styles hasn't been shown to improve learning. Spacing and self-testing do." },
  { myth: "Brain damage is always permanent.", fact: "The brain can reorganize after injury; rehabilitation takes advantage of this plasticity." },
  { myth: "You can multitask efficiently.", fact: "For tasks that need attention, the brain switches rapidly between them — with costs in speed and accuracy." }
];

const TIPS = [
  { title: "Sleep", items: [
    ["Aim for 7–9 hours", "Sleep consolidates memories and clears metabolic waste from the brain."],
    ["Keep a steady wake time", "A regular schedule anchors your body clock in the hypothalamus."],
    ["Morning light, dim evenings", "Light timing tells the pineal gland when to release melatonin."]] },
  { title: "Move", items: [
    ["Get your heart rate up", "Aerobic exercise raises BDNF, a protein that supports neuron growth and plasticity."],
    ["Learn coordinated skills", "Dance, sports and balance training challenge the cerebellum and motor cortex."],
    ["Break up sitting", "Short walks boost alertness and mood."]] },
  { title: "Learn smarter", items: [
    ["Test yourself", "Retrieval practice beats rereading for long-term memory."],
    ["Space it out", "Reviewing over days strengthens memories more than cramming."],
    ["Mix it up", "Interleaving different problem types improves flexible thinking."]] },
  { title: "Emotions & stress", items: [
    ["Name the feeling", "Labeling emotions can dampen amygdala responses."],
    ["Breathe slowly", "Long exhales activate the calming parasympathetic system."],
    ["Reframe", "Reappraisal — seeing a situation differently — engages prefrontal regulation."]] },
  { title: "Focus", items: [
    ["Single-task", "Work in focused blocks; switching costs time and accuracy."],
    ["Phone out of sight", "Even a visible phone can pull on attention."],
    ["Take real breaks", "Mind-wandering time helps consolidate learning and creativity."]] },
  { title: "Connect & nourish", items: [
    ["Stay social", "Strong relationships are linked to better cognitive health with age."],
    ["Eat for your brain", "Diets rich in vegetables, fish, nuts and olive oil are linked to better brain health."],
    ["Stay curious", "Novelty and challenge keep your brain building new connections."]] }
];

const HABITS = ["Slept 7+ hours", "20+ min of exercise", "Learned something new", "Connected with someone", "5 min of calm breathing / mindfulness", "Time outdoors in daylight"];
