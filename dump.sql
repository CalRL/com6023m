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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bookmarks; Type: TABLE; Schema: public; Owner: callumburnsoregan
--

CREATE TABLE public.bookmarks (
    id integer NOT NULL,
    post_id integer,
    profile_id integer,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.bookmarks OWNER TO callumburnsoregan;

--
-- Name: bookmarks_id_seq; Type: SEQUENCE; Schema: public; Owner: callumburnsoregan
--

CREATE SEQUENCE public.bookmarks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bookmarks_id_seq OWNER TO callumburnsoregan;

--
-- Name: bookmarks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: callumburnsoregan
--

ALTER SEQUENCE public.bookmarks_id_seq OWNED BY public.bookmarks.id;


--
-- Name: likes; Type: TABLE; Schema: public; Owner: callumburnsoregan
--

CREATE TABLE public.likes (
    id integer NOT NULL,
    post_id integer,
    profile_id integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.likes OWNER TO callumburnsoregan;

--
-- Name: likes_id_seq; Type: SEQUENCE; Schema: public; Owner: callumburnsoregan
--

CREATE SEQUENCE public.likes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.likes_id_seq OWNER TO callumburnsoregan;

--
-- Name: likes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: callumburnsoregan
--

ALTER SEQUENCE public.likes_id_seq OWNED BY public.likes.id;


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: callumburnsoregan
--

CREATE TABLE public.permissions (
    user_id integer,
    permissions text[] DEFAULT ARRAY[]::text[]
);


ALTER TABLE public.permissions OWNER TO callumburnsoregan;

--
-- Name: posts; Type: TABLE; Schema: public; Owner: callumburnsoregan
--

CREATE TABLE public.posts (
    id integer NOT NULL,
    profile_id integer NOT NULL,
    parent_id integer,
    content text NOT NULL,
    media_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    like_count integer DEFAULT 0,
    bookmark_count integer DEFAULT 0
);


ALTER TABLE public.posts OWNER TO callumburnsoregan;

--
-- Name: posts_id_seq; Type: SEQUENCE; Schema: public; Owner: callumburnsoregan
--

CREATE SEQUENCE public.posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.posts_id_seq OWNER TO callumburnsoregan;

--
-- Name: posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: callumburnsoregan
--

ALTER SEQUENCE public.posts_id_seq OWNED BY public.posts.id;


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: callumburnsoregan
--

CREATE TABLE public.profiles (
    id integer NOT NULL,
    display_name text NOT NULL,
    avatar_url text,
    location text,
    bio text,
    website text,
    joined_at timestamp with time zone DEFAULT now(),
    is_private boolean DEFAULT false,
    cover_image_url text
);


ALTER TABLE public.profiles OWNER TO callumburnsoregan;

--
-- Name: profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: callumburnsoregan
--

CREATE SEQUENCE public.profiles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.profiles_id_seq OWNER TO callumburnsoregan;

--
-- Name: profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: callumburnsoregan
--

ALTER SEQUENCE public.profiles_id_seq OWNED BY public.profiles.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: callumburnsoregan
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email text NOT NULL,
    username text NOT NULL,
    password_hash text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    first_name text DEFAULT 'Not Specified'::text NOT NULL,
    last_name text DEFAULT 'Not Specified'::text NOT NULL,
    phone_ext numeric DEFAULT '0'::numeric NOT NULL,
    phone_number text DEFAULT 'Not Specified'::text NOT NULL,
    birthday date DEFAULT CURRENT_DATE NOT NULL
);


ALTER TABLE public.users OWNER TO callumburnsoregan;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: callumburnsoregan
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO callumburnsoregan;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: callumburnsoregan
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: bookmarks id; Type: DEFAULT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.bookmarks ALTER COLUMN id SET DEFAULT nextval('public.bookmarks_id_seq'::regclass);


--
-- Name: likes id; Type: DEFAULT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.likes ALTER COLUMN id SET DEFAULT nextval('public.likes_id_seq'::regclass);


--
-- Name: posts id; Type: DEFAULT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public.posts_id_seq'::regclass);


--
-- Name: profiles id; Type: DEFAULT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.profiles ALTER COLUMN id SET DEFAULT nextval('public.profiles_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: bookmarks; Type: TABLE DATA; Schema: public; Owner: callumburnsoregan
--

COPY public.bookmarks (id, post_id, profile_id, created_at) FROM stdin;
31	33	198	2025-05-27 15:24:58.736688+00
32	32	198	2025-05-27 20:49:55.99833+00
33	60	199	2025-05-27 22:34:36.088075+00
34	58	199	2025-05-27 22:34:36.87819+00
35	56	199	2025-05-27 22:56:50.937045+00
36	55	199	2025-05-27 22:56:51.482479+00
39	70	199	2025-05-27 23:25:05.734656+00
41	66	201	2025-05-27 23:31:29.825062+00
42	72	201	2025-05-27 23:50:48.363938+00
44	66	203	2025-05-28 02:43:22.485344+00
45	61	203	2025-05-28 02:43:23.075461+00
46	60	203	2025-05-28 02:43:23.484876+00
47	58	203	2025-05-28 02:43:24.261348+00
48	57	203	2025-05-28 02:43:24.695185+00
49	72	203	2025-05-28 02:51:27.953087+00
50	55	203	2025-05-28 02:51:29.007568+00
51	54	203	2025-05-28 02:51:29.457823+00
60	78	208	2025-05-28 06:25:43.957382+00
\.


--
-- Data for Name: likes; Type: TABLE DATA; Schema: public; Owner: callumburnsoregan
--

COPY public.likes (id, post_id, profile_id, created_at) FROM stdin;
34	35	198	2025-05-28 00:15:05.969852+00
35	33	198	2025-05-28 00:15:05.969852+00
36	32	198	2025-05-28 00:15:05.969852+00
37	61	199	2025-05-28 00:15:05.969852+00
38	57	199	2025-05-28 00:15:05.969852+00
49	58	199	2025-05-28 00:15:05.969852+00
50	60	199	2025-05-28 00:15:05.969852+00
51	56	199	2025-05-28 00:15:05.969852+00
52	62	199	2025-05-28 00:15:05.969852+00
54	63	199	2025-05-28 00:15:05.969852+00
56	66	199	2025-05-28 00:15:05.969852+00
57	70	199	2025-05-28 00:15:05.969852+00
59	72	201	2025-05-28 00:15:05.969852+00
60	66	201	2025-05-28 00:15:05.969852+00
63	66	203	2025-05-28 02:51:21.887694+00
64	61	203	2025-05-28 02:51:22.274181+00
65	60	203	2025-05-28 02:51:22.754279+00
66	58	203	2025-05-28 02:51:23.183164+00
73	78	208	2025-05-28 06:25:43.214316+00
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: callumburnsoregan
--

COPY public.permissions (user_id, permissions) FROM stdin;
195	{SELF_READ,SELF_UPDATE,READ_OTHER,CREATE_POST,CREATE_COMMENT,LIKE_POST,LIKE_COMMENT,DELETE_SELF,READ_OTHER}
198	{SELF_READ,SELF_UPDATE,READ_OTHER,CREATE_POST,CREATE_COMMENT,LIKE_POST,LIKE_COMMENT,DELETE_SELF,READ_OTHER,READ_POST}
199	{SELF_READ,SELF_UPDATE,READ_OTHER,CREATE_POST,CREATE_COMMENT,LIKE_POST,LIKE_COMMENT,DELETE_SELF,READ_OTHER,READ_POST}
201	{SELF_READ,SELF_UPDATE,READ_OTHER,CREATE_POST,CREATE_COMMENT,LIKE_POST,LIKE_COMMENT,DELETE_SELF,READ_OTHER,READ_POST}
202	{SELF_READ,SELF_UPDATE,READ_OTHER,CREATE_POST,CREATE_COMMENT,LIKE_POST,LIKE_COMMENT,DELETE_SELF,DELETE_POST,READ_OTHER,READ_POST}
203	{SELF_READ,SELF_UPDATE,READ_OTHER,CREATE_POST,CREATE_COMMENT,LIKE_POST,LIKE_COMMENT,DELETE_SELF,DELETE_POST,READ_OTHER,READ_POST,ADMIN}
208	{SELF_READ,SELF_UPDATE,READ_OTHER,CREATE_POST,CREATE_COMMENT,LIKE_POST,LIKE_COMMENT,DELETE_SELF,DELETE_POST,READ_OTHER,READ_POST}
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: callumburnsoregan
--

COPY public.posts (id, profile_id, parent_id, content, media_url, created_at, like_count, bookmark_count) FROM stdin;
78	208	\N	hello	\N	2025-05-28 06:25:39.750721+00	1	1
68	199	67	test	\N	2025-05-27 23:15:12.851989+00	0	0
45	198	\N	test	\N	2025-05-27 19:54:58.574252+00	0	0
46	198	\N	testrr	\N	2025-05-27 19:56:21.015208+00	0	0
47	198	\N	try	\N	2025-05-27 19:56:39.449765+00	0	0
48	198	\N	try2	\N	2025-05-27 20:00:16.13034+00	0	0
49	198	\N	test	\N	2025-05-27 20:02:26.910759+00	0	0
50	198	\N	test	\N	2025-05-27 20:02:30.272263+00	0	0
51	198	\N	test23	\N	2025-05-27 20:03:32.731729+00	0	0
52	198	\N	test	\N	2025-05-27 20:06:41.703664+00	0	0
53	198	\N	test	\N	2025-05-27 20:06:47.715205+00	0	0
59	198	58	test	\N	2025-05-27 20:24:05.076111+00	0	0
32	195	\N	Test	\N	2025-05-27 14:48:25.630458+00	1	1
56	198	\N	hello3	\N	2025-05-27 20:10:55.055471+00	1	1
62	199	55	test	\N	2025-05-27 22:56:58.99356+00	1	0
63	199	60	test	\N	2025-05-27 23:00:04.021473+00	1	0
64	199	63	test	\N	2025-05-27 23:00:23.105731+00	0	0
65	199	63	test	\N	2025-05-27 23:01:54.393401+00	0	0
67	199	57	test	\N	2025-05-27 23:06:44.064675+00	0	0
69	199	67	tesfdsfds	\N	2025-05-27 23:15:20.456846+00	0	0
70	199	66	test	\N	2025-05-27 23:19:47.704723+00	1	1
71	199	70	test	\N	2025-05-27 23:25:07.447451+00	0	0
34	198	32	ers	\N	2025-05-27 15:11:55.388477+00	0	0
57	198	\N	test	\N	2025-05-27 20:23:54.433919+00	1	1
36	198	34	test	\N	2025-05-27 15:14:18.303701+00	0	0
37	198	33	hello2	\N	2025-05-27 15:15:24.678708+00	0	0
38	198	33	test	\N	2025-05-27 15:15:54.341293+00	0	0
35	198	33	hello	\N	2025-05-27 15:14:09.222579+00	1	0
33	198	\N	test	\N	2025-05-27 14:58:52.3743+00	1	1
39	198	\N	test	\N	2025-05-27 19:39:29.836956+00	0	0
40	198	\N	fdsfdsfd	\N	2025-05-27 19:39:35.248515+00	0	0
41	198	\N	tes	\N	2025-05-27 19:40:35.941283+00	0	0
42	198	\N	test	\N	2025-05-27 19:44:54.088863+00	0	0
43	198	\N	refreshtest	\N	2025-05-27 19:45:16.2628+00	0	0
44	198	\N	tester	\N	2025-05-27 19:47:19.715371+00	0	0
55	198	\N	hello2\n	\N	2025-05-27 20:10:22.436854+00	0	2
54	198	\N	hello\n	\N	2025-05-27 20:10:16.77842+00	0	1
66	199	\N	test321321	\N	2025-05-27 23:02:49.626199+00	3	2
61	198	\N	test	\N	2025-05-27 20:49:59.839197+00	2	1
60	198	\N	test	\N	2025-05-27 20:45:05.660691+00	2	2
58	198	\N	test21	\N	2025-05-27 20:24:01.048493+00	2	2
72	201	\N	message	\N	2025-05-27 23:28:54.758797+00	1	2
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: callumburnsoregan
--

COPY public.profiles (id, display_name, avatar_url, location, bio, website, joined_at, is_private, cover_image_url) FROM stdin;
195	callum	https://cdn.discordapp.com/avatars/242276511028084738/66b26bbc03c85fa6659b6ae21c8ff485.png?size=4096				2025-05-27 14:43:59.906617+00	f	https://cdn.pixabay.com/photo/2015/04/23/22/00/new-year-background-736885_1280.jpg
199	cal	\N	\N	\N	\N	2025-05-27 15:03:46.711567+00	f	\N
198	testser					2025-05-27 14:58:39.403094+00	f	
201	testuser123	\N	\N	\N	\N	2025-05-27 23:27:33.088145+00	f	\N
202	testuser321	https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?cs=srgb&dl=pexels-souvenirpixels-414612.jpg&fm=jpg	York	hello!	cal.ceo	2025-05-28 00:03:42.97546+00	f	https://media.istockphoto.com/id/1419410282/photo/silent-forest-in-spring-with-beautiful-bright-sun-rays.jpg?s=612x612&w=0&k=20&c=UHeb1pGOw6ozr6utsenXHhV19vW6oiPIxDqhKCS2Llk=
203	adminuser123	\N	Saturn	New bio	\N	2025-05-28 00:21:24.573228+00	f	\N
208	testuser1234	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJxo2NFiYcR35GzCk5T3nxA7rGlSsXvIfJwg&s	York	bio!	cal.ceo	2025-05-28 06:25:32.558964+00	f	https://media.istockphoto.com/id/1419410282/photo/silent-forest-in-spring-with-beautiful-bright-sun-rays.jpg?s=612x612&w=0&k=20&c=UHeb1pGOw6ozr6utsenXHhV19vW6oiPIxDqhKCS2Llk=
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: callumburnsoregan
--

COPY public.users (id, email, username, password_hash, created_at, first_name, last_name, phone_ext, phone_number, birthday) FROM stdin;
208	testuser1234@gmail.com	testuser1234	bPj81zfiBLjvzvbMOmjl5g==:b+71RiQ+4+R6+8RNDCleDljKgf4HXWRmW0+p/335w7Pu/+6errkBLxd+U7BxojSR01y4XYubdRW+M4MnQoCGCg==	2025-05-28 06:25:32.553561+00	Not Specified	Not Specified	0	Not Specified	2025-05-28
999	test@example.com	test	hashedpassword123	2025-05-26 21:48:39.532543+00	Not Specified	Not Specified	0	Not Specified	2025-05-26
195	callum@admin.com	callum	hwTbD8QcZrNBFbWE15zdBg==:biiUhRr4yoviqCqgO1Qjw/9EmkEkwens8N4sp47Jk6aP4llwcS1CRbCtyZE8163Doqa6Oitc/11fnJXzBrYK6A==	2025-05-27 14:43:59.901519+00	Not Specified	Not Specified	0	Not Specified	2025-05-27
198	testuser@c.com	testser	ITieGWLH66hhEwk3btQA0g==:F8u1yqVFal18k9YhzoZ7j2CfX617q6GowXed7Jn+WhryGsRGFuvWBTyX9/u5aUK0gE0g/nwDEYdh35vBxqfjfA==	2025-05-27 14:58:39.399449+00	Not Specified	Not Specified	0	Not Specified	2025-05-27
199	callumburnsoregan@gmail.com	cal	GHS3FmlbVV4uvZ+uF/r2jQ==:z+8csZ2SXKnAHK1q5rm4RVUHo95pomQ0HntKDb74hDuyhVIsl7tfFXkErgKpCI70wwVP8OioM6YIR9+T16scuw==	2025-05-27 15:03:46.708101+00	Not Specified	Not Specified	0	Not Specified	2025-05-27
201	testuser123@gmail.com	testuser123	CZgpL1ecd4Hbj9NdyK8NjQ==:LoVrjUkbtLKH43zjCn/Ti+esBL4L/qeTJX3LTsV4xJzVZLbvPISNoGIgE/uGu6u2ff31Mdjg1NLY3Mruik1kPw==	2025-05-27 23:27:33.082883+00	Not Specified	Not Specified	0	Not Specified	2025-05-27
202	testuser321@gmail.com	testuser321	1IoyKanepezdfr7ZM8jVRA==:2y0zQHS2ZIJYmZg8ay368yRuXwnpgyL386AEkcEklV5Lp54cIDt5l1IpXZ1Slz58FkqU/Av60Udjr8PdndIEPQ==	2025-05-28 00:03:42.96967+00	Not Specified	Not Specified	0	Not Specified	2025-05-28
203	adminuser123@gmail.com	adminuser123	/N7JQDqeLQGdLBxnzlHAQA==:Axo1tmpGSk35Ydvfd1Ji4WCG9lnwVdMMObjix4tXFQKtE8hpQl4GKyHG/mW+Ysf6ZCZIbML74HTFAQ2b/y17dw==	2025-05-28 00:21:24.568146+00	Callum	Burns-O'Regan	44	07923444574	2004-08-17
\.


--
-- Name: bookmarks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: callumburnsoregan
--

SELECT pg_catalog.setval('public.bookmarks_id_seq', 60, true);


--
-- Name: likes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: callumburnsoregan
--

SELECT pg_catalog.setval('public.likes_id_seq', 73, true);


--
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: callumburnsoregan
--

SELECT pg_catalog.setval('public.posts_id_seq', 79, true);


--
-- Name: profiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: callumburnsoregan
--

SELECT pg_catalog.setval('public.profiles_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: callumburnsoregan
--

SELECT pg_catalog.setval('public.users_id_seq', 208, true);


--
-- Name: bookmarks bookmarks_pkey; Type: CONSTRAINT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_pkey PRIMARY KEY (id);


--
-- Name: bookmarks bookmarks_post_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_post_id_user_id_key UNIQUE (post_id, profile_id);


--
-- Name: likes likes_pkey; Type: CONSTRAINT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_user_id_key; Type: CONSTRAINT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_user_id_key UNIQUE (user_id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: likes unique_profile_post_like; Type: CONSTRAINT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT unique_profile_post_like UNIQUE (profile_id, post_id);


--
-- Name: bookmarks unique_user_post; Type: CONSTRAINT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT unique_user_post UNIQUE (profile_id, post_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: bookmarks bookmarks_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: bookmarks bookmarks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_user_id_fkey FOREIGN KEY (profile_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: likes likes_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: likes likes_profile_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: permissions permissions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: posts posts_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.posts(id) ON DELETE SET NULL;


--
-- Name: posts posts_profile_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

