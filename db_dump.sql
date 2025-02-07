--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2 (Debian 17.2-1.pgdg120+1)
-- Dumped by pg_dump version 17.2 (Debian 17.2-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Blog; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Blog" (
    id text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    author text NOT NULL,
    category text NOT NULL,
    author_profile_url text NOT NULL,
    status text NOT NULL,
    excerpt text NOT NULL,
    blog_image text NOT NULL,
    views integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Bookmark; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Bookmark" (
    "userId" text NOT NULL,
    "blogId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: City; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."City" (
    id text NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Event; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Event" (
    id text NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    datetime timestamp(3) without time zone NOT NULL,
    location text NOT NULL,
    event_type text NOT NULL,
    event_status text NOT NULL,
    organizer text NOT NULL,
    max_participants integer NOT NULL,
    agenda jsonb,
    speaker jsonb NOT NULL,
    event_thumbnail text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: EventBookmark; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."EventBookmark" (
    "userId" text NOT NULL,
    "eventId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: University; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."University" (
    id text NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    id text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    status boolean,
    profile_url text,
    gender text,
    "cityId" text,
    "universityId" text,
    role text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: UserActivity; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."UserActivity" (
    id text NOT NULL,
    "userId" text NOT NULL,
    activity text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: UsersOnEvents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."UsersOnEvents" (
    "userId" text NOT NULL,
    "eventId" text NOT NULL,
    "joinedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Data for Name: Blog; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Blog" (id, title, content, author, category, author_profile_url, status, excerpt, blog_image, views, "createdAt", "updatedAt") FROM stdin;
a2c109ed-d146-4497-97a8-4518282ce31f	Test Why the 'Start-up Hustle' Event is a Must for Aspiring Entrepreneurs in Kraków 	<p>For university students in Kraków dreaming of launching their own start-up or breaking into the entrepreneurial scene, the "Start-up Hustle: Innovate Your Future" event is the perfect opportunity to learn from the best and network with fellow innovators.</p><h3>What to Expect at "Start-up Hustle":</h3><ul><li><strong>Keynote Speakers:</strong> Industry experts and successful entrepreneurs like Anna Nowak, founder of TechNext, will share their journey and valuable tips on building a start-up from scratch. Expect to learn from their triumphs and mistakes as they offer insights on what it takes to succeed in today’s competitive business landscape.</li><li><strong>Workshops for Aspiring Founders:</strong> The event offers hands-on workshops covering topics like business development, funding, marketing, and more. These practical sessions will teach you how to take your idea and transform it into a marketable product or service.</li><li><strong>Networking Opportunities:</strong> Building a strong network is essential for any entrepreneur. Meet fellow students who share your passion for innovation, and make connections with industry mentors who can provide guidance and support as you embark on your entrepreneurial journey.</li><li><strong>Pitch Session:</strong> You’ll also have the chance to pitch your business idea to a panel of experts and potentially secure investment or mentorship. This is an excellent opportunity to get feedback and improve your business model.</li></ul><h3>Why You Should Attend:</h3><ul><li><strong>Real-World Advice:</strong> With start-up founders leading the event, you’ll hear real-world advice that applies to today’s fast-moving business world. Get the inspiration you need to take your own idea to the next level.</li><li><strong>Collaborative Atmosphere:</strong> The "Start-up Hustle" event is designed for students who are passionate about innovation and entrepreneurship. Whether you’re just getting started or already have a business idea in mind, this event provides the perfect platform to collaborate with like-minded peers.</li></ul><p>If you're ready to take your first step toward becoming a successful entrepreneur, don’t miss out on the "Start-up Hustle" event in Kraków. It could be the start of something big!</p>	Test Piotr Nowak	Entrepreneurship, Student Events	http://localhost:5004/api/v1/uploads/1738839249469-blog_author_image-premium.png	Draft	Are you looking to kickstart your entrepreneurial journey? The "Start-up Hustle" event in Kraków is your chance to connect with experienced founders, take part in workshops, and gain insights into building a successful business.\n\n	http://localhost:5004/api/v1/uploads/1738839249457-blog_image-photo-1556761175-5973dc0f32e7.png	0	2025-02-06 10:54:09.504	2025-02-06 11:06:40.903
d1b6a4a9-2073-4e0d-b274-553aa48d71c0	Get Active and Competitive: The Ultimate Sports Tournament for Students in Poznań	<p>Get ready for a day packed with action, friendly competition, and university spirit! The "Campus Clash: Ultimate Sports Tournament" in Poznań brings together students from across the city for a series of exciting tournaments in various sports. Whether you're an athlete or just looking to have fun, this event is designed for everyone.</p><h3>What to Expect:</h3><ul><li><strong>Multiple Sports Tournaments:</strong> The event features a variety of sports, including football, basketball, volleyball, and more. Teams will face off in a series of competitive matches, but it’s all in good fun. Whether you’re a seasoned player or a beginner, there’s a spot for you!</li><li><strong>Team Building &amp; Spirit:</strong> It’s not just about winning—it’s about building camaraderie, showing team spirit, and getting involved with your university community. Gather your friends, form a team, and bring your A-game.</li><li><strong>Prizes &amp; Recognition:</strong> While the goal is to have fun, there will also be prizes for the top-performing teams. Whether it’s a trophy for your school or a gift card for a local spot, you’ll leave with something to remember.</li><li><strong>Afterparty:</strong> After the tournament, let loose at the afterparty! Celebrate your victories or just enjoy the end of the day with your new friends.</li></ul><h3>Why You Should Join:</h3><ul><li><strong>Physical Activity:</strong> It's the perfect way to break away from studying and get your body moving. Plus, sports are a great way to relieve stress.</li><li><strong>Networking and Socializing:</strong> Whether you’re playing or cheering on your friends, this event provides a chance to connect with other students from different universities and backgrounds.</li><li><strong>Healthy Competition:</strong> Participate in a healthy and friendly competitive environment that focuses on fun and teamwork.</li></ul><p>The "Campus Clash" tournament is a fantastic way to engage with your peers, stay active, and experience the excitement of university sports. Sign up now and get ready for an action-packed day!</p>	Janusz Jankowski	Sports, Student Life	http://localhost:5004/api/v1/uploads/1738839293602-blog_author_image-speaker-default.png	Published	"Campus Clash: Ultimate Sports Tournament" is the ultimate sporting event for university students in Poznań. Here’s why you should gather your friends, get your game face on, and join in the fun!\n\n	http://localhost:5004/api/v1/uploads/1738839293520-blog_image-premium_photo-1722945666998-47a978547a4c.png	94	2025-02-06 10:54:53.675	2025-02-07 07:45:16.849
26eeeed8-6107-4b9d-923b-cd31d2ca6e1f	Campus Vibes: How to Make the Most of Live Music Events in Warsaw	<p>The "Campus Vibes: Music &amp; Chill" event is the ultimate gathering for university students in Warsaw who want to experience live music, meet new people, and have a relaxed evening of fun. Hosted at the trendy Nowy Świat street, this event provides the perfect blend of indie performances, DJ sets, and casual socializing.</p><h3>Why You Should Attend:</h3><ul><li><strong>Live Performances:</strong> Local bands bring their unique sound to the stage, giving you the chance to discover up-and-coming talent from your city.</li><li><strong>DJ Sets &amp; Dancefloors:</strong> After the performances, get ready to move to the beats of some of the best local DJs, spinning electronic music that will keep the energy high all night.</li><li><strong>Networking:</strong> Whether you’re meeting new friends or networking with like-minded peers, this is an excellent opportunity to expand your social circle.</li><li><strong>Casual &amp; Fun Atmosphere:</strong> This isn’t your typical “serious” event—it's all about having a great time in a relaxed environment.</li></ul><h3>What You Can Expect:</h3><ul><li><strong>Icebreaker Games:</strong> If you're shy or new to the city, don’t worry! The event will kick off with light-hearted icebreakers designed to help you connect with others.</li><li><strong>Food &amp; Drinks:</strong> Food trucks will offer tasty snacks, and there will be a variety of beverages, including alcoholic and non-alcoholic options for everyone to enjoy.</li><li><strong>Dance-Off Competitions:</strong> Get ready for some friendly competition, where you can show off your best moves on the dance floor. Prizes await the most creative dancers!</li></ul><p>The event runs until late at night, so don’t miss out on the chance to unwind, make lasting memories, and discover new music with your university peers.</p>	Alicja Kowalska	Events / Student Life	http://localhost:5004/api/v1/uploads/1738839206846-blog_author_image-DALLÂ·E.png	Published	If you're a university student in Warsaw looking for a fun and vibrant way to spend your evening, the "Campus Vibes: Music & Chill" event is the perfect escape. Learn more about this exciting event that brings students together through music, food, and networking.\n\n	http://localhost:5004/api/v1/uploads/1738839206832-blog_image-photo-1492684223066-81342ee5ff30.png	122	2025-02-06 10:53:26.907	2025-02-07 07:40:59.586
a9da0eda-91b2-48d5-b30d-2a3c64c62b4f	test	<p>teste</p>	test	test	http://localhost:5004/api/v1/uploads/1738914488938-blog_author_image-Screenshot_2025-02-06_at_17.29.35.png	Published	test	http://localhost:5004/api/v1/uploads/1738914488930-blog_image-Screenshot_2025-02-06_at_17.29.35.png	0	2025-02-07 07:48:08.96	2025-02-07 07:48:15.515
3808f12f-5399-4953-855a-f4fda0ea0fab	Taking Care of Your Mind: Mental Health & Wellness Day at Gdańsk University	<p>Taking care of your mental well-being is as important as your physical health, and the "Mindful Campus: Mental Health &amp; Wellness Day" event in Gdańsk provides university students with the tools and resources they need to cope with stress, anxiety, and the challenges of student life.</p><h3>What to Expect:</h3><ul><li><strong>Guided Meditation &amp; Yoga Sessions:</strong> Start your day with a calming meditation or join a yoga session to relax your body and mind. These activities are designed to help you unwind, de-stress, and recharge.</li><li><strong>Workshops on Mental Health:</strong> Throughout the day, experts will run workshops on topics like stress management, coping with exam pressure, and building emotional resilience.</li><li><strong>Peer Support Groups:</strong> Join informal discussion groups where you can talk to fellow students about the challenges you face and share strategies for managing mental health in university.</li><li><strong>Panel Discussion:</strong> A panel of mental health professionals and students will discuss how to address mental health stigma and the importance of self-care during your academic journey.</li></ul><h3>Why This Event is Important:</h3><ul><li><strong>Breaking the Stigma:</strong> Mental health struggles are common, especially among university students. This event helps to normalize discussions around mental health and encourage students to seek help when needed.</li><li><strong>Practical Advice:</strong> Learn easy-to-apply strategies to improve your well-being and create a balanced life while juggling academics and personal challenges.</li></ul><p>Whether you're feeling overwhelmed or just want to learn ways to relax, the "Mindful Campus" event is a great opportunity to focus on your mental health and build a healthy mindset.</p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p>4o mini</p>	Magdalena Zielińska	Wellness, Student Events	http://localhost:5004/api/v1/uploads/1738839363587-blog_author_image-speaker-default.png	Published	University life can be stressful, but taking care of your mental health is essential. The "Mindful Campus: Mental Health & Wellness Day" in Gdańsk offers practical tips and resources to help students thrive.	http://localhost:5004/api/v1/uploads/1738839363569-blog_image-premium_photo-1664300371252-a95ebac5704b.png	74	2025-02-06 10:56:03.608	2025-02-07 07:45:25.43
\.


--
-- Data for Name: Bookmark; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Bookmark" ("userId", "blogId", "createdAt") FROM stdin;
9a291949-a3fa-415b-85fe-de919a3e0e7a	d1b6a4a9-2073-4e0d-b274-553aa48d71c0	2025-02-07 06:51:54.877
9a291949-a3fa-415b-85fe-de919a3e0e7a	26eeeed8-6107-4b9d-923b-cd31d2ca6e1f	2025-02-07 07:14:36.08
3765435b-b0cb-40ef-9c3a-8c67c56a2497	3808f12f-5399-4953-855a-f4fda0ea0fab	2025-02-07 07:45:29.217
\.


--
-- Data for Name: City; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."City" (id, name, "createdAt", "updatedAt") FROM stdin;
8475d0e3-d012-4deb-8f3b-9dff589e31bc	Warsaw	2025-02-06 03:00:59.548	2025-02-06 03:00:59.548
f845e0ca-6639-41b5-8256-e88880b4e7a5	Kraków	2025-02-06 03:00:59.554	2025-02-06 03:00:59.554
38ae3c01-5a26-4543-90c5-31d3f9d8342c	Wrocław	2025-02-06 03:00:59.555	2025-02-06 03:00:59.555
fd8e3f9f-b060-4e06-9448-efeeaed0b2e5	test	2025-02-06 11:08:25.636	2025-02-06 11:08:25.636
\.


--
-- Data for Name: Event; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Event" (id, name, description, datetime, location, event_type, event_status, organizer, max_participants, agenda, speaker, event_thumbnail, "createdAt", "updatedAt") FROM stdin;
1a35895e-6cd2-49d5-8086-5be3cc3c2388	Campus Vibes: Music & Chill	Join us for an unforgettable evening of live music, fun games, and good vibes! "Campus Vibes" is the ultimate hangout for university students, where you can unwind, meet new people, and enjoy an evening full of energy. Expect live local bands, DJ sets, food trucks, and casual conversations with your peers. Whether you’re into indie, pop, or electronic beats, there’s something here for everyone. Bring your friends, bring your energy, and let’s make it a night to remember!	2025-02-11 18:00:00	Warsaw, ul. Nowy Świat 15	Social	Ongoing	Student Union Warsaw	18	["7:00 PM: Welcome Drinks & Icebreaker Games", "7:45 PM: Live Indie Band Performance", "8:30 PM: DJ Set – Dance the Night Away", "9:30 PM: Chill-out Session with Snacks & Networking", "10:00 PM: Dance-off Competition"]	[{"name": "No formal speakers", "role": "just good vibes and fun hosts!", "image_url": "https://plus.unsplash.com/premium_photo-1661725171165-e03619370a9e?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}]	http://localhost:5004/api/v1/uploads/1738838631190-event_image-premium_photo-1722945666998-47a978547a4c.png	2025-02-06 03:11:27.839	2025-02-07 07:46:47.16
e944acd2-ae96-49bf-9af8-53c78d96f11f	test	test	2025-02-20 13:23:00	test	Conference	Upcoming	te	11	[]	[]	http://localhost:5004/api/v1/uploads/1738914446168-event_image-Screenshot_2025-02-05_at_12.11.19.png	2025-02-07 07:47:26.264	2025-02-07 07:47:26.264
28829281-25b4-44ef-b9c3-2b52801ea2a5	Start-up Hustle: Innovate Your Future	Are you passionate about creating your own business? Whether you're an aspiring entrepreneur or just interested in the start-up world, this event is for you! "Start-up Hustle" brings together students, young innovators, and experienced entrepreneurs to share ideas, discuss trends, and explore how to turn ideas into reality. Get ready for workshops, networking, and a panel of successful start-up founders who have been where you are now. Let’s start building tomorrow’s businesses today!\n\n	2025-02-28 08:35:00	Kraków, ul. Floriańska 10	Workshop	Upcoming	Kraków Student Entrepreneurs Club	11	["10:00 AM: Registration & Coffee Networking", "10:30 AM: Keynote Speaker: \\"From Idea to Reality\\"", "11:15 AM: Breakout Workshop: \\"Building a Start-up from Scratch\\"", "12:30 PM: Panel Discussion with Young Entrepreneurs", "1:30 PM: Networking Lunch & Pitch Session", "2:30 PM: Wrap-up & Action Steps"]	[{"name": "Anna Nowak", "role": "Founder of TechNext", "image_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZSUyMGltYWdlfGVufDB8fDB8fHww"}, {"name": "Paweł Kwiatkowski", "role": "CEO of UrbanEco Start-up", "image_url": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZSUyMGltYWdlfGVufDB8fDB8fHww"}]	http://localhost:5004/api/v1/uploads/1738838807069-event_image-photo-1556761175-5973dc0f32e7.png	2025-02-06 07:32:50.259	2025-02-06 10:46:47.132
f25cb54a-6943-48fd-8930-6e2ddeefd9a6	Poland’s Young Creatives: Art & Culture Expo	Wrocław’s biggest creative exhibition is back! Whether you’re an artist or simply love art, this event is the place to be. Young artists from all over Poland are showcasing their work, from paintings and sculptures to digital art and performance. It’s not just an exhibition; it’s a celebration of youth, creativity, and expression. Come and explore, get inspired, and meet the faces behind the art. Plus, enjoy live performances, interactive art stations, and workshops to boost your own creative energy!\n\n	2025-02-07 10:11:00	Wrocław, ul. Kazimierza 12	Social	Ongoing	Wrocław Art Society	100	["4:00 PM: Opening Ceremony & Gallery Walkthrough", "5:00 PM: Live Art Performance", "7:00 PM: Creative Networking & Social Hour", "8:00 PM: Open Mic – Show Your Talent"]	[]	http://localhost:5004/api/v1/uploads/1738812422020-event_image-photo-1492684223066-81342ee5ff30.png	2025-02-06 03:12:42.115	2025-02-06 10:48:17.191
044e64e3-b598-4406-9b9b-b706d95c47ac	Mindful Campus: Mental Health & Wellness Day	It’s time to focus on YOU! "Mindful Campus" is an event dedicated to promoting mental health, self-care, and wellness among university students. Join us for a day of guided meditation, stress-relief activities, workshops on mental health, and open discussions about balancing university life and mental well-being. Learn practical tips, connect with wellness experts, and relax in a supportive, safe space. This is your opportunity to recharge, relax, and discover resources to maintain a healthy mind throughout your studies.\n\n	2025-02-09 13:20:00	Gdańsk, ul. Długie Pobrzeże 23	Conference	Ongoing	Gdańsk Student Health Initiative	23	[]	[{"name": "Dr. Karolina Szymańska", "role": "Psychologist & Mental Health Advocate", "image_url": ""}, {"name": "Paweł Bąk", "role": "Mindfulness Coach", "image_url": ""}]	http://localhost:5004/api/v1/uploads/1738838990573-event_image-premium_photo-1664300371252-a95ebac5704b.png	2025-02-06 09:20:55.876	2025-02-06 10:49:50.679
6f0fa396-cb3b-4181-91c8-72a6941ce76a	test	just a test	2025-02-14 13:04:00	avenida	Social	Ongoing	test	12	["test"]	[{"name": "name", "role": "role", "image_url": "test"}]	http://localhost:5004/api/v1/uploads/1738839905994-event_image-speaker-default.png	2025-02-06 11:05:06.026	2025-02-06 11:05:06.026
\.


--
-- Data for Name: EventBookmark; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."EventBookmark" ("userId", "eventId", "createdAt") FROM stdin;
c108388f-b3a2-4c3a-8d0c-014e4a42568f	28829281-25b4-44ef-b9c3-2b52801ea2a5	2025-02-06 09:31:39.107
9a291949-a3fa-415b-85fe-de919a3e0e7a	1a35895e-6cd2-49d5-8086-5be3cc3c2388	2025-02-07 06:37:17.17
9a291949-a3fa-415b-85fe-de919a3e0e7a	f25cb54a-6943-48fd-8930-6e2ddeefd9a6	2025-02-07 06:37:19.344
3765435b-b0cb-40ef-9c3a-8c67c56a2497	f25cb54a-6943-48fd-8930-6e2ddeefd9a6	2025-02-07 07:45:01.777
\.


--
-- Data for Name: University; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."University" (id, name, "createdAt", "updatedAt") FROM stdin;
072e219f-5129-4cba-8166-b5379a689256	University of Warsaw	2025-02-06 03:00:59.556	2025-02-06 03:00:59.556
67a87b23-3efb-447e-96ac-1c2fd5f7f18f	Jagiellonian University	2025-02-06 03:00:59.558	2025-02-06 03:00:59.558
fb6e098a-f159-4816-af62-f9999854da88	Wrocław University of Science and Technology	2025-02-06 03:00:59.558	2025-02-06 03:00:59.558
10396589-6435-4ea5-8940-2b479ce03859	test	2025-02-06 11:08:20.172	2025-02-06 11:08:20.172
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."User" (id, first_name, last_name, email, password, status, profile_url, gender, "cityId", "universityId", role, "createdAt", "updatedAt") FROM stdin;
7b50a17c-6a48-4188-b14e-c9c6287ed621	hamid	hamid	hamid@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$EVJmubndpwjSjyTuWXbrLA$dRBnop5h7Liqj6XjTZdZEUapBaGV8FIJ6DTZ9I/i0hs	t	http://localhost:5004/api/v1/uploads/1738840051776-7b50a17c-6a48-4188-b14e-c9c6287ed621-speaker-default.png	male	38ae3c01-5a26-4543-90c5-31d3f9d8342c	67a87b23-3efb-447e-96ac-1c2fd5f7f18f	admin	2025-02-06 03:05:22.317	2025-02-06 11:07:38.33
9a291949-a3fa-415b-85fe-de919a3e0e7a	test	test	test@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$/tXDR/ZlsPrfsa9TkMrB9g$XRhe259Cx5p3Mor2kZYG0kFv1NCo3+O1g3Ux1NcP7r8	t	http://localhost:5004/api/v1/uploads/1738811363765-9a291949-a3fa-415b-85fe-de919a3e0e7a-DALLÂ·E.png	female	fd8e3f9f-b060-4e06-9448-efeeaed0b2e5	10396589-6435-4ea5-8940-2b479ce03859	user	2025-02-06 03:09:23.712	2025-02-06 11:09:03.831
b58c3611-521c-4ff4-9aea-ba47ec06bd24	sami	sami	samm@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$4AW27EYvwnzZc97aAHaNTQ$sYgfamX5w4LC92Dh5J/MqN27U0SKMZyAgJ6sTdhD6SE	t	http://localhost:5004/api/v1/uploads/1738839707410-b58c3611-521c-4ff4-9aea-ba47ec06bd24-DALLÂ·E.png	male	38ae3c01-5a26-4543-90c5-31d3f9d8342c	67a87b23-3efb-447e-96ac-1c2fd5f7f18f	user	2025-02-06 10:59:20.056	2025-02-06 11:01:47.416
2b35c43b-acc4-4d78-96a7-264191d27909	all	al	al@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$8tu4Tr2e8mVvtJRkfJKnVg$CvhHkJi6XmJTesNrRrC0Ustl/l0bdgAPME8/sVgMMis	t	http://localhost:5004/api/v1/uploads/1738826317040-2b35c43b-acc4-4d78-96a7-264191d27909-DALLÂ·E.png	male	38ae3c01-5a26-4543-90c5-31d3f9d8342c	67a87b23-3efb-447e-96ac-1c2fd5f7f18f	user	2025-02-06 07:18:27.981	2025-02-06 07:54:15.942
3765435b-b0cb-40ef-9c3a-8c67c56a2497	test1	test1	test11@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$kOpR9Ofl20o/ir9NsdyPZw$C7HoL2M4TFsiu4h+jbsqNZWnn2HQdL9MCIjO3jJ1cYk	t	http://localhost:5004/api/v1/uploads/1738914265012-3765435b-b0cb-40ef-9c3a-8c67c56a2497-DALLÂ·Ej.png	male	38ae3c01-5a26-4543-90c5-31d3f9d8342c	072e219f-5129-4cba-8166-b5379a689256	user	2025-02-07 07:44:09.541	2025-02-07 07:45:43.828
c0d46ed4-718e-4c12-aa54-5e47160b1140	sam	leo	lo@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$UECp0KtbOV/kGaYOw2PM8Q$O7SmF0695xvpE5wDZwh7nmrx2QFxH5L3TmjzCOUSSt8	t	http://localhost:5004/api/v1/uploads/1738824670743-c0d46ed4-718e-4c12-aa54-5e47160b1140-DALLÂ·Ej.png	male	f845e0ca-6639-41b5-8256-e88880b4e7a5	67a87b23-3efb-447e-96ac-1c2fd5f7f18f	user	2025-02-06 06:50:08.805	2025-02-06 06:51:10.75
36fbb2a8-7b3e-4763-bb3b-110e2d5b7848	sam12	sam12	sam@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$YlefBS4+540XSAB8khP6jg$BB2isWYdDpHchhxdWRNY2JwxQGUubj3MLvJ33RRlRjk	t	http://localhost:5004/api/v1/uploads/1738825060659-36fbb2a8-7b3e-4763-bb3b-110e2d5b7848-speaker-default.png	female	8475d0e3-d012-4deb-8f3b-9dff589e31bc	67a87b23-3efb-447e-96ac-1c2fd5f7f18f	admin	2025-02-06 06:54:00.226	2025-02-06 11:03:22.717
9ac4fa15-821f-4681-8f77-014e5d426184	test	test	ttes12312@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$ffOyEBfrZJ51/dR16EiG/A$Q2uKd1LVQyR5TBYgcP5EKu4XmJJg25hxC0+5zyDU4rM	t	http://localhost:5004/api/v1/uploads/1738914574287-9ac4fa15-821f-4681-8f77-014e5d426184-Screenshot_2025-02-06_at_17.34.05.png	male	8475d0e3-d012-4deb-8f3b-9dff589e31bc	072e219f-5129-4cba-8166-b5379a689256	user	2025-02-07 07:49:34.259	2025-02-07 07:49:34.293
c108388f-b3a2-4c3a-8d0c-014e4a42568f	seif	seif	see@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$0mfBwZXuz7Nk6Ux4FJ/CMw$vrADLyjMRGhpkyPqb2PGquz7SeI0nuPAdCbd7kWEhaQ	t	http://localhost:5004/api/v1/uploads/1738834334711-c108388f-b3a2-4c3a-8d0c-014e4a42568f-speaker-default.png	female	8475d0e3-d012-4deb-8f3b-9dff589e31bc	67a87b23-3efb-447e-96ac-1c2fd5f7f18f	user	2025-02-06 09:30:02.265	2025-02-07 07:49:41.146
\.


--
-- Data for Name: UserActivity; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."UserActivity" (id, "userId", activity, "createdAt") FROM stdin;
e7192271-309d-463b-bfe1-1e85e4e1f969	7b50a17c-6a48-4188-b14e-c9c6287ed621	New user registered: hamid hamid	2025-02-06 03:05:39.908
3d13cfb6-4b0b-492c-99d5-b84bb36352e4	7b50a17c-6a48-4188-b14e-c9c6287ed621	User profile updated: hamid1 hamid	2025-02-06 03:06:46.554
a470cd55-3c2f-4996-9f57-98dd87adb3c8	7b50a17c-6a48-4188-b14e-c9c6287ed621	User profile updated: hamid1 hamid1	2025-02-06 03:06:48.779
69b6df00-3a27-473a-b636-c09dd60325de	7b50a17c-6a48-4188-b14e-c9c6287ed621	User profile updated: hamid1 hamid1	2025-02-06 03:06:52.445
2f9178a4-35cd-4265-baac-8c9ab04f3d10	7b50a17c-6a48-4188-b14e-c9c6287ed621	User profile updated: hamid1 hamid1	2025-02-06 03:06:55.806
85c7b3b5-2795-4af7-90d2-b74d588ee502	7b50a17c-6a48-4188-b14e-c9c6287ed621	User profile updated: hamid1 hamid1	2025-02-06 03:07:15.001
bbda8872-f668-467d-93d3-1ba68b7f0ee6	9a291949-a3fa-415b-85fe-de919a3e0e7a	New user registered: test test	2025-02-06 03:09:23.791
e30ca8b7-af01-4a1b-86bb-6d5335f80ae6	9a291949-a3fa-415b-85fe-de919a3e0e7a	User profile updated: test test	2025-02-06 03:09:38.413
02ea2f8e-4c93-4bcf-9396-05064f7a452e	9a291949-a3fa-415b-85fe-de919a3e0e7a	User profile updated: test test	2025-02-06 03:09:46.978
6027bb80-ce45-4aa3-b358-71cee38af4e1	9a291949-a3fa-415b-85fe-de919a3e0e7a	User profile updated: test test	2025-02-06 03:09:55.324
9124f917-51d6-4e84-ac5f-01f9642d08fb	7b50a17c-6a48-4188-b14e-c9c6287ed621	Event bookmarked	2025-02-06 03:13:31.042
5e671d8f-e6d2-42cf-a28b-d5afdab6c782	7b50a17c-6a48-4188-b14e-c9c6287ed621	Joined event	2025-02-06 03:13:41.873
1f0847b7-a980-4e19-a437-fb3772dc7675	7b50a17c-6a48-4188-b14e-c9c6287ed621	Left event	2025-02-06 03:13:52.677
821fd541-1b2e-41fc-8225-ba15d56bbdca	7b50a17c-6a48-4188-b14e-c9c6287ed621	Joined event	2025-02-06 03:13:57.99
c9e9fa59-57f9-4da1-bb77-02d6221e3263	7b50a17c-6a48-4188-b14e-c9c6287ed621	Left event	2025-02-06 03:14:04.472
9cf5a20b-c467-4a77-91b8-abbfe2d00f4b	7b50a17c-6a48-4188-b14e-c9c6287ed621	Joined event	2025-02-06 03:14:12.906
0441ba12-e6d1-4eac-ae2a-9d1ef1726ae7	7b50a17c-6a48-4188-b14e-c9c6287ed621	Left event	2025-02-06 03:14:45.829
389750ca-e99a-4c78-9160-750bd9f343b9	7b50a17c-6a48-4188-b14e-c9c6287ed621	Blog post bookmarked	2025-02-06 03:16:46.883
89c1f9e2-fdae-42ed-950b-898c760aa5b1	7b50a17c-6a48-4188-b14e-c9c6287ed621	Blog post bookmarked	2025-02-06 03:18:02.829
6e3952cf-28f4-4e4c-b73a-8e4657625534	7b50a17c-6a48-4188-b14e-c9c6287ed621	Blog post bookmarked	2025-02-06 03:18:13.567
f24e074b-2603-4276-9bb7-e7873f9488e8	7b50a17c-6a48-4188-b14e-c9c6287ed621	Blog post bookmarked	2025-02-06 03:18:15.111
722e9d8c-d98e-420f-8007-823129e49d47	7b50a17c-6a48-4188-b14e-c9c6287ed621	Joined event	2025-02-06 03:19:01.106
f6deac17-ecbf-458b-af4e-e2f41ff8d852	7b50a17c-6a48-4188-b14e-c9c6287ed621	Event bookmarked	2025-02-06 03:19:20.399
c9d9ea0b-f5ed-4aba-858a-9f6426e55e3f	7b50a17c-6a48-4188-b14e-c9c6287ed621	Left event	2025-02-06 03:19:30.578
d3ae7056-1829-478b-bd41-b61c945647e7	7b50a17c-6a48-4188-b14e-c9c6287ed621	Blog post bookmarked	2025-02-06 03:20:09.535
df8c3066-aa5b-4db2-b33b-2f5602459793	7b50a17c-6a48-4188-b14e-c9c6287ed621	Blog post bookmarked	2025-02-06 03:20:23.389
c65bec31-7e3e-4c25-8c6e-a17e3f33a84f	7b50a17c-6a48-4188-b14e-c9c6287ed621	User profile updated: hamid hamid	2025-02-06 03:20:38.326
2153de2a-a138-4783-8bb9-47db1b8ebb20	7b50a17c-6a48-4188-b14e-c9c6287ed621	User profile updated: hamid hamid	2025-02-06 03:20:56.337
78f62e8b-0228-4c5e-a945-8c9d4d3a77d3	7b50a17c-6a48-4188-b14e-c9c6287ed621	Joined event	2025-02-06 03:21:16.005
e8167ab1-068a-4aa2-a1e8-4f4b664c69b0	7b50a17c-6a48-4188-b14e-c9c6287ed621	Left event	2025-02-06 03:21:17.47
5e101f27-85be-4a64-94ef-10a01dca8d4e	7b50a17c-6a48-4188-b14e-c9c6287ed621	Joined event	2025-02-06 03:21:23.569
af155dd2-3ef2-4d45-9ef3-4055689fbaef	9a291949-a3fa-415b-85fe-de919a3e0e7a	User profile updated: test test	2025-02-06 03:23:13.532
b09cb495-6a0a-4461-9e60-a63e92f8adbf	9a291949-a3fa-415b-85fe-de919a3e0e7a	User profile updated: test test	2025-02-06 03:23:34.392
86695f54-23ae-4dd0-ac48-807add72014f	7b50a17c-6a48-4188-b14e-c9c6287ed621	Left event	2025-02-06 03:24:18.131
5a1c405d-134e-45a1-9ad5-d2583bc68196	7b50a17c-6a48-4188-b14e-c9c6287ed621	Joined event	2025-02-06 03:24:59.332
3d6f4ce2-dbdd-4df7-8e8a-b72f88fd58bd	7b50a17c-6a48-4188-b14e-c9c6287ed621	Left event	2025-02-06 03:25:02.402
b0f7b680-9708-4ab4-9ba9-9a0c0ca27ca6	c0d46ed4-718e-4c12-aa54-5e47160b1140	New user registered: sam leo	2025-02-06 06:50:23.074
20ee3f36-881c-46b1-b055-6d3453911bc8	c0d46ed4-718e-4c12-aa54-5e47160b1140	New user registered: sam leo	2025-02-06 06:51:10.777
94dab731-7809-4637-88bc-b2935fa4ae93	36fbb2a8-7b3e-4763-bb3b-110e2d5b7848	New user registered: sam sam	2025-02-06 06:54:10.901
87687076-594a-4798-8fb6-d532a4eec336	36fbb2a8-7b3e-4763-bb3b-110e2d5b7848	New user registered: sam sam	2025-02-06 06:57:40.693
b5e99e1b-716f-473d-b6b2-488072afbf0f	7b50a17c-6a48-4188-b14e-c9c6287ed621	User profile updated: hamid hamid	2025-02-06 06:58:28.775
ad0d3f83-f8e2-438a-b58c-f57dee62f2b8	2b35c43b-acc4-4d78-96a7-264191d27909	New user registered: al al	2025-02-06 07:18:37.068
cd558230-f4e4-4dd0-8960-10b45e5e42e0	2b35c43b-acc4-4d78-96a7-264191d27909	Joined event	2025-02-06 07:18:41.837
9265061e-fd2b-4b93-bc65-e719ab776e49	2b35c43b-acc4-4d78-96a7-264191d27909	Left event	2025-02-06 07:18:50.98
f1d5c31f-cacd-4c02-9d1a-002b02070026	2b35c43b-acc4-4d78-96a7-264191d27909	Joined event	2025-02-06 07:19:24.928
54189922-fdef-4906-902a-9f464f4ce2ea	2b35c43b-acc4-4d78-96a7-264191d27909	Event updated: test	2025-02-06 07:19:24.95
d19ed7f0-6f43-4bd7-8b19-7ac2d4312974	2b35c43b-acc4-4d78-96a7-264191d27909	Joined event	2025-02-06 07:19:35.209
f5819412-8506-4933-9124-7ebbf02298ad	2b35c43b-acc4-4d78-96a7-264191d27909	Event bookmarked	2025-02-06 07:19:41.527
4755d7d7-045b-44d6-bf84-fe6bb127eec7	2b35c43b-acc4-4d78-96a7-264191d27909	Left event	2025-02-06 07:31:10.845
d6c97f7a-c1bb-4e05-9860-2af2d78dd26f	2b35c43b-acc4-4d78-96a7-264191d27909	Event bookmarked	2025-02-06 07:33:04.487
c4143b06-a1e9-4990-8b0b-d350f5b8eb8b	2b35c43b-acc4-4d78-96a7-264191d27909	Event bookmarked	2025-02-06 07:33:05.714
9bc3be77-9048-45ee-a738-2ff7efa3eb00	2b35c43b-acc4-4d78-96a7-264191d27909	Left event	2025-02-06 07:33:42.487
3f0a7ab6-113a-4d96-afad-fc81d52bb4ef	2b35c43b-acc4-4d78-96a7-264191d27909	Joined event	2025-02-06 07:34:06.397
ec80efc3-4c7b-4fce-94ff-195f82b0849b	2b35c43b-acc4-4d78-96a7-264191d27909	Event updated: test	2025-02-06 07:34:06.407
c9f9fce6-9e87-4d26-b1fc-0bfb0a20b573	2b35c43b-acc4-4d78-96a7-264191d27909	Joined event	2025-02-06 07:37:02.66
6f4e087b-e399-4f77-a91d-c99d87761c68	2b35c43b-acc4-4d78-96a7-264191d27909	Left event	2025-02-06 07:37:06.9
cb11a736-94cb-41b7-8898-2cdc2458dd7e	2b35c43b-acc4-4d78-96a7-264191d27909	Left event	2025-02-06 07:44:44.42
30c5aff1-990c-4301-aadb-cd714e518c5d	2b35c43b-acc4-4d78-96a7-264191d27909	Joined event	2025-02-06 07:45:23.724
28d6964f-2949-4f0b-bd8f-97037127dc7e	2b35c43b-acc4-4d78-96a7-264191d27909	Joined event	2025-02-06 07:45:41.469
5f301a12-599f-4c75-806f-777dbc128f45	2b35c43b-acc4-4d78-96a7-264191d27909	Left event	2025-02-06 07:45:58.668
e2c6ad0d-5127-45af-b135-060d5f9b00bf	2b35c43b-acc4-4d78-96a7-264191d27909	Joined event	2025-02-06 07:46:01.408
318d2e11-6a28-4a48-94aa-5a6848b7b138	2b35c43b-acc4-4d78-96a7-264191d27909	Left event	2025-02-06 07:46:08.821
a9c82c81-fe34-48d6-9778-f0d6b4c85f91	2b35c43b-acc4-4d78-96a7-264191d27909	Left event	2025-02-06 07:46:12.194
1e58d371-aada-4bee-b4b7-aa44e805c050	2b35c43b-acc4-4d78-96a7-264191d27909	User profile updated: all al	2025-02-06 07:54:07.959
152036a4-cf02-4ef5-8ec5-61b882fbfb9e	2b35c43b-acc4-4d78-96a7-264191d27909	User profile updated: all al	2025-02-06 07:54:10.849
86ed51e3-1275-42af-a079-ecebabe3ddde	2b35c43b-acc4-4d78-96a7-264191d27909	User profile updated: all al	2025-02-06 07:54:15.951
7ea0d666-18e6-421c-b9fe-320a3eebbf61	2b35c43b-acc4-4d78-96a7-264191d27909	Event bookmarked	2025-02-06 07:54:59.392
8b66d725-beae-4189-8e33-fcae212f56be	2b35c43b-acc4-4d78-96a7-264191d27909	Joined event	2025-02-06 07:58:47.507
b6af01dc-0441-4c78-bf43-9b559afe7d7f	2b35c43b-acc4-4d78-96a7-264191d27909	Event updated: something	2025-02-06 07:58:47.527
94b5cccf-bb0d-41b2-ad44-4b232ff77398	2b35c43b-acc4-4d78-96a7-264191d27909	Left event	2025-02-06 07:58:50.397
4280cabe-c2d4-4ac1-a5a1-5cbe50f2bf57	2b35c43b-acc4-4d78-96a7-264191d27909	Joined event	2025-02-06 07:59:47.699
74e69cd4-d030-44d3-a86b-8db78116e6b7	2b35c43b-acc4-4d78-96a7-264191d27909	Event updated: something	2025-02-06 07:59:47.722
dca9c0a3-613e-4acd-b89f-dfac0413ce88	2b35c43b-acc4-4d78-96a7-264191d27909	Left event	2025-02-06 07:59:50.084
fe8ecf65-d398-41c5-8e23-d046d65e9265	2b35c43b-acc4-4d78-96a7-264191d27909	Joined event	2025-02-06 08:00:35.682
4d4c15e4-11ac-4f08-a37f-d3b8fe250f56	2b35c43b-acc4-4d78-96a7-264191d27909	Left event	2025-02-06 08:00:39.758
b94b64d8-0eae-4965-b7a7-79c02d0b079d	2b35c43b-acc4-4d78-96a7-264191d27909	Joined event	2025-02-06 08:03:32.991
1b636297-e635-4a5a-8d1d-50a7c0a25a52	2b35c43b-acc4-4d78-96a7-264191d27909	Event updated: something	2025-02-06 08:03:33.038
c4afedb3-e16d-44a9-9bbc-551f9852f1c4	2b35c43b-acc4-4d78-96a7-264191d27909	Left event	2025-02-06 08:03:39.852
ec4748bc-2ac0-48ed-817b-d083a55253ab	2b35c43b-acc4-4d78-96a7-264191d27909	Joined event	2025-02-06 08:11:20.22
2018a1e5-47e3-494b-8109-b86da7e0dc2b	2b35c43b-acc4-4d78-96a7-264191d27909	Left event	2025-02-06 08:11:22.06
2d3ca5c8-63df-4a18-b95d-c2d4dec9d5be	2b35c43b-acc4-4d78-96a7-264191d27909	Joined event	2025-02-06 08:11:23.955
66acce16-2247-4d58-925e-9d547e77b92e	2b35c43b-acc4-4d78-96a7-264191d27909	Left event	2025-02-06 08:11:29.51
8bd5718f-7403-4d6f-ae77-97ad6bccbea3	7b50a17c-6a48-4188-b14e-c9c6287ed621	User profile updated: hamid1 hamid1	2025-02-06 09:28:04.493
454409ef-ef3b-48cd-a7c1-3f729ea194cf	7b50a17c-6a48-4188-b14e-c9c6287ed621	User profile updated: hamid1 hamid1	2025-02-06 09:28:11.99
38282cb7-2902-40fe-b697-3beaaf83be2d	7b50a17c-6a48-4188-b14e-c9c6287ed621	Event updated: test	2025-02-06 09:29:11.616
7c74b648-a06e-49bb-802c-51ca73c994d5	c108388f-b3a2-4c3a-8d0c-014e4a42568f	New user registered: seif seif	2025-02-06 09:30:14.636
8c8e6984-4424-421f-93f9-7135c642236b	c108388f-b3a2-4c3a-8d0c-014e4a42568f	Joined event	2025-02-06 09:30:30.531
7ddd7c7e-32bb-42d5-a64e-1122a8bf8879	c108388f-b3a2-4c3a-8d0c-014e4a42568f	Joined event	2025-02-06 09:30:32.719
3cebeaa6-1291-4197-8802-55d8f3dd5fc5	c108388f-b3a2-4c3a-8d0c-014e4a42568f	Joined event	2025-02-06 09:30:55.992
4af095c0-b74d-443a-85d3-23b77d3d8df5	c108388f-b3a2-4c3a-8d0c-014e4a42568f	Left event	2025-02-06 09:31:12.821
48671c86-ae4e-4ee0-b0a2-dbc98c0d94d3	7b50a17c-6a48-4188-b14e-c9c6287ed621	Event updated: test	2025-02-06 09:31:20.707
a7e61e9a-0c5c-4ca3-83da-0ad8837a55d5	7b50a17c-6a48-4188-b14e-c9c6287ed621	Event updated: test	2025-02-06 09:31:34.475
0d75aa4a-77c5-4db8-acdf-b53b6b4c5b45	c108388f-b3a2-4c3a-8d0c-014e4a42568f	Event bookmarked	2025-02-06 09:31:39.104
e8bfec72-be06-47cb-bcce-92740e5f1088	c108388f-b3a2-4c3a-8d0c-014e4a42568f	Blog post bookmarked	2025-02-06 09:32:01.74
c6c724fd-cfff-4877-ac07-cffdd52a01f4	c108388f-b3a2-4c3a-8d0c-014e4a42568f	Blog post bookmarked	2025-02-06 09:32:03.389
b49513f9-3c79-4f08-beed-35b3f91106a4	c108388f-b3a2-4c3a-8d0c-014e4a42568f	User profile updated: seif seif	2025-02-06 09:32:14.724
fb876be7-8ef5-4c78-8ebf-c41adacb2af2	c108388f-b3a2-4c3a-8d0c-014e4a42568f	Blog post bookmarked	2025-02-06 09:37:39.476
a8534b18-dafa-4609-9c87-cc982264808a	c108388f-b3a2-4c3a-8d0c-014e4a42568f	Blog post bookmarked	2025-02-06 09:37:41.003
63cdb0e1-bce8-456a-9276-c7bef269cbd8	7b50a17c-6a48-4188-b14e-c9c6287ed621	Event updated: Campus Vibes: Music & Chill	2025-02-06 10:43:51.316
4e60e0b8-74cb-4dad-b674-5aa7bd9d9489	7b50a17c-6a48-4188-b14e-c9c6287ed621	Event updated: Start-up Hustle: Innovate Your Future	2025-02-06 10:46:47.141
1825911b-2a8d-4577-85dd-d5e0abf16379	7b50a17c-6a48-4188-b14e-c9c6287ed621	Event updated: Poland’s Young Creatives: Art & Culture Expo	2025-02-06 10:48:17.205
cf7b612e-17bc-40e9-9622-e8975a4e6dff	7b50a17c-6a48-4188-b14e-c9c6287ed621	Event updated: Mindful Campus: Mental Health & Wellness Day	2025-02-06 10:49:50.69
a15044f6-f04e-46e1-aa85-2b6374b61d68	7b50a17c-6a48-4188-b14e-c9c6287ed621	New blog post updated: 'Campus Vibes: How to Make the Most of Live Music Events in Warsaw'	2025-02-06 10:53:26.914
8500bc66-4a3c-4fe7-9580-0f5f31cf428e	7b50a17c-6a48-4188-b14e-c9c6287ed621	New blog post updated: 'Why the 'Start-up Hustle' Event is a Must for Aspiring Entrepreneurs in Kraków'	2025-02-06 10:54:09.512
1d2e3a42-0114-4e09-89d1-fe93b0b013d1	7b50a17c-6a48-4188-b14e-c9c6287ed621	New blog post updated: 'Get Active and Competitive: The Ultimate Sports Tournament for Students in Poznań'	2025-02-06 10:54:53.695
a3313d29-78f4-4e1e-9116-80e16f41d5ef	7b50a17c-6a48-4188-b14e-c9c6287ed621	New blog post updated: 'Taking Care of Your Mind: Mental Health & Wellness Day at Gdańsk University'	2025-02-06 10:56:03.613
421f8844-af13-4e97-a217-b5b538304158	b58c3611-521c-4ff4-9aea-ba47ec06bd24	New user registered: sam sam	2025-02-06 10:59:39.037
058c223a-c2c0-401a-ae52-2e156234db25	b58c3611-521c-4ff4-9aea-ba47ec06bd24	Joined event	2025-02-06 11:00:15.973
025c9e45-a20c-4ae9-9242-b4a66c70f923	b58c3611-521c-4ff4-9aea-ba47ec06bd24	Left event	2025-02-06 11:00:22.635
4d9e76e3-f6ff-4f7c-86a2-129587344407	b58c3611-521c-4ff4-9aea-ba47ec06bd24	Joined event	2025-02-06 11:00:32.398
e72a2f41-64ed-40f2-b656-a7a5f133c01c	b58c3611-521c-4ff4-9aea-ba47ec06bd24	Event bookmarked	2025-02-06 11:00:40.62
581d5940-189f-4a9b-8754-e14a7654acfa	b58c3611-521c-4ff4-9aea-ba47ec06bd24	Event bookmarked	2025-02-06 11:00:41.754
ef166352-03b8-4005-94ed-fca3c1483869	b58c3611-521c-4ff4-9aea-ba47ec06bd24	Blog post bookmarked	2025-02-06 11:01:04.15
24c0f395-7416-46b7-ace0-591641271b8a	b58c3611-521c-4ff4-9aea-ba47ec06bd24	User profile updated: sami sami	2025-02-06 11:01:34.686
e3a74274-4761-4d98-9d20-3d086f81fe72	b58c3611-521c-4ff4-9aea-ba47ec06bd24	User profile updated: sami sami	2025-02-06 11:01:40.371
33473122-36ad-46d5-be9e-b44bab7dd0e5	b58c3611-521c-4ff4-9aea-ba47ec06bd24	User profile updated: sami sami	2025-02-06 11:01:47.421
0d0a67ea-2fb6-4079-96bf-b1f87d00a78c	36fbb2a8-7b3e-4763-bb3b-110e2d5b7848	User profile updated: sam12 sam12	2025-02-06 11:03:11.725
72162489-a55e-4c34-ba23-33283734b032	36fbb2a8-7b3e-4763-bb3b-110e2d5b7848	User profile updated: sam12 sam12	2025-02-06 11:03:19.683
bec1e154-ba0b-470f-9550-2bac397eb000	36fbb2a8-7b3e-4763-bb3b-110e2d5b7848	User profile updated: sam12 sam12	2025-02-06 11:03:22.723
8c937f5c-638a-41c3-942f-bd51d8a23433	7b50a17c-6a48-4188-b14e-c9c6287ed621	Event updated: Campus Vibes: Music & Chill	2025-02-06 11:04:07.402
d34a4656-c2c7-4140-b01d-43d27c58c9ab	7b50a17c-6a48-4188-b14e-c9c6287ed621	Event updated: Campus Vibes: Music & Chill	2025-02-06 11:04:22.177
dc798ec9-8466-4ef3-9173-22d3ba6386cb	7b50a17c-6a48-4188-b14e-c9c6287ed621	Event created: test	2025-02-06 11:05:06.033
4703d52a-fd3c-4ffa-801b-7b74d91bec24	9a291949-a3fa-415b-85fe-de919a3e0e7a	Joined event	2025-02-06 11:05:41.633
87b334a9-6640-4e70-9c17-4193eb4633e7	9a291949-a3fa-415b-85fe-de919a3e0e7a	Left event	2025-02-06 11:05:54.466
f963f30f-007a-4e87-85c9-41653dd9126c	7b50a17c-6a48-4188-b14e-c9c6287ed621	New blog post updated: 'test'	2025-02-06 11:07:10.972
83bd81f2-64de-4bcd-b1b0-312fa1cce8c8	7b50a17c-6a48-4188-b14e-c9c6287ed621	User profile updated: hamid1 hamid1	2025-02-06 11:07:31.789
2ea62450-ec7a-4e18-8a7d-16016fb9793f	7b50a17c-6a48-4188-b14e-c9c6287ed621	User profile updated: hamid hamid	2025-02-06 11:07:38.334
bc3e37ce-5566-42e5-b173-d54a01ef474f	9a291949-a3fa-415b-85fe-de919a3e0e7a	User profile updated: test test	2025-02-06 11:09:03.841
60a44ab8-d41e-48e7-9441-9b716931892d	9a291949-a3fa-415b-85fe-de919a3e0e7a	Joined event	2025-02-07 01:05:08.298
c3558e4f-84d8-4d20-9228-953823469289	9a291949-a3fa-415b-85fe-de919a3e0e7a	Joined event	2025-02-07 01:05:21.444
b5ec3997-53fb-45d6-bff9-6f0b34aba606	9a291949-a3fa-415b-85fe-de919a3e0e7a	Blog post bookmarked	2025-02-07 01:05:34.59
4272a880-60ad-4415-9115-c70bead97980	9a291949-a3fa-415b-85fe-de919a3e0e7a	Blog post bookmarked	2025-02-07 05:11:14.872
5aaf0db3-4c54-4d76-a6b7-579d3a9fdd22	9a291949-a3fa-415b-85fe-de919a3e0e7a	Blog post bookmarked	2025-02-07 05:19:35.512
2cc090a9-0748-4e33-bbc7-935ba8eb5737	9a291949-a3fa-415b-85fe-de919a3e0e7a	Left event	2025-02-07 06:17:08.05
f11729af-b10a-4155-a7d9-27977403b07e	9a291949-a3fa-415b-85fe-de919a3e0e7a	Blog post bookmarked	2025-02-07 06:25:28.861
01465cb6-37fa-4d8c-87d3-94ff2d7c9a9f	9a291949-a3fa-415b-85fe-de919a3e0e7a	Blog post bookmarked	2025-02-07 06:27:06.444
903c2765-1ada-4fd4-bbcd-e026a21454c5	9a291949-a3fa-415b-85fe-de919a3e0e7a	Blog post bookmarked	2025-02-07 06:31:00.236
01badea3-5598-49a1-ab75-a14b960d8a17	9a291949-a3fa-415b-85fe-de919a3e0e7a	Blog post bookmarked	2025-02-07 06:31:01.836
2f58eff7-6c92-4110-8efe-a6df0583a560	9a291949-a3fa-415b-85fe-de919a3e0e7a	Blog post bookmarked	2025-02-07 06:31:16.424
2ffa35e3-e8fa-4ef8-8886-bb4e0ccafb6f	9a291949-a3fa-415b-85fe-de919a3e0e7a	Left event	2025-02-07 06:37:10.735
e989a7e6-32ae-48f6-b9b9-82f91df3562c	9a291949-a3fa-415b-85fe-de919a3e0e7a	Joined event	2025-02-07 06:37:13.767
b56888c7-db81-4561-9962-82f04d89b9ab	9a291949-a3fa-415b-85fe-de919a3e0e7a	Event bookmarked	2025-02-07 06:37:17.166
ddc51f0b-bf7e-4058-8e3f-54f945dde6ea	9a291949-a3fa-415b-85fe-de919a3e0e7a	Event bookmarked	2025-02-07 06:37:19.339
9ef6f039-9b03-424d-af84-46c90b2bd9a9	9a291949-a3fa-415b-85fe-de919a3e0e7a	Left event	2025-02-07 06:37:22.016
75a3e6e6-1a0f-4b52-8e0f-1557fb1ca7fb	9a291949-a3fa-415b-85fe-de919a3e0e7a	Joined event	2025-02-07 06:37:32.328
d062f8c6-9e96-4b5b-886d-d657b126553c	9a291949-a3fa-415b-85fe-de919a3e0e7a	Left event	2025-02-07 06:37:33.533
bee25250-6345-484e-bbbd-2b2d6550b8ec	9a291949-a3fa-415b-85fe-de919a3e0e7a	Blog post bookmarked	2025-02-07 06:39:57.632
386a28cd-3f57-46aa-a27b-4d5bf8d2b730	9a291949-a3fa-415b-85fe-de919a3e0e7a	Blog post bookmarked	2025-02-07 06:40:00.031
a947b997-6130-4a5a-a59f-ce83c28476f9	9a291949-a3fa-415b-85fe-de919a3e0e7a	Blog post bookmarked	2025-02-07 06:40:10.148
85ac9021-f3e9-43ad-a56e-002bfa005372	9a291949-a3fa-415b-85fe-de919a3e0e7a	Blog post bookmarked	2025-02-07 06:43:24.541
6aa5c791-70a1-493f-a900-4a8765508db6	9a291949-a3fa-415b-85fe-de919a3e0e7a	Blog post bookmarked	2025-02-07 06:45:16.308
6e52d343-e5d4-49d8-acbf-a400e2ec34e0	9a291949-a3fa-415b-85fe-de919a3e0e7a	Blog post bookmarked	2025-02-07 06:47:24.297
73138dd2-7506-4926-9325-a7effe80c6de	9a291949-a3fa-415b-85fe-de919a3e0e7a	Blog post bookmarked	2025-02-07 06:48:22.755
e710b421-952e-410d-83af-0fd92ae6eb43	9a291949-a3fa-415b-85fe-de919a3e0e7a	Blog post bookmarked	2025-02-07 06:51:40.493
fb5a82b8-9fa2-4f15-bd73-3bb53a132dca	9a291949-a3fa-415b-85fe-de919a3e0e7a	Blog post bookmarked	2025-02-07 06:51:42.565
61f489bd-5848-405e-aa45-04689342f642	9a291949-a3fa-415b-85fe-de919a3e0e7a	Blog post bookmarked	2025-02-07 06:51:54.866
6ae30f8a-9f69-4279-b26e-5c9702295fd8	9a291949-a3fa-415b-85fe-de919a3e0e7a	Blog post bookmarked	2025-02-07 06:51:56.664
96b6a4f5-67a4-4fb2-b06e-77cd4eb60482	9a291949-a3fa-415b-85fe-de919a3e0e7a	Blog post bookmarked	2025-02-07 06:56:54.104
55e91d0d-7eb7-4062-b6d0-b1269894fd25	9a291949-a3fa-415b-85fe-de919a3e0e7a	Blog post bookmarked	2025-02-07 06:57:05.397
39f7f78b-67d0-4aad-b07e-f49638dcb1b5	9a291949-a3fa-415b-85fe-de919a3e0e7a	Blog post bookmarked	2025-02-07 06:57:07.646
90d89b3e-f23a-4306-a0fe-24177f9cd2fe	9a291949-a3fa-415b-85fe-de919a3e0e7a	Blog post bookmarked	2025-02-07 06:57:12.371
67208bbc-2a69-424e-9c16-028668631b18	9a291949-a3fa-415b-85fe-de919a3e0e7a	Blog post bookmarked	2025-02-07 06:58:51.678
51e4a045-5e58-454d-aa68-deaa3a321edc	9a291949-a3fa-415b-85fe-de919a3e0e7a	Blog post bookmarked	2025-02-07 06:59:42.596
a9218eff-73eb-49bd-873c-b0244aabb42d	9a291949-a3fa-415b-85fe-de919a3e0e7a	Blog post bookmarked	2025-02-07 07:01:29.037
5900adb9-2bc6-4454-b226-4b342e3293eb	9a291949-a3fa-415b-85fe-de919a3e0e7a	Blog post bookmarked	2025-02-07 07:01:37.632
a7b6b1a4-05ef-49af-afab-676d5accd429	9a291949-a3fa-415b-85fe-de919a3e0e7a	Blog post bookmarked	2025-02-07 07:01:58.88
892bfb81-03b6-4cbf-accf-194ee3750c81	9a291949-a3fa-415b-85fe-de919a3e0e7a	Blog post bookmarked	2025-02-07 07:09:14.012
ab288bf4-a8e6-4e11-9604-7869b50c6385	9a291949-a3fa-415b-85fe-de919a3e0e7a	Blog post bookmarked	2025-02-07 07:11:08.056
c816649a-7f17-422e-a476-74da3c797af4	9a291949-a3fa-415b-85fe-de919a3e0e7a	Blog post bookmarked	2025-02-07 07:14:22.323
5692809a-94e0-4be4-aa2f-8410f5d64bc5	9a291949-a3fa-415b-85fe-de919a3e0e7a	Blog post bookmarked	2025-02-07 07:14:36.058
c9729270-71cc-4a7d-b3dd-ae9ec4e568c0	3765435b-b0cb-40ef-9c3a-8c67c56a2497	New user registered: test test	2025-02-07 07:44:25.042
291c0f6e-09bb-4636-ad8e-42cb521e3ce2	3765435b-b0cb-40ef-9c3a-8c67c56a2497	Joined event	2025-02-07 07:44:47.47
dd93523a-ee53-4ad8-beaa-6cb838a661a1	3765435b-b0cb-40ef-9c3a-8c67c56a2497	Event bookmarked	2025-02-07 07:44:51.955
30e83c21-4073-4a40-91a5-441f6340ba56	3765435b-b0cb-40ef-9c3a-8c67c56a2497	Event bookmarked	2025-02-07 07:45:01.772
fe448bd3-b29f-4f5a-a6be-b50f5d85e9d8	3765435b-b0cb-40ef-9c3a-8c67c56a2497	Blog post bookmarked	2025-02-07 07:45:29.202
861a9cd6-7b0b-4e08-81a0-31f1cdf40142	3765435b-b0cb-40ef-9c3a-8c67c56a2497	User profile updated: test1 test1	2025-02-07 07:45:43.838
fae97588-b9db-4467-95ca-cbbb2b49860d	c108388f-b3a2-4c3a-8d0c-014e4a42568f	User profile updated: seif seif	2025-02-07 07:46:27.167
5a68e0bc-9363-4ee1-82b5-7b2c21c2ac6a	7b50a17c-6a48-4188-b14e-c9c6287ed621	Event updated: Campus Vibes: Music & Chill	2025-02-07 07:46:44.986
90615c2f-4d04-41f7-b85c-279f1b7effb9	7b50a17c-6a48-4188-b14e-c9c6287ed621	Event updated: Campus Vibes: Music & Chill	2025-02-07 07:46:47.164
07c7df24-98cd-47db-95da-e4b2fe49a7f9	7b50a17c-6a48-4188-b14e-c9c6287ed621	Event created: test	2025-02-07 07:47:26.277
b569be5d-f325-422a-b370-eac98878bebd	7b50a17c-6a48-4188-b14e-c9c6287ed621	New blog post updated: 'test'	2025-02-07 07:48:08.97
02a1452b-0f4e-4f3e-bae5-118c5e9a64dc	9ac4fa15-821f-4681-8f77-014e5d426184	New user registered: test test	2025-02-07 07:49:34.307
0bbf4ae5-17b3-4a9d-a3a5-e49fa2c54cd2	c108388f-b3a2-4c3a-8d0c-014e4a42568f	User profile updated: seif seif	2025-02-07 07:49:41.149
\.


--
-- Data for Name: UsersOnEvents; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."UsersOnEvents" ("userId", "eventId", "joinedAt") FROM stdin;
c108388f-b3a2-4c3a-8d0c-014e4a42568f	28829281-25b4-44ef-b9c3-2b52801ea2a5	2025-02-06 09:30:30.537
c108388f-b3a2-4c3a-8d0c-014e4a42568f	f25cb54a-6943-48fd-8930-6e2ddeefd9a6	2025-02-06 09:30:32.722
b58c3611-521c-4ff4-9aea-ba47ec06bd24	28829281-25b4-44ef-b9c3-2b52801ea2a5	2025-02-06 11:00:32.404
3765435b-b0cb-40ef-9c3a-8c67c56a2497	1a35895e-6cd2-49d5-8086-5be3cc3c2388	2025-02-07 07:44:47.48
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
e0392334-bf8b-49ab-976d-0289e2b9bacd	1852048368796cd0a05f3439365e668bdb7073003e1a9c6467c5f46ea7b2b628	2025-02-06 02:58:36.376749+00	20250205013332_update_schema	\N	\N	2025-02-06 02:58:36.355124+00	1
60629607-4002-4ce4-b049-d2d74d10db66	3764c9e09cc10353a8b759a5ad04d47edba036f9d8cb43701fc315cd843ede19	2025-02-06 02:59:45.866573+00	20250206025945_fresh_migration	\N	\N	2025-02-06 02:59:45.858339+00	1
\.


--
-- Name: Blog Blog_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Blog"
    ADD CONSTRAINT "Blog_pkey" PRIMARY KEY (id);


--
-- Name: Bookmark Bookmark_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Bookmark"
    ADD CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("userId", "blogId");


--
-- Name: City City_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."City"
    ADD CONSTRAINT "City_pkey" PRIMARY KEY (id);


--
-- Name: EventBookmark EventBookmark_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EventBookmark"
    ADD CONSTRAINT "EventBookmark_pkey" PRIMARY KEY ("userId", "eventId");


--
-- Name: Event Event_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_pkey" PRIMARY KEY (id);


--
-- Name: University University_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."University"
    ADD CONSTRAINT "University_pkey" PRIMARY KEY (id);


--
-- Name: UserActivity UserActivity_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserActivity"
    ADD CONSTRAINT "UserActivity_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: UsersOnEvents UsersOnEvents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UsersOnEvents"
    ADD CONSTRAINT "UsersOnEvents_pkey" PRIMARY KEY ("userId", "eventId");


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Bookmark Bookmark_blogId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Bookmark"
    ADD CONSTRAINT "Bookmark_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES public."Blog"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Bookmark Bookmark_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Bookmark"
    ADD CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: EventBookmark EventBookmark_eventId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EventBookmark"
    ADD CONSTRAINT "EventBookmark_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES public."Event"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: EventBookmark EventBookmark_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EventBookmark"
    ADD CONSTRAINT "EventBookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserActivity UserActivity_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserActivity"
    ADD CONSTRAINT "UserActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: User User_cityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES public."City"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: User User_universityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES public."University"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: UsersOnEvents UsersOnEvents_eventId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UsersOnEvents"
    ADD CONSTRAINT "UsersOnEvents_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES public."Event"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UsersOnEvents UsersOnEvents_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UsersOnEvents"
    ADD CONSTRAINT "UsersOnEvents_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

